'use client';

import { useState, useEffect } from 'react';
import { Task, PRIORITY_CONFIG, TASK_STATUS_CONFIG } from '@/lib/types';
import { getTodaysFocusTasks, updateTask, getTasks } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Target, Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export function DailyFocus() {
  const [focusTasks, setFocusTasks] = useState<Task[]>([]);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    refreshTasks();
  }, []);

  const refreshTasks = () => {
    const tasks = getTodaysFocusTasks();
    setFocusTasks(tasks);
    setTotalTime(tasks.reduce((sum, t) => sum + (t.time_estimate || 0), 0));
  };

  const handleComplete = (taskId: string) => {
    updateTask(taskId, { status: 'done' });
    refreshTasks();
  };

  const handleMoveToProgress = (taskId: string) => {
    updateTask(taskId, { status: 'in_progress' });
    refreshTasks();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="frosted-glass border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Daily Focus</CardTitle>
              <p className="text-xs text-muted-foreground">
                {format(new Date(), 'EEEE, MMMM d')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatTime(totalTime)} estimated</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {focusTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No priority tasks for today</p>
            <p className="text-xs">Add tasks or set high priority to see them here</p>
          </div>
        ) : (
          focusTasks.map((task, index) => {
            const priority = PRIORITY_CONFIG[task.priority];
            const status = TASK_STATUS_CONFIG[task.status];
            return (
              <div
                key={task.id}
                className={cn(
                  'group flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors',
                  index === 0 && 'ring-1 ring-primary/20 bg-primary/5'
                )}
              >
                <button
                  onClick={() => handleComplete(task.id)}
                  className="mt-0.5 text-muted-foreground hover:text-emerald-500 transition-colors"
                >
                  {task.status === 'done' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <div className="flex items-center gap-2">
                      {task.time_estimate && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(task.time_estimate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={cn('text-xs', priority.color)}>
                      {priority.icon} {priority.label}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {status.label}
                    </Badge>
                  </div>
                </div>
                {task.status === 'todo' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleMoveToProgress(task.id)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
