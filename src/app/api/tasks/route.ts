import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  project_id: string | null;
  due_date: string | null;
  time_estimate: number | null;
  created_at: string;
  updated_at: string;
}

// GET all tasks
export async function GET() {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('status', { ascending: true })
      .order('priority', { ascending: true })
      .order('due_date', { ascending: true, nullsFirst: false });
    
    if (error) throw error;
    
    // Custom sort for status order
    const statusOrder: Record<string, number> = { in_progress: 0, review: 1, todo: 2, backlog: 3, done: 4 };
    const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
    
    const sorted = [...(data || [])].sort((a, b) => {
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return 0;
    });
    
    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST - create new task
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    
    const newTask = {
      id: `task-${Date.now()}`,
      title: body.title || 'Untitled Task',
      description: body.description || null,
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      project_id: body.project_id || null,
      due_date: body.due_date || null,
      time_estimate: body.time_estimate || null,
    };
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// PUT - update task
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }
    
    const { id, ...updates } = body;
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE - remove task
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
