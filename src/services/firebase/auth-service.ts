import {
  AuthError,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  Unsubscribe,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';

import { auth } from './firebase-config';

/**
 * Sign in an existing user with email and password.
 * @throws {AuthError} Re-thrown Firebase auth error with typed code.
 */
export async function loginWithEmail(email: string, password: string): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error as AuthError;
  }
}

/**
 * Create a new user account and set their display name in one step.
 * @throws {AuthError} Re-thrown Firebase auth error with typed code.
 */
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
): Promise<UserCredential> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    return credential;
  } catch (error) {
    throw error as AuthError;
  }
}

/**
 * Sign out the currently authenticated user.
 * @throws {AuthError} Re-thrown Firebase auth error with typed code.
 */
export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    throw error as AuthError;
  }
}

/**
 * Synchronously return the currently signed-in user, or null if none.
 * Safe to call at any point after Firebase initialises.
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Subscribe to Firebase auth state changes.
 * Returns an unsubscribe function — call it on component unmount.
 */
export function subscribeToAuthChanges(cb: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, cb);
}
