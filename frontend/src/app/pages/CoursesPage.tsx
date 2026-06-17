import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  Calculator, FlaskConical, BookOpen, Globe, Palette, Music,
  ChevronDown, CheckCircle2, Clock, Users, Star, ArrowLeft, ChevronRight
} from "lucide-react";

const PageHero = ({ title, subtitle, bg }: { title: string; subtitle: string; bg: string }) => (
  <div className={`relative pt-32 pb-20 ${bg} overflow-hidden`}>
    <div className="absolute inset-0 opacity-10"
      style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white 0%, transparent 60%)" }}
    />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black mb-4">{title}</motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/75 text-xl max-w-2xl">{subtitle}</motion.p>
    </div>
  </div>
);

const boards = [
  { id: "mpboard", label: "MP Board", emoji: "🟠", color: "from-red-600 to-red-500", light: "bg-red-50 border-red-200 text-red-800" },
  { id: "cbse", label: "CBSE", emoji: "🔵", color: "from-slate-500 to-red-700", light: "bg-slate-50 border-slate-200 text-blue-700" },
  { id: "icse", label: "ICSE", emoji: "🟢", color: "from-green-500 to-emerald-600", light: "bg-green-50 border-green-200 text-green-700" },
];

const classData = {
  "10": {
    title: "Class 10th",
    tagline: "Strong foundation for board success",
    desc: "Class 10 is a crucial turning point. Our program focuses on mastering fundamentals, building problem-solving skills, and achieving top marks in board examinations.",
    duration: "1 Year / 2 Semesters",
    batchSize: "15–20 Students",
    timing: "Morning & Evening Batches",
    subjects: {
      mpboard: [
        { name: "Mathematics", topics: ["Number Systems", "Algebra", "Geometry", "Trigonometry", "Statistics", "Probability"], icon: Calculator },
        { name: "Science", topics: ["Physics — Light, Electricity, Magnetism", "Chemistry — Acids, Metals, Carbon", "Biology — Life Processes, Reproduction, Heredity"], icon: FlaskConical },
        { name: "Hindi", topics: ["Kshitij", "Kritika", "Sparsh", "Sanchayan", "Grammar"], icon: BookOpen },
        { name: "English", topics: ["First Flight", "Footprints Without Feet", "Grammar & Writing"], icon: BookOpen },
        { name: "Social Science", topics: ["History — India & Contemporary World", "Geography — Contemporary India", "Political Science", "Economics"], icon: Globe },
        { name: "Sanskrit", topics: ["Shemushi", "Abhyaswaan Bhav", "Grammar"], icon: Palette },
      ],
      cbse: [
        { name: "Mathematics Standard / Basic", topics: ["Real Numbers", "Polynomials", "Coordinate Geometry", "Quadratic Equations", "Arithmetic Progressions", "Circles"], icon: Calculator },
        { name: "Science", topics: ["Chemical Reactions", "Acids & Bases", "Metals & Non-Metals", "Carbon Compounds", "Life Processes", "Light", "Electricity"], icon: FlaskConical },
        { name: "English Language & Literature", topics: ["First Flight", "Footprints Without Feet", "Writing Skills", "Grammar"], icon: BookOpen },
        { name: "Social Science", topics: ["History", "Geography", "Political Science", "Economics"], icon: Globe },
        { name: "Hindi A / Hindi B", topics: ["Kshitij", "Kritika", "Grammar", "Writing"], icon: Palette },
        { name: "Information Technology (Optional)", topics: ["Digital Documentation", "Spreadsheet", "Database Management"], icon: Music },
      ],
      icse: [
        { name: "Mathematics", topics: ["GST", "Algebra", "Geometry", "Statistics", "Trigonometry", "Mensuration"], icon: Calculator },
        { name: "Physics", topics: ["Force", "Work Energy", "Sound", "Light", "Electricity", "Modern Physics"], icon: FlaskConical },
        { name: "Chemistry", topics: ["Periodic Table", "Chemical Bonding", "Acids Bases Salts", "Organic Chemistry"], icon: FlaskConical },
        { name: "Biology", topics: ["Cell Biology", "Plant Physiology", "Human Anatomy", "Genetics"], icon: FlaskConical },
        { name: "English Language & Literature", topics: ["Composition", "Comprehension", "Literature Texts"], icon: BookOpen },
        { name: "History & Civics / Geography", topics: ["Modern World", "Indian History", "Civics", "Physical & Human Geography"], icon: Globe },
      ],
    },
  },
  "11": {
    title: "Class 11th",
    tagline: "Build strong stream foundations",
    desc: "Class 11 marks the beginning of specialized stream education. We offer expert coaching for Science, Commerce, and Arts — with a focus on building conceptual clarity.",
    duration: "1 Year",
    batchSize: "12–18 Students",
    timing: "Morning & Evening Batches",
    subjects: {
      mpboard: [
        { name: "Physics", topics: ["Units & Measurement", "Motion", "Laws of Motion", "Gravitation", "Thermodynamics", "Waves"], icon: FlaskConical },
        { name: "Chemistry", topics: ["Atomic Structure", "Chemical Bonding", "States of Matter", "Thermodynamics", "Equilibrium", "Organic Chemistry"], icon: FlaskConical },
        { name: "Mathematics", topics: ["Sets", "Relations & Functions", "Algebra", "Coordinate Geometry", "Calculus", "Statistics"], icon: Calculator },
        { name: "Biology", topics: ["Diversity in Living World", "Cell Biology", "Plant Physiology", "Human Physiology"], icon: FlaskConical },
        { name: "Accountancy", topics: ["Introduction", "Journal", "Ledger", "Trial Balance", "Financial Statements"], icon: BookOpen },
        { name: "Economics", topics: ["Introduction to Microeconomics", "Consumer Behavior", "Production", "Market Forms"], icon: Globe },
      ],
      cbse: [
        { name: "Physics", topics: ["Physical World", "Units & Measurements", "Kinematics", "Laws of Motion", "Work Energy Power", "Gravitation"], icon: FlaskConical },
        { name: "Chemistry", topics: ["Some Basic Concepts", "Atomic Structure", "Classification of Elements", "Chemical Bonding", "States of Matter"], icon: FlaskConical },
        { name: "Mathematics", topics: ["Sets", "Relations & Functions", "Trigonometric Functions", "Principle of Math Induction", "Complex Numbers", "Calculus"], icon: Calculator },
        { name: "Biology", topics: ["The Living World", "Biological Classification", "Plant & Animal Kingdom", "Morphology", "Cell Biology"], icon: FlaskConical },
        { name: "Business Studies", topics: ["Nature & Purpose", "Forms of Organization", "Public & Private Enterprises", "Business Services"], icon: BookOpen },
        { name: "Accountancy", topics: ["Accounting Equation", "Recording Transactions", "Trial Balance", "Depreciation", "Financial Statements"], icon: BookOpen },
      ],
      icse: [
        { name: "Physics", topics: ["Measurements", "Motion in Straight Line", "Newton's Laws", "Work Energy Power", "Rotational Motion", "Gravitation"], icon: FlaskConical },
        { name: "Chemistry", topics: ["Atomic Structure", "Chemical Bonding", "States of Matter", "Thermodynamics", "Equilibrium", "Electrochemistry"], icon: FlaskConical },
        { name: "Mathematics", topics: ["Sets & Functions", "Algebra", "Calculus", "Statistics & Probability", "Coordinate Geometry"], icon: Calculator },
        { name: "Computer Science", topics: ["Computer Fundamentals", "Programming in C++", "Data Structures"], icon: Music },
        { name: "Commerce & Economics", topics: ["Business Studies", "Accountancy", "Economics", "Math for Commerce"], icon: Globe },
        { name: "English", topics: ["Prescribe Texts", "Composition", "Grammar"], icon: BookOpen },
      ],
    },
  },
  "12": {
    title: "Class 12th",
    tagline: "Achieve top board scores & beyond",
    desc: "Class 12 determines your future. Our intensive program covers the complete syllabus with a strong focus on board exam patterns, previous papers, and time management.",
    duration: "1 Year (Intensive)",
    batchSize: "10–15 Students",
    timing: "Multiple Batch Options",
    subjects: {
      mpboard: [
        { name: "Physics", topics: ["Electrostatics", "Current Electricity", "Magnetic Effects", "EMI", "Optics", "Dual Nature", "Atoms & Nuclei"], icon: FlaskConical },
        { name: "Chemistry", topics: ["Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Coordination Compounds", "Biomolecules"], icon: FlaskConical },
        { name: "Mathematics", topics: ["Relations & Functions", "Algebra", "Calculus", "Vectors & 3D Geometry", "Linear Programming", "Probability"], icon: Calculator },
        { name: "Biology", topics: ["Reproduction", "Genetics & Evolution", "Biology in Human Welfare", "Biotechnology", "Ecology"], icon: FlaskConical },
        { name: "Accountancy", topics: ["Partnership Accounts", "Company Accounts", "Financial Statements Analysis", "Cash Flow Statement"], icon: BookOpen },
        { name: "Economics", topics: ["Macroeconomics — National Income", "Money & Banking", "Government Budget", "Balance of Payments"], icon: Globe },
      ],
      cbse: [
        { name: "Physics", topics: ["Electric Charges", "Current Electricity", "Moving Charges", "Magnetism", "Electromagnetic Induction", "Optics", "Modern Physics"], icon: FlaskConical },
        { name: "Chemistry", topics: ["Solid State", "Solutions", "Electrochemistry", "Surface Chemistry", "General Principles", "Alcohols", "Amines", "Biomolecules"], icon: FlaskConical },
        { name: "Mathematics", topics: ["Inverse Trig", "Matrices & Determinants", "Differential Calculus", "Integral Calculus", "3D Geometry", "Probability"], icon: Calculator },
        { name: "Biology", topics: ["Sexual Reproduction", "Genetics", "Evolution", "Biotechnology", "Human Health", "Ecology"], icon: FlaskConical },
        { name: "Business Studies", topics: ["Management Principles", "Planning & Organizing", "Marketing", "Financial Management", "Consumer Protection"], icon: BookOpen },
        { name: "Accountancy", topics: ["Partnership — Admission Retirement Death", "Company Accounts", "Ratio Analysis", "Cash Flow"], icon: BookOpen },
      ],
      icse: [
        { name: "Physics", topics: ["Electrostatics", "Current Electricity", "Magnetism", "Electromagnetic Induction", "Optics", "Modern Physics"], icon: FlaskConical },
        { name: "Chemistry", topics: ["Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Coordination Compounds", "Polymers"], icon: FlaskConical },
        { name: "Mathematics", topics: ["Relations & Functions", "Algebra", "Calculus", "Probability", "Vectors", "3D Geometry"], icon: Calculator },
        { name: "Computer Science", topics: ["Boolean Algebra", "OOP Concepts", "Data Structures", "JDBC", "Networking"], icon: Music },
        { name: "Commerce", topics: ["Accounting", "Business Studies", "Economics", "Mathematics of Finance"], icon: Globe },
        { name: "English", topics: ["Literature Texts", "Drama", "Poetry", "Prose", "Composition"], icon: BookOpen },
      ],
    },
  },
};

type ClassKey = "10" | "11" | "12";

function SubjectAccordion({ subject, delay }: { subject: { name: string; topics: string[]; icon: typeof Calculator }; delay: number }) {
  const [open, setOpen] = useState(false);
  const Icon = subject.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="border border-gray-200 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-sm">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900">{subject.name}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 bg-gray-50 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {subject.topics.map((t) => (
                  <div key={t} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function CoursesPage() {
  const navigate = useNavigate();
  const [activeClass, setActiveClass] = useState<ClassKey>("10");
  const [activeBoard, setActiveBoard] = useState("mpboard");

  const cls = classData[activeClass];
  const subjects = cls.subjects[activeBoard as keyof typeof cls.subjects] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Our Courses"
        subtitle="Comprehensive coaching for Class 10th, 11th & 12th — all subjects, all boards, all streams."
        bg="bg-gradient-to-br from-red-900 via-red-800 to-red-950"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-10 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* Class Selector */}
        <div className="flex items-center gap-3 mb-10">
          {(["10", "11", "12"] as ClassKey[]).map((c) => (
            <motion.button
              key={c}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveClass(c)}
              className={`flex-1 py-4 rounded-2xl font-black text-lg transition-all ${
                activeClass === c
                  ? "bg-gradient-to-r from-red-700 to-red-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-red-200"
              }`}
            >
              Class {c}th
            </motion.button>
          ))}
        </div>

        {/* Class Overview */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeClass}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
              <h2 className="font-black text-3xl text-gray-900 mb-2">{cls.title}</h2>
              <p className="text-red-600 font-semibold mb-3">{cls.tagline}</p>
              <p className="text-gray-600 mb-6">{cls.desc}</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Clock, label: "Duration", value: cls.duration },
                  { icon: Users, label: "Batch Size", value: cls.batchSize },
                  { icon: Star, label: "Timings", value: cls.timing },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-2xl p-4 text-center">
                    <Icon className="w-5 h-5 text-red-600 mx-auto mb-2" />
                    <div className="text-xs text-gray-400 font-medium mb-0.5">{label}</div>
                    <div className="font-bold text-gray-900 text-sm">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Board Selector */}
            <div className="mb-6">
              <h3 className="font-black text-xl text-gray-900 mb-4">Select Your Board</h3>
              <div className="flex gap-3 flex-wrap">
                {boards.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveBoard(b.id)}
                    className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                      activeBoard === b.id
                        ? `bg-gradient-to-r ${b.color} text-white shadow-md`
                        : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {b.emoji} {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Accordion */}
            <div className="space-y-3">
              <h3 className="font-black text-xl text-gray-900 mb-4">
                Subjects for {boards.find((b) => b.id === activeBoard)?.label} — Class {activeClass}th
              </h3>
              {subjects.map((s, i) => (
                <SubjectAccordion key={s.name} subject={s} delay={i * 0.06} />
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 bg-gradient-to-br from-red-700 to-red-600 rounded-3xl p-8 text-white text-center"
            >
              <h3 className="font-black text-2xl mb-2">Ready to Enroll?</h3>
              <p className="text-white/80 mb-6">Book a free demo class and experience our teaching style before committing.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => { navigate("/"); setTimeout(() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }), 400); }}
                  className="px-8 py-3.5 bg-white text-red-700 font-black rounded-xl shadow-lg hover:shadow-white/20 transition-shadow"
                >
                  Book Free Demo Class
                </button>
                <a href="tel:+919876543210" className="px-8 py-3.5 bg-white/15 border border-white/30 text-white font-bold rounded-xl hover:bg-white/25 transition-colors">
                  Call Now: +91 98765 43210
                </a>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
