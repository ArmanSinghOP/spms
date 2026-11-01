import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogOut, UserCircle2, Sparkles, Building2, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenProfile?: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProfile, activeTab, setActiveTab }) => {
  const { user, studentProfile, logout, loginDemo } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                SPMS
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                KIET Placement Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Student Placement Management System
            </p>
          </div>
        </div>

        {/* Demo Persona Switcher for Quick Viva/Review */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-medium mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Switch Demo:
          </span>
          <button
            onClick={() => loginDemo('tpo')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              user?.role === 'tpo' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            TPO (Admin)
          </button>
          <button
            onClick={() => loginDemo('arjun')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              user?.email === 'arjun.sharma@kiet.edu' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Arjun (CSE 8.75)
          </button>
          <button
            onClick={() => loginDemo('priya')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              user?.email === 'priya.verma@kiet.edu' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Priya (ECE 6.85)
          </button>
          <button
            onClick={() => loginDemo('rohit')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              user?.email === 'rohit.singh@kiet.edu' 
                ? 'bg-cyan-600 text-white shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Rohit (Placed)
          </button>
        </div>

        {/* User Chip & Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <div className="flex items-center space-x-2.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-semibold text-sm">
                  {user.full_name?.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-semibold text-slate-200 line-clamp-1 max-w-[130px]">
                    {user.full_name}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium flex items-center gap-1">
                    {user.role === 'tpo' ? (
                      <span className="text-indigo-400 font-semibold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> TPO Officer
                      </span>
                    ) : (
                      <span>{studentProfile?.department || 'Student'} • {studentProfile?.cgpa ? `${studentProfile.cgpa} CGPA` : 'Profile'}</span>
                    )}
                  </p>
                </div>
              </div>

              {user.role === 'student' && onOpenProfile && (
                <button
                  onClick={onOpenProfile}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
                >
                  <UserCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Profile</span>
                </button>
              )}

              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="text-xs text-slate-400">Not logged in</div>
          )}
        </div>
      </div>
    </header>
  );
};
