'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, PRIORITY_CONFIG } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, Calendar, MoreHorizontal, Trash2, Edit, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { deleteTask } from '@/lib/store';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onUpdate?: () => void;
}

export function TaskCard({ task, isDragging, onUpdate }: TaskCardProps) {
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
    onUpdate?.();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'kanban-card group relative',
        (isDragging || isSortableDragging) && 'kanban-card-dragging'
      )}
    >
      {/* Large drag handle for mobile */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          'absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center',
          'cursor-grab active:cursor-grabbing touch-none',
          'text-muted-foreground/40 hover:text-muted-foreground/60',
          'transition-colors'
        )}
      >
        <GripVertical className="h-5 w-5" />
      </div>
      
      <div className="pl-8">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm leading-tight flex-1 min-h-[20px]">
            {task.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="touch-target">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive touch-target" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-3 text-xs flex-wrap">
          <span className={cn('flex items-center gap-1 font-medium', priorityConfig.color)}>
            <span>{priorityConfig.icon}</span>
            {priorityConfig.label}
          </span>

          {task.time_estimate && (
            <span className="flex items-center gap-1 text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
              <Clock className="h-3 w-3" />
              {task.time_estimate}m
            </span>
          )}

          {task.due_date && (
            <span className="flex items-center gap-1 text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
              <Calendar className="h-3 w-3" />
              {format(new Date(task.due_date), 'MMM d')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
