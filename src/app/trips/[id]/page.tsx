'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Plane, 
  Hotel, 
  Car, 
  Utensils, 
  MapPin, 
  Calendar,
  Clock,
  CheckSquare,
  Square,
  StickyNote,
  ChevronLeft,
  RefreshCw,
  ExternalLink,
  Train,
  CircleDot,
  Copy,
  Check
} from 'lucide-react';

interface ItineraryItem {
  id: string;
  type: 'flight' | 'hotel' | 'car' | 'activity' | 'transport' | 'other';
  date: string;
  time?: string;
  title: string;
  details: Record<string, unknown>;
}

interface TripNote {
  id: string;
  content: string;
  createdAt: string;
}

interface PackingItem {
  id: string;
  item: string;
  packed: boolean;
}

interface Trip {
  id: string;
  name: string;
  destination: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  tripItUrl?: string | null;
  timezone?: string;
  notes: TripNote[];
  itinerary: ItineraryItem[];
  packing: PackingItem[];
  createdAt: string;
  updatedAt: string;
}

const typeIcons: Record<string, React.ElementType> = {
  flight: Plane,
  hotel: Hotel,
  car: Car,
  activity: Utensils,
  transport: Train,
  other: CircleDot,
};

const typeColors: Record<string, string> = {
  flight: 'bg-blue-500/10 text-blue-600',
  hotel: 'bg-purple-500/10 text-purple-600',
  car: 'bg-orange-500/10 text-orange-600',
  activity: 'bg-emerald-500/10 text-emerald-600',
  transport: 'bg-amber-500/10 text-amber-600',
  other: 'bg-gray-500/10 text-gray-600',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(timeStr?: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

function groupByDate(items: ItineraryItem[]): Record<string, ItineraryItem[]> {
  const groups: Record<string, ItineraryItem[]> = {};
  for (const item of items) {
    if (!groups[item.date]) {
      groups[item.date] = [];
    }
    groups[item.date].push(item);
  }
  // Sort each day's items by time
  for (const date of Object.keys(groups)) {
    groups[date].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }
  return groups;
}

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'notes' | 'packing'>('itinerary');
  const [copied, setCopied] = useState<string | null>(null);

  const fetchTrip = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/trips?id=${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setTrip(data);
      }
    } catch (error) {
      console.error('Failed to fetch trip:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (params.id) {
      fetchTrip();
    }
  }, [params.id]);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Trip not found</p>
        <button
          onClick={() => router.push('/trips')}
          className="mt-4 text-primary hover:underline"
        >
          Back to Trips
        </button>
      </div>
    );
  }

  const groupedItinerary = groupByDate(trip.itinerary);
  const sortedDates = Object.keys(groupedItinerary).sort();

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push('/trips')}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Trips
        </button>
        
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{trip.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              {trip.destination}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Calendar className="h-4 w-4" />
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
            </div>
          </div>
          {trip.tripItUrl && (
            <a
              href={trip.tripItUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-all text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              TripIt
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === 'itinerary'
              ? 'bg-primary text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Calendar className="h-4 w-4 inline mr-2" />
          Itinerary ({trip.itinerary.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === 'notes'
              ? 'bg-primary text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <StickyNote className="h-4 w-4 inline mr-2" />
          Notes ({trip.notes.length})
        </button>
        <button
          onClick={() => setActiveTab('packing')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === 'packing'
              ? 'bg-primary text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <CheckSquare className="h-4 w-4 inline mr-2" />
          Packing ({trip.packing.filter(p => p.packed).length}/{trip.packing.length})
        </button>
      </div>

      {/* Itinerary Tab */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          {sortedDates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No itinerary items yet</p>
              <p className="text-sm mt-2">Tell Bob about your flights, hotels, and activities</p>
            </div>
          ) : (
            sortedDates.map(date => (
              <div key={date} className="space-y-3">
                <h3 className="font-semibold text-lg sticky top-0 bg-background py-2">
                  {formatDate(date)}
                </h3>
                {groupedItinerary[date].map(item => {
                  const Icon = typeIcons[item.type] || CircleDot;
                  const details = item.details || {};
                  
                  return (
                    <div
                      key={item.id}
                      className="bg-card border border-border rounded-2xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[item.type]}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {item.time && (
                              <span className="text-sm font-medium text-primary">
                                {formatTime(item.time)}
                              </span>
                            )}
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                              {item.type}
                            </span>
                          </div>
                          <h4 className="font-semibold mt-1">{item.title}</h4>
                          
                          {/* Render details based on type */}
                          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            {item.type === 'flight' && (
                              <>
                                {details.airline && <p>{details.airline as string} {details.flightNumber as string}</p>}
                                {details.departure && details.arrival && (
                                  <p>{details.departure as string} → {details.arrival as string}</p>
                                )}
                                {details.departureTime && details.arrivalTime && (
                                  <p>{formatTime(details.departureTime as string)} – {formatTime(details.arrivalTime as string)}</p>
                                )}
                              </>
                            )}
                            {item.type === 'hotel' && (
                              <>
                                {details.address && <p>{details.address as string}</p>}
                                {details.phone && <p>📞 {details.phone as string}</p>}
                              </>
                            )}
                            {item.type === 'activity' && (
                              <>
                                {details.location && <p>📍 {details.location as string}</p>}
                                {details.notes && <p>{details.notes as string}</p>}
                              </>
                            )}
                            {typeof details.confirmationNumber === 'string' && details.confirmationNumber && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                  {details.confirmationNumber}
                                </span>
                                <button
                                  onClick={() => handleCopy(details.confirmationNumber as string, item.id)}
                                  className="p-1 hover:bg-muted rounded transition-colors"
                                  title="Copy confirmation number"
                                >
                                  {copied === item.id ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          {trip.notes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <StickyNote className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notes yet</p>
              <p className="text-sm mt-2">Tell Bob anything you want to remember about this trip</p>
            </div>
          ) : (
            trip.notes.map(note => (
              <div
                key={note.id}
                className="bg-card border border-border rounded-2xl p-4"
              >
                <p className="whitespace-pre-wrap">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  {new Date(note.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Packing Tab */}
      {activeTab === 'packing' && (
        <div className="space-y-2">
          {trip.packing.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No packing list yet</p>
              <p className="text-sm mt-2">Ask Bob to create a packing list for your trip</p>
            </div>
          ) : (
            trip.packing.map(item => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  item.packed
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-card border-border'
                }`}
              >
                {item.packed ? (
                  <CheckSquare className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <Square className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={item.packed ? 'line-through text-muted-foreground' : ''}>
                  {item.item}
                </span>
              </div>
            ))
          )}
          <p className="text-xs text-muted-foreground text-center pt-4">
            Tell Bob to mark items as packed or add new items
          </p>
        </div>
      )}
    </div>
  );
}
