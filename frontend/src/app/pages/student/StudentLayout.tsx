import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  MessageCircle,
  TrendingUp,
  LogOut,
  Bell,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/student", icon: LayoutDashboard },
  { label: "My Subjects", path: "/student/subjects", icon: BookOpen },
  { label: "Study Notes", path: "/student/notes", icon: FileText },
  { label: "Live Chat", path: "/student/chat", icon: MessageCircle },
  { label: "My Performance", path: "/student/performance", icon: TrendingUp },
];

export function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== 'student' && user.role !== 'admin'))) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/student") return "Dashboard";
    if (path.includes("subjects")) return "My Subjects";
    if (path.includes("notes")) return "Study Notes";
    if (path.includes("chat")) return "Live Chat";
    if (path.includes("performance")) return "My Performance";
    return "Student Portal";
  };

  const userInitials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || "S"
    : "S";

  const userName = user ? `${user.first_name} ${user.last_name}`.trim() || user.email : "Student";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-orange-500 font-bold text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 shadow-lg ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-gray-900 font-bold text-lg">Aarambh</div>
              <div className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-600 border border-green-200 inline-block">
                Student Portal
              </div>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-280px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-orange-100 border-l-2 border-orange-500 text-orange-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold uppercase">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 text-sm font-semibold truncate">{userName}</div>
              <div className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-600 inline-block truncate max-w-full">
                {user?.email || "Student"}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-gray-900 text-xl font-bold">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm uppercase">
              {userInitials}
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-8 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
