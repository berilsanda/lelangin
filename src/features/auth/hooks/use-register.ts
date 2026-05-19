import { useMutation } from '@tanstack/react-query';
import { AuthError } from 'firebase/auth';
import { useRouter } from 'expo-router';

import { registerWithEmail } from '@/services/firebase/auth-service';
import { useAuthStore } from '@/store/auth-store';
import type { AuthUser, RegisterPayload } from '@/types/auth.types';

function mapAuthErrorCode(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 8 characters.';
    default:
      return 'Registration failed. Please try again.';
  }
}

export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation<undefined, Error, RegisterPayload>({
    mutationFn: async ({ email, password, displayName }) => {
      try {
        const credential = await registerWithEmail(email, password, displayName);
        const token = await credential.user.getIdToken();
        const authUser: AuthUser = {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName,
          photoURL: credential.user.photoURL,
          emailVerified: credential.user.emailVerified,
        };
        setAuth(authUser, token);
      } catch (err) {
        const authError = err as AuthError;
        throw new Error(
          authError.code
            ? mapAuthErrorCode(authError.code)
            : 'Registration failed. Please try again.',
        );
      }
    },
    onSuccess: () => {
      router.replace('/(tabs)/');
    },
  });
}
