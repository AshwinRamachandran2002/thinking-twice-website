// Import minimal required images
import cursorImg from '../assets/cursor.jpeg';
import windsurfImg from '../assets/windsurf.jpeg';

// === Global control variables ===
export const CANVAS_RATIO = 900 / 320;

// Modified to remove SVG dependencies
export const leftIntegrationImages: string[] = [];
export const leftIntegrationImagesTop: string[] = [];
export const rightIntegrationImages: string[] = [];
export const rightIntegrationImagesTop: string[] = [];
export const agentImages = [
  cursorImg,
  windsurfImg,
];

// === Spawn control variables ===
export const MAX_CONCURRENT = 2;
export const SPAWN_MIN = 3000;
export const SPAWN_MAX = 7000;
export const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Arrow start X positions (now as fractions of width for responsiveness)
export const leftArrowStartXFrac = 0.09;
export const rightArrowStartXFrac = 0.91;
export const AGENT_TO_FORT_ARROW_START_X_FRAC = 0.42;
export const AGENT_TO_FORT_ARROW_END_X_FRAC = 0.58;

// Integration image size multipliers
export const INTEGRATION_RADIUS = 0.0139;
export const INTEGRATION_IMG_SIZE = 0.025;
export const INTEGRATION_TOP_RADIUS = 0.02;
export const INTEGRATION_TOP_IMG_SIZE = 0.02;
export const INTEGRATION_SPACING = 0.18;

// ContextFort box dimensions
export const CONTEXTFORT_BOX_WIDTH = 0.15;
export const CONTEXTFORT_BOX_HEIGHT = 0.25;
