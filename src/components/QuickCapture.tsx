'use client';

import { useState, useRef, useEffect } from 'react';
import { TaskPriority, IdeaCategory, PRIORITY_CONFIG, IDEA_CATEGORY_CONFIG } from '@/lib/types';
import { createTask, createIdea } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Plus, X, CheckSquare, Lightbulb, Send } from 'lucide-react';

type CaptureMode = 'closed' | 'task' | 'idea';

export function QuickCapture() {
  const [mode, setMode] = useState<CaptureMode>('closed');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<IdeaCategory>('apps');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode !== 'closed' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  const resetForm = () => {
    setTitle('');
    setPriority('medium');
    setCategory('apps');
    setMode('closed');
  };

  const handleQuickCreate = () => {
    if (!title.trim()) return;
    
    if (mode === 'task') {
      createTask({
        title,
        description: null,
        status: 'todo',
        priority,
        project_id: null,
        due_date: null,
        time_estimate: null,
      });
    } else {
      createIdea({
        title,
        description: null,
        category,
        tags: [],
        priority: 'medium',
        status: 'captured',
      });
    }
    
    resetForm();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && title.trim()) {
      handleQuickCreate();
    }
    if (e.key === 'Escape') {
      resetForm();
    }
  };

  const isOpen = mode !== 'closed';

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fade-in"
          onClick={resetForm}
        />
      )}
      
      {/* Bottom Sheet */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="bottom-sheet p-5 pt-3 animate-slide-up">
          {/* Drag handle */}
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
          
          {/* Mode tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('task')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl',
                'font-medium text-sm transition-all active:scale-95',
                mode === 'task'
                  ? 'gradient-primary text-white shadow-lg'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <CheckSquare className="h-4 w-4" />
              Task
            </button>
            <button
              onClick={() => setMode('idea')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl',
                'font-medium text-sm transition-all active:scale-95',
                mode === 'idea'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <Lightbulb className="h-4 w-4" />
              Idea
            </button>
          </div>
          
          {/* Input row */}
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={mode === 'task' ? 'What needs to be done?' : "What's your idea?"}
              className="flex-1 h-12 text-base rounded-xl bg-muted/50 border-0"
            />
            <Button
              onClick={handleQuickCreate}
              disabled={!title.trim()}
              className={cn(
                'h-12 w-12 rounded-xl shrink-0',
                mode === 'task' ? 'gradient-primary' : 'bg-gradient-to-r from-purple-500 to-pink-500',
                'text-white shadow-lg active:scale-95 transition-transform'
              )}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Quick options */}
          <div className="mt-4">
            {mode === 'task' ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-2">Priority</p>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map(p => {
                    const config = PRIORITY_CONFIG[p];
                    return (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={cn(
                          'flex-1 py-2.5 rounded-lg text-xs font-medium',
                          'transition-all active:scale-95',
                          priority === p
                            ? 'bg-primary/10 text-primary ring-1 ring-primary/30'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {config.icon}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-2">Category</p>
                <div className="flex gap-2 flex-wrap">
                  {(['apps', 'content', 'business', 'social'] as IdeaCategory[]).map(c => {
                    const config = IDEA_CATEGORY_CONFIG[c];
                    return (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={cn(
                          'px-3 py-2 rounded-lg text-xs font-medium',
                          'transition-all active:scale-95',
                          category === c
                            ? 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/30'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {config.emoji} {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* FAB - hidden when sheet is open */}
      <Button
        onClick={() => setMode('task')}
        className={cn(
          'fixed z-50 h-16 w-16 rounded-2xl shadow-2xl',
          'gradient-primary text-white glow-primary',
          'hover:scale-105 active:scale-95 transition-all duration-200',
          'bottom-24 right-5 md:bottom-8 md:right-8',
          isOpen && 'scale-0 opacity-0'
        )}
      >
        <Plus className="h-7 w-7" />
      </Button>
      
      {/* Close button when open */}
      {isOpen && (
        <Button
          onClick={resetForm}
          variant="outline"
          className={cn(
            'fixed z-50 h-12 w-12 rounded-full',
            'bottom-24 right-5 md:bottom-8 md:right-8',
            'bg-background/80 backdrop-blur-sm',
            'active:scale-95 transition-all animate-scale-in'
          )}
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}
