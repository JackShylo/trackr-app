import { create } from "zustand";
import { List } from "../types/List";
import { ListItem } from "../types/ListItem";
import { loadLists, saveLists } from "../utils/storage";
import { MAX_LISTS } from "@/constants/limits"
import { Ionicons } from "@expo/vector-icons";
import uuid from "react-native-uuid";

interface ListsState {
  lists: List[];
  hydrated: boolean;
  lastAction?: { type: string; undo: () => Promise<void> };

  /* ─────────── Lists ─────────── */
  hydrate: () => Promise<void>;
  addList: (title: string, icon?: { name: string; color: string }) => void;
  updateList: (id: string, title: string, icon?: { name: string; color: string }) => void;
  deleteList: (id: string) => void;
  cloneList: (id: string) => void;
  togglePinList: (id: string) => void;
  undo: () => Promise<void>;

  /* ─────────── Items ─────────── */
  addItem: (listId: string, title: string, description: string, notes?: string, category?: string, priority?: "low" | "medium" | "high", dueDate?: number) => void;
  updateItem: (
    listId: string,
    itemId: string,
    updates: Partial<Pick<ListItem, "title" | "notes" | "category" | "priority" | "dueDate">>
  ) => void;
  toggleItem: (listId: string, itemId: string) => void;
  deleteItem: (listId: string, itemId: string) => void;
  reorderItems: (listId: string, items: ListItem[]) => void;
}

export const useListsStore = create<ListsState>((set, get) => ({
  lists: [],
  hydrated: false,

  /* ─────────── Hydration ─────────── */
  hydrate: async () => {
    const stored = await loadLists();
    set({
      lists: stored ?? [],
      hydrated: true,
    });
  },

  /* ─────────── List Actions ─────────── */
  addList: async (title, icon) => {
    const newList: List = {
      id: uuid.v4() as string,
      createdAt: Date.now(),
      title,
      icon: icon
        ? {
            name: icon.name as keyof typeof Ionicons.glyphMap,
            color: icon.color,
          }
        : undefined,
      items: [],
      pinned: false,
    };

    const lists = [...get().lists, newList];
    if (lists.length >= MAX_LISTS) {
    return false;
    }
    set({ lists });
    await saveLists(lists);
  },

  updateList: async (id, title, icon) => {
    const lists = get().lists.map((l) =>
      l.id === id
        ? {
            ...l,
            title,
            icon: icon
              ? {
                  name: icon.name as keyof typeof Ionicons.glyphMap,
                  color: icon.color,
                }
              : undefined,
          }
        : l
    );
    set({ lists });
    await saveLists(lists);
  },

  deleteList: async (id) => {
    const oldLists = get().lists;
    const lists = oldLists.filter((l) => l.id !== id);
    set({ 
      lists,
      lastAction: {
        type: "deleteList",
        undo: async () => {
          set({ lists: oldLists, lastAction: undefined });
          await saveLists(oldLists);
        }
      }
    });
    await saveLists(lists);
  },

  cloneList: async (id) => {
    const currentLists = get().lists;
    if (currentLists.length >= MAX_LISTS) return;

    const listToClone = currentLists.find((l) => l.id === id);
    if (!listToClone) return;

    const clonedItems: ListItem[] = listToClone.items.map((item) => ({
      ...item,
      id: uuid.v4() as string,
    }));

    const clonedList: List = {
      ...listToClone,
      id: uuid.v4() as string,
      title: `${listToClone.title} (Copy)`,
      createdAt: Date.now(),
      items: clonedItems,
    };

    const lists = [...currentLists, clonedList];
    set({ lists });
    await saveLists(lists);
  },

  togglePinList: async (id) => {
    const oldLists = get().lists;
    const lists = oldLists.map((l) =>
      l.id === id ? { ...l, pinned: !l.pinned } : l
    );
    set({ 
      lists,
      lastAction: {
        type: "togglePin",
        undo: async () => {
          set({ lists: oldLists, lastAction: undefined });
          await saveLists(oldLists);
        }
      }
    });
    await saveLists(lists);
  },

  undo: async () => {
    const lastAction = get().lastAction;
    if (lastAction) {
      await lastAction.undo();
      set({ lastAction: undefined });
    }
  },

  /* ─────────── Item Actions ─────────── */
  addItem: async (listId, title, description, notes, category, priority, dueDate) => {
    const oldLists = get().lists;
    const lists = get().lists.map((list) => {
      if (list.id !== listId) return list;

      const newItem: ListItem = {
        id: uuid.v4() as string,
        title,
        completed: false,
        createdAt: Date.now(),
        order: list.items.length,
        notes,
        category,
        priority,
        dueDate,
      };

      return {
        ...list,
        items: [...list.items, newItem],
      };
    });

    set({ 
      lists,
      lastAction: {
        type: "addItem",
        undo: async () => {
          set({ lists: oldLists, lastAction: undefined });
          await saveLists(oldLists);
        }
      }
    });
    await saveLists(lists);
  },

  updateItem: async (listId, itemId, updates) => {
    const lists = get().lists.map((list) => {
      if (list.id !== listId) return list;

      return {
        ...list,
        items: list.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      };
    });

    set({ lists });
    await saveLists(lists);
  },

  toggleItem: async (listId, itemId) => {
    const lists = get().lists.map((list) => {
      if (list.id !== listId) return list;

      return {
        ...list,
        items: list.items.map((item) =>
          item.id === itemId
            ? { ...item, completed: !item.completed }
            : item
        ),
      };
    });

    set({ lists });
    await saveLists(lists);
  },

  deleteItem: async (listId, itemId) => {
    const oldLists = get().lists;
    const lists = oldLists.map((list) => {
      if (list.id !== listId) return list;

      const items = list.items
        .filter((item) => item.id !== itemId)
        .map((item, index) => ({ ...item, order: index }));

      return { ...list, items };
    });

    set({ 
      lists,
      lastAction: {
        type: "deleteItem",
        undo: async () => {
          set({ lists: oldLists, lastAction: undefined });
          await saveLists(oldLists);
        }
      }
    });
    await saveLists(lists);
  },

  reorderItems: (listId, items) => {
    const lists = get().lists.map((list) =>
      list.id === listId ? { ...list, items } : list
    );

    set({ lists });
    saveLists(lists);
  },
}));
