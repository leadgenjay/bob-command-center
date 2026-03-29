---
name: "gohighlevel-cli"
description: "CLI interface for GoHighLevel CRM/Marketing API — contacts, opportunities, calendars, workflows, conversations, emails, payments, forms, social media, locations, documents. v2: email reading, workflow creation via internal API."
category: "CRM & Marketing"
tools: ["ghl CLI", "GoHighLevel MCP (@drausal/gohighlevel-mcp)"]
---

# GoHighLevel CLI v2

Agent-usable CLI for the GoHighLevel CRM and Marketing API. Built with CLI-Anything framework (Click + REPL).

**v2 additions:** Email reading via conversations, workflow creation via internal API (`--experimental`), workflow enrollment, version routing fix.

## Quick Start

```bash
# Wrapper script (auto-activates venv)
ghl --help

# Or activate manually
source ~/Documents/Tech\ &\ Dev/highlevel-api-docs/agent-harness/.venv/bin/activate
ghl --help
```

## Requirements

- Python 3.13 (Homebrew)
- `GHL_API_KEY` env var — Private Integration Token (bearer) for public API
- `GHL_LOCATION_ID` env var (optional, defaults to `YB8rMdFShcHGcZGW87mA`)
- `GHL_FIREBASE_REFRESH_TOKEN` env var — required for `--experimental` commands (internal API)

## MCP Server

The GoHighLevel MCP server (`@drausal/gohighlevel-mcp`) provides direct API access:

```json
{
  "gohighlevel": {
    "command": "npx",
    "args": ["-y", "@drausal/gohighlevel-mcp"],
    "env": {
      "BEARER_TOKEN_BEARERAUTH": "${GHL_API_KEY}",
      "BEARER_TOKEN_BEARER": "${GHL_API_KEY}"
    }
  }
}
```

## Command Groups

| Group | Commands | Status |
|-------|----------|--------|
| `contacts` | list, get, create, update, delete, search, add-tag, remove-tag | LIVE |
| `opportunities` | list, get, create, update, delete, pipelines | LIVE |
| `calendars` | list, get, slots, appointments, book, groups | LIVE |
| `workflows` | list, enroll, remove | LIVE |
| `workflows` | create, create-step, create-n8n | EXPERIMENTAL |
| `conversations` | list (--type), get, messages (--type), get-email, send | LIVE |
| `emails` | list-campaigns | LIVE |
| `payments` | transactions, orders, invoices, create-invoice | LIVE |
| `locations` | get, search, tags, custom-fields, custom-values | LIVE |
| `forms` | list, submissions | NEEDS SCOPE |
| `social` | accounts, posts, create-post | NEEDS SCOPE |
| `documents` | list, send, templates, send-template | NEEDS SCOPE |

## Agent Usage

Always use `--json` for programmatic output:
```bash
ghl --json contacts list --limit 50
ghl --json contacts search "john"
ghl --json opportunities list --status open
ghl --json opportunities pipelines
ghl --json calendars list
ghl --json calendars slots <cal_id> --start 2026-03-25 --end 2026-03-30
ghl --json workflows list
ghl --json conversations list --limit 10
ghl --json conversations list --type Email --limit 10
ghl --json payments transactions --limit 20
ghl --json locations get
ghl --json locations tags
ghl --json locations custom-fields
```

## Key Patterns

### Email Reading (Conversation Filtering)

Emails in GHL flow through the Conversations API, not a separate inbox. Two-step workflow:

```bash
# Step 1: List email conversations
ghl --json conversations list --type Email --limit 10

# Step 2: Get messages from a conversation (email only)
ghl --json conversations messages <conversation_id> --type Email

# Step 3: Get full email details (subject, body HTML, headers, attachments)
ghl --json conversations get-email <email_message_id>
```

Available `--type` choices: `Email`, `SMS`, `WhatsApp`, `GMB`, `IG`, `FB`, `Live_Chat`, `Custom`

### Workflow Enrollment (Public API)

```bash
ghl workflows enroll --contact-id <contact_id> --workflow-id <workflow_id>
ghl workflows remove --contact-id <contact_id> --workflow-id <workflow_id>
```

### Workflow Creation (Experimental — Internal API)

Requires `--experimental` flag and `GHL_FIREBASE_REFRESH_TOKEN` env var.

```bash
ghl --experimental workflows create --name "My Campaign" --from-json campaign.json
ghl --experimental workflows create-n8n --name "Lead Notify" \
  --webhook-url "https://server.nextwave.io/webhook/lead-notify" \
  --tag "new-lead"
```

Step types: `email`, `sms`, `wait`, `tag`, `webhook`, `ai`

### Contact Management

```bash
ghl contacts create --email lead@co.com --first-name Jane --last-name Smith --tag "hot-lead"
ghl contacts add-tag <contact_id> hot-lead qualified
ghl contacts remove-tag <contact_id> cold
ghl contacts search "john doe"
```

### Opportunities Pipeline

```bash
ghl --json opportunities pipelines
ghl --json opportunities list --status open
ghl opportunities create --name "New Deal" --pipeline-id <id> --stage-id <id> --contact-id <id>
```

### Calendar Scheduling

```bash
ghl --json calendars list
ghl --json calendars slots <calendar_id> --start 2026-03-25 --end 2026-03-30
ghl calendars book --calendar-id <id> --contact-id <id> --slot-id <id> --start "2026-03-26T10:00:00" --end "2026-03-26T10:30:00"
```

## API Details

### Public API (stable)
- **Base URL:** `https://services.leadconnectorhq.com`
- **Auth:** Bearer token via `GHL_API_KEY` env var
- **Version Header:** Auto-routed by path

### Internal API (experimental)
- **Base URL:** `https://backend.leadconnectorhq.com`
- **Auth:** Firebase JWT via `token-id` header
- **Capabilities:** Workflow creation, step saving, trigger creation, tag creation

## Workflow Best Practices

1. **Always ask for trigger + goal** — before building any workflow
2. **Always add a Goal Event step at the end**
3. **Keep workflows simple** — don't add tracking tags between steps unless specifically requested
4. **Paragraph spacing** — use `<br/>` spacers for proper spacing in GHL emails
5. **Verify all links** — never include URLs without confirming they exist
6. **UTM tracking** — all email links must include `utm_source=ghl&utm_content=<email-identifier>`

## Known Limitations

- Public Workflows API is read-only (list only) — creation requires `--experimental`
- Documents/Proposals require templates (no create-from-scratch)
- Social media posting requires OAuth-connected accounts
- Forms, Social, and Documents scopes need enabling on the Private Integration Token
- Firebase refresh tokens can be revoked
- Internal API may change without notice
