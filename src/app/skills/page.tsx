'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Zap, Search, ChevronRight, ExternalLink } from 'lucide-react';

interface Skill {
  name: string;
  description: string;
  category: string;
  location: string;
}

const skills: Skill[] = [
  // System & Productivity
  { name: 'apple-notes', description: 'Manage Apple Notes via the memo CLI on macOS', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/apple-notes/SKILL.md' },
  { name: 'things-mac', description: 'Manage Things 3 via the things CLI on macOS', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/things-mac/SKILL.md' },
  { name: 'coding-agent', description: 'Delegate coding tasks to Codex, Claude Code, or Pi agents', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/coding-agent/SKILL.md' },
  { name: 'github', description: 'GitHub operations via gh CLI: issues, PRs, CI runs, code review', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/github/SKILL.md' },
  { name: 'gh-issues', description: 'Fetch GitHub issues, spawn sub-agents to implement fixes and open PRs', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/gh-issues/SKILL.md' },
  { name: 'healthcheck', description: 'Host security hardening and risk-tolerance configuration', category: 'System & Productivity', location: '/opt/homebrew/lib/node_modules/openclaw/skills/healthcheck/SKILL.md' },
  { name: 'skill-creator', description: 'Create new skills, modify and improve existing skills', category: 'System & Productivity', location: '~/.clawdbot/workspace/skills/skill-creator/SKILL.md' },
  
  // Communication
  { name: 'imsg', description: 'iMessage/SMS CLI for listing chats, history, and sending messages', category: 'Communication', location: '/opt/homebrew/lib/node_modules/openclaw/skills/imsg/SKILL.md' },
  { name: 'slack', description: 'Control Slack from OpenClaw via the slack tool', category: 'Communication', location: '/opt/homebrew/lib/node_modules/openclaw/skills/slack/SKILL.md' },
  
  // Google Workspace
  { name: 'gog', description: 'Google Workspace CLI for Gmail, Calendar, Drive, Contacts, Sheets, and Docs', category: 'Google Workspace', location: '/opt/homebrew/lib/node_modules/openclaw/skills/gog/SKILL.md' },
  
  // AI & Content
  { name: 'nano-banana-pro', description: 'Generate or edit images via Gemini 3 Pro Image', category: 'AI & Content', location: '/opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/SKILL.md' },
  { name: 'openai-image-gen', description: 'Batch-generate images via OpenAI Images API', category: 'AI & Content', location: '/opt/homebrew/lib/node_modules/openclaw/skills/openai-image-gen/SKILL.md' },
  { name: 'openai-whisper', description: 'Local speech-to-text with the Whisper CLI', category: 'AI & Content', location: '/opt/homebrew/lib/node_modules/openclaw/skills/openai-whisper/SKILL.md' },
  { name: 'openai-whisper-api', description: 'Transcribe audio via OpenAI Audio Transcriptions API', category: 'AI & Content', location: '/opt/homebrew/lib/node_modules/openclaw/skills/openai-whisper-api/SKILL.md' },
  { name: 'remotion', description: 'Create programmatic videos with Remotion (React-based)', category: 'AI & Content', location: '~/.clawdbot/workspace/skills/remotion/SKILL.md' },
  
  // Business Workflows
  { name: 'content-idea', description: 'Turn raw content ideas into production-ready content packages', category: 'Business', location: '~/.clawdbot/workspace/skills/content-idea/SKILL.md' },
  { name: 'short-video', description: 'End-to-end short-form video production pipeline', category: 'Business', location: '~/.clawdbot/workspace/skills/short-video/SKILL.md' },
  { name: 'social-media-ideas', description: 'Discover viral content ideas via Reddit, YouTube, Twitter, FB', category: 'Business', location: '~/.clawdbot/workspace/skills/social-media-ideas/SKILL.md' },
  { name: 'email-review', description: 'Review email inboxes overnight, flag important emails', category: 'Business', location: '~/.clawdbot/workspace/skills/email-review/SKILL.md' },
  { name: 'russel-ads', description: 'Analyze ad performance for Google Ads and Meta Ads using Hyros', category: 'Business', location: '~/.clawdbot/workspace/skills/russel-ads/SKILL.md' },
  { name: 'meta-ads-report', description: 'Generate weekly Meta Ads performance reports', category: 'Business', location: '~/.clawdbot/workspace/skills/meta-ads-report/SKILL.md' },
  { name: 'google-ads-safety', description: 'Safety guardrails for making Google Ads API changes', category: 'Business', location: '~/.clawdbot/workspace/skills/google-ads-safety/SKILL.md' },
  { name: 'productlift', description: 'Manage ProductLift roadmaps, changelogs, and feedback', category: 'Business', location: '~/.clawdbot/workspace/skills/productlift/SKILL.md' },
  { name: 'lob', description: 'Send physical mail via LOB API (postcards, letters, checks)', category: 'Business', location: '~/.clawdbot/workspace/skills/lob/SKILL.md' },
  
  // n8n Automation
  { name: 'n8n', description: 'Build, debug, and optimize n8n automation workflows', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/SKILL.md' },
  { name: 'n8n-code-javascript', description: 'Write JavaScript code in n8n Code nodes', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/n8n-code-javascript/SKILL.md' },
  { name: 'n8n-code-python', description: 'Write Python code in n8n Code nodes', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/n8n-code-python/SKILL.md' },
  { name: 'n8n-expression-syntax', description: 'Validate n8n expression syntax and fix common errors', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/n8n-expression-syntax/SKILL.md' },
  { name: 'n8n-mcp-tools-expert', description: 'Expert guide for using n8n-mcp MCP tools effectively', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/n8n-mcp-tools-expert/SKILL.md' },
  { name: 'n8n-node-configuration', description: 'Operation-aware node configuration guidance', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/n8n-node-configuration/SKILL.md' },
  { name: 'n8n-validation-expert', description: 'Interpret validation errors and guide fixing them', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/n8n-validation-expert/SKILL.md' },
  { name: 'n8n-workflow-patterns', description: 'Proven workflow architectural patterns from real workflows', category: 'n8n', location: '~/.clawdbot/workspace/skills/n8n/n8n-workflow-patterns/SKILL.md' },
  
  // Utilities
  { name: 'video-frames', description: 'Extract frames or short clips from videos using ffmpeg', category: 'Utilities', location: '/opt/homebrew/lib/node_modules/openclaw/skills/video-frames/SKILL.md' },
  { name: 'weather', description: 'Get current weather and forecasts via wttr.in or Open-Meteo', category: 'Utilities', location: '/opt/homebrew/lib/node_modules/openclaw/skills/weather/SKILL.md' },
];

const categories = ['All', 'System & Productivity', 'Communication', 'Google Workspace', 'AI & Content', 'Business', 'n8n', 'Utilities'];

export default function SkillsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase()) ||
      skill.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || skill.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const skillsByCategory = activeCategory === 'All' 
    ? categories.slice(1).map(cat => ({
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
              {skills.length} OpenClaw skills available
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
        {categories.map(category => (
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

      {/* Skills by Category */}
      {search && (
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

      {!search && skillsByCategory.map(({ category, skills: categorySkills }) => (
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
