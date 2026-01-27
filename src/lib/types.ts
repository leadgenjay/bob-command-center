export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type IdeaCategory = 'content' | 'apps' | 'business' | 'social';
export type IdeaStatus = 'captured' | 'developing' | 'ready' | 'archived';
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: string | null;
  due_date: string | null;
  time_estimate: number | null; // in minutes
  created_at: string;
  updated_at: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string | null;
  time: string | null; // e.g., "9:00 AM"
  completed: boolean;
  order: number;
}

export interface Reminder {
  id: string;
  text: string;
  schedule: string; // cron expression or description
  nextRun: string | null;
  enabled: boolean;
  created_at: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string | null;
  category: IdeaCategory;
  tags: string[];
  priority: TaskPriority;
  status: IdeaStatus;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Preference {
  id: string;
  key: string;
  value: Record<string, unknown>;
  description: string | null;
  updated_at: string;
}

export interface Decision {
  id: string;
  title: string;
  context: string | null;
  outcome: string | null;
  tags: string[];
  created_at: string;
}

export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; emoji: string; color: string; bgColor: string }> = {
  backlog: { label: 'Backlog', emoji: '📋', color: 'text-gray-500 dark:text-gray-400', bgColor: 'bg-gray-500/10' },
  todo: { label: 'To Do', emoji: '📌', color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-500/10' },
  in_progress: { label: 'In Progress', emoji: '🔄', color: 'text-amber-500 dark:text-amber-400', bgColor: 'bg-amber-500/10' },
  review: { label: 'Review', emoji: '👀', color: 'text-purple-500 dark:text-purple-400', bgColor: 'bg-purple-500/10' },
  done: { label: 'Done', emoji: '✅', color: 'text-emerald-500 dark:text-emerald-400', bgColor: 'bg-emerald-500/10' },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; icon: string }> = {
  low: { label: 'Low', color: 'text-gray-500', icon: '○' },
  medium: { label: 'Medium', color: 'text-blue-500', icon: '◐' },
  high: { label: 'High', color: 'text-amber-500', icon: '●' },
  urgent: { label: 'Urgent', color: 'text-red-500', icon: '🔥' },
};

export const IDEA_CATEGORY_CONFIG: Record<IdeaCategory, { label: string; color: string; emoji: string }> = {
  content: { label: 'Content', color: 'bg-blue-500', emoji: '📝' },
  apps: { label: 'Apps', color: 'bg-purple-500', emoji: '📱' },
  business: { label: 'Business', color: 'bg-emerald-500', emoji: '💼' },
  social: { label: 'Social', color: 'bg-pink-500', emoji: '🌐' },
};

export const PROJECT_COLORS = [
  '#ED0D51', '#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', 
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
];
