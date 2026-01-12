import { create } from "zustand";
import { loadSettings, saveSettings } from "../utils/storage";
import { Theme } from "../constants/themes";

type ListSortMode = "chrono" | "alpha" | "custom";
type ItemSortMode = "chrono" | "alpha" | "custom";

interface SettingsState {
  listSortMode: ListSortMode;
  itemSortMode: ItemSortMode;
  theme: Theme;
  hydrated: boolean;

  /* ─────────── Settings ─────────── */
  hydrate: () => Promise<void>;
  setListSortMode: (mode: ListSortMode) => Promise<void>;
  setItemSortMode: (mode: ItemSortMode) => Promise<void>;
  setTheme: (theme: Theme) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  listSortMode: "chrono",
  itemSortMode: "custom",
  theme: "ocean",
  hydrated: false,

  /* ─────────── Hydration ─────────── */
  hydrate: async () => {
    const stored = await loadSettings();
    set({
      listSortMode: stored?.listSortMode ?? "chrono",
      itemSortMode: stored?.itemSortMode ?? "custom",
      theme: stored?.theme ?? "ocean",
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
    });
  },

  setItemSortMode: async (mode) => {
    set({ itemSortMode: mode });
    const current = get();
    await saveSettings({
      listSortMode: current.listSortMode,
      itemSortMode: mode,
      theme: current.theme,
    });
  },

  setTheme: async (theme) => {
    set({ theme });
    const current = get();
    await saveSettings({
      listSortMode: current.listSortMode,
      itemSortMode: current.itemSortMode,
      theme,
    });
  },
}));
