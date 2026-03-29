import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// GET preferences (all, or single by ?key=xxx)
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      const { data, error } = await supabase
        .from('preferences')
        .select('*')
        .eq('key', key)
        .single();

      if (error) throw error;

      return NextResponse.json(data);
    }

    const { data, error } = await supabase
      .from('preferences')
      .select('*')
      .order('key', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch preferences:', error);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}

// PUT - upsert preference by key
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    if (!body.key) {
      return NextResponse.json({ error: 'Preference key required' }, { status: 400 });
    }

    const upsertData: Record<string, unknown> = {
      key: body.key,
      value: body.value,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('preferences')
      .upsert(upsertData, { onConflict: 'key' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to upsert preference:', error);
    return NextResponse.json({ error: 'Failed to upsert preference' }, { status: 500 });
  }
}
