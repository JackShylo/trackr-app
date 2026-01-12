export type Theme = "ocean" | "forest" | "sunset" | "slate" | "pikachu" | "lavender" | "coral";

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
  pikachu: {
    name: "Pikachu",
    primary: "#dc2626", // dark red (for mouth/cheeks)
    primaryLight: "#fbbf24", // bright yellow
    accent: "#f59e0b", // amber
    background: "#1f1410", // dark brown
    surface: "#3d2817", // medium brown
    text: "#fef3c7", // light yellow
    textSecondary: "#fcd34d", // pale yellow
  },
  lavender: {
    name: "Lavender",
    primary: "#6d28d9", // deep purple
    primaryLight: "#a78bfa", // light purple/lavender
    accent: "#c084fc", // lighter purple
    background: "#1e0a3f", // very dark purple
    surface: "#3d1d56", // dark purple
    text: "#f3e8ff", // off white
    textSecondary: "#e9d5ff", // very light purple
  },
  coral: {
    name: "Coral",
    primary: "#be185d", // deep pink
    primaryLight: "#f472b6", // light pink
    accent: "#fb7185", // coral red
    background: "#3d0a3d", // very dark pink
    surface: "#6b1f47", // dark pink
    text: "#fce7f3", // off white
    textSecondary: "#fbcfe8", // light pink
  },
} as const;

export const THEME_NAMES = Object.keys(THEMES) as Theme[];
