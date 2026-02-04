import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// GET all documents
export async function GET() {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform to match frontend expected format
    const docs = (data || []).map(d => ({
      ...d,
      description: d.content?.substring(0, 100) || '',
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));
    
    return NextResponse.json(docs);
  } catch (error) {
    console.error('Failed to fetch documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST new document
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { title, description, content, category = 'Other' } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const newDoc = {
      id: `doc-${Date.now()}`,
      title,
      content,
      category,
      tags: [],
    };

    const { data, error } = await supabase
      .from('documents')
      .insert(newDoc)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      ...data,
      description: data.content?.substring(0, 100) || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}

// PUT - update document
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }
    
    const { id, createdAt, updatedAt, description, ...rest } = body;
    const updates = {
      ...rest,
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      ...data,
      description: data.content?.substring(0, 100) || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (error) {
    console.error('Failed to update document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

// DELETE document
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
