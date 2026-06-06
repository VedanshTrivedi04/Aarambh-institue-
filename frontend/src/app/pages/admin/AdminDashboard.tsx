import { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import { Users, GraduationCap, IndianRupee, MessageCircle, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../../lib/api";

function StatCard({ stat }: { stat: any }) {
  const count = useMotionValue(0);
  const Icon = stat.icon;

  useEffect(() => {
    const displayValue = stat.suffix === "L" ? stat.value / 100000 : stat.value;
    animate(count, displayValue, { duration: 1.5, ease: "easeOut" });
  }, [count, stat.value, stat.suffix]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-orange-200 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)` }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          stat.trend === "up"
            ? "bg-green-500/15 text-green-400 border border-green-500/20"
            : stat.trend === "down"
            ? "bg-red-500/15 text-red-400 border border-red-500/20"
            : "bg-gray-500/15 text-gray-400 border border-gray-500/20"
        }`}>
          {stat.trend === "up" && <TrendingUp className="w-3 h-3 inline mr-1" />}
          {stat.trend === "down" && <TrendingDown className="w-3 h-3 inline mr-1" />}
          {stat.change}
        </div>
      </div>
      <div className="space-y-1">
        <motion.div className="text-3xl font-black text-gray-900">
          {stat.prefix}
          <motion.span>{count}</motion.span>
          {stat.suffix}
        </motion.div>
        <div className="text-sm text-gray-600">{stat.label}</div>
      </div>
    </motion.div>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Total Students", value: 0, change: "Current", trend: "neutral", color: "#3B5BDB", icon: Users },
    { label: "Active Teachers", value: 0, change: "Current", trend: "neutral", color: "#2F9E44", icon: GraduationCap },
    { label: "Pending Queries", value: 0, change: "Pending", trend: "neutral", color: "#D4183D", icon: MessageCircle },
  ]);
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
  const [batchDistribution, setBatchDistribution] = useState<any[]>([]);
  const [totalBatches, setTotalBatches] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [studentsRes, teachersRes, queriesRes] = await Promise.all([
          api.get('/users/?role=student'),
          api.get('/users/?role=teacher'),
          api.get('/enquiries/leads/')
        ]);

        const extract = (res: any) => {
          const payload = res.data.data !== undefined ? res.data.data : res.data;
          return Array.isArray(payload) ? payload : (payload?.results || []);
        };

        const students = extract(studentsRes);
        const teachers = extract(teachersRes);
        const queries = extract(queriesRes);

        setStats([
          { label: "Total Students", value: students.length, change: "Current", trend: "up", color: "#3B5BDB", icon: Users },
          { label: "Active Teachers", value: teachers.length, change: "Current", trend: "up", color: "#2F9E44", icon: GraduationCap },
          { label: "Pending Queries", value: queries.filter((q: any) => q.status === 'new').length, change: "Pending", trend: "down", color: "#D4183D", icon: MessageCircle },
        ]);

        setRecentStudents(students.slice(0, 5));

        // Compute Enrollment Trend (Last 6 Months)
        const last6Months = Array.from({length: 6}, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return d.toLocaleString('default', { month: 'short' });
        }).reverse();

        const enrollments = last6Months.map(month => ({ month, enrollments: 0 }));
        
        students.forEach((s: any) => {
            if (s.date_joined) {
              const joined = new Date(s.date_joined);
              const m = joined.toLocaleString('default', { month: 'short' });
              const monthObj = enrollments.find(e => e.month === m);
              if(monthObj) {
                  monthObj.enrollments += 1;
              }
            }
        });
        setEnrollmentData(enrollments);

        // Compute Batch Distribution
        const batchCounts: Record<string, number> = {};
        students.forEach((s: any) => {
            const batch = s.student_profile?.target_exam || "Unassigned";
            batchCounts[batch] = (batchCounts[batch] || 0) + 1;
        });

        const colors = ["#FF5C00", "#3B5BDB", "#2F9E44", "#7950F2", "#E64980", "#F59F00"];
        let colorIndex = 0;
        
        const distribution = Object.entries(batchCounts).map(([name, count]) => {
            const percentage = students.length > 0 ? Math.round(((count as number) / students.length) * 100) : 0;
            return {
                name,
                value: percentage,
                count,
                color: colors[colorIndex++ % colors.length]
            };
        });

        setBatchDistribution(distribution);
        setTotalBatches(Object.keys(batchCounts).length);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Enrollment Trend */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Enrollment Trend</h2>
            <p className="text-gray-600 text-sm">Monthly student enrollments (Last 6 Months)</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentData}>
              <defs>
                <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5C00" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FF5C00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  color: "#111827",
                }}
              />
              <Line
                type="monotone"
                dataKey="enrollments"
                stroke="#FF5C00"
                strokeWidth={3}
                fill="url(#enrollmentGradient)"
                dot={{ fill: "#FF5C00", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Batch Distribution */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Batch Distribution</h2>
            <p className="text-gray-600 text-sm">Students by program (Target Exam)</p>
          </div>
          {batchDistribution.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={batchDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {batchDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                      color: "#111827",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {batchDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{item.value}% ({item.count})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
             <div className="h-[300px] flex items-center justify-center text-gray-400">
               No batch data available
             </div>
          )}
          <div className="mt-6 text-center">
            <div className="text-2xl font-black text-gray-900">{totalBatches}</div>
            <div className="text-gray-600 text-sm">Active Programs</div>
          </div>
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Recent Enrollments</h2>
            <p className="text-gray-600 text-sm">Latest student registrations</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Student Name</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Email</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Enrolled Date</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((student) => {
                const initials = (student.first_name?.[0] || '') + (student.last_name?.[0] || '');
                return (
                  <tr
                    key={student.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                          {initials || "S"}
                        </div>
                        <span className="text-gray-900 font-medium">{student.first_name} {student.last_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{student.email}</td>
                    <td className="py-3 px-4 text-gray-700">{student.date_joined ? new Date(student.date_joined).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                );
              })}
              {recentStudents.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500">No recent students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
