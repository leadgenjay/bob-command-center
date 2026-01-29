'use client';

import { v4 as uuidv4 } from 'uuid';
import { Task, Idea, Project, Preference, Decision, DailyTask, Reminder, TaskStatus, TaskPriority, IdeaCategory, IdeaStatus, ProjectStatus } from './types';

const STORAGE_KEYS = {
  tasks: 'bcc_tasks',
  ideas: 'bcc_ideas',
  projects: 'bcc_projects',
  preferences: 'bcc_preferences',
  decisions: 'bcc_decisions',
  dailyTasks: 'bcc_daily_tasks',
  reminders: 'bcc_reminders',
  dataVersion: 'bcc_data_version',
};

// Increment this to force a one-time data reset for all users
const CURRENT_DATA_VERSION = 5;

// Generic storage helpers
function getFromStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Tasks
export function getTasks(): Task[] {
  return getFromStorage<Task>(STORAGE_KEYS.tasks);
}

export function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Task {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveToStorage(STORAGE_KEYS.tasks, tasks);
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...updates, updated_at: new Date().toISOString() };
  saveToStorage(STORAGE_KEYS.tasks, tasks);
  return tasks[index];
}

export function deleteTask(id: string): boolean {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== id);
  if (filtered.length === tasks.length) return false;
  saveToStorage(STORAGE_KEYS.tasks, filtered);
  return true;
}

export function getTasksByStatus(status: TaskStatus): Task[] {
  return getTasks().filter(t => t.status === status);
}

export function getTodaysFocusTasks(): Task[] {
  const today = new Date().toISOString().split('T')[0];
  return getTasks()
    .filter(t => t.status !== 'done' && t.status !== 'backlog')
    .filter(t => !t.due_date || t.due_date <= today || t.priority === 'urgent' || t.priority === 'high')
    .sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);
}

// Ideas
export function getIdeas(): Idea[] {
  return getFromStorage<Idea>(STORAGE_KEYS.ideas);
}

export function createIdea(idea: Omit<Idea, 'id' | 'created_at' | 'updated_at'>): Idea {
  const ideas = getIdeas();
  const newIdea: Idea = {
    ...idea,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  ideas.push(newIdea);
  saveToStorage(STORAGE_KEYS.ideas, ideas);
  return newIdea;
}

export function updateIdea(id: string, updates: Partial<Idea>): Idea | null {
  const ideas = getIdeas();
  const index = ideas.findIndex(i => i.id === id);
  if (index === -1) return null;
  ideas[index] = { ...ideas[index], ...updates, updated_at: new Date().toISOString() };
  saveToStorage(STORAGE_KEYS.ideas, ideas);
  return ideas[index];
}

export function deleteIdea(id: string): boolean {
  const ideas = getIdeas();
  const filtered = ideas.filter(i => i.id !== id);
  if (filtered.length === ideas.length) return false;
  saveToStorage(STORAGE_KEYS.ideas, filtered);
  return true;
}

export function getIdeasByCategory(category: IdeaCategory): Idea[] {
  return getIdeas().filter(i => i.category === category);
}

// Projects
export function getProjects(): Project[] {
  return getFromStorage<Project>(STORAGE_KEYS.projects);
}

export function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project {
  const projects = getProjects();
  const newProject: Project = {
    ...project,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  projects.push(newProject);
  saveToStorage(STORAGE_KEYS.projects, projects);
  return newProject;
}

export function updateProject(id: string, updates: Partial<Project>): Project | null {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return null;
  projects[index] = { ...projects[index], ...updates, updated_at: new Date().toISOString() };
  saveToStorage(STORAGE_KEYS.projects, projects);
  return projects[index];
}

export function deleteProject(id: string): boolean {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);
  if (filtered.length === projects.length) return false;
  saveToStorage(STORAGE_KEYS.projects, filtered);
  return true;
}

// Preferences
export function getPreferences(): Preference[] {
  return getFromStorage<Preference>(STORAGE_KEYS.preferences);
}

export function getPreference(key: string): Preference | undefined {
  return getPreferences().find(p => p.key === key);
}

export function setPreference(key: string, value: Record<string, unknown>, description?: string): Preference {
  const preferences = getPreferences();
  const index = preferences.findIndex(p => p.key === key);
  const pref: Preference = {
    id: index >= 0 ? preferences[index].id : uuidv4(),
    key,
    value,
    description: description || (index >= 0 ? preferences[index].description : null),
    updated_at: new Date().toISOString(),
  };
  if (index >= 0) {
    preferences[index] = pref;
  } else {
    preferences.push(pref);
  }
  saveToStorage(STORAGE_KEYS.preferences, preferences);
  return pref;
}

export function deletePreference(key: string): boolean {
  const preferences = getPreferences();
  const filtered = preferences.filter(p => p.key !== key);
  if (filtered.length === preferences.length) return false;
  saveToStorage(STORAGE_KEYS.preferences, filtered);
  return true;
}

// Decisions
export function getDecisions(): Decision[] {
  return getFromStorage<Decision>(STORAGE_KEYS.decisions);
}

export function createDecision(decision: Omit<Decision, 'id' | 'created_at'>): Decision {
  const decisions = getDecisions();
  const newDecision: Decision = {
    ...decision,
    id: uuidv4(),
    created_at: new Date().toISOString(),
  };
  decisions.unshift(newDecision); // Add to beginning
  saveToStorage(STORAGE_KEYS.decisions, decisions);
  return newDecision;
}

export function updateDecision(id: string, updates: Partial<Decision>): Decision | null {
  const decisions = getDecisions();
  const index = decisions.findIndex(d => d.id === id);
  if (index === -1) return null;
  decisions[index] = { ...decisions[index], ...updates };
  saveToStorage(STORAGE_KEYS.decisions, decisions);
  return decisions[index];
}

export function deleteDecision(id: string): boolean {
  const decisions = getDecisions();
  const filtered = decisions.filter(d => d.id !== id);
  if (filtered.length === decisions.length) return false;
  saveToStorage(STORAGE_KEYS.decisions, filtered);
  return true;
}

// Daily Tasks
export function getDailyTasks(): DailyTask[] {
  return getFromStorage<DailyTask>(STORAGE_KEYS.dailyTasks).sort((a, b) => a.order - b.order);
}

export function createDailyTask(task: Omit<DailyTask, 'id'>): DailyTask {
  const tasks = getDailyTasks();
  const newTask: DailyTask = {
    ...task,
    id: uuidv4(),
  };
  tasks.push(newTask);
  saveToStorage(STORAGE_KEYS.dailyTasks, tasks);
  return newTask;
}

export function updateDailyTask(id: string, updates: Partial<DailyTask>): DailyTask | null {
  const tasks = getDailyTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...updates };
  saveToStorage(STORAGE_KEYS.dailyTasks, tasks);
  return tasks[index];
}

export function deleteDailyTask(id: string): boolean {
  const tasks = getDailyTasks();
  const filtered = tasks.filter(t => t.id !== id);
  if (filtered.length === tasks.length) return false;
  saveToStorage(STORAGE_KEYS.dailyTasks, filtered);
  return true;
}

export function resetDailyTasks(): void {
  const tasks = getDailyTasks();
  const reset = tasks.map(t => ({ ...t, completed: false }));
  saveToStorage(STORAGE_KEYS.dailyTasks, reset);
}

export function setDailyTasks(tasks: DailyTask[]): void {
  saveToStorage(STORAGE_KEYS.dailyTasks, tasks);
}

// Reminders
export function getReminders(): Reminder[] {
  return getFromStorage<Reminder>(STORAGE_KEYS.reminders);
}

export function createReminder(reminder: Omit<Reminder, 'id' | 'created_at'>): Reminder {
  const reminders = getReminders();
  const newReminder: Reminder = {
    ...reminder,
    id: uuidv4(),
    created_at: new Date().toISOString(),
  };
  reminders.push(newReminder);
  saveToStorage(STORAGE_KEYS.reminders, reminders);
  return newReminder;
}

export function updateReminder(id: string, updates: Partial<Reminder>): Reminder | null {
  const reminders = getReminders();
  const index = reminders.findIndex(r => r.id === id);
  if (index === -1) return null;
  reminders[index] = { ...reminders[index], ...updates };
  saveToStorage(STORAGE_KEYS.reminders, reminders);
  return reminders[index];
}

export function deleteReminder(id: string): boolean {
  const reminders = getReminders();
  const filtered = reminders.filter(r => r.id !== id);
  if (filtered.length === reminders.length) return false;
  saveToStorage(STORAGE_KEYS.reminders, filtered);
  return true;
}

export function setReminders(reminders: Reminder[]): void {
  saveToStorage(STORAGE_KEYS.reminders, reminders);
}

// Initialize with sample data if empty
export function initializeSampleData(): void {
  if (typeof window === 'undefined') return;
  
  // Check if we need to reset data due to version change
  const storedVersion = localStorage.getItem(STORAGE_KEYS.dataVersion);
  const needsReset = storedVersion !== String(CURRENT_DATA_VERSION);
  
  if (needsReset) {
    // Clear all existing data
    Object.values(STORAGE_KEYS).forEach(key => {
      if (key !== STORAGE_KEYS.dataVersion) {
        localStorage.removeItem(key);
      }
    });
    // Update version
    localStorage.setItem(STORAGE_KEYS.dataVersion, String(CURRENT_DATA_VERSION));
  }
  
  // Only initialize if storage is empty
  if (getTasks().length === 0) {
    const sampleTasks: Omit<Task, 'id' | 'created_at' | 'updated_at'>[] = [
      // Upcoming tasks
      { title: 'Fix affiliate attribution - Jorge Hernandez', description: 'Affiliate Ian (ian@leadgenjay.com) needs attribution confirmed for customer quantumhumanusoutlook.com. [Submitted by: Madison | Platform: Gmail]', status: 'todo', priority: 'high', project_id: null, due_date: '2026-01-27', time_estimate: 15 },
      { title: 'Set up Bob messaging monitoring', description: 'Configure Bob to monitor iMessage, Slack, and Email for action items and create daily task summaries', status: 'todo', priority: 'high', project_id: null, due_date: '2026-01-27', time_estimate: 60 },
      { title: 'DASH cold email system call', description: 'Meeting with Ronald Hans to discuss cold email system for DASH', status: 'todo', priority: 'high', project_id: null, due_date: '2026-01-28', time_estimate: 30 },
      { title: 'Review Bob Command Center SOPs', description: 'Go through existing SOPs and identify gaps or improvements needed', status: 'backlog', priority: 'medium', project_id: null, due_date: null, time_estimate: 45 },
      { title: 'Train Bob on client communication style', description: 'Provide examples of preferred email tone and scheduling language', status: 'backlog', priority: 'medium', project_id: null, due_date: null, time_estimate: 30 },
      // Completed tasks - Jan 26, 2026
      { title: 'Deploy Bob Command Center', description: 'Set up and deploy the app to bob.nextwave.io via Vercel', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-26', time_estimate: 30 },
      { title: 'Add Reminders page to app', description: 'Create /reminders page for viewing and managing scheduled reminders', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-26', time_estimate: 20 },
      { title: 'Add Daily Tasks page to app', description: 'Create /daily page for recurring daily routine tasks', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-26', time_estimate: 20 },
      { title: 'Set up 8am Calendar Management cron', description: 'Daily cron job to review calendar and send morning briefing', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-26', time_estimate: 10 },
      { title: 'Set up Email Check cron (every 10 min)', description: 'Automated email monitoring for new messages requiring action', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-26', time_estimate: 10 },
      { title: 'Test Calendar Management SOP', description: 'End-to-end test with Madison meeting scheduling request', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-26', time_estimate: 15 },
      { title: 'Send scheduling email to Madison', description: 'Proposed Wednesday meeting times per Calendar SOP', status: 'done', priority: 'medium', project_id: null, due_date: '2026-01-26', time_estimate: 5 },
      { title: 'Fix app navigation', description: 'Restored SOPs and Ideas tabs that were accidentally removed', status: 'done', priority: 'medium', project_id: null, due_date: '2026-01-26', time_estimate: 10 },
      { title: 'Replace placeholder data with real content', description: 'Updated all sample tasks, ideas, projects, and decisions with real data', status: 'done', priority: 'medium', project_id: null, due_date: '2026-01-26', time_estimate: 15 },
      { title: 'Add data reset mechanism', description: 'Version-based auto-reset for forcing data updates across all users', status: 'done', priority: 'medium', project_id: null, due_date: '2026-01-26', time_estimate: 10 },
      { title: 'Create Calendar Management SOP', description: 'Documented full SOP for daily calendar review and meeting scheduling', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-26', time_estimate: 30 },
      { title: 'Create SOP Creation SOP', description: 'Meta-SOP for how to create and maintain SOPs', status: 'done', priority: 'medium', project_id: null, due_date: '2026-01-26', time_estimate: 20 },
    ];
    sampleTasks.forEach(createTask);
  }

  if (getIdeas().length === 0) {
    const sampleIdeas: Omit<Idea, 'id' | 'created_at' | 'updated_at'>[] = [
      { title: 'AI-powered lead qualification', description: 'Use Bob to pre-qualify inbound leads based on criteria before scheduling calls', category: 'business', tags: ['ai', 'automation', 'leads'], priority: 'high', status: 'captured' },
      { title: 'Automated follow-up sequences', description: 'Bob sends follow-up emails to prospects who go quiet after initial contact', category: 'business', tags: ['automation', 'email', 'sales'], priority: 'medium', status: 'captured' },
      { title: 'Weekly client check-in automation', description: 'Bob drafts personalized check-in emails for active clients', category: 'business', tags: ['automation', 'client-success'], priority: 'medium', status: 'captured' },
      { title: 'Voice memo to task extraction', description: 'Send Bob a voice memo and have it extracted into actionable tasks', category: 'apps', tags: ['ai', 'productivity'], priority: 'low', status: 'captured' },
    ];
    sampleIdeas.forEach(createIdea);
  }

  if (getProjects().length === 0) {
    const sampleProjects: Omit<Project, 'id' | 'created_at' | 'updated_at'>[] = [
      { name: 'Bob Command Center', description: 'Task management and SOP dashboard for AI-human collaboration', status: 'active', color: '#ED0D51' },
      { name: 'Lead Gen Jay Operations', description: 'Core business operations and client management', status: 'active', color: '#3B82F6' },
      { name: 'Bob AI Assistant', description: 'Ongoing development and training of Bob capabilities', status: 'active', color: '#8B5CF6' },
    ];
    sampleProjects.forEach(createProject);
  }

  if (getDecisions().length === 0) {
    const sampleDecisions: Omit<Decision, 'id' | 'created_at'>[] = [
      { title: 'Bob handles calendar scheduling', context: 'Need consistent, preference-aware scheduling without manual back-and-forth. Bob manages all meeting scheduling following the Calendar Management SOP.', outcome: 'Bob checks calendar, proposes times, gets approval, sends to clients', tags: ['operations', 'bob'] },
      { title: 'No calls before 10 AM', context: 'Mornings are for deep work and personal training. Scheduling preference to protect morning focus time.', outcome: 'Bob only proposes meeting times 10 AM or later', tags: ['preferences', 'calendar'] },
      { title: 'Bob Command Center for task management', context: 'Things 3 not installed, need something Bob can directly access. Use bob.nextwave.io instead of external apps.', outcome: 'All tasks, ideas, and SOPs managed through Bob Command Center', tags: ['tools', 'operations'] },
    ];
    sampleDecisions.forEach(createDecision);
  }
}
