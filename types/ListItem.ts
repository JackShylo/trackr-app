export interface ListItem {
  id: string;
  createdAt: number;
  title: string;
  notes?: string;
  category?: string;
  completed: boolean;
  order: number;
}
