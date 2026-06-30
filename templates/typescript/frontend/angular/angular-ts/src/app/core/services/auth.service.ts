import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '@env';
import { ApiResponse, AuthResponse, LoginRequest, SignupRequest, User } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  // Signal so components react to auth state changes
  currentUser = signal<User | null>(this.getStoredUser());

  constructor(private http: HttpClient, private router: Router) {}

  signup(body: SignupRequest) {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/api/auth/signup`, body)
      .pipe(tap((res) => this.handleAuth(res)));
  }

  login(body: LoginRequest) {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/api/auth/login`, body)
      .pipe(tap((res) => this.handleAuth(res)));
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private handleAuth(res: ApiResponse<AuthResponse>) {
    if (res.data) {
      localStorage.setItem(this.TOKEN_KEY, res.data.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user));
      this.currentUser.set(res.data.user);
    }
  }

  private getStoredUser(): User | null {
    const u = localStorage.getItem(this.USER_KEY);
    return u ? JSON.parse(u) : null;
  }
}
