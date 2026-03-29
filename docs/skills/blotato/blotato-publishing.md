---
name: "blotato-publishing"
description: "Multi-platform social media publishing via Blotato MCP. Publish to Instagram, LinkedIn, Twitter/X, TikTok, and more from a single interface."
category: "Social Media Publishing"
tools: ["Blotato MCP"]
---

# Blotato — Multi-Platform Publishing

Blotato MCP enables publishing social media content to multiple platforms from a single command interface.

## Supported Platforms

| Platform | Post Types | Status |
|----------|-----------|--------|
| Instagram | Images, Carousels, Reels | Available |
| LinkedIn | Text, Images, Carousels | Available |
| Twitter/X | Text, Images, Threads | Available |
| TikTok | Videos | Available |
| Facebook | Text, Images, Videos | Available |

## Integration

Blotato is referenced in the content pipeline as the final publishing step:

```
1. CREATE content (carousel, video, post)
2. REVIEW and approve
3. PUBLISH via Blotato MCP
```

### Usage in Content Pipeline

The social-content skill's pipeline ends with Blotato:
```
IDEATE → RESEARCH → GENERATE → BUILD → CAPTION → CAPTURE → QA → PUBLISH (Blotato)
```

## MCP Configuration

Add to `.mcp.json` when Blotato MCP is available:
```json
{
  "blotato": {
    "command": "npx",
    "args": ["-y", "@blotato/mcp-server"]
  }
}
```

## Related Skills

| Skill | Relationship |
|-------|-------------|
| `social-content` | Creates content that Blotato publishes |
| `carousel-post` | Generates carousel images for Instagram publishing |
| `content-research` | Researches what to publish |
| `content-strategy` | Plans publishing calendar |
