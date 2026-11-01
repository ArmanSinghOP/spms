import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Drive, TPODashboardStats } from '../types';
import { CreateDriveModal } from './CreateDriveModal';
import { DriveApplicantsModal } from './DriveApplicantsModal';
import { 
  Building2, Users, Award, TrendingUp, Plus, 
  Trash2, Eye, Calendar, DollarSign, CheckCircle2, 
  BarChart3, ShieldCheck, Sparkles 
} from 'lucide-react';

export const TPODashboard: React.FC = () => {
  const [stats, setStats] = useState<TPODashboardStats | null>(null);
  const [drives, setDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDriveForApplicants, setSelectedDriveForApplicants] = useState<Drive | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, drivesData] = await Promise.all([
        api.getTPOStats(),
        api.listDrives()
      ]);
      setStats(statsData);
      setDrives(drivesData);
    } catch (err) {
      console.error("Failed to load TPO dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteDrive = async (driveId: string) => {
    if (!confirm("Are you sure you want to remove this placement drive and its candidate applications?")) return;
    try {
      await api.deleteDrive(driveId);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete drive');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* TPO Header & Action */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Placement Operations Central
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                KIET Group of Institutions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              TPO Administration Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage corporate campus recruitment, set automated eligibility filters, and track candidate interview rounds.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Placement Drive</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <p className="text-[11px] font-medium text-slate-400">Total Students</p>
          <p className="text-2xl font-bold text-white mt-1">{stats?.total_students ?? 0}</p>
          <p className="text-[10px] text-slate-500 mt-2">Enrolled 2025 Batch</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <p className="text-[11px] font-medium text-slate-400">Placed Students</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{stats?.placed_students ?? 0}</p>
          <p className="text-[10px] text-emerald-400/80 mt-2 font-medium">
            {stats?.placement_percentage ?? 0}% Placement Rate
          </p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <p className="text-[11px] font-medium text-slate-400">Total Drives</p>
          <p className="text-2xl font-bold text-white mt-1">{stats?.total_drives ?? 0}</p>
          <p className="text-[10px] text-indigo-400 mt-2 font-medium">{stats?.active_drives ?? 0} Currently Active</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <p className="text-[11px] font-medium text-slate-400">Total Offers</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">{stats?.total_offers ?? 0}</p>
          <p className="text-[10px] text-purple-400/80 mt-2 font-medium">Offers Extended</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <p className="text-[11px] font-medium text-slate-400">Highest Package</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">{stats?.highest_package_lpa ?? 0} <span className="text-xs">LPA</span></p>
          <p className="text-[10px] text-cyan-400/80 mt-2 font-medium">Dream Tier 1</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <p className="text-[11px] font-medium text-slate-400">Average Package</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{stats?.average_package_lpa ?? 0} <span className="text-xs">LPA</span></p>
          <p className="text-[10px] text-amber-400/80 mt-2 font-medium">Institution Avg</p>
        </div>
      </div>

      {/* Department Breakdown Section */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Department-Wise Placement Statistics</h3>
          </div>
          <span className="text-xs text-slate-400">Academic Year 2025</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats?.department_stats.map(dept => (
            <div key={dept.department} className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-indigo-300">{dept.department}</span>
                <span className="text-[11px] font-semibold text-emerald-400">{dept.placement_rate}%</span>
              </div>
              <div className="mt-2 text-xs text-slate-300">
                <span>{dept.placed_students} / {dept.total_students} Placed</span>
              </div>
              {/* Micro progress bar */}
              <div className="mt-2 w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${Math.min(dept.placement_rate, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Drives Management */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white">Active Campus Placement Drives</h3>
            <p className="text-xs text-slate-400">Review applicants, verify qualifications, and manage stages.</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
            {drives.length} Configured Drives
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading placement drives...</div>
        ) : drives.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No placement drives configured yet. Click "Create Placement Drive" to add one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {drives.map(drive => (
              <div
                key={drive.id}
                className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">
                        {drive.company_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{drive.company_name}</h4>
                        <p className="text-xs text-indigo-300">{drive.job_role}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm text-emerald-400">{drive.package_ctc} LPA</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-3 line-clamp-2">{drive.job_description}</p>

                  <div className="mt-3 text-[11px] text-slate-400 space-y-1 border-t border-slate-800/80 pt-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Eligibility Min CGPA:</span>
                      <strong className="text-slate-200">{drive.eligibility_criteria.min_cgpa.toFixed(1)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Max Backlogs:</span>
                      <strong className="text-slate-200">{drive.eligibility_criteria.max_active_backlogs}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Allowed Batches:</span>
                      <span className="text-slate-200">{drive.eligibility_criteria.allowed_batches.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedDriveForApplicants(drive)}
                    className="flex-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Applicants ({drive.total_applicants ?? 0})</span>
                  </button>

                  <button
                    onClick={() => handleDeleteDrive(drive.id)}
                    title="Delete Drive"
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateDriveModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onDriveCreated={fetchData}
      />

      <DriveApplicantsModal
        isOpen={!!selectedDriveForApplicants}
        drive={selectedDriveForApplicants}
        onClose={() => setSelectedDriveForApplicants(null)}
        onStatusUpdated={fetchData}
      />
    </div>
  );
};
