import { Routes } from '@angular/router';
import { authGuard } from '@core';
import { DashboardLayoutComponent } from '@shared';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { HomeComponent } from './features/dashboard/home/home.component';
import { TodosComponent } from './features/dashboard/todos/todos.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'todos', component: TodosComponent },
    ],
  },
  { path: '', redirectTo: 'dashboard/todos', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard/todos' },
];
