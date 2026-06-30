import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '@core';
import { Todo } from '@shared/models';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">My Todos</h2>

      <form (ngSubmit)="handleAdd()" class="flex gap-2 mb-6">
        <input
          type="text"
          [(ngModel)]="input"
          name="input"
          placeholder="Add a new todo..."
          class="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          [disabled]="adding() || !input.trim()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {{ adding() ? 'Adding...' : 'Add' }}
        </button>
      </form>

      @if (loading()) {
        <p class="text-sm text-gray-400 text-center py-8">Loading todos...</p>
      }
      @if (error()) {
        <p class="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{{ error() }}</p>
      }
      @if (!loading() && todos().length === 0) {
        <p class="text-sm text-gray-400 text-center py-8">No todos yet. Add one above!</p>
      }

      <ul class="flex flex-col gap-2">
        @for (todo of todos(); track todo.id) {
          <li class="flex items-center gap-3 bg-white border rounded-xl px-4 py-3 group">
            <input
              type="checkbox"
              [checked]="todo.completed"
              (change)="toggleTodo(todo)"
              class="w-4 h-4 accent-blue-600 cursor-pointer"
            />
            <span class="flex-1 text-sm" [class.line-through]="todo.completed" [class.text-gray-400]="todo.completed" [class.text-gray-700]="!todo.completed">
              {{ todo.title }}
            </span>
            <button
              (click)="deleteTodo(todo.id)"
              class="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-xs"
            >
              ✕
            </button>
          </li>
        }
      </ul>
    </div>
  `,
})
export class TodosComponent implements OnInit {
  private todoService = inject(TodoService);

  todos = signal<Todo[]>([]);
  loading = signal(true);
  error = signal('');
  adding = signal(false);
  input = '';

  ngOnInit() {
    this.fetchTodos();
  }

  fetchTodos() {
    this.loading.set(true);
    this.todoService.getAll().subscribe({
      next: (res) => {
        this.todos.set(res.data || []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load todos');
        this.loading.set(false);
      },
    });
  }

  handleAdd() {
    if (!this.input.trim()) return;
    this.adding.set(true);
    this.todoService.create({ title: this.input.trim() }).subscribe({
      next: (res) => {
        if (res.data) this.todos.update((list) => [res.data!, ...list]);
        this.input = '';
        this.adding.set(false);
      },
      error: () => this.adding.set(false),
    });
  }

  toggleTodo(todo: Todo) {
    this.todoService.update(todo.id, { completed: !todo.completed }).subscribe({
      next: (res) => {
        if (res.data) {
          this.todos.update((list) => list.map((t) => (t.id === todo.id ? res.data! : t)));
        }
      },
    });
  }

  deleteTodo(id: number) {
    this.todoService.delete(id).subscribe({
      next: () => this.todos.update((list) => list.filter((t) => t.id !== id)),
    });
  }
}
