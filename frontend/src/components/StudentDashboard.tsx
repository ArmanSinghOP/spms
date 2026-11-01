import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Drive, Application, StudentDashboardStats } from '../types';
import { 
  Building2, Briefcase, DollarSign, Calendar, MapPin, 
  CheckCircle2, XCircle, Clock, ChevronRight, AlertTriangle, 
  Send, Sparkles, Award, FileText, Search, Filter, ShieldAlert
} from 'lucide-react';

interface StudentDashboardProps {
  onOpenProfile: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onOpenProfile }) => {
  const { user, studentProfile } = useAuth();

  const [drives, setDrives] = useState<Drive[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [applyingDriveId, setApplyingDriveId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'drives' | 'applications'>('drives');
  const [searchQuery, setSearchQuery] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState<'all' | 'eligible' | 'applied'>('all');
  
  // Modal for ineligibility reasons
  const [selectedIneligibleReasons, setSelectedIneligibleReasons] = useState<{ company: string; reasons: string[] } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [drivesData, appsData, statsData] = await Promise.all([
        api.listDrives(),
        api.getMyApplications(),
        api.getStudentStats()
      ]);
      setDrives(drivesData);
      setApplications(appsData);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load student data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [studentProfile]);

  const handleApply = async (driveId: string) => {
    setApplyingDriveId(driveId);
    try {
      await api.applyToDrive(driveId);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Application failed');
    } finally {
      setApplyingDriveId(null);
    }
  };

  // Filter drives
  const filteredDrives = drives.filter(drive => {
    const matchesSearch = 
      drive.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.job_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (eligibilityFilter === 'eligible') {
      return drive.user_eligibility?.eligible && !drive.has_applied;
    }
    if (eligibilityFilter === 'applied') {
      return drive.has_applied;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                KIET Class of {studentProfile?.batch || 2025}
              </span>
              {studentProfile?.placement_status === 'placed' ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Placed Candidate 🎉
                </span>
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                  Seeking Placement
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.full_name || 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Roll: <strong className="text-white">{studentProfile?.roll_number || 'N/A'}</strong></span>
              <span>•</span>
              <span>Dept: <strong className="text-white">{studentProfile?.department || 'CSE'}</strong></span>
              <span>•</span>
              <span>CGPA: <strong className="text-emerald-400 font-semibold">{studentProfile?.cgpa?.toFixed(2) || '0.00'}</strong></span>
              <span>•</span>
              <span>Backlogs: <strong className={studentProfile?.active_backlogs ? "text-amber-400" : "text-emerald-400"}>
                {studentProfile?.active_backlogs || 0} Active
              </strong></span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenProfile}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Edit Academic Details / Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80">
          <p className="text-xs font-medium text-slate-400">Eligible Drives</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400">
              {stats?.eligible_drives_count ?? 0}
            </span>
            <span className="text-[11px] text-slate-400">of {stats?.total_active_drives ?? 0} total</span>
          </div>
          <div className="mt-3 text-[11px] text-emerald-400/90 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Verified by Engine
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800/80">
          <p className="text-xs font-medium text-slate-400">Applications Submitted</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-white">
              {stats?.applied_count ?? 0}
            </span>
            <span className="text-[11px] text-slate-400">Drives</span>
          </div>
          <div className="mt-3 text-[11px] text-indigo-400 flex items-center gap-1 font-medium">
            <Send className="w-3.5 h-3.5" /> Active Trackers
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800/80">
          <p className="text-xs font-medium text-slate-400">Shortlisted / Rounds</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-cyan-400">
              {stats?.shortlisted_count ?? 0}
            </span>
            <span className="text-[11px] text-slate-400">Processes</span>
          </div>
          <div className="mt-3 text-[11px] text-cyan-400/90 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" /> OA & Interviews
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800/80">
          <p className="text-xs font-medium text-slate-400">Offers Received</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-purple-400">
              {stats?.offers_count ?? 0}
            </span>
            <span className="text-[11px] text-slate-400">Offers</span>
          </div>
          <div className="mt-3 text-[11px] text-purple-400/90 flex items-center gap-1 font-medium">
            <Award className="w-3.5 h-3.5" /> {studentProfile?.placement_status === 'placed' ? 'Placed!' : 'In Progress'}
          </div>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('drives')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'drives'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Placement Drives ({drives.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'applications'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            My Applications ({applications.length})
          </button>
        </div>

        {activeTab === 'drives' && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search company or role..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs focus:border-indigo-500 focus:outline-none w-48 sm:w-60"
              />
            </div>

            <select
              value={eligibilityFilter}
              onChange={e => setEligibilityFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Drives</option>
              <option value="eligible">Only Eligible</option>
              <option value="applied">Applied</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1 Content: Explore Placement Drives */}
      {activeTab === 'drives' && (
        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              Loading drives and calculating academic eligibility...
            </div>
          ) : filteredDrives.length === 0 ? (
            <div className="py-16 text-center glass-panel rounded-2xl border border-slate-800 p-8">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">No placement drives found</h3>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredDrives.map(drive => {
                const isEligible = drive.user_eligibility?.eligible;
                const hasApplied = drive.has_applied;

                return (
                  <div
                    key={drive.id}
                    className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header: Company, CTC, Eligibility Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-lg text-indigo-400">
                            {drive.company_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-base text-white">{drive.company_name}</h3>
                            <p className="text-xs text-indigo-300 font-medium">{drive.job_role}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-extrabold text-white">
                            {drive.package_ctc} <span className="text-xs text-indigo-400 font-semibold">LPA</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Stipend: {drive.stipend || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Job Description */}
                      <p className="text-xs text-slate-300 mt-4 line-clamp-2 leading-relaxed">
                        {drive.job_description}
                      </p>

                      {/* Criteria Highlights */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">Min CGPA:</span>
                          <strong className="text-slate-200">{drive.eligibility_criteria.min_cgpa.toFixed(1)}</strong>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">Max Backlogs:</span>
                          <strong className="text-slate-200">{drive.eligibility_criteria.max_active_backlogs}</strong>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{drive.job_location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>Deadline: {new Date(drive.application_deadline).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Rounds Pills */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {drive.rounds.map(r => (
                          <span
                            key={r.round_number}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400"
                          >
                            R{r.round_number}: {r.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action & Eligibility Status */}
                    <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                      {hasApplied ? (
                        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Applied ({drive.application_status})</span>
                        </div>
                      ) : isEligible ? (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Eligible to Apply</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedIneligibleReasons({
                            company: drive.company_name,
                            reasons: drive.user_eligibility?.reasons || ['Criteria not satisfied']
                          })}
                          className="flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-2.5 py-1 rounded-xl transition-colors"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Ineligible (Why?)</span>
                        </button>
                      )}

                      {!hasApplied && (
                        <button
                          disabled={!isEligible || applyingDriveId === drive.id}
                          onClick={() => handleApply(drive.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            isEligible
                              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                          }`}
                        >
                          {applyingDriveId === drive.id ? (
                            'Applying...'
                          ) : (
                            <>
                              <span>1-Click Apply</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2 Content: My Applications Timeline */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="py-16 text-center glass-panel rounded-2xl border border-slate-800 p-8">
              <Send className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">No applications yet</h3>
              <p className="text-xs text-slate-400 mt-1">Browse the placement drives tab and apply with one click.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map(app => (
                <div
                  key={app.id}
                  className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-white">{app.company_name}</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                          {app.package_ctc} LPA
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{app.job_role} • Applied on {new Date(app.applied_at).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                        app.status.toLowerCase().includes('offer')
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : app.status.toLowerCase().includes('reject')
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        Current Stage: {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Multi-stage Progress Stepper */}
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-slate-400 mb-2">Recruitment Pipeline History</p>
                    <div className="space-y-2">
                      {app.round_history.map((h, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                          <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-200">{h.round_name}</span>
                              <span className="text-[10px] text-slate-400">{new Date(h.updated_at).toLocaleString()}</span>
                            </div>
                            <p className="text-slate-400 mt-0.5">{h.remarks || `Status: ${h.status}`}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Ineligibility Reasons */}
      {selectedIneligibleReasons && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-amber-400">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Eligibility Check Results</h3>
                <p className="text-xs text-slate-400">{selectedIneligibleReasons.company}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              The automated placement engine checked your profile against this drive's criteria:
            </p>

            <ul className="space-y-2">
              {selectedIneligibleReasons.reasons.map((r, i) => (
                <li key={i} className="text-xs p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedIneligibleReasons(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
