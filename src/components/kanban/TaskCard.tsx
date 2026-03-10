'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, PRIORITY_CONFIG, TaskStatus, TASK_STATUS_CONFIG } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, Calendar, MoreHorizontal, Trash2, Edit, GripVertical, Check, X, Square, CheckSquare, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onUpdate?: () => void;
}

export function TaskCard({ task, isDragging, onUpdate }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const isDone = task.status === 'done';

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/tasks?id=${task.id}`, { method: 'DELETE' });
      onUpdate?.();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus: TaskStatus = isDone ? 'todo' : 'done';
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status: newStatus }),
      });
      onUpdate?.();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: task.id, 
          title: editTitle,
          description: editDescription || null
        }),
      });
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleMoveToStatus = async (e: React.MouseEvent, newStatus: TaskStatus) => {
    e.stopPropagation();
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status: newStatus }),
      });
      onUpdate?.();
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const STATUSES: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'review', 'done'];

  // Edit mode
  if (isEditing) {
    return (
      <div className="bg-card rounded-xl p-4 border-2 border-primary shadow-lg">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Task title"
          className="mb-2 text-sm font-medium"
          autoFocus
        />
        <Textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Description (optional)"
          className="mb-3 text-xs resize-none"
          rows={2}
        />
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSaveEdit}>
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-card rounded-xl border border-border shadow-sm',
        'transition-all duration-200 active:scale-[0.98]',
        'overflow-hidden',
        (isDragging || isSortableDragging) && 'shadow-2xl opacity-95 rotate-1 scale-105',
        isDone && 'opacity-60'
      )}
    >
      <div className="flex">
        {/* Drag handle - visible strip on left */}
        <div
          {...attributes}
          {...listeners}
          className={cn(
            'w-8 flex-shrink-0 flex items-center justify-center',
            'cursor-grab active:cursor-grabbing touch-none',
            'bg-muted/30 hover:bg-muted/50 border-r border-border',
            'text-muted-foreground/40 hover:text-muted-foreground/60',
            'transition-colors'
          )}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Card content */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start gap-2">
            {/* Checkbox */}
            <button
              onClick={handleToggleComplete}
              className={cn(
                'flex-shrink-0 mt-0.5 p-0.5 rounded transition-colors',
                'hover:bg-muted/50',
                isDone ? 'text-emerald-500' : 'text-muted-foreground/50 hover:text-muted-foreground'
              )}
            >
              {isDone ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
            </button>

            {/* Title - full display */}
            <h4 className={cn(
              'flex-1 text-sm leading-snug font-medium',
              isDone && 'line-through text-muted-foreground'
            )}>
              {task.title}
            </h4>

            {/* Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 transition-opacity -mr-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleStartEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Move to
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {STATUSES.filter(s => s !== task.status).map(s => (
                      <DropdownMenuItem key={s} onClick={(e) => handleMoveToStatus(e, s)}>
                        <span className="mr-2">{TASK_STATUS_CONFIG[s].emoji}</span>
                        {TASK_STATUS_CONFIG[s].label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={handleToggleComplete}>
                  {isDone ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Mark incomplete
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Mark complete
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description - 1 line */}
          {task.description && !isDone && (
            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1 pl-5">
              {task.description}
            </p>
          )}

          {/* Meta info */}
          {!isDone && (
            <div className="flex items-center gap-2 mt-2 pl-5 flex-wrap">
              <span className={cn('flex items-center gap-1 text-[10px] font-medium', priorityConfig.color)}>
                <span>{priorityConfig.icon}</span>
                {priorityConfig.label}
              </span>

              {task.time_estimate && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {task.time_estimate}m
                </span>
              )}

              {task.due_date && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(task.due_date), 'MMM d')}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
