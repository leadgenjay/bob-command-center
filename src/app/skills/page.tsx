'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Zap, Search, ChevronRight } from 'lucide-react';

interface Skill {
  name: string;
  description: string;
  category: string;
  location: string;
}

const FALLBACK_SKILLS: Skill[] = [
  // System & Productivity
  { name: 'apple-notes', description: 'Manage Apple Notes via the memo CLI on macOS (create, view, edit, delete, search)', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/apple-notes/SKILL.md' },
  { name: 'things-mac', description: 'Manage Things 3 via the things CLI on macOS — add tasks, list inbox/today, search projects', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/things-mac/SKILL.md' },
  { name: 'coding-agent', description: 'Delegate coding tasks to Codex, Claude Code, or Pi agents via background process', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/coding-agent/SKILL.md' },
  { name: 'github', description: 'GitHub operations via gh CLI: issues, PRs, CI runs, code review, API queries', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/github/SKILL.md' },
  { name: 'gh-issues', description: 'Fetch GitHub issues, spawn sub-agents to implement fixes and open PRs, monitor PR reviews', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/gh-issues/SKILL.md' },
  { name: 'healthcheck', description: 'Host security hardening and risk-tolerance configuration for OpenClaw deployments', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/healthcheck/SKILL.md' },
  { name: 'skill-creator', description: 'Create new skills, modify and improve existing skills, run evals to test and benchmark performance', category: 'System & Productivity', location: '~/.clawdbot/workspace/skills/skill-creator/SKILL.md' },
  { name: 'clawhub', description: 'Search, install, update, and publish agent skills from clawhub.com via the ClawHub CLI', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/clawhub/SKILL.md' },
  { name: 'mcporter', description: 'List, configure, auth, and call MCP servers/tools directly including ad-hoc servers and config edits', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/mcporter/SKILL.md' },
  { name: 'model-usage', description: 'Summarize per-model usage/cost from CodexBar CLI including current model or full breakdown', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/model-usage/SKILL.md' },
  { name: 'obsidian', description: 'Work with Obsidian vaults (plain Markdown notes) and automate via obsidian-cli', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/obsidian/SKILL.md' },

  // Communication
  { name: 'imsg', description: 'iMessage/SMS CLI for listing chats, history, and sending messages via Messages.app', category: 'Communication', location: '/opt/homebrew/lib/node_modules/openclaw/skills/imsg/SKILL.md' },
  { name: 'slack', description: 'Control Slack from OpenClaw: send messages, react, pin/unpin items in channels or DMs', category: 'Communication', location: '/opt/homebrew/lib/node_modules/openclaw/skills/slack/SKILL.md' },
  { name: 'summarize', description: 'Summarize or extract text/transcripts from URLs, podcasts, YouTube videos, and local files', category: 'Communication', location: '/opt/homebrew/lib/node_modules/openclaw/skills/summarize/SKILL.md' },

  // Google Workspace
  { name: 'gog', description: 'Google Workspace CLI for Gmail, Calendar, Drive, Contacts, Sheets, and Docs', category: 'Google Workspace', location: '/opt/homebrew/lib/node_modules/openclaw/skills/gog/SKILL.md' },
  { name: 'google-analytics', description: 'Google Analytics API integration: manage accounts, properties, data streams, run GA4 reports', category: 'Google Workspace', location: '~/.clawdbot/workspace/skills/google-analytics/SKILL.md' },
  { name: 'ga', description: 'Google Analytics 4 reporting via MCP server: traffic, page views, sessions, conversions, top pages', category: 'Google Workspace', location: '~/.clawdbot/workspace/skills/ga/SKILL.md' },

  // AI and Content
  { name: 'nano-banana-pro', description: 'Generate or edit images via Gemini 3 Pro Image (Nano Banana Pro)', category: 'AI and Content', location: '/opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/SKILL.md' },
  { name: 'openai-image-gen', description: 'Batch-generate images via OpenAI Images API with random prompt sampler and gallery output', category: 'AI and Content', location: '/opt/homebrew/lib/node_modules/openclaw/skills/openai-image-gen/SKILL.md' },
  { name: 'openai-whisper', description: 'Local speech-to-text with the Whisper CLI (no API key required)', category: 'AI and Content', location: '/opt/homebrew/lib/node_modules/openclaw/skills/openai-whisper/SKILL.md' },
  { name: 'openai-whisper-api', description: 'Transcribe audio via OpenAI Audio Transcriptions API (Whisper cloud)', category: 'AI and Content', location: '/opt/homebrew/lib/node_modules/openclaw/skills/openai-whisper-api/SKILL.md' },
  { name: 'remotion', description: 'Create programmatic videos and motion graphics with Remotion (React-based video framework)', category: 'AI and Content', location: '~/.clawdbot/workspace/skills/remotion/SKILL.md' },
  { name: 'gemini', description: 'Gemini CLI for one-shot Q&A, summaries, and content generation', category: 'AI and Content', location: '/opt/homebrew/lib/node_modules/openclaw/skills/gemini/SKILL.md' },
  { name: 'gifgrep', description: 'Search GIF providers with CLI/TUI, download results, and extract stills/sheets', category: 'AI and Content', location: '/opt/homebrew/lib/node_modules/openclaw/skills/gifgrep/SKILL.md' },
  { name: 'video-frames', description: 'Extract frames or short clips from videos using ffmpeg', category: 'AI and Content', location: '/opt/homebrew/lib/node_modules/openclaw/skills/video-frames/SKILL.md' },

  // Business
  { name: 'content-idea', description: 'Turn a raw content idea into a fully developed, production-ready content package', category: 'Business', location: '~/.clawdbot/workspace/skills/content-idea/SKILL.md' },
  { name: 'short-video', description: 'End-to-end short-form video pipeline: research, script, teleprompter, editing, captions, schedule', category: 'Business', location: '~/.clawdbot/workspace/skills/short-video/SKILL.md' },
  { name: 'social-media-ideas', description: 'Discover viral content ideas by scraping Reddit, YouTube, Twitter, and Facebook', category: 'Business', location: '~/.clawdbot/workspace/skills/social-media-ideas/SKILL.md' },
  { name: 'email-review', description: 'Review email inboxes overnight, find miscategorized emails needing replies, flag and organize', category: 'Business', location: '~/.clawdbot/workspace/skills/email-review/SKILL.md' },
  { name: 'skool-comments', description: "Reply to comments in Jay's Skool communities as Jay. Drafts await approval before posting.", category: 'Business', location: '~/.clawdbot/workspace/skills/skool-comments/SKILL.md' },
  { name: 'skool-posts', description: "Generate and post daily content to Jay's 3 Skool communities with an approval workflow via email", category: 'Business', location: '~/.clawdbot/workspace/skills/skool-posts/SKILL.md' },
  { name: 'productlift', description: 'Manage ProductLift roadmaps, changelogs, feedback boards, and knowledge bases via API', category: 'Business', location: '~/.clawdbot/workspace/skills/productlift/SKILL.md' },
  { name: 'lob', description: 'Send physical mail via LOB API: postcards, letters, checks, direct mail campaigns', category: 'Business', location: '~/.clawdbot/workspace/skills/lob/SKILL.md' },
  { name: 'goplaces', description: 'Query Google Places API for text search, place details, resolve, and reviews', category: 'Business', location: '/opt/homebrew/lib/node_modules/openclaw/skills/goplaces/SKILL.md' },
  { name: 'weather', description: 'Get current weather and forecasts via wttr.in or Open-Meteo for any location', category: 'Business', location: '/opt/homebrew/lib/node_modules/openclaw/skills/weather/SKILL.md' },

  // Ads and Marketing
  { name: 'russel-ads', description: 'Analyze ad performance and generate optimization recommendations using Hyros and Marketing Director API', category: 'Ads and Marketing', location: '~/.clawdbot/workspace/skills/russel-ads/SKILL.md' },
  { name: 'meta-ads-report', description: 'Generate weekly Meta Ads performance reports combining Hyros attribution with Meta API delivery metrics', category: 'Ads and Marketing', location: '~/.clawdbot/workspace/skills/meta-ads-report/SKILL.md' },
  { name: 'google-ads-report', description: 'Generate weekly Google Ads performance reports using Hyros as source of truth for revenue and conversions', category: 'Ads and Marketing', location: '~/.clawdbot/workspace/skills/google-ads-report/SKILL.md' },
  { name: 'google-ads-safety', description: 'Safety guardrails for making Google Ads API changes. Enforces pre-change checklist to prevent campaign damage.', category: 'Ads and Marketing', location: '~/.clawdbot/workspace/skills/google-ads-safety/SKILL.md' },

  // n8n
  { name: 'n8n', description: 'Build, debug, and optimize n8n automation workflows: nodes, expressions, webhooks, integrations', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/SKILL.md' },
  { name: 'n8n-code-javascript', description: 'Write JavaScript code in n8n Code nodes using $input/$json/$node syntax with helpers', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/n8n-code-javascript/SKILL.md' },
  { name: 'n8n-code-python', description: 'Write Python code in n8n Code nodes using _input/_json/_node syntax', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/n8n-code-python/SKILL.md' },
  { name: 'n8n-expression-syntax', description: 'Validate n8n expression syntax and fix common errors with {{}} expressions and variable references', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/n8n-expression-syntax/SKILL.md' },
  { name: 'n8n-mcp-tools-expert', description: 'Expert guide for n8n-mcp MCP tools: node search, validation, templates, workflow management', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/n8n-mcp-tools-expert/SKILL.md' },
  { name: 'n8n-node-configuration', description: 'Operation-aware node configuration guidance: required fields, dependencies, common patterns by node type', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/n8n-node-configuration/SKILL.md' },
  { name: 'n8n-validation-expert', description: 'Interpret n8n validation errors and guide fixing them: error types, profiles, false positives', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/n8n-validation-expert/SKILL.md' },
  { name: 'n8n-workflow-patterns', description: 'Proven workflow architectural patterns: webhook processing, HTTP APIs, database operations, AI agents', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/n8n-workflow-patterns/SKILL.md' },

  // Social Media & Content
  { name: 'gohighlevel-cli', description: 'CLI for GoHighLevel CRM/Marketing API — contacts, opportunities, calendars, workflows, conversations, emails, payments, forms, social', category: 'Social Media & Content', location: 'docs/skills/ghl/gohighlevel-cli.md' },
  { name: 'blotato-publishing', description: 'Multi-platform publishing for Instagram, LinkedIn, Twitter, TikTok, and other social media channels', category: 'Social Media & Content', location: 'docs/skills/blotato/blotato-publishing.md' },
  { name: 'apify-mcp-guide', description: 'Apify MCP integration for social media scraping (Instagram, TikTok, YouTube, Twitter/X, LinkedIn) and data collection', category: 'Social Media & Content', location: 'docs/skills/apify/apify-mcp-guide.md' },
  { name: 'content-research', description: 'Find unlimited SHORT-FORM video ideas (Reels, TikToks, YouTube Shorts) via 5 modes. Does NOT scrape long-form YouTube videos.', category: 'Social Media & Content', location: 'docs/skills/apify/content-research.md' },
  { name: 'social-content', description: 'Expert social media strategy for creating, scheduling, and optimizing content for Instagram, LinkedIn, Twitter/X, TikTok with brand consistency', category: 'Social Media & Content', location: 'docs/skills/apify/social-content.md' },
  { name: 'ad-creative', description: 'Generate ad creative images using fal.ai multi-step pipeline (nano-banana, flux-lora, compositing) with Jay photo compositing', category: 'Social Media & Content', location: 'docs/skills/fal-ai/ad-creative.md' },
  { name: 'ad-creative-graphic', description: 'Generate graphic ad creatives using nano-banana (Gemini text-to-image) with design templates and text overlays', category: 'Social Media & Content', location: 'docs/skills/fal-ai/ad-creative-graphic.md' },
  { name: 'carousel-post', description: 'Generate Instagram carousel posts as AI images via fal.ai (Nano Banana 2 + Flux LoRA) with cover photos and inner slide visuals', category: 'Social Media & Content', location: 'docs/skills/fal-ai/carousel-post.md' },
  { name: 'youtube-thumbnail', description: 'Generate YouTube thumbnails using AI pipeline with workflow router, design preferences, and composition rules', category: 'Social Media & Content', location: 'docs/skills/fal-ai/youtube-thumbnail.md' },
  { name: 'social-media-banner', description: 'Generate social media banner/header/cover images with Jay photo compositing for YouTube, Twitter, LinkedIn, and Facebook', category: 'Social Media & Content', location: 'docs/skills/fal-ai/social-media-banner.md' },
];

const CATEGORIES = ['All', 'System & Productivity', 'Communication', 'Google Workspace', 'AI and Content', 'Business', 'Ads and Marketing', 'n8n', 'Social Media & Content'];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    setLoading(true);
    try {
      const res = await fetch('/api/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data.length > 0 ? data : FALLBACK_SKILLS);
      } else {
        setSkills(FALLBACK_SKILLS);
      }
    } catch {
      setSkills(FALLBACK_SKILLS);
    }
    setLoading(false);
  }

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase()) ||
      skill.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || skill.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const skillsByCategory = activeCategory === 'All'
    ? CATEGORIES.slice(1).map(cat => ({
        category: cat,
        skills: skills.filter(s => s.category === cat)
      }))
    : [{
        category: activeCategory,
        skills: filteredSkills
      }];

  return (
    <div className="space-y-5 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Skills</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${skills.length} OpenClaw skills available`}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              activeCategory === category
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <Card className="frosted-glass border-0 shadow-lg">
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-[150px]" />
          </CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[300px]" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Skills by Category */}
      {!loading && search && (
        <Card className="frosted-glass border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Search Results ({filteredSkills.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredSkills.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No skills found</p>
              </div>
            ) : (
              filteredSkills.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index} />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {!loading && !search && skillsByCategory.map(({ category, skills: categorySkills }) => (
        categorySkills.length > 0 && (
          <Card key={category} className="frosted-glass border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{category} ({categorySkills.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categorySkills.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index} />
              ))}
            </CardContent>
          </Card>
        )
      ))}

      {/* Info Card */}
      <Card className="frosted-glass border-0 shadow-lg bg-primary/5">
        <CardContent className="py-4">
          <p className="text-xs text-muted-foreground text-center">
            💡 Skills are specialized capabilities that Bob can use to help you. Each skill has its own documentation and triggers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted/70 group transition-all duration-200 cursor-pointer"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Icon */}
      <div className="shrink-0">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Zap className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Skill Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate font-mono">{skill.name}</p>
        <p className="text-xs text-muted-foreground truncate">{skill.description}</p>
      </div>

      {/* Arrow */}
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
