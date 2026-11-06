/**
 * Relationship TV - Constants
 * Core configuration values for the 3D TV experience
 */

// Relationship start date: 4 October 2026 at 12:00 AM (local time)
// Note: JavaScript months are 0-indexed, so 9 = October
export const START_DATE = new Date(2026, 9, 4, 0, 0, 0);

// TV Geometry dimensions (Three.js units)
export const TV_WIDTH = 1.6;
export const TV_HEIGHT = 1.0;
export const TV_DEPTH = 0.6;

// Screen dimensions (slightly smaller than TV face)
export const SCREEN_WIDTH = 1.2;
export const SCREEN_HEIGHT = 0.75;
export const SCREEN_BULGE = 0.06; // CRT curvature depth

// Rotation constraints
export const ROTATION_MIN = 0; // Front view
export const ROTATION_MAX = Math.PI; // Back view (180°)
export const ROTATION_SNAP_THRESHOLD = Math.PI / 2; // Midpoint for snap decision

// Interaction settings
export const SNAP_DURATION = 420; // ms
export const RAYCAST_CLICK_THRESHOLD = 0.6 * Math.PI; // Back must be mostly visible

// Button settings
export const BUTTON_PRESS_DEPTH = 0.02;
export const BUTTON_PRESS_DURATION = 150; // ms

// Animation settings
export const INCREMENT_ANIMATION_DURATION = 1000; // ms
export const INCREMENT_ANIMATION_DISTANCE = 40; // pixels

// Display modes
export type DisplayMode = 'full' | 'seconds' | 'minutes' | 'hours' | 'days' | 'months';

export const DISPLAY_MODES: DisplayMode[] = ['full', 'seconds', 'minutes', 'hours', 'days', 'months'];

// Colors for materials (hex values)
export const COLORS = {
  tvBody: 0x6b6b6b,
  tvBodyHighlight: 0x7a7a7a,
  screenEmissive: 0x071b07,
  buttonDefault: 0x2b2b33,
  buttonPressed: 0x111216,
  crtGreen: '#b6ffd3',
  crtGreenDim: '#3a5c4a',
} as const;

// Material properties
export const MATERIALS = {
  tvBody: {
    metalness: 0.05,
    roughness: 0.6,
  },
  screen: {
    metalness: 0.05,
    roughness: 0.2,
    emissiveIntensity: 0.35,
  },
} as const;

// Light settings
export const LIGHTS = {
  ambient: {
    intensity: 0.35,
  },
  directional: {
    intensity: 0.9,
    position: [-2, 3, 2] as [number, number, number],
  },
} as const;
