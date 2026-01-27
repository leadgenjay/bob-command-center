'use client';

import { useState, useEffect } from 'react';
import { Project, ProjectStatus, PROJECT_COLORS } from '@/lib/types';
import { getProjects, createProject, updateProject, deleteProject, getTasks } from '@/lib/store';
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
import { cn } from '@/lib/utils';
import { FolderKanban, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_CONFIG: Record<ProjectStatus, { label: string; emoji: string; color: string }> = {
  active: { label: 'Active', emoji: '🟢', color: 'text-emerald-500' },
  paused: { label: 'Paused', emoji: '⏸️', color: 'text-amber-500' },
  completed: { label: 'Completed', emoji: '✅', color: 'text-blue-500' },
  archived: { label: 'Archived', emoji: '📦', color: 'text-gray-500' },
};

export function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});
  const [showNewForm, setShowNewForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: PROJECT_COLORS[0],
  });

  useEffect(() => {
    refreshProjects();
  }, []);

  const refreshProjects = () => {
    const projectsList = getProjects();
    setProjects(projectsList);
    
    const tasks = getTasks();
    const counts: Record<string, number> = {};
    tasks.forEach(task => {
      if (task.project_id) {
        counts[task.project_id] = (counts[task.project_id] || 0) + 1;
      }
    });
    setTaskCounts(counts);
  };

  const handleCreateProject = () => {
    if (!newProject.name.trim()) return;
    createProject({
      name: newProject.name,
      description: newProject.description || null,
      status: 'active',
      color: newProject.color,
    });
    setNewProject({ name: '', description: '', color: PROJECT_COLORS[0] });
    setShowNewForm(false);
    refreshProjects();
  };

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteProject(id);
    refreshProjects();
  };

  const handleStatusChange = (id: string, status: ProjectStatus) => {
    updateProject(id, { status });
    refreshProjects();
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Card className="frosted-glass border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
              <FolderKanban className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Projects</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {projects.length} projects
              </p>
            </div>
          </div>
          <Button 
            size="sm" 
            variant={showNewForm ? "secondary" : "outline"}
            onClick={() => setShowNewForm(!showNewForm)}
            className="touch-target"
          >
            <Plus className={cn("h-4 w-4 transition-transform", showNewForm && "rotate-45")} />
          </Button>
        </div>
        
        {/* New project form */}
        {showNewForm && (
          <div className="mt-4 p-4 bg-muted/50 rounded-xl space-y-3 animate-scale-in">
            <Input
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              placeholder="Project name"
              className="h-11"
            />
            <Textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Description (optional)"
              rows={2}
            />
            <div>
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {PROJECT_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewProject({ ...newProject, color })}
                    className={cn(
                      'w-8 h-8 rounded-full transition-all active:scale-90',
                      newProject.color === color && 'ring-2 ring-offset-2 ring-primary'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <Button 
              onClick={handleCreateProject} 
              disabled={!newProject.name.trim()}
              className="w-full gradient-primary text-white h-11"
            >
              Create Project
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-2 pb-5">
        {projects.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No projects yet</p>
            <p className="text-xs mt-1">Tap + to create your first project</p>
          </div>
        ) : (
          projects.map((project, index) => {
            const statusConfig = STATUS_CONFIG[project.status];
            const isExpanded = expandedId === project.id;
            const taskCount = taskCounts[project.id] || 0;
            
            return (
              <div
                key={project.id}
                className={cn(
                  'rounded-xl bg-muted/40 overflow-hidden animate-scale-in',
                  isExpanded && 'ring-1 ring-primary/20'
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Project header - always visible */}
                <button
                  onClick={() => toggleExpand(project.id)}
                  className="w-full flex items-center gap-3 p-4 text-left active:bg-muted/60 transition-colors touch-target"
                >
                  <div
                    className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{project.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {statusConfig.emoji} {statusConfig.label}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {taskCount} task{taskCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                
                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 animate-slide-up">
                    {project.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground">Status:</Label>
                      <Select
                        value={project.status}
                        onValueChange={(v) => handleStatusChange(project.id, v as ProjectStatus)}
                      >
                        <SelectTrigger className="h-8 w-auto text-xs gap-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.emoji} {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <button
                      onClick={(e) => handleDeleteProject(e, project.id)}
                      className={cn(
                        'flex items-center gap-1.5 text-xs text-destructive/70',
                        'hover:text-destructive transition-colors'
                      )}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete project
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
