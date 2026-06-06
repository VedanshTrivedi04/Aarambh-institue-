import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FileText, Video, File, Download, Check, Search } from "lucide-react";
import api from "../../../lib/api";

export function StudentNotes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchNotes();
    fetchSubjects();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/notes/');
      setNotes(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/academics/subjects/');
      setSubjects(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

  const handleDownload = (noteId: string, fileUrl: string) => {
    if (!fileUrl) return;
    window.open(fileUrl, '_blank');
    setDownloadedIds((prev) => prev.includes(noteId) ? prev : [...prev, noteId]);
  };

  const isNew = (createdAt: string) => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return new Date(createdAt) > threeDaysAgo;
  };

  const getFileIcon = (type: string) => {
    if (type === "pdf") return <FileText className="w-8 h-8 text-red-400" />;
    if (type === "video") return <Video className="w-8 h-8 text-blue-400" />;
    return <File className="w-8 h-8 text-gray-400" />;
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
    const subjectName = note.subject?.name || note.subject || "";
    const matchesSubject = selectedSubject === "all" || subjectName === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black text-white mb-1">Study Notes</h1>
        <p className="text-white/50 text-sm">Access all your study materials</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedSubject("all")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedSubject === "all"
                ? "bg-orange-500 text-white"
                : "bg-white/[0.05] text-white/70 hover:bg-white/[0.08] border border-white/10"
            }`}
          >
            All Subjects
          </button>
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(s.name)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedSubject === s.name
                  ? "bg-orange-500 text-white"
                  : "bg-white/[0.05] text-white/70 hover:bg-white/[0.08] border border-white/10"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-white/50">Loading notes...</div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12 text-white/50 border border-dashed border-white/10 rounded-2xl">
          No notes found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => {
            const isDownloaded = downloadedIds.includes(note.id);
            const subjectName = note.subject?.name || note.subject || "General";
            const uploaderName = note.uploaded_by
              ? `${note.uploaded_by.first_name || ""} ${note.uploaded_by.last_name || ""}`.trim()
              : "Teacher";

            return (
              <motion.div
                key={note.id}
                whileHover={{ y: -4 }}
                className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  {getFileIcon(note.file_type)}
                  <div className="flex flex-col gap-1 items-end">
                    {isNew(note.created_at) && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/20">
                        NEW
                      </span>
                    )}
                    {isDownloaded && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/20 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Downloaded
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-white font-semibold mb-2 line-clamp-2">{note.title}</h3>
                {note.description && (
                  <p className="text-white/50 text-xs mb-2 line-clamp-2">{note.description}</p>
                )}

                <div className="flex gap-2 mb-3 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/20">
                    {subjectName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20 uppercase">
                    {note.file_type}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-xs font-bold">
                    {uploaderName[0] || "T"}
                  </div>
                  <span className="text-white/60 text-sm">By {uploaderName}</span>
                </div>

                <div className="text-white/40 text-xs mb-4">
                  {new Date(note.created_at).toLocaleDateString()}
                </div>

                <button
                  onClick={() => handleDownload(note.id, note.file)}
                  className={`w-full py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    isDownloaded
                      ? "bg-white/[0.05] text-white/50 border border-white/10"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {isDownloaded ? (
                    <>
                      <Check className="w-4 h-4" />
                      View Again
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
