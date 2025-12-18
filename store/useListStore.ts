import { create } from "zustand";
import { List } from "../types/List";
import { ListItem } from "../types/ListItem";
import { loadLists, saveLists } from "../utils/storage";

interface ListsState {
  lists: List[];
  hydrated: boolean;

  /* ─────────── Lists ─────────── */
  hydrate: () => Promise<void>;
  addList: (title: string) => void;
  updateList: (id: string, title: string) => void;
  deleteList: (id: string) => void;

  /* ─────────── Items ─────────── */
  addItem: (listId: string, title: string) => void;
  updateItem: (
    listId: string,
    itemId: string,
    updates: Partial<Pick<ListItem, "title" | "notes" | "category">>
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
  addList: (title) => {
    const newList: List = {
      id: crypto.randomUUID(),
      title,
      createdAt: Date.now(),
      items: [],
    };

    const lists = [...get().lists, newList];
    set({ lists });
    saveLists(lists);
  },

  updateList: (id, title) => {
    const lists = get().lists.map((l) =>
      l.id === id ? { ...l, title } : l
    );
    set({ lists });
    saveLists(lists);
  },

  deleteList: (id) => {
    const lists = get().lists.filter((l) => l.id !== id);
    set({ lists });
    saveLists(lists);
  },

  /* ─────────── Item Actions ─────────── */
  addItem: (listId, title) => {
    const lists = get().lists.map((list) => {
      if (list.id !== listId) return list;

      const newItem: ListItem = {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: Date.now(),
        order: list.items.length,
      };

      return {
        ...list,
        items: [...list.items, newItem],
      };
    });

    set({ lists });
    saveLists(lists);
  },

  updateItem: (listId, itemId, updates) => {
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
    saveLists(lists);
  },

  toggleItem: (listId, itemId) => {
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
    saveLists(lists);
  },

  deleteItem: (listId, itemId) => {
    const lists = get().lists.map((list) => {
      if (list.id !== listId) return list;

      const items = list.items
        .filter((item) => item.id !== itemId)
        .map((item, index) => ({ ...item, order: index }));

      return { ...list, items };
    });

    set({ lists });
    saveLists(lists);
  },

  reorderItems: (listId, items) => {
    const lists = get().lists.map((list) =>
      list.id === listId ? { ...list, items } : list
    );

    set({ lists });
    saveLists(lists);
  },
}));
