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
    <div className="space-y-5 md:space-y-6 animate-slide-up">
      {/* Header */}
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

      {/* Board - full bleed on mobile */}
      <div className="frosted-glass rounded-2xl p-3 md:p-5 -mx-4 sm:mx-0">
        <KanbanBoard />
      </div>
    </div>
  );
}
