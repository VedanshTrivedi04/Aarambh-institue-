import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, BookOpen, GraduationCap, Award, Phone, Mail, Star, ChevronDown } from "lucide-react";

const IMG_T1 = "https://images.unsplash.com/photo-1580894732930-0babd100d356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwdGVhY2hpbmclMjB3aGl0ZWJvYXJkJTIwbGVjdHVyZXxlbnwxfHx8fDE3ODA3MzAyOTB8MA&ixlib=rb-4.1.0&q=80&w=600";
const IMG_T2 = "https://images.unsplash.com/photo-1664382953518-4a664ab8a8c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx0ZWFjaGVyJTIwdGVhY2hpbmclMjB3aGl0ZWJvYXJkJTIwbGVjdHVyZXxlbnwxfHx8fDE3ODA3MzAyOTB8MA&ixlib=rb-4.1.0&q=80&w=600";
const IMG_T3 = "https://images.unsplash.com/photo-1596496181871-9681eacf9764?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx0ZWFjaGVyJTIwdGVhY2hpbmclMjB3aGl0ZWJvYXJkJTIwbGVjdHVyZXxlbnwxfHx8fDE3ODA3MzAyOTB8MA&ixlib=rb-4.1.0&q=80&w=600";

const allFaculty = [
  {
    id: 1,
    name: "Dr. Rakesh Sharma",
    subject: "Mathematics",
    classes: "10th, 11th, 12th",
    exp: 18,
    qualification: "Ph.D. Mathematics, IIT Bombay",
    boards: ["MP Board", "CBSE", "ICSE"],
    achievement: "500+ students scored 95%+",
    img: IMG_T1,
    accent: "from-blue-500 to-indigo-600",
    about: "Dr. Rakesh Sharma brings 18 years of teaching experience with a doctorate from IIT Bombay. His innovative teaching methodology simplifies complex mathematical concepts, making them accessible to every student. He has personally coached over 30 state-level toppers.",
    specializations: ["Algebra & Calculus", "Board Exam Strategy", "Competitive Math", "Problem Solving"],
    rating: 4.9,
    reviews: 234,
    topics: ["Real Analysis", "Calculus", "Coordinate Geometry", "Probability & Statistics", "Linear Algebra"],
    contact: "dr.rakesh@aarambhinstitute.in",
    phone: "+91 98765 43210",
    stream: "Science & Commerce",
  },
  {
    id: 2,
    name: "Mrs. Priya Verma",
    subject: "English & Social Science",
    classes: "10th, 11th, 12th",
    exp: 12,
    qualification: "M.A. English Literature, BHU",
    boards: ["CBSE", "ICSE"],
    achievement: "100% board exam pass rate",
    img: IMG_T2,
    accent: "from-pink-500 to-rose-500",
    about: "Mrs. Priya Verma is a dynamic educator with a passion for literature and language. With her guidance, students don't just pass exams — they develop a genuine love for English. Her structured writing workshops have helped hundreds of students score full marks in the language papers.",
    specializations: ["English Literature", "Essay Writing", "Grammar Mastery", "Social Science Analysis"],
    rating: 4.8,
    reviews: 186,
    topics: ["Prose & Poetry Analysis", "Essay & Letter Writing", "Grammar", "History & Civics", "Geography"],
    contact: "priya@aarambhinstitute.in",
    phone: "+91 87654 32109",
    stream: "Arts & Commerce",
  },
  {
    id: 3,
    name: "Mr. Amit Tiwari",
    subject: "Physics, Chemistry & Biology",
    classes: "11th, 12th",
    exp: 15,
    qualification: "M.Sc. Physics, DAVV Indore",
    boards: ["MP Board", "CBSE"],
    achievement: "200+ students cleared NEET/JEE",
    img: IMG_T3,
    accent: "from-green-500 to-teal-600",
    about: "Mr. Amit Tiwari is one of the most sought-after science teachers in the region. His ability to correlate theoretical concepts with real-world applications gives students a deep understanding of Physics, Chemistry, and Biology. He has been instrumental in helping students crack competitive exams.",
    specializations: ["JEE/NEET Foundation", "Practical Lab Work", "Concept Building", "Numerical Problem Solving"],
    rating: 4.9,
    reviews: 278,
    topics: ["Mechanics", "Thermodynamics", "Optics", "Organic Chemistry", "Human Biology", "Genetics"],
    contact: "amit@aarambhinstitute.in",
    phone: "+91 76543 21098",
    stream: "Science",
  },
  {
    id: 4,
    name: "Ms. Kavita Joshi",
    subject: "Accountancy & Commerce",
    classes: "11th, 12th",
    exp: 10,
    qualification: "M.Com, CA (Inter), Vikram University",
    boards: ["MP Board", "CBSE"],
    achievement: "Trained 400+ commerce students",
    img: IMG_T1,
    accent: "from-purple-500 to-pink-500",
    about: "Ms. Kavita Joshi combines her professional CA background with academic excellence to deliver commerce education that is both practical and exam-oriented. Her students consistently score above 90% in Accountancy and Business Studies.",
    specializations: ["Financial Accounting", "Partnership Accounts", "Company Accounts", "Business Studies"],
    rating: 4.7,
    reviews: 142,
    topics: ["Journal & Ledger", "Trial Balance", "Final Accounts", "Ratio Analysis", "Cash Flow Statement"],
    contact: "kavita@aarambhinstitute.in",
    phone: "+91 65432 10987",
    stream: "Commerce",
  },
  {
    id: 5,
    name: "Mr. Suresh Patel",
    subject: "Hindi & Sanskrit",
    classes: "10th, 11th, 12th",
    exp: 14,
    qualification: "M.A. Hindi, Ph.D. Sanskrit, Ujjain University",
    boards: ["MP Board", "CBSE", "ICSE"],
    achievement: "Multiple state-level toppers in Hindi",
    img: IMG_T2,
    accent: "from-yellow-500 to-orange-500",
    about: "Mr. Suresh Patel is a language scholar with deep expertise in both Hindi and Sanskrit. His engaging storytelling approach makes literature come alive for students. He has authored study guides that are widely used across Madhya Pradesh.",
    specializations: ["Hindi Literature", "Sanskrit Grammar", "Essay Writing", "Poetry Analysis"],
    rating: 4.6,
    reviews: 98,
    topics: ["Kshitij & Kritika", "Shemushi Sanskrit", "Vyakaran", "Nibandh Lekhan", "Kavyanjali"],
    contact: "suresh@aarambhinstitute.in",
    phone: "+91 54321 09876",
    stream: "All Streams",
  },
  {
    id: 6,
    name: "Dr. Neha Gupta",
    subject: "Economics",
    classes: "11th, 12th",
    exp: 9,
    qualification: "Ph.D. Economics, Barkatullah University",
    boards: ["MP Board", "CBSE"],
    achievement: "95%+ average scores in Economics",
    img: IMG_T3,
    accent: "from-teal-500 to-cyan-600",
    about: "Dr. Neha Gupta makes Economics intuitive by connecting theory to real-world events. Her current affairs integration approach helps students understand economic concepts in the context of India's development, making both exams and interviews easier.",
    specializations: ["Microeconomics", "Macroeconomics", "Statistics for Economics", "Current Affairs Integration"],
    rating: 4.8,
    reviews: 112,
    topics: ["Consumer Theory", "Production & Cost", "National Income", "Money & Banking", "Government Budget"],
    contact: "neha@aarambhinstitute.in",
    phone: "+91 43210 98765",
    stream: "Commerce & Arts",
  },
];

const streams = ["All", "Science", "Commerce", "Arts & Commerce", "All Streams"];

function FacultyCard({ teacher, index }: { teacher: (typeof allFaculty)[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100"
    >
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 h-52 sm:h-auto flex-shrink-0 overflow-hidden">
          <img src={teacher.img} alt={teacher.name} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-br ${teacher.accent} opacity-20`} />
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {teacher.boards.map((b) => (
              <span key={b} className="text-[10px] px-2 py-0.5 bg-white/90 rounded-full font-bold text-gray-700">{b}</span>
            ))}
          </div>
        </div>

        <div className="p-6 flex-1">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="font-black text-xl text-gray-900">{teacher.name}</h3>
              <p className="text-orange-500 font-semibold text-sm">{teacher.subject}</p>
              <p className="text-gray-400 text-xs mt-0.5">{teacher.qualification}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 justify-end">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-gray-900">{teacher.rating}</span>
              </div>
              <p className="text-gray-400 text-xs">{teacher.reviews} reviews</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <GraduationCap className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
              <div className="font-bold text-gray-900 text-sm">{teacher.exp}+</div>
              <div className="text-gray-400 text-[10px]">Years Exp.</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <BookOpen className="w-4 h-4 text-green-500 mx-auto mb-1" />
              <div className="font-bold text-gray-900 text-xs">{teacher.classes}</div>
              <div className="text-gray-400 text-[10px]">Classes</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <Award className="w-4 h-4 text-orange-500 mx-auto mb-1" />
              <div className="font-bold text-green-600 text-[10px]">{teacher.achievement}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full font-semibold">
              {teacher.stream}
            </span>
            <button
              onClick={() => setExpanded((o) => !o)}
              className="flex items-center gap-1 text-sm text-orange-500 font-semibold hover:text-orange-600 transition-colors"
            >
              {expanded ? "Show Less" : "View Profile"}
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Detail */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 border-t border-gray-100 pt-5 bg-gray-50">
          <p className="text-gray-600 text-sm leading-relaxed mb-5">{teacher.about}</p>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-3">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {teacher.specializations.map((s) => (
                  <span key={s} className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-3">Key Topics Covered</h4>
              <ul className="space-y-1.5">
                {teacher.topics.slice(0, 4).map((t) => (
                  <li key={t} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <a href={`tel:${teacher.phone}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-orange-500 transition-colors font-medium">
              <Phone className="w-4 h-4" /> {teacher.phone}
            </a>
            <a href={`mailto:${teacher.contact}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-500 transition-colors font-medium">
              <Mail className="w-4 h-4" /> {teacher.contact}
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FacultyPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All"
    ? allFaculty
    : allFaculty.filter((f) => f.stream === filter || f.stream.includes(filter.split(" ")[0]));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 text-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            15 Expert Educators
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black mb-4">
            Our Faculty
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/75 text-xl max-w-2xl">
            Meet the passionate educators who guide students to academic excellence every day.
          </motion.p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-10">
            {[
              { label: "Years Avg. Experience", value: "13+" },
              { label: "Subject Specialists", value: "15+" },
              { label: "Boards Covered", value: "3" },
              { label: "Student Satisfaction", value: "98%" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/15">
                <div className="font-black text-2xl text-white">{value}</div>
                <div className="text-white/60 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* Filter */}
        <div className="flex items-center gap-3 flex-wrap mb-10">
          {streams.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === s ? "bg-indigo-600 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Faculty Grid */}
        <div className="space-y-6">
          {filtered.map((teacher, i) => (
            <FacultyCard key={teacher.id} teacher={teacher} index={i} />
          ))}
        </div>

        {/* Join CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-10 text-white"
        >
          <h3 className="font-black text-3xl mb-3">Want to Join Our Faculty?</h3>
          <p className="text-white/75 mb-6 max-w-lg mx-auto">We're always looking for passionate educators. If you have expertise and a love for teaching, we'd love to hear from you.</p>
          <a href="mailto:careers@aarambhinstitute.in" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 font-black rounded-xl shadow-lg hover:shadow-white/20 transition-shadow">
            <Mail className="w-5 h-5" /> Send Your CV
          </a>
        </motion.div>
      </div>
    </div>
  );
}
