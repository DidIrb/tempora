import { Component, inject } from '@angular/core';
import { AuthService } from '@core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div>
      <h2 class="text-2xl font-bold text-gray-800 mb-1">
        Welcome, {{ auth.currentUser()?.name }} 👋
      </h2>
      <p class="text-gray-500 text-sm">Here's what's happening today.</p>
    </div>
  `,
})
export class HomeComponent {
  auth = inject(AuthService);
}
