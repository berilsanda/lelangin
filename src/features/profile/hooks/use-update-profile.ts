import { useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchUserProfile, updateUserProfile } from '@/services/firebase/user-service';
import { queryKeys } from '@/services/query-keys';
import { useAuthStore } from '@/store/auth-store';
import type { AuthUser } from '@/types/auth.types';
import type { UserProfile } from '@/types';

/**
 * Update a user profile by uid.
 * On success:
 *  1. Invalidates the profile cache so any `useProfile` subscriber refetches.
 *  2. Fetches the fresh profile and syncs the auth store so the in-memory
 *     `AuthUser` reflects the latest display name / avatar.
 */
export function useUpdateProfile(uid: string) {
  const queryClient = useQueryClient();

  return useMutation<undefined, Error, Partial<UserProfile>>({
    mutationFn: (payload) => updateUserProfile(uid, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile.user(uid) });

      const freshProfile = await fetchUserProfile(uid);
      const token = useAuthStore.getState().token;

      if (token) {
        const updatedUser: AuthUser = {
          uid: freshProfile.uid,
          email: freshProfile.email,
          displayName: freshProfile.displayName,
          photoURL: freshProfile.avatarUrl,
          emailVerified: useAuthStore.getState().user?.emailVerified ?? false,
        };
        useAuthStore.getState().setAuth(updatedUser, token);
      }
    },
  });
}
