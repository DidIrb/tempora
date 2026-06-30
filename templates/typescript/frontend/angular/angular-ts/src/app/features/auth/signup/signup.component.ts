import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-1">Create account</h2>
        <p class="text-sm text-gray-500 mb-6">Get started for free</p>

        @if (error()) {
          <p class="text-sm text-red-500 mb-4 bg-red-50 p-3 rounded-lg">{{ error() }}</p>
        }

        <form (ngSubmit)="handleSubmit()" class="flex flex-col gap-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              [(ngModel)]="name"
              name="name"
              class="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              [(ngModel)]="email"
              name="email"
              class="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              [(ngModel)]="password"
              name="password"
              class="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            [disabled]="loading()"
            class="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {{ loading() ? 'Creating account...' : 'Create account' }}
          </button>
        </form>

        <p class="text-sm text-center text-gray-500 mt-4">
          Already have an account?
          <a routerLink="/login" class="text-blue-600 hover:underline font-medium">Sign in</a>
        </p>
      </div>
    </div>
  `,
})
export class SignupComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  handleSubmit() {
    this.error.set('');
    this.loading.set(true);
    this.auth.signup({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard/todos']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Signup failed');
      },
    });
  }
}
