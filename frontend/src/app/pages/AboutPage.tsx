import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useNavigate } from "react-router";
import { useTilt } from "../components/useTilt";
import {
  ArrowLeft, Target, Eye, Heart, CheckCircle2,
  BookOpen, Users, Trophy, Star, Award, Zap,
  MapPin, Phone, Mail, ArrowRight, GraduationCap,
  ChevronDown,
} from "lucide-react";

/* ─── Images ─── */
const IMG_CAMPUS = "https://images.unsplash.com/photo-1615406020658-6c4b805f1f30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBidWlsZGluZyUyMG1vZGVybiUyMGNhbXB1cyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3ODA3MzAyODV8MA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_STUDENTS = "https://images.unsplash.com/photo-1686624386665-4cd01b96d0f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tJTIwZWR1Y2F0aW9uJTIwSW5kaWF8ZW58MXx8fHwxNzgwNzMwMjg1fDA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_CLASSROOM = "https://images.unsplash.com/photo-1692269725836-fbd72e98883f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tJTIwZWR1Y2F0aW9uJTIwSW5kaWF8ZW58MXx8fHwxNzgwNzMwMjg1fDA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_MEDALS = "https://images.unsplash.com/photo-1706374503312-7a4a4c030d2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxlZHVjYXRpb24lMjBhd2FyZHMlMjJjZXJlbW9ueSUyMGFjaGlldmVtZW50JTIwcmVjb2duaXRpb258ZW58MXx8fHwxNzgwNzM0ODM2fDA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_TEAM = "https://images.unsplash.com/photo-1551135049-8a33b5883817?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMHByb2Zlc3Npb25hbHMlMjJvZmZpY2UlMjJkaXNjdXNzaW9ufGVufDF8fHx8MTc4MDczNDgzNnww&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_LIBRARY = "https://images.unsplash.com/photo-1766506075730-f1d871df530a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwYm9va3MlMjJyZWFkaW5nJTIwc3R1ZGVudHMlMjJzdHVkeSUyMnJvb218ZW58MXx8fHwxNzgwNzMzNDUzfDA&ixlib=rb-4.1.0&q=80&w=1080";

/* ─── Data ─── */
const timeline = [
  { year: "2010", title: "The Beginning", desc: "Aarambh Institute was founded by Mr. Sunil Verma with just 3 teachers and 40 students in a small rented space in Bhopal." },
  { year: "2013", title: "First Big Result", desc: "Our students achieved the top 3 ranks in the MP Board Class 10 district examinations — putting Aarambh on the map." },
  { year: "2015", title: "New Campus", desc: "Moved to a purpose-built facility with modern classrooms, a science lab, and a reading library accommodating 200+ students." },
  { year: "2018", title: "CBSE & ICSE Added", desc: "Expanded coaching beyond MP Board to include CBSE and ICSE curricula with dedicated subject specialists for each board." },
  { year: "2020", title: "Digital Integration", desc: "Launched recorded sessions, online doubt-clearing, and digital test series to support students during challenging times." },
  { year: "2022", title: "500+ Students", desc: "Crossed the milestone of 500 active students per academic year — with state toppers across MP Board, CBSE, and ICSE." },
  { year: "2024", title: "Today", desc: "15 expert faculty, 3 boards, Class 10–12, all streams. Aarambh stands as one of Madhya Pradesh's most trusted institutes." },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    body: "To deliver quality, affordable education that empowers every student — regardless of background — to achieve academic excellence and unlock their full potential.",
    accent: "#FF5C00",
  },
  {
    icon: Eye,
    title: "Our Vision",
    body: "To become the most trusted educational institute in central India, known not just for outstanding results but for building confident, curious, capable human beings.",
    accent: "#3B5BDB",
  },
  {
    icon: Heart,
    title: "Our Values",
    body: "Discipline, dedication, and direction. We believe every child deserves a teacher who genuinely cares — and an environment where asking questions is celebrated.",
    accent: "#2F9E44",
  },
];

const stats = [
  { icon: Users, value: "5000+", label: "Students Coached", color: "#3B5BDB" },
  { icon: Trophy, value: "150+", label: "Board Toppers", color: "#FF5C00" },
  { icon: Star, value: "15+", label: "Years Excellence", color: "#F59F00" },
  { icon: GraduationCap, value: "15", label: "Expert Faculty", color: "#2F9E44" },
  { icon: BookOpen, value: "3", label: "Boards Covered", color: "#7950F2" },
  { icon: Award, value: "98%", label: "Pass Rate", color: "#E64980" },
];

const achievements = [
  { title: "Best Coaching Institute", org: "MP Education Board", year: "2023", icon: "🏆" },
  { title: "Excellence in Science Education", org: "CBSE Regional Award", year: "2022", icon: "🔬" },
  { title: "Top Results — Commerce Stream", org: "Bhopal District", year: "2023", icon: "📊" },
  { title: "Parent Trust Award", org: "Education Today Survey", year: "2024", icon: "❤️" },
  { title: "100% Pass Rate — ICSE Batch", org: "Internal Milestone", year: "2024", icon: "✅" },
  { title: "Digital Innovation in Teaching", org: "EdTech Forum MP", year: "2023", icon: "💡" },
];

const facilities = [
  { icon: "📚", label: "Library", desc: "2000+ books, board-specific reference material" },
  { icon: "🔬", label: "Science Labs", desc: "Fully equipped Physics, Chemistry & Biology labs" },
  { icon: "🖥️", label: "Smart Classrooms", desc: "Projector-enabled rooms with interactive boards" },
  { icon: "📝", label: "Test Centre", desc: "Dedicated exam hall for mock board tests" },
  { icon: "🍽️", label: "Canteen", desc: "Healthy meals and snacks for full-day students" },
  { icon: "🚌", label: "Transport", desc: "Pick-up & drop available for select areas" },
];

const leadership = [
  {
    name: "Mr. Sunil Verma",
    role: "Founder & Director",
    exp: "25+ Years in Education",
    bio: "A visionary educator who started Aarambh with the belief that every child deserves quality coaching. Former government school teacher turned institute builder.",
    letter: "S",
    color: "#FF5C00",
  },
  {
    name: "Mrs. Anita Sharma",
    role: "Academic Director",
    exp: "20 Years Experience",
    bio: "Heads curriculum design and faculty training. Holds an M.Ed. from Barkatullah University and has personally mentored over 300 board toppers.",
    letter: "A",
    color: "#3B5BDB",
  },
  {
    name: "Mr. Pradeep Joshi",
    role: "Operations & Admin Head",
    exp: "12 Years in EdTech",
    bio: "Ensures every student's experience — from admissions to results — is seamless. Champions the institute's digital infrastructure and parent communication.",
    letter: "P",
    color: "#2F9E44",
  },
];

/* ─── Sub-components ─── */
function SectionLabel({ text, light }: { text: string; light?: boolean }) {
  return (
    <motion.span
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`inline-block text-[11px] font-bold tracking-[0.18em] uppercase mb-4 px-3 py-1.5 rounded-full border ${
        light
          ? "border-orange-400/30 text-orange-400 bg-orange-400/10"
          : "border-orange-200 text-orange-600 bg-orange-50"
      }`}
    >
      {text}
    </motion.span>
  );
}

function Heading({ children, light, className = "" }: { children: React.ReactNode; light?: boolean; className?: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.08 }}
      className={`mb-5 ${light ? "text-white" : "text-gray-950"} ${className}`}
      style={{ fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", fontSize: "clamp(2rem,4vw,3rem)" }}
    >
      {children}
    </motion.h2>
  );
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const tilt = useTilt(7);
  return (
    <motion.div
      style={{ perspective: "900px" }}
      onMouseMove={tilt.onMouseMove as any}
      onMouseLeave={tilt.onMouseLeave as any}
      className={className}
    >
      <motion.div style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: "preserve-3d" }}>
        {children}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle at ${tilt.glareX} ${tilt.glareY}, rgba(255,255,255,0.06) 0%, transparent 60%)` }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Page ─── */
export function AboutPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 160]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [openYear, setOpenYear] = useState<string | null>(null);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── HERO ── */}
      <div
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #05101F 0%, #0A1830 55%, #0D0A1E 100%)" }}
      >
        {/* Parallax background image */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img src={IMG_CAMPUS} alt="Campus" className="w-full h-full object-cover opacity-15 scale-110" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #05101F 40%, rgba(5,16,31,0.7))" }} />
        </motion.div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Glows */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #FF5C00, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full opacity-8 pointer-events-none"
          style={{ background: "radial-gradient(circle, #3B5BDB, transparent 70%)", filter: "blur(70px)" }} />

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-20 w-full"
          style={{ opacity: heroOpacity }}
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors text-sm font-medium mb-12"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-white/10 bg-white/5"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-white/50 text-xs font-medium">Bhopal, Madhya Pradesh · Est. 2010</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", fontSize: "clamp(3.5rem,7vw,5.5rem)" }}
                className="text-white mb-6"
              >
                About<br />
                <span style={{
                  background: "linear-gradient(90deg, #FF5C00, #FF9A3C, #FFD166)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Aarambh
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/50 text-lg leading-relaxed max-w-lg mb-10"
              >
                We are more than a coaching institute. We are a community of learners, teachers, and believers — united by one goal: your success.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                {["15 Years", "5000+ Students", "MP Board · CBSE · ICSE", "Class 10–12"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg text-sm text-white/50 border border-white/10 bg-white/[0.04] font-medium">
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: 3 stacked image cards */}
            <div className="hidden lg:block relative h-[420px]">
              {[
                { img: IMG_CLASSROOM, label: "Classrooms", x: "0%", y: "0%", rot: -4, z: 10 },
                { img: IMG_STUDENTS, label: "Students", x: "15%", y: "15%", rot: 2, z: 20 },
                { img: IMG_TEAM, label: "Faculty", x: "30%", y: "30%", rot: 6, z: 30 },
              ].map(({ img, label, x, y, rot, z }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.85, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.7 }}
                  style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    rotate: rot,
                    zIndex: z,
                    width: "62%",
                  }}
                  whileHover={{ zIndex: 50, scale: 1.04, rotate: 0 }}
                  className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 cursor-pointer"
                >
                  <img src={img} alt={label} className="w-full h-44 object-cover" />
                  <div className="px-3 py-2 bg-white/5 backdrop-blur-sm">
                    <span className="text-white/60 text-xs font-semibold">{label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent"
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div style={{ background: "#05101F", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map(({ icon: Icon, value, label, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="text-center"
              >
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: `${color}18`, border: `1px solid ${color}35` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="font-black text-white text-2xl leading-none mb-1">{value}</div>
                <div className="text-white/30 text-xs font-medium">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STORY ── */}
      <div className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <SectionLabel text="Our Story" />
              <Heading>Started Small,<br />Dreamed Big</Heading>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  In 2010, a former government school teacher named <span className="font-semibold text-gray-900">Mr. Sunil Verma</span> quit his secure job to open a small coaching room near Government College, Bhopal. He had three teachers, forty students, and an unshakeable belief — that every child, given the right guidance, can excel.
                </p>
                <p>
                  The first batch produced the district's top three ranks in the MP Board Class 10 examination. Word spread. Parents trusted, students came, and within three years, Aarambh had outgrown its first home.
                </p>
                <p>
                  Today, we are a full-fledged institute with 15 expert educators, modern facilities, and coaching for Class 10th, 11th & 12th across MP Board, CBSE, and ICSE. But the philosophy remains exactly the same as day one — <span className="font-semibold text-gray-900">every student matters, every mark counts.</span>
                </p>
              </div>
            </div>

            {/* Tilt image */}
            <TiltCard className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 40px 80px -20px rgba(0,0,0,0.35)" }}>
                <img src={IMG_TEAM} alt="Team" className="w-full h-80 object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,16,31,0.6) 0%, transparent 60%)" }} />
                <div className="absolute bottom-5 left-5 text-white">
                  <p className="font-bold">The Founding Team</p>
                  <p className="text-white/50 text-sm">Still together, still teaching</p>
                </div>
              </div>
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -right-5 bg-[#FF5C00] text-white rounded-2xl px-4 py-3 shadow-xl"
                style={{ transform: "translateZ(40px)" }}
              >
                <div className="font-black text-xl leading-none">2010</div>
                <div className="text-orange-100 text-[10px] font-semibold uppercase tracking-wide mt-0.5">Founded</div>
              </motion.div>
            </TiltCard>
          </div>
        </div>
      </div>

      {/* ── MISSION / VISION / VALUES ── */}
      <div className="py-28" style={{ background: "#F7F8FA" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionLabel text="Philosophy" />
            <Heading className="text-center">What Drives Us</Heading>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, body, accent }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -8, boxShadow: `0 30px 60px ${accent}18` }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden cursor-default transition-shadow"
              >
                {/* Accent line */}
                <div className="absolute top-0 left-8 right-8 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${accent}15`, border: `1px solid ${accent}30` }}>
                  <Icon className="w-6 h-6" style={{ color: accent }} />
                </div>

                <h3 className="font-black text-gray-900 text-xl mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{body}</p>

                {/* Watermark number */}
                <div className="absolute -bottom-3 -right-3 font-black text-8xl leading-none select-none"
                  style={{ color: `${accent}08` }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="py-28" style={{ background: "#05101F" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionLabel text="Journey" light />
            <Heading light>15 Years in the Making</Heading>
            <p className="text-white/40 max-w-lg mx-auto">
              Every milestone shaped who we are today. Click any year to read the story.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />

            <div className="space-y-2">
              {timeline.map(({ year, title, desc }, i) => {
                const isOpen = openYear === year;
                return (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <button
                      onClick={() => setOpenYear(isOpen ? null : year)}
                      className="w-full flex items-center gap-5 text-left group"
                    >
                      {/* Dot */}
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border"
                          style={{
                            backgroundColor: isOpen ? "#FF5C00" : "rgba(255,255,255,0.05)",
                            borderColor: isOpen ? "#FF5C00" : "rgba(255,255,255,0.1)",
                            boxShadow: isOpen ? "0 0 20px rgba(255,92,0,0.4)" : "none",
                          }}
                        >
                          <span className="text-xs font-black" style={{ color: isOpen ? "white" : "rgba(255,255,255,0.3)" }}>
                            {year.slice(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 py-4 border-b border-white/[0.05] group-hover:border-white/10 transition-colors">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <span className="text-white/30 text-xs font-bold">{year}</span>
                            <h3 className="font-bold text-white/80 group-hover:text-white transition-colors">{title}</h3>
                          </div>
                          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                            <ChevronDown className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
                          </motion.div>
                        </div>

                        <motion.div
                          initial={false}
                          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-white/40 text-sm mt-3 leading-relaxed pr-6">{desc}</p>
                        </motion.div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── LEADERSHIP ── */}
      <div className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <SectionLabel text="Leadership" />
            <Heading>The People Behind<br />Aarambh</Heading>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {leadership.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className="relative overflow-hidden rounded-3xl border border-gray-100 shadow-sm bg-white cursor-default"
              >
                {/* Color header */}
                <div className="h-32 relative" style={{ background: `linear-gradient(135deg, ${person.color}25, ${person.color}08)` }}>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${person.color}, transparent)` }} />
                  <div
                    className="absolute bottom-0 left-6 translate-y-1/2 w-16 h-16 rounded-2xl border-4 border-white flex items-center justify-center font-black text-2xl text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${person.color}, ${person.color}99)` }}
                  >
                    {person.letter}
                  </div>
                </div>

                <div className="p-6 pt-10">
                  <h3 className="font-black text-gray-900 text-lg">{person.name}</h3>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: person.color }}>{person.role}</p>
                  <p className="text-gray-400 text-xs mb-4">{person.exp}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{person.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ACHIEVEMENTS ── */}
      <div className="py-28" style={{ background: "#F7F8FA" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel text="Recognition" />
              <Heading>Awards &<br />Milestones</Heading>
              <p className="text-gray-500 mb-10 leading-relaxed">
                Our results speak, but these recognitions from educational bodies across Madhya Pradesh tell the wider story of Aarambh's impact.
              </p>

              <div className="space-y-3">
                {achievements.map((a, i) => (
                  <motion.div
                    key={a.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"
                  >
                    <div className="text-2xl w-10 text-center flex-shrink-0">{a.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-sm">{a.title}</div>
                      <div className="text-gray-400 text-xs">{a.org}</div>
                    </div>
                    <div className="text-[#FF5C00] font-black text-sm flex-shrink-0">{a.year}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Image stack */}
            <div className="relative h-96">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
              >
                <img src={IMG_MEDALS} alt="Awards" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,16,31,0.7) 0%, transparent 60%)" }} />
                <div className="absolute bottom-6 left-6">
                  <div className="font-black text-white text-2xl">6+</div>
                  <div className="text-white/50 text-sm">Regional recognitions</div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-[#F59F00] text-white rounded-2xl px-4 py-3 shadow-xl"
              >
                <div className="font-black text-xl">★ 5.0</div>
                <div className="text-yellow-100 text-[10px] font-semibold">Parent rating</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FACILITIES ── */}
      <div className="py-28" style={{ background: "#05101F" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionLabel text="Facilities" light />
              <Heading light>Built for<br />Learning</Heading>
              <p className="text-white/40 leading-relaxed mb-10">
                Our campus in Bhopal is designed to create the best possible environment — every classroom, lab, and corner is purposeful.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {facilities.map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.07)" }}
                    className="flex gap-3 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] transition-colors"
                  >
                    <div className="text-2xl flex-shrink-0">{f.icon}</div>
                    <div>
                      <div className="font-bold text-white/80 text-sm">{f.label}</div>
                      <div className="text-white/30 text-xs leading-relaxed">{f.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Library image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}
            >
              <img src={IMG_LIBRARY} alt="Library" className="w-full h-96 object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,16,31,0.8) 0%, transparent 50%)" }} />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="font-black text-xl mb-1">Our Library</div>
                <div className="text-white/50 text-sm">2000+ books · Open 8 AM – 8 PM daily</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <SectionLabel text="Join Us" />
          <Heading className="text-center">
            Become Part of<br />the Aarambh Story
          </Heading>
          <p className="text-gray-500 mb-10 leading-relaxed max-w-lg mx-auto">
            Whether you're a student looking for guidance, or a parent searching for the right institute — your journey starts here.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(255,92,0,0.3)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { navigate("/"); setTimeout(() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }), 400); }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base"
              style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)", boxShadow: "0 8px 30px rgba(255,92,0,0.2)" }}
            >
              Book Free Demo Class <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/courses")}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-gray-700 border border-gray-200 hover:border-gray-400 transition-colors text-base"
            >
              <BookOpen className="w-4 h-4" /> View All Courses
            </motion.button>
          </div>

          {/* Quick contact */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
            <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-[#FF5C00] transition-colors font-medium">
              <Phone className="w-4 h-4" /> +91 98765 43210
            </a>
            <span className="text-gray-200">|</span>
            <a href="mailto:info@aarambhinstitute.in" className="flex items-center gap-2 hover:text-[#3B5BDB] transition-colors font-medium">
              <Mail className="w-4 h-4" /> info@aarambhinstitute.in
            </a>
            <span className="text-gray-200">|</span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Bhopal, MP
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
