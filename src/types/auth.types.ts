/**
 * Canonical auth user shape — used across the app instead of the raw Firebase User.
 * Mirrors the fields available on firebase/auth `User` that the app actually needs.
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

/** Payload for the login form / loginWithEmail service call. */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Payload for the register form / registerWithEmail service call. */
export interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
}
