import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Building2, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface CreateDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDriveCreated: () => void;
}

const ALL_DEPTS = ["CSE", "CSE(AIML)", "CSE(AI)", "CSIT", "IT", "CS", "ECE", "EEE", "ME"];

export const CreateDriveModal: React.FC<CreateDriveModalProps> = ({ isOpen, onClose, onDriveCreated }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    title: '',
    job_role: '',
    job_description: '',
    package_ctc: 12.0,
    stipend: '35,000 / month',
    job_location: 'Bengaluru / Hybrid',
    drive_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    application_deadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    min_cgpa: 7.0,
    min_tenth_percentage: 65.0,
    min_twelfth_percentage: 65.0,
    max_active_backlogs: 0,
    max_history_backlogs: 1,
    allow_already_placed: false,
    allowed_departments: ["CSE", "CSE(AIML)", "CSIT", "IT"],
    allowed_batches: [2025],
    rounds: [
      { round_number: 1, name: "Online Assessment (OA)", description: "Aptitude & DSA coding test" },
      { round_number: 2, name: "Technical Interview", description: "Problem solving & fundamentals" },
      { round_number: 3, name: "HR Interview", description: "Cultural fit & communication" }
    ]
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleDept = (dept: string) => {
    if (formData.allowed_departments.includes(dept)) {
      setFormData({
        ...formData,
        allowed_departments: formData.allowed_departments.filter(d => d !== dept)
      });
    } else {
      setFormData({
        ...formData,
        allowed_departments: [...formData.allowed_departments, dept]
      });
    }
  };

  const handleAddRound = () => {
    const nextRoundNum = formData.rounds.length + 1;
    setFormData({
      ...formData,
      rounds: [
        ...formData.rounds,
        { round_number: nextRoundNum, name: `Round ${nextRoundNum}`, description: "Interview stage" }
      ]
    });
  };

  const handleRemoveRound = (idx: number) => {
    const updated = formData.rounds.filter((_, i) => i !== idx).map((r, i) => ({
      ...r,
      round_number: i + 1
    }));
    setFormData({ ...formData, rounds: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await api.createDrive({
        company_name: formData.company_name,
        title: formData.title || `${formData.job_role} Recruitment Drive`,
        job_role: formData.job_role,
        job_description: formData.job_description,
        package_ctc: Number(formData.package_ctc),
        stipend: formData.stipend,
        job_location: formData.job_location,
        drive_date: new Date(formData.drive_date).toISOString(),
        application_deadline: new Date(formData.application_deadline).toISOString(),
        status: 'active',
        eligibility_criteria: {
          min_cgpa: Number(formData.min_cgpa),
          min_tenth_percentage: Number(formData.min_tenth_percentage),
          min_twelfth_percentage: Number(formData.min_twelfth_percentage),
          max_active_backlogs: Number(formData.max_active_backlogs),
          max_history_backlogs: Number(formData.max_history_backlogs),
          allowed_departments: formData.allowed_departments,
          allowed_batches: formData.allowed_batches,
          allow_already_placed: formData.allow_already_placed
        },
        rounds: formData.rounds
      });

      onDriveCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create drive');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Create New Placement Drive</h2>
            <p className="text-xs text-slate-400">
              Configure company recruitment details, eligibility rules, and round progression.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Company & Role Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Cisco, Atlassian, Adobe"
                value={formData.company_name}
                onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Job Role *</label>
              <input
                type="text"
                required
                placeholder="e.g. Software Engineer, Cloud Architect"
                value={formData.job_role}
                onChange={e => setFormData({ ...formData, job_role: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Package CTC (LPA) *</label>
              <input
                type="number"
                step="0.1"
                min="1"
                required
                value={formData.package_ctc}
                onChange={e => setFormData({ ...formData, package_ctc: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm font-semibold text-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Internship Stipend</label>
              <input
                type="text"
                placeholder="e.g. 40,000 / month"
                value={formData.stipend}
                onChange={e => setFormData({ ...formData, stipend: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Job Location</label>
              <input
                type="text"
                value={formData.job_location}
                onChange={e => setFormData({ ...formData, job_location: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Drive Date</label>
              <input
                type="date"
                required
                value={formData.drive_date}
                onChange={e => setFormData({ ...formData, drive_date: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Application Deadline</label>
              <input
                type="date"
                required
                value={formData.application_deadline}
                onChange={e => setFormData({ ...formData, application_deadline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Job Description & Responsibilities</label>
            <textarea
              rows={2}
              required
              placeholder="Describe role requirements, team, and selection expectations..."
              value={formData.job_description}
              onChange={e => setFormData({ ...formData, job_description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm focus:outline-none"
            />
          </div>

          {/* Eligibility Criteria Section */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Automated Eligibility Criteria Configuration
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Min CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.min_cgpa}
                  onChange={e => setFormData({ ...formData, min_cgpa: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Max Active Backlogs</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.max_active_backlogs}
                  onChange={e => setFormData({ ...formData, max_active_backlogs: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Min 10th %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.min_tenth_percentage}
                  onChange={e => setFormData({ ...formData, min_tenth_percentage: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Min 12th %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.min_twelfth_percentage}
                  onChange={e => setFormData({ ...formData, min_twelfth_percentage: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Allowed Departments */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-2">Allowed Branches / Departments</label>
              <div className="flex flex-wrap gap-2">
                {ALL_DEPTS.map(dept => {
                  const selected = formData.allowed_departments.includes(dept);
                  return (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => toggleDept(dept)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        selected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {dept}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Allow Already Placed */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="allow_placed"
                checked={formData.allow_already_placed}
                onChange={e => setFormData({ ...formData, allow_already_placed: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0"
              />
              <label htmlFor="allow_placed" className="text-xs text-slate-300">
                Allow already placed students to apply (Dream / Super Dream Policy)
              </label>
            </div>
          </div>

          {/* Rounds Builder */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Recruitment Rounds Pipeline</label>
              <button
                type="button"
                onClick={handleAddRound}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Round
              </button>
            </div>

            <div className="space-y-2">
              {formData.rounds.map((round, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-500 w-6">R{round.round_number}</span>
                  <input
                    type="text"
                    value={round.name}
                    onChange={e => {
                      const updated = [...formData.rounds];
                      updated[idx].name = e.target.value;
                      setFormData({ ...formData, rounds: updated });
                    }}
                    className="flex-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
                  />
                  {formData.rounds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRound(idx)}
                      className="p-1 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {submitting ? 'Publishing Drive...' : 'Publish Placement Drive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
