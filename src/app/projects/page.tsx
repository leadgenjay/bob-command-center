'use client';

import { useEffect } from 'react';
import { ProjectsList } from '@/components/ProjectsList';
import { initializeSampleData } from '@/lib/store';
import { FolderKanban } from 'lucide-react';

export default function ProjectsPage() {
  useEffect(() => {
    initializeSampleData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
          <FolderKanban className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage your active projects
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <ProjectsList />
      </div>
    </div>
  );
}
