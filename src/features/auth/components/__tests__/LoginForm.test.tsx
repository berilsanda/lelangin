import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, userEvent } from '@testing-library/react-native';

// Must mock transitive firebase deps before any module under test is imported
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));
jest.mock('@/services/firebase/firebase-config', () => ({ auth: {} }));
jest.mock('expo-router', () => ({ useRouter: jest.fn(() => ({ replace: jest.fn() })) }));
jest.mock('expo-secure-store');
jest.mock('zustand/middleware', () => ({
  ...jest.requireActual('zustand/middleware'),
  persist: (fn: unknown) => fn,
}));

jest.mock('../../hooks/use-login');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useLogin } = require('../../hooks/use-login') as {
  useLogin: jest.MockedFunction<
    () => { mutate: jest.Mock; isPending: boolean; error: Error | null }
  >;
};

import { LoginForm } from '../LoginForm';

function renderWithProviders(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

const defaultMock = { mutate: jest.fn(), isPending: false, error: null };

beforeEach(() => {
  jest.clearAllMocks();
  useLogin.mockReturnValue(defaultMock);
});

describe('LoginForm', () => {
  it('renders email input and password input', () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('••••••••')).toBeTruthy();
  });

  it('submitting empty form shows validation errors for email and password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.press(screen.getByRole('button'));

    expect(await screen.findByText('Please enter a valid email address')).toBeTruthy();
    expect(await screen.findByText('Password must be at least 8 characters')).toBeTruthy();
  });

  it('submitting invalid email format shows email validation error', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByPlaceholderText('you@example.com'), 'not-an-email');
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
    await user.press(screen.getByRole('button'));

    expect(await screen.findByText('Please enter a valid email address')).toBeTruthy();
  });

  it('password shorter than 8 chars shows min-length error', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByPlaceholderText('you@example.com'), 'user@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'short');
    await user.press(screen.getByRole('button'));

    expect(await screen.findByText('Password must be at least 8 characters')).toBeTruthy();
  });

  it('valid submission calls the mutate function from useLogin', async () => {
    const mutate = jest.fn();
    useLogin.mockReturnValue({ mutate, isPending: false, error: null });

    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByPlaceholderText('you@example.com'), 'user@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
    await user.press(screen.getByRole('button'));

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' });
  });

  it('when isPending is true, submit button is disabled and shows ActivityIndicator', () => {
    useLogin.mockReturnValue({ mutate: jest.fn(), isPending: true, error: null });

    renderWithProviders(<LoginForm />);

    const button = screen.getByRole('button');
    expect(button.props.accessibilityState?.disabled).toBe(true);
    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });
});
