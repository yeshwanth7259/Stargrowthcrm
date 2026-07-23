import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Project,
  Task,
  Lead,
  AttendanceRecord,
  ClientApproval,
  Invoice,
  ActivityLog,
  TaskStatus,
  ProjectStatus,
  LeadStage,
} from '../types/crm';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_LEADS,
  INITIAL_ATTENDANCE,
  INITIAL_APPROVALS,
  INITIAL_INVOICES,
  INITIAL_ACTIVITY_LOGS,
} from '../data/initialData';

interface CRMContextType {
  currentUser: User;
  users: User[];
  projects: Project[];
  tasks: Task[];
  leads: Lead[];
  attendance: AttendanceRecord[];
  approvals: ClientApproval[];
  invoices: Invoice[];
  activityLogs: ActivityLog[];
  activeRole: UserRole;
  isAuthenticated: boolean;
  login: (userId: string, email?: string, backendUser?: any) => boolean;
  logout: () => void;
  addUser: (user: any) => void;
  switchUser: (userId: string) => void;
  checkIn: (note?: string) => void;
  checkOut: (note?: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProjectStatus: (projectId: string, status: ProjectStatus, progressPercentage: number) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLeadStage: (leadId: string, stage: LeadStage) => void;
  updateApprovalStatus: (approvalId: string, status: 'Approved' | 'Changes Requested', feedback?: string) => void;
  logActivity: (action: ActivityLog['action'], details: string) => void;
  resetAllData: () => void;
}

const STORAGE_KEYS = {
  USERS: 'sgh_crm_v3_users',
  CURRENT_USER: 'sgh_crm_v3_current_user_id',
  IS_AUTH: 'sgh_crm_v3_is_authenticated',
  PROJECTS: 'sgh_crm_v3_projects',
  TASKS: 'sgh_crm_v3_tasks',
  LEADS: 'sgh_crm_v3_leads',
  ATTENDANCE: 'sgh_crm_v3_attendance',
  APPROVALS: 'sgh_crm_v3_approvals',
  INVOICES: 'sgh_crm_v3_invoices',
  ACTIVITY: 'sgh_crm_v3_activity',
};

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved || 'usr_m1';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_AUTH);
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [approvals, setApprovals] = useState<ClientApproval[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPROVALS);
    return saved ? JSON.parse(saved) : INITIAL_APPROVALS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const currentUser = users.find(u => u.id === currentUserId) || users[0] || { id: '', name: 'Guest', role: 'employee' as UserRole };
  const activeRole = currentUser.role;

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_AUTH, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activityLogs));
  }, [activityLogs]);

  const logActivity = (action: ActivityLog['action'], details: string) => {
    const newLog: ActivityLog = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      details,
      ip: '103.21.124.' + (Math.floor(Math.random() * 50) + 80),
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const login = (userId: string, email?: string, backendUser?: any) => {
    let targetUser = users.find(u => u.id === userId);
    
    if (!targetUser && backendUser) {
      // Map backend role to frontend role (manager, employee, client, accountant)
      let frontendRole = 'employee';
      if (backendUser.role.includes('MANAGER')) frontendRole = 'manager';
      else if (backendUser.role === 'CLIENT') frontendRole = 'client';
      else if (backendUser.role === 'ACCOUNTANT') frontendRole = 'accountant';
      
      targetUser = {
        id: backendUser.id,
        name: backendUser.name,
        role: frontendRole as UserRole,
        email: email || '',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(backendUser.name)}&background=0D8ABC&color=fff`,
        activeSession: { status: 'offline', checkInTime: '', todayHoursLogged: 0, lastLogNote: '' }
      };
      
      setUsers(prev => {
        // Replace if already exists, else prepend
        const exists = prev.some(u => u.id === targetUser!.id);
        if (exists) return prev.map(u => u.id === targetUser!.id ? targetUser! : u);
        return [targetUser!, ...prev];
      });
    } else if (!targetUser && email) {
      targetUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    }
    
    if (!targetUser) {
      if (users.length > 0) {
        targetUser = users[0];
      } else {
        // Should theoretically not happen if backendUser was provided, but safeguard just in case
        console.error("Login failed: User not found and no users exist in context.");
        return false;
      }
    }

    setCurrentUserId(targetUser.id);
    setIsAuthenticated(true);

    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    setUsers(prev =>
      prev.map(u => {
        if (u.id === targetUser!.id) {
          return {
            ...u,
            activeSession: {
              checkInTime: timeStr,
              status: 'online',
              todayHoursLogged: u.activeSession ? u.activeSession.todayHoursLogged : 0,
              lastLogNote: 'Authenticated workstation session',
            },
          };
        }
        return u;
      })
    );

    logActivity('LOGIN', `${targetUser.name} authenticated & logged into Star Growth Hub Dashboard as ${targetUser.role.toUpperCase()}`);
    return true;
  };

  const logout = () => {
    logActivity('LOGOUT', `${currentUser.name} logged out from Star Growth Hub session`);
    setIsAuthenticated(false);
    setUsers(prev =>
      prev.map(u => {
        if (u.id === currentUser.id && u.activeSession) {
          return {
            ...u,
            activeSession: {
              ...u.activeSession,
              status: 'offline',
            },
          };
        }
        return u;
      })
    );
  };

  const switchUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    logActivity('LOGOUT', `${currentUser.name} logged out from ${currentUser.role.toUpperCase()} role context`);
    setCurrentUserId(userId);
    setIsAuthenticated(true);

    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    logActivity('LOGIN', `${targetUser.name} authenticated & logged into Star Growth Hub as ${targetUser.role.toUpperCase()}`);

    // Update user status
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId && u.activeSession) {
          return {
            ...u,
            activeSession: {
              ...u.activeSession,
              status: 'online',
            },
          };
        }
        return u;
      })
    );
  };

  const checkIn = (note?: string) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toISOString().split('T')[0];

    // Check if attendance record exists for today
    const existingIndex = attendance.findIndex(a => a.userId === currentUser.id && a.date === dateStr);

    if (existingIndex >= 0) {
      setAttendance(prev => {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          checkInTime: timeStr,
          status: 'Checked In',
          notes: note || copy[existingIndex].notes,
        };
        return copy;
      });
    } else {
      const newRecord: AttendanceRecord = {
        id: 'att_' + Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        date: dateStr,
        checkInTime: timeStr,
        totalHours: 0.1,
        status: 'Checked In',
        notes: note || 'Checked in via Workstation Widget',
        ipAddress: '103.21.124.90',
      };
      setAttendance(prev => [newRecord, ...prev]);
    }

    // Update user active session
    setUsers(prev =>
      prev.map(u => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            activeSession: {
              checkInTime: timeStr,
              status: 'online',
              todayHoursLogged: u.activeSession ? u.activeSession.todayHoursLogged + 0.1 : 0.5,
              lastLogNote: note || 'Active in office workstation',
            },
          };
        }
        return u;
      })
    );

    logActivity('CHECK_IN', `${currentUser.name} checked in at ${timeStr}. Note: "${note || 'Shift Started'}"`);
  };

  const checkOut = (note?: string) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toISOString().split('T')[0];

    setAttendance(prev =>
      prev.map(a => {
        if (a.userId === currentUser.id && a.date === dateStr) {
          return {
            ...a,
            checkOutTime: timeStr,
            status: 'Checked Out',
            notes: note ? `${a.notes} | Out Note: ${note}` : a.notes,
          };
        }
        return a;
      })
    );

    setUsers(prev =>
      prev.map(u => {
        if (u.id === currentUser.id && u.activeSession) {
          return {
            ...u,
            activeSession: {
              ...u.activeSession,
              status: 'offline',
              lastLogNote: note || 'Checked out for the day',
            },
          };
        }
        return u;
      })
    );

    logActivity('CHECK_OUT', `${currentUser.name} checked out at ${timeStr}. Note: "${note || 'Shift Ended'}"`);
  };

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: 'prj_' + Date.now(),
    };
    setProjects(prev => [newProject, ...prev]);
    logActivity('PROJECT_CREATE', `Created new campaign project "${newProject.name}" for client "${newProject.clientName}" with monthly budget $${newProject.budgetMonthly.toLocaleString()}`);
  };

  const updateProjectStatus = (projectId: string, status: ProjectStatus, progressPercentage: number) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return { ...p, status, progressPercentage };
        }
        return p;
      })
    );
    const proj = projects.find(p => p.id === projectId);
    logActivity('PROJECT_CREATE', `Updated project "${proj?.name || projectId}" status to ${status} (${progressPercentage}% complete)`);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'tsk_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [newTask, ...prev]);
    logActivity('TASK_UPDATE', `Assigned task "${newTask.title}" to ${newTask.assigneeName} for project "${newTask.projectName}"`);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return { ...t, status };
        }
        return t;
      })
    );
    const task = tasks.find(t => t.id === taskId);
    logActivity('TASK_UPDATE', `Updated task "${task?.title || taskId}" status to "${status}"`);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map(s => {
            if (s.id === subtaskId) {
              return { ...s, completed: !s.completed };
            }
            return s;
          });
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  const addLead = (leadData: Omit<Lead, 'id'>) => {
    const newLead: Lead = {
      ...leadData,
      id: 'lead_' + Date.now(),
    };
    setLeads(prev => [newLead, ...prev]);
    logActivity('PROJECT_CREATE', `Added new CRM lead "${newLead.companyName}" ($${newLead.estimatedMonthlyValue.toLocaleString()}/mo pitch)`);
  };

  const updateLeadStage = (leadId: string, stage: LeadStage) => {
    setLeads(prev =>
      prev.map(l => {
        if (l.id === leadId) {
          return { ...l, stage };
        }
        return l;
      })
    );
    const lead = leads.find(l => l.id === leadId);
    logActivity('PROJECT_CREATE', `Moved lead "${lead?.companyName || leadId}" stage to "${stage}"`);
  };

  const updateApprovalStatus = (approvalId: string, status: 'Approved' | 'Changes Requested', feedback?: string) => {
    setApprovals(prev =>
      prev.map(a => {
        if (a.id === approvalId) {
          return { ...a, status, clientFeedback: feedback || a.clientFeedback };
        }
        return a;
      })
    );
    const app = approvals.find(a => a.id === approvalId);
    logActivity('APPROVAL_CHANGE', `Client ${status.toLowerCase()} deliverable item "${app?.title}" with notes: "${feedback || 'No comments'}"`);
  };

  const resetAllData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUserId('usr_m1');
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setLeads(INITIAL_LEADS);
    setAttendance(INITIAL_ATTENDANCE);
    setApprovals(INITIAL_APPROVALS);
    setInvoices(INITIAL_INVOICES);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    localStorage.clear();
  };

  const addUser = (newUser: any) => {
    setUsers(prev => [newUser, ...prev]);
    logActivity('PROJECT_CREATE', `Added new user ${newUser.name} to the system (${newUser.role})`);
  };

  return (
    <CRMContext.Provider
      value={{
        currentUser,
        users,
        projects,
        tasks,
        leads,
        attendance,
        approvals,
        invoices,
        activityLogs,
        activeRole,
        isAuthenticated,
        login,
        logout,
        addUser,
        switchUser,
        checkIn,
        checkOut,
        addProject,
        updateProjectStatus,
        addTask,
        updateTaskStatus,
        toggleSubtask,
        addLead,
        updateLeadStage,
        updateApprovalStatus,
        logActivity,
        resetAllData,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
