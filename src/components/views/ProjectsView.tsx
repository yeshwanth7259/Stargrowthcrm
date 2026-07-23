import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { CampaignType, ProjectStatus } from '../../types/crm';

interface ProjectsViewProps {
  onOpenNewProject: () => void;
  searchQuery: string;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onOpenNewProject, searchQuery }) => {
  const { projects, users, updateProjectStatus } = useCRM();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || p.campaignType === selectedType;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Campaign & Project Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Manage active digital marketing retainers, budgets, and staff assignments.</p>
        </div>
        <button
          onClick={onOpenNewProject}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Campaign</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="All">All Campaign Types</option>
            <option value="Google Ads (PPC)">Google Ads (PPC)</option>
            <option value="SEO">SEO</option>
            <option value="Meta & Social Ads">Meta & Social Ads</option>
            <option value="Content Marketing">Content Marketing</option>
            <option value="Email Automation">Email Automation</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Planning">Planning</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map(prj => {
          const assignedEmployees = users.filter(u => prj.assignedEmployeeIds.includes(u.id));
          return (
            <div key={prj.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400/80 transition-all space-y-4">
              
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {prj.campaignType}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{prj.name}</h3>
                  <p className="text-xs text-slate-500">Client: <span className="font-semibold text-slate-800">{prj.clientName}</span></p>
                </div>

                <select
                  value={prj.status}
                  onChange={(e) => updateProjectStatus(prj.id, e.target.value as ProjectStatus, prj.progressPercentage)}
                  className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{prj.description}</p>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-semibold text-slate-700">
                  <span>Campaign Progress</span>
                  <span>{prj.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${prj.progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats & Assignees Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Monthly Retainer</span>
                  <span className="font-extrabold text-slate-900">₹{prj.budgetMonthly.toLocaleString('en-IN')}/mo</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Key KPI</span>
                  <span className="font-bold text-emerald-700">
                    {prj.kpis.roas ? `${prj.kpis.roas}x ROAS` : prj.kpis.organicTrafficChange ? `${prj.kpis.organicTrafficChange} Growth` : `${prj.kpis.leadsGenerated} Leads`}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Team Staff</span>
                  <div className="flex items-center -space-x-1.5 mt-0.5">
                    {assignedEmployees.map(emp => (
                      <img
                        key={emp.id}
                        src={emp.avatar}
                        alt={emp.name}
                        title={emp.name}
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
