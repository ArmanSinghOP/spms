import React, { useState } from 'react';
import { Application } from '../../types';
import { api } from '../../services/api';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { formatCurrency, formatDate } from '../../lib/utils';
import { 
  Users, Award, FileText, CheckCircle2, ChevronRight, 
  XCircle, ArrowRight, Clock, MessageSquare 
} from 'lucide-react';

interface CandidateDetailsDrawerProps {
  isOpen: boolean;
  application: Application | null;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export const CandidateDetailsDrawer: React.FC<CandidateDetailsDrawerProps> = ({
  isOpen,
  application,
  onClose,
  onStatusUpdated
}) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);
  const [remarks, setRemarks] = useState('');

  if (!isOpen || !application) return null;

  const handleUpdateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      await api.updateApplicationStatus(application.id, {
        status: newStatus,
        round_name: newStatus,
        remarks: remarks || `Advanced by placement officer to ${newStatus}`
      });
      toast({
        type: 'success',
        title: 'Candidate Status Updated',
        message: `${application.student_name} is now set to ${newStatus}.`
      });
      setRemarks('');
      onStatusUpdated();
      onClose();
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Status Update Failed',
        message: err.message || 'Could not update status'
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Review & Stage Advancement"
      description={`Application for ${application.company_name} — ${application.job_role}`}
      icon={<Users className="w-6 h-6 text-indigo-400" />}
      maxWidth="2xl"
    >
      <div className="space-y-5 pt-2">
        {/* Candidate Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white">{application.student_name}</h4>
              <p className="text-xs text-slate-400">Roll: {application.student_roll} • Email: {application.student_email}</p>
            </div>
            <Badge 
              variant={
                application.status === 'Offered' ? 'purple' : 
                application.status === 'Rejected' ? 'danger' : 'success'
              }
              className="text-xs px-3 py-1"
            >
              Current: {application.status}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-850 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Department</span>
              <strong className="text-slate-200">{application.student_department}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Cumulative CGPA</span>
              <strong className="text-emerald-400 font-bold">{application.student_cgpa?.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Drive Package</span>
              <strong className="text-indigo-300 font-bold">{formatCurrency(application.package_ctc || 0)}</strong>
            </div>
          </div>

          {application.student_resume_url && (
            <div className="pt-2 border-t border-slate-850">
              <a
                href={application.student_resume_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
              >
                <FileText className="w-4 h-4" /> View Student Resume PDF
              </a>
            </div>
          )}
        </div>

        {/* Evaluation Stage History */}
        <div>
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stage Progression Log</h5>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {application.round_history.map((entry, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{entry.round_name}</span>
                    <span className="text-[10px] text-slate-500">{new Date(entry.updated_at).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-400 mt-0.5">{entry.remarks || `Status: ${entry.status}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remarks Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Stage Transition Remarks
          </label>
          <input
            type="text"
            placeholder="e.g. Cleared online coding test with 95% test cases..."
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none"
          />
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            variant="danger"
            size="sm"
            loading={updating}
            onClick={() => handleUpdateStatus('Rejected')}
          >
            Mark Rejected
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              loading={updating}
              disabled={application.status === 'OA Shortlisted'}
              onClick={() => handleUpdateStatus('OA Shortlisted')}
            >
              Shortlist for OA
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              loading={updating}
              disabled={application.status === 'Interview Round 1'}
              onClick={() => handleUpdateStatus('Interview Round 1')}
            >
              Tech Interview Loop
            </Button>

            <Button
              type="button"
              variant="success"
              size="sm"
              loading={updating}
              disabled={application.status === 'Offered'}
              onClick={() => handleUpdateStatus('Offered')}
              icon={<Award className="w-3.5 h-3.5" />}
            >
              Issue Offer Letter
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
