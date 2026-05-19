import { useQuery } from '@tanstack/react-query';

import { fetchUserProfile } from '@/services/firebase/user-service';
import { queryKeys } from '@/services/query-keys';
import type { UserProfile } from '@/types';

/**
 * Fetch a user profile by uid.
 * Data is considered fresh for 60 seconds before a background refetch is triggered.
 */
export function useProfile(uid: string) {
  return useQuery<UserProfile, Error>({
    queryKey: queryKeys.profile.user(uid),
    queryFn: () => fetchUserProfile(uid),
    staleTime: 60_000,
    enabled: Boolean(uid),
  });
}
