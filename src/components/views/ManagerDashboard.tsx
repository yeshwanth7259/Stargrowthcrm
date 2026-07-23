import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  DollarSign,
  Briefcase,
  Users,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  ChevronRight,
  Eye,
  Activity,
} from 'lucide-react';
import { AddUserForm } from '../AddUserForm';

interface ManagerDashboardProps {
  onOpenNewProject: () => void;
  onOpenNewLead: () => void;
  setActiveTab: (tab: TabType) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  onOpenNewProject,
  onOpenNewLead,
  setActiveTab,
}) => {
  const { projects, leads, attendance, activityLogs, users, updateLeadStage, addUser } = useCRM();
  const [isAddUserOpen, setIsAddUserOpen] = React.useState(false);

  // Metrics calculations
  const totalMRR = projects.reduce((acc, p) => acc + p.budgetMonthly, 0);
  const activeProjectsCount = projects.filter(p => p.status === 'Active').length;
  const activeEmployees = users.filter(u => u.role === 'employee');
  const onlineEmployeesCount = attendance.filter(a => a.status === 'Checked In').length;

  const pipelineValue = leads.reduce((acc, l) => acc + l.estimatedMonthlyValue, 0);

  const leadStages = ['New Inquiry', 'Strategy Pitch', 'Proposal Sent', 'Contract Signed', 'Closed Won'];

  return (
    <div className="space-y-6">
      
      {/* Page Title & Action Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Agency Operations & CRM Command</h1>
          <p className="text-xs text-slate-500 mt-1">
            Star Growth Hub executive control • Real-time project tracking, lead pipeline, and employee attendance logs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] sm:text-xs rounded-xl border border-indigo-200 transition-all cursor-pointer whitespace-nowrap"
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Add Staff / Client</span>
          </button>
          <button
            onClick={onOpenNewLead}
            className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] sm:text-xs rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span>Add Sales Lead</span>
          </button>
          <button
            onClick={onOpenNewProject}
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] sm:text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>New Campaign Project</span>
          </button>
        </div>
      </div>

      {isAddUserOpen && (
        <AddUserForm 
          onClose={() => setIsAddUserOpen(false)} 
          onSuccess={(newUser) => {
            setIsAddUserOpen(false);
            // We will map backend role to frontend role (employee, accountant, client)
            let frontendRole = 'employee';
            if (newUser.role === 'ACCOUNTANT') frontendRole = 'accountant';
            if (newUser.role === 'CLIENT') frontendRole = 'client';

            const localUser = {
              id: newUser.id,
              name: newUser.full_name,
              email: newUser.email,
              role: frontendRole as any,
              designation: newUser.designation || '',
              department: newUser.department || '',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.full_name)}&background=random`,
              activeSession: { status: 'offline', checkInTime: '', todayHoursLogged: 0, lastLogNote: '' }
            };
            
            if (addUser) {
              addUser(localUser);
            }
          }}
        />
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Agency Monthly Revenue</span>
            <div className="text-2xl font-black text-slate-900 mt-1">₹{totalMRR.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/mo</span></div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="w-3 h-3" /> +18.4% vs last month
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200/60 font-bold text-xl">
            ₹
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Active Client Campaigns</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{activeProjectsCount} <span className="text-xs font-normal text-slate-400">Live</span></div>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">Avg. ROAS: 3.8x across ads</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-200/60">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Sales Pipeline Value</span>
            <div className="text-2xl font-black text-slate-900 mt-1">₹{pipelineValue.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/mo</span></div>
            <span className="text-[11px] font-semibold text-amber-600 mt-1 block">{leads.length} active high-intent pitches</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200/60">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Staff Shift Active</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{onlineEmployeesCount} / {activeEmployees.length}</div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Shift Active & Checked-In
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-200/60">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid: Sales Pipeline CRM & Employee Shift Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Lead Pipeline Kanban - 2 Columns wide */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                Sales Lead Pipeline & Client Deals
              </h2>
              <p className="text-xs text-slate-500">Drag/Move leads through pitch stages to retainer signatures.</p>
            </div>
            <button
              onClick={() => setActiveTab('leads')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              View Full Pipeline <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3 overflow-x-auto">
            {leadStages.map(stage => {
              const stageLeads = leads.filter(l => l.stage === stage);
              return (
                <div key={stage} className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 min-w-[140px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-700 truncate">{stage}</span>
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {stageLeads.map(lead => (
                      <div
                        key={lead.id}
                        className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs hover:shadow-md transition-all text-left"
                      >
                        <div className="text-xs font-bold text-slate-900 line-clamp-1">{lead.companyName}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{lead.contactName}</div>
                        <div className="text-xs font-extrabold text-amber-600 mt-1.5">
                          ₹{lead.estimatedMonthlyValue.toLocaleString('en-IN')}/mo
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[9px] text-slate-400">{lead.servicesInterested[0]}</span>
                          <select
                            value={lead.stage}
                            onChange={(e) => updateLeadStage(lead.id, e.target.value as any)}
                            className="text-[9px] bg-slate-100 border border-slate-300 rounded px-1 py-0.5 text-slate-700 focus:outline-none"
                          >
                            {leadStages.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="text-[10px] text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded-lg">
                        No deals
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff Shift Attendance & Login Activity - 1 Column */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Staff Attendance & Shifts
              </h2>
              <p className="text-xs text-slate-500">Live office check-in status for today.</p>
            </div>
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Full Logs <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {users.filter(u => u.role === 'employee').map(emp => {
              const att = attendance.find(a => a.userId === emp.id);
              return (
                <div key={emp.id} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{emp.name}</div>
                      <div className="text-[10px] text-slate-500">{emp.designation}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 italic line-clamp-1">
                        "{emp.activeSession?.lastLogNote || 'Active on workstation'}"
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        att?.status === 'Checked In'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${att?.status === 'Checked In' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                      {att?.status || 'Offline'}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1">In: {att?.checkInTime || 'N/A'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Active Campaign Projects Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-500" />
              Active Client Projects & Campaign Delivery
            </h2>
            <p className="text-xs text-slate-500">Track client retainers, deliverables count, and ROAS performance.</p>
          </div>
          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            Manage All Projects <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold bg-slate-50/50">
                <th className="p-3">Client & Campaign</th>
                <th className="p-3">Type</th>
                <th className="p-3">Monthly Retainer</th>
                <th className="p-3">Deliverables</th>
                <th className="p-3">Progress</th>
                <th className="p-3">Key Performance KPI</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map(prj => (
                <tr key={prj.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{prj.name}</div>
                    <div className="text-[11px] text-slate-500">{prj.clientName}</div>
                  </td>
                  <td className="p-3">
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200">
                      {prj.campaignType}
                    </span>
                  </td>
                  <td className="p-3 font-extrabold text-slate-900">₹{prj.budgetMonthly.toLocaleString('en-IN')}/mo</td>
                  <td className="p-3 text-slate-600">
                    {prj.deliverablesCount.completed} / {prj.deliverablesCount.total} items
                  </td>
                  <td className="p-3 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${prj.progressPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700">{prj.progressPercentage}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    {prj.kpis.roas ? (
                      <span className="text-emerald-700 font-extrabold">{prj.kpis.roas}x ROAS</span>
                    ) : prj.kpis.organicTrafficChange ? (
                      <span className="text-indigo-700 font-extrabold">{prj.kpis.organicTrafficChange} Traffic</span>
                    ) : (
                      <span className="text-slate-600">{prj.kpis.leadsGenerated} Leads</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {prj.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Activity & Login Audit Log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-700" />
              Office Work & Login Activity Audit Trail
            </h2>
            <p className="text-xs text-slate-500">Recorded authentication, check-ins, and task changes.</p>
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {activityLogs.slice(0, 6).map(log => (
            <div key={log.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                    log.action === 'LOGIN' || log.action === 'CHECK_IN'
                      ? 'bg-emerald-100 text-emerald-800'
                      : log.action === 'LOGOUT' || log.action === 'CHECK_OUT'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {log.action}
                </span>
                <div>
                  <span className="font-bold text-slate-900">{log.userName}: </span>
                  <span className="text-slate-600">{log.details}</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
