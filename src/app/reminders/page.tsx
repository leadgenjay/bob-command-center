'use client';

import { useState, useEffect } from 'react';
import { Reminder } from '@/lib/types';
import { getReminders, createReminder, updateReminder, deleteReminder } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Bell, Plus, Trash2, Clock, ToggleLeft, ToggleRight, X } from 'lucide-react';

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newText, setNewText] = useState('');
  const [newSchedule, setNewSchedule] = useState('');

  useEffect(() => {
    refreshReminders();
  }, []);

  const refreshReminders = () => {
    setReminders(getReminders());
  };

  const handleAdd = () => {
    if (!newText.trim()) return;
    createReminder({
      text: newText.trim(),
      schedule: newSchedule.trim() || 'Manual',
      nextRun: null,
      enabled: true,
    });
    setNewText('');
    setNewSchedule('');
    setShowAddForm(false);
    refreshReminders();
  };

  const handleToggle = (id: string, enabled: boolean) => {
    updateReminder(id, { enabled: !enabled });
    refreshReminders();
  };

  const handleDelete = (id: string) => {
    deleteReminder(id);
    refreshReminders();
  };

  const enabledReminders = reminders.filter(r => r.enabled);
  const disabledReminders = reminders.filter(r => !r.enabled);

  return (
    <div className="space-y-5 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Reminders</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Scheduled notifications from Bob
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="rounded-full h-10 w-10 p-0 gradient-primary shadow-lg"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="frosted-glass border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">New Reminder</CardTitle>
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
              placeholder="What should I remind you about?"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="bg-muted/50"
            />
            <Input
              placeholder="Schedule (e.g., 'Daily at 9am', 'Every Monday')"
              value={newSchedule}
              onChange={(e) => setNewSchedule(e.target.value)}
              className="bg-muted/50"
            />
            <Button onClick={handleAdd} className="w-full gradient-primary">
              Add Reminder
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Reminders */}
      <Card className="frosted-glass border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Active ({enabledReminders.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {enabledReminders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No active reminders</p>
              <p className="text-xs mt-1">Add one above or ask Bob to set a reminder</p>
            </div>
          ) : (
            enabledReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 group"
              >
                <button
                  onClick={() => handleToggle(reminder.id, reminder.enabled)}
                  className="text-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  <ToggleRight className="h-6 w-6" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{reminder.text}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{reminder.schedule}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(reminder.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Paused Reminders */}
      {disabledReminders.length > 0 && (
        <Card className="frosted-glass border-0 shadow-lg opacity-70">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              Paused ({disabledReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {disabledReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 group"
              >
                <button
                  onClick={() => handleToggle(reminder.id, reminder.enabled)}
                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  <ToggleLeft className="h-6 w-6" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-muted-foreground">{reminder.text}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="h-3 w-3 text-muted-foreground/60" />
                    <span className="text-xs text-muted-foreground/60">{reminder.schedule}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(reminder.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="frosted-glass border-0 shadow-lg bg-primary/5">
        <CardContent className="py-4">
          <p className="text-xs text-muted-foreground text-center">
            💡 Tip: Ask Bob to &quot;remind me to...&quot; and I&apos;ll add it here automatically
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
