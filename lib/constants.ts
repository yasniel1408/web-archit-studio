/**
 * Global constants for ArchitStudio
 */

// Application metadata
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "ArchitStudio";
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.1.0";
export const APP_DESCRIPTION = "Professional C4 & Cloud Architecture Diagramming Tool";

// Feature flags
export const FEATURES = {
  COLLABORATION: process.env.NEXT_PUBLIC_ENABLE_COLLABORATION === "true",
  EXPORT: process.env.NEXT_PUBLIC_ENABLE_EXPORT === "true",
  TEMPLATES: false, // Coming soon
  VERSION_CONTROL: false, // Coming soon
} as const;

// Canvas settings
export const CANVAS = {
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 3,
  DEFAULT_ZOOM: 1,
  GRID_SIZE: 20,
  SNAP_TO_GRID: true,
} as const;

// Diagram element sizes
export const ELEMENT_SIZES = {
  AWS: { width: 80, height: 80 },
  GCP: { width: 80, height: 80 },
  C4: {
    PERSON: { width: 120, height: 140 },
    SOFTWARE_SYSTEM: { width: 200, height: 120 },
    CONTAINER: { width: 180, height: 100 },
    COMPONENT: { width: 160, height: 80 },
  },
} as const;

// Animation durations (in ms)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: "architstudio-theme",
  RECENT_DIAGRAMS: "architstudio-recent-diagrams",
  USER_PREFERENCES: "architstudio-preferences",
  CANVAS_SETTINGS: "architstudio-canvas-settings",
} as const;

// API endpoints (when backend is implemented)
export const API_ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
  DIAGRAMS: "/diagrams",
  AUTH: "/auth",
  USERS: "/users",
  EXPORT: "/export",
} as const;

// Color palette
export const COLORS = {
  PRIMARY: "hsl(221.2 83.2% 53.3%)",
  SECONDARY: "hsl(210 40% 96.1%)",
  DESTRUCTIVE: "hsl(0 84.2% 60.2%)",
  MUTED: "hsl(210 40% 96.1%)",
  ACCENT: "hsl(210 40% 96.1%)",
  AWS_ORANGE: "#FF9900",
  GCP_BLUE: "#4285F4",
  C4_BLUE: "#438DD5",
} as const;

// Keyboard shortcuts
export const SHORTCUTS = {
  UNDO: "cmd+z",
  REDO: "cmd+shift+z",
  COPY: "cmd+c",
  PASTE: "cmd+v",
  DELETE: "delete",
  SELECT_ALL: "cmd+a",
  SAVE: "cmd+s",
  EXPORT: "cmd+e",
  ZOOM_IN: "cmd++",
  ZOOM_OUT: "cmd+-",
  ZOOM_RESET: "cmd+0",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: "Something went wrong. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  NOT_FOUND: "The requested resource was not found.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  VALIDATION: "Please check your input and try again.",
} as const;
