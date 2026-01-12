import { Ionicons } from "@expo/vector-icons";
import { ListItem } from "./ListItem";

export interface List {
  id: string;
  createdAt: number;
  title: string;
  icon?: {
    name: keyof typeof Ionicons.glyphMap;
    color: string;
  };
  items: ListItem[];
  pinned?: boolean;
}
