import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { SectionTitle } from "./AboutSection";
import { useTilt } from "./useTilt";
import { GraduationCap, Star, ArrowRight } from "lucide-react";
import api from "../../lib/api";

const ACCENTS = ["#3B5BDB", "#E64980", "#2F9E44", "#F59E0B", "#7950F2", "#0EA5E9"];

// Fallback placeholder images from Unsplash (in case teacher has no photo)
const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1580894732930-0babd100d356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  "https://images.unsplash.com/photo-1664382953518-4a664ab8a8c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  "https://images.unsplash.com/photo-1596496181871-9681eacf9764?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
];

interface TeacherItem {
  name: string;
  subject: string;
  classes: string;
  exp: string;
  qualification: string;
  boards: string[];
  achievement: string;
  img: string;
  accent: string;
  rating: number;
}

function FacultyCard({ teacher, index }: { teacher: TeacherItem; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const tilt = useTilt(7);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="relative h-96 cursor-pointer"
      style={{ perspective: "900px" }}
      onClick={() => setFlipped((f) => !f)}
      onMouseMove={!flipped ? (tilt.onMouseMove as any) : undefined}
      onMouseLeave={() => { tilt.onMouseLeave(); }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d", width: "100%", height: "100%", position: "relative" }}
      >
        {/* FRONT */}
        <motion.div
          style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, backfaceVisibility: "hidden" as any, transformStyle: "preserve-3d" }}
          className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
        >
          <img src={teacher.img} alt={teacher.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,10,20,0.95) 0%, rgba(5,10,20,0.4) 50%, transparent 100%)" }} />

          {/* Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${teacher.accent}, transparent)` }} />

          {/* Boards */}
          <div className="absolute top-4 right-4 flex gap-1 flex-col items-end">
            {teacher.boards.map((b) => (
              <span key={b} className="text-[10px] px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded-md text-white/70 font-semibold">{b}</span>
            ))}
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-yellow-400 text-xs font-bold ml-1">{teacher.rating}</span>
            </div>
            <h3 className="font-black text-white text-xl mb-0.5">{teacher.name}</h3>
            <div className="text-sm font-semibold mb-3" style={{ color: teacher.accent }}>{teacher.subject}</div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-white/40" />
              <span className="text-white/50 text-xs">{teacher.qualification}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 text-white/30 text-xs text-center">
              Click to see more →
            </div>
          </div>

          {/* Glare */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at ${tilt.glareX} ${tilt.glareY}, rgba(255,255,255,0.08) 0%, transparent 55%)` }}
          />
        </motion.div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-3xl p-7 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `linear-gradient(135deg, ${teacher.accent}22 0%, #05101F 100%)`,
            border: `1px solid ${teacher.accent}33`,
          }}
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: teacher.accent }}>
              {teacher.exp} Experience
            </div>
            <h3 className="font-black text-white text-xl mb-1">{teacher.name}</h3>
            <p className="text-white/40 text-sm mb-5">{teacher.classes}</p>

            <div className="p-4 rounded-2xl mb-4" style={{ backgroundColor: `${teacher.accent}12`, border: `1px solid ${teacher.accent}25` }}>
              <div className="text-[10px] uppercase tracking-wider text-white/30 font-bold mb-1">Key Achievement</div>
              <div className="text-white/80 text-sm font-semibold">{teacher.achievement}</div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {teacher.boards.map((b) => (
                <span key={b} className="text-xs px-2.5 py-1 rounded-lg text-white/50 border border-white/10 font-medium">{b}</span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-white/20 mb-3 text-center">Click to flip back</div>
            <button
              onClick={(e) => { e.stopPropagation(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
              className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
              style={{ background: `linear-gradient(135deg, ${teacher.accent}, ${teacher.accent}99)` }}
            >
              Book Demo Class <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FacultySection({ showViewAll, onViewAll }: { showViewAll?: boolean; onViewAll?: () => void } = {}) {
  const [faculty, setFaculty] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaculty() {
      try {
        const res = await api.get('/users/teachers/public/');
        const payload = res.data.data !== undefined ? res.data.data : res.data;
        const data = Array.isArray(payload) ? payload : (payload?.results || []);

        if (Array.isArray(data) && data.length > 0) {
          const mapped: TeacherItem[] = data.map((teacher: any, index: number) => {
            const profile = teacher.teacher_profile;
            const accent = ACCENTS[index % ACCENTS.length];
            const img = teacher.profile_photo
              ? teacher.profile_photo
              : FALLBACK_IMGS[index % FALLBACK_IMGS.length];

            const boards = profile?.specialization
              ? profile.specialization.split(',').slice(0, 3).map((s: string) => s.trim())
              : ["JEE", "NEET"];

            return {
              name: `${teacher.first_name} ${teacher.last_name}`,
              subject: profile?.specialization?.split(',')[0]?.trim() || "Subject Expert",
              classes: "10th · 11th · 12th",
              exp: profile?.experience_years ? `${profile.experience_years} Years` : "5+ Years",
              qualification: profile?.qualification || "M.Sc.",
              boards,
              achievement: profile?.achievement || "Helping students excel",
              img,
              accent,
              rating: parseFloat(profile?.rating) || 4.8,
            };
          });

          setFaculty(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch faculty:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFaculty();
  }, []);

  const displayCount = faculty.length;

  return (
    <section id="faculty" className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-16">
          <SectionTitle
            label="Our Faculty"
            title={`Learn From\nThe Best`}
            subtitle="Click any card to discover more about our educators. Hover to feel the depth."
          />
          {showViewAll && (
            <motion.button
              whileHover={{ scale: 1.03, x: 4 }}
              onClick={onViewAll}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-800 font-bold text-sm mb-14 transition-colors"
            >
              Meet All Faculty <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : faculty.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">Faculty information coming soon</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {faculty.map((t, i) => <FacultyCard key={t.name} teacher={t} index={i} />)}
          </div>
        )}

        {/* Bottom note */}
        {!loading && displayCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-6 px-8 rounded-2xl border border-gray-100 bg-gray-50"
          >
            <p className="text-gray-500 text-sm">
              Showing <span className="font-bold text-gray-900">{displayCount} educators</span> — dedicated to your success in JEE, NEET, and Board Exams.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
