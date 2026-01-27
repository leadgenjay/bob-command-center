'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, TaskStatus, TASK_STATUS_CONFIG } from '@/lib/types';
import { getTasks, updateTask } from '@/lib/store';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';

const COLUMNS: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'review', 'done'];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Check if we're over a column
    if (COLUMNS.includes(overId as TaskStatus)) {
      if (activeTask.status !== overId) {
        setTasks(prev =>
          prev.map(t =>
            t.id === activeId ? { ...t, status: overId as TaskStatus } : t
          )
        );
      }
      return;
    }

    // Check if we're over another task
    const overTask = tasks.find(t => t.id === overId);
    if (!overTask) return;

    if (activeTask.status !== overTask.status) {
      setTasks(prev =>
        prev.map(t =>
          t.id === activeId ? { ...t, status: overTask.status } : t
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t.id === activeId);
    if (activeTask) {
      // Save to storage
      updateTask(activeId, { status: activeTask.status });
    }

    // Reorder within the same column if needed
    if (activeId !== overId && !COLUMNS.includes(overId as TaskStatus)) {
      const activeIndex = tasks.findIndex(t => t.id === activeId);
      const overIndex = tasks.findIndex(t => t.id === overId);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        setTasks(prev => arrayMove(prev, activeIndex, overIndex));
      }
    }

    setActiveTask(null);
  };

  const refreshTasks = () => {
    setTasks(getTasks());
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-5 gap-4 h-full min-h-[600px]">
        {COLUMNS.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            config={TASK_STATUS_CONFIG[status]}
            onTaskUpdate={refreshTasks}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
