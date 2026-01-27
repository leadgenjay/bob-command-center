'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Kanban,
  Lightbulb,
  MoreHorizontal,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/kanban', label: 'Tasks', icon: Kanban },
  { href: '/ideas', label: 'Ideas', icon: Lightbulb },
  { href: '/more', label: 'More', icon: MoreHorizontal },
];

export function BottomNav() {
  const pathname = usePathname();

  // Map more page paths to the "More" tab
  const isMorePath = ['/projects', '/decisions', '/preferences'].includes(pathname);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 frosted-glass-strong border-t border-border/50">
      <div 
        className="flex items-center justify-around h-16"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = item.href === '/more' 
            ? isMorePath || pathname === '/more'
            : pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href === '/more' ? '/projects' : item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] py-2 px-3',
                'transition-all duration-200 active:scale-95',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <Icon 
                className={cn(
                  'h-6 w-6 transition-transform duration-200',
                  isActive && 'scale-110'
                )} 
              />
              <span className={cn(
                'text-[10px] font-medium transition-all duration-200',
                isActive && 'font-semibold'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
