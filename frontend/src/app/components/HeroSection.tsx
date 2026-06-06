import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { ArrowRight, MapPin } from "lucide-react";

const boards = ["MP Board", "CBSE", "ICSE"];

const stats3D = [
  { value: "98.2%", label: "Highest Score", sub: "Ananya S. — 2024", color: "#FF5C00", delay: 0 },
  { value: "5000+", label: "Students", sub: "Across all batches", color: "#3B5BDB", delay: 0.3 },
  { value: "15 Yrs", label: "Experience", sub: "Since 2010", color: "#2F9E44", delay: 0.6 },
];

const floatingTags = [
  { text: "MP Board", x: "8%", y: "18%", rot: -8, delay: 0.2 },
  { text: "CBSE", x: "78%", y: "12%", rot: 6, delay: 0.5 },
  { text: "ICSE", x: "72%", y: "72%", rot: -5, delay: 0.8 },
  { text: "Class X", x: "5%", y: "65%", rot: 7, delay: 1.0 },
];

function Particle({ x, y, size, dur, delay }: { x: number; y: number; size: number; dur: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/20"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{ y: [0, -30, 0], opacity: [0.15, 0.5, 0.15] }}
      transition={{ duration: dur, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

function Scene3D() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotY = useSpring(useTransform(mouseX, [-300, 300], [-8, 8]), { stiffness: 100, damping: 30 });
  const rotX = useSpring(useTransform(mouseY, [-300, 300], [6, -6]), { stiffness: 100, damping: 30 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <div
      className="relative w-full h-[480px] hidden lg:block"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
    >
      <motion.div
        style={{ rotateY: rotY, rotateX: rotX, transformStyle: "preserve-3d", width: "100%", height: "100%" }}
        className="relative"
      >
        {/* Central glowing orb */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,92,0,0.3) 0%, transparent 70%)",
            filter: "blur(20px)",
            transform: "translateX(-50%) translateY(-50%) translateZ(20px)",
          }}
        />

        {/* 3D Stat Cards */}
        {stats3D.map((s, i) => {
          const positions = [
            { x: "15%", y: "8%", z: 40, rot: -6 },
            { x: "50%", y: "35%", z: 80, rot: 2 },
            { x: "18%", y: "62%", z: 50, rot: 5 },
          ];
          const pos = positions[i];
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { delay: s.delay + 0.5, duration: 0.6 },
                scale: { delay: s.delay + 0.5, duration: 0.6 },
                y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 },
              }}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                transform: `translateZ(${pos.z}px) rotate(${pos.rot}deg)`,
              }}
              className="w-44 backdrop-blur-xl rounded-2xl border border-white/15 overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.06, z: 100 }}
            >
              <div style={{ background: `linear-gradient(135deg, ${s.color}22, ${s.color}08)`, borderTop: `3px solid ${s.color}` }}>
                <div className="p-4">
                  <div className="font-black text-2xl text-white mb-0.5" style={{ textShadow: `0 0 20px ${s.color}88` }}>
                    {s.value}
                  </div>
                  <div className="text-white/80 text-xs font-bold uppercase tracking-wider">{s.label}</div>
                  <div className="text-white/40 text-[10px] mt-1">{s.sub}</div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Right-side decorative card - Board tags */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ position: "absolute", right: "6%", top: "20%", transform: "translateZ(60px) rotate(4deg)" }}
          className="backdrop-blur-xl rounded-2xl border border-white/15 p-4 w-36 shadow-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">Boards</div>
          {boards.map((b) => (
            <div key={b} className="text-white font-semibold text-sm py-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              {b}
            </div>
          ))}
        </motion.div>

        {/* Bottom right card */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ position: "absolute", right: "8%", bottom: "14%", transform: "translateZ(30px) rotate(-3deg)" }}
          className="backdrop-blur-xl rounded-2xl border border-white/15 p-4 shadow-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-sm font-black">★</div>
            <div>
              <div className="text-white font-bold text-sm">5.0 Rating</div>
              <div className="text-white/40 text-[10px]">234 reviews</div>
            </div>
          </div>
        </motion.div>

        {/* Geometric decorations at depth */}
        <motion.div
          animate={{ rotateZ: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", right: "30%", top: "15%", transform: "translateZ(-20px)" }}
          className="w-16 h-16 border-2 border-white/10 rounded-lg opacity-40"
        />
        <motion.div
          animate={{ rotateZ: [0, -360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", left: "38%", bottom: "20%", transform: "translateZ(-40px)" }}
          className="w-10 h-10 border-2 border-orange-500/30 rounded-full opacity-60"
        />

        {/* Connection lines (fake wires between cards) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
          style={{ transform: "translateZ(0px)" }}
        >
          <line x1="30%" y1="18%" x2="60%" y2="45%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="60%" y1="45%" x2="30%" y2="72%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="30%" y1="18%" x2="80%" y2="30%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 700], [0, 180]);
  const contentOpacity = useTransform(scrollY, [0, 450], [1, 0]);
  const [boardIdx, setBoardIdx] = useState(0);

  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        dur: Math.random() * 8 + 4,
        delay: Math.random() * 5,
      })),
    []
  );

  useEffect(() => {
    const id = setInterval(() => setBoardIdx((i) => (i + 1) % boards.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(135deg, #05101F 0%, #0A1A35 50%, #0D0A1E 100%)" }}
    >
      {/* Animated particle field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      {/* Grid floor perspective */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{ y: parallaxY }}
      >
        <div
          className="w-full h-full opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            transform: "perspective(400px) rotateX(55deg)",
            transformOrigin: "bottom center",
          }}
        />
      </motion.div>

      {/* Radial glow centers */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #3B5BDB, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF5C00, transparent 70%)", filter: "blur(60px)" }} />

      {/* Floating board tags (decorative) */}
      {floatingTags.map((tag) => (
        <motion.div
          key={tag.text}
          className="absolute hidden xl:block text-xs font-bold text-white/20 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm"
          style={{ left: tag.x, top: tag.y, rotate: tag.rot }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: tag.delay + 1 }}
        >
          {tag.text}
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        className="relative z-10 flex-1 flex items-center"
        style={{ opacity: contentOpacity }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-28 lg:py-0">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center min-h-screen">

            {/* LEFT — Text */}
            <div>
              {/* Location badge */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-white/60 text-xs font-medium">Bhopal, Madhya Pradesh</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-semibold">Admissions Open</span>
              </motion.div>

              {/* Main headline */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <h1 className="leading-[0.95] mb-4" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 900 }}>
                  <span className="block text-white">Aarambh</span>
                  <span
                    className="block"
                    style={{
                      background: "linear-gradient(90deg, #FF5C00, #FF9A3C, #FFD166)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 30px rgba(255,92,0,0.4))",
                    }}
                  >
                    Institute
                  </span>
                </h1>
                <p className="text-white/50 text-lg mb-2" style={{ fontStyle: "italic", letterSpacing: "0.02em" }}>
                  आरंभ करें सफलता की ओर — Where Every Journey Begins
                </p>
              </motion.div>

              {/* Dynamic board indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 mb-8 mt-5"
              >
                <span className="text-white/30 text-sm">Excellence for</span>
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-white/50 text-xs">Class 10 · 11 · 12 ·</span>
                  <div className="h-5 overflow-hidden w-20">
                    <motion.div
                      key={boardIdx}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="text-orange-400 font-bold text-sm"
                    >
                      {boards[boardIdx]}
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 0 0 4px rgba(255,92,0,0.2), 0 20px 50px rgba(255,92,0,0.35)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-white text-base"
                  style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)", boxShadow: "0 8px 30px rgba(255,92,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" }}
                >
                  Enroll Free Demo <ArrowRight className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.querySelector("#courses")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-7 py-4 rounded-xl font-semibold text-white/70 text-base border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-colors"
                >
                  Explore Courses
                </motion.button>
              </motion.div>

              {/* Mini social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-10 flex items-center gap-4"
              >
                <div className="flex -space-x-2">
                  {["A", "R", "P", "V", "K"].map((l, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-[#05101F] flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: ["#FF5C00","#3B5BDB","#2F9E44","#7950F2","#E64980"][i] }}
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <div className="text-white/40 text-sm">
                  <span className="text-white/70 font-semibold">500+</span> students enrolled this year
                </div>
              </motion.div>
            </div>

            {/* RIGHT — 3D Scene */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Scene3D />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue line */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-medium">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent"
          animate={{ scaleY: [1, 0.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </section>
  );
}
