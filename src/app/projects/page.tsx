'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ProjectsList } from '@/components/ProjectsList';
import { initializeSampleData } from '@/lib/store';
import { FolderKanban, Scale, Settings2, ChevronRight } from 'lucide-react';

// "More" page items for mobile navigation
const moreItems = [
  { href: '/decisions', label: 'Decisions', icon: Scale, color: 'from-amber-500 to-orange-500' },
  { href: '/preferences', label: 'Settings', icon: Settings2, color: 'from-gray-500 to-slate-500' },
];

export default function ProjectsPage() {
  useEffect(() => {
    initializeSampleData();
  }, []);

  return (
    <div className="space-y-5 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
          <FolderKanban className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Projects</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Organize your work
          </p>
        </div>
      </div>

      {/* Projects list */}
      <div className="max-w-2xl">
        <ProjectsList />
      </div>

      {/* More navigation items (mobile only) */}
      <div className="md:hidden space-y-3 pt-4">
        <h2 className="text-sm font-medium text-muted-foreground px-1">More</h2>
        {moreItems.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 active:bg-muted/60 transition-colors touch-target"
            >
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className="flex-1 font-medium">{item.label}</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
