import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import api from "../../../lib/api";

export function TeacherStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [studentsRes, batchesRes, enrollmentsRes] = await Promise.allSettled([
        api.get('/users/?role=student'),
        api.get('/academics/batches/'),
        api.get('/academics/enrollments/'),
      ]);

      if (studentsRes.status === 'fulfilled') {
        setStudents(studentsRes.value.data.results || studentsRes.value.data || []);
      }
      if (batchesRes.status === 'fulfilled') {
        setBatches(batchesRes.value.data.results || batchesRes.value.data || []);
      }
      if (enrollmentsRes.status === 'fulfilled') {
        setEnrollments(enrollmentsRes.value.data.results || enrollmentsRes.value.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch student data", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Build student lookup from enrollments for batch info
  const getStudentBatch = (studentId: number) => {
    const enrollment = enrollments.find(
      (e) => (e.student?.id || e.student) === studentId && e.status === 'active'
    );
    if (!enrollment) return null;
    return enrollment.batch?.name || enrollment.batch;
  };

  const getStudentStatus = (studentId: number) => {
    const enrollment = enrollments.find(
      (e) => (e.student?.id || e.student) === studentId
    );
    return enrollment?.status || 'unknown';
  };

  const getStatusStyle = (status: string) => {
    if (status === 'active') return 'bg-green-500/15 text-green-400 border border-green-500/20';
    if (status === 'suspended') return 'bg-red-500/15 text-red-400 border border-red-500/20';
    if (status === 'completed') return 'bg-slate-500/15 text-blue-400 border border-slate-500/20';
    return 'bg-white/10 text-white/50';
  };

  const filteredStudents = students.filter((s) => {
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedBatch === 'all') return matchesSearch;

    const batchName = getStudentBatch(s.id);
    return matchesSearch && batchName === selectedBatch;
  });

  const activeCount = enrollments.filter((e) => e.status === 'active').length;
  const totalBatches = batches.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black text-white mb-1">My Students</h1>
        <p className="text-white/50 text-sm">Track student performance and engagement</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="text-3xl font-black text-white mb-1">
            {isLoading ? "..." : students.length}
          </div>
          <div className="text-white/50 text-sm">Total Students</div>
        </div>
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="text-3xl font-black text-white mb-1">
            {isLoading ? "..." : activeCount}
          </div>
          <div className="text-white/50 text-sm">Active Enrollments</div>
        </div>
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="text-3xl font-black text-white mb-1">
            {isLoading ? "..." : totalBatches}
          </div>
          <div className="text-white/50 text-sm">My Batches</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-600/50 text-sm"
          />
        </div>
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
          {batches.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBatch(b.name)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedBatch === b.name
                  ? "bg-red-600 text-white"
                  : "bg-white/[0.05] text-white/70 hover:bg-white/[0.08] border border-white/10"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Student List
          {!isLoading && (
            <span className="ml-2 text-base font-normal text-white/40">({filteredStudents.length} shown)</span>
          )}
        </h2>

        {isLoading ? (
          <div className="text-center py-12 text-white/50">Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12 text-white/50">No students found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Student</th>
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Email</th>
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Batch</th>
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Status</th>
                  <th className="text-left py-3 px-4 text-white/50 font-semibold text-sm">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const initials = `${student.first_name?.[0] || ''}${student.last_name?.[0] || ''}`.toUpperCase() || 'S';
                  const batchName = getStudentBatch(student.id);
                  const status = getStudentStatus(student.id);

                  return (
                    <tr
                      key={student.id}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-600 flex items-center justify-center text-white text-xs font-bold">
                            {initials}
                          </div>
                          <span className="text-white font-medium">
                            {student.first_name} {student.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/60 text-sm">{student.email}</td>
                      <td className="py-3 px-4">
                        {batchName ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/15 text-blue-400 border border-slate-500/20">
                            {batchName}
                          </span>
                        ) : (
                          <span className="text-white/30 text-xs">Not enrolled</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusStyle(status)}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white/60 text-sm">
                        {new Date(student.date_joined).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
