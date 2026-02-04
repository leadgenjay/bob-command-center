'use client';

import { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, TaskStatus, TASK_STATUS_CONFIG } from '@/lib/types';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const COLUMNS: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'review', 'done'];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumnIndex, setActiveColumnIndex] = useState(1); // Start at "todo"
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t.id === activeId);
    if (activeTask) {
      // Update task via API
      try {
        await fetch('/api/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: activeId, status: activeTask.status }),
        });
      } catch (error) {
        console.error('Failed to update task:', error);
      }
    }

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
    fetchTasks();
  };

  const scrollToColumn = (index: number) => {
    if (index < 0 || index >= COLUMNS.length) return;
    setActiveColumnIndex(index);
    
    if (scrollContainerRef.current) {
      const columnWidth = scrollContainerRef.current.scrollWidth / COLUMNS.length;
      scrollContainerRef.current.scrollTo({
        left: columnWidth * index,
        behavior: 'smooth',
      });
    }
  };

  // Update active column on scroll
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const columnWidth = scrollContainerRef.current.scrollWidth / COLUMNS.length;
      const newIndex = Math.round(scrollLeft / columnWidth);
      if (newIndex !== activeColumnIndex) {
        setActiveColumnIndex(newIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Mobile column navigation */}
      <div className="md:hidden flex items-center justify-between mb-4 px-1">
        <button
          onClick={() => scrollToColumn(activeColumnIndex - 1)}
          disabled={activeColumnIndex === 0}
          className={cn(
            'h-10 w-10 rounded-xl flex items-center justify-center',
            'bg-muted transition-all active:scale-95',
            activeColumnIndex === 0 && 'opacity-30'
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        {/* Column indicators */}
        <div className="flex gap-2">
          {COLUMNS.map((status, index) => {
            const config = TASK_STATUS_CONFIG[status];
            const count = getTasksByStatus(status).length;
            return (
              <button
                key={status}
                onClick={() => scrollToColumn(index)}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-1 rounded-lg',
                  'transition-all active:scale-95',
                  index === activeColumnIndex && 'bg-primary/10'
                )}
              >
                <span className="text-lg">{config.emoji}</span>
                <span className={cn(
                  'text-[10px] font-medium',
                  index === activeColumnIndex ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => scrollToColumn(activeColumnIndex + 1)}
          disabled={activeColumnIndex === COLUMNS.length - 1}
          className={cn(
            'h-10 w-10 rounded-xl flex items-center justify-center',
            'bg-muted transition-all active:scale-95',
            activeColumnIndex === COLUMNS.length - 1 && 'opacity-30'
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Kanban columns */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={cn(
          'md:grid md:grid-cols-5 md:gap-4 h-full min-h-[500px]',
          'flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0',
          'md:overflow-visible'
        )}
      >
        {COLUMNS.map((status, index) => (
          <div 
            key={status} 
            className={cn(
              'snap-center shrink-0 w-[85vw] md:w-auto',
              'pr-4 md:pr-0 last:pr-0'
            )}
          >
            <KanbanColumn
              status={status}
              tasks={getTasksByStatus(status)}
              config={TASK_STATUS_CONFIG[status]}
              onTaskUpdate={refreshTasks}
            />
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
