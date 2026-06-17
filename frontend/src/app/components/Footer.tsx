import { motion } from "motion/react";
import { GraduationCap, Phone, Mail, MapPin, ArrowRight } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Faculty", href: "#faculty" },
  { label: "Results", href: "#results" },
  { label: "Contact", href: "#contact" },
];

const programs = [
  "Class 4th to 8th (All Subjects)",
  "Class 9th-12th (All Boards)",
  "College: B.COM, M.COM",
  "College: BBA, MBA, B.SC",
];

const socials = [
  { label: "FB", color: "#3B5BDB" },
  { label: "IG", color: "#E64980" },
  { label: "YT", color: "#FA5252" },
  { label: "TW", color: "#339AF0" },
];

export function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer style={{ background: "#450a0a" }}>
      {/* CTA Band */}
      <div style={{ background: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)" }} className="py-14">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-3"
          >
            Admissions Open — 2025–26
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white font-black mb-4"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)", lineHeight: 1.15 }}
          >
            Ready to Begin Your Success Story?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-white/70 mb-8 max-w-lg mx-auto"
          >
            Join thousands of students who achieved top ranks with Aarambh Institute.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollTo("#contact")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white font-black text-[#b91c1c] rounded-2xl shadow-2xl"
          >
            Enroll Now — Free Demo <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5 bg-white p-2 rounded-xl w-fit">
              <img src="/logo.png" alt="Aarambh Institute" className="h-[40px] object-contain drop-shadow-sm" />
            </div>
            <p className="text-white/30 text-sm leading-relaxed mb-6">
              Education with values. Learning with joy. Expert coaching for Class 4th to 12th and College students.
            </p>
            <div className="flex gap-2">
              {socials.map(({ label, color }) => (
                <button
                  key={label}
                  className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 text-xs font-black hover:border-white/20 hover:text-white/70 transition-colors"
                  style={{ backgroundColor: `${color}15` }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/30 mb-5">Navigation</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-white/40 hover:text-white text-sm transition-colors text-left font-medium"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/30 mb-5">Programs</h4>
            <ul className="space-y-2.5">
              {programs.map((p) => (
                <li key={p} className="text-white/40 text-sm">{p}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/30 mb-5">Get In Touch</h4>
            <ul className="space-y-4">
              {[
                { Icon: Phone, v: "88397-14081", s: "79097-14081", c: "#3B5BDB" },
                { Icon: Mail, v: "aarambhinstitute09@gmail.com", c: "#b91c1c" },
                { Icon: MapPin, v: "8 Shantinath Puri, Hawa Bangla", s: "Indore, MP", c: "#2F9E44" },
              ].map(({ Icon, v, s, c }, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${c}20` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: c }} />
                  </div>
                  <div>
                    <div className="text-white/70 text-sm font-medium">{v}</div>
                    {s && <div className="text-white/30 text-xs">{s}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-sm">© 2025 Aarambh Institute. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-white/20">
            {["Privacy Policy", "Terms", "Refund Policy"].map((t) => (
              <button key={t} className="hover:text-white/50 transition-colors">{t}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
