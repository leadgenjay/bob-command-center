'use client';

import { useState, useEffect } from 'react';
import { DailyTask } from '@/lib/types';
import { getDailyTasks, createDailyTask, updateDailyTask, deleteDailyTask, resetDailyTasks } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Sun, Plus, Trash2, Check, RotateCcw, GripVertical, X, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function DailyTasksPage() {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    refreshTasks();
  }, []);

  const refreshTasks = () => {
    setTasks(getDailyTasks());
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const maxOrder = tasks.reduce((max, t) => Math.max(max, t.order), 0);
    createDailyTask({
      title: newTitle.trim(),
      description: null,
      time: newTime.trim() || null,
      completed: false,
      order: maxOrder + 1,
    });
    setNewTitle('');
    setNewTime('');
    setShowAddForm(false);
    refreshTasks();
  };

  const handleToggle = (id: string, completed: boolean) => {
    updateDailyTask(id, { completed: !completed });
    refreshTasks();
  };

  const handleDelete = (id: string) => {
    deleteDailyTask(id);
    refreshTasks();
  };

  const handleReset = () => {
    resetDailyTasks();
    refreshTasks();
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="space-y-5 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <Sun className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Daily Tasks</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="rounded-full h-9 px-3"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            className="rounded-full h-10 w-10 p-0 gradient-primary shadow-lg"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="frosted-glass border-0 shadow-lg overflow-hidden">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Today&apos;s Progress</span>
            <span className="text-sm text-muted-foreground">{completedCount}/{tasks.length}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && tasks.length > 0 && (
            <p className="text-center text-sm text-emerald-500 mt-3 font-medium">
              🎉 All tasks complete!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Add Form */}
      {showAddForm && (
        <Card className="frosted-glass border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Add Daily Task</CardTitle>
              <button
                onClick={() => setShowAddForm(false)}
                className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Task name"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-muted/50"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Input
              placeholder="Time (optional, e.g., '9:00 AM')"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="bg-muted/50"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Button onClick={handleAdd} className="w-full gradient-primary">
              Add Task
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      <Card className="frosted-glass border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Today&apos;s Routine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tasks.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Sun className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">No daily tasks yet</p>
              <p className="text-xs mt-1">Add your morning routine or recurring tasks</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl group transition-all duration-200',
                  task.completed ? 'bg-emerald-500/10' : 'bg-muted/50 hover:bg-muted/70'
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Drag Handle (visual only for now) */}
                <div className="text-muted-foreground/30 cursor-grab">
                  <GripVertical className="h-4 w-4" />
                </div>
                
                {/* Checkbox */}
                <button
                  onClick={() => handleToggle(task.id, task.completed)}
                  className={cn(
                    'h-6 w-6 rounded-lg border-2 flex items-center justify-center shrink-0',
                    'transition-all duration-200',
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-muted-foreground/30 hover:border-primary'
                  )}
                >
                  {task.completed && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
                
                {/* Task content */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium truncate',
                    task.completed && 'line-through text-muted-foreground'
                  )}>
                    {task.title}
                  </p>
                  {task.time && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{task.time}</span>
                    </div>
                  )}
                </div>
                
                {/* Delete */}
                <button
                  onClick={() => handleDelete(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="frosted-glass border-0 shadow-lg bg-primary/5">
        <CardContent className="py-4">
          <p className="text-xs text-muted-foreground text-center">
            💡 Daily tasks reset each day. Use &quot;Reset&quot; to uncheck all for a fresh start.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
