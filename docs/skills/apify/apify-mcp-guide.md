---
name: "apify-mcp-guide"
description: "Quick reference for using Apify MCP tools to scrape social media content for research, ideas, and competitor analysis."
category: "Research & Scraping"
tools: ["Apify MCP (@apify/actors-mcp-server)"]
---

# Apify MCP Guide — Social Media Scrapers

> Quick reference for using Apify MCP tools to scrape social media content for research, ideas, and competitor analysis. All scrapers listed are **non-rental** (pay-per-result only).

---

## MCP Server Setup

Configured in `.mcp.json` with tools: `actors`, `docs`, `storage`, `runs`.

### Key MCP Tools

| Tool | Purpose |
|------|---------|
| `search-actors` | Find scrapers in Apify Store |
| `fetch-actor-details` | Get input schema and docs for a scraper |
| `call-actor` | Run a scraper and get results |
| `get-actor-output` | Fetch full results from a completed run |
| `get-dataset-items` | Paginate through large result sets |
| `get-actor-run` | Check run status |
| `get-actor-log` | Debug failed runs |

### Workflow Pattern

```
1. call-actor → run the scraper with inputs
2. Wait for completion (returns output preview)
3. get-actor-output → fetch full dataset if preview was truncated
```

---

## Instagram Scrapers

### Posts — `apify/instagram-post-scraper`

**Cost:** ~$2.70 per 1,000 results | **Use for:** Scraping posts by URL, profile, or hashtag

**Key Inputs:**
```json
{
  "directUrls": ["https://www.instagram.com/p/ABC123/"],
  "resultsLimit": 50
}
```

Can also accept profile URLs (scrapes their posts) or hashtag URLs.

**Output fields:** caption, timestamp, likesCount, commentsCount, hashtags, mentions, images, videoUrl, ownerUsername

---

### Reels — `apify/instagram-reel-scraper`

**Cost:** ~$2.60 per 1,000 results | **Use for:** Reel captions, transcripts, engagement

**Key Inputs:**
```json
{
  "directUrls": ["https://www.instagram.com/reels/ABC123/"],
  "resultsLimit": 50
}
```

**Output fields:** caption, transcript, likesCount, commentsCount, videoViewCount, videoDuration, hashtags, audioMeta

---

### Profiles — `apify/instagram-profile-scraper`

**Cost:** ~$2.60 per 1,000 results | **Use for:** Creator research, follower counts, bios

**Key Inputs:**
```json
{
  "usernames": ["garyvee", "sahilbloom", "hormozi"]
}
```

**Output fields:** username, fullName, biography, followersCount, followsCount, postsCount, isVerified, profilePicUrl

---

### Hashtags — `apify/instagram-hashtag-scraper`

**Cost:** ~$2.60 per 1,000 results | **Use for:** Finding trending content in a niche

**Key Inputs:**
```json
{
  "hashtags": ["aimarketing", "leadgeneration", "saas"],
  "resultsLimit": 100
}
```

**Output fields:** caption, likesCount, commentsCount, hashtags, timestamp, images, ownerUsername

---

### Comments — `apify/instagram-comment-scraper`

**Cost:** ~$2.30 per 1,000 results | **Use for:** Audience sentiment, content ideas from comments

**Key Inputs:**
```json
{
  "directUrls": ["https://www.instagram.com/p/ABC123/"]
}
```

**Output fields:** text, ownerUsername, timestamp, likesCount, replies

---

## TikTok Scrapers

### General — `clockworks/tiktok-scraper`

**Cost:** ~$0.30 per 1,000 posts | **Use for:** Video research, trending content, competitor analysis

**Key Inputs:**
```json
{
  "hashtags": ["aitools"],
  "resultsPerPage": 50
}
```

Also accepts profile URLs, video URLs, or search queries.

**Output fields:** text, diggCount (likes), commentCount, shareCount, playCount, createdTime, authorMeta, videoUrl, hashtags

---

### Profiles — `clockworks/tiktok-profile-scraper`

**Cost:** ~$0.30 per 1,000 users | **Use for:** Creator research

**Key Inputs:**
```json
{
  "profiles": ["https://www.tiktok.com/@username"]
}
```

**Output fields:** nickname, bio, followers, following, hearts, videoCount, verified

---

### Hashtags — `clockworks/tiktok-hashtag-scraper`

**Cost:** ~$5.00 per 1,000 results | **Use for:** Niche/trend research

**Key Inputs:**
```json
{
  "hashtags": ["aimarketing"],
  "resultsPerPage": 100
}
```

---

### Comments — `clockworks/tiktok-comments-scraper`

**Cost:** Variable | **Use for:** Audience sentiment, pain points

**Key Inputs:**
```json
{
  "postURLs": ["https://www.tiktok.com/@user/video/123"]
}
```

---

## YouTube Scrapers

### Videos — `streamers/youtube-scraper`

**Cost:** ~$5.00 per 1,000 videos | **Use for:** Video research, competitor analysis, content ideas

**Key Inputs:**
```json
{
  "searchKeywords": "ai tools for business",
  "maxResults": 50
}
```

Also accepts direct video URLs or channel URLs.

**Output fields:** title, description, viewCount, likeCount, commentCount, duration, uploadDate, channelName, thumbnailUrl, tags

---

### Channels — `streamers/youtube-channel-scraper`

**Cost:** ~$0.50 per 1,000 results (cheapest scraper!) | **Use for:** Channel research, upload patterns

**Key Inputs:**
```json
{
  "channelUrls": ["https://www.youtube.com/@username"],
  "maxResults": 100
}
```

**Output fields:** channelName, subscriberCount, totalViews, description, videoCount, recentVideos

---

### Shorts — `streamers/youtube-shorts-scraper`

**Cost:** ~$5.00 per 1,000 results | **Use for:** Short-form content research

**Key Inputs:**
```json
{
  "searchKeywords": "ai automation tips",
  "maxResults": 50
}
```

---

### Comments — `streamers/youtube-comments-scraper`

**Cost:** Variable | **Use for:** Audience questions, pain points, content ideas

**Key Inputs:**
```json
{
  "videoUrls": ["https://www.youtube.com/watch?v=ABC123"]
}
```

---

## Twitter/X Scrapers

### Tweets — `apidojo/tweet-scraper`

**Cost:** ~$0.40 per 1,000 tweets | **Use for:** Topic research, trending takes, competitor posts

**Key Inputs:**
```json
{
  "searchTerms": ["ai marketing", "lead generation"],
  "maxTweets": 100
}
```

Also accepts profile URLs and list URLs.

**Output fields:** text, createdAt, likeCount, retweetCount, replyCount, quoteCount, author, hashtags, media

---

### User Profiles — `apidojo/twitter-user-scraper`

**Cost:** ~$0.30 per 1,000 users | **Use for:** Creator research, influencer discovery

**Key Inputs:**
```json
{
  "usernames": ["username1", "username2"]
}
```

**Output fields:** username, displayName, bio, followersCount, followingCount, tweetCount, verified, createdAt

---

## LinkedIn Scrapers

### Posts — `supreme_coder/linkedin-post`

**Cost:** ~$1.00 per 1,000 posts | **Use for:** B2B content research, competitor analysis

**Key Inputs:**
```json
{
  "urls": ["https://www.linkedin.com/in/username/recent-activity/all/"]
}
```

No cookies required.

**Output fields:** text, likeCount, commentCount, shareCount, author, timestamp, hashtags, media

---

### Profiles — `supreme_coder/linkedin-profile-scraper`

**Cost:** ~$3.00 per 1,000 profiles | **Use for:** Lead research, competitor bios

**Key Inputs:**
```json
{
  "urls": ["https://www.linkedin.com/in/username"]
}
```

No cookies required.

**Output fields:** name, title, company, bio, followers, skills, experience, education, contactInfo

---

## Common Use Cases

### 1. Content Idea Research
Scrape top-performing posts from competitors to find what resonates:
```
1. Instagram Post Scraper → competitor profile URLs, sort by engagement
2. Look for patterns: topics, hooks, formats that get most saves/comments
3. Feed into content ideation workflow
```

### 2. Trending Topic Discovery
Find what's blowing up in your niche:
```
1. Instagram Hashtag Scraper → niche hashtags (#aimarketing, #leadgen)
2. TikTok Hashtag Scraper → same hashtags, cross-platform trends
3. Tweet Scraper → keyword search for emerging conversations
```

### 3. Audience Pain Point Mining
Extract real language from comments to inform copy:
```
1. YouTube Comments Scraper → popular videos in your niche
2. Instagram Comment Scraper → competitor posts with high engagement
3. Extract questions, complaints, desires → use in hooks and captions
```

### 4. Competitor Benchmarking
Track competitor performance over time:
```
1. Instagram Profile Scraper → follower growth snapshots
2. YouTube Channel Scraper → upload frequency, view trends
3. LinkedIn Post Scraper → engagement patterns on B2B content
```

### 5. Rewriting Viral Scripts
Find viral short-form content and adapt for your brand:
```
1. TikTok Scraper → search by keyword, sort by plays
2. Instagram Reel Scraper → get transcripts of top reels
3. Feed script into SOP Section 8 (Video Script → Static Image)
```

---

## Cost Summary

| Platform | Scraper | Cost per 1K |
|----------|---------|-------------|
| Instagram | Posts | $2.70 |
| Instagram | Reels | $2.60 |
| Instagram | Profiles | $2.60 |
| Instagram | Hashtags | $2.60 |
| Instagram | Comments | $2.30 |
| TikTok | General | $0.30 |
| TikTok | Profiles | $0.30 |
| TikTok | Hashtags | $5.00 |
| YouTube | Videos | $5.00 |
| YouTube | Channels | $0.50 |
| YouTube | Shorts | $5.00 |
| Twitter/X | Tweets | $0.40 |
| Twitter/X | Profiles | $0.30 |
| LinkedIn | Posts | $1.00 |
| LinkedIn | Profiles | $3.00 |

**Budget tip:** TikTok general scraper ($0.30/1K) and Twitter tweets ($0.40/1K) are the cheapest for volume research. YouTube channels ($0.50/1K) is great for competitive analysis.

---

## Integration with n8n

The existing n8n scrape workflow at `https://server.nextwave.io/webhook/scrape-ideas` already uses Apify actors. These MCP tools let Claude run scrapers directly without going through n8n — useful for ad-hoc research and content ideation during conversations.

Results from MCP scraper runs can be saved to Supabase `scraped_ideas` table using the existing API routes.
