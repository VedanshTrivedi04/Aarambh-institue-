import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Plus, AlertCircle, Info, AlertTriangle, Trash2, X } from "lucide-react";
import api from "../../../lib/api";

export function TeacherAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [form, setForm] = useState({
    title: "",
    content: "",
    priority: "normal",
    is_global: false,
    target_batch: "",
  });

  useEffect(() => {
    fetchAnnouncements();
    fetchBatches();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/announcements/');
      setAnnouncements(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to fetch announcements", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await api.get('/academics/batches/');
      setBatches(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to fetch batches", err);
    }
  };

  const handlePost = async () => {
    if (!form.title || !form.content) {
      setError("Title and message are required.");
      return;
    }
    setError("");
    setPosting(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("priority", form.priority);
      formData.append("is_global", form.is_global ? "true" : "false");
      if (form.target_batch && !form.is_global) {
        formData.append("target_batches", form.target_batch);
      }

      await api.post('/announcements/', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowCompose(false);
      setForm({ title: "", content: "", priority: "normal", is_global: false, target_batch: "" });
      fetchAnnouncements();
    } catch (err: any) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to post announcement.");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await api.delete(`/announcements/${id}/`);
      fetchAnnouncements();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === "urgent") return <AlertCircle className="w-4 h-4 text-red-400" />;
    if (priority === "high") return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <Info className="w-4 h-4 text-white/40" />;
  };

  const getPriorityStyle = (priority: string) => {
    if (priority === "urgent") return "bg-red-500/15 text-red-400 border border-red-500/20";
    if (priority === "high") return "bg-amber-500/15 text-amber-400 border border-amber-500/20";
    return "bg-white/10 text-white/70";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Announcements</h1>
          <p className="text-white/50 text-sm">Post updates for your students</p>
        </div>
        <button
          onClick={() => setShowCompose(!showCompose)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)", boxShadow: "0 8px 30px rgba(255,92,0,0.3)" }}
        >
          <Plus className="w-4 h-4" />
          Post New
        </button>
      </div>

      {/* Compose Form */}
      {showCompose && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Create Announcement</h3>
            <button onClick={() => setShowCompose(false)}>
              <X className="w-5 h-5 text-white/50 hover:text-white" />
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Announcement Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/[0.05] border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
            />
            <textarea
              rows={4}
              placeholder="Message *"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-4 py-3 bg-white/[0.05] border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 resize-none"
            ></textarea>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={form.is_global ? "global" : form.target_batch}
                onChange={(e) => {
                  if (e.target.value === "global") {
                    setForm({ ...form, is_global: true, target_batch: "" });
                  } else {
                    setForm({ ...form, is_global: false, target_batch: e.target.value });
                  }
                }}
                className="px-4 py-3 bg-white/[0.05] border border-white/15 rounded-xl text-white focus:outline-none focus:border-orange-500/50 appearance-none"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <option value="" className="bg-gray-900">Select Batch</option>
                <option value="global" className="bg-gray-900">All Students (Global)</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id} className="bg-gray-900">{b.name}</option>
                ))}
              </select>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="px-4 py-3 bg-white/[0.05] border border-white/15 rounded-xl text-white focus:outline-none focus:border-orange-500/50 appearance-none"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <option value="low" className="bg-gray-900">Low Priority</option>
                <option value="normal" className="bg-gray-900">Normal Priority</option>
                <option value="high" className="bg-gray-900">High Priority</option>
                <option value="urgent" className="bg-gray-900">Urgent</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowCompose(false)}
                className="px-5 py-2.5 rounded-xl font-semibold text-white/70 border border-white/15 hover:bg-white/[0.05] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={posting}
                className="px-5 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)" }}
              >
                {posting ? "Posting..." : "Post Announcement"}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-white/50">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 text-white/50 border border-dashed border-white/10 rounded-2xl">
            No announcements yet. Post your first one!
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getPriorityIcon(announcement.priority)}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getPriorityStyle(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                  {announcement.is_global && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/20">
                      Global
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/40 text-sm">{new Date(announcement.created_at).toLocaleDateString()}</span>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="text-white/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{announcement.title}</h3>
              <p className="text-white/70 mb-4 whitespace-pre-wrap">{announcement.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {announcement.target_batches?.map((b: any) => (
                    <span
                      key={b.id || b}
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20"
                    >
                      {b.name || "Batch"}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-white/60">
                  Read receipts: {announcement.read_receipts?.length || 0}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
