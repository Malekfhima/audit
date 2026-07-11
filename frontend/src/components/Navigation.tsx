import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LogOut, LayoutDashboard, FileText, Scale, Building2, Workflow,
  AlertTriangle, Scale as LegalIcon, CheckCircle, FileText as ReportIcon,
  Bell, Users, Shield, Menu, X, ChevronDown, ChevronRight, Settings, ShieldCheck,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles?: string[];
  children?: { label: string; path: string; icon?: React.ReactNode }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-[18px] h-[18px]" />, path: "/dashboard" },
  { label: "Audits", icon: <FileText className="w-[18px] h-[18px]" />, path: "/audits" },
  { label: "Non-Conformities", icon: <AlertTriangle className="w-[18px] h-[18px]" />, path: "/non-conformities" },
  { label: "Corrective Actions", icon: <CheckCircle className="w-[18px] h-[18px]" />, path: "/corrective-actions" },
  { label: "Risks", icon: <AlertTriangle className="w-[18px] h-[18px]" />, path: "/risks" },
  { label: "Legal", icon: <LegalIcon className="w-[18px] h-[18px]" />, path: "/legal" },
  { label: "Reports", icon: <ReportIcon className="w-[18px] h-[18px]" />, path: "/reports" },
  { label: "Notifications", icon: <Bell className="w-[18px] h-[18px]" />, path: "/notifications" },
  {
    label: "Configuration", icon: <Settings className="w-[18px] h-[18px]" />, path: "#",
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-[#0B1220] rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
        <Menu className="w-5 h-5 text-[#D9C79A]" />
      </button>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-[#0B1220] flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>

        {/* faint ledger-line texture, consistent with the auth pages */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0, transparent 27px, #D9C79A 27px, #D9C79A 28px)',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-9 h-9 rounded-md border border-[#B8873D]/40 flex items-center justify-center">
              <ShieldCheck className="w-[18px] h-[18px] text-[#D9C79A]" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="font-mono text-[13px] tracking-[0.18em] text-[#F2EFE6] leading-tight">AUDIT PRO</h1>
              <p className="text-[11px] text-[#5A6273]">Management System</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-5 h-5 text-[#8B93A7]" />
          </button>
        </div>

        {/* User Info */}
        <div className="relative z-10 px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[#0B1220] font-semibold text-xs bg-[#D9C79A]">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#F2EFE6] truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-[#5A6273] truncate">{user?.email}</p>
            </div>
            <span className="font-mono text-[10px] tracking-wide uppercase text-[#D9C79A] border border-[#B8873D]/40 rounded px-1.5 py-0.5">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            if (item.roles && !item.roles.includes(user?.role || "")) return null;
            if (item.children) {
              const isExpanded = expandedMenu === item.label || isChildActive(item.children);
              return (
                <div key={item.label}>
                  <button onClick={() => setExpandedMenu(isExpanded ? null : item.label)}
                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isExpanded
                        ? "bg-white/[0.06] text-[#F2EFE6]"
                        : "text-[#8B93A7] hover:bg-white/[0.04] hover:text-[#F2EFE6]"
                    }`}>
                    <div className="flex items-center gap-3">
                      {item.icon}<span>{item.label}</span>
                    </div>
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-0.5 space-y-0.5 animate-slide-down border-l border-white/10 pl-3">
                      {item.children.map((child) => (
                        <button key={child.path} onClick={() => handleNavigation(child.path)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isActive(child.path)
                              ? "text-[#D9C79A] font-medium"
                              : "text-[#6B7383] hover:text-[#F2EFE6]"
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
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-[#B8873D]/[0.14] text-[#D9C79A]"
                    : "text-[#8B93A7] hover:bg-white/[0.04] hover:text-[#F2EFE6]"
                }`}>
                {item.icon}<span>{item.label}</span>
                {isActive(item.path) && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D9C79A]" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="relative z-10 px-3 py-3 border-t border-white/10">
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-[#8B93A7] hover:bg-white/[0.04] hover:text-[#E6A392] transition-all duration-200">
            <LogOut className="w-[18px] h-[18px]" /><span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
