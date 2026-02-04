import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// GET all ideas
export async function GET() {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const statusOrder: Record<string, number> = { developing: 0, ready: 1, captured: 2, archived: 3 };
    const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
    
    const sorted = [...(data || [])].sort((a, b) => {
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Failed to fetch ideas:', error);
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}

// POST - create new idea
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    
    const newIdea = {
      id: `idea-${Date.now()}`,
      title: body.title || 'Untitled Idea',
      description: body.description || null,
      category: body.category || 'business',
      tags: body.tags || [],
      priority: body.priority || 'medium',
      status: body.status || 'captured',
    };
    
    const { data, error } = await supabase
      .from('ideas')
      .insert(newIdea)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to create idea:', error);
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}

// PUT - update idea
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({ error: 'Idea ID required' }, { status: 400 });
    }
    
    const { id, ...updates } = body;
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('ideas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update idea:', error);
    return NextResponse.json({ error: 'Failed to update idea' }, { status: 500 });
  }
}

// DELETE - remove idea
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Idea ID required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete idea:', error);
    return NextResponse.json({ error: 'Failed to delete idea' }, { status: 500 });
  }
}
