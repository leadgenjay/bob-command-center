'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  X, 
  Kanban, 
  Lightbulb, 
  Bell, 
  Plane,
  Scale,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAddOption {
  label: string;
  icon: typeof Plus;
  color: string;
  href?: string;
  action?: () => void;
}

interface QuickAddFabProps {
  onQuickAdd?: (type: string) => void;
}

export function QuickAddFab({ onQuickAdd }: QuickAddFabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const options: QuickAddOption[] = [
    { 
      label: 'Task', 
      icon: Kanban, 
      color: 'bg-emerald-500 hover:bg-emerald-600',
      href: '/tasks?add=true'
    },
    { 
      label: 'Idea', 
      icon: Lightbulb, 
      color: 'bg-purple-500 hover:bg-purple-600',
      href: '/ideas?add=true'
    },
    { 
      label: 'Reminder', 
      icon: Bell, 
      color: 'bg-pink-500 hover:bg-pink-600',
      href: '/reminders?add=true'
    },
    { 
      label: 'Trip', 
      icon: Plane, 
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/trips?add=true'
    },
    { 
      label: 'Decision', 
      icon: Scale, 
      color: 'bg-amber-500 hover:bg-amber-600',
      href: '/decisions?add=true'
    },
    { 
      label: 'SOP', 
      icon: FileText, 
      color: 'bg-slate-500 hover:bg-slate-600',
      href: '/sops?add=true'
    },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleOptionClick = (option: QuickAddOption) => {
    setIsOpen(false);
    if (option.href) {
      router.push(option.href);
    } else if (option.action) {
      option.action();
    }
    if (onQuickAdd) {
      onQuickAdd(option.label.toLowerCase());
    }
  };

  return (
    <div ref={menuRef} className="fixed bottom-24 right-4 z-50 md:bottom-8 md:right-8">
      {/* Backdrop when open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Option buttons - fan out when open */}
      <div className="relative">
        {options.map((option, index) => {
          const Icon = option.icon;
          const angle = -90 - (index * 30); // Fan from top, 30 degrees apart
          const distance = 70; // Distance from center
          const radians = (angle * Math.PI) / 180;
          const x = isOpen ? Math.cos(radians) * distance : 0;
          const y = isOpen ? Math.sin(radians) * distance : 0;

          return (
            <button
              key={option.label}
              onClick={() => handleOptionClick(option)}
              className={cn(
                'absolute bottom-0 right-0 h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 text-white',
                option.color,
                isOpen 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-0 pointer-events-none'
              )}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
              }}
              title={option.label}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}

        {/* Labels - appear next to buttons when open */}
        {isOpen && options.map((option, index) => {
          const angle = -90 - (index * 30);
          const distance = 70;
          const radians = (angle * Math.PI) / 180;
          const x = Math.cos(radians) * distance;
          const y = Math.sin(radians) * distance;

          return (
            <span
              key={`label-${option.label}`}
              className={cn(
                'absolute bottom-1 right-16 text-sm font-medium text-foreground whitespace-nowrap',
                'bg-background/90 backdrop-blur px-2 py-1 rounded-lg shadow-md',
                'transition-all duration-300',
                isOpen ? 'opacity-100' : 'opacity-0'
              )}
              style={{
                transform: `translate(${x - 48}px, ${y}px)`,
                transitionDelay: `${index * 50 + 100}ms`,
              }}
            >
              {option.label}
            </span>
          );
        })}
      </div>

      {/* Main FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300',
          'bg-gradient-to-br from-primary to-purple-600 hover:shadow-2xl hover:scale-105 active:scale-95',
          isOpen && 'rotate-45'
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white transition-transform" />
        ) : (
          <Plus className="h-6 w-6 text-white transition-transform" />
        )}
      </button>
    </div>
  );
}
