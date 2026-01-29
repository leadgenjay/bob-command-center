export interface SOP {
  id: string;
  title: string;
  description: string;
  category: string;
  lastUpdated: string;
  version: string;
  purpose: string;
  scope: string;
  prerequisites: string[];
  steps: {
    title: string;
    description: string;
    checklist: string[];
  }[];
  expectedOutcomes: string[];
  troubleshooting: {
    issue: string;
    solution: string;
  }[];
  flowchart?: string;
}

export const sopDatabase: Record<string, SOP> = {
  'sop-001': {
    id: 'sop-001',
    title: 'Creating Standard Operating Procedures',
    description: 'How to create, format, and maintain SOPs for the team',
    category: 'Operations',
    lastUpdated: '2026-01-26',
    version: '1.0',
    purpose: 'Establish a consistent process for creating clear, actionable SOPs that the team can follow. This ensures knowledge is documented, processes are repeatable, and new team members can onboard quickly.',
    scope: 'This SOP applies to Jay and all team members who need to document processes. Bob (AI assistant) will facilitate the SOP creation process.',
    prerequisites: [
      'Access to the Bob Command Center',
      'Clear understanding of the process to be documented',
      'Time to answer clarifying questions from Bob',
    ],
    steps: [
      {
        title: 'Initiate SOP Request',
        description: 'Tell Bob you want to create a new SOP and provide the topic or process name.',
        checklist: [
          'Identify the process that needs documentation',
          'Consider who will use this SOP',
          'Have examples or edge cases in mind',
        ],
      },
      {
        title: 'Answer Discovery Questions',
        description: 'Bob will ask clarifying questions to understand the full scope of the process.',
        checklist: [
          'Describe the goal/outcome of the process',
          'List the main steps at a high level',
          'Identify any prerequisites or dependencies',
          'Note any common mistakes or pitfalls',
        ],
      },
      {
        title: 'Review Draft Structure',
        description: 'Bob will propose an SOP structure with sections. Confirm or adjust.',
        checklist: [
          'Verify all major steps are captured',
          'Check that the order makes sense',
          'Add any missing edge cases',
        ],
      },
      {
        title: 'Expand Each Section',
        description: 'Work through each section to add detail, checklists, and decision points.',
        checklist: [
          'Add specific sub-steps where needed',
          'Include checklist items for verification',
          'Add flowchart decision points if applicable',
        ],
      },
      {
        title: 'Add Troubleshooting',
        description: 'Document common issues and their solutions.',
        checklist: [
          'List common problems that occur',
          'Provide solutions or workarounds',
          'Include escalation paths if needed',
        ],
      },
      {
        title: 'Review Final Draft',
        description: 'Bob will provide a link to review the complete SOP.',
        checklist: [
          'Read through the entire SOP',
          'Test the steps mentally or practically',
          'Check for clarity and completeness',
        ],
      },
      {
        title: 'Approve and Publish',
        description: 'Confirm the SOP is ready. It goes live immediately.',
        checklist: [
          'Give final approval to Bob',
          'SOP is added to the Command Center',
          'Team can access it immediately',
        ],
      },
      {
        title: 'Maintain Over Time',
        description: 'Update the SOP when processes change. Tell Bob to update it.',
        checklist: [
          'Review SOPs periodically for accuracy',
          'Update when processes change',
          'Version is incremented automatically',
        ],
      },
    ],
    expectedOutcomes: [
      'A clear, actionable SOP in checklist/flowchart format',
      'Documented in the Bob Command Center for easy access',
      'Team members can follow the process independently',
    ],
    troubleshooting: [
      {
        issue: 'Process is too complex for a single SOP',
        solution: 'Break it into multiple related SOPs and link them together.',
      },
      {
        issue: 'Steps vary based on situation',
        solution: 'Use decision points (flowchart style) to branch the process.',
      },
      {
        issue: 'SOP becomes outdated',
        solution: 'Tell Bob to update the SOP. Only the latest version is kept.',
      },
    ],
    flowchart: `
┌─────────────────────┐
│  Request New SOP    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Bob Asks Questions │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Review Structure   │
│  Looks good?        │
└─────────┬───────────┘
          │
     ┌────┴────┐
     │         │
    Yes        No
     │         │
     ▼         ▼
┌─────────┐  ┌─────────────┐
│ Expand  │  │ Adjust with │
│ Details │  │ Bob         │
└────┬────┘  └──────┬──────┘
     │              │
     └──────┬───────┘
            │
            ▼
┌─────────────────────┐
│  Review Final Draft │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Approve & Publish  │
└─────────────────────┘
`,
  },
  'sop-002': {
    id: 'sop-002',
    title: 'Calendar Management',
    description: "Daily calendar review, meeting confirmations, and scheduling for Jay",
    category: 'Operations',
    lastUpdated: '2026-01-26',
    version: '1.0',
    purpose: "Ensure Jay's calendar is organized, all attendees are confirmed, and meetings are scheduled according to his preferences. Bob handles daily reviews and client scheduling.",
    scope: "This SOP applies to Bob (AI assistant) managing Jay's Google Calendar (jay@leadgenjay.com). Jay and team members may be involved in confirmations and approvals.",
    prerequisites: [
      'Bob has access to jay@leadgenjay.com via gog skill',
      'Jay is reachable via iMessage for confirmations',
      'Client contact information available for outreach',
    ],
    steps: [
      {
        title: 'Daily Morning Review (8 AM)',
        description: "Bob reviews today's calendar and sends Jay a summary via iMessage.",
        checklist: [
          "Pull all meetings for today from Jay's calendar",
          'Check RSVP status for each attendee',
          'Identify unconfirmed attendees',
          'Identify rejected attendees',
          'Flag meetings with 2+ rejections (unless large meeting)',
          'Send summary to Jay via iMessage',
        ],
      },
      {
        title: 'Handle Unconfirmed Attendees',
        description: 'Reach out to attendees who have not confirmed, especially for same-day meetings.',
        checklist: [
          'For meetings today: send email AND text reminder',
          'For meetings later: send email reminder',
          'Note the meeting details in outreach',
          'Request confirmation or let us know if rescheduling needed',
        ],
      },
      {
        title: 'Handle Rejected Meetings',
        description: 'When attendees reject, confirm with Jay before taking action.',
        checklist: [
          'Notify Jay of the rejection',
          'Ask Jay if meeting should be deleted or rescheduled',
          'Do NOT auto-delete or auto-reschedule',
          'For group meetings: keep if 1+ confirmed, flag if 2+ rejected',
        ],
      },
      {
        title: 'Scheduling New Meetings (When CC\'d or Asked)',
        description: 'When Jay CCs Bob on an email or asks to book someone, handle scheduling.',
        checklist: [
          'Review Jay\'s calendar for available slots',
          'Apply scheduling preferences (see below)',
          'Draft email with 2-3 time options',
          'Send draft to Jay for approval (until autopilot mode)',
          'Once approved, send to client',
          'When client confirms, add to calendar with description',
          'Invite the client to the meeting',
        ],
      },
      {
        title: 'Apply Scheduling Preferences',
        description: 'Follow these rules when proposing meeting times.',
        checklist: [
          'No calls before 10 AM',
          'Calls only on Monday OR with Jay\'s approval',
          'Batch calls together whenever possible',
          'Default meeting length: 30 minutes',
          '10-minute buffer between meetings',
          'Times must be 24+ hours in the future',
          'Use Jay\'s calendar links only, never client\'s link without permission',
          'Every meeting must have a description of what it\'s about',
        ],
      },
      {
        title: 'Finding Suitable Times with Clients',
        description: 'When Jay says "find a time", negotiate with the client.',
        checklist: [
          'Check Jay\'s availability for the next 2 weeks',
          'Propose 2-3 options that fit preferences',
          'If client can\'t do those times, ask for their availability',
          'Cross-reference with Jay\'s calendar',
          'Confirm final time with both parties',
        ],
      },
      {
        title: 'Confirm and Finalize',
        description: 'Once a time is agreed, lock it in.',
        checklist: [
          'Create calendar event with full details',
          'Add meeting description/agenda',
          'Invite the client',
          'Send confirmation to both parties',
        ],
      },
    ],
    expectedOutcomes: [
      'Jay receives daily 8 AM calendar summary',
      'All meeting attendees are confirmed before meetings',
      'Meetings are scheduled according to preferences',
      'No meetings deleted/rescheduled without approval',
      'Clients receive professional, timely scheduling communication',
    ],
    troubleshooting: [
      {
        issue: 'Client is unresponsive to scheduling emails',
        solution: 'Follow up after 48 hours. If still no response, notify Jay to decide next steps.',
      },
      {
        issue: 'No available slots that fit preferences',
        solution: 'Ask Jay for approval to book outside normal preferences (before 10 AM or non-Monday).',
      },
      {
        issue: 'Client sends their own calendar link',
        solution: 'Do not use it without Jay\'s permission. Politely offer Jay\'s availability instead.',
      },
      {
        issue: 'Meeting needs to be rescheduled',
        solution: 'Get Jay\'s approval first, then coordinate new time with all attendees.',
      },
      {
        issue: 'Conflicting meetings appear',
        solution: 'Flag immediately to Jay. Do not auto-resolve conflicts.',
      },
    ],
    flowchart: `
┌─────────────────────────┐
│  8 AM: Review Calendar  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Check All RSVPs        │
└───────────┬─────────────┘
            │
      ┌─────┴─────┐
      │           │
      ▼           ▼
┌──────────┐  ┌──────────────┐
│Confirmed │  │ Unconfirmed/ │
│          │  │ Rejected     │
└────┬─────┘  └──────┬───────┘
     │               │
     │         ┌─────┴─────┐
     │         │           │
     │         ▼           ▼
     │    ┌────────┐  ┌─────────┐
     │    │Reach   │  │Ask Jay  │
     │    │Out     │  │to Delete│
     │    └────────┘  └─────────┘
     │
     ▼
┌─────────────────────────┐
│  Send Summary to Jay    │
└─────────────────────────┘

───── SCHEDULING FLOW ─────

┌─────────────────────────┐
│ Jay CCs Bob / Asks to   │
│ Schedule                │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Check Calendar +        │
│ Apply Preferences       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Draft Email w/ 2-3 Times│
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Jay Approves Draft?     │
└───────────┬─────────────┘
       ┌────┴────┐
       │         │
      Yes        No
       │         │
       ▼         ▼
┌──────────┐  ┌──────────┐
│Send to   │  │Revise    │
│Client    │  │Draft     │
└────┬─────┘  └──────────┘
     │
     ▼
┌─────────────────────────┐
│ Client Confirms Time    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Create Event + Invite   │
└─────────────────────────┘
`,
  },
  'sop-003': {
    id: 'sop-003',
    title: 'Team Task Intake',
    description: 'How Bob handles task requests from Jay and team members via email or Slack',
    category: 'Operations',
    lastUpdated: '2026-01-26',
    version: '1.0',
    purpose: 'Ensure tasks from Jay and team members are captured accurately, added to the task list, and confirmed - with minimal back-and-forth.',
    scope: "This SOP applies when Jay or team members (Madison, Kailey, etc.) CC Bob on emails or send tasks via Slack. Bob processes the request and adds it to Jay's task list for daily review.",
    prerequisites: [
      'Bob has access to Gmail (bob@leadgenjay.com)',
      'Bob has access to Slack',
      'Bob Command Center is set up for task management',
    ],
    steps: [
      {
        title: 'Receive Task Request',
        description: 'Team member CCs Bob on an email or sends a message with a task for Jay.',
        checklist: [
          'Identify the sender (Jay, Madison, Kailey, or other team)',
          'Note the channel (Gmail or Slack)',
          'Read the full message and any attachments/forwards',
        ],
      },
      {
        title: 'Understand the Task',
        description: 'Read and comprehend what needs to be done. If unclear, ask 1-2 clarifying questions MAX.',
        checklist: [
          'Identify the core action required',
          'Note any deadlines or urgency indicators',
          'Note any relevant links, contacts, or context',
          'If unclear: ask 1-2 concise questions (no more)',
          'Do NOT overburden team with excessive questions',
        ],
      },
      {
        title: 'Document the Task',
        description: 'Create a clear, actionable task summary with source tracking.',
        checklist: [
          'Write a clear task title',
          'Include key details in description',
          'Record WHO submitted it (name)',
          'Record WHAT PLATFORM (Gmail, Slack, iMessage)',
          'Set appropriate priority (urgent/high/medium/low)',
          'Set due date if specified or implied',
          'Add to Bob Command Center task list',
        ],
      },
      {
        title: 'Confirm Receipt',
        description: 'Reply all to confirm the task has been captured.',
        checklist: [
          'Reply all to the original thread',
          "State that task has been added to Jay's list",
          'Include brief task summary for confirmation',
          'Mention it will be reviewed together',
        ],
      },
      {
        title: 'Archive the Message',
        description: 'Once documented and confirmed, archive the message from the inbox.',
        checklist: [
          'Gmail: Archive the thread',
          'Slack: Mark as complete or archive',
          'Keeps inbox clean for new items',
        ],
      },
      {
        title: 'Daily Review with Jay',
        description: 'Review all captured tasks with Jay daily to prioritize and complete.',
        checklist: [
          'Go through task list together',
          'Clarify any remaining questions',
          'Prioritize and assign due dates',
          'Work on completing tasks',
          'Move completed items to Done',
        ],
      },
      {
        title: 'Notify Requester When Done',
        description: 'Once task is completed, notify the person who submitted it.',
        checklist: [
          'Check WHO submitted the task',
          'Check WHAT PLATFORM they used',
          'Send completion notification via same platform',
          'Brief message: task has been addressed/fixed',
        ],
      },
    ],
    expectedOutcomes: [
      'All team task requests are captured accurately',
      'Requester and platform tracked for each task',
      'Minimal back-and-forth with team members (1-2 questions max)',
      'Tasks are confirmed via reply-all',
      'Inbox stays clean (messages archived after processing)',
      'Jay reviews tasks daily with Bob',
      'Requesters notified when their task is completed',
    ],
    troubleshooting: [
      {
        issue: 'Task is completely unclear',
        solution: "Ask 1-2 specific clarifying questions. Keep questions concise. Jay can often figure it out with minimal info.",
      },
      {
        issue: 'Multiple tasks in one email',
        solution: 'Create separate task entries for each distinct action item.',
      },
      {
        issue: "Urgent task that can't wait for daily review",
        solution: 'Flag to Jay immediately via iMessage with task summary.',
      },
      {
        issue: "Task requires information Bob doesn't have access to",
        solution: "Note what's needed in the task description. Jay will provide during review.",
      },
    ],
    flowchart: `
┌─────────────────────────┐
│ Team CCs Bob on Email/  │
│ Sends Task via Slack    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Read & Understand Task  │
└───────────┬─────────────┘
            │
      ┌─────┴─────┐
      │           │
    Clear      Unclear
      │           │
      │           ▼
      │    ┌─────────────┐
      │    │ Ask 1-2     │
      │    │ Questions   │
      │    │ (MAX)       │
      │    └──────┬──────┘
      │           │
      └─────┬─────┘
            │
            ▼
┌─────────────────────────┐
│ Create Task Entry       │
│ (title, description,    │
│  priority, due date)    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Reply All: "Added to    │
│ Jay's list, will review"│
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Archive Message         │
│ (Gmail/Slack)           │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Daily Review with Jay   │
└───────────┬─────────────┘
            │
      ┌─────┴─────┐
      │           │
  Complete    Not Done
      │           │
      ▼           │
┌─────────────┐   │
│ Notify      │   │
│ Requester   │   │
│ (same       │   │
│ platform)   │   │
└─────────────┘   │
                  │
      ◄───────────┘
`,
  },
};

export const sopList = Object.values(sopDatabase).map(sop => ({
  id: sop.id,
  title: sop.title,
  description: sop.description,
  category: sop.category,
  lastUpdated: sop.lastUpdated,
  version: sop.version,
  steps: sop.steps.length,
}));
