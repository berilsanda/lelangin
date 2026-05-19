import { useMutation } from '@tanstack/react-query';
import { AuthError } from 'firebase/auth';
import { useRouter } from 'expo-router';

import { loginWithEmail } from '@/services/firebase/auth-service';
import { useAuthStore } from '@/store/auth-store';
import type { AuthUser, LoginPayload } from '@/types/auth.types';

function mapAuthErrorCode(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    default:
      return 'Sign in failed. Please try again.';
  }
}

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation<undefined, Error, LoginPayload>({
    mutationFn: async ({ email, password }) => {
      try {
        const credential = await loginWithEmail(email, password);
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
          authError.code ? mapAuthErrorCode(authError.code) : 'Sign in failed. Please try again.',
        );
      }
    },
    onSuccess: () => {
      router.replace('/(tabs)/');
    },
  });
}
