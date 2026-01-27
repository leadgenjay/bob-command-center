'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  config: { label: string; color: string; bgColor: string };
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
        'kanban-column flex flex-col',
        config.bgColor,
        isOver && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h3 className={cn('font-semibold text-sm', config.color)}>
            {config.label}
          </h3>
          <span className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onUpdate={onTaskUpdate} />
          ))}
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-sm opacity-50">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
