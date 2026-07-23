export type UserRole = 'manager' | 'employee' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  designation: string;
  department?: 'Management' | 'SEO & Content' | 'Paid Media (PPC)' | 'Social Media' | 'Design & Tech' | 'Client Account';
  clientId?: string; // If user is a client
  activeSession?: {
    checkInTime: string; // ISO string or time string
    status: 'online' | 'busy' | 'break' | 'offline';
    todayHoursLogged: number; // e.g. 6.5
    lastLogNote?: string;
  };
}

export type CampaignType = 'SEO' | 'Google Ads (PPC)' | 'Meta & Social Ads' | 'Content Marketing' | 'Email Automation' | 'Web & CRO';

export type ProjectStatus = 'Planning' | 'Active' | 'Review' | 'Completed' | 'On Hold';

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  campaignType: CampaignType;
  budgetMonthly: number;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  progressPercentage: number;
  assignedManagerId: string;
  assignedEmployeeIds: string[];
  kpis: {
    impressions?: number;
    clicks?: number;
    conversions?: number;
    roas?: number;
    leadsGenerated?: number;
    organicTrafficChange?: string; // e.g. "+34%"
  };
  deliverablesCount: {
    completed: number;
    total: number;
  };
  description: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Completed';

export interface Task {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  campaignType: CampaignType;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  estimatedHours: number;
  subtasks: { id: string; title: string; completed: boolean }[];
  commentsCount: number;
  createdAt: string;
}

export type LeadStage = 'New Inquiry' | 'Strategy Pitch' | 'Proposal Sent' | 'Contract Signed' | 'Closed Won' | 'Closed Lost';

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  servicesInterested: CampaignType[];
  estimatedMonthlyValue: number;
  stage: LeadStage;
  assignedTo: string;
  lastContactDate: string;
  notes: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:MM AM/PM
  checkOutTime?: string; // HH:MM AM/PM
  totalHours: number;
  status: 'Checked In' | 'Checked Out' | 'On Break';
  notes?: string;
  ipAddress?: string;
}

export interface ClientApproval {
  id: string;
  clientId: string;
  projectId: string;
  projectName: string;
  title: string;
  category: 'Ad Creative' | 'Blog Article' | 'Monthly Budget' | 'Campaign Strategy';
  submittedBy: string;
  submittedDate: string;
  status: 'Pending Approval' | 'Approved' | 'Changes Requested';
  previewUrl?: string;
  contentSnippet?: string;
  clientFeedback?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  projectName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: { description: string; amount: number }[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'LOGIN' | 'LOGOUT' | 'CHECK_IN' | 'CHECK_OUT' | 'TASK_UPDATE' | 'PROJECT_CREATE' | 'APPROVAL_CHANGE' | 'AI_STRATEGY_GEN';
  details: string;
  ip: string;
}
