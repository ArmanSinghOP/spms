import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Application, Drive } from '../types';
import { X, Users, Award, FileText, CheckCircle2, ChevronRight, XCircle, Search, Filter } from 'lucide-react';

interface DriveApplicantsModalProps {
  isOpen: boolean;
  drive: Drive | null;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

export const DriveApplicantsModal: React.FC<DriveApplicantsModalProps> = ({ 
  isOpen, drive, onClose, onStatusUpdated 
}) => {
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const fetchApplicants = async () => {
    if (!drive) return;
    setLoading(true);
    try {
      const data = await api.getDriveApplicants(drive.id);
      setApplicants(data);
    } catch (err) {
      console.error("Failed to load applicants", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && drive) {
      fetchApplicants();
    }
  }, [isOpen, drive]);

  if (!isOpen || !drive) return null;

  const handleUpdateStatus = async (appId: string, newStatus: string, remarks?: string) => {
    setUpdatingAppId(appId);
    try {
      await api.updateApplicationStatus(appId, {
        status: newStatus,
        round_name: newStatus,
        remarks: remarks || `Advanced by TPO to ${newStatus}`
      });
      await fetchApplicants();
      if (onStatusUpdated) onStatusUpdated();
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    } finally {
      setUpdatingAppId(null);
    }
  };

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = 
      (app.student_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.student_roll || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.student_department || '').toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (stageFilter !== 'all' && app.status !== stageFilter) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                {drive.company_name}
              </span>
              <span className="text-xs text-slate-400">Package: {drive.package_ctc} LPA</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mt-1">
              Candidate Applications Pipeline ({applicants.length} Total)
            </h2>
            <p className="text-xs text-slate-400">
              Role: {drive.job_role} • Min CGPA: {drive.eligibility_criteria.min_cgpa}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, roll, or dept..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Stages</option>
            <option value="Applied">Applied</option>
            <option value="OA Shortlisted">OA Shortlisted</option>
            <option value="Interview Round 1">Interview Round 1</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Applicants Table */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">Loading applicants...</div>
          ) : filteredApplicants.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No applicants found matching this query.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplicants.map(app => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Candidate Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{app.student_name}</span>
                      <span className="text-xs text-slate-400">({app.student_roll})</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                        app.status === 'Offered'
                          ? 'bg-purple-500/20 text-purple-300'
                          : app.status === 'Rejected'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 flex items-center gap-3">
                      <span>Dept: <strong className="text-slate-300">{app.student_department}</strong></span>
                      <span>•</span>
                      <span>CGPA: <strong className="text-emerald-400 font-semibold">{app.student_cgpa?.toFixed(2)}</strong></span>
                      <span>•</span>
                      <span>Email: <span className="text-slate-300">{app.student_email}</span></span>
                    </p>

                    {app.student_resume_url && (
                      <div className="pt-1">
                        <a
                          href={app.student_resume_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium"
                        >
                          <FileText className="w-3.5 h-3.5" /> View Uploaded Resume
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Stage Advancement Action Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <button
                      disabled={updatingAppId === app.id || app.status === 'OA Shortlisted'}
                      onClick={() => handleUpdateStatus(app.id, 'OA Shortlisted')}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 transition-all disabled:opacity-30"
                    >
                      Shortlist OA
                    </button>

                    <button
                      disabled={updatingAppId === app.id || app.status === 'Interview Round 1'}
                      onClick={() => handleUpdateStatus(app.id, 'Interview Round 1')}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/30 transition-all disabled:opacity-30"
                    >
                      Tech Interview
                    </button>

                    <button
                      disabled={updatingAppId === app.id || app.status === 'Offered'}
                      onClick={() => handleUpdateStatus(app.id, 'Offered', `Offer granted with package ${drive.package_ctc} LPA`)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30 transition-all flex items-center gap-1 disabled:opacity-30"
                    >
                      <Award className="w-3.5 h-3.5" /> Mark Offered
                    </button>

                    <button
                      disabled={updatingAppId === app.id || app.status === 'Rejected'}
                      onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/30 transition-all disabled:opacity-30"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
