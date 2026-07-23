import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Receipt,
  DollarSign,
  FileText,
  CheckCircle2,
  Clock,
  Download,
  Building,
} from 'lucide-react';

export const InvoicesView: React.FC = () => {
  const { invoices } = useCRM();

  const totalBilled = invoices.reduce((acc, i) => acc + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'Pending').reduce((acc, i) => acc + i.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Agency Billing & Retainer Invoices</h1>
        <p className="text-xs text-slate-500 mt-1">Track monthly client retainers, payments, and invoice statements.</p>
      </div>

      {/* Finance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Invoiced Amount</span>
            <div className="text-2xl font-black text-slate-900 mt-1">₹{totalBilled.toLocaleString('en-IN')}</div>
            <span className="text-[11px] font-semibold text-slate-500 mt-1 block">Q3 Retainer Billing</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200 font-bold text-xl">
            ₹
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Payments Received</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">₹{totalPaid.toLocaleString('en-IN')}</div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">Paid & Cleared</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200 font-bold text-xl">
            ₹
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Pending Retainers</span>
            <div className="text-2xl font-black text-amber-600 mt-1">₹{totalPending.toLocaleString('en-IN')}</div>
            <span className="text-[11px] font-semibold text-amber-600 mt-1 block">Due this week</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200 font-bold text-xl">
            ₹
          </div>
        </div>

      </div>

      {/* Invoices Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Receipt className="w-5 h-5 text-indigo-600" />
          Client Invoice Ledger
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold bg-slate-50">
                <th className="p-3">Invoice #</th>
                <th className="p-3">Client Company</th>
                <th className="p-3">Project</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Due Date</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="p-3 font-semibold text-slate-800">{inv.clientName}</td>
                  <td className="p-3 text-slate-600">{inv.projectName}</td>
                  <td className="p-3 font-extrabold text-slate-900">₹{inv.amount.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-slate-500">{inv.issueDate}</td>
                  <td className="p-3 text-slate-500">{inv.dueDate}</td>
                  <td className="p-3 text-right">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
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

    </div>
  );
};
