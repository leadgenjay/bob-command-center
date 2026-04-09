-- Add execution tracking columns to cron_jobs
ALTER TABLE cron_jobs
  ADD COLUMN IF NOT EXISTS plist_label text UNIQUE,
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS model text,
  ADD COLUMN IF NOT EXISTS command_path text,
  ADD COLUMN IF NOT EXISTS skills text[];

-- Create cron_executions table
CREATE TABLE IF NOT EXISTS cron_executions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid REFERENCES cron_jobs(id) ON DELETE CASCADE,
  plist_label text NOT NULL,
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  status text CHECK (status IN ('running', 'success', 'error', 'timeout')) DEFAULT 'running',
  exit_code integer,
  duration_ms integer,
  skills_declared text[],
  output_summary text,
  output_full text,
  output_destinations text[],
  error_message text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cron_executions_job_started ON cron_executions(job_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_cron_executions_label_started ON cron_executions(plist_label, started_at DESC);

ALTER TABLE cron_executions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON cron_executions FOR ALL USING (true);
