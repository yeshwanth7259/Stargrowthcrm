import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, TrendingUp } from 'lucide-react';
import { CampaignType, LeadStage } from '../../types/crm';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose }) => {
  const { addLead } = useCRM();

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [estimatedMonthlyValue, setEstimatedMonthlyValue] = useState<number>(60000);
  const [service, setService] = useState<CampaignType>('Google Ads (PPC)');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName) return;

    addLead({
      companyName,
      contactName,
      email,
      phone,
      servicesInterested: [service],
      estimatedMonthlyValue,
      stage: 'New Inquiry',
      assignedTo: 'Aarav Sharma',
      lastContactDate: new Date().toISOString().split('T')[0],
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Add Prospective Sales Lead</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Health Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Jenkins"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="sarah@apexhealth.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 019-2831"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Service</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value as CampaignType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Google Ads (PPC)">Google Ads (PPC)</option>
                <option value="SEO">SEO</option>
                <option value="Meta & Social Ads">Meta & Social Ads</option>
                <option value="Content Marketing">Content Marketing</option>
                <option value="Email Automation">Email Automation</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pitch Deal Value (₹/mo)</label>
              <input
                type="number"
                value={estimatedMonthlyValue}
                onChange={(e) => setEstimatedMonthlyValue(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Inquiry Background & Notes</label>
            <textarea
              rows={3}
              placeholder="Source of lead, current ad spend, key pain points..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md cursor-pointer"
            >
              Add Lead to Pipeline
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
