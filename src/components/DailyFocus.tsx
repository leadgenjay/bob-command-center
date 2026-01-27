'use client';

import { useState, useEffect } from 'react';
import { Task, PRIORITY_CONFIG } from '@/lib/types';
import { getTodaysFocusTasks, updateTask } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Target, Clock, Check } from 'lucide-react';
import { format } from 'date-fns';

export function DailyFocus() {
  const [focusTasks, setFocusTasks] = useState<Task[]>([]);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    refreshTasks();
  }, []);

  const refreshTasks = () => {
    const tasks = getTodaysFocusTasks().slice(0, 5); // Max 5 tasks
    setFocusTasks(tasks);
    setTotalTime(tasks.reduce((sum, t) => sum + (t.time_estimate || 0), 0));
  };

  const handleToggleComplete = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    updateTask(taskId, { status: newStatus });
    refreshTasks();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const completedCount = focusTasks.filter(t => t.status === 'done').length;

  return (
    <Card className="frosted-glass border-0 shadow-lg overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Today&apos;s Focus</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {format(new Date(), 'EEEE, MMM d')}
              </p>
            </div>
          </div>
          {totalTime > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTime(totalTime)}</span>
            </div>
          )}
        </div>
        
        {/* Progress indicator */}
        {focusTasks.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>{completedCount} of {focusTasks.length} complete</span>
              <span>{Math.round((completedCount / focusTasks.length) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full gradient-primary transition-all duration-500 ease-out rounded-full"
                style={{ width: `${(completedCount / focusTasks.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-2 pb-5">
        {focusTasks.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No focus tasks</p>
            <p className="text-xs mt-1">Add high priority tasks to see them here</p>
          </div>
        ) : (
          focusTasks.map((task, index) => {
            const isCompleted = task.status === 'done';
            const priority = PRIORITY_CONFIG[task.priority];
            
            return (
              <button
                key={task.id}
                onClick={() => handleToggleComplete(task.id, task.status)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl',
                  'transition-all duration-200 text-left',
                  'active:scale-[0.98] touch-target',
                  isCompleted 
                    ? 'bg-muted/30' 
                    : index === 0 
                      ? 'bg-primary/5 ring-1 ring-primary/20' 
                      : 'bg-muted/50 hover:bg-muted/70'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Large checkbox */}
                <div
                  className={cn(
                    'h-7 w-7 rounded-lg border-2 flex items-center justify-center shrink-0',
                    'transition-all duration-200',
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-muted-foreground/30 hover:border-primary'
                  )}
                >
                  {isCompleted && <Check className="h-4 w-4 text-white" />}
                </div>
                
                {/* Task content */}
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    'font-medium text-sm leading-tight truncate',
                    isCompleted && 'line-through text-muted-foreground'
                  )}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={cn('text-xs', priority.color)}>
                      {priority.icon}
                    </span>
                    {task.time_estimate && (
                      <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {formatTime(task.time_estimate)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
