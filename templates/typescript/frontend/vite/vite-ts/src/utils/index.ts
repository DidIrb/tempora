export const getToken = (): string | null => localStorage.getItem('token');
export const setToken = (token: string): void => localStorage.setItem('token', token);
export const removeToken = (): void => localStorage.removeItem('token');

export const getUser = () => {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
};
export const setUser = (user: object): void => localStorage.setItem('user', JSON.stringify(user));
export const removeUser = (): void => localStorage.removeItem('user');
