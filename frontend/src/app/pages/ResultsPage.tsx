import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Upload, Trophy, Star, X, ZoomIn, Camera,
  Search, Filter, CheckCircle2
} from "lucide-react";

import api from "../../lib/api";

const IMG_GRAD1 = "https://images.unsplash.com/photo-1659080907377-ee6a57fb6b9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYWNoaWV2ZW1lbnQlMjBzdWNjZXNzJTIwZ3JhZHVhdGlvbiUyMHRyb3BoeXxlbnwxfHx8fDE3ODA3MzAyOTB8MA&ixlib=rb-4.1.0&q=80&w=600";
const IMG_GRAD2 = "https://images.unsplash.com/photo-1659080910666-68793fa5d2a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzdHVkZW50JTIwYWNoaWV2ZW1lbnQlMjBzdWNjZXNzJTIwZ3JhZHVhdGlvbiUyMHRyb3BoeXxlbnwxfHx8fDE3ODA3MzAyOTB8MA&ixlib=rb-4.1.0&q=80&w=600";

type StudentResult = {
  id: string | number;
  name: string;
  score: string;
  percentage: number;
  board: string;
  classYear: string;
  subject: string;
  rank: string;
  year: number;
  avatar: string;
  photo?: string;
  isUploaded?: boolean;
};

const avatarColors = [
  "bg-blue-500", "bg-orange-500", "bg-green-500",
  "bg-purple-500", "bg-pink-500", "bg-teal-500",
  "bg-red-500", "bg-yellow-500", "bg-cyan-500",
];

function ResultCard({ result, onPhotoClick, onUpload, color }: {
  result: StudentResult;
  onPhotoClick: (r: StudentResult) => void;
  onUpload: (id: number, file: File) => void;
  color: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      {/* Photo Area */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {result.photo ? (
          <>
            <img src={result.photo} alt={result.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <button
              onClick={() => onPhotoClick(result)}
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ZoomIn className="w-5 h-5 text-white" />
              </div>
            </button>
            {result.isUploaded && (
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Added
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center text-white font-black text-2xl`}>
              {result.avatar}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-500 transition-colors border border-dashed border-gray-300 hover:border-indigo-400 px-3 py-1.5 rounded-full"
            >
              <Camera className="w-3.5 h-3.5" /> Add Photo
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(result.id, f); }} />
          </div>
        )}
        {/* Rank Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs px-2.5 py-1 bg-orange-500 text-white rounded-full font-bold shadow-md">{result.rank}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{result.name}</h3>
            <p className="text-gray-400 text-xs">{result.classYear} · {result.subject}</p>
          </div>
          <div className="text-right">
            <div className="font-black text-green-600">{result.score}</div>
            <div className="text-gray-400 text-xs">{result.year}</div>
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{result.board}</span>
      </div>
    </motion.div>
  );
}

export function ResultsPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<StudentResult | null>(null);
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("All");
  const [filterBoard, setFilterBoard] = useState("All");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", score: "", board: "MP Board", classYear: "Class 10th", subject: "", rank: "", year: "2024" });
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const response = await api.get('/content/success-stories/');
        const data = response.data.results || response.data;
        
        const mapped = data.map((item: any) => ({
          id: item.id,
          name: item.student_name,
          score: item.rank_or_score,
          percentage: parseFloat(item.rank_or_score) || 90,
          board: item.exam,
          classYear: "",
          subject: item.exam,
          rank: "Ranked",
          year: parseInt(item.year) || new Date().getFullYear(),
          avatar: item.student_name.charAt(0).toUpperCase(),
          photo: item.image,
        }));
        
        setResults(mapped);
      } catch (error) {
        console.error("Failed to fetch success stories", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, []);

  const handlePhotoUpload = useCallback((id: number, file: File) => {
    const url = URL.createObjectURL(file);
    setResults((prev) => prev.map((r) => r.id === id ? { ...r, photo: url, isUploaded: true } : r));
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setNewPhoto(URL.createObjectURL(file));
    }
  };

  const handleNewPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNewPhoto(URL.createObjectURL(file));
  };

  const handleAddResult = () => {
    const next: StudentResult = {
      id: Date.now(),
      name: newStudent.name || "Student Name",
      score: newStudent.score || "90%",
      percentage: parseFloat(newStudent.score) || 90,
      board: newStudent.board,
      classYear: newStudent.classYear,
      subject: newStudent.subject || "All Subjects",
      rank: newStudent.rank || "School Topper",
      year: parseInt(newStudent.year),
      avatar: (newStudent.name[0] || "S").toUpperCase(),
      photo: newPhoto || undefined,
      isUploaded: !!newPhoto,
    };
    setResults((prev) => [next, ...prev]);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setShowUploadForm(false);
      setNewStudent({ name: "", score: "", board: "MP Board", classYear: "Class 10th", subject: "", rank: "", year: "2024" });
      setNewPhoto(null);
    }, 2000);
  };

  const years = ["All", "2024", "2023", "2022"];
  const boards = ["All", "MP Board", "CBSE", "ICSE"];

  const filtered = results.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase());
    const matchesYear = filterYear === "All" || r.year === parseInt(filterYear);
    const matchesBoard = filterBoard === "All" || r.board === filterBoard;
    return matchesSearch && matchesYear && matchesBoard;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative pt-32 pb-16 bg-gradient-to-br from-yellow-600 via-orange-600 to-red-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 60%, white 0%, transparent 50%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black mb-4">
            🏆 Results & Toppers
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/80 text-xl max-w-2xl mb-8">
            Celebrating our achievers — students who made us proud with their outstanding board exam results.
          </motion.p>
          <div className="flex flex-wrap gap-4">
            {[
              { v: "5000+", l: "Students Coached" },
              { v: "150+", l: "Board Toppers" },
              { v: "98%", l: "Pass Rate" },
              { v: "40%+", l: "Avg Score Boost" },
            ].map(({ v, l }) => (
              <div key={l} className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
                <div className="font-black text-2xl">{v}</div>
                <div className="text-white/70 text-xs">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowUploadForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg"
          >
            <Upload className="w-4 h-4" /> Add Student Result
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-8 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-48 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or subject..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            {years.map((y) => (
              <button key={y} onClick={() => setFilterYear(y)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filterYear === y ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{y}</button>
            ))}
            <div className="w-px h-5 bg-gray-200" />
            {boards.map((b) => (
              <button key={b} onClick={() => setFilterBoard(b)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filterBoard === b ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{b}</button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-500 text-sm mb-6">{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((r, i) => (
              <ResultCard
                key={r.id}
                result={r}
                onPhotoClick={setSelected}
                onUpload={(id: any, file: any) => handlePhotoUpload(id as number, file)}
                color={avatarColors[i % avatarColors.length]}
              />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No results found</p>
            <p className="text-sm mt-1">Try changing your search or filters</p>
          </div>
        )}
      </div>

      {/* Add Result Modal */}
      <AnimatePresence>
        {showUploadForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowUploadForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {uploadSuccess ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-black text-xl text-gray-900 mb-2">Result Added!</h3>
                  <p className="text-gray-500 text-sm">Student result has been added to the gallery.</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-black text-xl text-gray-900">Add Student Result</h2>
                    <button onClick={() => setShowUploadForm(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  {/* Photo Upload */}
                  <div
                    ref={dropRef}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-44 rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-400 transition-colors cursor-pointer bg-gray-50 overflow-hidden mb-6 flex items-center justify-center"
                  >
                    {newPhoto ? (
                      <>
                        <img src={newPhoto} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">Click to change</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-400">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">Drop student photo here or click to upload</p>
                        <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleNewPhotoSelect} />
                  </div>

                  {/* Form */}
                  <div className="space-y-3">
                    <input
                      value={newStudent.name}
                      onChange={(e) => setNewStudent((s) => ({ ...s, name: e.target.value }))}
                      placeholder="Student Full Name *"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 text-sm"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={newStudent.score}
                        onChange={(e) => setNewStudent((s) => ({ ...s, score: e.target.value }))}
                        placeholder="Score e.g. 95.2%"
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 text-sm"
                      />
                      <input
                        value={newStudent.rank}
                        onChange={(e) => setNewStudent((s) => ({ ...s, rank: e.target.value }))}
                        placeholder="Rank e.g. District 1st"
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <select value={newStudent.board} onChange={(e) => setNewStudent((s) => ({ ...s, board: e.target.value }))} className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 text-sm">
                        {["MP Board", "CBSE", "ICSE"].map((b) => <option key={b}>{b}</option>)}
                      </select>
                      <select value={newStudent.classYear} onChange={(e) => setNewStudent((s) => ({ ...s, classYear: e.target.value }))} className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 text-sm">
                        {["Class 10th", "Class 11th", "Class 12th"].map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={newStudent.subject}
                        onChange={(e) => setNewStudent((s) => ({ ...s, subject: e.target.value }))}
                        placeholder="Stream/Subject"
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 text-sm"
                      />
                      <select value={newStudent.year} onChange={(e) => setNewStudent((s) => ({ ...s, year: e.target.value }))} className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 text-sm">
                        {["2025", "2024", "2023", "2022"].map((y) => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddResult}
                    disabled={!newStudent.name}
                    className="w-full mt-5 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-5 h-5" /> Add to Results Gallery
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Lightbox */}
      <AnimatePresence>
        {selected && selected.photo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <img src={selected.photo} alt={selected.name} className="w-full object-contain max-h-[70vh]" />
              <div className="bg-black/80 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-black text-white text-xl flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      {selected.name}
                    </div>
                    <div className="text-white/60 text-sm mt-1">{selected.classYear} · {selected.board} · {selected.subject}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-green-400 text-2xl">{selected.score}</div>
                    <div className="text-orange-400 font-bold text-sm">{selected.rank}</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
