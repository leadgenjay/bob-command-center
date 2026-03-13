'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle2, XCircle, AlertCircle, Calendar } from 'lucide-react';

interface CronJob {
  id: string;
  name: string;
  enabled: boolean;
  schedule: {
    kind: string;
    expr?: string;
    everyMs?: number;
  };
  agentId: string;
  state?: {
    lastRunAtMs?: number;
    lastStatus?: string;
    nextRunAtMs?: number;
  };
}

export default function CronJobsPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call when backend is ready
    // For now, using mock data from the system reference
    const mockJobs: CronJob[] = [
      {
        id: '1',
        name: 'Email Check',
        enabled: true,
        schedule: { kind: 'cron', expr: '*/10 * * * *' },
        agentId: 'bizops',
        state: { lastStatus: 'ok', nextRunAtMs: Date.now() + 600000 }
      },
      {
        id: '2',
        name: 'n8n Health Check',
        enabled: true,
        schedule: { kind: 'cron', expr: '0 0,8,16 * * *' },
        agentId: 'devops',
        state: { lastStatus: 'ok', nextRunAtMs: Date.now() + 3600000 }
      },
      {
        id: '3',
        name: '9am Morning Roundup',
        enabled: true,
        schedule: { kind: 'cron', expr: '0 9 * * 1-5' },
        agentId: 'main',
        state: { lastStatus: 'ok', nextRunAtMs: Date.now() + 86400000 }
      },
      {
        id: '4',
        name: 'Weekly Meta Ads Report',
        enabled: true,
        schedule: { kind: 'cron', expr: '0 10 * * 2' },
        agentId: 'main',
        state: { lastStatus: 'ok', nextRunAtMs: Date.now() + 604800000 }
      },
    ];
    
    setJobs(mockJobs);
    setLoading(false);
  }, []);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatNextRun = (timestamp?: number) => {
    if (!timestamp) return 'Not scheduled';
    const now = Date.now();
    const diff = timestamp - now;
    
    if (diff < 0) return 'Overdue';
    if (diff < 60000) return 'In < 1 min';
    if (diff < 3600000) return `In ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `In ${Math.floor(diff / 3600000)}h`;
    return `In ${Math.floor(diff / 86400000)}d`;
  };

  const activeJobs = jobs.filter(j => j.enabled);
  const inactiveJobs = jobs.filter(j => !j.enabled);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Cron Jobs</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {activeJobs.length} active • {inactiveJobs.length} inactive
            </p>
          </div>
        </div>
      </div>

      {/* Active Jobs */}
      <Card className="frosted-glass border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Active Jobs ({activeJobs.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {activeJobs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">No active cron jobs</p>
            </div>
          ) : (
            activeJobs.map((job, index) => (
              <div
                key={job.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted/70 group transition-all duration-200"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Status Icon */}
                <div className="shrink-0">
                  {getStatusIcon(job.state?.lastStatus)}
                </div>
                
                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{job.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground font-mono">
                      {job.schedule.expr || 'Custom schedule'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Agent: {job.agentId}
                    </span>
                  </div>
                </div>
                
                {/* Next Run */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatNextRun(job.state?.nextRunAtMs)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Inactive Jobs (if any) */}
      {inactiveJobs.length > 0 && (
        <Card className="frosted-glass border-0 shadow-lg opacity-60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Inactive Jobs ({inactiveJobs.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {inactiveJobs.map((job, index) => (
              <div
                key={job.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="shrink-0">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-muted-foreground">{job.name}</p>
                  <span className="text-xs text-muted-foreground">
                    Agent: {job.agentId}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="frosted-glass border-0 shadow-lg bg-primary/5">
        <CardContent className="py-4">
          <p className="text-xs text-muted-foreground text-center">
            💡 Cron jobs are automated tasks that run on a schedule. View full system reference in the docs folder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
