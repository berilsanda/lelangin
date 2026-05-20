import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { loginWithEmail, logout, registerWithEmail } from '../auth-service';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('../firebase-config', () => ({ auth: {} }));

const mockSignIn = signInWithEmailAndPassword as jest.MockedFunction<
  typeof signInWithEmailAndPassword
>;
const mockCreateUser = createUserWithEmailAndPassword as jest.MockedFunction<
  typeof createUserWithEmailAndPassword
>;
const mockUpdateProfile = updateProfile as jest.MockedFunction<typeof updateProfile>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;

describe('auth-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginWithEmail', () => {
    it('returns UserCredential on success', async () => {
      const stubCredential = { user: { uid: 'abc123' } } as ReturnType<
        typeof signInWithEmailAndPassword
      > extends Promise<infer T>
        ? T
        : never;
      mockSignIn.mockResolvedValueOnce(stubCredential);

      const result = await loginWithEmail('user@example.com', 'password123');

      expect(mockSignIn).toHaveBeenCalledWith({}, 'user@example.com', 'password123');
      expect(result).toBe(stubCredential);
    });

    it('re-throws AuthError on failure', async () => {
      const authError = { code: 'auth/wrong-password', message: 'Wrong password' };
      mockSignIn.mockRejectedValueOnce(authError);

      await expect(loginWithEmail('user@example.com', 'wrong')).rejects.toEqual(authError);
    });
  });

  describe('registerWithEmail', () => {
    it('returns UserCredential after creating user and updating profile', async () => {
      const stubUser = { uid: 'new-user-id', displayName: null };
      const stubCredential = { user: stubUser } as ReturnType<
        typeof createUserWithEmailAndPassword
      > extends Promise<infer T>
        ? T
        : never;
      mockCreateUser.mockResolvedValueOnce(stubCredential);
      mockUpdateProfile.mockResolvedValueOnce(undefined);

      const result = await registerWithEmail('new@example.com', 'StrongPass1', 'Alice');

      expect(mockCreateUser).toHaveBeenCalledWith({}, 'new@example.com', 'StrongPass1');
      expect(mockUpdateProfile).toHaveBeenCalledWith(stubUser, { displayName: 'Alice' });
      expect(result).toBe(stubCredential);
    });

    it('re-throws when email is already in use', async () => {
      const authError = { code: 'auth/email-already-in-use', message: 'Email already in use' };
      mockCreateUser.mockRejectedValueOnce(authError);

      await expect(registerWithEmail('taken@example.com', 'pass', 'Bob')).rejects.toEqual(
        authError,
      );
    });

    it('re-throws when password is too weak', async () => {
      const authError = { code: 'auth/weak-password', message: 'Password is too weak' };
      mockCreateUser.mockRejectedValueOnce(authError);

      await expect(registerWithEmail('user@example.com', '123', 'Carol')).rejects.toEqual(
        authError,
      );
    });
  });

  describe('logout', () => {
    it('resolves without error on success', async () => {
      mockSignOut.mockResolvedValueOnce(undefined);

      await expect(logout()).resolves.toBeUndefined();
      expect(mockSignOut).toHaveBeenCalledWith({});
    });

    it('re-throws error when signOut fails', async () => {
      const authError = { code: 'auth/network-request-failed', message: 'Network error' };
      mockSignOut.mockRejectedValueOnce(authError);

      await expect(logout()).rejects.toEqual(authError);
    });
  });
});
