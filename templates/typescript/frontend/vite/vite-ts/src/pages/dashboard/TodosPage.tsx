import { useState, FormEvent } from 'react';
import { useTodos } from '@hooks';
import { Todo } from '@types';

export const TodosPage = () => {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [input, setInput] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setAdding(true);
    try {
      await addTodo({ title: input.trim() });
      setInput('');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Todos</h2>

      {/* Add todo form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={adding || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {adding ? 'Adding...' : 'Add'}
        </button>
      </form>

      {/* States */}
      {loading && <p className="text-sm text-gray-400 text-center py-8">Loading todos...</p>}
      {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
      {!loading && todos.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">No todos yet. Add one above!</p>
      )}

      {/* Todo list */}
      <ul className="flex flex-col gap-2">
        {todos.map((todo: Todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 bg-white border rounded-xl px-4 py-3 group"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
            <span
              className={`flex-1 text-sm ${
                todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
              }`}
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-xs"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
