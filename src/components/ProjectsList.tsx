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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { FolderKanban, Plus, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string }> = {
  active: { label: 'Active', color: 'bg-emerald-500' },
  paused: { label: 'Paused', color: 'bg-amber-500' },
  completed: { label: 'Completed', color: 'bg-blue-500' },
  archived: { label: 'Archived', color: 'bg-gray-500' },
};

export function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    
    // Count tasks per project
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
    setIsDialogOpen(false);
    refreshProjects();
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    refreshProjects();
  };

  const handleStatusChange = (id: string, status: ProjectStatus) => {
    updateProject(id, { status });
    refreshProjects();
  };

  return (
    <Card className="frosted-glass border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <FolderKanban className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-lg">Projects</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Project name"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="What's this project about?"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {PROJECT_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewProject({ ...newProject, color })}
                        className={cn(
                          'w-8 h-8 rounded-full transition-all',
                          newProject.color === color && 'ring-2 ring-offset-2 ring-primary'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <Button onClick={handleCreateProject} className="w-full gradient-primary text-white">
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FolderKanban className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No projects yet</p>
            <p className="text-xs">Create your first project to organize tasks</p>
          </div>
        ) : (
          projects.map(project => {
            const statusConfig = STATUS_CONFIG[project.status];
            return (
              <div
                key={project.id}
                className="group p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-all border border-transparent hover:border-border"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium text-sm truncate">{project.name}</h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {project.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {project.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Select
                        value={project.status}
                        onValueChange={(v) => handleStatusChange(project.id, v as ProjectStatus)}
                      >
                        <SelectTrigger className="h-6 w-auto text-xs border-0 bg-transparent p-0">
                          <Badge variant="outline" className="text-xs">
                            <span
                              className={cn('w-2 h-2 rounded-full mr-1', statusConfig.color)}
                            />
                            {statusConfig.label}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <span className={cn('w-2 h-2 rounded-full', config.color)} />
                                {config.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-xs text-muted-foreground">
                        {taskCounts[project.id] || 0} tasks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
