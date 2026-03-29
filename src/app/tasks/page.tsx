'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { KanbanBoard } from '@/components/kanban';
import { AddTaskSheet } from '@/components/AddTaskSheet';
import { initializeSampleData } from '@/lib/store';
import { Kanban, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

function TasksPageContent() {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    initializeSampleData();
  }, []);

  // Handle ?add=true query param
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowAddSheet(true);
      // Clear the query param without navigation
      router.replace('/tasks', { scroll: false });
    }
  }, [searchParams, router]);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskAdded = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  return (
    <div className="space-y-5 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <Kanban className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Tasks</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Drag to update status
            </p>
          </div>
        </div>
        
        {/* Add button */}
        <button
          onClick={() => setShowAddSheet(true)}
          className={cn(
            'h-10 w-10 rounded-xl bg-primary text-white',
            'flex items-center justify-center shadow-lg',
            'hover:shadow-xl active:scale-95 transition-all'
          )}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Board - full bleed on mobile */}
      <div className="frosted-glass rounded-2xl p-3 md:p-5 -mx-4 sm:mx-0">
        <KanbanBoard key={refreshKey} />
      </div>

      {/* Add Task Sheet */}
      <AddTaskSheet 
        isOpen={showAddSheet} 
        onClose={() => setShowAddSheet(false)}
        onTaskAdded={handleTaskAdded}
      />
    </div>
  );
}

export default function KanbanPage() {
  return (
    <Suspense fallback={
      <div className="space-y-5 md:space-y-6 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <Kanban className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Tasks</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <TasksPageContent />
    </Suspense>
  );
}
