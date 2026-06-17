import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation, Link } from "react-router";
import { Menu, X, Phone, LogIn, PhoneCall } from "lucide-react";

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
  const [showLogo, setShowLogo] = useState(() => sessionStorage.getItem("aarambh_splash_shown") === "true");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showLogo) return;
    const handleTransition = () => setShowLogo(true);
    window.addEventListener("splash_transition_start", handleTransition);
    return () => window.removeEventListener("splash_transition_start", handleTransition);
  }, [showLogo]);

  const isDarkPage = false; 
  const alwaysDark = false; 

  const handleNavClick = (link: (typeof navLinks)[0]) => {
    setIsOpen(false);
    if (link.type === "page") {
      navigate(link.href);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
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
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            {!showLogo ? (
              <div className="w-[50px] h-[50px] opacity-0" />
            ) : (
              <img src="/logo.png" alt="Aarambh Institute" className="h-[50px] object-contain drop-shadow-sm" />
            )}
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className={`relative text-sm transition-colors group ${
                  isActive(link)
                    ? (scrolled ? "text-red-700 font-bold" : "text-white font-bold")
                    : (scrolled ? "text-slate-700 hover:text-red-700 font-medium" : "text-gray-200 hover:text-white font-medium")
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-red-700 transition-all ${
                    isActive(link) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-6 shrink-0">
            <a href="tel:+919876543210" className={`flex items-center gap-2 text-sm font-medium transition-colors ${scrolled ? 'text-slate-700 hover:text-red-700' : 'text-gray-200 hover:text-white'}`}>
              <PhoneCall className="w-4 h-4" />
              <span>+91 98765 43210</span>
            </a>
            <Link
              to="/login"
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border-2 ${scrolled ? 'border-slate-200 text-slate-700 hover:border-red-700 hover:text-red-700' : 'border-white/30 text-white hover:bg-white/10'}`}
            >
              Login
            </Link>
            <button
              onClick={() => handleNavClick(navLinks[navLinks.length - 1])}
              className="px-5 py-2.5 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-red-700/30 transition-shadow"
            >
              Enroll Now
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden transition-colors ${scrolled ? 'text-slate-800' : 'text-white'}`}
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
                      ? "bg-red-50 text-red-600"
                      : "text-gray-700 hover:bg-red-50 hover:text-red-600"
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
                className="mt-2 py-3 bg-white border-2 border-red-600 text-red-600 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleNavClick(navLinks[navLinks.length - 1]);
                }}
                className="py-3 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-xl font-semibold"
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
