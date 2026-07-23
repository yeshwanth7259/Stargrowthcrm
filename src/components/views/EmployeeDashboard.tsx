import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  CheckSquare,
  Clock,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Plus,
  Play,
  Square,
  Sparkles,
  Calendar,
  UserCheck,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { TaskStatus } from '../../types/crm';

interface EmployeeDashboardProps {
  onOpenCheckInModal: () => void;
  onOpenNewTaskModal: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  onOpenCheckInModal,
  onOpenNewTaskModal,
}) => {
  const { currentUser, tasks, projects, updateTaskStatus, toggleSubtask, checkIn, checkOut, attendance } = useCRM();
  const [workLogNote, setWorkLogNote] = useState('');

  // Filter tasks assigned to current employee
  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id);
  const pendingTasks = myTasks.filter(t => t.status !== 'Completed');
  const completedTasks = myTasks.filter(t => t.status === 'Completed');

  // Filter projects current employee is assigned to
  const myProjects = projects.filter(p => p.assignedEmployeeIds.includes(currentUser.id));

  // Current attendance record
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.find(a => a.userId === currentUser.id && a.date === todayDate);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner with Employee Greeting & Shift Tracker */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-amber-500/30 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">Welcome, {currentUser.name}</h1>
              <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                {currentUser.department}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{currentUser.designation}</p>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                {pendingTasks.length} Pending Tasks
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                {myProjects.length} Active Campaigns
              </span>
            </div>
          </div>
        </div>

        {/* Shift Attendance Control Card */}
        <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/80 min-w-[280px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              Office Shift Status
            </span>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                todayAttendance?.status === 'Checked In'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {todayAttendance?.status || 'Offline'}
            </span>
          </div>

          <div className="text-xs text-slate-400 mb-3">
            In Time: <span className="font-bold text-white">{todayAttendance?.checkInTime || 'Not checked in yet'}</span>
          </div>

          <button
            onClick={onOpenCheckInModal}
            className={`w-full py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              todayAttendance?.status === 'Checked In'
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{todayAttendance?.status === 'Checked In' ? 'Update Shift / Check-Out' : 'Start Daily Shift & Check In'}</span>
          </button>
        </div>

      </div>

      {/* Main Employee Workstation: My Tasks Board */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-amber-500" />
              My Workstation & Assigned Campaign Deliverables
            </h2>
            <p className="text-xs text-slate-500">Update status, complete subtask items, and track deadlines.</p>
          </div>
          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Personal Task</span>
          </button>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myTasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all ${
                task.status === 'Completed'
                  ? 'bg-slate-50/70 border-slate-200/80 opacity-80'
                  : 'bg-white border-slate-200 hover:border-amber-400/80 shadow-2xs hover:shadow-md'
              }`}
            >
              {/* Card Top Row */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                  {task.campaignType}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityStyle(task.priority)}`}>
                  {task.priority} Priority
                </span>
              </div>

              {/* Title & Description */}
              <h3 className={`text-sm font-bold text-slate-900 ${task.status === 'Completed' ? 'line-through text-slate-500' : ''}`}>
                {task.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{task.description}</p>

              {/* Subtasks Checklist */}
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Checklist ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
                  </div>
                  {task.subtasks.map(st => (
                    <label key={st.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => toggleSubtask(task.id, st.id)}
                        className="rounded border-slate-300 text-amber-500 focus:ring-amber-400 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className={st.completed ? 'line-through text-slate-400' : ''}>{st.title}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Footer Controls: Status Selector & Due Date */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Due: <span className="font-semibold text-slate-800">{task.dueDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                    className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

            </div>
          ))}

          {myTasks.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
              <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No tasks assigned to your workstation yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* My Assigned Campaigns Overview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          Campaigns I'm Contributing To
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myProjects.map(proj => (
            <div key={proj.id} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-900">{proj.name}</div>
              <div className="text-[11px] text-slate-500">Client: {proj.clientName}</div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                <span className="font-bold text-amber-600">{proj.campaignType}</span>
                <span className="font-bold text-slate-700">{proj.progressPercentage}% Complete</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
