# Bob Command Center

Personal command center and task management app for Jay Feldman, powered by Bob AI.

**Live:** https://bob.nextwave.io

## Features

### Dashboard
- Quick stats: tasks, ideas, reminders, trips
- Activity feed with live sync (30-second refresh)
- Quick-add FAB with radial menu (6 options)

### Task Management
- Kanban-style task board (Todo, In Progress, Done)
- Drag and drop (desktop)
- Priority and notes support

### Ideas Board
- Capture and organize ideas
- Status tracking (new, exploring, building, shipped)
- Quick add from anywhere

### Reminders
- Daily tasks list
- Recurring reminders support
- iMessage integration via Clawdbot

### Trips
- Trip planning with itineraries
- Packing lists
- Notes per trip

### Knowledge Base (NEW)
- Semantic search across Team FAQs and LGJ Updates
- API: `/api/knowledge` - POST with `{ query: "search term" }`
- Slack integration: `/api/slack/ask`

### Other Features
- Content pipeline tracking
- Decisions log
- SOPs/Documents viewer
- Preferences

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL + pgvector)
- **Styling:** TailwindCSS + shadcn/ui components
- **Auth:** Supabase Auth (optional)
- **Hosting:** Vercel

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key (for API routes)
OPENAI_API_KEY=your-openai-key (for embeddings)
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tasks` | GET/POST/PUT | Task CRUD |
| `/api/ideas` | GET/POST/PUT | Ideas CRUD |
| `/api/reminders` | GET/POST/PUT | Reminders CRUD |
| `/api/trips` | GET/POST/PUT | Trips CRUD |
| `/api/decisions` | GET/POST | Decisions log |
| `/api/activity` | GET | Activity feed |
| `/api/knowledge` | POST | Knowledge base search |
| `/api/slack/ask` | POST | Slack slash command |

## Deployment

Deployed automatically via Vercel on push to main branch.

```bash
# Manual deploy
vercel --prod
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── tasks/          # Task management
│   ├── ideas/          # Ideas board
│   ├── reminders/      # Reminders
│   ├── trips/          # Trip planning
│   └── ...
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── AddTaskSheet   # Quick add modals
│   └── ...
└── lib/               # Utilities
    └── supabase.ts    # Supabase client
```

---

*Built with ❤️ by Bob AI for Jay Feldman*
