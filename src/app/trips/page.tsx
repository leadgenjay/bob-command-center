'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronRight,
  RefreshCw,
  Plus,
  ExternalLink
} from 'lucide-react';
import { AddTripSheet } from '@/components/AddTripSheet';

interface Trip {
  id: string;
  name: string;
  destination: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  tripItUrl?: string | null;
  itinerary: unknown[];
  notes: unknown[];
}

const statusColors = {
  upcoming: 'bg-blue-500/10 text-blue-600',
  active: 'bg-emerald-500/10 text-emerald-600',
  completed: 'bg-gray-500/10 text-gray-600',
  cancelled: 'bg-red-500/10 text-red-600',
};

const statusLabels = {
  upcoming: 'Upcoming',
  active: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function getDaysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const yearOptions: Intl.DateTimeFormatOptions = { ...options, year: 'numeric' };
  
  if (startDate.getFullYear() !== endDate.getFullYear()) {
    return `${startDate.toLocaleDateString('en-US', yearOptions)} – ${endDate.toLocaleDateString('en-US', yearOptions)}`;
  }
  if (startDate.getMonth() !== endDate.getMonth()) {
    return `${startDate.toLocaleDateString('en-US', options)} – ${endDate.toLocaleDateString('en-US', yearOptions)}`;
  }
  return `${startDate.toLocaleDateString('en-US', options)} – ${endDate.getDate()}, ${endDate.getFullYear()}`;
}

function TripsPageContent() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const searchParams = useSearchParams();

  // Handle ?add=true query param
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowAddSheet(true);
      // Clean up URL
      window.history.replaceState({}, '', '/trips');
    }
  }, [searchParams]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trips');
      const data = await res.json();
      setTrips(data);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const upcomingTrips = trips.filter(t => t.status === 'upcoming' || t.status === 'active');
  const pastTrips = trips.filter(t => t.status === 'completed' || t.status === 'cancelled');

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trips</h1>
          <p className="text-muted-foreground mt-1">Travel itineraries & planning</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchTrips}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-all active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddSheet(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-lg transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add Trip
          </button>
        </div>
      </div>

      {/* Active/Upcoming Trips */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin opacity-50" />
          <p>Loading trips...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No trips yet</p>
          <p className="text-sm mt-2">Tell Bob about your upcoming travel and he&apos;ll add it here!</p>
        </div>
      ) : (
        <>
          {/* Upcoming Section */}
          {upcomingTrips.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming & Active
              </h2>
              {upcomingTrips.map(trip => {
                const daysUntil = getDaysUntil(trip.startDate);
                const isActive = trip.status === 'active';
                
                return (
                  <Link
                    key={trip.id}
                    href={`/trips/${trip.id}`}
                    className="block bg-card border border-border rounded-2xl p-4 hover:shadow-lg transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[trip.status]}`}>
                            {statusLabels[trip.status]}
                          </span>
                          {trip.tripItUrl && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              TripIt
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg">{trip.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4" />
                          {trip.destination}
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDateRange(trip.startDate, trip.endDate)}
                          </span>
                          {!isActive && daysUntil > 0 && (
                            <span className="flex items-center gap-1 text-primary font-medium">
                              <Clock className="h-4 w-4" />
                              {daysUntil} day{daysUntil !== 1 ? 's' : ''} away
                            </span>
                          )}
                          {isActive && (
                            <span className="flex items-center gap-1 text-emerald-600 font-medium">
                              <Plane className="h-4 w-4" />
                              Currently traveling!
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {trip.itinerary.length} itinerary items • {trip.notes.length} notes
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Past Trips */}
          {pastTrips.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5" />
                Past Trips
              </h2>
              {pastTrips.map(trip => (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="block bg-card/50 border border-border/50 rounded-2xl p-4 hover:bg-card hover:border-border transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[trip.status]}`}>
                          {statusLabels[trip.status]}
                        </span>
                      </div>
                      <h3 className="font-medium">{trip.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {trip.destination}
                        <span className="mx-1">•</span>
                        {formatDateRange(trip.startDate, trip.endDate)}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Info Card */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Plane className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Managing Trips</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Just tell Bob about your travel plans via text! Say things like:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• &quot;I&apos;m flying to Miami March 15-18&quot;</li>
              <li>• &quot;Add my hotel reservation to the Miami trip&quot;</li>
              <li>• &quot;We have dinner at 7pm on Saturday at Joe&apos;s&quot;</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Trip Sheet */}
      <AddTripSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onTripAdded={fetchTrips}
      />
    </div>
  );
}

export default function TripsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse p-6">Loading...</div>}>
      <TripsPageContent />
    </Suspense>
  );
}
