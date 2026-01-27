'use client';

import { useState, useEffect } from 'react';
import { Idea, IdeaCategory, IDEA_CATEGORY_CONFIG, PRIORITY_CONFIG, IdeaStatus } from '@/lib/types';
import { getIdeas, createIdea, updateIdea, deleteIdea } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Lightbulb, Plus, X, Sparkles, Trash2 } from 'lucide-react';

const categories: IdeaCategory[] = ['content', 'apps', 'business', 'social'];

export function IdeasVault() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [activeCategory, setActiveCategory] = useState<IdeaCategory | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    category: 'apps' as IdeaCategory,
    tags: '',
    priority: 'medium' as const,
  });

  useEffect(() => {
    refreshIdeas();
  }, []);

  const refreshIdeas = () => {
    setIdeas(getIdeas());
  };

  const filteredIdeas = activeCategory === 'all'
    ? ideas
    : ideas.filter(idea => idea.category === activeCategory);

  const handleCreateIdea = () => {
    if (!newIdea.title.trim()) return;
    createIdea({
      title: newIdea.title,
      description: newIdea.description || null,
      category: newIdea.category,
      tags: newIdea.tags.split(',').map(t => t.trim()).filter(Boolean),
      priority: newIdea.priority,
      status: 'captured',
    });
    setNewIdea({ title: '', description: '', category: 'apps', tags: '', priority: 'medium' });
    setIsDialogOpen(false);
    refreshIdeas();
  };

  const handleDeleteIdea = (id: string) => {
    deleteIdea(id);
    refreshIdeas();
  };

  const handleStatusChange = (id: string, status: IdeaStatus) => {
    updateIdea(id, { status });
    refreshIdeas();
  };

  return (
    <Card className="frosted-glass border-0 shadow-lg h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-lg">Ideas Vault</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-primary text-white glow-primary">
                <Plus className="h-4 w-4 mr-1" />
                Add Idea
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Capture New Idea
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={newIdea.title}
                    onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                    placeholder="What's your idea?"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newIdea.description}
                    onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                    placeholder="Describe your idea..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={newIdea.category}
                      onValueChange={(v) => setNewIdea({ ...newIdea, category: v as IdeaCategory })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {IDEA_CATEGORY_CONFIG[cat].emoji} {IDEA_CATEGORY_CONFIG[cat].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select
                      value={newIdea.priority}
                      onValueChange={(v) => setNewIdea({ ...newIdea, priority: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.icon} {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Tags (comma separated)</Label>
                  <Input
                    value={newIdea.tags}
                    onChange={(e) => setNewIdea({ ...newIdea, tags: e.target.value })}
                    placeholder="ai, automation, saas"
                  />
                </div>
                <Button onClick={handleCreateIdea} className="w-full gradient-primary text-white">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Save Idea
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as any)}>
          <TabsList className="w-full justify-start mb-4 bg-muted/50">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="text-xs">
                {IDEA_CATEGORY_CONFIG[cat].emoji} {IDEA_CATEGORY_CONFIG[cat].label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredIdeas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No ideas yet</p>
                <p className="text-xs">Start capturing your brilliant thoughts</p>
              </div>
            ) : (
              filteredIdeas.map(idea => {
                const catConfig = IDEA_CATEGORY_CONFIG[idea.category];
                const priority = PRIORITY_CONFIG[idea.priority];
                return (
                  <div
                    key={idea.id}
                    className="group p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-all border border-transparent hover:border-border"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{catConfig.emoji}</span>
                        <h4 className="font-medium text-sm">{idea.title}</h4>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                        onClick={() => handleDeleteIdea(idea.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    {idea.description && (
                      <p className="text-xs text-muted-foreground mt-1 ml-7 line-clamp-2">
                        {idea.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 ml-7 flex-wrap">
                      <Badge variant="outline" className={cn('text-xs', priority.color)}>
                        {priority.icon} {priority.label}
                      </Badge>
                      <Select
                        value={idea.status}
                        onValueChange={(v) => handleStatusChange(idea.id, v as IdeaStatus)}
                      >
                        <SelectTrigger className="h-6 w-auto text-xs border-0 bg-muted/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="captured">💡 Captured</SelectItem>
                          <SelectItem value="developing">🔨 Developing</SelectItem>
                          <SelectItem value="ready">✅ Ready</SelectItem>
                          <SelectItem value="archived">📦 Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      {idea.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
