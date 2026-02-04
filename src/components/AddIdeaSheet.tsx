'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Lightbulb, Flag, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IdeaCategory, TaskPriority, IDEA_CATEGORY_CONFIG, PRIORITY_CONFIG } from '@/lib/types';

interface AddIdeaSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onIdeaAdded?: () => void;
}

export function AddIdeaSheet({ isOpen, onClose, onIdeaAdded }: AddIdeaSheetProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('content');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setCategory('content');
      setPriority('medium');
      setTagsInput('');
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
      // Parse tags from comma-separated input
      const tags = tagsInput
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0);

      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          category,
          priority,
          tags,
          status: 'captured',
        }),
      });

      if (response.ok) {
        onIdeaAdded?.();
        onClose();
      }
    } catch (error) {
      console.error('Failed to create idea:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const categories: IdeaCategory[] = ['content', 'apps', 'business', 'social'];

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
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">New Idea</h2>
          </div>
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
              What's your idea? *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Capture your thought..."
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-muted/50',
                'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
                'placeholder:text-muted-foreground/50'
              )}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expand on your idea..."
              rows={3}
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-muted/50 resize-none',
                'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
                'placeholder:text-muted-foreground/50'
              )}
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const config = IDEA_CATEGORY_CONFIG[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      'border flex items-center justify-center gap-2',
                      category === cat 
                        ? 'bg-purple-500 text-white border-purple-500' 
                        : 'bg-muted/50 border-transparent hover:bg-muted'
                    )}
                  >
                    <span>{config.emoji}</span>
                    <span>{config.label}</span>
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
                        ? 'bg-purple-500 text-white border-purple-500' 
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

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="marketing, video, launch (comma-separated)"
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-muted/50',
                'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
                'placeholder:text-muted-foreground/50'
              )}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className={cn(
              'w-full py-4 rounded-2xl font-semibold text-white',
              'bg-gradient-to-r from-purple-500 to-pink-500',
              'shadow-lg hover:shadow-xl transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'active:scale-[0.98] flex items-center justify-center gap-2'
            )}
          >
            <Lightbulb className="h-5 w-5" />
            {isSubmitting ? 'Capturing...' : 'Capture Idea'}
          </button>
        </form>
      </div>
    </>
  );
}
