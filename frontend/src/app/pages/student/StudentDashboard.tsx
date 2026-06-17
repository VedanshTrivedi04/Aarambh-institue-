import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FileText, Download, Users, TrendingUp, ArrowRight, Bell } from "lucide-react";
import { Link } from "react-router";
import api from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

export function StudentDashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [notesRes, annRes, attendanceRes, scoresRes, enrollmentRes] = await Promise.allSettled([
        api.get('/notes/'),
        api.get('/announcements/'),
        api.get('/performance/attendance/sessions/my-attendance/'),
        api.get('/performance/scores/my-scores/'),
        api.get('/academics/enrollments/'),
      ]);

      if (notesRes.status === 'fulfilled') {
        setNotes(notesRes.value.data.results || notesRes.value.data || []);
      }
      if (annRes.status === 'fulfilled') {
        setAnnouncements(annRes.value.data.results || annRes.value.data || []);
      }
      if (attendanceRes.status === 'fulfilled') {
        setAttendance(attendanceRes.value.data);
      }
      if (scoresRes.status === 'fulfilled') {
        setScores(scoresRes.value.data);
      }
      if (enrollmentRes.status === 'fulfilled') {
        const enrollments = enrollmentRes.value.data.results || enrollmentRes.value.data || [];
        const active = enrollments.find((e: any) => e.status === 'active');
        setEnrollment(active);
      }
    } catch (err) {
      console.error("Dashboard fetch error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (announcementId: string) => {
    try {
      await api.post(`/announcements/${announcementId}/read/`);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const firstName = user?.first_name || "Student";
  const attendancePct = attendance
    ? Math.round(attendance.attendance_percentage)
    : null;

  const bestScore = scores?.scores?.length > 0
    ? Math.max(...scores.scores.map((s: any) => s.marks_obtained))
    : null;

  const stats = [
    { label: "Notes Available", value: isLoading ? "..." : String(notes.length), icon: FileText, color: "#3B5BDB" },
    { label: "My Attendance", value: isLoading || attendancePct === null ? "..." : `${attendancePct}%`, icon: Users, color: "#FF5C00" },
    { label: "Tests Taken", value: isLoading ? "..." : String(scores?.total_tests ?? 0), icon: TrendingUp, color: "#2F9E44" },
    { label: "Best Score", value: isLoading || bestScore === null ? "..." : `${bestScore}`, icon: Download, color: "#D4183D" },
  ];

  const getPriorityStyle = (priority: string) => {
    if (priority === "urgent") return "bg-red-500/10 border-l-4 border-red-500";
    if (priority === "high") return "bg-amber-500/10 border-l-4 border-amber-500";
    return "bg-white/[0.03] border-l-4 border-red-600/30";
  };

  const getPriorityBadgeStyle = (priority: string) => {
    if (priority === "urgent") return "bg-red-500/15 text-red-400 border border-red-500/20";
    if (priority === "high") return "bg-amber-500/15 text-amber-400 border border-amber-500/20";
    return "bg-white/10 text-white/70";
  };

  const batchName = enrollment?.batch?.name || enrollment?.batch || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Welcome Hero */}
      <div className="bg-white/[0.04] backdrop-blur-xl border-l-4 border-red-600 border-r border-t border-b border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-black text-white mb-2">
          Welcome back, {firstName}! 🎯
        </h2>
        <p className="text-white/70 mb-4">
          {announcements.length > 0
            ? `You have ${announcements.length} announcement${announcements.length > 1 ? 's' : ''} and ${notes.length} notes available.`
            : `You have ${notes.length} study notes available.`}
          {batchName && ` • Enrolled in: ${batchName}`}
        </p>
        <div className="flex gap-3">
          <Link
            to="/student/notes"
            className="text-red-400 hover:text-red-300 transition-colors text-sm font-semibold flex items-center gap-1"
          >
            View Notes <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-white/30">|</span>
          <Link
            to="/student/performance"
            className="text-red-400 hover:text-red-300 transition-colors text-sm font-semibold flex items-center gap-1"
          >
            My Performance <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

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

      {/* Announcements */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-red-400" />
          <h2 className="text-xl font-bold text-white">Announcements</h2>
          {announcements.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-600/15 text-red-400 border border-red-600/20">
              {announcements.length}
            </span>
          )}
        </div>
        {isLoading ? (
          <div className="text-white/50 text-center py-6">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="text-white/50 text-center py-6">No announcements yet.</div>
        ) : (
          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div
                key={ann.id}
                className={`p-4 rounded-xl transition-all ${getPriorityStyle(ann.priority)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getPriorityBadgeStyle(ann.priority)}`}>
                      {ann.priority}
                    </span>
                    <span className="text-white font-bold">{ann.title}</span>
                  </div>
                  <span className="text-white/40 text-sm shrink-0">{new Date(ann.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-white/70 text-sm mb-2">{ann.content}</p>
                <div className="flex items-center justify-between">
                  <div className="text-white/50 text-xs">
                    By {ann.author?.first_name || "Teacher"} {ann.author?.last_name || ""}
                  </div>
                  <button
                    onClick={() => handleMarkRead(ann.id)}
                    className="text-red-400 hover:text-red-300 text-xs font-semibold"
                  >
                    Mark as Read
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Notes */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Notes</h2>
        {isLoading ? (
          <div className="text-white/50 text-center py-6">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-white/50 text-center py-6">No notes available yet.</div>
        ) : (
          <div className="space-y-3">
            {notes.slice(0, 5).map((note) => (
              <div
                key={note.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-all"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <div className="text-white font-medium">{note.title}</div>
                    <div className="text-white/40 text-xs">
                      {note.subject?.name || note.subject || "General"} • {new Date(note.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <a
                  href={note.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shrink-0"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
