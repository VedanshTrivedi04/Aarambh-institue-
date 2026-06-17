import { motion } from "motion/react";

export function AarambhLogo({ className = "", layoutIdPrefix }: { className?: string; layoutIdPrefix?: string }) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <motion.div
      layoutId={layoutIdPrefix ? `${layoutIdPrefix}-logo-container` : undefined}
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ aspectRatio: "1/1" }}
    >
      {/* Sun Rays */}
      <div className="absolute inset-0 flex items-center justify-center">
        {rays.map((angle, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: "8% solid transparent",
              borderRight: "8% solid transparent",
              borderBottom: "22% solid #FFD700",
              transformOrigin: "50% 230%", // Pushes it out
              transform: `translateY(-130%) rotate(${angle}deg)`,
            }}
          />
        ))}
      </div>

      {/* Sun Circle */}
      <motion.div
        layoutId={layoutIdPrefix ? `${layoutIdPrefix}-sun` : undefined}
        className="absolute rounded-full bg-[#FFD700] w-[85%] h-[85%]"
      />

      {/* White Circle */}
      <motion.div
        layoutId={layoutIdPrefix ? `${layoutIdPrefix}-white-circle` : undefined}
        className="absolute rounded-full bg-white w-[75%] h-[75%] flex flex-col items-center justify-center overflow-hidden shadow-sm"
      >
        <motion.div
          layoutId={layoutIdPrefix ? `${layoutIdPrefix}-text-content` : undefined}
          className="flex flex-col items-center justify-center w-full h-full scale-[0.85]"
        >
          {/* Logo Top row: AA + Hindi */}
          <div className="flex items-center justify-center -ml-1">
            {/* Stylized AA */}
            <div className="relative text-[#b91c1c] font-serif" style={{ fontSize: "2.4em", lineHeight: 1 }}>
              <span style={{ position: "relative", zIndex: 2 }}>A</span>
              <span style={{ position: "absolute", left: "0.35em", top: "0.05em", zIndex: 1, fontSize: "0.8em" }}>A</span>
            </div>
            {/* Hindi Text */}
            <div className="text-[#b91c1c] font-bold" style={{ fontSize: "1.6em", marginLeft: "0.4em", fontFamily: "sans-serif", transform: "translateY(-0.1em)" }}>
              आरंभ
            </div>
          </div>
          {/* INSTITUTE */}
          <div className="text-[#b91c1c] font-black tracking-[0.2em] mt-0.5" style={{ fontSize: "1em" }}>
            INSTITUTE
          </div>
          {/* Tagline Badge */}
          <div className="bg-[#b91c1c] text-white font-bold mt-1 px-2 py-0.5 rounded-sm whitespace-nowrap" style={{ fontSize: "0.45em", letterSpacing: "1px" }}>
            STEP TOWARDS SUCCESS
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
