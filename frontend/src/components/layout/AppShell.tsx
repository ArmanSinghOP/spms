import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, LayoutDashboard, Briefcase, FileText, 
  Building2, Users, BarChart3, Settings, LogOut, 
  ChevronLeft, ChevronRight, Menu, Bell, ShieldCheck, 
  Sparkles, Award, UserCheck, CheckCircle2, ChevronDown
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface AppShellProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onSelectTab,
  children
}) => {
  const { user, studentProfile, logout, loginDemo } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const role = user?.role?.toUpperCase() || 'STUDENT';
  const isTpo = role === 'PLACEMENT_OFFICER' || role === 'TPO';
  const isAdmin = role === 'ADMIN';
  const isRecruiter = role === 'RECRUITER';
  const isStudent = role === 'STUDENT';

  // Navigation Items per Role
  const navItems = isStudent
    ? [
        { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'drives', label: 'Placement Drives', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'applications', label: 'My Applications', icon: <FileText className="w-4 h-4" /> },
        { id: 'profile', label: 'Academic Profile', icon: <UserCheck className="w-4 h-4" /> }
      ]
    : isTpo
    ? [
        { id: 'overview', label: 'Executive Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'drives', label: 'Placement Drives', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'companies', label: 'Corporate Partners', icon: <Building2 className="w-4 h-4" /> },
        { id: 'applicants', label: 'Candidate Pipeline', icon: <Users className="w-4 h-4" /> },
        { id: 'analytics', label: 'Placement Analytics', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    : isRecruiter
    ? [
        { id: 'overview', label: 'Recruiter Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'drives', label: 'Active Job Drives', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'applicants', label: 'Applicant Review', icon: <Users className="w-4 h-4" /> }
      ]
    : [
        { id: 'overview', label: 'System Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'users', label: 'User Management', icon: <Users className="w-4 h-4" /> },
        { id: 'audit', label: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
        { id: 'settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> }
      ];

  const getRoleDisplayName = () => {
    if (isTpo) return 'Placement Officer (TPO)';
    if (isAdmin) return 'System Administrator';
    if (isRecruiter) return 'Corporate Recruiter';
    return 'Student Candidate';
  };

  const getRoleBadgeVariant = () => {
    if (isTpo) return 'primary';
    if (isAdmin) return 'danger';
    if (isRecruiter) return 'purple';
    return 'success';
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col lg:flex-row selection:bg-indigo-500 selection:text-white">
      {/* Mobile Header Bar */}
      <div className="lg:hidden h-16 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white">SPMS</span>
            <span className="text-[10px] text-indigo-400 block -mt-1 font-semibold">KIET Group</span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 flex flex-col border-r border-slate-800 bg-[#0a0f1d] transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${mobileOpen ? 'left-0 w-72 shadow-2xl' : '-left-full lg:left-0'}`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                    SPMS
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                    v2.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate">KIET Placement Portal</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Identity Chip */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Workspace</p>
            <div className="mt-1 flex items-center justify-between">
              <Badge variant={getRoleBadgeVariant() as any} className="text-[10px] font-bold">
                {getRoleDisplayName()}
              </Badge>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850/80'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`}>
                  {item.icon}
                </span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Card & Logout Bottom */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-500/30">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-[#0a0f1d]/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Breadcrumb / Title */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-medium">SPMS</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 font-semibold capitalize">{getRoleDisplayName()}</span>
            <span className="text-slate-600">/</span>
            <span className="text-indigo-400 font-bold capitalize">{currentTab}</span>
          </div>

          {/* Quick Demo Persona Switcher (For Evaluation & Live Viva) */}
          <div className="hidden xl:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span className="text-amber-400 flex items-center gap-1 font-bold text-[11px] mr-1">
              <Sparkles className="w-3.5 h-3.5" /> Demo Switcher:
            </span>
            <button
              onClick={() => loginDemo('tpo')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                isTpo ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              TPO Admin
            </button>
            <button
              onClick={() => loginDemo('admin')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                isAdmin ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              SysAdmin
            </button>
            <button
              onClick={() => loginDemo('arjun')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                user?.email === 'arjun.sharma@kiet.edu' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Arjun (Eligible)
            </button>
            <button
              onClick={() => loginDemo('priya')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                user?.email === 'priya.verma@kiet.edu' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Priya (ECE)
            </button>
            <button
              onClick={() => loginDemo('rohit')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                user?.email === 'rohit.singh@kiet.edu' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Rohit (Placed)
            </button>
            <button
              onClick={() => loginDemo('recruiter')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                isRecruiter ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Recruiter
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 absolute top-2 right-2 ring-2 ring-[#0a0f1d]" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-slide-up text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-white">Placement Alerts</span>
                    <span className="text-[10px] text-indigo-400">All caught up</span>
                  </div>
                  <div className="py-3 space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <p className="font-semibold text-slate-200">Google SDE Recruitment Live</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Application window closes in 5 days for CSE & IT branches.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <p className="font-semibold text-slate-200">TCS NQT Registration Open</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Open to all departments with 0 active backlogs.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* Institutional Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Student Placement Management System (SPMS) • B.Tech Capstone Project</span>
            <span>Department of Computer Science & Engineering • KIET Group of Institutions</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
