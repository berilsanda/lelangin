import type { AuthUser } from '@/types/auth.types';

import { useAuthStore } from '../auth-store';

jest.mock('expo-secure-store');

jest.mock('zustand/middleware', () => ({
  ...jest.requireActual('zustand/middleware'),
  persist: (fn: unknown) => fn,
}));

const initialState = {
  user: null,
  token: null,
  isHydrated: false,
};

const mockUser: AuthUser = {
  uid: 'u1',
  email: 'test@test.com',
  displayName: 'Test',
  photoURL: null,
  emailVerified: true,
};

beforeEach(() => {
  useAuthStore.setState(initialState);
});

describe('useAuthStore', () => {
  it('has correct initial state', () => {
    const { user, token, isHydrated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
    expect(isHydrated).toBe(false);
  });

  it('setAuth updates user and token', () => {
    useAuthStore.getState().setAuth(mockUser, 'token123');
    const { user, token } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(token).toBe('token123');
  });

  it('clearAuth sets user and token to null', () => {
    useAuthStore.getState().setAuth(mockUser, 'token123');
    useAuthStore.getState().clearAuth();
    const { user, token } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
  });

  it('setHydrated sets isHydrated to true', () => {
    useAuthStore.getState().setHydrated();
    expect(useAuthStore.getState().isHydrated).toBe(true);
  });
});
