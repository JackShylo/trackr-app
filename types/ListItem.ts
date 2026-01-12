export interface ListItem {
  id: string;
  createdAt: number;
  title: string;
  notes?: string;
  category?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: number;
  completed: boolean;
  order: number;
}
