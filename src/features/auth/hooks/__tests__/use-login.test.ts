import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { type AuthUser } from '@/types/auth.types';
import { loginWithEmail } from '@/services/firebase/auth-service';
import { useAuthStore } from '@/store/auth-store';

import { useLogin } from '../use-login';

jest.mock('firebase/auth', () => ({}));
jest.mock('@/services/firebase/firebase-config', () => ({ auth: {} }));
jest.mock('@/services/firebase/auth-service');
jest.mock('@/store/auth-store');
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: jest.fn() }) }));

const mockLoginWithEmail = loginWithEmail as jest.MockedFunction<typeof loginWithEmail>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

const mockSetAuth = jest.fn();

const mockAuthUser: AuthUser = {
  uid: 'uid-123',
  email: 'user@example.com',
  displayName: 'Test User',
  photoURL: null,
  emailVerified: true,
};

const makeWrapper = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client }, children);
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuthStore.mockImplementation((selector) =>
    selector({
      user: null,
      token: null,
      isHydrated: false,
      setAuth: mockSetAuth,
      clearAuth: jest.fn(),
      setHydrated: jest.fn(),
    }),
  );
});

describe('useLogin', () => {
  it('calls setAuth with the returned user and token on success', async () => {
    const fakeToken = 'fake-id-token';
    const getIdToken = jest.fn().mockResolvedValue(fakeToken);
    const fakeCredential = {
      user: {
        uid: mockAuthUser.uid,
        email: mockAuthUser.email,
        displayName: mockAuthUser.displayName,
        photoURL: mockAuthUser.photoURL,
        emailVerified: mockAuthUser.emailVerified,
        getIdToken,
      },
    };
    mockLoginWithEmail.mockResolvedValue(fakeCredential as never);

    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper() });

    result.current.mutate({ email: 'user@example.com', password: 'password123' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockSetAuth).toHaveBeenCalledTimes(1);
    expect(mockSetAuth).toHaveBeenCalledWith(mockAuthUser, fakeToken);
  });

  it('exposes the mapped error message on mutation error', async () => {
    const firebaseError = Object.assign(new Error('Firebase error'), {
      code: 'auth/invalid-credential',
    });
    mockLoginWithEmail.mockRejectedValue(firebaseError);

    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper() });

    result.current.mutate({ email: 'bad@example.com', password: 'wrong' });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Invalid email or password.');
  });
});
