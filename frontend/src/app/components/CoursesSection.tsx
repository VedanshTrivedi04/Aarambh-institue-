import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionTitle } from "./AboutSection";
import { useTilt } from "./useTilt";
import {
  BookOpen, FlaskConical, Calculator, Globe, Palette, Music,
  ChevronRight, ArrowRight
} from "lucide-react";
import api from "../../lib/api";

const boards = [
  { id: "mpboard", label: "MP Board", color: "#FF5C00" },
  { id: "cbse", label: "CBSE", color: "#3B5BDB" },
  { id: "icse", label: "ICSE", color: "#2F9E44" },
];

const subjects = [
  { icon: Calculator, name: "Mathematics", desc: "Board-pattern problem solving with 100+ practice sets" },
  { icon: FlaskConical, name: "Science / PCB / PCM", desc: "Practical + theory with lab demonstrations" },
  { icon: BookOpen, name: "English Language", desc: "Literature, grammar, writing excellence" },
  { icon: Globe, name: "Social Science", desc: "Maps, current affairs, conceptual depth" },
  { icon: Palette, name: "Hindi & Sanskrit", desc: "Language mastery, essay, poetry" },
  { icon: Music, name: "Commerce & Economics", desc: "Accounting, business, financial concepts" },
];

const THEMES = [
  { accent: "#3B5BDB", bg: "from-blue-50 to-indigo-100", emoji: "🎯" },
  { accent: "#7950F2", bg: "from-violet-50 to-purple-100", emoji: "📐" },
  { accent: "#b91c1c", bg: "from-red-50 to-rose-100", emoji: "🏆" },
  { accent: "#2F9E44", bg: "from-green-50 to-emerald-100", emoji: "🌟" },
];

interface CourseItem {
  id: string;
  grade: string;
  emoji: string;
  title: string;
  sub: string;
  desc: string;
  tags: string[];
  accent: string;
  bg: string;
  featured?: boolean;
}

function ClassCard({ cls, index }: { cls: CourseItem; index: number }) {
  const tilt = useTilt(8);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      className="relative"
      style={{ perspective: "800px" }}
      onMouseMove={tilt.onMouseMove as any}
      onMouseLeave={tilt.onMouseLeave as any}
    >
      <motion.div
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: "preserve-3d" }}
        className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${cls.bg} border border-white shadow-xl h-full flex flex-col`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Featured badge */}
        {cls.featured && (
          <div className="absolute top-4 right-4 z-20 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            Most Popular
          </div>
        )}

        {/* Glow orb */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-15 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${cls.accent}, transparent 70%)`, filter: "blur(30px)" }}
        />

        <div className="relative z-10 p-7 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-5">
            <div className="text-4xl">{cls.emoji}</div>
            <div className="text-right">
              <div className="text-slate-300 text-5xl font-black leading-none">{cls.grade}</div>
            </div>
          </div>

          <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: cls.accent }}>{cls.sub}</div>
          <h3 className="font-black text-slate-900 text-2xl mb-3">{cls.title}</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">{cls.desc}</p>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {cls.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-1 rounded-lg font-bold text-slate-700 bg-white shadow-sm border border-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-1.5 text-sm font-bold mt-auto"
            style={{ color: cls.accent }}
          >
            Enroll in {cls.title} <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* 3D depth element */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, transparent, ${cls.accent}, transparent)`, transform: "translateZ(10px)", opacity: 0.4 }}
        />

        {/* Glare */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX} ${tilt.glareY}, rgba(255,255,255,0.06) 0%, transparent 60%)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

const coursesData: CourseItem[] = [
  {
    id: "c1",
    grade: "4th-8th",
    emoji: "🎯",
    title: "Class 4th to 8th",
    sub: "All Subjects",
    desc: "MP Board / CBSE / ICSE. Batch Timings: Morning 11:00 AM - 12:30 PM | Evening 5:00 PM - 6:30 PM. Fee: 800/- 1000/- (Monthly)",
    tags: ["Weekly Tests", "Study Material", "Doubt Classes"],
    accent: "#3B5BDB",
    bg: "from-blue-50 to-indigo-100",
    featured: false,
  },
  {
    id: "c2",
    grade: "9th-12th",
    emoji: "🏆",
    title: "Class 9th-12th",
    sub: "All Subjects",
    desc: "MPBOARD/CBSE/ICSE. Batch Timings: Morning 11:00AM - 1:00PM | Evening 4:00PM - 6:00 PM.",
    tags: ["Weekly Tests", "Study Material", "Doubt Classes"],
    accent: "#b91c1c",
    bg: "from-red-50 to-rose-100",
    featured: true,
  },
  {
    id: "c3",
    grade: "College",
    emoji: "🌟",
    title: "B.COM, M.COM, BBA, MBA, B.SC",
    sub: "As per your domain",
    desc: "Duration: As per Academic Year.",
    tags: ["Weekly Tests", "Study Material", "Doubt Classes"],
    accent: "#2F9E44",
    bg: "from-green-50 to-emerald-100",
    featured: false,
  }
];

export function CoursesSection({ showViewAll, onViewAll }: { showViewAll?: boolean; onViewAll?: () => void } = {}) {
  const [activeBoard, setActiveBoard] = useState("mpboard");
  const courses = coursesData;
  const loading = false;

  return (
    <section id="courses" className="py-28 bg-slate-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-40 blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <SectionTitle
            label="Programs"
            title={`Courses for\nEvery Board`}
            subtitle="Complete coaching for 10th, 11th & 12th — all subjects, all streams, all boards."
          />
          {showViewAll && (
            <motion.button
              whileHover={{ scale: 1.03, x: 4 }}
              onClick={onViewAll}
              className="flex items-center gap-2 text-red-700 font-bold text-sm whitespace-nowrap mb-14"
            >
              View Full Details <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Class cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5 mb-20">
            {courses.map((cls, i) => <ClassCard key={cls.id} cls={cls} index={i} />)}
          </div>
        )}

        {/* Board tabs + subject grid */}
        <div>
          {/* Board selector */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h3 className="text-slate-900 font-black text-xl">All Subjects by Board</h3>
            <div className="flex gap-2 p-1 rounded-xl bg-white shadow-sm border border-slate-200">
              {boards.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBoard(b.id)}
                  className="relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={{ color: activeBoard === b.id ? "white" : "#64748b" }}
                >
                  {activeBoard === b.id && (
                    <motion.div
                      layoutId="board-pill"
                      className="absolute inset-0 rounded-lg shadow-sm"
                      style={{ backgroundColor: boards.find(x => x.id === b.id)?.color }}
                    />
                  )}
                  <span className="relative z-10">{b.label}</span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeBoard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {subjects.map(({ icon: Icon, name, desc }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3, backgroundColor: "#ffffff" }}
                  className="flex gap-4 p-5 rounded-2xl border border-slate-200 bg-white/60 shadow-sm transition-all cursor-default"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm border border-slate-100"
                  >
                    <Icon className="w-5 h-5" style={{ color: boards.find(b => b.id === activeBoard)?.color }} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm mb-1">{name}</div>
                    <div className="text-slate-500 text-xs leading-relaxed">{desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
