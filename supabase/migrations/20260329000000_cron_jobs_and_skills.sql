-- Cron Jobs table
CREATE TABLE IF NOT EXISTS cron_jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  enabled boolean DEFAULT true,
  schedule jsonb,
  agent_id text,
  description text,
  state jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cron_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON cron_jobs FOR ALL USING (true);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON skills FOR ALL USING (true);
