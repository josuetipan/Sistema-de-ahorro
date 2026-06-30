import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario } from '@entities/usuario/model';
import { setAuthToken } from '@shared/lib/httpClient';
import { STORAGE_KEYS } from '@shared/lib/constants';

interface AuthState {
  user: Usuario | null;
  token: string | null;
  refreshToken: string | null;
  login: (user: Usuario, token: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: Usuario | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      login: (user, token, refreshToken) => {
        setAuthToken(token, refreshToken);
        set({ user, token, refreshToken });
      },
      logout: () => {
        setAuthToken(null);
        set({ user: null, token: null, refreshToken: null });
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: STORAGE_KEYS.USER,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token, state.refreshToken);
        }
      },
    },
  ),
);

export const authSelectors = {
  user: (state: AuthState) => state.user,
  isAuthenticated: (state: AuthState) => Boolean(state.user && state.token),
};
