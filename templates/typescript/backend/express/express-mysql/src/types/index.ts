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

// Merges `user` onto Express.Request globally — no AuthRequest casting needed
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
