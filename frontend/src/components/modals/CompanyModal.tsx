import React, { useState } from 'react';
import { api } from '../../services/api';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { Building2 } from 'lucide-react';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    industry: 'Enterprise Software & Cloud',
    website: 'https://',
    contact_email: '',
    contact_phone: '',
    tier: 'Tier 1 - Dream (>10 LPA)',
    location: 'Pan-India / Hybrid',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createCompany(formData);
      toast({
        type: 'success',
        title: 'Company Partner Registered',
        message: `${formData.name} was added to the institutional recruiters directory.`
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Registration Failed',
        message: err.message || 'Could not register company'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Corporate Partner"
      description="Add a recruiting partner to the university placement database."
      icon={<Building2 className="w-6 h-6 text-indigo-400" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Oracle, Salesforce, Intel"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Industry</label>
            <input
              type="text"
              value={formData.industry}
              onChange={e => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Placement Tier</label>
            <select
              value={formData.tier}
              onChange={e => setFormData({ ...formData, tier: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none"
            >
              <option value="Tier 1 - Dream (>10 LPA)">Tier 1 - Dream (&gt;10 LPA)</option>
              <option value="Tier 2 - Super Dream (>18 LPA)">Tier 2 - Super Dream (&gt;18 LPA)</option>
              <option value="Tier 3 - Core (5-10 LPA)">Tier 3 - Core (5-10 LPA)</option>
              <option value="Mass (3-5 LPA)">Mass (3-5 LPA)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
            <input
              type="email"
              placeholder="campus@company.com"
              value={formData.contact_email}
              onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={e => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Focus Areas</label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button type="submit" loading={submitting} size="sm">
            Save Company Partner
          </Button>
        </div>
      </form>
    </Modal>
  );
};
