'use client';

import { useState, useEffect } from 'react';
import { Decision } from '@/lib/types';
import { getDecisions, createDecision, deleteDecision } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Scale, Plus, Trash2, Calendar, MessageSquare } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export function DecisionLog() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDecision, setNewDecision] = useState({
    title: '',
    context: '',
    outcome: '',
    tags: '',
  });

  useEffect(() => {
    refreshDecisions();
  }, []);

  const refreshDecisions = () => {
    setDecisions(getDecisions());
  };

  const handleCreate = () => {
    if (!newDecision.title.trim()) return;
    createDecision({
      title: newDecision.title,
      context: newDecision.context || null,
      outcome: newDecision.outcome || null,
      tags: newDecision.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setNewDecision({ title: '', context: '', outcome: '', tags: '' });
    setIsDialogOpen(false);
    refreshDecisions();
  };

  const handleDelete = (id: string) => {
    deleteDecision(id);
    refreshDecisions();
  };

  return (
    <Card className="frosted-glass border-0 shadow-lg h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Scale className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-lg">Decision Log</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Log
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Log a Decision
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Decision</Label>
                  <Input
                    value={newDecision.title}
                    onChange={(e) => setNewDecision({ ...newDecision, title: e.target.value })}
                    placeholder="What did you decide?"
                  />
                </div>
                <div>
                  <Label>Context</Label>
                  <Textarea
                    value={newDecision.context}
                    onChange={(e) => setNewDecision({ ...newDecision, context: e.target.value })}
                    placeholder="What factors led to this decision?"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Outcome / Action</Label>
                  <Textarea
                    value={newDecision.outcome}
                    onChange={(e) => setNewDecision({ ...newDecision, outcome: e.target.value })}
                    placeholder="What's the result or next step?"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Tags (comma separated)</Label>
                  <Input
                    value={newDecision.tags}
                    onChange={(e) => setNewDecision({ ...newDecision, tags: e.target.value })}
                    placeholder="tech-stack, architecture, process"
                  />
                </div>
                <Button onClick={handleCreate} className="w-full gradient-primary text-white">
                  <Scale className="h-4 w-4 mr-2" />
                  Log Decision
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {decisions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Scale className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No decisions logged</p>
              <p className="text-xs">Document important decisions for future reference</p>
            </div>
          ) : (
            <div className="space-y-4">
              {decisions.map((decision, index) => (
                <div
                  key={decision.id}
                  className={cn(
                    'group relative p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all border-l-2',
                    index === 0 ? 'border-l-primary' : 'border-l-muted'
                  )}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                    onClick={() => handleDelete(decision.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>

                  <h4 className="font-medium text-sm pr-8">{decision.title}</h4>

                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(decision.created_at), 'MMM d, yyyy')} ·{' '}
                      {formatDistanceToNow(new Date(decision.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  {decision.context && (
                    <div className="mt-3 p-2 rounded bg-muted/30">
                      <p className="text-xs text-muted-foreground flex items-start gap-2">
                        <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>{decision.context}</span>
                      </p>
                    </div>
                  )}

                  {decision.outcome && (
                    <div className="mt-2 p-2 rounded bg-emerald-50 dark:bg-emerald-950/30">
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        <strong>→</strong> {decision.outcome}
                      </p>
                    </div>
                  )}

                  {decision.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {decision.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
