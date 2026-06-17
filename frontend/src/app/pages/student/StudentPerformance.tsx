import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Award, FileCheck, Users, Calendar } from "lucide-react";
import api from "../../../lib/api";

export function StudentPerformance() {
  const [scores, setScores] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [scoresRes, attendanceRes] = await Promise.allSettled([
        api.get('/performance/scores/my-scores/'),
        api.get('/performance/attendance/sessions/my-attendance/'),
      ]);

      if (scoresRes.status === 'fulfilled') {
        setScores(scoresRes.value.data);
      }
      if (attendanceRes.status === 'fulfilled') {
        setAttendance(attendanceRes.value.data);
      }
    } catch (err) {
      console.error("Failed to fetch performance data", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Build chart data from scores
  const chartData = scores?.scores?.map((s: any, idx: number) => ({
    test: s.test?.title ? s.test.title.slice(0, 10) : `Test ${idx + 1}`,
    myScore: s.marks_obtained,
    maxMarks: s.test?.total_marks || 100,
  })) || [];

  // Subject-wise performance grouping
  const subjectMap: Record<string, { total: number; count: number; name: string }> = {};
  scores?.scores?.forEach((s: any) => {
    const subjectName = s.test?.subject?.name || s.test?.subject || "General";
    if (!subjectMap[subjectName]) {
      subjectMap[subjectName] = { total: 0, count: 0, name: subjectName };
    }
    subjectMap[subjectName].total += s.marks_obtained;
    subjectMap[subjectName].count += 1;
  });
  const subjectPerformance = Object.values(subjectMap).map((s) => ({
    subject: s.name,
    avgScore: Math.round((s.total / s.count) * 100) / 100,
    tests: s.count,
  }));

  const totalTests = scores?.total_tests ?? 0;
  const avgMarks = scores?.average_marks ? Math.round(scores.average_marks) : null;
  const bestScore = scores?.scores?.length > 0
    ? Math.max(...scores.scores.map((s: any) => s.marks_obtained))
    : null;
  const attendancePct = attendance
    ? Math.round(attendance.attendance_percentage)
    : null;
  const totalSessions = attendance?.total_sessions ?? 0;
  const presentSessions = attendance?.present_sessions ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black text-white mb-1">My Performance</h1>
        <p className="text-white/50 text-sm">Track your academic progress</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-blue-700 flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-3xl font-black text-white">
                {isLoading ? "..." : totalTests}
              </div>
              <div className="text-white/50 text-sm">Tests Taken</div>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-3xl font-black text-white">
                {isLoading ? "..." : avgMarks !== null ? `${avgMarks}` : "N/A"}
              </div>
              <div className="text-white/50 text-sm">Avg Score</div>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-3xl font-black text-white">
                {isLoading ? "..." : bestScore !== null ? bestScore : "N/A"}
              </div>
              <div className="text-white/50 text-sm">Best Score</div>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className={`text-3xl font-black ${
                attendancePct !== null && attendancePct < 75 ? 'text-red-400' : 'text-white'
              }`}>
                {isLoading ? "..." : attendancePct !== null ? `${attendancePct}%` : "N/A"}
              </div>
              <div className="text-white/50 text-sm">Attendance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Detail */}
      {!isLoading && attendance && (
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-red-400" />
            <h2 className="text-xl font-bold text-white">Attendance Summary</h2>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-white/70">{presentSessions} present out of {totalSessions} classes</span>
            {attendancePct !== null && attendancePct < 75 && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-500/15 text-red-400 border border-red-500/20">
                ⚠ Below 75% — At Risk
              </span>
            )}
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full">
            <div
              className={`h-full rounded-full transition-all ${
                attendancePct !== null && attendancePct < 75 ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${attendancePct || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Subject-wise Performance */}
      {!isLoading && subjectPerformance.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Subject-wise Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectPerformance.map((subject) => {
              const pct = Math.min(100, Math.round(subject.avgScore));
              return (
                <div
                  key={subject.subject}
                  className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-white font-bold text-lg mb-4">{subject.subject}</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                        <circle
                          cx="48" cy="48" r="40" stroke="#FF5C00" strokeWidth="8" fill="none"
                          strokeDasharray={`${(pct / 100) * 251.2} 251.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-black text-white">{pct}</div>
                          <div className="text-xs text-white/40">Avg Score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-white/50 text-sm">{subject.tests} test{subject.tests !== 1 ? 's' : ''} taken</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Test History Chart */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Score History</h2>
        {isLoading ? (
          <div className="text-white/50 text-center py-12">Loading performance data...</div>
        ) : chartData.length === 0 ? (
          <div className="text-white/50 text-center py-12">
            No test scores recorded yet. Complete some tests to see your progress!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="test"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#0A1A35",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Legend wrapperStyle={{ color: "rgba(255,255,255,0.6)" }} />
              <Line
                type="monotone"
                dataKey="myScore"
                stroke="#FF5C00"
                strokeWidth={3}
                name="My Score"
                dot={{ fill: "#FF5C00", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Detailed Score Table */}
      {!isLoading && scores?.scores?.length > 0 && (
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Test Score Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Test</th>
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Subject</th>
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Score</th>
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {scores.scores.map((score: any) => {
                  const maxMarks = score.test?.total_marks || 100;
                  const pct = Math.round((score.marks_obtained / maxMarks) * 100);
                  return (
                    <tr key={score.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-4 text-white font-medium">
                        {score.test?.title || "Test"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-600/15 text-red-400 border border-red-600/20">
                          {score.test?.subject?.name || "General"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${pct >= 75 ? 'text-green-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                          {score.marks_obtained}/{maxMarks}
                        </span>
                        <span className="text-white/40 text-xs ml-2">({pct}%)</span>
                      </td>
                      <td className="py-3 px-4 text-white/60 text-sm">{score.remarks || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
