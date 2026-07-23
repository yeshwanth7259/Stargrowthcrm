import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Clock,
  UserCheck,
  Activity,
  Shield,
  Filter,
  Search,
  CheckCircle2,
  LogOut,
  Calendar,
} from 'lucide-react';

interface AttendanceViewProps {
  onOpenCheckInModal: () => void;
  searchQuery: string;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ onOpenCheckInModal, searchQuery }) => {
  const { attendance, activityLogs, users, currentUser } = useCRM();
  const [logFilter, setLogFilter] = useState<string>('ALL');

  const filteredAttendance = attendance.filter(a =>
    a.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredActivity = activityLogs.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = logFilter === 'ALL' || log.action === logFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Staff Attendance & Session Audit Logs</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time timestamp tracking for employee check-ins, office shift logins, and workstation activity.
          </p>
        </div>
        {currentUser.role !== 'client' && (
          <button
            onClick={onOpenCheckInModal}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Daily Shift Check-In</span>
          </button>
        )}
      </div>

      {/* Employee Shift Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {users.filter(u => u.role === 'employee').map(emp => {
          const att = attendance.find(a => a.userId === emp.id);
          return (
            <div key={emp.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200" />
                <div>
                  <div className="text-xs font-bold text-slate-900">{emp.name}</div>
                  <div className="text-[10px] text-slate-500">{emp.designation}</div>
                  <div className="text-[10px] text-slate-400 mt-1">In: {att?.checkInTime || 'Offline'}</div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  att?.status === 'Checked In'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border border-slate-300'
                }`}
              >
                {att?.status || 'Offline'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Attendance Log Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Clock className="w-5 h-5 text-indigo-600" />
          Today's Office Shift Check-Ins
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold bg-slate-50">
                <th className="p-3">Staff Member</th>
                <th className="p-3">Role</th>
                <th className="p-3">Check-In Time</th>
                <th className="p-3">Check-Out Time</th>
                <th className="p-3">Session Work Note</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.map(att => (
                <tr key={att.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{att.userName}</td>
                  <td className="p-3 text-slate-500 capitalize">{att.userRole}</td>
                  <td className="p-3 font-semibold text-emerald-700">{att.checkInTime}</td>
                  <td className="p-3 text-slate-500">{att.checkOutTime || 'Active'}</td>
                  <td className="p-3 text-slate-600 italic">{att.notes || 'No work log attached.'}</td>
                  <td className="p-3 text-right">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        att.status === 'Checked In'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {att.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Login & Logout Audit Trail */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" />
            Security Audit Trail & Login Logs
          </h2>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Event Types</option>
              <option value="LOGIN">LOGIN</option>
              <option value="LOGOUT">LOGOUT</option>
              <option value="CHECK_IN">CHECK_IN</option>
              <option value="CHECK_OUT">CHECK_OUT</option>
              <option value="TASK_UPDATE">TASK_UPDATE</option>
              <option value="PROJECT_CREATE">PROJECT_CREATE</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {filteredActivity.map(log => (
            <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded ${
                    log.action === 'LOGIN' || log.action === 'CHECK_IN'
                      ? 'bg-emerald-100 text-emerald-800'
                      : log.action === 'LOGOUT' || log.action === 'CHECK_OUT'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  {log.action}
                </span>
                <div>
                  <span className="font-bold text-slate-900">{log.userName} ({log.userRole}): </span>
                  <span className="text-slate-600">{log.details}</span>
                </div>
              </div>

              <div className="text-right shrink-0 text-[10px] text-slate-400">
                <div>{log.timestamp}</div>
                <div>IP: {log.ip}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
