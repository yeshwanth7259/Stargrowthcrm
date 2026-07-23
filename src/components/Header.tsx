import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { StarGrowthHubLogo } from './StarGrowthHubLogo';
import {
  Sparkles,
  ShieldAlert,
  LogOut,
  Clock,
  UserCheck,
  RotateCcw,
  Search,
  ChevronDown,
  Building2,
  Briefcase,
  Users,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onOpenCheckInModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCheckInModal, searchQuery, setSearchQuery, toggleMobileMenu }) => {
  const { currentUser, users, switchUser, logout, checkOut, resetAllData } = useCRM();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'manager':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-300">👔 Manager / Admin</span>;
      case 'employee':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-300">💻 Team Employee</span>;
      case 'client':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">🤝 Client View</span>;
      default:
        return null;
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          {toggleMobileMenu && (
            <button onClick={toggleMobileMenu} className="lg:hidden p-2 -ml-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          )}
          <StarGrowthHubLogo size="md" showText={true} />
          <span className="hidden xl:inline-block bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-amber-500/30">
            CRM 2.0
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients, projects, tasks, or staff..."
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
          </div>
        </div>

        {/* User Session, Check-In & Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Quick Check-In / Check-Out Widget */}
          {currentUser.role !== 'client' && (
            <button
              onClick={onOpenCheckInModal}
              className="hidden sm:flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-xs font-medium text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-all cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentUser.activeSession?.status === 'online' ? 'Shift Active' : 'Check-In Shift'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          )}

          {/* User & Role Simulator Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 text-slate-200 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-500/40"
              />
              <div className="text-left hidden lg:block">
                <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400">{currentUser.designation}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu for Role Switching */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-3 divide-y divide-slate-800 text-slate-200">
                <div className="pb-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Switch Login Context / User Role</div>
                  <div className="text-[11px] text-slate-400 mb-3">
                    Test the CRM from Manager, Employee, or Client viewpoints:
                  </div>

                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                          u.id === currentUser.id ? 'bg-amber-500/10 border border-amber-500/30' : 'hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <div className="text-xs font-medium text-white">{u.name}</div>
                            <div className="text-[10px] text-slate-400">{u.designation}</div>
                          </div>
                        </div>
                        {getRoleBadge(u.role)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      logout();
                      setShowRoleDropdown(false);
                    }}
                    className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-bold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out Session</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Reset CRM to initial demo dataset?')) {
                        resetAllData();
                        setShowRoleDropdown(false);
                      }
                    }}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Direct Sign Out Button */}
          <button
            onClick={logout}
            title="Sign Out of Dashboard"
            className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
