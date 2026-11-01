import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Drive, Company, Application, TPODashboardStats } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { 
  Building2, Users, Award, TrendingUp, Plus, 
  Trash2, Eye, Calendar, DollarSign, CheckCircle2, 
  BarChart3, ShieldCheck, Search, Filter, Globe, Mail,
  Briefcase, ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { TableSkeleton } from '../ui/Skeleton';
import { useToast } from '../ui/Toast';
import { CreateDriveWizard } from '../modals/CreateDriveWizard';
import { CompanyModal } from '../modals/CompanyModal';
import { CandidateDetailsDrawer } from '../modals/CandidateDetailsDrawer';

interface PlacementOfficerPortalProps {
  currentTab: string;
}

export const PlacementOfficerPortal: React.FC<PlacementOfficerPortalProps> = ({ currentTab }) => {
  const { toast } = useToast();

  const [stats, setStats] = useState<TPODashboardStats | null>(null);
  const [drives, setDrives] = useState<Drive[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [allApplicants, setAllApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isDriveWizardOpen, setIsDriveWizardOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, drivesData, companiesData] = await Promise.all([
        api.getTPOStats(),
        api.listDrives(),
        api.listCompanies()
      ]);
      setStats(statsData);
      setDrives(drivesData);
      setCompanies(companiesData);

      // Load applicants for all drives to populate the pipeline
      const appsPromises = drivesData.map(d => api.getDriveApplicants(d.id).catch(() => []));
      const appsResults = await Promise.all(appsPromises);
      const combined = appsResults.flat();
      setAllApplicants(combined);
    } catch (err: any) {
      console.error("Failed to load TPO data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteDrive = async (id: string) => {
    if (!confirm("Are you sure you want to remove this placement drive?")) return;
    try {
      await api.deleteDrive(id);
      toast({ type: 'success', title: 'Drive Removed', message: 'Placement drive was deleted successfully.' });
      await fetchData();
    } catch (err: any) {
      toast({ type: 'error', title: 'Delete Failed', message: err.message });
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm("Are you sure you want to remove this company?")) return;
    try {
      await api.deleteCompany(id);
      toast({ type: 'success', title: 'Company Removed', message: 'Corporate partner deleted.' });
      await fetchData();
    } catch (err: any) {
      toast({ type: 'error', title: 'Delete Failed', message: err.message });
    }
  };

  // Filtered applicants
  const filteredApplicants = allApplicants.filter(a => {
    const matchesSearch = 
      (a.student_name || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (a.student_roll || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (a.company_name || '').toLowerCase().includes(searchFilter.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* TPO Operations Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Corporate Relations & TPO Command
              </Badge>
              <Badge variant="success">KIET Group of Institutions</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Placement Operations Central
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Autonomous campus recruitment orchestration, automated eligibility filtering, and multi-stage applicant selection pipelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCompanyModalOpen(true)}
              icon={<Building2 className="w-4 h-4 text-indigo-400" />}
            >
              + Register Company
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsDriveWizardOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Create Placement Drive
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <p className="text-[11px] font-medium text-slate-400">Total Students</p>
          <p className="text-2xl font-bold text-white mt-1">{stats?.total_students ?? 0}</p>
          <p className="text-[10px] text-slate-500 mt-2">Class of 2025</p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] font-medium text-slate-400">Placed Students</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{stats?.placed_students ?? 0}</p>
          <p className="text-[10px] text-emerald-400/90 mt-2 font-semibold">
            {stats?.placement_percentage ?? 0}% Placement Rate
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] font-medium text-slate-400">Active Drives</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{stats?.active_drives ?? 0}</p>
          <p className="text-[10px] text-slate-400 mt-2">{stats?.total_drives ?? 0} Total Drives</p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] font-medium text-slate-400">Total Offers</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">{stats?.total_offers ?? 0}</p>
          <p className="text-[10px] text-purple-400/90 mt-2 font-medium">Offers Issued</p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] font-medium text-slate-400">Highest Package</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">{stats?.highest_package_lpa ?? 0} <span className="text-xs">LPA</span></p>
          <p className="text-[10px] text-cyan-400/90 mt-2 font-medium">Dream Tier 1</p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] font-medium text-slate-400">Average Package</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{stats?.average_package_lpa ?? 0} <span className="text-xs">LPA</span></p>
          <p className="text-[10px] text-amber-400/90 mt-2 font-medium">Institution Avg</p>
        </Card>
      </div>

      {/* Department Statistics Section */}
      {(currentTab === 'overview' || currentTab === 'analytics') && (
        <Card className="p-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <CardTitle>Department-Wise Placement Performance</CardTitle>
              </div>
              <Badge variant="outline">2025 Placement Cycle</Badge>
            </div>
            <CardDescription>
              Real-time placement rates across all nine engineering departments at KIET.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {stats?.department_stats.map(dept => (
                <div key={dept.department} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-indigo-300">{dept.department}</span>
                    <span className="text-[11px] font-bold text-emerald-400">{dept.placement_rate}%</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-300">
                    <span>{dept.placed_students} / {dept.total_students} Placed</span>
                  </div>
                  <div className="mt-2 w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(dept.placement_rate, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Placement Drives */}
      {(currentTab === 'overview' || currentTab === 'drives') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Configured Placement Drives</h2>
              <p className="text-xs text-slate-400">Review corporate drives, packages, and candidate counts.</p>
            </div>
            <Button size="sm" onClick={() => setIsDriveWizardOpen(true)} icon={<Plus className="w-4 h-4" />}>
              Add Drive
            </Button>
          </div>

          {loading ? (
            <TableSkeleton rows={3} />
          ) : drives.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="w-8 h-8" />}
              title="No placement drives found"
              description="Click 'Add Drive' to publish a corporate campus drive."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {drives.map(drive => (
                <Card key={drive.id} className="p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">
                          {drive.company_name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{drive.company_name}</h4>
                          <p className="text-xs text-indigo-300 font-semibold">{drive.job_role}</p>
                        </div>
                      </div>
                      <Badge variant="success" className="text-xs">{formatCurrency(drive.package_ctc)}</Badge>
                    </div>

                    <p className="text-xs text-slate-400 mt-3 line-clamp-2">{drive.job_description}</p>

                    <div className="mt-3 text-[11px] text-slate-400 space-y-1 border-t border-slate-850 pt-2.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Min CGPA Required:</span>
                        <strong className="text-slate-200">{drive.eligibility_criteria.min_cgpa.toFixed(1)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Max Backlogs:</span>
                        <strong className="text-slate-200">{drive.eligibility_criteria.max_active_backlogs}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Deadline:</span>
                        <span className="text-slate-200">{formatDate(drive.application_deadline)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <Badge variant="primary" className="text-xs py-1 px-2.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{drive.total_applicants ?? 0} Applicants</span>
                    </Badge>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteDrive(drive.id)}
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Corporate Partners (Companies) */}
      {currentTab === 'companies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Institutional Corporate Partners</h2>
              <p className="text-xs text-slate-400">Manage registered enterprise recruiting partners and tiers.</p>
            </div>
            <Button size="sm" onClick={() => setIsCompanyModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
              Add Partner
            </Button>
          </div>

          {loading ? (
            <TableSkeleton rows={4} />
          ) : companies.length === 0 ? (
            <EmptyState
              icon={<Building2 className="w-8 h-8" />}
              title="No companies registered"
              description="Register your corporate recruiting partners to link with placement drives."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {companies.map(comp => (
                <Card key={comp.id} className="p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 text-indigo-400 font-bold flex items-center justify-center border border-indigo-500/30">
                        {comp.name.charAt(0)}
                      </div>
                      <Badge variant="purple" className="text-[10px]">{comp.tier.split(' ')[0]}</Badge>
                    </div>

                    <h4 className="font-bold text-base text-white mt-3">{comp.name}</h4>
                    <p className="text-xs text-indigo-300">{comp.industry}</p>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{comp.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{comp.location}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCompany(comp.id)}
                      icon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Candidate Pipeline */}
      {currentTab === 'applicants' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h2 className="text-lg font-bold text-white">Central Candidate Pipeline ({filteredApplicants.length})</h2>
              <p className="text-xs text-slate-400">Review student applications, qualifications, and stage transitions.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search student, roll, or company..."
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs focus:outline-none w-52 sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Stages</option>
                <option value="Applied">Applied</option>
                <option value="OA Shortlisted">OA Shortlisted</option>
                <option value="Interview Round 1">Interview Round 1</option>
                <option value="Offered">Offered</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {loading ? (
            <TableSkeleton rows={5} />
          ) : filteredApplicants.length === 0 ? (
            <EmptyState
              icon={<Users className="w-8 h-8" />}
              title="No applicants found"
              description="No candidate applications match your search query."
            />
          ) : (
            <div className="space-y-3">
              {filteredApplicants.map(app => (
                <Card key={app.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-slate-700">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{app.student_name}</span>
                      <span className="text-xs text-slate-400">({app.student_roll})</span>
                      <Badge variant="primary">{app.company_name}</Badge>
                      <Badge 
                        variant={
                          app.status === 'Offered' ? 'purple' : 
                          app.status === 'Rejected' ? 'danger' : 'success'
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-400 flex items-center gap-3">
                      <span>Dept: <strong className="text-slate-300">{app.student_department}</strong></span>
                      <span>•</span>
                      <span>CGPA: <strong className="text-emerald-400 font-bold">{app.student_cgpa?.toFixed(2)}</strong></span>
                      <span>•</span>
                      <span>Package: <strong className="text-indigo-300 font-semibold">{formatCurrency(app.package_ctc || 0)}</strong></span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedApplication(app)}
                      icon={<ChevronRight className="w-4 h-4" />}
                    >
                      Review & Advance Stage
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CreateDriveWizard
        isOpen={isDriveWizardOpen}
        onClose={() => setIsDriveWizardOpen(false)}
        onSuccess={fetchData}
      />

      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSuccess={fetchData}
      />

      <CandidateDetailsDrawer
        isOpen={!!selectedApplication}
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onStatusUpdated={fetchData}
      />
    </div>
  );
};
