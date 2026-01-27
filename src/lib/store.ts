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
};

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
  
  // Only initialize if storage is empty
  if (getTasks().length === 0) {
    const sampleTasks: Omit<Task, 'id' | 'created_at' | 'updated_at'>[] = [
      { title: 'Review PR for auth system', description: 'Check security implementation', status: 'review', priority: 'high', project_id: null, due_date: new Date().toISOString().split('T')[0], time_estimate: 30 },
      { title: 'Design new dashboard layout', description: 'Create wireframes for v2', status: 'in_progress', priority: 'medium', project_id: null, due_date: null, time_estimate: 120 },
      { title: 'Write documentation', description: 'API endpoints and examples', status: 'todo', priority: 'medium', project_id: null, due_date: null, time_estimate: 60 },
      { title: 'Fix mobile responsiveness', description: 'Navigation menu issues on iOS', status: 'backlog', priority: 'low', project_id: null, due_date: null, time_estimate: 45 },
      { title: 'Set up CI/CD pipeline', description: 'GitHub Actions workflow', status: 'done', priority: 'high', project_id: null, due_date: null, time_estimate: 90 },
    ];
    sampleTasks.forEach(createTask);
  }

  if (getIdeas().length === 0) {
    const sampleIdeas: Omit<Idea, 'id' | 'created_at' | 'updated_at'>[] = [
      { title: 'AI-powered code review tool', description: 'Automate PR reviews with GPT', category: 'apps', tags: ['ai', 'automation', 'developer-tools'], priority: 'high', status: 'developing' },
      { title: 'Weekly tech newsletter', description: 'Curated dev news and tutorials', category: 'content', tags: ['writing', 'newsletter'], priority: 'medium', status: 'captured' },
      { title: 'Discord bot for team standup', description: 'Async standups in Slack/Discord', category: 'apps', tags: ['bot', 'productivity'], priority: 'low', status: 'captured' },
      { title: 'Freelance consulting service', description: 'AI integration consulting', category: 'business', tags: ['consulting', 'ai'], priority: 'medium', status: 'developing' },
    ];
    sampleIdeas.forEach(createIdea);
  }

  if (getProjects().length === 0) {
    const sampleProjects: Omit<Project, 'id' | 'created_at' | 'updated_at'>[] = [
      { name: 'Command Center', description: 'Personal task management dashboard', status: 'active', color: '#ED0D51' },
      { name: 'API Gateway', description: 'Centralized API management service', status: 'active', color: '#8B5CF6' },
      { name: 'Mobile App v2', description: 'React Native app redesign', status: 'paused', color: '#10B981' },
    ];
    sampleProjects.forEach(createProject);
  }

  if (getDecisions().length === 0) {
    const sampleDecisions: Omit<Decision, 'id' | 'created_at'>[] = [
      { title: 'Use Next.js 15 for new projects', context: 'Evaluated between Remix, Astro, and Next.js. Next.js has better ecosystem support.', outcome: 'All new web projects will use Next.js 15 with App Router', tags: ['tech-stack', 'frontend'] },
      { title: 'Supabase over Firebase', context: 'Need PostgreSQL for relational data. Firebase NoSQL is too limiting.', outcome: 'Migrating to Supabase for new backend projects', tags: ['tech-stack', 'backend'] },
    ];
    sampleDecisions.forEach(createDecision);
  }
}
