import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// GET all reminders
export async function GET() {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .order('enabled', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform to match frontend expected format
    const reminders = (data || []).map(r => ({
      ...r,
      nextRun: r.next_run,
    }));
    
    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Failed to fetch reminders:', error);
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

// POST - create new reminder
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    
    const newReminder = {
      id: `reminder-${Date.now()}`,
      text: body.text || 'Untitled Reminder',
      schedule: body.schedule || '',
      next_run: body.nextRun || null,
      enabled: body.enabled !== false,
    };
    
    const { data, error } = await supabase
      .from('reminders')
      .insert(newReminder)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ ...data, nextRun: data.next_run });
  } catch (error) {
    console.error('Failed to create reminder:', error);
    return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
  }
}

// PUT - update reminder
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({ error: 'Reminder ID required' }, { status: 400 });
    }
    
    const { id, nextRun, ...rest } = body;
    const updates = {
      ...rest,
      next_run: nextRun || rest.next_run,
    };
    
    const { data, error } = await supabase
      .from('reminders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ ...data, nextRun: data.next_run });
  } catch (error) {
    console.error('Failed to update reminder:', error);
    return NextResponse.json({ error: 'Failed to update reminder' }, { status: 500 });
  }
}

// DELETE - remove reminder
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Reminder ID required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete reminder:', error);
    return NextResponse.json({ error: 'Failed to delete reminder' }, { status: 500 });
  }
}
