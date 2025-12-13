export interface Todo {
  id: string;
  text: string;
  notes?: string;
  createdAt: number;
  completed: boolean;
  order: number;
  isEditing?: boolean;
}
