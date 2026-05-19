import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createAuction } from '@/services/firebase/auction-service';
import { queryKeys } from '@/services/query-keys';
import type { CreateAuctionPayload } from '@/types';

/**
 * Create a new auction.
 * On success, invalidates the entire auctions cache so all list views refresh.
 */
export function useCreateAuction() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, CreateAuctionPayload>({
    mutationFn: (payload) => createAuction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auctions.all });
    },
  });
}
