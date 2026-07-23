import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  Download,
  MessageSquare,
  Sparkles,
  Building,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
} from 'lucide-react';

export const ClientPortal: React.FC = () => {
  const { currentUser, projects, approvals, invoices, updateApprovalStatus, logActivity } = useCRM();
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // Filter projects for this client
  const clientProjects = projects.filter(p => p.clientId === currentUser.clientId || p.clientName.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase()));
  const clientApprovals = approvals.filter(a => a.clientId === currentUser.clientId || clientProjects.some(p => p.id === a.projectId));
  const clientInvoices = invoices.filter(i => i.clientId === currentUser.clientId || clientProjects.some(p => p.clientName === i.clientName));

  // Aggregate KPIs
  const totalLeads = clientProjects.reduce((acc, p) => acc + (p.kpis.leadsGenerated || 0), 0);
  const avgRoas = clientProjects.reduce((acc, p) => acc + (p.kpis.roas || 0), 0) / (clientProjects.filter(p => p.kpis.roas).length || 1);
  const totalImpressions = clientProjects.reduce((acc, p) => acc + (p.kpis.impressions || 0), 0);

  const pendingApprovals = clientApprovals.filter(a => a.status === 'Pending Approval');

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage) return;
    logActivity('TASK_UPDATE', `Client ${currentUser.name} sent campaign support message: "${supportMessage}"`);
    setSupportSubmitted(true);
    setSupportMessage('');
    setTimeout(() => setSupportSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Client Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl">
            <Building className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">{currentUser.name} Portal</h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                Verified Client
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">Star Growth Hub Marketing Partner Operations & Growth Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pendingApprovals.length > 0 && (
            <div className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{pendingApprovals.length} Deliverables Need Your Review</span>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Growth KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Campaign Impressions</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalImpressions.toLocaleString()}</div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">Across Search & Social Ads</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-200">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Leads & Conversions Generated</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalLeads.toLocaleString()}</div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">+28% increase this cycle</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Average Return on Ad Spend (ROAS)</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{avgRoas.toFixed(2)}x ROAS</div>
            <span className="text-[11px] font-semibold text-amber-600 mt-1 block">Targeting 4.0x+ target</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Deliverable Approvals Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              Campaign Deliverable Approvals
            </h2>
            <p className="text-xs text-slate-500">Review creative assets, copy briefs, and budget changes before publishing live.</p>
          </div>
          <span className="text-xs font-bold text-slate-500">{clientApprovals.length} Total Items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientApprovals.map(app => (
            <div key={app.id} className="p-4 bg-slate-50/90 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                  {app.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    app.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : app.status === 'Changes Requested'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{app.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{app.contentSnippet}</p>
                {app.previewUrl && (
                  <img src={app.previewUrl} alt="Preview" className="w-full h-36 object-cover rounded-lg border border-slate-200 mt-2" />
                )}
              </div>

              {app.clientFeedback && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 italic">
                  <span className="font-bold text-slate-900 not-italic">Feedback: </span>"{app.clientFeedback}"
                </div>
              )}

              {app.status === 'Pending Approval' && (
                <div className="pt-2 border-t border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Optional approval feedback or change notes..."
                      value={selectedApproval === app.id ? feedbackNote : ''}
                      onChange={(e) => {
                        setSelectedApproval(app.id);
                        setFeedbackNote(e.target.value);
                      }}
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateApprovalStatus(app.id, 'Approved', selectedApproval === app.id ? feedbackNote : undefined)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Approve Item</span>
                    </button>
                    <button
                      onClick={() => updateApprovalStatus(app.id, 'Changes Requested', selectedApproval === app.id ? feedbackNote : 'Please refine copy.')}
                      className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Request Edits</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {clientApprovals.length === 0 && (
            <div className="col-span-full text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-xl text-xs font-semibold">
              No pending approval items. All campaign assets are active and running.
            </div>
          )}
        </div>
      </div>

      {/* Invoices & Billing Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileText className="w-5 h-5 text-indigo-600" />
          Retainer Invoices & Billing Receipts
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold bg-slate-50">
                <th className="p-3">Invoice #</th>
                <th className="p-3">Campaign Project</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Due Date</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="p-3 text-slate-600">{inv.projectName}</td>
                  <td className="p-3 font-extrabold text-slate-900">₹{inv.amount.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-slate-500">{inv.dueDate}</td>
                  <td className="p-3 text-right">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Support & Tweak Request Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <MessageSquare className="w-5 h-5 text-amber-500" />
          Direct Agency Support & Campaign Tweaks
        </h2>

        {supportSubmitted && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
            ✓ Your campaign request has been routed directly to Aarav Sharma & the Star Growth Hub strategy team!
          </div>
        )}

        <form onSubmit={handleSupportSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Request Message / Campaign Change</label>
            <textarea
              rows={3}
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="e.g. We want to increase our Meta retargeting budget by ₹20,000 for next month's holiday promo..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
          >
            Submit Request to Strategist
          </button>
        </form>
      </div>

    </div>
  );
};
