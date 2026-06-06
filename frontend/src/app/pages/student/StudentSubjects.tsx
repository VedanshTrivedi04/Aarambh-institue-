import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { MessageCircle, FileText, BookOpen } from "lucide-react";
import api from "../../../lib/api";

export function StudentSubjects() {
  const [enrollment, setEnrollment] = useState<any>(null);
  const [batch, setBatch] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [enrollmentRes, testsRes] = await Promise.allSettled([
        api.get('/academics/enrollments/'),
        api.get('/performance/tests/'),
      ]);

      let batchId: string | null = null;

      if (enrollmentRes.status === 'fulfilled') {
        const enrollments = enrollmentRes.value.data.results || enrollmentRes.value.data || [];
        const activeEnrollment = enrollments.find((e: any) => e.status === 'active');
        setEnrollment(activeEnrollment || null);

        if (activeEnrollment?.batch) {
          batchId = activeEnrollment.batch?.id || activeEnrollment.batch;
          // Fetch batch details with teachers
          try {
            const batchRes = await api.get(`/academics/batches/${batchId}/`);
            setBatch(batchRes.data);
            // Fetch teachers from the batch's primary_teachers
            const teacherIds: number[] = batchRes.data.primary_teachers || [];
            if (teacherIds.length > 0) {
              const teacherDetails = await Promise.all(
                teacherIds.map((id: number) => api.get(`/users/${id}/`))
              );
              setTeachers(teacherDetails.map((r) => r.data));
            }
          } catch (err) {
            console.error("Failed to fetch batch details", err);
          }
        }
      }

      if (testsRes.status === 'fulfilled') {
        const allTests = testsRes.value.data.results || testsRes.value.data || [];
        // Show upcoming tests (those with scheduled_at in the future, or just the last 5)
        const upcoming = allTests.filter((t: any) => {
          if (!t.scheduled_at) return false;
          return new Date(t.scheduled_at) >= new Date();
        });
        setTests(upcoming.slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to fetch subjects data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const batchName = batch?.name || enrollment?.batch?.name || "Not enrolled in any batch";
  const subjects = batch?.subjects || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black text-white mb-1">My Subjects & Teachers</h1>
        <p className="text-white/50 text-sm">Your enrolled subjects and faculty</p>
      </div>

      {/* Batch Info */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        {isLoading ? (
          <div className="text-white/50">Loading batch info...</div>
        ) : !enrollment ? (
          <div className="text-white/50">You are not currently enrolled in any batch.</div>
        ) : (
          <>
            <h3 className="text-white font-bold text-lg mb-2">Your Batch: {batchName}</h3>
            <div className="flex flex-wrap gap-3 mb-3">
              {batch?.target_exam && (
                <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/20">
                  Target: {batch.target_exam.toUpperCase()}
                </span>
              )}
              {batch?.class_grade && (
                <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20">
                  Class {batch.class_grade}
                </span>
              )}
              {batch?.status && (
                <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                  batch.status === 'active'
                    ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                    : 'bg-white/10 text-white/50'
                }`}>
                  {batch.status}
                </span>
              )}
            </div>
            {subjects.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-white/50 text-sm mr-1">Subjects:</span>
                {subjects.map((s: any) => (
                  <span key={s.id || s} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white/70 border border-white/15">
                    {s.name || s}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Teachers Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Your Teachers</h2>
        {isLoading ? (
          <div className="text-white/50 text-center py-8">Loading teachers...</div>
        ) : teachers.length === 0 ? (
          <div className="text-white/50 text-center py-8 border border-dashed border-white/10 rounded-2xl">
            No teachers assigned to your batch yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => {
              const initials = `${teacher.first_name?.[0] || ''}${teacher.last_name?.[0] || ''}`.toUpperCase() || 'T';
              return (
                <motion.div
                  key={teacher.id}
                  whileHover={{ y: -4 }}
                  className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all"
                >
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-2xl mb-3">
                      {initials}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      {teacher.first_name} {teacher.last_name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/20">
                      Teacher
                    </span>
                  </div>

                  <p className="text-white/60 text-sm text-center mb-4">{teacher.email}</p>

                  <div className="flex gap-2">
                    <Link
                      to="/student/chat"
                      className="flex-1 px-3 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </Link>
                    <Link
                      to="/student/notes"
                      className="flex-1 px-3 py-2 rounded-lg text-white/70 hover:text-white text-sm font-semibold border border-white/15 hover:bg-white/[0.05] transition-all flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Notes
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Tests */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-orange-400" />
          <h2 className="text-xl font-bold text-white">Upcoming Tests</h2>
        </div>
        {isLoading ? (
          <div className="text-white/50 text-center py-6">Loading tests...</div>
        ) : tests.length === 0 ? (
          <div className="text-white/50 text-center py-6">No upcoming tests scheduled.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Date</th>
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Test</th>
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Subject</th>
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Max Marks</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr key={test.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4 text-white">
                      {test.scheduled_at ? new Date(test.scheduled_at).toLocaleDateString() : 'TBA'}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">{test.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/20">
                        {test.subject?.name || test.subject || "N/A"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/70">{test.total_marks || "—"}</td>
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
