import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  MessageSquare,
  BarChart3,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const navItems = [
  { section: "OVERVIEW", items: [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  ]},
  { section: "MANAGEMENT", items: [
    { label: "Students", path: "/admin/students", icon: Users },
    { label: "Teachers", path: "/admin/teachers", icon: GraduationCap },
    { label: "Content", path: "/admin/content", icon: FileText },
  ]},
  { section: "ENGAGEMENT", items: [
    { label: "Queries", path: "/admin/queries", icon: MessageSquare },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  ]},
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin") return "Dashboard";
    if (path.includes("students")) return "Student Management";
    if (path.includes("teachers")) return "Teacher Management";
    if (path.includes("content")) return "Content Management";
    if (path.includes("queries")) return "Query Management";
    if (path.includes("analytics")) return "Analytics";
    return "Admin Panel";
  };

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading Admin...</div>;
  }

  const initials = (user.first_name?.[0] || '') + (user.last_name?.[0] || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 shadow-lg ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-gray-900 font-bold text-lg">Aarambh</div>
              <div className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-600 border border-orange-200 inline-block">
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-280px)]">
          {navItems.map((section) => (
            <div key={section.section}>
              <div className="text-gray-400 text-xs font-semibold mb-3 px-3">
                {section.section}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
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
              </div>
            </div>
          ))}
        </nav>

        {/* Profile Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold uppercase">
              {initials || "AD"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 text-sm font-semibold truncate">
                {user.first_name} {user.last_name}
              </div>
              <div className="text-gray-500 text-xs capitalize">{user.role}</div>
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Topbar */}
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
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-gray-900 text-sm placeholder-gray-400 w-48"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm uppercase">
              {initials || "AD"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
