import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'trips.json');

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

async function readTrips(): Promise<Trip[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeTrips(trips: Trip[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(trips, null, 2));
}

// GET all trips or single trip by id
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const trips = await readTrips();
  
  if (id) {
    const trip = trips.find(t => t.id === id);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json(trip);
  }
  
  // Sort by startDate (upcoming first, then by date)
  const sorted = [...trips].sort((a, b) => {
    // Active trips first, then upcoming, then completed
    const statusOrder = { active: 0, upcoming: 1, completed: 2, cancelled: 3 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });
  
  return NextResponse.json(sorted);
}

// POST - create new trip
export async function POST(request: NextRequest) {
  const trips = await readTrips();
  const body = await request.json();
  
  const newTrip: Trip = {
    id: `trip-${Date.now()}`,
    name: body.name || 'Untitled Trip',
    destination: body.destination || '',
    status: body.status || 'upcoming',
    startDate: body.startDate || '',
    endDate: body.endDate || '',
    tripItUrl: body.tripItUrl || null,
    timezone: body.timezone || 'America/New_York',
    notes: body.notes || [],
    itinerary: body.itinerary || [],
    packing: body.packing || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  trips.push(newTrip);
  await writeTrips(trips);
  
  return NextResponse.json(newTrip);
}

// PUT - update trip
export async function PUT(request: NextRequest) {
  const trips = await readTrips();
  const body = await request.json();
  
  if (!body.id) {
    return NextResponse.json({ error: 'Trip ID required' }, { status: 400 });
  }
  
  const index = trips.findIndex(t => t.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  }
  
  trips[index] = {
    ...trips[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };
  
  await writeTrips(trips);
  return NextResponse.json(trips[index]);
}

// DELETE - remove trip
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Trip ID required' }, { status: 400 });
  }
  
  const trips = await readTrips();
  const filtered = trips.filter(t => t.id !== id);
  
  if (filtered.length === trips.length) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  }
  
  await writeTrips(filtered);
  return NextResponse.json({ success: true });
}
