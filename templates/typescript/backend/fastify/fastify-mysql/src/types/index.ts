import { FastifyRequest } from 'fastify';

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface SignupBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface TodoBody {
  title: string;
  completed?: boolean;
}

export interface TodoParams {
  id: string;
}

// Extend Fastify's type to include decoded JWT user on every request
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}
