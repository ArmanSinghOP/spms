import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, Sparkles, ShieldCheck, UserCheck, 
  ArrowRight, CheckCircle2, AlertCircle, Building2, Lock, Mail, User 
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, register, loginDemo, loading } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register specific fields
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'student' | 'tpo'>('student');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [cgpa, setCgpa] = useState(8.0);

  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register({
        email,
        password,
        full_name: fullName,
        role,
        roll_number: role === 'student' ? rollNumber : undefined,
        department: role === 'student' ? department : undefined,
        cgpa: role === 'student' ? Number(cgpa) : undefined,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#080c14] relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 space-y-8">
        {/* Brand & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>KIET Group of Institutions • Placement Automation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Student Placement Management System
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Autonomous academic eligibility engine, recruitment pipeline tracking, and campus drive management.
          </p>
        </div>

        {/* 1-Click Interactive Demo Persona Cards (Viva & Demo Favorite) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                1-Click Instant Persona Sign-In (For Evaluation & Demo)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:block">No typing required</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* TPO */}
            <button
              onClick={() => loginDemo('tpo')}
              className="p-3.5 rounded-2xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/30 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold uppercase">
                    Admin / TPO
                  </span>
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                </div>
                <h4 className="font-bold text-sm text-white mt-2 group-hover:text-indigo-300 transition-colors">
                  Dr. Rajesh Verma
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Head Placement Officer</p>
              </div>
              <span className="text-[11px] text-indigo-400 font-semibold mt-3 flex items-center gap-1">
                Enter Dashboard <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>

            {/* Arjun Sharma */}
            <button
              onClick={() => loginDemo('arjun')}
              className="p-3.5 rounded-2xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                    Eligible Student
                  </span>
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-bold text-sm text-white mt-2 group-hover:text-emerald-300 transition-colors">
                  Arjun Sharma
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">CSE • 8.75 CGPA • 0 Backlogs</p>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold mt-3 flex items-center gap-1">
                Enter Dashboard <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>

            {/* Priya Verma */}
            <button
              onClick={() => loginDemo('priya')}
              className="p-3.5 rounded-2xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold uppercase">
                    Borderline Student
                  </span>
                  <UserCheck className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="font-bold text-sm text-white mt-2 group-hover:text-amber-300 transition-colors">
                  Priya Verma
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">ECE • 6.85 CGPA • 1 Backlog</p>
              </div>
              <span className="text-[11px] text-amber-400 font-semibold mt-3 flex items-center gap-1">
                Test Ineligibility <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>

            {/* Rohit Singh */}
            <button
              onClick={() => loginDemo('rohit')}
              className="p-3.5 rounded-2xl bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                    Placed Student
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                </div>
                <h4 className="font-bold text-sm text-white mt-2 group-hover:text-cyan-300 transition-colors">
                  Rohit Singh
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">IT • 9.20 CGPA • Microsoft Offer</p>
              </div>
              <span className="text-[11px] text-cyan-400 font-semibold mt-3 flex items-center gap-1">
                View Offer History <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>
        </div>

        {/* Traditional Credentials Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-md mx-auto space-y-5">
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'login' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'register' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. arjun.sharma@kiet.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Enter account password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In with Credentials'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Gupta"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul.gupta@kiet.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Create password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="student">Student</option>
                  <option value="tpo">TPO / Placement Officer</option>
                </select>
              </div>

              {role === 'student' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Roll Number</label>
                      <input
                        type="text"
                        required
                        placeholder="2100290100123"
                        value={rollNumber}
                        onChange={e => setRollNumber(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Branch</label>
                      <select
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                      >
                        <option value="CSE">CSE</option>
                        <option value="CSE(AIML)">CSE(AIML)</option>
                        <option value="CSIT">CSIT</option>
                        <option value="IT">IT</option>
                        <option value="ECE">ECE</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Initial CGPA (0 - 10)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      required
                      value={cgpa}
                      onChange={e => setCgpa(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-bold focus:outline-none"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
