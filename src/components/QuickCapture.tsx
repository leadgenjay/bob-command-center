'use client';

import { useState } from 'react';
import { TaskPriority, IdeaCategory, PRIORITY_CONFIG, IDEA_CATEGORY_CONFIG } from '@/lib/types';
import { createTask, createIdea } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Plus, Zap, CheckSquare, Lightbulb, Sparkles } from 'lucide-react';

interface QuickCaptureProps {
  onCapture?: () => void;
}

export function QuickCapture({ onCapture }: QuickCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'task' | 'idea'>('task');
  
  // Task state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskEstimate, setTaskEstimate] = useState('');

  // Idea state
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [ideaCategory, setIdeaCategory] = useState<IdeaCategory>('apps');
  const [ideaTags, setIdeaTags] = useState('');

  const resetForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setTaskEstimate('');
    setIdeaTitle('');
    setIdeaDescription('');
    setIdeaCategory('apps');
    setIdeaTags('');
  };

  const handleCreateTask = () => {
    if (!taskTitle.trim()) return;
    createTask({
      title: taskTitle,
      description: taskDescription || null,
      status: 'todo',
      priority: taskPriority,
      project_id: null,
      due_date: null,
      time_estimate: taskEstimate ? parseInt(taskEstimate) : null,
    });
    resetForm();
    setIsOpen(false);
    onCapture?.();
  };

  const handleCreateIdea = () => {
    if (!ideaTitle.trim()) return;
    createIdea({
      title: ideaTitle,
      description: ideaDescription || null,
      category: ideaCategory,
      tags: ideaTags.split(',').map(t => t.trim()).filter(Boolean),
      priority: 'medium',
      status: 'captured',
    });
    resetForm();
    setIsOpen(false);
    onCapture?.();
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className={cn(
              'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl',
              'gradient-primary text-white glow-primary',
              'hover:scale-110 transition-all duration-200',
              'z-50'
            )}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Capture
            </SheetTitle>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="task" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Task
              </TabsTrigger>
              <TabsTrigger value="idea" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Idea
              </TabsTrigger>
            </TabsList>

            <TabsContent value="task" className="space-y-4 mt-4">
              <div>
                <Label>What needs to be done?</Label>
                <Input
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Task title"
                  className="mt-1"
                  autoFocus
                />
              </div>
              <div>
                <Label>Details (optional)</Label>
                <Textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Add more context..."
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select value={taskPriority} onValueChange={(v) => setTaskPriority(v as TaskPriority)}>
                    <SelectTrigger className="mt-1">
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
                <div>
                  <Label>Time (minutes)</Label>
                  <Input
                    type="number"
                    value={taskEstimate}
                    onChange={(e) => setTaskEstimate(e.target.value)}
                    placeholder="30"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button onClick={handleCreateTask} className="w-full gradient-primary text-white mt-4">
                <CheckSquare className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </TabsContent>

            <TabsContent value="idea" className="space-y-4 mt-4">
              <div>
                <Label>What&apos;s your idea?</Label>
                <Input
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  placeholder="Idea title"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Textarea
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  placeholder="Flesh out your idea..."
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={ideaCategory} onValueChange={(v) => setIdeaCategory(v as IdeaCategory)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(IDEA_CATEGORY_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.emoji} {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tags (comma separated)</Label>
                <Input
                  value={ideaTags}
                  onChange={(e) => setIdeaTags(e.target.value)}
                  placeholder="ai, automation, saas"
                  className="mt-1"
                />
              </div>
              <Button onClick={handleCreateIdea} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mt-4">
                <Sparkles className="h-4 w-4 mr-2" />
                Capture Idea
              </Button>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
}
