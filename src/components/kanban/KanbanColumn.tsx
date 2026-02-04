'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus, TASK_STATUS_CONFIG } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  config: { label: string; emoji: string; color: string; bgColor: string };
  onTaskUpdate: () => void;
}

export function KanbanColumn({ status, tasks, config, onTaskUpdate }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'kanban-column flex flex-col h-full',
        config.bgColor,
        isOver && 'ring-2 ring-primary/50 ring-offset-2 ring-offset-background'
      )}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.emoji}</span>
          <h3 className={cn('font-semibold text-sm', config.color)}>
            {config.label}
          </h3>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-background/60 px-2.5 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Tasks list */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide pb-2">
          {tasks.map((task, index) => (
            <div 
              key={task.id}
              className="animate-scale-in group"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <TaskCard task={task} onUpdate={onTaskUpdate} />
            </div>
          ))}
          
          {/* Empty state */}
          {tasks.length === 0 && (
            <div className={cn(
              'flex flex-col items-center justify-center h-32',
              'text-muted-foreground/50 text-center',
              'border-2 border-dashed border-muted-foreground/20 rounded-xl',
              isOver && 'border-primary/50 bg-primary/5'
            )}>
              <span className="text-2xl mb-1">{config.emoji}</span>
              <span className="text-xs">Drop tasks here</span>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
