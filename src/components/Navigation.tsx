'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Kanban,
  Lightbulb,
  FolderKanban,
  FileText,
  Plus,
  CheckSquare,
  X,
  Clock,
  Files,
  Plane,
  Video,
  Users,
  Terminal,
} from 'lucide-react';

const navItems = [
  { href: '/tasks', label: 'Tasks', icon: Kanban },
  { href: '/cron-jobs', label: 'Cron Jobs', icon: Clock },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/trips', label: 'Trips', icon: Plane },
  { href: '/ideas', label: 'Ideas', icon: Lightbulb },
  { href: '/commands', label: 'Commands', icon: Terminal },
  { href: '/content', label: 'Content', icon: Video },
  { href: '/skills', label: 'Skills', icon: Files },
  { href: '/sops', label: 'SOPs', icon: FileText },
];

export function Navigation() {
  const pathname = usePathname();
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <>
      <nav className="frosted-glass-strong fixed top-0 left-0 right-0 z-40 pt-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <img 
                src="/bob-icon.png" 
                alt="Bob" 
                className="h-9 w-9 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200 group-active:scale-95 object-cover"
              />
              <span className="font-bold text-base sm:text-lg hidden sm:block">
                Command Center
              </span>
            </Link>

            {/* Desktop Nav Items - hidden on mobile (use bottom nav instead) */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium',
                      'transition-all duration-200 min-h-[44px]',
                      'active:scale-95',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className={cn(
                'h-10 w-10 rounded-full flex items-center justify-center',
                'transition-all duration-200 active:scale-95',
                showAddMenu
                  ? 'bg-muted text-foreground rotate-45'
                  : 'gradient-primary text-white shadow-lg hover:shadow-xl'
              )}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Add Menu Dropdown */}
      {showAddMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowAddMenu(false)}
          />
          <div className="fixed top-16 right-4 z-50 w-56 animate-scale-in">
            <div className="frosted-glass-strong rounded-2xl shadow-2xl overflow-hidden border border-border">
              <div className="p-2">
                <Link
                  href="/tasks?add=task"
                  onClick={() => setShowAddMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <CheckSquare className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">New Task</div>
                    <div className="text-xs text-muted-foreground">Add to kanban board</div>
                  </div>
                </Link>
                <Link
                  href="/ideas?add=idea"
                  onClick={() => setShowAddMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">New Idea</div>
                    <div className="text-xs text-muted-foreground">Capture a thought</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
