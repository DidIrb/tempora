import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-56 min-h-screen bg-gray-900 text-white flex flex-col py-8 px-4 gap-2">
      <h1 class="text-xl font-bold mb-6 px-2">MyApp</h1>
      <a routerLink="/dashboard" routerLinkActive="bg-blue-600 text-white" [routerLinkActiveOptions]="{exact: true}"
         class="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors">
        🏠 Home
      </a>
      <a routerLink="/dashboard/todos" routerLinkActive="bg-blue-600 text-white"
         class="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors">
        ✅ Todos
      </a>
    </aside>
  `,
})
export class SidebarComponent {}
