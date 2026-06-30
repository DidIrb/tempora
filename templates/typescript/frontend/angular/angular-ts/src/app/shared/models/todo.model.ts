export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TodoRequest {
  title?: string;
  completed?: boolean;
}
