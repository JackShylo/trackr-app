import { Todo } from "../types/Task";

export const sortAlphabetical = (items: Todo[]) =>
  [...items].sort((a, b) => a.text.localeCompare(b.text));

export const sortChronological = (items: Todo[]) =>
  [...items].sort((a, b) => a.createdAt - b.createdAt);

export const sortCustom = (items: Todo[]) =>
  [...items].sort((a, b) => a.order - b.order);
