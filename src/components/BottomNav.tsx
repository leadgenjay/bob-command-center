'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Kanban,
  Lightbulb,
  Sun,
  Plane,
  MoreHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import { MoreMenu } from './MoreMenu';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/tasks', label: 'Tasks', icon: Kanban },
  { href: '/daily', label: 'Daily', icon: Sun },
  { href: '/trips', label: 'Trips', icon: Plane },
  { href: '/ideas', label: 'Ideas', icon: Lightbulb },
];

export function BottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  // Paths that aren't in the main nav (show as "More" being active)
  const morePaths = ['/contacts', '/decisions', '/preferences', '/projects', '/reminders', '/documents', '/sops', '/content', '/commands'];
  const isMorePath = morePaths.some(p => pathname.startsWith(p));

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 frosted-glass-strong border-t border-border/50">
        <div 
          className="flex items-center justify-around h-16"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = item.href === '/' 
              ? pathname === '/'
              : item.href === '/trips'
              ? pathname.startsWith('/trips')
              : pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] py-2 px-2',
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
          
          {/* More button */}
          <button
            onClick={() => setShowMore(true)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] py-2 px-2',
              'transition-all duration-200 active:scale-95',
              isMorePath
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <MoreHorizontal 
              className={cn(
                'h-6 w-6 transition-transform duration-200',
                isMorePath && 'scale-110'
              )} 
            />
            <span className={cn(
              'text-[10px] font-medium transition-all duration-200',
              isMorePath && 'font-semibold'
            )}>
              More
            </span>
          </button>
        </div>
      </nav>

      {/* More Menu */}
      <MoreMenu open={showMore} onClose={() => setShowMore(false)} />
    </>
  );
}
