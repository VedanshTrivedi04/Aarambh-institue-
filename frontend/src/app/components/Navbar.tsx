import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation, Link } from "react-router";
import { Menu, X, GraduationCap, Phone, LogIn } from "lucide-react";

const navLinks = [
  { label: "Home", type: "anchor", href: "#home", route: "/" },
  { label: "About", type: "page", href: "/about" },
  { label: "Courses", type: "page", href: "/courses" },
  { label: "Faculty", type: "page", href: "/faculty" },
  { label: "Results", type: "page", href: "/results" },
  { label: "Contact", type: "anchor", href: "#contact", route: "/" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset scroll state on dark-bg pages
  const isDarkPage = !isHome;
  const alwaysDark = isDarkPage || scrolled;

  const handleNavClick = (link: (typeof navLinks)[0]) => {
    setIsOpen(false);
    if (link.type === "page") {
      navigate(link.href);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // anchor link
    if (isHome) {
      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
  };

  const isActive = (link: (typeof navLinks)[0]) => {
    if (link.type === "page") return location.pathname === link.href;
    if (link.label === "Home") return isHome;
    return false;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        alwaysDark
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className={`font-bold text-xl tracking-tight transition-colors ${alwaysDark ? "text-gray-900" : "text-white"}`}>
                  Aarambh Institute
                </div>
                <div className={`text-xs transition-colors ${alwaysDark ? "text-orange-500" : "text-orange-300"}`}>
                  Excellence in Education
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className={`relative text-sm font-medium transition-colors group ${
                  alwaysDark ? "text-gray-700 hover:text-orange-500" : "text-white/90 hover:text-white"
                } ${isActive(link) ? "text-orange-500" : ""}`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-orange-500 transition-all ${
                    isActive(link) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+919876543210"
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${alwaysDark ? "text-gray-700" : "text-white/90"}`}
            >
              <Phone className="w-4 h-4" />
              +91 98765 43210
            </a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                alwaysDark
                  ? "bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50"
                  : "bg-white/10 border-2 border-white/20 text-white hover:bg-white/20"
              }`}
            >
              <LogIn className="w-4 h-4" />
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavClick(navLinks[navLinks.length - 1])}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-orange-500/30 transition-shadow"
            >
              Enroll Now
            </motion.button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden transition-colors ${alwaysDark ? "text-gray-800" : "text-white"}`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/98 backdrop-blur-md border-t border-gray-100 shadow-xl"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`text-left py-2.5 px-3 font-medium rounded-lg transition-colors text-sm ${
                    isActive(link)
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/login");
                }}
                className="mt-2 py-3 bg-white border-2 border-orange-500 text-orange-600 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                onClick={() => handleNavClick(navLinks[navLinks.length - 1])}
                className="py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold"
              >
                Enroll Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
