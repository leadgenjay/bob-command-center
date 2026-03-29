---
name: carousel-post
description: Generate Instagram carousel posts as AI images via fal.ai (Nano Banana 2 + Flux LoRA). Creates polished, viral-style carousels with Jay photos, light backgrounds, real screenshots, and brand-consistent typography. This skill should be used when the user asks to create an Instagram carousel, carousel post, slide deck for Instagram, or multi-slide social post.
category: "Image Generation"
tools: ["fal.ai (Nano Banana 2, Flux LoRA, Nano Banana 2 Edit)", "Playwright (screenshots)"]
---

# Carousel Post Generator

Generate Instagram carousel posts as AI images via fal.ai (Nano Banana 2 + Flux LoRA). Creates polished, viral-style carousels with Jay photos, light backgrounds, real screenshots, and brand-consistent typography.

## Trigger Conditions

Use this skill when the user mentions:
- "carousel", "Instagram carousel", "carousel post"
- "slides for Instagram", "slide deck", "multi-slide"
- "create slides", "make a carousel"
- "swipe post", "Instagram swipe"

---

## Workflow

### Step 1: Gather Context

Ask the user for:
- **Topic/angle** for the carousel
- **Target audience** (cold emailers, agency owners, B2B founders, etc.)
- **Number of slides** (8-10 default — highest engagement)
- **Format**: Organic (3:4, 1080x1440) or Boosted/paid (4:5, 1080x1350)
- **Carousel type**: listicle, how-to, comparison, myth-busting, case-study, framework
- **Cover photo style**: Choose from JAY_PRESETS (pointing, headshot, cinematic, etc.) or custom
- **CTA**: Ask what the call-to-action should be. Prefer comment trigger word (e.g., "Comment LEADS to get the playbook"). Fall back to "Follow @leadgen..." if no trigger fits.

If the user provides a topic directly, infer reasonable defaults and confirm before generating.

**IMPORTANT:** Always ask about the CTA if not provided in the brief.

### Step 2: Write Slide Copy

Write all slide copy BEFORE generating any images.

**Rules:**
- Cover: Bold hook headline (max 8 words), sub-hook, "SWIPE -->"
- Inner slides: One key point per slide, max 15 words per slide
- **Be specific about tactics** — mention exact prompts, tool names, specific steps. Not "use AI" but "use this exact prompt in Claude"
- **Give real value** — each slide should teach something actionable, not just state a concept
- CTA slide: Comment trigger word CTA (preferred) + text overlay. Never just a photo.
- No slide counters (no "2/10", "3/10") — only swipe arrows/indicators if needed
- Check against banned words list (delve, tapestry, realm, landscape, ever-evolving, cutting-edge, robust, transformative, pivotal, vibrant, crucial, compelling, seamless, groundbreaking, leverage, harness, embark, navigate, unveil, facilitate, synergy, game-changer, unlock, unleash, elevate, utilize, endeavour, multifaceted)
- No banned phrases ("In today's ever-evolving...", "Unlock the power of", "Master the art of", etc.)

Present all slide copy to the user for approval before generating images.

### Step 3: Gather Reference Screenshots

Before generating slides, capture real screenshots for any tools, dashboards, or UIs mentioned in the content.

**Screenshot capture methods (in priority order):**
1. Check `output/carousel/references/` for existing screenshots
2. Capture via Playwright (`npx playwright screenshot <url>`)
3. Check `public/ads/assets/` for existing product screenshots
4. Ask the user to provide

**What needs screenshots:**
- Any named tool (bolt.new, Instantly, Claude, ChatGPT, etc.)
- Any dashboard or analytics view
- Any email copy or campaign
- Any results/proof (calendars, inboxes, Stripe, etc.)

Save all reference screenshots to `output/carousel/references/` resized to max 1000px (`sips --resampleHeightWidthMax 1000`).

### Step 4: Generate Cover Slide

Two fal.ai calls:

**A) Generate Jay photo (Flux LoRA):**
```typescript
import { generateImage, JAY_PRESETS } from '@/lib/fal'

const jayImages = await generateImage({
  prompt: JAY_PRESETS.pointing.prompt,  // or user-chosen preset
  image_size: "square_hd",
  num_images: 1,
})
```

**B) Composite cover slide (Nano Banana 2 Edit):**
```typescript
import { editWithNanoBanana, uploadToFalStorage } from '@/lib/fal'

const cover = await editWithNanoBanana({
  image_urls: [jayImages[0].url],
  prompt: `[COVER PROMPT — see Prompt Templates below]`,
  num_images: 2,
  aspect_ratio: "3:4",   // or "4:5" for boosted
  resolution: "1K",
})
```

### Step 5: Generate Inner Slides

Each inner slide via `editWithNanoBanana()` with reference screenshots:

```typescript
import { editWithNanoBanana, uploadToFalStorage } from '@/lib/fal'

// Upload reference screenshot to fal storage
const refUrl = await uploadToFalStorage('output/carousel/references/screenshot.png')

const slide = await editWithNanoBanana({
  image_urls: [refUrl],
  prompt: `[INNER SLIDE PROMPT — see Prompt Templates below]`,
  num_images: 2,
  aspect_ratio: "3:4",
  resolution: "1K",
})
```

For slides without specific reference screenshots, use `generateWithNanoBanana()`:
```typescript
import { generateWithNanoBanana } from '@/lib/fal'

const slide = await generateWithNanoBanana({
  prompt: `[INNER SLIDE PROMPT]`,
  num_images: 2,
  aspect_ratio: "3:4",
  resolution: "1K",
})
```

**Visual consistency:** After generating slide 2, pass the chosen slide 2 URL as `image_urls` reference for slide 3 and beyond.

### Step 6: Generate CTA/Final Slide

```typescript
const ctaSlide = await editWithNanoBanana({
  image_urls: [jayPhotoUrl],
  prompt: `[CTA PROMPT — see Prompt Templates below]`,
  num_images: 2,
  aspect_ratio: "3:4",
  resolution: "1K",
})
```

### Step 7: Download & Review

```typescript
import { downloadImage } from '@/lib/fal'
import { writeFile, mkdir } from 'fs/promises'

await mkdir('output/carousel', { recursive: true })

for (const [i, slide] of slides.entries()) {
  const buffer = await downloadImage(slide.url)
  await writeFile(`output/carousel/slide-${String(i + 1).padStart(2, '0')}.png`, buffer)
}
```

Then:
1. Open all slides in Preview.app (`open -a Preview output/carousel/`)
2. Check against Quality Checklist below
3. Regenerate any slides that fail checks

---

## Prompt Templates

### CRITICAL PROMPT RULES

These rules apply to ALL prompts:

1. **NEVER include pixel values as visible text** — no "180px", "50px", "120px" rendered on the slide. Safe zones are invisible layout constraints only. Describe spacing as "generous margins" or "comfortable padding" in prompts.
2. **NEVER include icons** — no flat icons, no emoji-style graphics, no abstract symbols, no lightning bolts, no envelope icons, no chart icons. Every visual must be a realistic screenshot or photo.
3. **NEVER include slide counters** — no "2/10", "3/10", "7/10". No numbering of total slides.
4. **Light backgrounds ALWAYS** — white (#FFFFFF), off-white (#F8F8F8), or light gray (#F5F5F5). Never dark #0D0D0D.
5. **Single consistent background** — no two-tone backgrounds, no card-on-background layering.
6. **All images must be realistic screenshots** — real tool UIs, real dashboards, real spreadsheets, real email clients. No illustrations, no diagrams, no flat graphics.
7. **Images must be LARGE** — fill 40-60% of the slide area, legible on small mobile screens.
8. **Images must match content exactly** — if the slide says "micro-app", show a real micro-app screenshot, not a generic dashboard.

### Cover Slide Prompt
```
Professional Instagram carousel cover slide.
Clean white background (#FFFFFF).
Typography: headline in Big Shoulders Black (bold condensed uppercase), body in Manrope.
Large bold headline '[HEADLINE]' in black uppercase text filling the top third of the frame. The word '[ACCENT_WORD]' is in hot pink #ED0D51.
Sub-hook '[SUB_HOOK]' below headline in dark gray Manrope, smaller size.
[VISUAL_DESCRIPTION — must be a real screenshot or photo, filling 40-50% of the slide. E.g., "A large realistic screenshot of a Google Sheets spreadsheet packed with lead data, showing on a laptop screen"]
This reference image of a person is composited at the bottom, filling the lower 40% of the frame, centered.
Small brand text '@leadgen' bottom-left in medium gray Manrope.
Hot pink 'SWIPE -->' text bottom-right.
Clean editorial design, no gradients, no decorative filler, no icons, no numbered badges.
Generous margins on all sides. No pixel values visible.
```

### Inner Slide Prompt (Screenshot-Based)
```
Professional Instagram carousel slide, inner content slide.
Clean white background (#FFFFFF).
Typography: headline in Big Shoulders Black (bold condensed uppercase), body in Manrope.
Step number '[NUMBER]' in a hot pink (#ED0D51) circle, top-left, bold.
Bold headline '[SLIDE_TITLE]' in black uppercase Big Shoulders Black, filling top 20% of the frame.
Below, [CONTENT_DESCRIPTION — keep to 1-2 short lines max].
[SCREENSHOT_DESCRIPTION — "This reference screenshot is displayed large, filling 40-60% of the slide. It shows [exact description of what the screenshot contains]." Must be a real tool UI, dashboard, or product screenshot. Never an icon or illustration.]
Body text in dark gray Manrope, high contrast against white background.
Small brand text '@leadgen' bottom-left in medium gray.
Clean editorial design. No icons. No slide counters. No pixel values visible. All text legible at mobile size.
Generous margins on all sides.
```

### Inner Slide Prompt (Text-Heavy — no visual)
```
Professional Instagram carousel slide, inner content slide.
Clean white background (#FFFFFF).
Typography: headline in Big Shoulders Black (bold condensed uppercase), body in Manrope.
Step number '[NUMBER]' in a hot pink (#ED0D51) circle, top-left, bold.
Bold headline '[SLIDE_TITLE]' in black uppercase Big Shoulders Black, filling top 25% of the frame.
Below, [CONTENT — e.g., "3 bullet points with hot pink dash markers: item1, item2, item3"].
Body text in dark gray Manrope, large readable size, high contrast.
Small brand text '@leadgen' bottom-left in medium gray.
Clean editorial design. No icons. No illustrations. No slide counters. No pixel values visible.
Generous margins on all sides.
```

### CTA/Final Slide Prompt
```
Professional Instagram carousel final slide, call-to-action.
Clean white background (#FFFFFF), slightly warm off-white tone.
Circular photo of the creator (reference image) centered in the upper portion, large, with hot pink (#ED0D51) border ring.
Below the photo: '[CTA_TEXT]' in large black Big Shoulders Black uppercase. One keyword in hot pink #ED0D51.
[E.g., "COMMENT 'LEADS' BELOW" with LEADS in hot pink, or "FOLLOW @LEADGEN FOR MORE" with FOLLOW in hot pink]
Subtext: '[CTA_SUBTEXT]' in small gray Manrope below.
Optional: hot pink pill-shaped button '[BUTTON_TEXT]' below subtext.
Clean, centered layout. No clutter. No icons. Generous margins.
```

---

## Carousel Types

| Type | Best For | Cover Style | Inner Slide Style |
|------|----------|-------------|-------------------|
| `listicle` | "X things you need to know" | Giant number + headline + Jay photo | Numbered steps with screenshots |
| `how-to` | Step-by-step guides | Question headline + Jay photo | Sequential steps with real tool screenshots |
| `comparison` | Old way vs new way | Split comparison headline | Side-by-side with real screenshots |
| `myth-busting` | Controversial takes | Bold statement + Jay photo | Myth -> Truth with proof screenshots |
| `case-study` | Social proof / results | Metric headline + Jay photo | Real dashboard/analytics screenshots |
| `framework` | Teaching a system | Framework name + Jay photo | Screenshots showing each step in practice |

---

## Visual Rules (Enforced)

| Rule | Value |
|------|-------|
| **Background** | Light — white `#FFFFFF` or off-white `#F8F8F8`. NEVER dark `#0D0D0D` |
| **Background consistency** | Single color per slide. No two-tone, no card-on-background layering |
| **Accent** | `#ED0D51` (hot pink) — accent only, never full background |
| **Headline font** | Big Shoulders Black, uppercase, 50pt+ |
| **Body font** | Manrope, 14pt+ |
| **Text color** | Black or dark gray on light background |
| **Max words/slide** | 15 |
| **Cover photo** | Always Flux LoRA Jay photo |
| **Aspect ratio** | 3:4 organic (default) / 4:5 boosted |
| **Resolution** | 1K (default). Only use 2K if explicitly requested |
| **Slide count** | 8-10 optimal |
| **Accent restraint** | Hot pink on 1-2 words max per slide |
| **Brand handle** | @leadgen bottom-left on every slide |

### BANNED Elements

| Element | Why |
|---------|-----|
| **Icons** | No flat icons, emoji-style graphics, or abstract symbols. Ever. |
| **Illustrations/diagrams** | No flowcharts, no conceptual graphics. Real screenshots only. |
| **Slide counters** | No "2/10", "3/10". Only swipe arrows if needed. |
| **Dimension markers** | No "180px", "50px" visible on slides. Safe zones are invisible. |
| **Dark backgrounds** | No #0D0D0D. Light backgrounds always for carousels. |
| **Two-tone backgrounds** | No card-on-background layering. Single bg color. |
| **Generic dashboards** | If slide says "micro-app", show a micro-app, not a random dashboard |
| **Styled text bars for stats** | Use real dashboard screenshots for metrics |

### Image Rules

1. **ALL visuals must be realistic screenshots** — real tool UIs, real dashboards, real spreadsheets, real email clients
2. **Images must match slide content exactly** — if saying "micro-app", show a real micro-app (e.g., ROI calculator)
3. **Images must be LARGE** — fill 40-60% of the slide, legible on small mobile screens
4. **Stats/metrics must use real dashboard screenshots** — Instantly dashboard, Google Sheets, email analytics
5. **Results slides need real-looking screenshots** — packed Google Calendar, full inbox, Stripe dashboard
6. **Use real screenshots for mentioned tools** — bolt.new, Claude Code, Instantly. Capture via Playwright if not available.
7. **When showing email copy** — screenshot the actual email, don't describe it with icons

### Logo Rules (CRITICAL)

1. **AI CANNOT render real logos accurately** — Nano Banana/Gemini will hallucinate wrong logos. NEVER ask AI to generate a company logo.
2. **Use real logo files ONLY** — check `public/brand/`, `public/ads/assets/`, `output/carousel/references/` for existing logos. If not found, download via Playwright or ask the user.
3. **If no real logo file exists, use TEXT ONLY** — just write the company name in bold text. No logo placeholder. No generated icon.
4. **Never duplicate the name** — if using a logo that contains the company name (e.g., "bolt." logo), do NOT also write the company name as separate text next to it. One or the other.
5. **No generic icon substitutes** — no clock icons for "time", no lightning bolts for "bolt.new", no envelope for "email". If you can't show the real thing, use text only.
6. **Before generating any slide with company names:** Check the references folder for real logos. If missing, capture them via Playwright first or use plain text.

### Content Rules

1. **Be specific about tactics** — mention exact prompts, tool names, specific steps
2. **Give real value** — each slide should teach something actionable, not just state a concept
3. **No filler slides** — every slide earns its spot with concrete information

### CTA Rules

1. **CTA slide must always have text overlay** — never just a photo
2. **Prefer comment trigger word CTA** — e.g., "Comment LEADS to get the playbook"
3. **Fall back to "Follow @leadgen..."** if no comment trigger fits the topic
4. **Always ask about CTA** if not provided in the brief

### POV Cover Rule

When the headline starts with "POV:", do NOT show the creator's face on the cover. POV means the viewer IS the subject. Show what the viewer would see (laptop screen, dashboard, inbox, spreadsheet) instead. The cover visual should reinforce the first-person perspective — e.g., a MacBook showing Google Sheets full of leads, not a photo of Jay.

### Identity Preservation Rule

NEVER pass a Flux LoRA photo to Nano Banana expecting identity preservation. Nano Banana treats reference images as style/composition guides only — it WILL generate a different person. For CTA slides needing the creator's face:
1. Generate a dedicated Flux LoRA headshot specifically for the CTA
2. Either use the Flux LoRA output directly, or composite it programmatically via Sharp
3. If Nano Banana must be used (for text overlay), accept that the face may not match — prefer option 1 or 2

**Sharp compositing guardrails:**
- Generate the CTA background with NO placeholder circle — leave the area blank/white where the headshot will go
- Composite the headshot at the FULL intended circle size (not smaller)
- The headshot must fill the entire circle edge-to-edge with zero gap
- After compositing, visually verify via `open -a Preview` that the headshot fills its circle

### Post-Compositing Verification Rule

After any programmatic compositing (Sharp/Canvas/ImageMagick), immediately verify the result by viewing the output image. Check that:
1. The composited photo fills its intended area (no tiny photo in large frame)
2. No placeholder shapes (gray circles, colored boxes) are visible behind the photo
3. Border rings align tightly with the photo edges
4. The overall composition looks intentional, not accidental

If ANY of these fail, fix the compositing parameters and re-run before presenting to the user.

### Dashboard Number Consistency Rule

When a slide headline claims a specific metric (e.g., "1,000 EMAILS"), the dashboard screenshot on that slide MUST show consistent numbers. Add explicit number targets to the Nano Banana prompt (e.g., "showing 1,000+ total sent, 4.1% reply rate"). Never let AI hallucinate random numbers that contradict the headline.

### Output Cleanup Rule

Scripts must clean old slide files from `output/carousel/` before generating a new set. Delete previous `slide-*.png` and `jay-*.png` files at the start of generation (except when using `--slide N` to regenerate a single slide). This prevents stale slides from a previous run (e.g., slide-09/10 from a 10-slide run) cluttering the output when a shorter carousel is generated.

---

## fal.ai Functions Reference

| Function | Model | Use Case |
|----------|-------|----------|
| `generateImage()` | Flux LoRA | Jay photos (character-consistent via LoRA) |
| `generateWithNanoBanana()` | Nano Banana 2 | Text-to-image slides (no references needed) |
| `editWithNanoBanana()` | Nano Banana 2 Edit | Composite slides (with reference images/screenshots) |
| `uploadToFalStorage()` | Storage API | Upload local assets as fal.ai URLs |
| `downloadImage()` | -- | Download generated images to local disk |

All functions imported from `@/lib/fal` (or `../lib/fal.ts` for scripts).

---

## Quality Checklist

Before presenting the carousel as complete, verify ALL of these:

- [ ] **Light background** on every slide (white/off-white, never dark)
- [ ] **Single background color** per slide (no two-tone layering)
- [ ] Cover slide has bold hook headline + Jay Flux LoRA photo + "SWIPE -->"
- [ ] All text uses 50pt+ headlines, 14pt+ body
- [ ] Hot pink accent on 1-2 words max per slide (never full background)
- [ ] Max 15 words per slide
- [ ] **No icons visible** — zero flat icons, emoji graphics, or abstract symbols
- [ ] **No dimension markers** — no "180px", "50px" text visible anywhere
- [ ] **No slide counters** — no "2/10", "3/10" on any slide
- [ ] **All images are real screenshots** — actual tool UIs, dashboards, products
- [ ] **Images are LARGE** — fill 40-60% of slide, legible at mobile size
- [ ] **Images match content** — slide about X shows a screenshot of X
- [ ] **CTA slide has text overlay** with comment trigger or follow CTA
- [ ] No banned AI words from CLAUDE.md
- [ ] Readable when squinting on small dim screen
- [ ] Consistent visual style across all slides
- [ ] Resolution is 1K (not 2K unless explicitly requested)
- [ ] All slides saved to `output/carousel/` as `slide-01.png`, `slide-02.png`, etc.
- [ ] Opened in Preview.app and visually confirmed

---

## Output

Save all generated slides to:
```
output/carousel/slide-01.png   (cover)
output/carousel/slide-02.png   (first content slide)
...
output/carousel/slide-NN.png   (CTA slide)
```

Reference screenshots saved to:
```
output/carousel/references/    (Playwright captures, resized to max 1000px)
```

Open in Preview.app for review: `open -a Preview output/carousel/`

**Cost estimate:** ~$0.07/slide x 10 slides = ~$0.70 per carousel
