import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, Upload, CheckCircle2, AlertCircle, FileText, Sparkles } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onProfileUpdated }) => {
  const { studentProfile, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    roll_number: '',
    department: 'CSE',
    batch: 2025,
    cgpa: 7.5,
    tenth_percentage: 80.0,
    twelfth_percentage: 80.0,
    active_backlogs: 0,
    history_backlogs: 0,
    skills_input: '',
    linkedin_url: '',
    github_url: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (studentProfile) {
      setFormData({
        roll_number: studentProfile.roll_number || '',
        department: studentProfile.department || 'CSE',
        batch: studentProfile.batch || 2025,
        cgpa: studentProfile.cgpa ?? 7.5,
        tenth_percentage: studentProfile.tenth_percentage ?? 80.0,
        twelfth_percentage: studentProfile.twelfth_percentage ?? 80.0,
        active_backlogs: studentProfile.active_backlogs ?? 0,
        history_backlogs: studentProfile.history_backlogs ?? 0,
        skills_input: (studentProfile.skills || []).join(', '),
        linkedin_url: studentProfile.linkedin_url || '',
        github_url: studentProfile.github_url || '',
      });
    }
  }, [studentProfile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const skills = formData.skills_input
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      await api.updateMyStudentProfile({
        roll_number: formData.roll_number,
        department: formData.department,
        batch: Number(formData.batch),
        cgpa: Number(formData.cgpa),
        tenth_percentage: Number(formData.tenth_percentage),
        twelfth_percentage: Number(formData.twelfth_percentage),
        active_backlogs: Number(formData.active_backlogs),
        history_backlogs: Number(formData.history_backlogs),
        skills,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
      });

      if (resumeFile) {
        await api.uploadResume(resumeFile);
      }

      await refreshProfile();
      if (onProfileUpdated) onProfileUpdated();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Student Academic Profile</h2>
            <p className="text-xs text-slate-400">
              Update your CGPA, backlogs, and credentials to test real-time drive eligibility recalculation.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile and academic metrics updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">University Roll Number</label>
              <input
                type="text"
                required
                value={formData.roll_number}
                onChange={e => setFormData({ ...formData, roll_number: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Department / Branch</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm focus:outline-none"
              >
                <option value="CSE">CSE (Computer Science & Engg)</option>
                <option value="CSE(AIML)">CSE (AI & ML)</option>
                <option value="CSE(AI)">CSE (Artificial Intelligence)</option>
                <option value="CSIT">CSIT (CS & Information Tech)</option>
                <option value="IT">IT (Information Technology)</option>
                <option value="CS">CS (Computer Science)</option>
                <option value="ECE">ECE (Electronics & Comm)</option>
                <option value="EEE">EEE (Electrical & Electronics)</option>
                <option value="ME">ME (Mechanical Engg)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Current CGPA (0 - 10)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={formData.cgpa}
                onChange={e => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm focus:outline-none font-semibold text-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">10th Grade (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                value={formData.tenth_percentage}
                onChange={e => setFormData({ ...formData, tenth_percentage: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">12th Grade (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                value={formData.twelfth_percentage}
                onChange={e => setFormData({ ...formData, twelfth_percentage: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Active Live Backlogs
              </label>
              <input
                type="number"
                min="0"
                max="10"
                required
                value={formData.active_backlogs}
                onChange={e => setFormData({ ...formData, active_backlogs: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm focus:outline-none font-semibold text-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                History of Backlogs (Cleared)
              </label>
              <input
                type="number"
                min="0"
                max="15"
                required
                value={formData.history_backlogs}
                onChange={e => setFormData({ ...formData, history_backlogs: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Technical Skills (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Python, FastAPI, React, Docker, SQL, DSA"
              value={formData.skills_input}
              onChange={e => setFormData({ ...formData, skills_input: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm focus:outline-none"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" /> Upload Resume (PDF / DOCX)
              </span>
              {studentProfile?.resume_url && (
                <span className="text-[11px] text-emerald-400 font-medium">✓ Resume on file</span>
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
              className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save & Recalculate Eligibility'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
