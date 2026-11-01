import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Drive, Application, StudentDashboardStats } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { 
  Building2, Briefcase, DollarSign, Calendar, MapPin, 
  CheckCircle2, XCircle, Clock, ChevronRight, AlertTriangle, 
  Send, Sparkles, Award, FileText, Search, ShieldAlert, 
  UserCheck, Upload, ArrowUpRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/EmptyState';
import { TableSkeleton } from '../ui/Skeleton';
import { useToast } from '../ui/Toast';

interface StudentPortalProps {
  currentTab: string;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ currentTab }) => {
  const { user, studentProfile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const [drives, setDrives] = useState<Drive[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyingDriveId, setApplyingDriveId] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState<'all' | 'eligible' | 'applied'>('all');

  // Ineligibility Reason Modal
  const [ineligibleModalData, setIneligibleModalData] = useState<{ company: string; reasons: string[] } | null>(null);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    roll_number: '',
    department: 'CSE',
    batch: 2025,
    cgpa: 7.5,
    tenth_percentage: 80.0,
    twelfth_percentage: 80.0,
    active_backlogs: 0,
    history_backlogs: 0,
    skills_input: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

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
    } catch (err: any) {
      console.error("Failed to load student data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [studentProfile]);

  useEffect(() => {
    if (studentProfile) {
      setProfileForm({
        roll_number: studentProfile.roll_number || '',
        department: studentProfile.department || 'CSE',
        batch: studentProfile.batch || 2025,
        cgpa: studentProfile.cgpa ?? 7.5,
        tenth_percentage: studentProfile.tenth_percentage ?? 80.0,
        twelfth_percentage: studentProfile.twelfth_percentage ?? 80.0,
        active_backlogs: studentProfile.active_backlogs ?? 0,
        history_backlogs: studentProfile.history_backlogs ?? 0,
        skills_input: (studentProfile.skills || []).join(', ')
      });
    }
  }, [studentProfile]);

  const handleApply = async (driveId: string, companyName: string) => {
    setApplyingDriveId(driveId);
    try {
      await api.applyToDrive(driveId);
      toast({
        type: 'success',
        title: 'Application Submitted!',
        message: `Your application to ${companyName} was recorded and eligibility confirmed.`
      });
      await fetchData();
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Application Failed',
        message: err.message || 'Could not submit application'
      });
    } finally {
      setApplyingDriveId(null);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const skills = profileForm.skills_input
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      await api.updateMyStudentProfile({
        roll_number: profileForm.roll_number,
        department: profileForm.department,
        batch: Number(profileForm.batch),
        cgpa: Number(profileForm.cgpa),
        tenth_percentage: Number(profileForm.tenth_percentage),
        twelfth_percentage: Number(profileForm.twelfth_percentage),
        active_backlogs: Number(profileForm.active_backlogs),
        history_backlogs: Number(profileForm.history_backlogs),
        skills
      });

      if (resumeFile) {
        await api.uploadResume(resumeFile);
      }

      await refreshProfile();
      toast({
        type: 'success',
        title: 'Academic Metrics Saved',
        message: 'Your profile has been updated and drive eligibility was recalculated.'
      });
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update profile'
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // Filter Drives
  const filteredDrives = drives.filter(d => {
    const matchesSearch = 
      d.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.job_role.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (eligibilityFilter === 'eligible') return d.user_eligibility?.eligible && !d.has_applied;
    if (eligibilityFilter === 'applied') return d.has_applied;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overview Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="primary">KIET Class of {studentProfile?.batch || 2025}</Badge>
              {studentProfile?.placement_status === 'placed' ? (
                <Badge variant="success" className="flex items-center gap-1 font-bold">
                  <Award className="w-3.5 h-3.5" /> Placed Candidate 🎉
                </Badge>
              ) : (
                <Badge variant="default">Placement In-Progress</Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {user?.full_name || 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Roll: <strong className="text-white">{studentProfile?.roll_number}</strong></span>
              <span>•</span>
              <span>Dept: <strong className="text-white">{studentProfile?.department}</strong></span>
              <span>•</span>
              <span>CGPA: <strong className="text-emerald-400 font-bold">{studentProfile?.cgpa?.toFixed(2)}</strong></span>
              <span>•</span>
              <span>Active Backlogs: <strong className={studentProfile?.active_backlogs ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                {studentProfile?.active_backlogs || 0}
              </strong></span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-right">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Resume Status</p>
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified on File
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-xs font-medium text-slate-400">Eligible Drives</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-400">
              {stats?.eligible_drives_count ?? 0}
            </span>
            <span className="text-xs text-slate-400">of {stats?.total_active_drives ?? 0} total</span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-400/90 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Engine
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-medium text-slate-400">Applications Submitted</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">
              {stats?.applied_count ?? 0}
            </span>
            <span className="text-xs text-slate-400">Opportunities</span>
          </div>
          <p className="mt-2 text-[11px] text-indigo-400 flex items-center gap-1 font-semibold">
            <Send className="w-3.5 h-3.5" /> Active in Pipeline
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-medium text-slate-400">Shortlisted / Rounds</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-cyan-400">
              {stats?.shortlisted_count ?? 0}
            </span>
            <span className="text-xs text-slate-400">Assessments</span>
          </div>
          <p className="mt-2 text-[11px] text-cyan-400 flex items-center gap-1 font-semibold">
            <Clock className="w-3.5 h-3.5" /> OA & Interviews
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-medium text-slate-400">Offers Received</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-purple-400">
              {stats?.offers_count ?? 0}
            </span>
            <span className="text-xs text-slate-400">Offers</span>
          </div>
          <p className="mt-2 text-[11px] text-purple-400 flex items-center gap-1 font-semibold">
            <Award className="w-3.5 h-3.5" /> {studentProfile?.placement_status === 'placed' ? 'Placed!' : 'In Review'}
          </p>
        </Card>
      </div>

      {/* Main Tab Views */}
      {currentTab === 'overview' || currentTab === 'drives' ? (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h2 className="text-lg font-bold text-white">Campus Placement Opportunities</h2>
              <p className="text-xs text-slate-400">
                Explore campus drives with automated academic qualification verification.
              </p>
            </div>

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
                <option value="applied">Already Applied</option>
              </select>
            </div>
          </div>

          {loading ? (
            <TableSkeleton rows={4} />
          ) : filteredDrives.length === 0 ? (
            <EmptyState
              icon={<Building2 className="w-8 h-8" />}
              title="No placement drives found"
              description="No drives match your current search criteria or eligibility filter."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredDrives.map(drive => {
                const isEligible = drive.user_eligibility?.eligible;
                const hasApplied = drive.has_applied;

                return (
                  <Card key={drive.id} className="flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-lg text-indigo-400">
                            {drive.company_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-base text-white">{drive.company_name}</h3>
                            <p className="text-xs text-indigo-300 font-semibold">{drive.job_role}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-black text-white">{formatCurrency(drive.package_ctc)}</span>
                          <span className="text-[10px] text-slate-400 block">Stipend: {drive.stipend || 'N/A'}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-4 line-clamp-2 leading-relaxed">
                        {drive.job_description}
                      </p>

                      {/* Criteria Grid */}
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
                          <span>Deadline: {formatDate(drive.application_deadline)}</span>
                        </div>
                      </div>

                      {/* Rounds */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {drive.rounds.map(r => (
                          <span
                            key={r.round_number}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400"
                          >
                            R{r.round_number}: {r.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                      {hasApplied ? (
                        <Badge variant="cyan" className="py-1 px-3">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Applied ({drive.application_status})</span>
                        </Badge>
                      ) : isEligible ? (
                        <Badge variant="success" className="py-1 px-3">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Eligible to Apply</span>
                        </Badge>
                      ) : (
                        <button
                          onClick={() => setIneligibleModalData({
                            company: drive.company_name,
                            reasons: drive.user_eligibility?.reasons || ['Academic criteria not satisfied']
                          })}
                          className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1 rounded-full transition-colors"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Ineligible (Why?)</span>
                        </button>
                      )}

                      {!hasApplied && (
                        <Button
                          disabled={!isEligible}
                          loading={applyingDriveId === drive.id}
                          onClick={() => handleApply(drive.id, drive.company_name)}
                          size="sm"
                          variant={isEligible ? "primary" : "secondary"}
                        >
                          <span>1-Click Apply</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {/* Applications View */}
      {currentTab === 'applications' && (
        <div className="space-y-6">
          <div className="pb-2">
            <h2 className="text-lg font-bold text-white">My Placement Applications & Status</h2>
            <p className="text-xs text-slate-400">
              Track your real-time recruitment progression across screening, online assessments, and interview rounds.
            </p>
          </div>

          {applications.length === 0 ? (
            <EmptyState
              icon={<Send className="w-8 h-8" />}
              title="No applications registered yet"
              description="Browse active placement drives and submit with 1-click verification."
            />
          ) : (
            <div className="space-y-4">
              {applications.map(app => (
                <Card key={app.id} className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-white">{app.company_name}</h3>
                        <Badge variant="primary">{formatCurrency(app.package_ctc || 0)}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{app.job_role} • Applied on {formatDate(app.applied_at)}</p>
                    </div>

                    <Badge 
                      variant={
                        app.status.toLowerCase().includes('offer') ? 'purple' :
                        app.status.toLowerCase().includes('reject') ? 'danger' : 'success'
                      }
                      className="text-xs px-3 py-1"
                    >
                      Stage: {app.status}
                    </Badge>
                  </div>

                  {/* Recruitment Pipeline Timeline */}
                  <div className="pt-2">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Round Evaluation History</p>
                    <div className="space-y-2">
                      {app.round_history.map((h, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                          <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-200">{h.round_name}</span>
                              <span className="text-[10px] text-slate-500">{new Date(h.updated_at).toLocaleString()}</span>
                            </div>
                            <p className="text-slate-400 mt-1">{h.remarks || `Status: ${h.status}`}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Academic Profile & Resume View */}
      {currentTab === 'profile' && (
        <Card className="max-w-3xl mx-auto p-6 sm:p-8">
          <CardHeader>
            <CardTitle>Academic Profile & Credentials</CardTitle>
            <CardDescription>
              Keep your CGPA, backlogs, and uploaded resume accurate. The placement engine uses these parameters for automatic eligibility evaluation.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">University Roll Number</label>
                <input
                  type="text"
                  required
                  value={profileForm.roll_number}
                  onChange={e => setProfileForm({ ...profileForm, roll_number: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                <select
                  value={profileForm.department}
                  onChange={e => setProfileForm({ ...profileForm, department: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  <option value="CSE">CSE</option>
                  <option value="CSE(AIML)">CSE(AIML)</option>
                  <option value="CSE(AI)">CSE(AI)</option>
                  <option value="CSIT">CSIT</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="ME">ME</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">CGPA (0-10)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={profileForm.cgpa}
                  onChange={e => setProfileForm({ ...profileForm, cgpa: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">10th Grade %</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={profileForm.tenth_percentage}
                  onChange={e => setProfileForm({ ...profileForm, tenth_percentage: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">12th Grade %</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={profileForm.twelfth_percentage}
                  onChange={e => setProfileForm({ ...profileForm, twelfth_percentage: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Active Backlogs</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={profileForm.active_backlogs}
                  onChange={e => setProfileForm({ ...profileForm, active_backlogs: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">History of Backlogs</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={profileForm.history_backlogs}
                  onChange={e => setProfileForm({ ...profileForm, history_backlogs: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Technical Skills (Comma separated)</label>
              <input
                type="text"
                value={profileForm.skills_input}
                onChange={e => setProfileForm({ ...profileForm, skills_input: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-indigo-400" /> Upload Resume Document (.pdf, .doc)
                </span>
                {studentProfile?.resume_url && (
                  <span className="text-[11px] text-emerald-400 font-bold">✓ Active file attached</span>
                )}
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setResumeFile(e.target.files[0]);
                  }
                }}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" loading={savingProfile}>
                Update Profile & Recalculate
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Ineligibility Reason Modal */}
      {ineligibleModalData && (
        <Modal
          isOpen={!!ineligibleModalData}
          onClose={() => setIneligibleModalData(null)}
          title="Eligibility Criteria Evaluation"
          description={`Automated check results for ${ineligibleModalData.company}`}
          icon={<ShieldAlert className="w-6 h-6 text-amber-400" />}
          maxWidth="md"
        >
          <div className="space-y-3 pt-2">
            <p className="text-xs text-slate-300">
              The SPMS eligibility engine identified the following discrepancies between your current academic record and the drive's requirements:
            </p>

            <div className="space-y-2">
              {ineligibleModalData.reasons.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setIneligibleModalData(null)} variant="secondary" size="sm">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
