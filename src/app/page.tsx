'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Kanban, 
  Sun, 
  Lightbulb, 
  Plane, 
  Bell, 
  Scale,
  Files,
  FileText,
  Video,
  ChevronRight,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ActivityFeed } from '@/components/ActivityFeed';
import { QuickAddFab } from '@/components/QuickAddFab';

interface QuickStats {
  tasksInProgress: number;
  tasksDueToday: number;
  upcomingTrips: number;
  activeReminders: number;
  ideasCount: number;
}

const quickLinks = [
  { href: '/tasks', label: 'Tasks', icon: Kanban, color: 'from-emerald-500 to-teal-500', description: 'Manage your work' },
  { href: '/daily', label: 'Daily', icon: Sun, color: 'from-amber-500 to-orange-500', description: 'Morning routine' },
  { href: '/trips', label: 'Trips', icon: Plane, color: 'from-blue-500 to-indigo-500', description: 'Travel plans' },
  { href: '/ideas', label: 'Ideas', icon: Lightbulb, color: 'from-purple-500 to-pink-500', description: 'Capture thoughts' },
];

const moreLinks = [
  { href: '/reminders', label: 'Reminders', icon: Bell },
  { href: '/decisions', label: 'Decisions', icon: Scale },
  { href: '/content', label: 'Content', icon: Video },
  { href: '/documents', label: 'Documents', icon: Files },
  { href: '/sops', label: 'SOPs', icon: FileText },
];

export default function Dashboard() {
  const [stats, setStats] = useState<QuickStats>({
    tasksInProgress: 0,
    tasksDueToday: 0,
    upcomingTrips: 0,
    activeReminders: 0,
    ideasCount: 0,
  });
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Fetch stats
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch tasks
      const tasksRes = await fetch('/api/tasks');
      const tasks = await tasksRes.json();
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Fetch reminders
      const remindersRes = await fetch('/api/reminders');
      const reminders = await remindersRes.json();
      
      // Fetch trips
      const tripsRes = await fetch('/api/trips');
      const trips = await tripsRes.json();
      
      // Fetch ideas
      const ideasRes = await fetch('/api/ideas');
      const ideas = await ideasRes.json();

      setStats({
        tasksInProgress: tasks.filter((t: { status: string }) => t.status === 'in_progress').length,
        tasksDueToday: tasks.filter((t: { due_date: string | null }) => t.due_date === today).length,
        upcomingTrips: trips.filter((t: { status: string }) => t.status === 'upcoming' || t.status === 'active').length,
        activeReminders: reminders.filter((r: { enabled: boolean }) => r.enabled).length,
        ideasCount: ideas.length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up pb-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/bob-icon.png" 
              alt="Bob" 
              className="h-12 w-12 rounded-2xl shadow-xl object-cover"
            />
            <Sparkles className="h-5 w-5 text-primary animate-pulse-subtle" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mt-4">{greeting}, Jay</h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-purple-500/10 blur-2xl" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="frosted-glass rounded-2xl p-4 stat-card cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">In Progress</span>
          </div>
          <p className="text-2xl font-bold">{stats.tasksInProgress}</p>
          <p className="text-xs text-muted-foreground">tasks</p>
        </div>
        
        <div className="frosted-glass rounded-2xl p-4 stat-card cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Due Today</span>
          </div>
          <p className="text-2xl font-bold">{stats.tasksDueToday}</p>
          <p className="text-xs text-muted-foreground">tasks</p>
        </div>
        
        <div className="frosted-glass rounded-2xl p-4 stat-card cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <Plane className="h-4 w-4 text-indigo-500" />
            <span className="text-xs text-muted-foreground">Upcoming</span>
          </div>
          <p className="text-2xl font-bold">{stats.upcomingTrips}</p>
          <p className="text-xs text-muted-foreground">trips</p>
        </div>
        
        <div className="frosted-glass rounded-2xl p-4 stat-card cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-4 w-4 text-pink-500" />
            <span className="text-xs text-muted-foreground">Active</span>
          </div>
          <p className="text-2xl font-bold">{stats.activeReminders}</p>
          <p className="text-xs text-muted-foreground">reminders</p>
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed />

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Quick Access
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group frosted-glass rounded-2xl p-4 hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
              >
                <div className={cn(
                  'h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-lg',
                  'group-hover:scale-110 transition-transform duration-300',
                  link.color
                )}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">{link.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* More Options */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          More Tools
        </h2>
        <div className="frosted-glass rounded-2xl overflow-hidden divide-y divide-border/50">
          {moreLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors active:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium">{link.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Collaboration Note */}
      <div className="frosted-glass rounded-2xl p-4 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <img 
            src="/bob-icon.png" 
            alt="Bob" 
            className="h-10 w-10 rounded-xl shadow-lg object-cover flex-shrink-0"
          />
          <div>
            <p className="text-sm">
              <span className="font-semibold">Bob here!</span> This dashboard updates in real-time as we work together. 
              Just message me to add tasks, set reminders, or log decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Add FAB */}
      <QuickAddFab />
    </div>
  );
}
