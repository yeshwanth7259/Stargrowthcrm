import React from 'react';
import { useCRM } from '../context/CRMContext';
import { StarGrowthHubLogo } from './StarGrowthHubLogo';
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Users,
  Clock,
  Sparkles,
  Receipt,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  FileText,
  Building,
} from 'lucide-react';

export type TabType =
  | 'overview'
  | 'projects'
  | 'tasks'
  | 'leads'
  | 'attendance'
  | 'approvals'
  | 'invoices'
  | 'ai-tools'
  | 'client-portal'
  | 'support';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
  badge?: number;
  highlight?: boolean;
}

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { activeRole, approvals, tasks, currentUser } = useCRM();

  const pendingApprovalsCount = approvals.filter(
    a => a.status === 'Pending Approval' && (activeRole !== 'client' || a.clientId === currentUser.clientId)
  ).length;

  const myPendingTasksCount = tasks.filter(
    t => t.assigneeId === currentUser.id && t.status !== 'Completed'
  ).length;

  const managerNav: NavItem[] = [
    { id: 'overview', label: 'CRM Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects & Campaigns', icon: Briefcase },
    { id: 'tasks', label: 'Task Assignments', icon: CheckSquare },
    { id: 'leads', label: 'Sales Lead Pipeline', icon: TrendingUp },
    { id: 'attendance', label: 'Staff Login & Hours Log', icon: Clock },
    { id: 'approvals', label: 'Client Approvals', icon: CheckCircle2, badge: pendingApprovalsCount },
    { id: 'invoices', label: 'Finance & Retainers', icon: Receipt },
    { id: 'ai-tools', label: 'Star AI Marketing Suite', icon: Sparkles, highlight: true },
  ];

  const employeeNav: NavItem[] = [
    { id: 'tasks', label: 'My Workspace', icon: CheckSquare, badge: myPendingTasksCount },
    { id: 'projects', label: 'Active Projects', icon: Briefcase },
    { id: 'leads', label: 'Sales Leads', icon: TrendingUp },
    { id: 'attendance', label: 'My Timesheet', icon: Clock },
    { id: 'ai-tools', label: 'AI Asssistant', icon: Sparkles, highlight: true },
  ];

  const clientNav: NavItem[] = [
    { id: 'client-portal', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Active Campaigns', icon: Briefcase },
    { id: 'approvals', label: 'Deliverables & Approvals', icon: CheckCircle2, badge: pendingApprovalsCount },
    { id: 'invoices', label: 'Billing & Invoices', icon: Receipt },
    { id: 'support', label: 'Agency Support', icon: HelpCircle },
  ];

  const currentNav =
    activeRole === 'manager'
      ? managerNav
      : activeRole === 'employee'
      ? employeeNav
      : clientNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-0 lg:min-h-[calc(100vh-4rem)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-6 p-4">
          {/* Role indicator banner */}
          <div className="px-3 py-2 bg-slate-800/80 rounded-lg border border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Context Role</span>
              <span className="text-xs font-bold text-amber-400 capitalize">{activeRole} Workspace</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          </div>

          {/* Navigation items */}
          <nav className="space-y-1">
            {currentNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : item.highlight
                      ? 'bg-gradient-to-r from-amber-500/10 to-amber-400/20 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Agency Info */}
        <div className="p-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex flex-col items-center gap-1 text-center">
          <StarGrowthHubLogo size="sm" showText={false} />
          <p className="font-semibold text-slate-300">Star Growth Hub</p>
          <p className="text-[10px]">CRM v2.4 • Digital Agency Engine</p>
        </div>
      </aside>
    </>
  );
};
