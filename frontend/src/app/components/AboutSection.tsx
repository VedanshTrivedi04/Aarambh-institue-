import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { useTilt } from "./useTilt";

const IMG_CAMPUS = "https://images.unsplash.com/photo-1615406020658-6c4b805f1f30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjJidWlsZGluZyUyMG1vZGVybiUyMGNhbXB1cyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3ODA3MzAyODV8MA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_STUDENTS = "https://images.unsplash.com/photo-1692269725911-87697c558be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tJTIwZWR1Y2F0aW9uJTIwSW5kaWF8ZW58MXx8fHwxNzgwNzMwMjg1fDA&ixlib=rb-4.1.0&q=80&w=1080";

const highlights = [
  "15+ years of experience in guiding students",
  "1000+ students enrolled in our journey",
  "98% Board Result Rate across classes",
  "12+ Expert Faculty members",
  "Personalised attention with small batch sizes",
  "Weekly tests, study material, doubt classes",
];

const pillars = [
  { num: "01", title: "Discipline", desc: "Structured schedules and accountability build consistent study habits from day one." },
  { num: "02", title: "Dedication", desc: "Our teachers pour extra hours — pre-exam camps, weekend sessions, holiday doubt classes." },
  { num: "03", title: "Direction", desc: "Personalised study plans so every student knows exactly where to focus and how." },
];

export function SectionTitle({ label, title, subtitle, light }: { label: string; title: string; subtitle?: string; light?: boolean }) {
  return (
    <div className="mb-14">
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className={`inline-block text-[11px] font-bold tracking-[0.18em] uppercase mb-4 px-3 py-1.5 rounded-full border ${light ? "border-orange-400/30 text-orange-400 bg-orange-400/10" : "border-orange-200 text-orange-600 bg-orange-50"}`}
      >
        {label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-3xl md:text-4xl mb-4 ${light ? "text-white" : "text-gray-950"}`}
        style={{ fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em" }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className={`max-w-xl leading-relaxed ${light ? "text-white/50" : "text-gray-500"}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

export { SectionTitle as default };

function TiltImage() {
  const tilt = useTilt(10);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
      style={{ perspective: "1000px" }}
      onMouseMove={tilt.onMouseMove as any}
      onMouseLeave={tilt.onMouseLeave as any}
    >
      <motion.div
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* Main image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 40px 80px -20px rgba(0,0,0,0.4)" }}>
          <img src={IMG_CAMPUS} alt="Campus" className="w-full h-80 object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,16,31,0.7) 0%, transparent 60%)" }} />
          <div className="absolute bottom-5 left-5 text-white">
            <div className="font-bold text-sm mb-0.5">Our Campus</div>
            <div className="text-white/50 text-xs">Indore, Madhya Pradesh</div>
          </div>
        </div>

        {/* Inset second image */}
        <motion.div
          style={{ transform: "translateZ(40px)" }}
          className="absolute -bottom-10 -right-8 w-44 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-2xl"
        >
          <img src={IMG_STUDENTS} alt="Students" className="w-full h-full object-cover" />
        </motion.div>

        {/* Floating stat */}
        <motion.div
          style={{ transform: "translateZ(60px)" }}
          className="absolute -top-5 -left-5 bg-[#FF5C00] text-white rounded-2xl px-4 py-3 shadow-2xl"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="font-black text-2xl leading-none">15+</div>
          <div className="text-orange-100 text-[10px] font-semibold uppercase tracking-wider mt-0.5">Years of Trust</div>
        </motion.div>

        {/* Glare effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX} ${tilt.glareY}, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-28">
          {/* Image side */}
          <div className="relative pb-12 pr-8">
            <TiltImage />
            {/* Decorative dot grid */}
            <div className="absolute -bottom-4 -left-4 w-32 h-32 opacity-10" style={{
              backgroundImage: "radial-gradient(circle, #FF5C00 1px, transparent 1px)",
              backgroundSize: "12px 12px",
            }} />
          </div>

          {/* Content side */}
          <div>
            <SectionTitle
              label="About Aarambh"
              title={`Shaping\nFutures\nSince 2015`}
              subtitle="At Aarambh Institute we believe that the right guidance at the right time can transform a student's academic journey. Our experienced faculty, well-researched curriculum, and student-centric approach make learning both effective and engaging. As a parent myself, I know what you want: safety, learning, and happiness for your child. At Aarambh Institute you will get all three. Let's grow together. — Shobhna Vyas (Founder)"
            />

            <div className="space-y-2.5 mb-8">
              {highlights.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.03, x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg shadow-red-700/20"
              style={{ background: "linear-gradient(135deg, #b91c1c, #991b1b)" }}
            >
              Book a Free Counselling Session <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* The 3 Pillars — editorial layout */}
        <div className="relative">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-400">The Aarambh Philosophy</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="grid md:grid-cols-3 gap-0 border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            {pillars.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ backgroundColor: "#b91c1c", transition: { duration: 0.2 } }}
                className="group relative p-8 border-r border-gray-100 last:border-r-0 cursor-default overflow-hidden"
              >
                {/* Number watermark */}
                <div
                  className="absolute top-4 right-4 font-black text-7xl leading-none transition-colors duration-200"
                  style={{ color: "rgba(0,0,0,0.04)", WebkitTextStroke: "1px rgba(0,0,0,0.05)" }}
                >
                  {p.num}
                </div>
                <div className="relative z-10">
                  <div
                    className="text-xs font-bold text-orange-500 mb-3 group-hover:text-orange-400 transition-colors"
                    style={{ letterSpacing: "0.15em" }}
                  >
                    {p.num}
                  </div>
                  <h3 className="font-black text-2xl text-gray-900 group-hover:text-white mb-3 transition-colors duration-200">
                    {p.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed group-hover:text-white/60 transition-colors duration-200">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
