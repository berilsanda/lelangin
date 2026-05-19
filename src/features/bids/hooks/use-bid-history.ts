import { useQuery } from '@tanstack/react-query';

import { fetchBidHistory } from '@/services/firebase/bid-service';
import { queryKeys } from '@/services/query-keys';
import type { Bid } from '@/types';

/**
 * Fetch the bid history for an auction, ordered by most recent first.
 * Only enabled when `auctionId` is truthy.
 */
export function useBidHistory(auctionId: string) {
  return useQuery<Bid[], Error>({
    queryKey: queryKeys.bids.byAuction(auctionId),
    queryFn: () => fetchBidHistory(auctionId),
    enabled: Boolean(auctionId),
  });
}
