import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, Briefcase, DollarSign, Calendar, Users } from 'lucide-react';
import { CampaignType } from '../../types/crm';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { addProject, users } = useCRM();

  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [campaignType, setCampaignType] = useState<CampaignType>('Google Ads (PPC)');
  const [budgetMonthly, setBudgetMonthly] = useState<number>(50000);
  const [description, setDescription] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(['usr_e1', 'usr_e2']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientName) return;

    addProject({
      name,
      clientId: 'cli_' + Date.now(),
      clientName,
      campaignType,
      budgetMonthly,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0],
      status: 'Active',
      progressPercentage: 10,
      assignedManagerId: 'usr_m1',
      assignedEmployeeIds: selectedEmployees,
      kpis: {
        impressions: 10000,
        clicks: 500,
        conversions: 25,
        roas: 3.5,
        leadsGenerated: 25,
      },
      deliverablesCount: { completed: 1, total: 10 },
      description,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Launch New Client Campaign Project</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Campaign Project Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Zenith E-Commerce Google Shopping Scale"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Client Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Brands Inc."
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Campaign Service Type</label>
              <select
                value={campaignType}
                onChange={(e) => setCampaignType(e.target.value as CampaignType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Google Ads (PPC)">Google Ads (PPC)</option>
                <option value="SEO">SEO</option>
                <option value="Meta & Social Ads">Meta & Social Ads</option>
                <option value="Content Marketing">Content Marketing</option>
                <option value="Email Automation">Email Automation</option>
                <option value="Web & CRO">Web & CRO</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Monthly Retainer Budget (₹)</label>
            <input
              type="number"
              required
              value={budgetMonthly}
              onChange={(e) => setBudgetMonthly(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Campaign Description & Target Goals</label>
            <textarea
              rows={3}
              placeholder="Outline KPIs, targeted ROAS, search volume, or brand positioning strategy..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              Launch Project
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
