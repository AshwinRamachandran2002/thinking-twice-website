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

export const userPos = new Vector2(agentxpos, 50);
export const shiftUser  = new Vector2(10, 50);
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
