import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Upload, Megaphone, BarChart, Users, FileText } from "lucide-react";
import { Link } from "react-router";
import api from "../../../lib/api";

const quickActions = [
  { label: "Upload New Notes", icon: Upload, path: "/teacher/notes", gradient: "from-orange-500 to-red-600" },
  { label: "New Announcement", icon: Megaphone, path: "/teacher/announcements", gradient: "from-blue-500 to-blue-700" },
  { label: "View My Students", icon: BarChart, path: "/teacher/students", gradient: "from-green-500 to-green-700" },
];

export function TeacherDashboard() {
  const [batches, setBatches] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const [batchRes, noteRes, studentsRes, annRes] = await Promise.allSettled([
          api.get('/academics/batches/'),
          api.get('/notes/'),
          api.get('/users/?role=student'),
          api.get('/announcements/'),
        ]);

        if (batchRes.status === 'fulfilled') {
          setBatches(batchRes.value.data.results || batchRes.value.data || []);
        }
        if (noteRes.status === 'fulfilled') {
          setNotes(noteRes.value.data.results || noteRes.value.data || []);
        }
        if (studentsRes.status === 'fulfilled') {
          setStudents(studentsRes.value.data.results || studentsRes.value.data || []);
        }
        if (annRes.status === 'fulfilled') {
          setAnnouncements(annRes.value.data.results || annRes.value.data || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const stats = [
    { label: "My Students", value: isLoading ? "..." : String(students.length), color: "#3B5BDB", icon: Users },
    { label: "Notes Uploaded", value: isLoading ? "..." : String(notes.length), color: "#2F9E44", icon: FileText },
    { label: "My Batches", value: isLoading ? "..." : String(batches.length), color: "#FF5C00", icon: BarChart },
    { label: "Announcements", value: isLoading ? "..." : String(announcements.length), color: "#D4183D", icon: Megaphone },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)` }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-sm text-white/50">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} to={action.path}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-gradient-to-br ${action.gradient} rounded-2xl p-6 cursor-pointer shadow-lg`}
                >
                  <Icon className="w-8 h-8 text-white mb-3" />
                  <div className="text-white font-bold text-lg">{action.label}</div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* My Batches */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">My Batches</h2>
        {isLoading ? (
          <div className="text-white/50 text-center py-6">Loading batches...</div>
        ) : batches.length === 0 ? (
          <div className="text-white/50 text-center py-6 border border-dashed border-white/10 rounded-2xl">
            No batches assigned yet. Ask your admin to assign you to a batch.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    batch.status === 'active'
                      ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                      : 'bg-white/10 text-white/50'
                  }`}>
                    {batch.status}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{batch.name}</h3>
                <p className="text-white/60 text-sm mb-4">{batch.target_exam?.toUpperCase()} · Class {batch.class_grade}</p>
                <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-y border-white/10">
                  <div>
                    <div className="text-white font-bold text-xl">{batch.current_strength}</div>
                    <div className="text-white/40 text-xs">Students</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-xl">{batch.max_capacity}</div>
                    <div className="text-white/40 text-xs">Capacity</div>
                  </div>
                </div>
                <div className="text-white/40 text-xs">
                  Started: {new Date(batch.start_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Uploads */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Notes Uploaded</h2>
        {isLoading ? (
          <div className="text-white/50 text-center py-6">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-white/50 text-center py-6">No notes uploaded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">File Name</th>
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Subject</th>
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Type</th>
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Upload Date</th>
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {notes.slice(0, 5).map((note) => (
                  <tr
                    key={note.id}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-3 px-4 text-white">{note.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/20">
                        {note.subject?.name || note.subject || "N/A"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/70 text-sm uppercase">{note.file_type}</td>
                    <td className="py-3 px-4 text-white/70 text-sm">{new Date(note.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        note.is_published
                          ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                          : 'bg-white/10 text-white/50'
                      }`}>
                        {note.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
