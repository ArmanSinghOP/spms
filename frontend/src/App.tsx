import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthView } from './components/AuthView';
import { StudentDashboard } from './components/StudentDashboard';
import { TPODashboard } from './components/TPODashboard';
import { EditProfileModal } from './components/EditProfileModal';

const MainLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs font-medium tracking-wide">Connecting to SPMS Placement Engine...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar onOpenProfile={() => setIsProfileModalOpen(true)} />

      <main className="flex-1">
        {user.role === 'student' ? (
          <StudentDashboard onOpenProfile={() => setIsProfileModalOpen(true)} />
        ) : (
          <TPODashboard />
        )}
      </main>

      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Student Placement Management System (SPMS) • B.Tech Software Engineering Project</span>
          <span>KIET Group of Institutions • Placement & Corporate Relations Cell</span>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
