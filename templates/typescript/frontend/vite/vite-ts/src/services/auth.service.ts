import { http } from './http';
import { ApiResponse, AuthResponse, LoginForm, SignupForm } from '@types';

export const authService = {
  signup: (data: SignupForm) =>
    http.post<ApiResponse<AuthResponse>>('/api/auth/signup', data),

  login: (data: LoginForm) =>
    http.post<ApiResponse<AuthResponse>>('/api/auth/login', data),
};
