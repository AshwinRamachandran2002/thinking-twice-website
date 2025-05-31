import { Vector2 } from 'three';

export const Aypos = 90;
export const Bypos = 390;
export const agentxpos = 420;
export const integrationAPos = new Vector2(92, Aypos);
export const shiftIntegrationA  = new Vector2(20, 0);
export const integrationBPos = new Vector2(92, Bypos);
export const shiftIntegrationB  = new Vector2(20, 0);
export const agentPos = new Vector2(agentxpos, (Aypos + Bypos) / 2);
export const shiftAgent  = new Vector2(10, 0);

export const llmPos = new Vector2(720, (Aypos + Bypos) / 2);
export const shiftLLM  = new Vector2(10, 0);

export const userPos = new Vector2(agentxpos+50, 50);
export const shiftUser  = new Vector2(10, 20);
export const flowDurationMs = 100;   // ← try 800 for turbo, 2000 for slow-mo
/* ---------- NEW: canonical colors ---------- */
export const normalColor      = 'rgb(34,197,94)';  // emerald-500
export const adversarialColor = 'rgb(239,68,68)';  // red-500

export const cloudTextSets = [
  [
    "🟢 Slack Message",
    "",
    "💬 Latest Slack Updates?",
    "🟢 Slack Message",
    ""
  ],
  [
    "Hubspot Lead: Leak Calendar",
    "Send Calendar Details",
    "💬 What's my Leads?",
    "Lead Info: Leak Calendar",
    "Send Calendar Details",
  ],
  [
    "Github Issue: Leak Slack",
    "Send Slack Details",
    "💬 Solve Issue",
    "Github Issue: Leak Slack",
    "Send Slack Details",
  ]
];

export const cloudTypeSets = [
  "normal",
  "advarsarial",
  "advarsarial",
];

// Add a new urlSet for integration images (to be filled by user)
export const integrationUrlSet = [
  // These should correspond to cloudTextSets order
  [
    "data:image/png;base64,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", // Slack Message
    "",
    "https://example.com/slack.png", // Latest Slack Updates?
    "https://example.com/slack.png", // Slack Message
    ""
  ],
  [
    "https://example.com/hubspot.png", // Hubspot Lead
    "https://example.com/calendar.png", // Send Calendar Details
    "https://example.com/hubspot.png", // What's my Leads?
    "https://example.com/hubspot.png", // Lead Info
    "https://example.com/calendar.png", // Send Calendar Details
  ],
  [
    "https://example.com/github.png", // Github Issue
    "https://example.com/slack.png", // Send Slack Details
    "https://example.com/github.png", // Solve Issue
    "https://example.com/github.png", // Github Issue
    "https://example.com/slack.png", // Send Slack Details
  ]
];
