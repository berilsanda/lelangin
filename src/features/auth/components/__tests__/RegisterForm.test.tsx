import { render, screen, fireEvent, waitFor, userEvent } from '@testing-library/react-native';
import type { UseMutationResult } from '@tanstack/react-query';

import type { RegisterPayload } from '@/types/auth.types';

jest.mock('../../hooks/use-register', () => ({
  useRegister: jest.fn(),
}));
jest.mock('firebase/auth', () => ({}));
jest.mock('expo-router', () => ({ useRouter: jest.fn() }));
jest.mock('@/services/firebase/firebase-config', () => ({ auth: {} }));

import { RegisterForm } from '../RegisterForm';
import { useRegister } from '../../hooks/use-register';

const mockMutate = jest.fn();
const mockUseRegister = useRegister as jest.MockedFunction<typeof useRegister>;

beforeEach(() => {
  jest.clearAllMocks();
  mockUseRegister.mockReturnValue({
    mutate: mockMutate,
    isPending: false,
    error: null,
  } as unknown as UseMutationResult<undefined, Error, RegisterPayload>);
});

describe('RegisterForm', () => {
  describe('validation', () => {
    it('shows error when displayName is empty', async () => {
      render(<RegisterForm />);
      fireEvent.press(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText('Display name must be at least 2 characters')).toBeTruthy();
      });
    });

    it('shows error when email is invalid', async () => {
      render(<RegisterForm />);
      fireEvent.changeText(screen.getByPlaceholderText('Your name'), 'Alice');
      fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'not-an-email');
      fireEvent.press(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeTruthy();
      });
    });

    it('shows error when password is too short', async () => {
      render(<RegisterForm />);
      fireEvent.changeText(screen.getByPlaceholderText('Your name'), 'Alice');
      fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'alice@example.com');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      fireEvent.changeText(passwordInputs[0], 'short');
      fireEvent.press(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters')).toBeTruthy();
      });
    });

    it('shows "Passwords do not match" when confirmPassword differs', async () => {
      render(<RegisterForm />);
      fireEvent.changeText(screen.getByPlaceholderText('Your name'), 'Alice');
      fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'alice@example.com');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      fireEvent.changeText(passwordInputs[0], 'StrongPass1');
      fireEvent.changeText(passwordInputs[1], 'DifferentPass1');
      fireEvent.press(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeTruthy();
      });
    });
  });

  describe('valid submission', () => {
    it('calls mutate with email, password, and displayName when form is valid', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByPlaceholderText('Your name'), 'Alice');
      await user.type(screen.getByPlaceholderText('you@example.com'), 'alice@example.com');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      await user.type(passwordInputs[0], 'StrongPass1');
      await user.type(passwordInputs[1], 'StrongPass1');

      fireEvent.press(screen.getByRole('button'));

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          email: 'alice@example.com',
          password: 'StrongPass1',
          displayName: 'Alice',
        });
      });
    });
  });
});
