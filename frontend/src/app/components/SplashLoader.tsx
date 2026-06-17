import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function SplashLoader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"drawing" | "holding" | "fading">("drawing");

  useEffect(() => {
    // Phase 1: Drawing animation plays for 7 seconds
    const t1 = setTimeout(() => setPhase("holding"), 7000);
    // Phase 2: Hold for 1.5 seconds
    const t2 = setTimeout(() => setPhase("fading"), 8500);
    // Phase 3: Fade out everything, wait 1.5s for blur to lift
    const t3 = setTimeout(() => onDone(), 10000);
    
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  // Framer motion variants for drawing the SVG paths
  const drawLine = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 3.5, bounce: 0 },
        opacity: { duration: 0.2 }
      }
    }
  };

  return (
    <AnimatePresence>
      {phase !== "fading" ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* ── Blurred backdrop (light frosted glass) ── */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(20px) saturate(1.2)",
              WebkitBackdropFilter: "blur(20px) saturate(1.2)",
              background: "rgba(255, 255, 255, 0.75)",
            }}
          />

          {/* ── Loader Content ── */}
          <div className="relative z-10 flex flex-col items-center select-none">
            
            {/* ── Magical Open Book SVG Animation ── */}
            <motion.svg
              viewBox="0 0 200 120"
              className="w-40 h-32 mb-2 drop-shadow-[0_10px_20px_rgba(185,28,28,0.2)]"
              fill="none"
              initial="hidden"
              animate="visible"
            >
              <defs>
                <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />   {/* red-500 */}
                  <stop offset="100%" stopColor="#7f1d1d" /> {/* red-900 */}
                </linearGradient>
              </defs>

              <g stroke="url(#bookGradient)" strokeLinecap="round" strokeLinejoin="round">
                {/* Left Page Outline */}
                <motion.path 
                  variants={drawLine} 
                  strokeWidth="3"
                  d="M100,100 Q50,100 20,70 L20,25 Q50,55 100,55 Z" 
                />
                {/* Right Page Outline */}
                <motion.path 
                  variants={drawLine} 
                  strokeWidth="3"
                  d="M100,100 Q150,100 180,70 L180,25 Q150,55 100,55 Z" 
                  transition={{ delay: 0.3 }} 
                />
                
                {/* Center Spine */}
                <motion.line 
                  variants={drawLine} 
                  strokeWidth="4"
                  x1="100" y1="55" x2="100" y2="100" 
                  transition={{ delay: 0.6 }} 
                />

                {/* Left Page Text Lines */}
                <motion.path variants={drawLine} strokeWidth="2" opacity="0.6" d="M35,45 Q60,65 90,65" transition={{ delay: 0.9 }} />
                <motion.path variants={drawLine} strokeWidth="2" opacity="0.6" d="M35,55 Q60,75 90,75" transition={{ delay: 1.1 }} />
                
                {/* Right Page Text Lines */}
                <motion.path variants={drawLine} strokeWidth="2" opacity="0.6" d="M165,45 Q140,65 110,65" transition={{ delay: 1.3 }} />
                <motion.path variants={drawLine} strokeWidth="2" opacity="0.6" d="M165,55 Q140,75 110,75" transition={{ delay: 1.5 }} />
              </g>

              {/* ── Sun Rays emerging from the book (Brand Connection) ── */}
              <g stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
                {/* Center up ray */}
                <motion.line variants={drawLine} x1="100" y1="40" x2="100" y2="10" transition={{ delay: 2.0 }} />
                {/* Top left ray */}
                <motion.line variants={drawLine} x1="85" y1="45" x2="55" y2="20" transition={{ delay: 2.2 }} />
                {/* Top right ray */}
                <motion.line variants={drawLine} x1="115" y1="45" x2="145" y2="20" transition={{ delay: 2.4 }} />
                {/* Far left ray */}
                <motion.line variants={drawLine} x1="70" y1="55" x2="35" y2="40" transition={{ delay: 2.6 }} />
                {/* Far right ray */}
                <motion.line variants={drawLine} x1="130" y1="55" x2="165" y2="40" transition={{ delay: 2.8 }} />
              </g>

              {/* Magical sparkling dot above the spine */}
              <motion.circle 
                cx="100" cy="40" r="4" fill="#fcd34d"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: 1 }}
                transition={{ duration: 1, delay: 3.2, type: "spring" }}
              />
            </motion.svg>

            {/* ── Brand Name & Tagline ── */}
            <div className="flex flex-col items-center overflow-hidden">
              <motion.h1
                className="text-3xl md:text-5xl font-black text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #ef4444, #7f1d1d)" }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 3.5, ease: "backOut" }}
              >
                AARAMBH
              </motion.h1>

              <motion.div
                className="text-red-800 tracking-[0.6em] text-xs md:text-sm font-bold uppercase mt-1"
                initial={{ opacity: 0, letterSpacing: "0.2em", y: -10 }}
                animate={{ opacity: 1, letterSpacing: "0.6em", y: 0 }}
                transition={{ duration: 1.5, delay: 4.2, ease: "easeOut" }}
              >
                INSTITUTE
              </motion.div>

              <motion.div
                className="text-slate-500 tracking-[0.3em] text-[10px] md:text-xs uppercase mt-3 font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 4.8 }}
              >
                Step Towards Success
              </motion.div>
            </div>

            {/* ── Theme Progress Bar ── */}
            <motion.div
              className="w-64 h-1 bg-red-100 rounded-full overflow-hidden mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-red-800 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 7.0, delay: 1.0, ease: "linear" }}
                style={{ boxShadow: "0 0 10px rgba(185,28,28,0.5)" }}
              />
            </motion.div>

          </div>
        </motion.div>
      ) : (
        /* ── Fade out blur and loader ── */
        <motion.div
          key="fadeout"
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            backdropFilter: "blur(20px) saturate(1.2)",
            WebkitBackdropFilter: "blur(20px) saturate(1.2)",
            background: "rgba(255, 255, 255, 0.75)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
