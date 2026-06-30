import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@types';
import { getToken, getUser, setToken, setUser, removeToken, removeUser } from '@utils';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(getUser());
  const [token, setTokenState] = useState<string | null>(getToken());

  const login = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    setTokenState(token);
    setUserState(user);
  };

  const logout = () => {
    removeToken();
    removeUser();
    setTokenState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
