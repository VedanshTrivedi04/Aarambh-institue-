import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionTitle } from "./AboutSection";
import api from "../../lib/api";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  letter: string;
  color: string;
  score?: string; // Optional since backend doesn't have it
}
const COLORS = ["#3B5BDB", "#2F9E44", "#7950F2", "#b91c1c", "#E64980"];

const testimonialsData: Testimonial[] = [
  { id: "ts1", name: "Dhruvika", role: "Parent (6th)", text: "Aarambh Institute ke teachers bahut dedicated hain. Mere bachche ke marks aur confidence dono mein kaafi improvement hua hai. Hum institute ki teaching aur guidance se bahut santusht hain.", rating: 5, letter: "D", color: COLORS[0] },
  { id: "ts2", name: "Yashika", role: "Student (7th)", text: "Aarambh Institute mein padhai ka environment bahut positive hai. Teachers har topic ko simple aur interesting tareeke se samjhate hain, jis se padhai aasan lagti hai.", rating: 5, letter: "Y", color: COLORS[1] },
  { id: "ts3", name: "Vaishnavi Patel", role: "Student (10th)", text: "Regular tests, personal attention aur progress updates ki wajah se humein bachche ki performance ka poora pata rehta hai. Aarambh Institute sach mein students ke future ko lekar serious hai.", rating: 5, letter: "V", color: COLORS[2] },
  { id: "ts4", name: "Rishabh Bhargav", role: "Student (11th)", text: "Yahan mujhe padhai ke saath motivation bhi milta hai. Teachers hamesha support karte hain aur doubts ko turant solve karte hain.", rating: 5, letter: "R", color: COLORS[3] },
  { id: "ts5", name: "Gourav Sarothiya", role: "Student (10th)", text: "Best guidance for academic success!", rating: 5, letter: "G", color: COLORS[4] },
];

export function Testimonials() {
  const testimonials = testimonialsData;
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const loading = false;

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = setInterval(() => {
      setDir(1);
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, [testimonials]);

  const go = (d: number) => {
    if (testimonials.length === 0) return;
    setDir(d);
    setCurrent((c) => (c + d + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return (
      <section className="py-28 bg-white overflow-hidden flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't render section if no testimonials
  }

  const t = testimonials[current];

  return (
    <section className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-center">

          {/* Left — Static quote section */}
          <div>
            <SectionTitle label="Testimonials" title={`What They\nSay About Us`} />

            {/* Big decorative quote mark */}
            <div
              className="text-[120px] leading-none font-black mb-[-20px] select-none"
              style={{ color: t.color, opacity: 0.15, fontFamily: "Georgia, serif" }}
            >
              "
            </div>

            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={current}
                custom={dir}
                initial={{ opacity: 0, x: dir * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -dir * 30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <p
                  className="text-gray-800 mb-8 leading-relaxed"
                  style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}
                >
                  {t.text}
                </p>

                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}
                  >
                    {t.letter}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-gray-400 text-sm">{t.role}</div>
                  </div>
                  {t.score && (
                    <div
                      className="ml-auto font-black text-2xl"
                      style={{ color: t.color }}
                    >
                      {t.score}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => go(-1)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                ←
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i); }}
                    className="transition-all rounded-full"
                    style={{
                      width: i === current ? 28 : 8,
                      height: 8,
                      backgroundColor: i === current ? t.color : "#e5e7eb",
                    }}
                  />
                ))}
              </div>
              <button
                onClick={() => go(1)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                →
              </button>
            </div>
          </div>

          {/* Right — Avatar mosaic */}
          <div className="hidden lg:grid grid-cols-3 gap-3">
            {testimonials.map((item, i) => {
              const isActive = i === current;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i); }}
                  animate={{
                    scale: isActive ? 1.06 : 1,
                    opacity: isActive ? 1 : 0.55,
                  }}
                  whileHover={{ scale: 1.04, opacity: 0.85 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative aspect-square rounded-2xl overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}30, ${item.color}10)`,
                    border: isActive ? `2px solid ${item.color}` : "2px solid transparent",
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl"
                      style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}
                    >
                      {item.letter}
                    </div>
                    <div className="text-xs font-bold text-gray-900 text-center px-2 leading-tight">
                      {item.name.split(" ")[0]}
                    </div>
                    {item.score && (
                      <div className="font-black text-sm" style={{ color: item.color }}>{item.score}</div>
                    )}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="active-glow"
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: `${item.color}10` }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
