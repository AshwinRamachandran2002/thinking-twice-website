import { Vector2 } from 'three';

export const Aypos = 46;
export const Bypos = 350;
export const agentxpos = 450;
export const integrationAPos = new Vector2(62, Aypos);
export const shiftIntegrationA  = new Vector2(60, 50);
export const integrationBPos = new Vector2(62, Bypos);
export const shiftIntegrationB  = new Vector2(60, 50);
export const agentPos = new Vector2(agentxpos, (Aypos + Bypos) / 2);
export const shiftAgent  = new Vector2(10, 30);
export const llmPos = new Vector2(680, (Aypos + Bypos) / 2);
export const shiftLLM  = new Vector2(10, 30);
export const userPos = new Vector2(agentxpos, 20);
export const shiftUser  = new Vector2(10, 50);
export const flowDurationMs = 100;   // ← try 800 for turbo, 2000 for slow-mo
/* ---------- NEW: canonical colors ---------- */
export const normalColor      = 'rgb(34,197,94)';  // emerald-500
export const adversarialColor = 'rgb(239,68,68)';  // red-500

export const cloudTextSets = [
  [
    "🟢 Clean Intent",
    "🟢 Safe Action",
    "💬 Hello!",
    "🟢 Clean Intent",
    "🟢 Safe Action"
  ],
  [
    "🟢 Verified Input",
    "🟢 Logged & Sent",
    "💬 What's on calendar?",
    "🟢 Verified Input",
    "🟢 Logged & Sent"
  ],
  [
    "🟢 Context Secure",
    "🟢 Executed Normally",
    "💬 Add meeting",
    "🟢 Context Secure",
    "🟢 Executed Normally"
  ]
];

export const cloudTypeSets = [
  "normal",
  "normal",
  "advarsarial"
];
