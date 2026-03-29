import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// GET all commands
export async function GET() {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('commands')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch commands:', error);
    return NextResponse.json({ error: 'Failed to fetch commands' }, { status: 500 });
  }
}

// POST - create new command
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Command name required' }, { status: 400 });
    }

    const newCommand: Record<string, unknown> = {
      name: body.name,
      description: body.description || null,
      command: body.command || null,
      category: body.category || null,
    };

    const { data, error } = await supabase
      .from('commands')
      .insert(newCommand)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to create command:', error);
    return NextResponse.json({ error: 'Failed to create command' }, { status: 500 });
  }
}

// PUT - update command
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Command ID required' }, { status: 400 });
    }

    const { id, ...updates } = body;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('commands')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'Command not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update command:', error);
    return NextResponse.json({ error: 'Failed to update command' }, { status: 500 });
  }
}

// DELETE - remove command
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Command ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('commands')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete command:', error);
    return NextResponse.json({ error: 'Failed to delete command' }, { status: 500 });
  }
}
