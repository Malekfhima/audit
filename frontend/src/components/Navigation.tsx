import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LogOut, LayoutDashboard, FileText, Scale, Building2, Workflow,
  AlertTriangle, Scale as LegalIcon, CheckCircle, FileText as ReportIcon,
  Bell, Users, Shield, Menu, X, ChevronDown, ChevronRight, Settings,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles?: string[];
  children?: { label: string; path: string; icon?: React.ReactNode }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/dashboard" },
  { label: "Audits", icon: <FileText className="w-5 h-5" />, path: "/audits" },
  { label: "Non-Conformities", icon: <AlertTriangle className="w-5 h-5" />, path: "/non-conformities" },
  { label: "Corrective Actions", icon: <CheckCircle className="w-5 h-5" />, path: "/corrective-actions" },
  { label: "Risks", icon: <AlertTriangle className="w-5 h-5" />, path: "/risks" },
  { label: "Legal", icon: <LegalIcon className="w-5 h-5" />, path: "/legal" },
  { label: "Reports", icon: <ReportIcon className="w-5 h-5" />, path: "/reports" },
  { label: "Notifications", icon: <Bell className="w-5 h-5" />, path: "/notifications" },
  {
    label: "Configuration", icon: <Settings className="w-5 h-5" />, path: "#",
    roles: ["ADMIN", "MANAGER"],
    children: [
      { label: "Norms", path: "/norms", icon: <Scale className="w-4 h-4" /> },
      { label: "Sites", path: "/sites", icon: <Building2 className="w-4 h-4" /> },
      { label: "Processes", path: "/processes", icon: <Workflow className="w-4 h-4" /> },
      { label: "Users", path: "/users", icon: <Users className="w-4 h-4" /> },
      { label: "Roles", path: "/roles", icon: <Shield className="w-4 h-4" /> },
    ],
  },
];

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children?.some((child) => location.pathname === child.path)) {
        setExpandedMenu(item.label);
      }
    });
  }, [location.pathname]);

  const isActive = (path: string) => path !== "#" && location.pathname === path;
  const isChildActive = (children: { path: string }[]) => children.some((child) => location.pathname === child.path);

  const handleNavigation = (path: string) => {
    if (path !== "#") { navigate(path); setSidebarOpen(false); }
  };

  return (
    <>
      <button onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Audit Pro</h1>
              <p className="text-xs text-gray-400">Management System</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <span className="badge-info">{user?.role}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            if (item.roles && !item.roles.includes(user?.role || "")) return null;
            if (item.children) {
              const isExpanded = expandedMenu === item.label || isChildActive(item.children);
              return (
                <div key={item.label}>
                  <button onClick={() => setExpandedMenu(isExpanded ? null : item.label)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isExpanded
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}>
                    <div className="flex items-center gap-3">
                      {item.icon}<span>{item.label}</span>
                    </div>
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-0.5 animate-slide-down">
                      {item.children.map((child) => (
                        <button key={child.path} onClick={() => handleNavigation(child.path)}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isActive(child.path)
                              ? "bg-indigo-50 text-indigo-700 font-medium"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          }`}>
                          {child.icon}<span>{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <button key={item.path} onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                {item.icon}<span>{item.label}</span>
                {isActive(item.path) && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-3 border-t border-gray-100">
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
            <LogOut className="w-5 h-5" /><span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
