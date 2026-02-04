'use client';

import { useState, useEffect } from 'react';
import { 
  Kanban, 
  Lightbulb, 
  Plane, 
  Bell, 
  Scale,
  CheckCircle2,
  PlusCircle,
  RefreshCw,
  Activity,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'task' | 'idea' | 'trip' | 'reminder' | 'decision';
  action: 'created' | 'updated' | 'completed';
  title: string;
  timestamp: string;
  details?: string;
}

const typeConfig = {
  task: { icon: Kanban, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  idea: { icon: Lightbulb, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  trip: { icon: Plane, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  reminder: { icon: Bell, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  decision: { icon: Scale, color: 'text-amber-500', bg: 'bg-amber-500/10' },
};

const actionConfig = {
  created: { icon: PlusCircle, label: 'added', color: 'text-green-500' },
  updated: { icon: RefreshCw, label: 'updated', color: 'text-blue-500' },
  completed: { icon: CheckCircle2, label: 'completed', color: 'text-emerald-500' },
};

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    fetchActivity();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchActivity(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchActivity = async (silent = false) => {
    if (!silent) setLoading(true);
    else setSyncing(true);
    
    try {
      const res = await fetch('/api/activity?limit=8');
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
        setLastSync(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="frosted-glass rounded-2xl p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="frosted-glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <p className="text-muted-foreground text-sm text-center py-4">
          No recent activity yet
        </p>
      </div>
    );
  }

  return (
    <div className="frosted-glass rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="flex items-center gap-2">
          {syncing && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {lastSync && !syncing && (
            <span className="text-xs text-muted-foreground">
              Updated {formatDistanceToNow(lastSync, { addSuffix: true })}
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity, index) => {
          const TypeIcon = typeConfig[activity.type]?.icon || Kanban;
          const ActionIcon = actionConfig[activity.action]?.icon || RefreshCw;
          const config = typeConfig[activity.type];
          const actionCfg = actionConfig[activity.action];
          
          return (
            <div 
              key={activity.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl transition-all",
                "hover:bg-muted/50 cursor-default",
                index === 0 && "bg-muted/30"
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className={cn(
                "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0",
                config?.bg || 'bg-muted'
              )}>
                <TypeIcon className={cn("h-4 w-4", config?.color || 'text-muted-foreground')} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <ActionIcon className={cn("h-3 w-3", actionCfg?.color || 'text-muted-foreground')} />
                  <span className="text-xs text-muted-foreground capitalize">
                    {activity.type} {actionCfg?.label}
                  </span>
                </div>
                <p className="font-medium text-sm truncate">{activity.title}</p>
                {activity.details && (
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.details}</p>
                )}
              </div>
              
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Live sync indicator */}
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs text-muted-foreground">Live sync active</span>
      </div>
    </div>
  );
}
