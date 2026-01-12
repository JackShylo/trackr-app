import AsyncStorage from "@react-native-async-storage/async-storage";
import { List } from "../types/List";
import { Theme } from "../constants/themes";

const STORAGE_KEY = "@trackr_lists";
const SETTINGS_KEY = "@trackr_settings";

export interface Settings {
  listSortMode?: "chrono" | "alpha" | "custom";
  itemSortMode?: "chrono" | "alpha" | "custom";
  theme?: Theme;
}

/* ─────────── Load ─────────── */
export async function loadLists(): Promise<List[] | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    return JSON.parse(raw) as List[];
  } catch (err) {
    console.error("Failed to load lists", err);
    return null;
  }
}

/* ─────────── Save ─────────── */
export async function saveLists(lists: List[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  } catch (err) {
    console.error("Failed to save lists", err);
  }
}

/* ─────────── Clear (optional) ─────────── */
export async function clearLists(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear lists", err);
  }
}

/* ─────────── Settings ─────────── */
export async function loadSettings(): Promise<Settings | null> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;

    return JSON.parse(raw) as Settings;
  } catch (err) {
    console.error("Failed to load settings", err);
    return null;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    const existing = await loadSettings();
    const merged = { ...existing, ...settings };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  } catch (err) {
    console.error("Failed to save settings", err);
  }
}
