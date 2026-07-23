import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  TrendingUp,
  Plus,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  Building2,
  ChevronRight,
  User,
} from 'lucide-react';
import { LeadStage } from '../../types/crm';

interface LeadsViewProps {
  onOpenNewLeadModal: () => void;
  searchQuery: string;
}

export const LeadsView: React.FC<LeadsViewProps> = ({ onOpenNewLeadModal, searchQuery }) => {
  const { leads, updateLeadStage } = useCRM();

  const filteredLeads = leads.filter(l =>
    l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stages: LeadStage[] = ['New Inquiry', 'Strategy Pitch', 'Proposal Sent', 'Contract Signed', 'Closed Won'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Sales Lead CRM & Pipeline</h1>
          <p className="text-xs text-slate-500 mt-1">Manage inbound inquiries, pitch decks, proposals, and retainer conversions.</p>
        </div>
        <button
          onClick={onOpenNewLeadModal}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add Prospective Lead</span>
        </button>
      </div>

      {/* Leads Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map(lead => (
          <div key={lead.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">{lead.companyName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {lead.contactName}
                </p>
              </div>

              <select
                value={lead.stage}
                onChange={(e) => updateLeadStage(lead.id, e.target.value as LeadStage)}
                className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 rounded-lg px-2 py-1 focus:outline-none"
              >
                {stages.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-800">Interested Services: </span>
              <span className="text-amber-700 font-medium">{lead.servicesInterested.join(', ')}</span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2">{lead.notes}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Value</span>
                <span className="text-sm font-extrabold text-slate-900">₹{lead.estimatedMonthlyValue.toLocaleString('en-IN')}/mo</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Contact</span>
                <span className="text-xs text-slate-700 font-semibold">{lead.phone}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
