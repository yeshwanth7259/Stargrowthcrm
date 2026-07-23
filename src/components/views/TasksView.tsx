import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  CheckSquare,
  Plus,
  Filter,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
} from 'lucide-react';
import { TaskStatus } from '../../types/crm';

interface TasksViewProps {
  onOpenNewTaskModal: () => void;
  searchQuery: string;
}

export const TasksView: React.FC<TasksViewProps> = ({ onOpenNewTaskModal, searchQuery }) => {
  const { tasks, users, updateTaskStatus, toggleSubtask } = useCRM();
  const [selectedAssignee, setSelectedAssignee] = useState<string>('All');

  const filteredTasks = tasks.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assigneeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssignee = selectedAssignee === 'All' || t.assigneeId === selectedAssignee;
    return matchesSearch && matchesAssignee;
  });

  const columns: TaskStatus[] = ['To Do', 'In Progress', 'In Review', 'Completed'];

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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Task Assignments & Campaign Deliverables</h1>
          <p className="text-xs text-slate-500 mt-1">Kanban board for task dispatch, employee assignments, and subtasks.</p>
        </div>
        <button
          onClick={onOpenNewTaskModal}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Assign New Task</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter by Employee:</span>
        </div>

        <select
          value={selectedAssignee}
          onChange={(e) => setSelectedAssignee(e.target.value)}
          className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="All">All Staff Members</option>
          {users.filter(u => u.role === 'employee').map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
        {columns.map(status => {
          const colTasks = filteredTasks.filter(t => t.status === status);
          return (
            <div key={status} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3 min-w-[250px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{status}</span>
                <span className="text-xs font-extrabold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {colTasks.map(task => (
                  <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-3">
                    
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] font-extrabold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {task.campaignType}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{task.description}</p>
                    </div>

                    {/* Subtasks */}
                    {task.subtasks.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        {task.subtasks.map(st => (
                          <label key={st.id} className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={st.completed}
                              onChange={() => toggleSubtask(task.id, st.id)}
                              className="rounded border-slate-300 text-amber-500 focus:ring-amber-400 w-3 h-3 cursor-pointer"
                            />
                            <span className={st.completed ? 'line-through text-slate-400' : ''}>{st.title}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-semibold text-slate-700">{task.assigneeName}</span>
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                        className="text-[10px] bg-slate-100 border border-slate-300 rounded px-1 py-0.5 text-slate-700 focus:outline-none"
                      >
                        {columns.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                    No tasks
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
