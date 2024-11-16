export type FeatureFlag = 
  | 'gantt_chart'
  | 'resource_management'
  | 'document_versioning'
  | 'client_portal'
  | 'financial_module'
  | 'advanced_reporting'
  | 'bim_integration'
  | 'bulk_operations';

export interface SubscriptionPlan {
  id: string;
  name: string;
  maxUsers: number;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  enabledFeatures: FeatureFlag[];
  isEnterprise?: boolean;
}

export interface Subscription {
  id: string;
  planId: string;
  startDate: string;
  lastBillingDate: string;
  nextBillingDate: string;
  status: 'active' | 'cancelled' | 'expired';
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'manager' | 'user';
  firstName: string;
  lastName: string;
  position?: string;
  department?: string;
  createdAt: string;
  avatar?: string;
  isActive?: boolean;
  notificationPreferences: NotificationPreference[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  startDate: string;
  budget: number;
  requirements: string[];
  documentLinks: DocumentLink[];
  billingStatus: 'pending' | 'invoiced' | 'paid';
  assignedUsers: string[];
  access: {
    readAccess: string[];
    writeAccess: string[];
    admin: string[];
  };
  notes: ProjectNote[];
  tasks: Task[];
  phases: ProjectPhase[];
  photos: ProjectPhoto[];
}

export interface ProjectPhase {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in-progress' | 'completed';
  progress: number;
  assignedUsers: string[];
  color?: string;
  dependencies: string[];
}

export interface DocumentLink {
  id: string;
  name: string;
  url: string;
  type: 'local' | 'dropbox' | 'google-drive' | 'onedrive' | 'other';
  category: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
  version?: string;
}

export interface ProjectNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  type: 'general' | 'update' | 'issue' | 'milestone';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  phaseId?: string;
}

export interface ProjectPhoto {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: 'site-survey' | 'progress' | 'completion' | 'design' | 'other';
  location?: string;
  takenAt: string;
}

export type NotificationType = 
  | 'project_update'
  | 'task_assigned'
  | 'task_completed'
  | 'document_uploaded'
  | 'note_added'
  | 'photo_added'
  | 'project_status_changed'
  | 'deadline_approaching';

export interface NotificationPreference {
  userId: string;
  projectId?: string;
  types: NotificationType[];
  email: boolean;
  inApp: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  projectId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}