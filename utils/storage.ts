import AsyncStorage from "@react-native-async-storage/async-storage";
import { List } from "../types/List";

const STORAGE_KEY = "@trackr_lists";

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
