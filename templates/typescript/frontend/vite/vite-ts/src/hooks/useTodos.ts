import { useState, useEffect } from 'react';
import { Todo, TodoForm } from '@types';
import { todoService } from '@services';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await todoService.getAll();
      setTodos(res.data.data || []);
    } catch {
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (form: TodoForm) => {
    const res = await todoService.create(form);
    if (res.data.data) setTodos((prev) => [res.data.data!, ...prev]);
  };

  const toggleTodo = async (todo: Todo) => {
    const res = await todoService.update(todo.id, { completed: !todo.completed });
    if (res.data.data) setTodos((prev) => prev.map((t) => (t.id === todo.id ? res.data.data! : t)));
  };

  const deleteTodo = async (id: number) => {
    await todoService.delete(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => { fetchTodos(); }, []);

  return { todos, loading, error, addTodo, toggleTodo, deleteTodo };
};
