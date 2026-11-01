import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Drive, Application } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { 
  Building2, Users, Award, Briefcase, FileText, 
  CheckCircle2, Clock, ChevronRight, Search, ShieldCheck 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { TableSkeleton } from '../ui/Skeleton';
import { CandidateDetailsDrawer } from '../modals/CandidateDetailsDrawer';

interface RecruiterPortalProps {
  currentTab: string;
}

export const RecruiterPortal: React.FC<RecruiterPortalProps> = ({ currentTab }) => {
  const { user } = useAuth();
  const [drives, setDrives] = useState<Drive[]>([]);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const allDrives = await api.listDrives();
      // In recruiter view, prioritize drives relevant to recruiter or show corporate drives
      setDrives(allDrives);

      if (allDrives.length > 0) {
        const apps = await api.getDriveApplicants(allDrives[0].id);
        setApplicants(apps);
      }
    } catch (err: any) {
      console.error("Failed to load recruiter data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalApplicants = applicants.length;
  const shortlistedCount = applicants.filter(a => a.status.includes('Shortlist') || a.status.includes('Interview')).length;
  const offeredCount = applicants.filter(a => a.status.includes('Offer') || a.status.includes('Selected')).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Recruiter Hero Header */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="purple" className="flex items-center gap-1 font-bold">
                <Building2 className="w-3.5 h-3.5" /> Corporate University Recruitment
              </Badge>
              <Badge variant="outline">Enterprise Portal</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Recruiter Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Screen talent, review academic credentials, assess resumes, and advance candidates through campus recruitment loops.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-right">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Assigned Recruiter</p>
            <p className="text-sm font-bold text-white mt-0.5">{user?.full_name}</p>
            <p className="text-[11px] text-purple-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Recruiter KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-xs font-medium text-slate-400">Total Applicants</p>
          <p className="text-3xl font-extrabold text-white mt-2">{totalApplicants}</p>
          <p className="text-[11px] text-indigo-400 mt-2 font-semibold">Across Active Drives</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-medium text-slate-400">Shortlisted for OA</p>
          <p className="text-3xl font-extrabold text-cyan-400 mt-2">{shortlistedCount}</p>
          <p className="text-[11px] text-cyan-400 mt-2 font-semibold">Ready for Assessment</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-medium text-slate-400">Interview Stage</p>
          <p className="text-3xl font-extrabold text-amber-400 mt-2">
            {applicants.filter(a => a.status.includes('Interview')).length}
          </p>
          <p className="text-[11px] text-amber-400 mt-2 font-semibold">Technical Loops</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-medium text-slate-400">Offers Extended</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">{offeredCount}</p>
          <p className="text-[11px] text-emerald-400 mt-2 font-semibold">Selected Candidates</p>
        </Card>
      </div>

      {/* Candidate Pipeline Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Assigned Job Drive Applicants</h2>
            <p className="text-xs text-slate-400">Evaluate student qualifications, inspect resumes, and issue decisions.</p>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={4} />
        ) : applicants.length === 0 ? (
          <EmptyState
            icon={<Users className="w-8 h-8" />}
            title="No applicants yet"
            description="Students will appear here once they submit applications for your corporate drives."
          />
        ) : (
          <div className="space-y-3">
            {applicants.map(app => (
              <Card key={app.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-slate-700">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white">{app.student_name}</span>
                    <span className="text-xs text-slate-400">({app.student_roll})</span>
                    <Badge variant={app.status === 'Offered' ? 'purple' : 'primary'}>
                      {app.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Dept: <strong className="text-slate-200">{app.student_department}</strong></span>
                    <span>•</span>
                    <span>CGPA: <strong className="text-emerald-400 font-bold">{app.student_cgpa?.toFixed(2)}</strong></span>
                    <span>•</span>
                    <span>Role: <strong className="text-indigo-300">{app.job_role}</strong></span>
                  </p>

                  {app.student_resume_url && (
                    <div className="pt-1">
                      <a
                        href={app.student_resume_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Resume PDF
                      </a>
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedApp(app)}
                  icon={<ChevronRight className="w-4 h-4" />}
                >
                  Review & Update Stage
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CandidateDetailsDrawer
        isOpen={!!selectedApp}
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
        onStatusUpdated={fetchData}
      />
    </div>
  );
};
