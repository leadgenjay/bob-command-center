import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// GET all trips or single trip by id
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
      }
      
      // Transform to match frontend expected format
      return NextResponse.json({
        ...data,
        startDate: data.start_date,
        endDate: data.end_date,
        tripItUrl: data.tripit_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      });
    }
    
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('start_date', { ascending: true });
    
    if (error) throw error;
    
    // Sort: active trips first, then upcoming, then completed
    const statusOrder: Record<string, number> = { active: 0, upcoming: 1, completed: 2, cancelled: 3 };
    
    const trips = (data || [])
      .map(t => ({
        ...t,
        startDate: t.start_date,
        endDate: t.end_date,
        tripItUrl: t.tripit_url,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      }))
      .sort((a, b) => {
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
    
    return NextResponse.json(trips);
  } catch (error) {
    console.error('Failed to fetch trips:', error);
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}

// POST - create new trip
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    
    const newTrip = {
      id: `trip-${Date.now()}`,
      name: body.name || 'Untitled Trip',
      destination: body.destination || '',
      status: body.status || 'upcoming',
      start_date: body.startDate || null,
      end_date: body.endDate || null,
      tripit_url: body.tripItUrl || null,
      timezone: body.timezone || 'America/New_York',
      notes: body.notes || [],
      itinerary: body.itinerary || [],
      packing: body.packing || [],
    };
    
    const { data, error } = await supabase
      .from('trips')
      .insert(newTrip)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      ...data,
      startDate: data.start_date,
      endDate: data.end_date,
      tripItUrl: data.tripit_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (error) {
    console.error('Failed to create trip:', error);
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}

// PUT - update trip
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({ error: 'Trip ID required' }, { status: 400 });
    }
    
    const { id, startDate, endDate, tripItUrl, createdAt, updatedAt, ...rest } = body;
    const updates = {
      ...rest,
      start_date: startDate || rest.start_date,
      end_date: endDate || rest.end_date,
      tripit_url: tripItUrl || rest.tripit_url,
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      ...data,
      startDate: data.start_date,
      endDate: data.end_date,
      tripItUrl: data.tripit_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (error) {
    console.error('Failed to update trip:', error);
    return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 });
  }
}

// DELETE - remove trip
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Trip ID required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete trip:', error);
    return NextResponse.json({ error: 'Failed to delete trip' }, { status: 500 });
  }
}
