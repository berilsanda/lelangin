import { useMutation, useQueryClient } from '@tanstack/react-query';

import { placeBid } from '@/services/firebase/bid-service';
import { queryKeys } from '@/services/query-keys';

interface PlaceBidVariables {
  amount: number;
  userId: string;
}

/**
 * Place a bid on an auction.
 * On success, invalidates the auction detail and bid history caches
 * so UI reflects the new bid immediately.
 */
export function usePlaceBid(auctionId: string) {
  const queryClient = useQueryClient();

  return useMutation<undefined, Error, PlaceBidVariables>({
    mutationFn: ({ amount, userId }) => placeBid(auctionId, amount, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.auctions.detail(auctionId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.bids.byAuction(auctionId),
      });
    },
  });
}
