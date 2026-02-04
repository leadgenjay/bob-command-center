import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// GET all decisions
export async function GET() {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('decisions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Failed to fetch decisions:', error);
    return NextResponse.json({ error: 'Failed to fetch decisions' }, { status: 500 });
  }
}

// POST - create new decision
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    
    const newDecision = {
      id: `decision-${Date.now()}`,
      title: body.title || 'Untitled Decision',
      context: body.context || null,
      outcome: body.outcome || null,
      tags: body.tags || [],
    };
    
    const { data, error } = await supabase
      .from('decisions')
      .insert(newDecision)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to create decision:', error);
    return NextResponse.json({ error: 'Failed to create decision' }, { status: 500 });
  }
}

// PUT - update decision
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({ error: 'Decision ID required' }, { status: 400 });
    }
    
    const { id, ...updates } = body;
    
    const { data, error } = await supabase
      .from('decisions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update decision:', error);
    return NextResponse.json({ error: 'Failed to update decision' }, { status: 500 });
  }
}

// DELETE - remove decision
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Decision ID required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('decisions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete decision:', error);
    return NextResponse.json({ error: 'Failed to delete decision' }, { status: 500 });
  }
}
