export interface ListItem {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  createdAt: number;
  order: number;
  category?: string;
}
