import { Component, inject } from '@angular/core';
import { AuthService } from '@core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <header class="h-14 bg-white border-b flex items-center justify-between px-6">
      <input
        type="text"
        placeholder="Search..."
        class="w-64 px-4 py-1.5 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
          {{ initial() }}
        </div>
        <span class="text-sm font-medium text-gray-700">{{ auth.currentUser()?.name }}</span>
        <button (click)="auth.logout()" class="text-sm text-gray-500 hover:text-red-500 transition-colors">
          Logout
        </button>
      </div>
    </header>
  `,
})
export class NavbarComponent {
  auth = inject(AuthService);
  initial = () => this.auth.currentUser()?.name?.charAt(0).toUpperCase() ?? '?';
}
