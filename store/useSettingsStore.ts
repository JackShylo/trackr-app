import { create } from "zustand";
import { loadSettings, saveSettings } from "../utils/storage";
import { Theme } from "../constants/themes";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ListSortMode = "chrono" | "alpha" | "custom";
type ItemSortMode = "chrono" | "alpha" | "custom";

interface SettingsState {
  listSortMode: ListSortMode;
  itemSortMode: ItemSortMode;
  theme: Theme;
  confirmDeletes: boolean;
  hydrated: boolean;

  /* ─────────── Settings ─────────── */
  hydrate: () => Promise<void>;
  setListSortMode: (mode: ListSortMode) => Promise<void>;
  setItemSortMode: (mode: ItemSortMode) => Promise<void>;
  setTheme: (theme: Theme) => Promise<void>;
  setConfirmDeletes: (confirm: boolean) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  listSortMode: "chrono",
  itemSortMode: "custom",
  theme: "ocean",
  confirmDeletes: true,
  hydrated: false,

  /* ─────────── Hydration ─────────── */
  hydrate: async () => {
    const stored = await loadSettings();
    let defaultTheme: Theme = "ocean";
    
    // Use system theme if no preference is saved
    if (!stored?.theme) {
      try {
        const colorScheme = useColorScheme();
        defaultTheme = colorScheme === "dark" ? "slate" : "ocean";
      } catch (e) {
        // Fallback if colorScheme detection fails
        defaultTheme = "ocean";
      }
    }

    set({
      listSortMode: stored?.listSortMode ?? "chrono",
      itemSortMode: stored?.itemSortMode ?? "custom",
      theme: stored?.theme ?? defaultTheme,
      confirmDeletes: stored?.confirmDeletes ?? true,
      hydrated: true,
    });
  },

  /* ─────────── Settings Actions ─────────── */
  setListSortMode: async (mode) => {
    set({ listSortMode: mode });
    const current = get();
    await saveSettings({
      listSortMode: mode,
      itemSortMode: current.itemSortMode,
      theme: current.theme,
      confirmDeletes: current.confirmDeletes,
    });
  },

  setItemSortMode: async (mode) => {
    set({ itemSortMode: mode });
    const current = get();
    await saveSettings({
      listSortMode: current.listSortMode,
      itemSortMode: mode,
      theme: current.theme,
      confirmDeletes: current.confirmDeletes,
    });
  },

  setTheme: async (theme) => {
    set({ theme });
    const current = get();
    await saveSettings({
      listSortMode: current.listSortMode,
      itemSortMode: current.itemSortMode,
      theme,
      confirmDeletes: current.confirmDeletes,
    });
  },

  setConfirmDeletes: async (confirm) => {
    set({ confirmDeletes: confirm });
    const current = get();
    await saveSettings({
      listSortMode: current.listSortMode,
      itemSortMode: current.itemSortMode,
      theme: current.theme,
      confirmDeletes: confirm,
    });
  },
}));
