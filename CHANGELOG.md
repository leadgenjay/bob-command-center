# Bob Command Center - Changelog

All notable changes to the Bob App will be documented in this file.

---

## [0.3.0] - 2026-03-29

### Added
- `/daily` route — renders DailyFocus component (previously dead link from dashboard)
- `/api/contacts` route — full CRUD for contacts via Supabase
- `/api/cron-jobs` route — full CRUD for cron jobs via Supabase
- `/api/skills` route — full CRUD for skills via Supabase
- `cron_jobs` and `skills` Supabase tables with RLS policies and seed data (26 cron jobs, 47 skills)
- shadcn AlertDialog and Skeleton components
- Dark mode toggle via `next-themes` (sun/moon icon in navigation)
- Global error boundary (`error.tsx`, `global-error.tsx`) with retry UI
- Skeleton loading states for dashboard stats, cron jobs, and skills pages
- QuickAddFab now available on all pages (mobile only)
- Desktop "More" dropdown in navigation for secondary pages (Cron Jobs, Resources, Skills, SOPs)
- Projects, Resources, and Cron Jobs links added to mobile MoreMenu

### Changed
- Contacts page completely redesigned with frosted-glass design system (removed all `bg-gray-*` hardcoded styles)
- Cron jobs page now fetches from Supabase API (hardcoded fallback on failure)
- Skills page now fetches from Supabase API (hardcoded fallback on failure)
- Commands page migrated from localStorage to `/api/commands` (Supabase)
- Tasks page: adding a task refreshes via React state instead of `window.location.reload()`
- Ideas page: adding an idea refreshes via React state instead of `window.location.reload()`
- Delete confirmations use AlertDialog instead of browser `confirm()`
- Desktop nav split into 6 primary items + 4 secondary in dropdown (prevents overflow)
- `bob-api` CLI now supports `contacts`, `cron-jobs`, and `skills` entities

---

## [Unreleased]

### Added
- YouTube script preview page (`/youtube-script.html`) - beautiful dark theme presentation of the Clawdbot YouTube script draft
- **YouTube Scriptwriting SOP** (sop-004) - Research-driven process using Apify to analyze top videos, extract transcripts/comments, write scripts, and publish to bob app
- **Travel Itinerary Management SOP** (sop-005) - Process for creating organized travel itineraries from email confirmations using TripIt

---

## [0.1.0] - 2026-01-26

### Added
- Initial Next.js 16 project setup
- Custom favicon and app icons (robot theme)
- PWA manifest configuration
- Basic project structure

---

## Notes

This changelog follows [Keep a Changelog](https://keepachangelog.com/) format.

**Categories:**
- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Features to be removed
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security updates
