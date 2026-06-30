import { http } from './http';
import { ApiResponse, Todo, TodoForm } from '@types';

export const todoService = {
  getAll: () =>
    http.get<ApiResponse<Todo[]>>('/api/todos'),

  create: (data: TodoForm) =>
    http.post<ApiResponse<Todo>>('/api/todos', data),

  update: (id: number, data: Partial<TodoForm & { completed: boolean }>) =>
    http.put<ApiResponse<Todo>>(`/api/todos/${id}`, data),

  delete: (id: number) =>
    http.delete<ApiResponse<null>>(`/api/todos/${id}`),
};
