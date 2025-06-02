// Import all images from src/assets for use in FlowDiagram
import slackLogo from '../assets/slack.svg';
import calendarLogo from '../assets/calendar.svg';
import githubLogo from '../assets/github.svg';
import airtableLogo from '../assets/airtable.svg';
import jiraLogo from '../assets/jira.svg';
import notionLogo from '../assets/notion.svg';
import sheetsLogo from '../assets/sheets.svg';
import salesforceLogo from '../assets/salesforce.svg';
import datadogLogo from '../assets/datadog.svg';
import driveLogo from '../assets/drive.svg';
import hubspotLogo from '../assets/hubspot.svg';
import sapLogo from '../assets/sap.svg';
import sharepointLogo from '../assets/sharepoint.svg';
import workdayLogo from '../assets/workday.svg';
import zendeskLogo from '../assets/zendesk.svg';
import codeLogo from '../assets/code.svg';
import cursorImg from '../assets/cursor.jpeg';
import windsurfImg from '../assets/windsurf.jpeg';
import devilImg from '../assets/devil.svg';

// Constants for FlowDiagram

export const MAX_CONCURRENT = 2;
export const SPAWN_MIN = 3000;
export const SPAWN_MAX = 7000;
export const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const CANVAS_RATIO = 900 / 320; // maintain original aspect

// List of integration image URLs (update as needed)
export const leftIntegrationImages = [
  slackLogo,
  calendarLogo,
  githubLogo,
  airtableLogo,
  jiraLogo,
];
export const leftIntegrationImagesTop = [
  notionLogo,
  sheetsLogo,
  salesforceLogo,
];
export const rightIntegrationImages = [
  datadogLogo, // Mirror
  driveLogo, // Mirror
  hubspotLogo, // Mirror
  sapLogo, // Mirror
  jiraLogo, // Mirror
]; // Mirror
export const rightIntegrationImagesTop = [
  sharepointLogo, // Mirror
  workdayLogo, // Mirror
  zendeskLogo, // Mirror
]; // Mirror


export const agentImages = [
  codeLogo,
  cursorImg,
  windsurfImg,
]

// === Global control variables ===
// Arrow start X positions (now as fractions of width for responsiveness)
export const leftArrowStartXFrac = 0.09; // ~170/1900
export const rightArrowStartXFrac = 0.91; // ~1630/1800
// FlowDiagram wrapper controls
export const diagramWidth = '100%'; // e.g. '900px' or '100%'
export const diagramHeight = '80px'; // e.g. '320px', 'auto', or '100%'
export const diagramX = 0; // px offset from left
export const diagramY = -50; // px offset from top

// === Moving texts config ===
export const DEVIL_IMG = devilImg; // Replace with actual devil image path if available

export const movingTexts = [
  {
    textLeft: "Jira Issue Details",
    textAgent: "Mark Jira Complete",
    textRight: "Mark Jira Complete",
    color: "#60a5fa",
    delay: 0,
    devillish: false
  },
  {
    textLeft: "Leak Slack Messages",
    textAgent: "Leak Slack Message",
    textRight: "Leak Thwarted",
    color: "#fbbf24",
    delay: 800,
    devillish: true
  },
  {                 
    textLeft: "Notion Document",
    textAgent: "Write to Notion Page",
    textRight: "Write to Notion Page",
    color: "#34d399",
    delay: 1600,
    devillish: false
  },
  {
    textLeft: "Leak Google Calendar",
    textAgent: "Leak Google Calendar",
    textRight: "Leak Thwarted",
    color: "#a78bfa",
    delay: 2400,
    devillish: true
  },
  {
    textLeft: "Gmail Thread",
    textAgent: "Send Gmail",
    textRight: "Send Gmail",
    color: "#f87171",
    delay: 3200,
    devillish: false
  },
];
export const TEXT_FONT = "bold 18px Inter, sans-serif";
export const TEXT_SPEED = 0.003; // progress per ms

// === Integration image size multipliers (global, easy to tweak) ===
export const INTEGRATION_RADIUS = 0.0139; // as fraction of WIDTH (bottom layer)
export const INTEGRATION_IMG_SIZE = 0.025; // as fraction of WIDTH (bottom layer)
export const INTEGRATION_TOP_RADIUS = 0.02; // as fraction of WIDTH (top layer)
export const INTEGRATION_TOP_IMG_SIZE = 0.02; // as fraction of WIDTH (top layer)
export const INTEGRATION_SPACING = 0.18; // as fraction of HEIGHT (vertical spacing between images)

// === Agent to Fort arrow endpoints (now as fractions of width) ===
export const AGENT_TO_FORT_ARROW_START_X_FRAC = 0.42; // ~750/1800
export const AGENT_TO_FORT_ARROW_END_X_FRAC = 0.58;   // ~1050/1800

export const DEVIL_DROP_OFFSET_Y = 120; // px, vertical drop offset for devillish drop
export const DEVIL_DROP_X = 0.67; // as fraction of WIDTH, set in FlowDiagram.tsx for devil icon x

// === ContextFort box size globals ===
export const CONTEXTFORT_BOX_WIDTH = 0.145; // as fraction of WIDTH (default 0.133)
export const CONTEXTFORT_BOX_HEIGHT = 0.3; // increased height for more space
