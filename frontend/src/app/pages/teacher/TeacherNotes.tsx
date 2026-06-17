import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Upload, Plus, FileText, Video, File, Trash2, Eye, EyeOff, X } from "lucide-react";
import api from "../../../lib/api";

export function TeacherNotes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Upload form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    batch: "",
    file_type: "pdf",
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchNotes();
    fetchBatchesAndSubjects();
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

  const fetchBatchesAndSubjects = async () => {
    try {
      const [batchRes, subjectRes] = await Promise.allSettled([
        api.get('/academics/batches/'),
        api.get('/academics/subjects/'),
      ]);
      if (batchRes.status === 'fulfilled') {
        setBatches(batchRes.value.data.results || batchRes.value.data || []);
      }
      if (subjectRes.status === 'fulfilled') {
        setSubjects(subjectRes.value.data.results || subjectRes.value.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch batches/subjects", err);
    }
  };

  const handleUpload = async () => {
    if (!form.title || !form.subject || !file) {
      setError("Title, Subject and File are required.");
      return;
    }
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("subject", form.subject);
      formData.append("file_type", form.file_type);
      formData.append("file", file);
      if (form.batch) {
        formData.append("batches", form.batch);
      }

      await api.post('/notes/', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowUploadForm(false);
      setForm({ title: "", description: "", subject: "", batch: "", file_type: "pdf" });
      setFile(null);
      fetchNotes();
    } catch (err: any) {
      console.error("Upload failed", err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleTogglePublish = async (note: any) => {
    try {
      await api.patch(`/notes/${note.id}/`, { is_published: !note.is_published });
      fetchNotes();
    } catch (err) {
      console.error("Failed to toggle publish", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note? This cannot be undone.")) return;
    try {
      await api.delete(`/notes/${id}/`);
      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  const getFileIcon = (type: string) => {
    if (type === "pdf") return <FileText className="w-6 h-6 text-red-400" />;
    if (type === "video") return <Video className="w-6 h-6 text-blue-400" />;
    return <File className="w-6 h-6 text-gray-400" />;
  };

  const filteredNotes = selectedBatch === "all"
    ? notes
    : notes.filter((note) => note.batches?.some((b: any) => (b.id || b) === selectedBatch));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Notes & Study Material</h1>
          <p className="text-white/50 text-sm">Manage and upload study resources</p>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)", boxShadow: "0 8px 30px rgba(255,92,0,0.3)" }}
        >
          <Plus className="w-4 h-4" />
          Upload New
        </button>
      </div>

      {/* Batch Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedBatch("all")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            selectedBatch === "all"
              ? "bg-red-600 text-white"
              : "bg-white/[0.05] text-white/70 hover:bg-white/[0.08] border border-white/10"
          }`}
        >
          All Batches
        </button>
        {batches.map((batch) => (
          <button
            key={batch.id}
            onClick={() => setSelectedBatch(batch.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedBatch === batch.id
                ? "bg-red-600 text-white"
                : "bg-white/[0.05] text-white/70 hover:bg-white/[0.08] border border-white/10"
            }`}
          >
            {batch.name}
          </button>
        ))}
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Upload New Note</h3>
            <button onClick={() => setShowUploadForm(false)}>
              <X className="w-5 h-5 text-white/50 hover:text-white" />
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Note Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-4 py-3 bg-white/[0.05] border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/10"
            />
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="px-4 py-3 bg-white/[0.05] border border-white/15 rounded-xl text-white focus:outline-none focus:border-red-600/50 appearance-none"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <option value="" className="bg-gray-900">Select Subject *</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id} className="bg-gray-900">{s.name}</option>
              ))}
            </select>
            <select
              value={form.batch}
              onChange={(e) => setForm({ ...form, batch: e.target.value })}
              className="px-4 py-3 bg-white/[0.05] border border-white/15 rounded-xl text-white focus:outline-none focus:border-red-600/50 appearance-none"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <option value="" className="bg-gray-900">Select Batch (optional)</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id} className="bg-gray-900">{b.name}</option>
              ))}
            </select>
            <select
              value={form.file_type}
              onChange={(e) => setForm({ ...form, file_type: e.target.value })}
              className="px-4 py-3 bg-white/[0.05] border border-white/15 rounded-xl text-white focus:outline-none focus:border-red-600/50 appearance-none"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <option value="pdf" className="bg-gray-900">PDF</option>
              <option value="video" className="bg-gray-900">Video</option>
              <option value="image" className="bg-gray-900">Image</option>
              <option value="other" className="bg-gray-900">Other</option>
            </select>
          </div>

          <textarea
            rows={2}
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 bg-white/[0.05] border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-600/50 resize-none mb-4"
          />

          <div
            className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center mb-4 cursor-pointer hover:border-red-600/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-white/40 mx-auto mb-3" />
            {file ? (
              <p className="text-white font-semibold">{file.name}</p>
            ) : (
              <>
                <p className="text-white mb-2">Drag & drop file here or <span className="text-red-400">click to browse</span></p>
                <p className="text-white/40 text-sm">Accepts: PDF, DOC, DOCX, PPT, PPTX, MP4 (Max 50MB)</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowUploadForm(false)}
              className="px-5 py-2.5 rounded-xl font-semibold text-white/70 border border-white/15 hover:bg-white/[0.05] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-5 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)" }}
            >
              {uploading ? "Uploading..." : "Upload Notes"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Notes Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-white/50">Loading notes...</div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12 text-white/50 border border-dashed border-white/10 rounded-2xl">
          No notes found. Upload your first note!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              whileHover={{ y: -4 }}
              className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-red-600/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                {getFileIcon(note.file_type)}
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${note.is_published ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-xs text-white/40">{note.is_published ? 'Published' : 'Draft'}</span>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2 line-clamp-2">{note.title}</h3>
              {note.description && (
                <p className="text-white/50 text-xs mb-2 line-clamp-2">{note.description}</p>
              )}
              <div className="flex gap-2 mb-3">
                {note.batches?.slice(0, 1).map((b: any) => (
                  <span key={b.id || b} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/15 text-blue-400 border border-slate-500/20">
                    {b.name || "Batch"}
                  </span>
                ))}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-600/15 text-red-400 border border-red-600/20 uppercase">
                  {note.file_type}
                </span>
              </div>
              <div className="text-white/40 text-xs mb-4">{new Date(note.created_at).toLocaleDateString()}</div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleTogglePublish(note)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-white/70 hover:text-white transition-colors text-xs font-semibold border border-white/15 hover:bg-white/[0.05]"
                >
                  {note.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {note.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-2 rounded-lg text-red-400/70 hover:text-red-400 transition-colors border border-white/15 hover:bg-white/[0.05]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
