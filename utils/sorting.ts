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
  // Separate pinned and unpinned
  const pinned = lists.filter((l) => l.pinned);
  const unpinned = lists.filter((l) => !l.pinned);

  // Sort each group
  let sortedPinned = pinned;
  let sortedUnpinned = unpinned;

  if (mode === "alpha") {
    sortedPinned = sortListsAlphabetical(pinned);
    sortedUnpinned = sortListsAlphabetical(unpinned);
  } else if (mode === "chrono") {
    sortedPinned = sortListsChronological(pinned);
    sortedUnpinned = sortListsChronological(unpinned);
  }

  // Pinned items always come first
  return [...sortedPinned, ...sortedUnpinned];
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
