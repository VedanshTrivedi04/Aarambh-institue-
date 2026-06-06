import { motion } from "motion/react";
import { Trophy, Users, Star, TrendingUp, Award, BookOpen } from "lucide-react";

const items = [
  { icon: Users, text: "5000+ Students Coached" },
  { icon: Trophy, text: "150+ Board Toppers" },
  { icon: Star, text: "15 Years of Excellence" },
  { icon: TrendingUp, text: "98% Pass Rate" },
  { icon: Award, text: "MP Board · CBSE · ICSE" },
  { icon: BookOpen, text: "All Subjects Covered" },
  { icon: Users, text: "Class 10th · 11th · 12th" },
  { icon: Trophy, text: "Admissions Open 2025–26" },
];

const doubled = [...items, ...items];

export function Ticker() {
  return (
    <div className="bg-[#FF5C00] py-3 overflow-hidden">
      <motion.div
        className="flex gap-0 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map(({ icon: Icon, text }, i) => (
          <div key={i} className="inline-flex items-center gap-2 px-6 text-white font-semibold text-sm flex-shrink-0">
            <Icon className="w-4 h-4 opacity-80" />
            <span>{text}</span>
            <span className="ml-4 text-white/40 text-lg">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
