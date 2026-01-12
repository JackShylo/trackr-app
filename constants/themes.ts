export type Theme = "ocean" | "forest" | "sunset" | "slate";

export const THEMES = {
  ocean: {
    name: "Ocean",
    primary: "#1e3a8a", // dark blue
    primaryLight: "#3b82f6", // light blue
    accent: "#0ea5e9", // sky blue
    background: "#0f172a", // almost black
    surface: "#1e293b", // dark slate
    text: "#f1f5f9", // almost white
    textSecondary: "#cbd5e1", // light gray
  },
  forest: {
    name: "Forest",
    primary: "#15803d", // dark green
    primaryLight: "#22c55e", // light green
    accent: "#10b981", // emerald
    background: "#051e16", // almost black
    surface: "#1a3a2a", // dark green-tinted
    text: "#f1f5f9", // almost white
    textSecondary: "#cbd5e1", // light gray
  },
  sunset: {
    name: "Sunset",
    primary: "#b91c1c", // dark red
    primaryLight: "#ef4444", // light red
    accent: "#f97316", // orange
    background: "#3f0609", // dark maroon
    surface: "#7f1d1d", // medium maroon
    text: "#fef2f2", // off white
    textSecondary: "#fed7aa", // light orange
  },
  slate: {
    name: "Slate",
    primary: "#334155", // slate
    primaryLight: "#64748b", // light slate
    accent: "#94a3b8", // lighter slate
    background: "#0f172a", // dark slate
    surface: "#1e293b", // medium slate
    text: "#f1f5f9", // almost white
    textSecondary: "#cbd5e1", // light gray
  },
} as const;

export const THEME_NAMES = Object.keys(THEMES) as Theme[];
