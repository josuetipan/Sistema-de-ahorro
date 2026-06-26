// Hook para acceder al estado de autenticación desde Zustand
import { useAuthStore } from '@features/auth';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = Boolean(user && token);

  return { user, token, isAuthenticated, login, logout, setUser };
}
