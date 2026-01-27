'use client';

import { useEffect, useState } from 'react';
import { DailyFocus } from '@/components/DailyFocus';
import { IdeasVault } from '@/components/IdeasVault';
import { initializeSampleData, getTasks, getIdeas, getProjects } from '@/lib/store';
import { Activity, TrendingUp, CheckCircle2, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeTasks: 0,
    doneThisWeek: 0,
    ideasCaptured: 0,
    activeProjects: 0,
  });

  useEffect(() => {
    initializeSampleData();
    
    // Calculate actual stats
    const tasks = getTasks();
    const ideas = getIdeas();
    const projects = getProjects();
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    setStats({
      activeTasks: tasks.filter(t => t.status !== 'done').length,
      doneThisWeek: tasks.filter(t => 
        t.status === 'done' && 
        new Date(t.updated_at) >= oneWeekAgo
      ).length,
      ideasCaptured: ideas.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
    });
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const statCards = [
    { label: 'Active Tasks', value: stats.activeTasks, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Done This Week', value: stats.doneThisWeek, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Ideas', value: stats.ideasCaptured, icon: Lightbulb, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Projects', value: stats.activeProjects, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-slide-up">
      {/* Header - simplified for mobile */}
      <div className="gradient-hero rounded-2xl p-5 md:p-8 -mx-2 sm:mx-0">
        <h1 className="text-2xl md:text-3xl font-bold">
          Good {greeting()}, Bob
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Here&apos;s what&apos;s on your radar
        </p>
      </div>

      {/* Quick Stats - horizontal scroll on mobile */}
      <div className="scroll-snap-x gap-3 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.label} 
              className="snap-center-child w-[140px] md:w-auto shrink-0 frosted-glass border-0 animate-scale-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content - stack on mobile, grid on desktop */}
      <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        <DailyFocus />
        <IdeasVault />
      </div>
    </div>
  );
}
