import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

interface ActivityItem {
  id: string;
  type: 'task' | 'idea' | 'trip' | 'reminder' | 'decision';
  action: 'created' | 'updated' | 'completed';
  title: string;
  timestamp: string;
  details?: string;
}

// GET recent activity across all entities
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const activities: ActivityItem[] = [];
    
    // Fetch recent tasks (created or updated in last 7 days)
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id, title, status, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    if (tasks) {
      tasks.forEach(task => {
        const isNew = new Date(task.created_at).getTime() === new Date(task.updated_at).getTime();
        const isCompleted = task.status === 'done';
        
        activities.push({
          id: `task-${task.id}`,
          type: 'task',
          action: isCompleted ? 'completed' : (isNew ? 'created' : 'updated'),
          title: task.title,
          timestamp: task.updated_at,
          details: isCompleted ? 'Marked as done' : undefined,
        });
      });
    }
    
    // Fetch recent ideas
    const { data: ideas } = await supabase
      .from('ideas')
      .select('id, title, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    if (ideas) {
      ideas.forEach(idea => {
        const isNew = new Date(idea.created_at).getTime() === new Date(idea.updated_at).getTime();
        activities.push({
          id: `idea-${idea.id}`,
          type: 'idea',
          action: isNew ? 'created' : 'updated',
          title: idea.title,
          timestamp: idea.updated_at,
        });
      });
    }
    
    // Fetch recent trips
    const { data: trips } = await supabase
      .from('trips')
      .select('id, title, status, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    if (trips) {
      trips.forEach(trip => {
        const isNew = new Date(trip.created_at).getTime() === new Date(trip.updated_at).getTime();
        const isCompleted = trip.status === 'completed';
        
        activities.push({
          id: `trip-${trip.id}`,
          type: 'trip',
          action: isCompleted ? 'completed' : (isNew ? 'created' : 'updated'),
          title: trip.title,
          timestamp: trip.updated_at,
        });
      });
    }
    
    // Fetch recent reminders
    const { data: reminders } = await supabase
      .from('reminders')
      .select('id, title, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    if (reminders) {
      reminders.forEach(reminder => {
        const isNew = new Date(reminder.created_at).getTime() === new Date(reminder.updated_at).getTime();
        activities.push({
          id: `reminder-${reminder.id}`,
          type: 'reminder',
          action: isNew ? 'created' : 'updated',
          title: reminder.title,
          timestamp: reminder.updated_at,
        });
      });
    }
    
    // Fetch recent decisions
    const { data: decisions } = await supabase
      .from('decisions')
      .select('id, title, status, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    if (decisions) {
      decisions.forEach(decision => {
        const isNew = new Date(decision.created_at).getTime() === new Date(decision.updated_at).getTime();
        const isCompleted = decision.status === 'made';
        
        activities.push({
          id: `decision-${decision.id}`,
          type: 'decision',
          action: isCompleted ? 'completed' : (isNew ? 'created' : 'updated'),
          title: decision.title,
          timestamp: decision.updated_at,
        });
      });
    }
    
    // Sort by timestamp and limit
    const sorted = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Failed to fetch activity:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
