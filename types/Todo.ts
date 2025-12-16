export interface Todo {
  id: string;
  text: string;
  notes?: string;
  category?: string;
  completed: boolean;
  createdAt: number;
  order: number;
}
