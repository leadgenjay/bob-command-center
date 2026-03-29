---
name: social-media-banner
version: 1.0.0
description: "Generate social media banner/header/cover images with Jay photo compositing. Triggers: 'banner', 'header', 'cover photo', 'profile banner', 'channel art', 'YouTube banner', 'Twitter header', 'LinkedIn banner', 'Facebook cover'"
category: "Image Generation"
tools: ["fal.ai (Nano Banana 2, Flux LoRA)", "Playwright (HTML template screenshots)", "Sharp (banner cropping)"]
---

# Social Media Banner Generator

Generate professional social media banners, headers, and cover photos featuring Jay via the fal.ai compositing pipeline. Every banner uses Flux LoRA for character consistency and includes a safe zone preview so content stays visible across devices.

## Before Starting

**Read these files:**
- `lib/fal.ts` — `generateImage()`, `editWithNanoBanana()`, `generateWithNanoBanana()`, `uploadToFalStorage()`, `JAY_PRESETS`
- `CLAUDE.md` — Brand identity, accent color `#ED0D51`, dark bg `#0D0D0D`

**ALWAYS ask the user:**
1. **Which platform?** (or custom dimensions)
2. **What's the banner concept?** (scene, mood, message)
3. **Any text on the banner?** (max 3-5 words — AI-rendered only, no Sharp post-gen)
4. **Which Jay preset?** (professional, confident, cinematic, pointing — see table below)

---

## Platform Presets

| Platform | Full Size | Safe Zone (x, y, w, h) | fal.ai AR | Notes |
|----------|-----------|------------------------|----------------|-------|
| YouTube | 2560x1440 | 507, 508, 1546, 423 | `16:9` | Content outside safe zone cropped on mobile/TV |
| Twitter/X | 1500x500 | 150, 100, 1200, 300 | `21:9` → crop | Profile photo overlaps bottom-left ~170px |
| LinkedIn (Personal) | 1584x396 | 317, 60, 950, 276 | `21:9` → crop | Mobile crops 15-20% sides, profile covers bottom-left |
| LinkedIn (Business) | 1128x191 | 150, 0, 828, 141 | HTML template | 5.9:1 ratio — very wide/short. Company logo overlaps bottom-left (~150px from left, ~50px from bottom). Use HTML template approach, NOT fal.ai pipeline |
| Facebook | 820x312 | 90, 0, 640, 312 | `21:9` → crop | Desktop 820x312, mobile 640x360 |
| Custom | user-defined | center 70% default | nearest AR | User provides width x height |

---

## The 4-Step Pipeline

| Step | Tool | Cost | Purpose |
|------|------|------|---------|
| 1. Base Scene | `generateWithNanoBanana()` | ~$0.10 | Wide panoramic banner scene |
| 2. Jay Photo | `generateImage()` (Flux LoRA) | ~$0.03 | Character-consistent Jay photo |
| 3. Composite | `editWithNanoBanana()` | ~$0.10 | Place Jay naturally in scene |
| 4. Crop + Safe Zone | `scripts/banner-safe-zone.mjs` | $0 | Exact dimensions + preview overlay |

**Total cost: ~$0.23/banner**

### Step 1: Base Scene (Nano Banana 2)

Generate a wide panoramic scene with space for Jay.

```typescript
import { generateWithNanoBanana } from '@/lib/fal'

const scenes = await generateWithNanoBanana({
  prompt: "wide panoramic banner scene, dark background #0D0D0D, subtle hot pink #ED0D51 accent lighting, person-shaped empty space in the right third of the frame, [SCENE], cinematic wide-angle composition",
  num_images: 2,
  aspect_ratio: "16:9",  // "21:9" for twitter/linkedin/facebook
  resolution: "2K",
})
```

**Aspect ratio by platform:**
- YouTube: `16:9` (native match — no extra cropping needed)
- Twitter/X, LinkedIn, Facebook: `21:9` (closest wide ratio, then crop to exact)
- Custom: use `nearestAR()` logic (see Custom Dimensions section)

**Prompt rules:**
- Start with "wide panoramic banner scene"
- Include brand colors: dark bg `#0D0D0D`, accent lighting `#ED0D51`
- Leave person-shaped empty space in the right third (avoids profile photo overlap zones)
- Describe atmosphere, lighting, and mood — let the scene breathe
- If text is needed: include max 3-5 words in LARGE CAPS in the prompt, positioned within the safe zone area
- NEVER include small text, URLs, or detailed typography in AI prompts

### Step 2: Jay Photo (Flux LoRA)

Generate a character-consistent Jay photo for compositing.

```typescript
import { generateImage, JAY_PRESETS } from '@/lib/fal'

const jayImages = await generateImage({
  prompt: JAY_PRESETS.professional.prompt,
  image_size: "square_hd",
  num_images: 1,
})
```

**Best presets for wide banners:**

| Preset | Best For | Pose |
|--------|----------|------|
| `professional` | Business, corporate banners | Standing confidently, button-down |
| `confident` | Personal brand, authority | Arms crossed, clean background |
| `cinematic` | Dramatic, moody banners | Rim lighting, dark bg, off-camera look |
| `pointing` | CTA-driven, engaging | Pointing at camera, motivational |
| `casual` | Lifestyle, creator banners | Relaxed, urban environment |
| `metaphor` | Conceptual, atmospheric | Full body, dramatic red accent light |

**Prompt rules:**
- ALWAYS start with trigger word `jay`
- Match energy to banner purpose (corporate → professional, personal brand → confident)
- Use neutral/clean background for easier compositing
- Always fitted black crew neck t-shirt

### Step 3: Composite (Nano Banana 2 Edit)

Place Jay naturally into the banner scene.

```typescript
import { editWithNanoBanana, uploadToFalStorage } from '@/lib/fal'

// Upload scene if it's a local file
const sceneUrl = await uploadToFalStorage(sceneBuffer, 'scene.png', 'image/png')
const jayUrl = jayImages[0].url  // Already a CDN URL from Step 2

const composited = await editWithNanoBanana({
  image_urls: [sceneUrl, jayUrl],
  prompt: `Place the person from the second reference image naturally into the right third of the banner scene from the first image. Match the lighting direction, color grading, and shadows. The person should be wearing a fitted black crew neck t-shirt. Natural integration — no artifacts, seams, or color mismatches. Do NOT generate any text or typography.`,
  num_images: 2,
  aspect_ratio: "16:9",  // Match Step 1
  resolution: "2K",
})
```

**Prompt rules:**
- Jay positioned in the right third (avoids profile photo overlap on most platforms)
- Match lighting between scene and Jay explicitly
- Include anti-artifact directive
- If the banner has text baked in from Step 1, mention: "Preserve existing text in the scene"

### Step 4: Crop + Safe Zone Preview

Use the `banner-safe-zone.mjs` script to crop and generate preview.

```bash
# With platform preset
node scripts/banner-safe-zone.mjs \
  --input output/banners/youtube/banner-composite.png \
  --platform youtube \
  --name my-banner

# With custom dimensions
node scripts/banner-safe-zone.mjs \
  --input output/banners/custom/banner-composite.png \
  --width 1920 --height 400 \
  --name hero-banner
```

**Outputs:**
- `{name}-final.png` — Cropped to exact platform dimensions. Production-ready, no overlay.
- `{name}-preview.png` — Same image with dashed hot-pink safe zone rectangle + dimmed outer area.

**Always open the preview in Preview.app** for user review before declaring done.

---

## Custom Dimensions

When the user provides arbitrary dimensions (e.g., 1920x400 website hero):

1. Calculate ratio: `width / height`
2. Map to nearest fal.ai AR:
   - ratio <= 1.5 → `4:3`
   - ratio <= 1.9 → `16:9`
   - ratio > 1.9 → `21:9`
3. Generate at 2K with that AR in Step 1
4. Crop to exact dimensions via `banner-safe-zone.mjs` in Step 4
5. Default safe zone: center 70% (overridable with `--safe-x/y/w/h`)

---

## Output Structure

```
output/banners/
  youtube/
    {name}-scene.png        # Step 1 (raw scene)
    {name}-jay.png          # Step 2 (Jay photo)
    {name}-composite.png    # Step 3 (before crop)
    {name}-final.png        # Step 4 (exact platform dims)
    {name}-preview.png      # Step 4 (with safe zone overlay)
  twitter/
  linkedin/
  facebook/
  custom/
```

Save intermediates at each step so the user can iterate on any stage.

---

## Style Rules

| Rule | Value |
|------|-------|
| Background | **Dark** (`#0D0D0D` → `#1A1A1A`) is the default — Jay photo blends cleanly, logos go white monochrome. **Light** (`#F5F5F0`) only when explicitly requested |
| Accent | Hot pink `#ED0D51` for headlines, accent lines, bubbles (never large bg blocks) |
| Jay's clothing | Fitted black crew neck t-shirt — always |
| Jay position | Right third of frame, bottom-anchored (avoids profile photo overlap) |
| Text in banner | HTML approach: unlimited precision. AI approach: max 3-5 words, LARGE CAPS |
| Fonts | **Dark banners:** Big Shoulders (headlines, uppercase) + Manrope (body). **Light banners:** Sora (headlines, weight 800) + Manrope (body). Always load via Google Fonts |
| Composition | Clean, structured, bold — banners are seen at small sizes |
| No clutter | Keep it simple — headline, photo, logo strip, CTA |
| Banned words | See CLAUDE.md banned AI words list |
| Banned fonts | Oswald, Impact, Bebas Neue, Anton, Inter, Roboto, Arial |
| Jay photo blending | Use CSS `mask-image` gradient on left edge to fade into background — no visible rectangular box edge |
| CTA visibility | CTA must contrast against its container — use accent bg (`#ED0D51`) on dark banners + globe icon. Never same color as banner bg |
| Logo consistency | ALL logos must be wordmarks (text-style), never square app icons. Center the strip to avoid profile photo overlap |
| Logo sizing | 26px height minimum, 100px max-width. Ensures visibility at small display sizes |
| Logo treatment (dark bg) | On dark backgrounds: `filter: brightness(0) invert(1); opacity: 0.6` — makes all logos white monochrome, eliminates background issues |
| Logo treatment (light bg) | On light backgrounds: `mix-blend-mode: multiply` for JPG logos with white backgrounds |
| Safe zone compliance | Logo strip must be inside safe zone (bottom >= 60px). Top-left elements (logo, handle) are safe from profile photo overlap and can be at the left edge. Headline should start at the left for maximum visual impact |
| Font loading | Use `document.fonts.ready` not `waitForTimeout` — reliable across all connection speeds |
| Real photo preferred | Use `jay-speaking-real.jpg` (real photo) over AI-generated when available |

---

## Approach Selection

Choose the right approach based on the banner's content:

| Approach | Best For | Script |
|----------|----------|--------|
| **HTML Template + Playwright** (dark) | Precise text, real logos, structured layouts, personal profiles | `scripts/generate-linkedin-banner.mjs` |
| **HTML Template + Playwright** (light) | Business pages, Skool-style clean layouts, Trustpilot social proof | `scripts/generate-linkedin-business-banner.mjs` |
| **Nano Banana + Composite** (4-Step Pipeline above) | Atmospheric scenes, cinematic mood, abstract backgrounds | Steps 1-4 above |

### When to use HTML Template:
- Banner has specific text/headlines that must render exactly
- Real company logos needed (not AI-generated)
- Structured layout with precise positioning (logo strips, CTAs, speech bubbles)
- Light backgrounds with professional/corporate feel
- LinkedIn, Twitter headers where text precision matters

### When to use Nano Banana Pipeline:
- Cinematic/atmospheric scenes
- Dark moody backgrounds with accent lighting
- YouTube banners where scene > text
- Creative/artistic banners where AI generation adds value

---

## HTML Template Approach (LinkedIn, Twitter, etc.)

Uses `scripts/generate-linkedin-banner.mjs` as the reference implementation.

**How it works:**
1. Read logo files from `public/brand/banner-logos/` → convert to base64 data URIs
2. Read Jay photo → base64 data URI
3. Build HTML with Google Fonts (Big Shoulders, Manrope), CSS absolute positioning
4. Write HTML to temp file
5. Playwright screenshot at native resolution (deviceScaleFactor: 1)
6. Verify dimensions via Sharp metadata
7. Run `banner-safe-zone.mjs` for safe zone preview
8. Open in Preview.app

**Available logo files** (`public/brand/banner-logos/`):
- `instantly.png` — wordmark, transparent PNG ✓
- `apollo.png` — wordmark, transparent PNG ✓
- `claude-logo.png` — "Claude" wordmark, transparent PNG ✓
- `n8n logo.svg` — wordmark SVG, transparent ✓
- `apify-logo.png` — wordmark, transparent PNG ✓
- `gohighlevel.png` — wordmark, transparent PNG ✓
- `youtube-logo.png` — play icon + "YouTube" wordmark, transparent PNG ✓

All logos have been processed to transparent PNGs (white backgrounds removed via ImageMagick). On light backgrounds use `mix-blend-mode: multiply` as a safety net. On dark backgrounds use `filter: brightness(0) invert(1); opacity: 0.6`.

**IMPORTANT — Logo Rules:**
- ALL logos must be **wordmarks** (text-based), never square icons or app icons
- JPGs with white backgrounds: apply `mix-blend-mode: multiply` on light banner backgrounds
- Center the logo strip (`justify-content: center`) — LinkedIn profile photo overlaps bottom-left
- YouTube: always use inline SVG wordmark, never the play button PNG

**Jay photos** (`public/photos/`):
- `jay-speaking-real.jpg` — real photo, speaking/pointing pose, 666x1000 (preferred)
- `jay-speaking.png` — AI-generated, white bg, 1024x1024 (fallback)

**Jay photo background removal** — Use fal.ai Nano Banana 2 Edit (NOT ImageMagick):
```typescript
import { editWithNanoBanana, uploadToFalStorage } from '@/lib/fal'

const jayUrl = await uploadToFalStorage(jayBuffer, 'jay.jpg', 'image/jpeg')
const result = await editWithNanoBanana({
  image_urls: [jayUrl],
  prompt: "Remove the background completely from this photo of a man. Replace the background with solid flat light gray color hex F8F8F8. Keep the person exactly as they are with all details preserved. The output should have a clean, uniform F8F8F8 background.",
  aspect_ratio: "3:4",
  resolution: "1K",
})
// Save to output/banners/linkedin-business/jay-banner-bg-removed.png
```
- NEVER use ImageMagick fuzz/opaque — creates white artifacts around skin tones
- Nano Banana 2 produces clean AI-powered background removal without artifacts
- Match the replacement bg color to the banner's bg color (e.g., `#F8F8F8` for light banners)

**LGJ brand logo**: `public/brand/lgj-logo.webp` — use for top-left branding with `mix-blend-mode: multiply` on light backgrounds

**Layout pattern:**
```
┌──────────────────────────────────────────────────────────────────────┐
│ accent line                                                          │
│ [LGJ Logo 54px]                                                     │
│ @handle          [Follow me ➜]                               [Jay   │
│                          Subheadline text                     photo  │
│                          BIG HEADLINE IN                     481px   │
│                          ACCENT COLOR (85px)                 right]  │
│                          with subtitle (28px)                        │
│ ┌────────────────────────────────────────────────────────────────────┤
│ │              [Logo1] [Logo2] ... [LogoN] [Consulti] [domain.com] │
│ └────────────────────────────────────────────────────────────────────┤
└──────────────────────────────────────────────────────────────────────┘

Final CSS positions (v7 — approved 2026-03-24):
  LGJ logo:     top: 24px, left: 36px, height: 54px
  Handle:       top: 82px, left: 38px
  Follow bubble: bottom: 250px, left: 286px
  Headline:     top: 28px, left: 480px, width: 640px, text-align: center
  Headline main: 85px Big Shoulders, sub: 25px Manrope, bottom: 28px Manrope
  Jay photo:    bottom: -60px, right: 80px, height: 481px
  Logo strip:   bottom: 0, height: 60px, padding-left: 300px
  Logos:        height: 33px, max-width: 125px, 8 logos incl. Consulti
  CTA:          bottom: 16px, right: 24px, z-index: 12
```

---

## LinkedIn Business Page Template (1128x191)

Reference script: `scripts/generate-linkedin-business-banner.mjs`

Very different from the personal LinkedIn banner — much wider and shorter (5.9:1 ratio). Company logo overlaps bottom-left on desktop.

### Design Spec

| Element | Value |
|---------|-------|
| Dimensions | 1128x191 |
| Background | Light `#F8F8F8` (Skool-inspired) |
| Headline font | **Sora** (Google Fonts) weight 800, ~28px, uppercase |
| Body font | Manrope weight 600, ~12px |
| Text color | Dark `#1A1A1A` headlines, muted `#666666` body |
| Accent | `#ED0D51` (underline bar + subtle bottom border) |
| Jay photo | Right edge, full height, CSS mask-fade on left edge |
| LGJ logo | Top-left, `lgj-logo.webp`, `mix-blend-mode: multiply` |
| Handle | `@leadgenjay` below logo, 10px Manrope |
| Logo strip | Bottom-left (`left: 13%`), 20px height, full-color transparent PNGs |
| Trustpilot | Bottom-right, 5 green CSS stars + "Excellent" / "Trustpilot" labels |
| Bottom border | Subtle gradient accent line `#ED0D51` at 40-60% opacity |

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│ [LGJ Logo]                                                          │
│ @leadgenjay        THE #1 TRUSTED NAME IN              ┌──────────┐│
│                    AI LEAD GENERATION                   │ Jay photo ││
│                    ──── (accent bar)                    │ mask-fade ││
│                    ▶ YouTube's Most Popular             │  on left  ││
│                      Cold Email Expert                  └──────────┘│
│ [Instantly][Apollo][Claude][n8n][Apify][GHL][YT]   ★★★★★ Excellent │
│ ════════════════ subtle accent bottom border ═══════════════════════│
└──────────────────────────────────────────────────────────────────────┘

Overlap zone: Company logo covers bottom-left (~150px from left, ~50px from bottom)
Logo strip starts at 13% from left to stay clear of overlap
Trustpilot at bottom: 8px, right: 210px (clear of Jay photo)
```

### Trustpilot Social Proof Element

CSS-only implementation (no external assets needed):
- 5 stars using CSS `clip-path: polygon(...)` with `background: #00B67A`
- "Excellent" label in Manrope 10px bold `#1A1A1A`
- "Trustpilot" sublabel in Manrope 8px `#666666`
- Position: `bottom: 8px; right: 210px` (right of logo strip, left of Jay photo)

### Key Differences from Personal LinkedIn Banner

| Aspect | Personal (1584x396) | Business (1128x191) |
|--------|---------------------|---------------------|
| Dimensions | 1584x396 | 1128x191 |
| Background | Dark `#0D0D0D` | Light `#F8F8F8` |
| Headline font | Big Shoulders 85px | Sora 28px |
| Logo treatment | Monochrome white (invert filter) | Full color + multiply |
| Jay photo | `jay-speaking-real.jpg` 481px | nb2-cleaned version, 200px wide |
| Top-left | LGJ logo + @handle | LGJ logo + @handle |
| Social proof | None | Trustpilot 5-star |
| Warm overlay | None | Subtle warm gradient `rgba(255,240,235,0.4)` |

---

## Workflow Summary

1. User triggers skill ("make me a YouTube banner" / "create a LinkedIn header")
2. Ask: **Which platform?** → present preset table or accept custom dimensions
3. Ask: **Describe the banner** → scene, mood, message
4. **Choose approach:** structured layout → HTML template, atmospheric → fal.ai pipeline
5. For HTML: generate Jay photo if needed → build template → screenshot → safe zone
6. For fal.ai: run Steps 1-4 (scene + Jay + composite + crop)
7. Open preview in Preview.app for review
8. If approved, `-final.png` is ready for upload

---

## Quality Checklist

Before delivering:
- [ ] Dimensions match platform spec exactly (`sips -g pixelWidth -g pixelHeight`)
- [ ] Safe zone preview shows key content (Jay's face, headline) inside dashed rectangle
- [ ] Jay photo bottom-anchored, right-aligned, no cropping of face
- [ ] Text is legible at actual platform display size
- [ ] Background matches chosen approach (light for HTML, dark for fal.ai)
- [ ] All logos in strip are recognizable at small size
- [ ] Opened in Preview.app for final visual check
- [ ] Both `-final.png` and `-preview.png` saved in output directory
