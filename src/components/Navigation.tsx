'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Kanban,
  Lightbulb,
  FolderKanban,
  Command,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/kanban', label: 'Tasks', icon: Kanban },
  { href: '/ideas', label: 'Ideas', icon: Lightbulb },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="frosted-glass-strong fixed top-0 left-0 right-0 z-40 pt-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-active:scale-95">
              <Command className="h-5 w-5 text-white" />
            </div>
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
        </div>
      </div>
    </nav>
  );
}
