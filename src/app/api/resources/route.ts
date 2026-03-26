import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET /api/resources error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, category, description } = body;

    if (!title || !url || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('resources')
      .insert([
        {
          title,
          url,
          category,
          description: description || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('POST /api/resources error:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, url, category, description } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('resources')
      .update({
        title,
        url,
        category,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT /api/resources error:', error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const { error } = await supabase.from('resources').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/resources error:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
