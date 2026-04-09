#!/usr/bin/env node
// Parses all com.claude.*.plist files and seeds cron_jobs in Supabase
// Uses fetch (built-in Node 18+) to call Supabase REST API directly

import { execSync } from 'child_process';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env from .env.local
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const m = line.match(/^([^=#][^=]*)=["']?(.+?)["']?\s*$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/\\n$/, '');
}

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_ANON_KEY = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase credentials in .env.local');
  console.error('URL:', SUPABASE_URL, 'KEY:', SUPABASE_ANON_KEY ? 'found' : 'missing');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Prefer': 'return=representation',
};

async function supabaseRequest(path, method = 'GET', body = null) {
  const url = `${SUPABASE_URL}/rest/v1${path}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Supabase ${method} ${path} failed (${res.status}): ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

const SKILLS_MAP = {
  'comms-email-check': ['gmail', 'email'],
  'morning-briefing': ['gmail', 'calendar', 'zeus'],
  'comms-daily-review': ['gmail', 'email', 'calendar'],
  'comms-calendar-preview': ['calendar'],
  'comms-birthday-check': ['calendar'],
  'comms-morning-roundup': ['gmail', 'calendar'],
  'content-morning-research': ['apify', 'research'],
  'content-viral-report': ['research', 'drive'],
  'content-meta-ads-report': ['meta-report', 'drive'],
  'content-reddit-8am': ['research'],
  'content-reddit-1pm': ['research'],
  'content-reddit-7pm': ['research'],
  'content-skool-comments-9am': ['skool-writing'],
  'content-skool-comments-5pm': ['skool-writing'],
  'infra-quick-check': ['zeus'],
  'infra-health-report': ['zeus'],
  'infra-error-logs': ['zeus'],
  'infra-secret-scan': [],
  'infra-overnight-11pm': ['zeus'],
  'infra-overnight-5am': ['zeus'],
  'ops-task-board-9am': [],
  'ops-task-board-5pm': [],
  'ops-linkedin-9am': ['dms'],
  'ops-linkedin-5pm': ['dms'],
  'auto-tweets': ['socialpost'],
  'disk-cleanup': [],
};

function generateDisplayName(label) {
  let name = label.replace(/^com\.claude\./, '');
  name = name.replace(/^(comms|infra|content|ops)-/, '');
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatScheduleDescription(sca, displayName) {
  if (!sca) return displayName;
  if (Array.isArray(sca)) {
    return `${displayName} — runs multiple times per day`;
  }
  const { Hour, Minute, Weekday } = sca;
  const min = (Minute ?? 0).toString().padStart(2, '0');
  if (Hour !== undefined) {
    const h = Hour % 12 || 12;
    const ampm = Hour < 12 ? 'AM' : 'PM';
    const dayPart = Weekday !== undefined ? ' on weekdays' : ' daily';
    return `${displayName} — runs at ${h}:${min} ${ampm}${dayPart}`;
  }
  return `${displayName} — runs every hour at :${min}`;
}

const PLIST_DIR = join(process.env.HOME, 'Library/LaunchAgents');
const plistFiles = readdirSync(PLIST_DIR).filter(f => f.startsWith('com.claude.') && f.endsWith('.plist'));

console.log(`Found ${plistFiles.length} plists`);

const rows = [];

for (const file of plistFiles) {
  const plistPath = join(PLIST_DIR, file);
  let plistData;
  try {
    const json = execSync(`plutil -convert json -o - "${plistPath}"`, { encoding: 'utf8' });
    plistData = JSON.parse(json);
  } catch (e) {
    console.error(`Failed to parse ${file}:`, e.message);
    continue;
  }

  const label = plistData.Label;
  const taskKey = label.replace(/^com\.claude\./, '');
  const displayName = generateDisplayName(label);
  const enabled = !(plistData.Disabled === true);
  const schedule = plistData.StartCalendarInterval || null;
  const args = plistData.ProgramArguments || [];

  const modelIdx = args.indexOf('--model');
  const model = modelIdx !== -1 ? args[modelIdx + 1] : null;

  const spfIdx = args.indexOf('--system-prompt-file');
  const commandPath = spfIdx !== -1 ? args[spfIdx + 1] : null;

  const skills = SKILLS_MAP[taskKey] ?? [];
  const description = formatScheduleDescription(schedule, displayName);

  rows.push({
    name: displayName,
    display_name: displayName,
    plist_label: label,
    enabled,
    schedule,
    model,
    command_path: commandPath,
    skills,
    description,
  });
}

console.log(`Parsed ${rows.length} rows`);

// Delete all existing rows
console.log('Clearing cron_jobs table...');
await supabaseRequest('/cron_jobs?id=neq.00000000-0000-0000-0000-000000000000', 'DELETE');

// Insert fresh data
console.log('Inserting rows...');
const inserted = await supabaseRequest('/cron_jobs', 'POST', rows);
console.log(`Inserted ${inserted?.length ?? 0} rows`);

// Verify
const check = await supabaseRequest('/cron_jobs?select=id,enabled');
const total = check?.length ?? 0;
const activeCount = check?.filter(r => r.enabled).length ?? 0;
console.log(`Verification: ${total} total, ${activeCount} enabled`);
