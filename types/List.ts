import { ListItem } from "./ListItem";

export interface List {
  id: string;
  title: string;
  color?: string;
  createdAt: number;
  items: ListItem[];
}
