'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Bell, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

interface AddReminderSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onReminderAdded?: () => void;
}

const SCHEDULE_PRESETS = [
  { label: 'One-time', value: 'one-time', icon: '📌' },
  { label: 'Daily', value: 'daily', icon: '🔄' },
  { label: 'Weekly', value: 'weekly', icon: '📅' },
  { label: 'Custom', value: 'custom', icon: '⚙️' },
];

export function AddReminderSheet({ isOpen, onClose, onReminderAdded }: AddReminderSheetProps) {
  const [text, setText] = useState('');
  const [scheduleType, setScheduleType] = useState('one-time');
  const [customSchedule, setCustomSchedule] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setText('');
      setScheduleType('one-time');
      setCustomSchedule('');
      setReminderDate('');
      setReminderTime('09:00');
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

  const buildScheduleString = () => {
    if (scheduleType === 'custom') {
      return customSchedule || 'Manual';
    }
    
    const timeStr = reminderTime ? ` at ${reminderTime}` : '';
    
    switch (scheduleType) {
      case 'one-time':
        return reminderDate ? `Once on ${reminderDate}${timeStr}` : 'Manual';
      case 'daily':
        return `Daily${timeStr}`;
      case 'weekly':
        return `Weekly${timeStr}`;
      default:
        return 'Manual';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      const schedule = buildScheduleString();
      
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          schedule,
          nextRun: null,
          enabled: true,
        }),
      });

      if (response.ok) {
        onReminderAdded?.();
        onClose();
      }
    } catch (error) {
      console.error('Failed to create reminder:', error);
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

        {/* Header with gradient */}
        <div className="flex items-center justify-between px-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">New Reminder</h2>
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
          {/* Reminder Text */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              What should I remind you about? *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Follow up with the client about the proposal"
              rows={3}
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-muted/50 resize-none',
                'focus:outline-none focus:ring-2 focus:ring-pink-500/50',
                'placeholder:text-muted-foreground/50'
              )}
              autoFocus
            />
          </div>

          {/* Schedule Type */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Schedule
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SCHEDULE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setScheduleType(preset.value)}
                  className={cn(
                    'px-3 py-2.5 rounded-xl text-sm transition-all',
                    'border flex flex-col items-center gap-1',
                    scheduleType === preset.value 
                      ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white border-pink-500' 
                      : 'bg-muted/50 border-transparent hover:bg-muted'
                  )}
                >
                  <span>{preset.icon}</span>
                  <span className="text-xs">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date (for one-time) */}
          {scheduleType === 'one-time' && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </label>
              <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border bg-muted/50',
                  'focus:outline-none focus:ring-2 focus:ring-pink-500/50'
                )}
              />
            </div>
          )}

          {/* Time (for one-time, daily, weekly) */}
          {scheduleType !== 'custom' && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border bg-muted/50',
                  'focus:outline-none focus:ring-2 focus:ring-pink-500/50'
                )}
              />
            </div>
          )}

          {/* Custom Schedule */}
          {scheduleType === 'custom' && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Custom Schedule
              </label>
              <input
                type="text"
                value={customSchedule}
                onChange={(e) => setCustomSchedule(e.target.value)}
                placeholder="e.g., Every Monday and Thursday at 2pm"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border bg-muted/50',
                  'focus:outline-none focus:ring-2 focus:ring-pink-500/50',
                  'placeholder:text-muted-foreground/50'
                )}
              />
              <p className="text-xs text-muted-foreground mt-2">
                💡 Bob will interpret natural language schedules
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
            <p className="text-sm text-muted-foreground">Preview:</p>
            <p className="font-medium mt-1">{buildScheduleString()}</p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!text.trim() || isSubmitting}
            className={cn(
              'w-full py-4 rounded-2xl font-semibold text-white',
              'bg-gradient-to-r from-pink-500 to-rose-600',
              'shadow-lg hover:shadow-xl transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'active:scale-[0.98] flex items-center justify-center gap-2'
            )}
          >
            <Plus className="h-5 w-5" />
            {isSubmitting ? 'Creating...' : 'Create Reminder'}
          </button>
        </form>
      </div>
    </>
  );
}
