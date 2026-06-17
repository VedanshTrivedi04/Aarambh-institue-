import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";

export function AdminAnalytics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black text-gray-900 mb-1">Analytics & Reports</h1>
        <p className="text-gray-500 text-sm">Comprehensive insights and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-blue-700 flex items-center justify-center shadow-sm">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">85%</div>
              <div className="text-gray-500 text-sm font-medium">Retention Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-sm">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">92%</div>
              <div className="text-gray-500 text-sm font-medium">Avg Attendance</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-sm">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">4.7</div>
              <div className="text-gray-500 text-sm font-medium">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
