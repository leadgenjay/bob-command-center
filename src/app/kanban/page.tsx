'use client';

import { useEffect } from 'react';
import { KanbanBoard } from '@/components/kanban';
import { initializeSampleData } from '@/lib/store';
import { Kanban } from 'lucide-react';

export default function KanbanPage() {
  useEffect(() => {
    initializeSampleData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
          <Kanban className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Kanban Board</h1>
          <p className="text-sm text-muted-foreground">
            Drag and drop tasks to update their status
          </p>
        </div>
      </div>

      <div className="frosted-glass rounded-2xl p-4">
        <KanbanBoard />
      </div>
    </div>
  );
}
