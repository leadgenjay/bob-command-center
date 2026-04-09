'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Loader2,
  Terminal,
} from 'lucide-react';
import { formatSchedule, formatRelativeTime, formatDuration } from '@/lib/schedule-utils';

interface CronJob {
  id: string;
  name: string;
  display_name: string | null;
  plist_label: string | null;
  enabled: boolean;
  schedule: Record<string, unknown> | null;
  model: string | null;
  command_path: string | null;
  skills: string[] | null;
  description: string | null;
  created_at: string;
}

interface CronExecution {
  id: string;
  job_id: string;
  plist_label: string;
  started_at: string;
  ended_at: string | null;
  status: 'running' | 'success' | 'error' | 'timeout';
  exit_code: number | null;
  duration_ms: number | null;
  output_summary: string | null;
  output_full: string | null;
  output_destinations: string[] | null;
  error_message: string | null;
}

function StatusDot({ status }: { status: CronExecution['status'] | undefined }) {
  if (!status) return <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />;
  if (status === 'running')
    return (
      <div className="relative h-2 w-2">
        <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
        <div className="relative h-2 w-2 rounded-full bg-emerald-500" />
      </div>
    );
  if (status === 'success')
    return <div className="h-2 w-2 rounded-full bg-emerald-500" />;
  if (status === 'error' || status === 'timeout')
    return <div className="h-2 w-2 rounded-full bg-red-500" />;
  return <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />;
}

function ModelBadge({ model }: { model: string | null }) {
  if (!model) return null;
  const colorMap: Record<string, string> = {
    haiku: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    sonnet: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    opus: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };
  const key = Object.keys(colorMap).find(k => model.toLowerCase().includes(k));
  const cls = key ? colorMap[key] : 'bg-muted text-muted-foreground';
  return (
    <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border', cls)}>
      {model}
    </span>
  );
}

function OutputModal({
  summary,
  full,
  onClose,
}: {
  summary: string;
  full: string | null;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Output</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <pre className="text-xs font-mono whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {full || summary}
          </pre>
        </div>
      </div>
    </div>
  );
}

function ExecutionRow({ exec, onClick }: { exec: CronExecution; onClick: () => void }) {
  const statusIcon =
    exec.status === 'running' ? (
      <Loader2 className="h-3 w-3 text-emerald-500 animate-spin" />
    ) : exec.status === 'success' ? (
      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
    ) : (
      <XCircle className="h-3 w-3 text-red-500" />
    );

  return (
    <div className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-muted/50 transition-colors group">
      <div className="shrink-0">{statusIcon}</div>
      <div className="flex-1 min-w-0">
        <span className="text-xs text-muted-foreground">{formatRelativeTime(exec.started_at)}</span>
        {exec.duration_ms && (
          <span className="text-xs text-muted-foreground/60 ml-2">{formatDuration(exec.duration_ms)}</span>
        )}
        {exec.output_destinations && exec.output_destinations.length > 0 && (
          <span className="ml-2 text-[10px] text-muted-foreground/50">
            → {exec.output_destinations.join(', ')}
          </span>
        )}
      </div>
      {exec.output_summary && (
        <button
          onClick={onClick}
          className="shrink-0 text-[10px] text-primary/60 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
        >
          view output
        </button>
      )}
    </div>
  );
}

function JobCard({ job }: { job: CronJob }) {
  const [expanded, setExpanded] = useState(false);
  const [executions, setExecutions] = useState<CronExecution[]>([]);
  const [loadingExec, setLoadingExec] = useState(false);
  const [modalExec, setModalExec] = useState<CronExecution | null>(null);

  async function fetchExecutions() {
    setLoadingExec(true);
    try {
      const res = await fetch(`/api/cron-jobs/${job.id}/executions`);
      if (res.ok) {
        const data = await res.json();
        setExecutions(data);
      }
    } catch {
      // silent
    }
    setLoadingExec(false);
  }

  function handleExpand() {
    const next = !expanded;
    setExpanded(next);
    if (next && executions.length === 0) {
      fetchExecutions();
    }
  }

  const latestExec = executions[0];
  const scheduleStr = formatSchedule(job.schedule as Parameters<typeof formatSchedule>[0]);

  return (
    <>
      {modalExec && (
        <OutputModal
          summary={modalExec.output_summary ?? ''}
          full={modalExec.output_full}
          onClose={() => setModalExec(null)}
        />
      )}
      <div className="rounded-xl bg-muted/50 hover:bg-muted/70 transition-all duration-200">
        <button
          className="w-full flex items-start gap-3 p-3 text-left"
          onClick={handleExpand}
        >
          {/* Status dot */}
          <div className="shrink-0 mt-1.5">
            <StatusDot status={latestExec?.status} />
          </div>

          {/* Job info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium">{job.display_name || job.name}</p>
              <ModelBadge model={job.model} />
            </div>

            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              <span className="text-xs text-muted-foreground">{scheduleStr}</span>
              {latestExec && (
                <span className="text-xs text-muted-foreground/70">
                  Last: {formatRelativeTime(latestExec.started_at)}
                </span>
              )}
            </div>

            {job.description && (
              <p className="text-xs text-muted-foreground/60 mt-1 leading-relaxed line-clamp-2">
                {job.description}
              </p>
            )}

            {/* Skills chips */}
            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {job.skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary/70 font-medium"
                  >
                    /{skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Expand indicator */}
          <div className="shrink-0 mt-1 text-muted-foreground/50">
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </div>
        </button>

        {/* Execution history */}
        {expanded && (
          <div className="px-3 pb-3">
            <div className="border-t border-muted pt-2 mt-0">
              {loadingExec ? (
                <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading history...
                </div>
              ) : executions.length === 0 ? (
                <p className="text-xs text-muted-foreground/50 py-2 text-center">No executions recorded yet</p>
              ) : (
                <div className="space-y-0.5">
                  {executions.map(exec => (
                    <ExecutionRow
                      key={exec.id}
                      exec={exec}
                      onClick={() => setModalExec(exec)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function CronJobsPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/cron-jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch {
      // silent - show empty state
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 60_000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

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
            <h1 className="text-xl md:text-2xl font-bold">Scheduled Tasks</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {loading
                ? 'Loading...'
                : `${activeJobs.length} active · ${inactiveJobs.length} inactive`}
            </p>
          </div>
        </div>
      </div>

      {/* Active Jobs */}
      <Card className="frosted-glass border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {loading ? 'Active Tasks' : `Active Tasks (${activeJobs.length})`}
          </CardTitle>
        </CardHeader>
        {loading ? (
          <CardContent className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                <Skeleton className="h-2 w-2 rounded-full mt-1.5" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            ))}
          </CardContent>
        ) : (
          <CardContent className="space-y-2">
            {activeJobs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No active scheduled tasks</p>
                <p className="text-xs mt-1 opacity-60">Tasks will appear here once synced from plists</p>
              </div>
            ) : (
              activeJobs.map(job => <JobCard key={job.id} job={job} />)
            )}
          </CardContent>
        )}
      </Card>

      {/* Inactive Jobs — collapsed by default */}
      {!loading && inactiveJobs.length > 0 && (
        <Card className="frosted-glass border-0 shadow-lg opacity-60">
          <CardHeader className="pb-0">
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => setShowInactive(v => !v)}
            >
              <CardTitle className="text-base">
                Inactive Tasks ({inactiveJobs.length})
              </CardTitle>
              {showInactive ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </CardHeader>
          {showInactive && (
            <CardContent className="space-y-2 pt-3">
              {inactiveJobs.map(job => (
                <div
                  key={job.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                >
                  <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-muted-foreground">
                      {job.display_name || job.name}
                    </p>
                    <span className="text-xs text-muted-foreground/60">
                      {formatSchedule(job.schedule as Parameters<typeof formatSchedule>[0])}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
