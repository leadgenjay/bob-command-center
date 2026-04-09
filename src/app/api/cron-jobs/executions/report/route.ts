import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

interface ReportBody {
  plist_label: string;
  event: 'start' | 'end';
  exit_code?: number;
  output_summary?: string;
  output_full?: string;
  output_destinations?: string[];
  error_message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body: ReportBody = await request.json();

    if (!body.plist_label || !body.event) {
      return NextResponse.json({ error: 'plist_label and event are required' }, { status: 400 });
    }

    if (body.event === 'start') {
      // Look up job by plist_label
      const { data: job } = await supabase
        .from('cron_jobs')
        .select('id')
        .eq('plist_label', body.plist_label)
        .single();

      const { data: execution, error } = await supabase
        .from('cron_executions')
        .insert({
          job_id: job?.id ?? null,
          plist_label: body.plist_label,
          started_at: new Date().toISOString(),
          status: 'running',
        })
        .select('id')
        .single();

      if (error) throw error;

      return NextResponse.json({ execution_id: execution.id });
    }

    if (body.event === 'end') {
      // Find most recent running execution for this plist_label
      const { data: execution, error: findError } = await supabase
        .from('cron_executions')
        .select('id, started_at')
        .eq('plist_label', body.plist_label)
        .eq('status', 'running')
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      if (findError || !execution) {
        return NextResponse.json({ error: 'No running execution found' }, { status: 404 });
      }

      const endedAt = new Date();
      const startedAt = new Date(execution.started_at);
      const durationMs = endedAt.getTime() - startedAt.getTime();
      const exitCode = body.exit_code ?? 0;
      const status = exitCode === 0 ? 'success' : 'error';

      const { error: updateError } = await supabase
        .from('cron_executions')
        .update({
          ended_at: endedAt.toISOString(),
          exit_code: exitCode,
          status,
          duration_ms: durationMs,
          output_summary: body.output_summary ?? null,
          output_full: body.output_full ?? null,
          output_destinations: body.output_destinations ?? null,
          error_message: body.error_message ?? null,
        })
        .eq('id', execution.id);

      if (updateError) throw updateError;

      return NextResponse.json({ success: true, execution_id: execution.id, status, duration_ms: durationMs });
    }

    return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
  } catch (error) {
    console.error('Failed to report execution:', error);
    return NextResponse.json({ error: 'Failed to report execution' }, { status: 500 });
  }
}
