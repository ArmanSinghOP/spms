import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { AppShell } from './components/layout/AppShell';
import { AuthView } from './components/AuthView';
import { StudentPortal } from './components/portals/StudentPortal';
import { PlacementOfficerPortal } from './components/portals/PlacementOfficerPortal';
import { RecruiterPortal } from './components/portals/RecruiterPortal';
import { AdminPortal } from './components/portals/AdminPortal';

const MainLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('overview');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs font-semibold tracking-wider text-slate-300">Connecting to SPMS Placement Engine...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  const role = user.role.toUpperCase();
  const isTpo = role === 'PLACEMENT_OFFICER' || role === 'TPO';
  const isAdmin = role === 'ADMIN';
  const isRecruiter = role === 'RECRUITER';

  return (
    <AppShell currentTab={currentTab} onSelectTab={setCurrentTab}>
      {isTpo ? (
        <PlacementOfficerPortal currentTab={currentTab} />
      ) : isRecruiter ? (
        <RecruiterPortal currentTab={currentTab} />
      ) : isAdmin ? (
        <AdminPortal currentTab={currentTab} />
      ) : (
        <StudentPortal currentTab={currentTab} />
      )}
    </AppShell>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
