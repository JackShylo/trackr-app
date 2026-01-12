import { Todo } from "../types/ListItem";
import { List } from "../types/List";
import { ListItem } from "../types/ListItem";

export const sortAlphabetical = (items: Todo[]) =>
  [...items].sort((a, b) =>
    a.text.localeCompare(b.text, undefined, { sensitivity: "base" })
  );

export const sortChronological = (items: Todo[]) =>
  [...items].sort((a, b) => a.createdAt - b.createdAt);

export const sortCustom = (items: Todo[]) =>
  [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

/* ─────────── List Sorting ─────────── */
export const sortListsAlphabetical = (lists: List[]) =>
  [...lists].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  );

export const sortListsChronological = (lists: List[]) =>
  [...lists].sort((a, b) => a.createdAt - b.createdAt);

export const sortLists = (lists: List[], mode: "chrono" | "alpha" | "custom") => {
  if (mode === "alpha") return sortListsAlphabetical(lists);
  if (mode === "chrono") return sortListsChronological(lists);
  return lists; // custom order
};

/* ─────────── List Items Sorting ─────────── */
export const sortItemsAlphabetical = (items: ListItem[]) =>
  [...items].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  );

export const sortItemsChronological = (items: ListItem[]) =>
  [...items].sort((a, b) => a.createdAt - b.createdAt);

export const sortItemsCustom = (items: ListItem[]) =>
  [...items].sort((a, b) => a.order - b.order);

export const sortItems = (items: ListItem[], mode: "chrono" | "alpha" | "custom") => {
  if (mode === "alpha") return sortItemsAlphabetical(items);
  if (mode === "chrono") return sortItemsChronological(items);
  return sortItemsCustom(items); // custom order
};
