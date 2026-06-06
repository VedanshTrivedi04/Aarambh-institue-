import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";

type UserRole = "student" | "teacher" | "parent" | "admin";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "", // email or username
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await api.post('/auth/login/', {
        identifier: formData.identifier,
        password: formData.password,
      });

      await login(res.data.data.access, res.data.data.refresh);

      // Fetch the real user role and redirect accordingly
      const meRes = await api.get('/auth/me/');
      const actualRole = meRes.data.data.role;

      if (actualRole === "admin") {
        navigate("/admin");
      } else if (actualRole === "teacher") {
        navigate("/teacher");
      } else if (actualRole === "student") {
        navigate("/student");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login attempt failed:", error);
      setErrorMsg(
        error.response?.data?.detail ||
        error.response?.data?.identifier?.[0] ||
        "Invalid credentials. Please check and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "student", label: "Student", icon: GraduationCap, color: "orange" },
    { value: "teacher", label: "Teacher", icon: BookOpen, color: "blue" },
    { value: "parent", label: "Parent", icon: Users, color: "green" },
    { value: "admin", label: "Admin", icon: ShieldCheck, color: "red" },
  ];

  const selectedRole = roleOptions.find(r => r.value === role);
  const placeholderHint = role === "admin"
    ? "admin@aarambh.com or aarambh_admin"
    : role === "teacher"
    ? "teacher@aarambh.com or your username"
    : "student@aarambh.com or your username";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 -left-20 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 -right-20 w-96 h-96 bg-red-200/40 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white backdrop-blur-xl border border-orange-100 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-4 shadow-lg shadow-orange-500/30"
            >
              <GraduationCap className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue to Aarambh Institute</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = role === option.value;
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setRole(option.value as UserRole)}
                    className={`relative p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                      isSelected
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-gray-50 hover:border-orange-300"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isSelected ? "text-orange-500" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        isSelected ? "text-orange-600" : "text-gray-600"
                      }`}
                    >
                      {option.label}
                    </span>
                    {isSelected && (
                      <motion.div
                        layoutId="role-indicator"
                        className="absolute inset-0 rounded-xl border-2 border-orange-500 pointer-events-none"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100"
              >
                {errorMsg}
              </motion.div>
            )}

            {/* Email or Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email / Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="login-identifier"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  placeholder={placeholderHint}
                  autoComplete="username"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Role hint */}
            <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
              Signing in as: <span className="font-semibold text-orange-500">{selectedRole?.label}</span>
              {" "}— credentials are set by the Admin.
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2 mt-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
