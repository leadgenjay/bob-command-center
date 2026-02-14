-- Commands table for storing Bob slash commands
CREATE TABLE IF NOT EXISTS commands (
  id TEXT PRIMARY KEY DEFAULT 'cmd-' || extract(epoch from now())::bigint::text,
  name TEXT NOT NULL UNIQUE,  -- e.g., 'kb', 'task', 'remind'
  description TEXT NOT NULL,  -- What the command does
  syntax TEXT NOT NULL,       -- How to use it, e.g., '/kb [Department] Title | Description'
  example TEXT,               -- Example usage
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'knowledge', 'tasks', 'reminders', 'utilities')),
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS idx_commands_name ON commands(name);
CREATE INDEX IF NOT EXISTS idx_commands_category ON commands(category);
CREATE INDEX IF NOT EXISTS idx_commands_enabled ON commands(enabled);

-- Insert the /kb command as first entry
INSERT INTO commands (name, description, syntax, example, category) VALUES
  ('kb', 
   'Add entry to team knowledge base and Notion LGJ Updates database', 
   '/kb [Department] Title | Description',
   '/kb [Sales] New Apollo Rules | Apollo links now auto-expire after 30 days. Always check expiration before sending to clients.',
   'knowledge'
  )
ON CONFLICT (name) DO NOTHING;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_commands_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_commands_updated_at ON commands;
CREATE TRIGGER update_commands_updated_at
  BEFORE UPDATE ON commands
  FOR EACH ROW
  EXECUTE FUNCTION update_commands_updated_at();
