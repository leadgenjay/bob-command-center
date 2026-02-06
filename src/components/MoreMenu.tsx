'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Bell,
  Scale,
  Video,
  Files,
  FileText,
  Settings,
  X,
  ChevronRight,
  Users,
} from 'lucide-react';

interface MoreMenuProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { href: '/contacts', label: 'Contacts', icon: Users, description: 'Personal CRM' },
  { href: '/reminders', label: 'Reminders', icon: Bell, description: 'Scheduled notifications' },
  { href: '/decisions', label: 'Decisions', icon: Scale, description: 'Decision log' },
  { href: '/content', label: 'Content', icon: Video, description: 'Content pipeline' },
  { href: '/documents', label: 'Documents', icon: Files, description: 'Document library' },
  { href: '/sops', label: 'SOPs', icon: FileText, description: 'Standard procedures' },
  { href: '/preferences', label: 'Preferences', icon: Settings, description: 'App settings' },
];

export function MoreMenu({ open, onClose }: MoreMenuProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up-sheet">
        <div className="bottom-sheet rounded-t-3xl max-h-[70vh] overflow-auto">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-4 border-b border-border/50">
            <h2 className="text-lg font-semibold">More</h2>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Menu Items */}
          <div className="px-2 py-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200',
                    'active:scale-[0.98]',
                    isActive 
                      ? 'bg-primary/10' 
                      : 'hover:bg-muted/50'
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className={cn(
                    'h-11 w-11 rounded-xl flex items-center justify-center',
                    isActive ? 'bg-primary/20' : 'bg-muted'
                  )}>
                    <Icon className={cn(
                      'h-5 w-5',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'font-medium',
                      isActive && 'text-primary'
                    )}>
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className={cn(
                    'h-5 w-5',
                    isActive ? 'text-primary' : 'text-muted-foreground/50'
                  )} />
                </Link>
              );
            })}
          </div>
          
          {/* Safe area padding at bottom */}
          <div className="h-4" />
        </div>
      </div>
    </>
  );
}
