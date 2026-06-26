import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario } from '@entities/usuario/model';
import { setAuthToken } from '@shared/lib/httpClient';
import { STORAGE_KEYS } from '@shared/lib/constants';

interface AuthState {
  user: Usuario | null;
  token: string | null;
  login: (user: Usuario, token: string) => void;
  logout: () => void;
  setUser: (user: Usuario | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => {
        setAuthToken(token);
        set({ user, token });
      },
      logout: () => {
        setAuthToken(null);
        set({ user: null, token: null });
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: STORAGE_KEYS.USER,
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
        }
      },
    },
  ),
);

export const authSelectors = {
  user: (state: AuthState) => state.user,
  isAuthenticated: (state: AuthState) => Boolean(state.user && state.token),
};
