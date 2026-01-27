'use client';

import { useState, useEffect } from 'react';
import { Preference } from '@/lib/types';
import { getPreferences, setPreference, deletePreference } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Settings2, Plus, Save, Trash2, Code, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PreferencesEditor() {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPref, setEditingPref] = useState<Preference | null>(null);
  const [newPref, setNewPref] = useState({
    key: '',
    value: '{}',
    description: '',
  });
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    refreshPreferences();
  }, []);

  const refreshPreferences = () => {
    setPreferences(getPreferences());
  };

  const validateJson = (value: string): boolean => {
    try {
      JSON.parse(value);
      setJsonError(null);
      return true;
    } catch (e) {
      setJsonError('Invalid JSON format');
      return false;
    }
  };

  const handleSave = () => {
    if (!newPref.key.trim()) return;
    if (!validateJson(newPref.value)) return;

    setPreference(
      newPref.key,
      JSON.parse(newPref.value),
      newPref.description || undefined
    );
    setNewPref({ key: '', value: '{}', description: '' });
    setIsDialogOpen(false);
    refreshPreferences();
  };

  const handleUpdate = (pref: Preference, newValue: string) => {
    if (!validateJson(newValue)) return;
    setPreference(pref.key, JSON.parse(newValue), pref.description || undefined);
    setEditingPref(null);
    refreshPreferences();
  };

  const handleDelete = (key: string) => {
    deletePreference(key);
    refreshPreferences();
  };

  const formatJson = (value: Record<string, unknown>) => {
    return JSON.stringify(value, null, 2);
  };

  // Sample preferences to add
  const samplePrefs = [
    {
      key: 'ai_assistant_rules',
      value: {
        tone: 'professional but friendly',
        response_length: 'concise',
        always_explain: true,
        use_examples: true,
      },
      description: 'Rules for AI assistant behavior',
    },
    {
      key: 'notification_settings',
      value: {
        email: true,
        push: false,
        daily_digest: true,
        quiet_hours: { start: '22:00', end: '08:00' },
      },
      description: 'Notification preferences',
    },
    {
      key: 'work_schedule',
      value: {
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        start_time: '09:00',
        end_time: '17:00',
        focus_blocks: ['10:00-12:00', '14:00-16:00'],
      },
      description: 'Work schedule and focus time',
    },
  ];

  const addSamplePref = (sample: typeof samplePrefs[0]) => {
    setPreference(sample.key, sample.value, sample.description);
    refreshPreferences();
  };

  return (
    <Card className="frosted-glass border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Settings2 className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-lg">Preferences</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Add Preference
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Key</Label>
                  <Input
                    value={newPref.key}
                    onChange={(e) => setNewPref({ ...newPref, key: e.target.value })}
                    placeholder="preference_key"
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={newPref.description}
                    onChange={(e) => setNewPref({ ...newPref, description: e.target.value })}
                    placeholder="What is this preference for?"
                  />
                </div>
                <div>
                  <Label>Value (JSON)</Label>
                  <Textarea
                    value={newPref.value}
                    onChange={(e) => {
                      setNewPref({ ...newPref, value: e.target.value });
                      validateJson(e.target.value);
                    }}
                    placeholder='{"key": "value"}'
                    rows={6}
                    className="font-mono text-sm"
                  />
                  {jsonError && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {jsonError}
                    </p>
                  )}
                </div>
                <Button onClick={handleSave} className="w-full gradient-primary text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preference
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {preferences.length === 0 ? (
          <div className="text-center py-6">
            <Settings2 className="h-10 w-10 mx-auto mb-2 opacity-30 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No preferences yet</p>
            <p className="text-xs text-muted-foreground mb-4">Add some sample preferences to get started</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {samplePrefs.map(sample => (
                <Button
                  key={sample.key}
                  size="sm"
                  variant="outline"
                  onClick={() => addSamplePref(sample)}
                  className="text-xs"
                >
                  + {sample.key.replace(/_/g, ' ')}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-2">
            {preferences.map(pref => (
              <AccordionItem
                key={pref.id}
                value={pref.id}
                className="border rounded-lg px-3 bg-background/50"
              >
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2 text-left">
                    <Code className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <span className="font-mono text-sm">{pref.key}</span>
                      {pref.description && (
                        <p className="text-xs text-muted-foreground font-normal">
                          {pref.description}
                        </p>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  {editingPref?.id === pref.id ? (
                    <div className="space-y-2">
                      <Textarea
                        defaultValue={formatJson(pref.value)}
                        onChange={(e) => validateJson(e.target.value)}
                        className="font-mono text-xs"
                        rows={8}
                        id={`edit-${pref.id}`}
                      />
                      {jsonError && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {jsonError}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            const textarea = document.getElementById(`edit-${pref.id}`) as HTMLTextAreaElement;
                            handleUpdate(pref, textarea.value);
                          }}
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingPref(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto font-mono">
                        {formatJson(pref.value)}
                      </pre>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPref(pref)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={() => handleDelete(pref.key)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
