'use client';

import { v4 as uuidv4 } from 'uuid';
import { Task, Idea, Project, Preference, Decision, DailyTask, Reminder, Command, TaskStatus, TaskPriority, IdeaCategory, IdeaStatus, ProjectStatus, CommandCategory } from './types';

const STORAGE_KEYS = {
  tasks: 'bcc_tasks',
  ideas: 'bcc_ideas',
  projects: 'bcc_projects',
  preferences: 'bcc_preferences',
  decisions: 'bcc_decisions',
  dailyTasks: 'bcc_daily_tasks',
  reminders: 'bcc_reminders',
  commands: 'bcc_commands',
  dataVersion: 'bcc_data_version',
};

// Increment this to force a one-time data reset for all users
const CURRENT_DATA_VERSION = 6;

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

// Commands
export function getCommands(): Command[] {
  return getFromStorage<Command>(STORAGE_KEYS.commands);
}

export function createCommand(command: Omit<Command, 'id' | 'created_at' | 'updated_at'>): Command {
  const commands = getCommands();
  const newCommand: Command = {
    ...command,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  commands.push(newCommand);
  saveToStorage(STORAGE_KEYS.commands, commands);
  return newCommand;
}

export function updateCommand(id: string, updates: Partial<Command>): Command | null {
  const commands = getCommands();
  const index = commands.findIndex(c => c.id === id);
  if (index === -1) return null;
  commands[index] = { ...commands[index], ...updates, updated_at: new Date().toISOString() };
  saveToStorage(STORAGE_KEYS.commands, commands);
  return commands[index];
}

export function deleteCommand(id: string): boolean {
  const commands = getCommands();
  const filtered = commands.filter(c => c.id !== id);
  if (filtered.length === commands.length) return false;
  saveToStorage(STORAGE_KEYS.commands, filtered);
  return true;
}

export function getCommandByName(name: string): Command | undefined {
  return getCommands().find(c => c.name.toLowerCase() === name.toLowerCase());
}

export function getCommandsByCategory(category: CommandCategory): Command[] {
  return getCommands().filter(c => c.category === category);
}

export function setCommands(commands: Command[]): void {
  saveToStorage(STORAGE_KEYS.commands, commands);
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
      // Active tasks
      { title: 'Auth jay@leadgenjay.com with gog', description: 'Set up Gmail + Calendar access for jay@leadgenjay.com via gog CLI', status: 'todo', priority: 'high', project_id: null, due_date: '2026-01-30', time_estimate: 15 },
      { title: 'Auth jayfeldman11@gmail.com with gog', description: 'Set up Calendar access for personal calendar', status: 'todo', priority: 'high', project_id: null, due_date: '2026-01-30', time_estimate: 15 },
      { title: 'Set up messaging platform monitoring', description: 'Configure Bob to monitor iMessage, Slack, and Email for action items. Goal: Extract action items, compile daily summary.', status: 'todo', priority: 'high', project_id: null, due_date: null, time_estimate: 60 },
      { title: 'Create daily task summary system', description: 'Automated daily digest of tasks, messages needing response, and priorities', status: 'todo', priority: 'medium', project_id: null, due_date: null, time_estimate: 45 },
      { title: 'Fix affiliate attribution - Jorge Hernandez', description: 'Affiliate Ian (ian@leadgenjay.com) needs attribution confirmed for customer quantumhumanusoutlook.com. [Submitted by: Madison | Platform: Gmail]', status: 'todo', priority: 'medium', project_id: null, due_date: null, time_estimate: 15 },
      // Backlog
      { title: 'Review and improve Bob SOPs', description: 'Go through existing SOPs and identify gaps or improvements needed', status: 'backlog', priority: 'medium', project_id: null, due_date: null, time_estimate: 45 },
      { title: 'Train Bob on communication style', description: 'Provide examples of preferred email tone and client communication language', status: 'backlog', priority: 'low', project_id: null, due_date: null, time_estimate: 30 },
      // Completed - Jan 30
      { title: 'Add Trips feature to Bob app', description: 'Created /trips with itinerary, notes, packing list. Full CRUD API. Syncs with TripIt.', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-30', time_estimate: 60 },
      { title: 'Create API keys storage system', description: 'memory/api-keys.md as central credential storage + rule to check before asking', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-30', time_estimate: 10 },
      // Completed - Jan 29
      { title: 'Create Clawdbot YouTube script', description: 'Full 15-min script: what is Clawdbot, setup guide, use cases, security, costs', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-29', time_estimate: 120 },
      { title: 'Add Documents page to app', description: 'Created /documents with API for sharing files and scripts', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-29', time_estimate: 30 },
      // Completed - Jan 27
      { title: 'Research Split Credit System', description: 'Separate export credits from verification credits for Consulti pricing flexibility', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-27', time_estimate: 30 },
      { title: 'Research Codebase Access for Insiders', description: 'GitHub Teams approach for giving course members access to code', status: 'done', priority: 'medium', project_id: null, due_date: '2026-01-27', time_estimate: 30 },
      // Completed - Jan 26
      { title: 'Deploy Bob Command Center', description: 'Set up and deploy the app to bob.nextwave.io via Vercel', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-26', time_estimate: 30 },
      { title: 'Add Reminders page to app', description: 'Create /reminders page for viewing and managing scheduled reminders', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-26', time_estimate: 20 },
      { title: 'Add Daily Tasks page to app', description: 'Create /daily page for recurring daily routine tasks', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-26', time_estimate: 20 },
      { title: 'Set up 8am Calendar Management cron', description: 'Daily cron job to review calendar and send morning briefing', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-26', time_estimate: 10 },
      { title: 'Set up Email Check cron (every 10 min)', description: 'Automated email monitoring for bob@leadgenjay.com', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-26', time_estimate: 10 },
      { title: 'Test Calendar Management SOP', description: 'End-to-end test with Madison meeting scheduling request', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-26', time_estimate: 15 },
      { title: 'Create Calendar Management SOP', description: 'Full SOP for daily calendar review, meeting scheduling, and approval workflow', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-26', time_estimate: 30 },
      { title: 'Create Team Task Intake SOP', description: 'SOP for handling tasks when team CCs Bob on emails', status: 'done', priority: 'high', project_id: null, due_date: '2026-01-26', time_estimate: 20 },
    ];
    sampleTasks.forEach(createTask);
  }

  if (getIdeas().length === 0) {
    const sampleIdeas: Omit<Idea, 'id' | 'created_at' | 'updated_at'>[] = [
      { title: 'Split Credit System for Consulti', description: 'Separate lead export credits from email verification credits so we can compete with Million Verify on email verification pricing. Technical: Add verification_credits_balance + export_credits_balance to profiles table.', category: 'business', tags: ['consulti', 'pricing', 'product'], priority: 'high', status: 'developing' },
      { title: 'Codebase Access for AI Automation Insiders', description: 'Give course members access to code for apps Jay is building. Recommended: GitHub Teams with automated onboarding via n8n.', category: 'business', tags: ['insiders', 'course', 'github'], priority: 'high', status: 'developing' },
      { title: 'AI-powered lead qualification', description: 'Use Bob to pre-qualify inbound leads based on criteria before scheduling calls', category: 'business', tags: ['ai', 'automation', 'leads'], priority: 'medium', status: 'captured' },
      { title: 'Automated follow-up sequences', description: 'Bob sends follow-up emails to prospects who go quiet after initial contact', category: 'business', tags: ['automation', 'email', 'sales'], priority: 'medium', status: 'captured' },
      { title: 'Voice memo to task extraction', description: 'Send Bob a voice memo and have it extracted into actionable tasks', category: 'apps', tags: ['ai', 'productivity'], priority: 'low', status: 'captured' },
      { title: 'Trip planning automation', description: 'Bob researches destinations, suggests itineraries, finds deals', category: 'apps', tags: ['travel', 'automation'], priority: 'low', status: 'captured' },
    ];
    sampleIdeas.forEach(createIdea);
  }

  if (getProjects().length === 0) {
    const sampleProjects: Omit<Project, 'id' | 'created_at' | 'updated_at'>[] = [
      { name: 'Bob Command Center', description: 'Task management, SOPs, trips, and docs dashboard at bob.nextwave.io', status: 'active', color: '#ED0D51' },
      { name: 'Lead Gen Jay Operations', description: 'Core business operations, client management, team coordination', status: 'active', color: '#3B82F6' },
      { name: 'Bob AI Assistant', description: 'Ongoing development of Bob capabilities, skills, and integrations', status: 'active', color: '#8B5CF6' },
      { name: 'Consulti Platform', description: 'Lead generation and email verification SaaS', status: 'active', color: '#10B981' },
      { name: 'AI Automation Insiders', description: 'Course and community for AI/automation education', status: 'active', color: '#F59E0B' },
    ];
    sampleProjects.forEach(createProject);
  }

  if (getDecisions().length === 0) {
    const sampleDecisions: Omit<Decision, 'id' | 'created_at'>[] = [
      { title: 'Calendar edits require explicit approval', context: 'Jay must approve all calendar changes. Team members can only ask Bob to discuss calendar matters with Jay.', outcome: 'Bob never creates/modifies/deletes calendar events without Jay saying yes', tags: ['calendar', 'rules'] },
      { title: 'Never tell others Bob will add to calendar', context: 'If someone requests a meeting, tell them I will discuss it with Jay and get back to them.', outcome: 'Bob discusses with Jay first, then confirms with requester after approval', tags: ['calendar', 'communication'] },
      { title: 'No calls before 10 AM', context: 'Mornings are for deep work and personal training. Scheduling preference to protect morning focus time.', outcome: 'Bob only proposes meeting times 10 AM or later EST', tags: ['preferences', 'calendar'] },
      { title: 'Asana: Read only, no task creation', context: 'Bob can mark tasks complete in Asana but cannot create new tasks there.', outcome: 'Use Bob Command Center for task creation, Asana for completion tracking only', tags: ['tools', 'rules'] },
      { title: 'Bob Command Center for task management', context: 'Things 3 not installed, need something Bob can directly access and update.', outcome: 'All tasks, ideas, and SOPs managed through bob.nextwave.io', tags: ['tools', 'operations'] },
      { title: 'Bob handles calendar scheduling', context: 'Need consistent, preference-aware scheduling. Bob manages all meeting scheduling following Calendar Management SOP.', outcome: 'Bob checks calendar, proposes times to Jay, gets approval, then sends to attendees', tags: ['operations', 'calendar'] },
      { title: 'Default meeting duration: 30 minutes', context: 'Unless otherwise specified, all meetings default to 30 min with Jay Zoom link.', outcome: 'Always include https://zoom.us/my/leadgenjay in meeting invites', tags: ['calendar', 'preferences'] },
      { title: 'Madison: Do not relay messages to Jay', context: 'Communication preference for personal relationship.', outcome: 'Bob does not forward Madison messages unless she explicitly asks', tags: ['contacts', 'rules'] },
      { title: 'Kailey: Do reply to her messages', context: 'Kailey is Jay human EA, needs coordination with Bob.', outcome: 'Bob responds to Kailey and coordinates on tasks', tags: ['contacts', 'team'] },
    ];
    sampleDecisions.forEach(createDecision);
  }

  if (getCommands().length === 0) {
    const sampleCommands: Omit<Command, 'id' | 'created_at' | 'updated_at'>[] = [
      { 
        name: 'kb', 
        description: 'Add entry to team knowledge base and Notion LGJ Updates database',
        syntax: '/kb [Department] Title | Description',
        example: '/kb [Sales] New Apollo Rules | Apollo links now auto-expire after 30 days. Always check expiration before sending to clients.',
        category: 'knowledge',
        enabled: true
      },
    ];
    sampleCommands.forEach(createCommand);
  }
}
