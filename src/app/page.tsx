'use client';

import { useEffect } from 'react';
import { DailyFocus } from '@/components/DailyFocus';
import { IdeasVault } from '@/components/IdeasVault';
import { ProjectsList } from '@/components/ProjectsList';
import { DecisionLog } from '@/components/DecisionLog';
import { PreferencesEditor } from '@/components/PreferencesEditor';
import { initializeSampleData } from '@/lib/store';
import { Activity, TrendingUp, CheckCircle2, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Dashboard() {
  useEffect(() => {
    initializeSampleData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="gradient-hero rounded-2xl p-6 -mx-4 sm:mx-0">
        <h1 className="text-3xl font-bold">
          Good{' '}
          {new Date().getHours() < 12
            ? 'morning'
            : new Date().getHours() < 17
            ? 'afternoon'
            : 'evening'}
          , Bob 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s on your radar today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="frosted-glass border-0">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Active Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="frosted-glass border-0">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground">Done This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="frosted-glass border-0">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-muted-foreground">Ideas Captured</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="frosted-glass border-0">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Focus + Projects */}
        <div className="lg:col-span-1 space-y-6">
          <DailyFocus />
          <ProjectsList />
        </div>

        {/* Middle Column - Ideas */}
        <div className="lg:col-span-1">
          <IdeasVault />
        </div>

        {/* Right Column - Decisions + Preferences */}
        <div className="lg:col-span-1 space-y-6">
          <DecisionLog />
        </div>
      </div>
    </div>
  );
}
