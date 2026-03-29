---
name: ad-creative
version: 1.0.0
description: "Generate ad creative images using the fal.ai multi-step pipeline. This skill should be used when the user wants to create ad images, generate ad creatives, run the image generation pipeline, do a body swap or smart swap for ads, composite Jay into scenes, or produce campaign-ready visuals. Also use when the user mentions 'ad creative,' 'ad image,' 'generate ad,' 'creative generation,' 'nano banana,' 'smart swap,' 'body swap,' 'ad pipeline,' 'campaign creatives,' 'composite ad,' or 'ad variations.'"
category: "Image Generation"
tools: ["fal.ai (Nano Banana 2, Flux LoRA, Nano Banana 2 Edit)", "Sharp (text overlay)", "Claude Vision (quality analysis)"]
---

# Ad Creative Generator

Generate photorealistic ad creative images using fal.ai's multi-step pipeline. This skill owns the **image generation workflow** — for campaign strategy, targeting, and optimization, see `paid-ads`.

> **For graphic/text-based ads** (bold headlines, CTA buttons, comparison layouts, feature grids), use `ad-creative-graphic` instead. It uses React templates + Playwright screenshots at $0 cost.

## Before Starting

**Read these project files:**
- `lib/fal.ts` — Core API functions, `JAY_PRESETS`, types
- `lib/ads/concept-builder.ts` — `buildImagePrompt()`, `generateConcepts()`, `QUALITY_SUFFIX`
- `lib/brand.ts` — `buildBrandColorDirective()` for brand color injection
- `CLAUDE.md` — Brand identity, accent color `#ED0D51`, dark bg `#0D0D0D`

**Gather from user (ask if not provided):**

| Context | Why |
|---------|-----|
| Campaign/offer | What's being promoted? |
| Funnel stage(s) | ToF (awareness), MoF (consideration), BoF (conversion) |
| Format | 1:1 square (1024x1024), 4:5 portrait (1080x1350), 9:16 story |
| Jay in scene? | Determines if LoRA step is needed |
| Visual assets | Screenshots, product images, proof images to composite |
| Variations needed | How many per concept (default: 3) |

---

## The 5-Step Pipeline

The core generation pipeline uses three fal.ai models plus Sharp and Claude Vision:

| Step | Model | Function | Purpose |
|------|-------|----------|---------|
| 1. Base Scene | `nano-banana-2` | `generateWithNanoBanana()` | Generate photorealistic background/scene |
| 2. Character | `flux-lora` | `generateImage()` | Generate character-consistent Jay photo |
| 3. Composite | `nano-banana-2/edit` | `editWithNanoBanana()` | Swap Jay into scene + add visual elements |
| 4. Text Overlay | Sharp + SVG | `addAdHeadline()` | Add headline/subheadline bar overlay |
| 5. Quality Analysis | Claude Vision (Haiku 4.5) | `analyzeWithVision()` | Score, rank, flag issues |

### Step 1: Base Scene (Nano Banana 2)

Generate the photorealistic environment/scene without any person.

```typescript
import { generateWithNanoBanana } from '@/lib/fal'

const scenes = await generateWithNanoBanana({
  prompt: "A modern tech office interior, clean desk with large monitor, bright natural lighting, cinematic corporate style, 1:1 aspect ratio",
  num_images: 3,
  aspect_ratio: "1:1",   // "4:5" for portrait, "9:16" for story
  resolution: "1K",       // "2K" for hero creatives
})
```

**Prompt rules:**
- Scene-first, environment-forward descriptions
- Include lighting direction, color temperature, depth of field
- NEVER include text, typography, or UI elements in the prompt
- All devices (monitors, laptops, phones) must face the viewer directly — specify "screen facing directly toward the camera/viewer"
- Append quality suffix: `"photorealistic DSLR photography, 85mm lens, shallow depth of field, ultra-detailed, no text overlays, no graphic elements, editorial photograph quality"`
- See `references/prompt-templates.md` for scene archetypes

### Step 2: Character Reference (Flux LoRA)

Generate a character-consistent Jay photo to composite into the scene.

```typescript
import { generateImage, JAY_PRESETS } from '@/lib/fal'

// Use a preset
const jayImages = await generateImage({
  prompt: JAY_PRESETS.professional.prompt,
  image_size: "square_hd",
  num_images: 1,
})

// Or custom prompt — MUST lead with trigger word "jay"
const jayImages = await generateImage({
  prompt: "jay, professional business photo, standing confidently, arms crossed, subtle confident smile, wearing a fitted black crew neck t-shirt, bright natural lighting, clean background",
  image_size: "square_hd",
  num_images: 1,
})
```

**Prompt rules:**
- ALWAYS start with trigger word `jay`
- Match pose/energy to the ad's funnel stage emotion
- Use neutral background (`"neutral soft grey studio background"`) for cleaner compositing
- See `references/prompt-templates.md` for emotion-to-preset mapping

### Step 3: Composite (Nano Banana 2 Edit)

Swap Jay into the base scene and optionally add screen content or product images.

```typescript
import { editWithNanoBanana } from '@/lib/fal'

const composited = await editWithNanoBanana({
  image_urls: [sceneUrl, jayUrl],  // [base, reference]
  prompt: "Replace the generic person in the first image with the person from the second reference image. Keep the background, lighting, composition exactly the same. Seamless integration with no artifacts, seams, or color mismatches.",
  num_images: 3,
  aspect_ratio: "1:1",
  resolution: "1K",
})
```

**For compositing with a visual asset (3 images):**
```typescript
const composited = await editWithNanoBanana({
  image_urls: [sceneUrl, jayUrl, assetUrl],  // [base, jay reference, screen/proof image]
  prompt: "Replace the man in the base image with the person from reference image 1 (Jay). Take the dashboard UI from reference image 2 and map it onto the monitor screen. Maintain exact lighting and background.",
  num_images: 3,
  aspect_ratio: "1:1",
})
```

**Prompt rules:**
- Be explicit about what to KEEP and what to CHANGE
- Always include the anti-artifact directive: `"Do NOT generate any text, typography, or UI elements. Do NOT show the back of any device — only the screen side facing the viewer. No impossible geometry. Seamless integration with no artifacts, seams, or color mismatches."`
- Reference images by number (`reference image 1`, `reference image 2`)
- See `references/prompt-templates.md` for proven composite prompt patterns

### Step 4: Text Overlay (Sharp + SVG)

Add headline text bars post-generation using Sharp compositing. This replaces all attempts to generate text via AI models.

**Implementation:** See `scripts/generate-cold-email-ads.mjs` — `addAdHeadline()` function.

```javascript
import sharp from 'sharp'

// Solid #ED0D51 accent bar at top or bottom of image
// Bold white headline text (Big Shoulders Bold)
// Optional subheadline in smaller text
// Brightness-adaptive bar opacity
const finalPath = await addAdHeadline(imagePath, "HEADLINE TEXT", "Subheadline text", "top")
```

**Config per ad:**
| Stage | Headline | Subheadline | Position |
|-------|----------|-------------|----------|
| ToF | COLD EMAIL IS DEAD | Your spam folder proves it. | top |
| MoF | STOP BUILDING. START INSTALLING. | 50+ automations. Done for you. | bottom |
| BoF | 1,000+ LEADS ON AUTOPILOT | While you focus on closing. | top |

### Step 5: AI Quality Analysis (Claude Vision)

After all images are generated and text overlaid, score each with Claude Vision.

**Implementation:** See `scripts/generate-cold-email-ads.mjs` — `analyzeWithVision()` function.

- Model: `claude-haiku-4-5-20251001` (fast, cheap)
- Sends images as base64
- Scores: device_orientation, realism, ai_artifacts, compositing, text_readability
- Ranks variations as best / mid / worst
- Saves `analysis.json` per stage

---

## Pipeline Decision Tree

Not every ad needs all 3 steps. Choose the right pipeline:

| Pipeline | When to Use | Steps | Method |
|----------|-------------|-------|--------|
| **Full 3-step** | Jay in a generated scene with composited assets | 1 → 2 → 3 | Manual calls to `lib/fal.ts` |
| **Smart Swap** | Replace a person in an existing image with Jay | Vision → LoRA → Edit | `POST /api/ads/creatives/smart-swap` |
| **Scene Only** | Background/environment ad without a person | Step 1 only | `generateWithNanoBanana()` |
| **Edit Only** | Modify an existing image (add elements, change colors) | Step 3 only | `editWithNanoBanana()` or `POST /api/ads/creatives/nano-edit` |
| **LoRA Only** | Standalone Jay photo for manual design | Step 2 only | `generateImage()` |

### Smart Swap API Route

For replacing a person in an existing photo with Jay — the route handles Vision analysis automatically:

```typescript
// POST /api/ads/creatives/smart-swap
{
  base_image_url: "https://...",   // Image with person to replace
  description?: "...",              // Optional override (skips Vision analysis)
  campaign_id?: "...",              // Saves to ad_creatives table
  aspect_ratio?: "4:5",
  multi_person?: false              // true = swap ALL people in image
}
```

---

## Style Rules

| Rule | Specification |
|------|---------------|
| **Realism** | Editorial photography quality. NO AI-looking artifacts |
| **Expression** | Professional, serious, or focused. NO exaggerated expressions |
| **Jay's clothing** | Fitted black crew neck t-shirt in EVERY image |
| **Text banners** | Added post-generation via Sharp + SVG (Step 4) — NEVER in AI prompts |
| **Device screens** | Must face viewer directly — never at an angle, never showing back |
| **Anti-artifact** | All edit prompts include anti-artifact directive (see prompt-templates.md) |
| **Accent color** | `#ED0D51` (hot pink/red) for borders, highlights |
| **Dark background** | `#0D0D0D` or `#1A1A1A` |
| **No CTA on image** | CTA lives in ad platform (Meta Ads Manager) |
| **Format** | 1:1 (1024x1024) for feed, 4:5 (1080x1350) for max real estate |

See `references/style-guide.md` for full visual standards.

---

## Output & Review Workflow

1. **Generate images** using the appropriate pipeline (Steps 1-3)
2. **Add text overlays** using Sharp + SVG (Step 4)
3. **Run AI quality analysis** with Claude Vision (Step 5)
4. **Download to local review folder:**
   ```
   output/ads/tof/   # Top of Funnel
   output/ads/mof/   # Middle of Funnel
   output/ads/bof/   # Bottom of Funnel
   ```
5. **Naming convention:**
   - Raw composites: `{Stage}_{Concept}_{V#}.png` (e.g., `ToF_Cold_Email_Dead_V1.png`)
   - With text overlay: `{Stage}_{Concept}_{V#}_final.png` (e.g., `ToF_Cold_Email_Dead_V1_final.png`)
   - Quality analysis: `analysis.json` (per stage directory)
6. **Review analysis.json** for AI-scored rankings — prioritize "best" ranked variations
7. **User reviews locally** — iterate on prompt adjustments if needed
8. **Upload approved images** to Google Drive or ad platform

### Image Size Limits (Context Safety)

- All downloaded/scraped reference images: resize to max 1000px after saving: `sips --resampleHeightWidthMax 1000 <file>`
- NEVER use Read tool to view images — use `open` for Preview.app or `sips -g pixelWidth -g pixelHeight` for dimensions
- Generated output images (1024x1024) are already safe — no resize needed
- This prevents Claude Code context crashes from the 2000px many-image limit

### Downloading Images

```typescript
import { downloadImage } from '@/lib/fal'
import { writeFile } from 'fs/promises'

const buffer = await downloadImage(imageUrl)
await writeFile('output/ads/tof/ToF_Cold_Email_Dead_V1.png', buffer)
```

After downloading, always resize if over 1000px:
```bash
sips --resampleHeightWidthMax 1000 output/ads/tof/ToF_Cold_Email_Dead_V1.png
```

---

## Campaign Batch Workflow

For generating a full campaign's worth of creatives:

1. **Read the campaign brief** — check `docs/plans/` for existing briefs or use `references/campaign-template.md` to create one
2. **Map funnel stages to emotions:**
   - ToF (awareness) → `pain` emotion — stop the scroll, challenge assumptions
   - MoF (consideration) → `transition` emotion — showcase tools and "done for you"
   - BoF (conversion) → `outcome` emotion — highlight results and social proof
3. **Generate concepts** using `generateConcepts()` from `lib/ads/concept-builder.ts`
4. **For each concept:** run the appropriate pipeline with 3 variations
5. **Save results** to `output/ads/{tof,mof,bof}/` for review
6. **Organize approved images** into delivery structure (Google Drive, ad platform)

---

## Related Skills

| Skill | When to Use |
|-------|-------------|
| `ad-creative-graphic` | **Graphic/text-based ads** — bold headlines, CTA buttons, comparison layouts, feature grids via fal.ai Nano Banana 2 (~$0.07/image) |
| `paid-ads` | Campaign strategy, audience targeting, optimization, reporting |
| `canvas-design` | Post-generation overlays and graphic design work |
| `conversion-copywriting` | Ad copy for text fields (primary text, headline, description) |
| `social-proof-builder` | Source testimonials and proof screenshots for compositing |
