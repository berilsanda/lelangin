import { create } from 'zustand';

interface AuthState {
  isLoading: boolean;
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  error: string | null;
}

interface AuthActions {
  setUser: (user: AuthState['user']) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  isLoading: true,
  user: null,
  error: null,
  setUser: (user) => set({ user, isLoading: false }),
  setError: (error) => set({ error, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  clearAuth: () => set({ user: null, error: null, isLoading: false }),
}));
