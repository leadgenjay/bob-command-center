-- Seed data for skills table
INSERT INTO skills (name, description, category, location) VALUES
  -- System & Productivity
  ('apple-notes', 'Manage Apple Notes via the memo CLI on macOS (create, view, edit, delete, search)', 'System & Productivity', '/opt/homebrew/lib/node_modules/openclaw/skills/apple-notes/SKILL.md'),
  ('things-mac', 'Manage Things 3 via the things CLI on macOS — add tasks, list inbox/today, search projects', 'System & Productivity', '/opt/homebrew/lib/node_modules/openclaw/skills/things-mac/SKILL.md'),
  ('coding-agent', 'Delegate coding tasks to Codex, Claude Code, or Pi agents via background process', 'System & Productivity', '/opt/homebrew/lib/node_modules/openclaw/skills/coding-agent/SKILL.md'),
  ('github', 'GitHub operations via gh CLI: issues, PRs, CI runs, code review, API queries', 'System & Productivity', '/opt/homebrew/lib/node_modules/openclaw/skills/github/SKILL.md'),
  ('gh-issues', 'Fetch GitHub issues, spawn sub-agents to implement fixes and open PRs, monitor PR reviews', 'System & Productivity', '/opt/homebrew/lib/node_modules/openclaw/skills/gh-issues/SKILL.md'),
  ('healthcheck', 'Host security hardening and risk-tolerance configuration for OpenClaw deployments', 'System & Productivity', '/opt/homebrew/lib/node_modules/openclaw/skills/healthcheck/SKILL.md'),
  ('skill-creator', 'Create new skills, modify and improve existing skills, run evals to test and benchmark performance', 'System & Productivity', '~/.clawdbot/workspace/skills/skill-creator/SKILL.md'),
  ('clawhub', 'Search, install, update, and publish agent skills from clawhub.com via the ClawHub CLI', 'System & Productivity', '/opt/homebrew/lib/node_modules/openclaw/skills/clawhub/SKILL.md'),
  ('mcporter', 'List, configure, auth, and call MCP servers/tools directly including ad-hoc servers and config edits', 'System & Productivity', '/opt/homebrew/lib/node_modules/openclaw/skills/mcporter/SKILL.md'),
  ('model-usage', 'Summarize per-model usage/cost from CodexBar CLI including current model or full breakdown', 'System & Productivity', '/opt/homebrew/lib/node_modules/openclaw/skills/model-usage/SKILL.md'),
  ('obsidian', 'Work with Obsidian vaults (plain Markdown notes) and automate via obsidian-cli', 'System & Productivity', '/opt/homebrew/lib/node_modules/openclaw/skills/obsidian/SKILL.md'),

  -- Communication
  ('imsg', 'iMessage/SMS CLI for listing chats, history, and sending messages via Messages.app', 'Communication', '/opt/homebrew/lib/node_modules/openclaw/skills/imsg/SKILL.md'),
  ('slack', 'Control Slack from OpenClaw: send messages, react, pin/unpin items in channels or DMs', 'Communication', '/opt/homebrew/lib/node_modules/openclaw/skills/slack/SKILL.md'),
  ('summarize', 'Summarize or extract text/transcripts from URLs, podcasts, YouTube videos, and local files', 'Communication', '/opt/homebrew/lib/node_modules/openclaw/skills/summarize/SKILL.md'),

  -- Google Workspace
  ('gog', 'Google Workspace CLI for Gmail, Calendar, Drive, Contacts, Sheets, and Docs', 'Google Workspace', '/opt/homebrew/lib/node_modules/openclaw/skills/gog/SKILL.md'),
  ('google-analytics', 'Google Analytics API integration: manage accounts, properties, data streams, run GA4 reports', 'Google Workspace', '~/.clawdbot/workspace/skills/google-analytics/SKILL.md'),
  ('ga', 'Google Analytics 4 reporting via MCP server: traffic, page views, sessions, conversions, top pages', 'Google Workspace', '~/.clawdbot/workspace/skills/ga/SKILL.md'),

  -- AI and Content
  ('nano-banana-pro', 'Generate or edit images via Gemini 3 Pro Image (Nano Banana Pro)', 'AI and Content', '/opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/SKILL.md'),
  ('openai-image-gen', 'Batch-generate images via OpenAI Images API with random prompt sampler and gallery output', 'AI and Content', '/opt/homebrew/lib/node_modules/openclaw/skills/openai-image-gen/SKILL.md'),
  ('openai-whisper', 'Local speech-to-text with the Whisper CLI (no API key required)', 'AI and Content', '/opt/homebrew/lib/node_modules/openclaw/skills/openai-whisper/SKILL.md'),
  ('openai-whisper-api', 'Transcribe audio via OpenAI Audio Transcriptions API (Whisper cloud)', 'AI and Content', '/opt/homebrew/lib/node_modules/openclaw/skills/openai-whisper-api/SKILL.md'),
  ('remotion', 'Create programmatic videos and motion graphics with Remotion (React-based video framework)', 'AI and Content', '~/.clawdbot/workspace/skills/remotion/SKILL.md'),
  ('gemini', 'Gemini CLI for one-shot Q&A, summaries, and content generation', 'AI and Content', '/opt/homebrew/lib/node_modules/openclaw/skills/gemini/SKILL.md'),
  ('gifgrep', 'Search GIF providers with CLI/TUI, download results, and extract stills/sheets', 'AI and Content', '/opt/homebrew/lib/node_modules/openclaw/skills/gifgrep/SKILL.md'),
  ('video-frames', 'Extract frames or short clips from videos using ffmpeg', 'AI and Content', '/opt/homebrew/lib/node_modules/openclaw/skills/video-frames/SKILL.md'),

  -- Business
  ('content-idea', 'Turn a raw content idea into a fully developed, production-ready content package', 'Business', '~/.clawdbot/workspace/skills/content-idea/SKILL.md'),
  ('short-video', 'End-to-end short-form video pipeline: research, script, teleprompter, editing, captions, schedule', 'Business', '~/.clawdbot/workspace/skills/short-video/SKILL.md'),
  ('social-media-ideas', 'Discover viral content ideas by scraping Reddit, YouTube, Twitter, and Facebook', 'Business', '~/.clawdbot/workspace/skills/social-media-ideas/SKILL.md'),
  ('email-review', 'Review email inboxes overnight, find miscategorized emails needing replies, flag and organize', 'Business', '~/.clawdbot/workspace/skills/email-review/SKILL.md'),
  ('skool-comments', 'Reply to comments in Jay''s Skool communities as Jay. Drafts await approval before posting.', 'Business', '~/.clawdbot/workspace/skills/skool-comments/SKILL.md'),
  ('skool-posts', 'Generate and post daily content to Jay''s 3 Skool communities with an approval workflow via email', 'Business', '~/.clawdbot/workspace/skills/skool-posts/SKILL.md'),
  ('productlift', 'Manage ProductLift roadmaps, changelogs, feedback boards, and knowledge bases via API', 'Business', '~/.clawdbot/workspace/skills/productlift/SKILL.md'),
  ('lob', 'Send physical mail via LOB API: postcards, letters, checks, direct mail campaigns', 'Business', '~/.clawdbot/workspace/skills/lob/SKILL.md'),
  ('goplaces', 'Query Google Places API for text search, place details, resolve, and reviews', 'Business', '/opt/homebrew/lib/node_modules/openclaw/skills/goplaces/SKILL.md'),
  ('weather', 'Get current weather and forecasts via wttr.in or Open-Meteo for any location', 'Business', '/opt/homebrew/lib/node_modules/openclaw/skills/weather/SKILL.md'),

  -- Ads and Marketing
  ('russel-ads', 'Analyze ad performance and generate optimization recommendations using Hyros and Marketing Director API', 'Ads and Marketing', '~/.clawdbot/workspace/skills/russel-ads/SKILL.md'),
  ('meta-ads-report', 'Generate weekly Meta Ads performance reports combining Hyros attribution with Meta API delivery metrics', 'Ads and Marketing', '~/.clawdbot/workspace/skills/meta-ads-report/SKILL.md'),
  ('google-ads-report', 'Generate weekly Google Ads performance reports using Hyros as source of truth for revenue and conversions', 'Ads and Marketing', '~/.clawdbot/workspace/skills/google-ads-report/SKILL.md'),
  ('google-ads-safety', 'Safety guardrails for making Google Ads API changes. Enforces pre-change checklist to prevent campaign damage.', 'Ads and Marketing', '~/.clawdbot/workspace/skills/google-ads-safety/SKILL.md'),

  -- n8n
  ('n8n', 'Build, debug, and optimize n8n automation workflows: nodes, expressions, webhooks, integrations', 'n8n', '~/.clawdbot/workspace/skills/n8n/SKILL.md'),
  ('n8n-code-javascript', 'Write JavaScript code in n8n Code nodes using $input/$json/$node syntax with helpers', 'n8n', '~/.clawdbot/workspace/skills/n8n/n8n-code-javascript/SKILL.md'),
  ('n8n-code-python', 'Write Python code in n8n Code nodes using _input/_json/_node syntax', 'n8n', '~/.clawdbot/workspace/skills/n8n/n8n-code-python/SKILL.md'),
  ('n8n-expression-syntax', 'Validate n8n expression syntax and fix common errors with {{}} expressions and variable references', 'n8n', '~/.clawdbot/workspace/skills/n8n/n8n-expression-syntax/SKILL.md'),
  ('n8n-mcp-tools-expert', 'Expert guide for n8n-mcp MCP tools: node search, validation, templates, workflow management', 'n8n', '~/.clawdbot/workspace/skills/n8n/n8n-mcp-tools-expert/SKILL.md'),
  ('n8n-node-configuration', 'Operation-aware node configuration guidance: required fields, dependencies, common patterns by node type', 'n8n', '~/.clawdbot/workspace/skills/n8n/n8n-node-configuration/SKILL.md'),
  ('n8n-validation-expert', 'Interpret n8n validation errors and guide fixing them: error types, profiles, false positives', 'n8n', '~/.clawdbot/workspace/skills/n8n/n8n-validation-expert/SKILL.md'),
  ('n8n-workflow-patterns', 'Proven workflow architectural patterns: webhook processing, HTTP APIs, database operations, AI agents', 'n8n', '~/.clawdbot/workspace/skills/n8n/n8n-workflow-patterns/SKILL.md'),

  -- Social Media & Content
  ('gohighlevel-cli', 'CLI for GoHighLevel CRM/Marketing API — contacts, opportunities, calendars, workflows, conversations, emails, payments, forms, social', 'Social Media & Content', 'docs/skills/ghl/gohighlevel-cli.md'),
  ('blotato-publishing', 'Multi-platform publishing for Instagram, LinkedIn, Twitter, TikTok, and other social media channels', 'Social Media & Content', 'docs/skills/blotato/blotato-publishing.md'),
  ('apify-mcp-guide', 'Apify MCP integration for social media scraping (Instagram, TikTok, YouTube, Twitter/X, LinkedIn) and data collection', 'Social Media & Content', 'docs/skills/apify/apify-mcp-guide.md'),
  ('content-research', 'Find unlimited SHORT-FORM video ideas (Reels, TikToks, YouTube Shorts) via 5 modes. Does NOT scrape long-form YouTube videos.', 'Social Media & Content', 'docs/skills/apify/content-research.md'),
  ('social-content', 'Expert social media strategy for creating, scheduling, and optimizing content for Instagram, LinkedIn, Twitter/X, TikTok with brand consistency', 'Social Media & Content', 'docs/skills/apify/social-content.md'),
  ('ad-creative', 'Generate ad creative images using fal.ai multi-step pipeline (nano-banana, flux-lora, compositing) with Jay photo compositing', 'Social Media & Content', 'docs/skills/fal-ai/ad-creative.md'),
  ('ad-creative-graphic', 'Generate graphic ad creatives using fal.ai Nano Banana 2 (Gemini text-to-image) with design templates and text overlays', 'Social Media & Content', 'docs/skills/fal-ai/ad-creative-graphic.md'),
  ('carousel-post', 'Generate Instagram carousel posts as AI images via fal.ai (Nano Banana 2 + Flux LoRA) with cover photos and inner slide visuals', 'Social Media & Content', 'docs/skills/fal-ai/carousel-post.md'),
  ('youtube-thumbnail', 'Generate YouTube thumbnails using AI pipeline with workflow router, design preferences, and composition rules', 'Social Media & Content', 'docs/skills/fal-ai/youtube-thumbnail.md'),
  ('social-media-banner', 'Generate social media banner/header/cover images with Jay photo compositing for YouTube, Twitter, LinkedIn, and Facebook', 'Social Media & Content', 'docs/skills/fal-ai/social-media-banner.md'),

  -- Scripting
  ('short-form-script', 'Script Instagram Reels and TikTok talking-head videos (15-90s) with hooks from a 100-hook database, teleprompter scripts, and production briefs', 'Scripting', 'docs/skills/scripting/short-form-script.md'),
  ('youtube-script', 'Full YouTube script pipeline: keyword research, competitor analysis via Apify, retention-optimized writing, thumbnail creation, and SEO optimization', 'Scripting', 'docs/skills/scripting/youtube-script.md'),
  ('kinetic-text-ad', 'Create kinetic typography video ad scripts for Meta/Instagram Reels with beat-by-beat timing, animation cues, and VO direction', 'Scripting', 'docs/skills/scripting/kinetic-text-ad.md'),

  -- Research & Scraping
  ('yt-longtail', 'Discover high-opportunity, low-competition YouTube keywords with volume estimation, competition scoring, and channel authority assessment', 'Research & Scraping', 'docs/skills/research/yt-longtail.md')
ON CONFLICT DO NOTHING;
