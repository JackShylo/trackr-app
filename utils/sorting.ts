import { Todo } from "../types/ListItem";

export const sortAlphabetical = (items: Todo[]) =>
  [...items].sort((a, b) =>
    a.text.localeCompare(b.text, undefined, { sensitivity: "base" })
  );

export const sortChronological = (items: Todo[]) =>
  [...items].sort((a, b) => a.createdAt - b.createdAt);

export const sortCustom = (items: Todo[]) =>
  [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
