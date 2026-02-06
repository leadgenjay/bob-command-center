'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Calendar, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskStatus, TaskPriority, TASK_STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/toast';

interface AddTaskSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded?: () => void;
}

export function AddTaskSheet({ isOpen, onClose, onTaskAdded }: AddTaskSheetProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          status,
          priority,
          due_date: dueDate || null,
        }),
      });

      if (response.ok) {
        addToast('Task created successfully!', 'success');
        onTaskAdded?.();
        onClose();
      } else {
        addToast('Failed to create task', 'error');
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      addToast('Failed to create task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className={cn(
        'fixed inset-x-0 bottom-0 z-50 max-h-[90vh]',
        'bg-background rounded-t-3xl shadow-2xl',
        'animate-slide-up-sheet'
      )}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4">
          <h2 className="text-xl font-bold">New Task</h2>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-8 space-y-5 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-muted/50',
                'focus:outline-none focus:ring-2 focus:ring-primary/50',
                'placeholder:text-muted-foreground/50'
              )}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-muted/50 resize-none',
                'focus:outline-none focus:ring-2 focus:ring-primary/50',
                'placeholder:text-muted-foreground/50'
              )}
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['todo', 'in_progress', 'review'] as TaskStatus[]).map((s) => {
                const config = TASK_STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={cn(
                      'px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      'border flex items-center justify-center gap-2',
                      status === s 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-muted/50 border-transparent hover:bg-muted'
                    )}
                  >
                    <span>{config.emoji}</span>
                    <span className="truncate">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map((p) => {
                const config = PRIORITY_CONFIG[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      'px-3 py-2.5 rounded-xl text-sm transition-all',
                      'border flex flex-col items-center gap-1',
                      priority === p 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-muted/50 border-transparent hover:bg-muted'
                    )}
                  >
                    <span>{config.icon}</span>
                    <span className="text-xs">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-muted/50',
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className={cn(
              'w-full py-4 rounded-2xl font-semibold text-white',
              'bg-gradient-to-r from-primary to-purple-600',
              'shadow-lg hover:shadow-xl transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'active:scale-[0.98] flex items-center justify-center gap-2'
            )}
          >
            <Plus className="h-5 w-5" />
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>
    </>
  );
}
