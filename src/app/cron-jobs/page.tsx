'use client';

import { useState } from 'react';
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
  description?: string;
  state?: {
    lastRunAtMs?: number;
    lastStatus?: string;
    nextRunAtMs?: number;
  };
}

const cronJobs: CronJob[] = [
  {
    id: '1',
    name: 'Email Check',
    enabled: true,
    schedule: { kind: 'cron', expr: '*/10 * * * *' },
    agentId: 'bizops',
    description: 'Scans bob@ inbox every 10 minutes for new actionable emails. Alerts Jay via iMessage.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '2',
    name: 'Lovedeep Error Logs Monitor',
    enabled: true,
    schedule: { kind: 'cron', expr: '*/30 * * * *' },
    agentId: 'devops',
    description: 'Checks NextWave and LeadGenJay n8n for failed executions. Notifies Lovedeep via Slack and email.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '3',
    name: 'Instagram Stories Generator',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 20 * * *' },
    agentId: 'main',
    description: 'Generates 3 Dan Kennedy-style Instagram story sequences, texts Jay options, auto-posts approved slides.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '4',
    name: 'Task Board Maintenance',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 8,11,14,17,20 * * *' },
    agentId: 'bizops',
    description: 'Silently reviews conversation history to mark tasks done, add new tasks, update ideas/decisions/trips.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '5',
    name: '8pm Calendar Preview',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 20 * * *' },
    agentId: 'main',
    description: "Sends Jay a formatted iMessage preview of tomorrow's calendar events.",
    state: { lastStatus: 'ok' }
  },
  {
    id: '6',
    name: 'Check Jake Meta Report Feedback',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 */2 * * *' },
    agentId: 'main',
    description: 'Monitors for Jake Behler reply to Meta Ads report. Summarizes feedback to Jay when received.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '7',
    name: 'Overnight Work Session 1 (11pm)',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 23 * * *' },
    agentId: 'dev',
    description: 'Full pipeline review: GMaps scraping, enrichment, B2B verification, n8n, Reacher proxy, Docker health.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '8',
    name: 'Zeus Night Health Check',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 23 * * *' },
    agentId: 'devops',
    description: 'Checks Zeus for exited containers, disk >90%, memory <10GB, PgBouncer errors. Restarts if needed.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '9',
    name: 'n8n Health Check',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 0,8,16 * * *' },
    agentId: 'devops',
    description: 'Checks both n8n instances hourly for errors. Alerts Jay for critical workflows, emails Lovedeep.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '10',
    name: 'GMaps + B2B Health Check',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 0,8,16 * * *' },
    agentId: 'main',
    description: 'Checks GMaps scraping, enrichment, verification pipelines. Ghost run detection. Auto-restarts stalled scraper.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '11',
    name: 'Zeus Data Pipeline Health Check',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 0,8,16 * * *' },
    agentId: 'devops',
    description: 'Checks creators-db, GMaps scraper status, alerts on container failures or 48hr sync gaps.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '12',
    name: 'Overnight Work Session 2 (2am)',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 2 * * *' },
    agentId: 'dev',
    description: 'Continues proactive backlog work. Logs progress silently to overnight-log.md.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '13',
    name: 'GitHub Secret Scanner',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 2 * * *' },
    agentId: 'devops',
    description: 'Scans all repos for hardcoded secrets. Auto-fixes JS/TS/Python files with syntax validation.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '14',
    name: 'Overnight Work Session 3 (5am)',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 5 * * *' },
    agentId: 'dev',
    description: 'Final overnight session. Wraps up work, prepares morning-briefing.md for Jay.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '15',
    name: 'Viral Content Daily Report',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 6 * * 1-5' },
    agentId: 'main',
    description: 'Searches viral content in cold email, n8n, AI automation. Generates PDF, uploads to Drive, DMs Sujeet.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '16',
    name: 'Zeus Morning Health Check',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 6 * * *' },
    agentId: 'devops',
    description: 'Same Zeus checks as night: containers, disk, memory, PgBouncer. Reports to Jay.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '17',
    name: 'Model Preference Reset Check',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 7 * * *' },
    agentId: 'main',
    description: 'Checks if Claude Sonnet is healthy and restores it as primary model if on fallback.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '18',
    name: 'Reddit Account Warmup',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 7,10,13,16,19 * * *' },
    agentId: 'main',
    description: 'Phase 1 warmup for u/BobTheAssistant_AI: upvotes, genuine comments in casual subs, building karma.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '19',
    name: 'n8n Daily Health Check',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 7 * * *' },
    agentId: 'devops',
    description: 'Runs full n8n health check script, emails Jay and Lovedeep with error summary.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '20',
    name: 'Skool Daily Post Ideas',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 7 * * *' },
    agentId: 'main',
    description: 'Generates 9 Skool posts (3 per community) using viral research. Emails Jay for approval.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '21',
    name: 'Birthday Check',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 8 * * *' },
    agentId: 'bizops',
    description: 'Checks birthdays.md for today. Texts Jay immediately with reminder.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '22',
    name: 'YouTube Comment Check',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 8,14,18 * * *' },
    agentId: 'main',
    description: 'Scans YouTube for new comments. Auto-deletes spam, auto-replies to compliments, flags complex ones.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '23',
    name: 'Skool Comment Check',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 9,17 * * *' },
    agentId: 'main',
    description: 'Scans all 3 Skool communities for unanswered posts. Writes drafts, emails Jay numbered list for approval.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '24',
    name: 'Morning Roundup (9am M-F)',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 9 * * 1-5' },
    agentId: 'main',
    description: 'Consolidated morning briefing: inbox review, overnight summary, n8n health. One iMessage to Jay.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '25',
    name: '5pm Daily Review (M-F)',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 17 * * 1-5' },
    agentId: 'bizops',
    description: 'Reviews Slack mentions, Notion tasks, Asana, Gmail, Bob task board. Sends prioritized summary to Jay.',
    state: { lastStatus: 'ok' }
  },
  {
    id: '26',
    name: 'Weekly Meta Ads Report',
    enabled: true,
    schedule: { kind: 'cron', expr: '0 10 * * 2' },
    agentId: 'main',
    description: 'Pulls Hyros + Meta API data, generates PDF report, uploads to Drive, DMs Jake Behler on Slack.',
    state: { lastStatus: 'ok' }
  },
];

export default function CronJobsPage() {
  const [jobs] = useState<CronJob[]>(cronJobs);

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

  const activeJobs = jobs.filter(j => j.enabled);
  const inactiveJobs = jobs.filter(j => !j.enabled);

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
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted/70 group transition-all duration-200"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Status Icon */}
                <div className="shrink-0 mt-0.5">
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
                  {job.description && (
                    <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">
                      {job.description}
                    </p>
                  )}
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
