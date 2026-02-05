'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Plane, MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';

interface AddTripSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onTripAdded?: () => void;
}

type TripStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

const STATUS_OPTIONS: { value: TripStatus; label: string; emoji: string }[] = [
  { value: 'upcoming', label: 'Upcoming', emoji: '📅' },
  { value: 'active', label: 'In Progress', emoji: '✈️' },
];

export function AddTripSheet({ isOpen, onClose, onTripAdded }: AddTripSheetProps) {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [status, setStatus] = useState<TripStatus>('upcoming');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tripItUrl, setTripItUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDestination('');
      setStatus('upcoming');
      setStartDate('');
      setEndDate('');
      setTripItUrl('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Auto-set end date when start date changes
  useEffect(() => {
    if (startDate && !endDate) {
      setEndDate(format(addDays(new Date(startDate), 3), 'yyyy-MM-dd'));
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !destination.trim() || !startDate || !endDate) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          destination: destination.trim(),
          status,
          startDate,
          endDate,
          tripItUrl: tripItUrl.trim() || null,
          itinerary: [],
          notes: [],
        }),
      });

      if (response.ok) {
        onTripAdded?.();
        onClose();
      }
    } catch (error) {
      console.error('Failed to create trip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isFormValid = name.trim() && destination.trim() && startDate && endDate;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className={cn(
        'fixed inset-x-0 bottom-0 z-50 max-h-[90vh]',
        'bg-background rounded-t-3xl shadow-2xl',
        'animate-slide-up-sheet'
      )}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header with gradient */}
        <div className="flex items-center justify-between px-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">New Trip</h2>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-8 space-y-5 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Trip Name */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Trip Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Miami Beach Weekend"
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-muted/50',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                'placeholder:text-muted-foreground/50'
              )}
              autoFocus
            />
          </div>

          {/* Destination */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Destination *
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Miami, FL"
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-muted/50',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                'placeholder:text-muted-foreground/50'
              )}
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatus(option.value)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm transition-all',
                    'border flex items-center justify-center gap-2',
                    status === option.value 
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-blue-500' 
                      : 'bg-muted/50 border-transparent hover:bg-muted'
                  )}
                >
                  <span>{option.emoji}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border bg-muted/50',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                )}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border bg-muted/50',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                )}
              />
            </div>
          </div>

          {/* TripIt URL (optional) */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              TripIt URL (optional)
            </label>
            <input
              type="url"
              value={tripItUrl}
              onChange={(e) => setTripItUrl(e.target.value)}
              placeholder="https://tripit.com/trip/..."
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-muted/50',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                'placeholder:text-muted-foreground/50'
              )}
            />
          </div>

          {/* Info Card */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-muted-foreground">
              💡 You can add itinerary items and notes after creating the trip, or just tell Bob about your plans via text!
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={cn(
              'w-full py-4 rounded-2xl font-semibold text-white',
              'bg-gradient-to-r from-blue-500 to-cyan-600',
              'shadow-lg hover:shadow-xl transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'active:scale-[0.98] flex items-center justify-center gap-2'
            )}
          >
            <Plus className="h-5 w-5" />
            {isSubmitting ? 'Creating...' : 'Create Trip'}
          </button>
        </form>
      </div>
    </>
  );
}
