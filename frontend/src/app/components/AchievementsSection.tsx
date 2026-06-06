import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { SectionTitle } from "./AboutSection";
import { Trophy, TrendingUp, Users, Zap, ArrowRight } from "lucide-react";
import api from "../../lib/api";

const IMG_GRAD = "https://images.unsplash.com/photo-1659080910666-68793fa5d2a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzdHVkZW50JTIwYWNoaWV2ZW1lbnQlMjJzdWNjZXNzJTIwZ3JhZHVhdGlvbiUyMHRyb3BoeXxlbnwxfHx8fDE3ODA3MzAyOTB8MA&ixlib=rb-4.1.0&q=80&w=600";
const COLORS = ["#FF5C00", "#3B5BDB", "#2F9E44", "#7950F2", "#E64980", "#F59F00"];

interface Topper {
  id: string;
  name: string;
  score: string;
  board: string;
  classStr: string;
  rank: string;
  yr: string;
  letter: string;
  c: string;
}

function useCounter(target: number, duration = 2000, enabled = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let raf: number;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setCount(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, enabled]);
  return count;
}

const stats = [
  { icon: Users, label: "Students Coached", value: 5000, suffix: "+", color: "#3B5BDB", glow: "rgba(59,91,219,0.3)" },
  { icon: Trophy, label: "Board Toppers", value: 150, suffix: "+", color: "#FF5C00", glow: "rgba(255,92,0,0.3)" },
  { icon: TrendingUp, label: "Score Improvement", value: 40, suffix: "%", color: "#2F9E44", glow: "rgba(47,158,68,0.3)" },
  { icon: Zap, label: "Years of Excellence", value: 15, suffix: "+", color: "#F59F00", glow: "rgba(245,159,0,0.3)" },
];

function StatBlock({ s, enabled }: { s: (typeof stats)[0]; enabled: boolean }) {
  const count = useCounter(s.value, 2200, enabled);
  const Icon = s.icon;
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      className="relative p-6 rounded-2xl border border-white/[0.06] overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${s.color}12, rgba(255,255,255,0.02))` }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at center, ${s.glow} 0%, transparent 70%)` }} />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: `${s.color}20`, border: `1px solid ${s.color}40` }}>
          <Icon className="w-5 h-5" style={{ color: s.color }} />
        </div>
        <div className="font-black text-4xl text-white mb-1" style={{ textShadow: `0 0 30px ${s.glow}` }}>
          {count}{s.suffix}
        </div>
        <div className="text-white/40 text-sm font-medium">{s.label}</div>
      </div>
    </motion.div>
  );
}

export function AchievementsSection({ showViewAll, onViewAll }: { showViewAll?: boolean; onViewAll?: () => void } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [toppers, setToppers] = useState<Topper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchToppers() {
      try {
        const response = await api.get('/content/success-stories/');
        const payload = response.data.data !== undefined ? response.data.data : response.data;
        const data = Array.isArray(payload) ? payload : (payload?.results || []);
        
        const mapped = data.map((item: any, index: number) => ({
          id: item.id,
          name: item.student_name,
          score: item.rank_or_score,
          board: item.exam,
          classStr: item.year, // using year as a secondary string if class is not provided
          rank: "Ranked", 
          yr: item.year,
          letter: item.student_name.charAt(0).toUpperCase(),
          c: COLORS[index % COLORS.length]
        }));
        
        setToppers(mapped.slice(0, 6)); // show top 6
      } catch (error) {
        console.error("Failed to fetch success stories", error);
      } finally {
        setLoading(false);
      }
    }
    fetchToppers();
  }, []);

  return (
    <section id="results" className="py-28 bg-[#05101F] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionTitle
          label="Our Results"
          title={`Numbers That\nSpeak Truth`}
          subtitle="Every year our students prove that the right guidance changes everything."
          light
        />

        {/* Stats grid */}
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <StatBlock s={s} enabled={inView} />
            </motion.div>
          ))}
        </div>

        {/* Toppers + image */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Toppers list */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-white text-xl flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" /> Recent Toppers
              </h3>
              {showViewAll && (
                <button onClick={onViewAll} className="flex items-center gap-1 text-orange-400 font-semibold text-sm hover:text-orange-300 transition-colors">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
              </div>
            ) : toppers.length === 0 ? (
              <div className="text-white/40 text-center py-10 border border-white/10 rounded-2xl">
                More results coming soon.
              </div>
            ) : (
              <div className="space-y-2">
                {toppers.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.06] transition-colors cursor-default"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${t.c}, ${t.c}88)` }}
                    >
                      {t.letter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white/90 text-sm truncate">{t.name}</div>
                      <div className="text-white/30 text-xs">{t.board} · {t.yr}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-black text-green-400 text-base">{t.score}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right image + CTA */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden"
              style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}
            >
              <img src={IMG_GRAD} alt="Graduate" className="w-full h-64 object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,16,31,0.9) 0%, transparent 50%)" }} />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="font-black text-white text-3xl mb-1">98%+</div>
                <div className="text-white/50 text-sm">Students reach their target score</div>
              </div>
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-black">
                {new Date().getFullYear()} Batch
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border border-white/[0.08]"
              style={{ background: "linear-gradient(135deg, rgba(59,91,219,0.12), rgba(5,16,31,0.8))" }}
            >
              <div className="font-bold text-white mb-1">Ready to be the next topper?</div>
              <p className="text-white/40 text-sm mb-4">Batch starting soon. Seats are filling up fast.</p>
              <button
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full py-3 rounded-xl font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)", boxShadow: "0 8px 20px rgba(255,92,0,0.25)" }}
              >
                Book Free Demo Class
              </button>
              {showViewAll && (
                <button
                  onClick={onViewAll}
                  className="w-full mt-2 py-3 rounded-xl font-semibold text-white/40 text-sm border border-white/10 hover:border-white/20 hover:text-white/60 transition-colors"
                >
                  View All Results & Photos →
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
