import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../../services/api';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { Building2, Plus, Trash2, CheckCircle2, ChevronRight, ChevronLeft, Calendar, ShieldCheck } from 'lucide-react';

const ALL_DEPARTMENTS = ["CSE", "CSE(AIML)", "CSE(AI)", "CSIT", "IT", "CS", "ECE", "EEE", "ME"];

// Zod Schema
const driveSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  job_role: z.string().min(2, "Job role is required"),
  package_ctc: z.number().min(1, "CTC must be at least 1 LPA"),
  stipend: z.string().optional(),
  job_location: z.string().min(2, "Location is required"),
  job_description: z.string().min(10, "Description must be at least 10 characters"),
  drive_date: z.string().min(1, "Drive date is required"),
  application_deadline: z.string().min(1, "Application deadline is required"),
  min_cgpa: z.number().min(0).max(10, "CGPA must be between 0.0 and 10.0"),
  min_tenth_percentage: z.number().min(0).max(100),
  min_twelfth_percentage: z.number().min(0).max(100),
  max_active_backlogs: z.number().min(0).max(10),
  max_history_backlogs: z.number().min(0).max(15),
  allow_already_placed: z.boolean(),
  allowed_departments: z.array(z.string()).min(1, "Select at least one eligible department")
}).refine(data => new Date(data.application_deadline) <= new Date(data.drive_date), {
  message: "Application deadline must be on or before the drive date",
  path: ["application_deadline"]
});

type DriveFormData = z.infer<typeof driveSchema>;

interface CreateDriveWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateDriveWizard: React.FC<CreateDriveWizardProps> = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [rounds, setRounds] = useState([
    { round_number: 1, name: "Online Assessment (OA)", description: "Aptitude & DSA coding test" },
    { round_number: 2, name: "Technical Interview", description: "Core CS fundamentals" },
    { round_number: 3, name: "HR Interview", description: "Cultural fit & communication" }
  ]);

  const defaultDriveDate = new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0];
  const defaultDeadline = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<DriveFormData>({
    resolver: zodResolver(driveSchema),
    defaultValues: {
      company_name: '',
      job_role: '',
      package_ctc: 12.0,
      stipend: '35,000 / month',
      job_location: 'Bengaluru / Hybrid',
      job_description: '',
      drive_date: defaultDriveDate,
      application_deadline: defaultDeadline,
      min_cgpa: 7.0,
      min_tenth_percentage: 65.0,
      min_twelfth_percentage: 65.0,
      max_active_backlogs: 0,
      max_history_backlogs: 1,
      allow_already_placed: false,
      allowed_departments: ["CSE", "CSE(AIML)", "CSIT", "IT"]
    }
  });

  const selectedDepts = watch('allowed_departments') || [];

  const toggleDept = (dept: string) => {
    if (selectedDepts.includes(dept)) {
      setValue('allowed_departments', selectedDepts.filter(d => d !== dept));
    } else {
      setValue('allowed_departments', [...selectedDepts, dept]);
    }
  };

  const addRound = () => {
    const nextNum = rounds.length + 1;
    setRounds([...rounds, { round_number: nextNum, name: `Round ${nextNum}`, description: "Interview stage" }]);
  };

  const removeRound = (idx: number) => {
    if (rounds.length <= 1) return;
    const updated = rounds.filter((_, i) => i !== idx).map((r, i) => ({ ...r, round_number: i + 1 }));
    setRounds(updated);
  };

  const onSubmit = async (data: DriveFormData) => {
    try {
      await api.createDrive({
        company_name: data.company_name,
        title: `${data.job_role} Recruitment Drive`,
        job_role: data.job_role,
        job_description: data.job_description,
        package_ctc: Number(data.package_ctc),
        stipend: data.stipend,
        job_location: data.job_location,
        drive_date: new Date(data.drive_date).toISOString(),
        application_deadline: new Date(data.application_deadline).toISOString(),
        status: 'active',
        eligibility_criteria: {
          min_cgpa: Number(data.min_cgpa),
          min_tenth_percentage: Number(data.min_tenth_percentage),
          min_twelfth_percentage: Number(data.min_twelfth_percentage),
          max_active_backlogs: Number(data.max_active_backlogs),
          max_history_backlogs: Number(data.max_history_backlogs),
          allowed_departments: data.allowed_departments,
          allowed_batches: [2025],
          allow_already_placed: data.allow_already_placed
        },
        rounds
      });

      toast({
        type: 'success',
        title: 'Placement Drive Published',
        message: `${data.company_name} drive has been published to student portals.`
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Publishing Failed',
        message: err.message || 'Could not create drive'
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Placement Drive Wizard"
      description="Configure company details, compensation, eligibility filters, and selection process."
      icon={<Building2 className="w-6 h-6 text-indigo-400" />}
      maxWidth="3xl"
    >
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-indigo-400' : 'text-slate-500'}`}>
          <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">1</div>
          <span>Company & Role</span>
        </div>
        <div className="w-8 h-px bg-slate-800" />
        <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-indigo-400' : 'text-slate-500'}`}>
          <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">2</div>
          <span>Eligibility Criteria</span>
        </div>
        <div className="w-8 h-px bg-slate-800" />
        <div className={`flex items-center gap-2 text-xs font-bold ${step >= 3 ? 'text-indigo-400' : 'text-slate-500'}`}>
          <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">3</div>
          <span>Rounds & Schedule</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Step 1: Company & Role */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Cisco, Atlassian, Adobe"
                  {...register('company_name')}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:border-indigo-500 focus:outline-none"
                />
                {errors.company_name && <p className="text-[11px] text-rose-400 mt-1">{errors.company_name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Role *</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer (L3)"
                  {...register('job_role')}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:border-indigo-500 focus:outline-none"
                />
                {errors.job_role && <p className="text-[11px] text-rose-400 mt-1">{errors.job_role.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Package CTC (LPA) *</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('package_ctc', { valueAsNumber: true })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-400 focus:outline-none"
                />
                {errors.package_ctc && <p className="text-[11px] text-rose-400 mt-1">{errors.package_ctc.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Stipend</label>
                <input
                  type="text"
                  placeholder="e.g. 40,000 / month"
                  {...register('stipend')}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru / Hybrid"
                  {...register('job_location')}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Job Description & Responsibilities *</label>
              <textarea
                rows={3}
                placeholder="Describe team, expectations, tech stack..."
                {...register('job_description')}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none"
              />
              {errors.job_description && <p className="text-[11px] text-rose-400 mt-1">{errors.job_description.message}</p>}
            </div>

            <div className="flex justify-end pt-3">
              <Button type="button" onClick={() => setStep(2)}>
                <span>Next: Eligibility Criteria</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Eligibility Criteria */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Min CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('min_cgpa', { valueAsNumber: true })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Max Backlogs</label>
                <input
                  type="number"
                  {...register('max_active_backlogs', { valueAsNumber: true })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Min 10th %</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('min_tenth_percentage', { valueAsNumber: true })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Min 12th %</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('min_twelfth_percentage', { valueAsNumber: true })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Allowed Branches / Departments *</label>
              <div className="flex flex-wrap gap-2">
                {ALL_DEPARTMENTS.map(dept => {
                  const isChecked = selectedDepts.includes(dept);
                  return (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => toggleDept(dept)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isChecked
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {dept}
                    </button>
                  );
                })}
              </div>
              {errors.allowed_departments && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.allowed_departments.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="allow_already_placed"
                {...register('allow_already_placed')}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
              <label htmlFor="allow_already_placed" className="text-xs text-slate-300">
                Allow already placed students to apply (Dream / Super Dream Policy)
              </label>
            </div>

            <div className="flex justify-between pt-3">
              <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button type="button" onClick={() => setStep(3)}>
                <span>Next: Rounds & Deadlines</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Rounds & Deadlines */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Drive Assessment Date *</label>
                <input
                  type="date"
                  {...register('drive_date')}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Application Deadline *</label>
                <input
                  type="date"
                  {...register('application_deadline')}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none"
                />
                {errors.application_deadline && (
                  <p className="text-[11px] text-rose-400 mt-1">{errors.application_deadline.message}</p>
                )}
              </div>
            </div>

            {/* Rounds Pipeline */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Recruitment Rounds Sequence</label>
                <button
                  type="button"
                  onClick={addRound}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Round
                </button>
              </div>

              <div className="space-y-2">
                {rounds.map((round, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-500 w-7">R{round.round_number}</span>
                    <input
                      type="text"
                      value={round.name}
                      onChange={e => {
                        const copy = [...rounds];
                        copy[idx].name = e.target.value;
                        setRounds(copy);
                      }}
                      className="flex-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
                    />
                    {rounds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRound(idx)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button type="submit" loading={isSubmitting} variant="primary">
                Publish Placement Drive
              </Button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
