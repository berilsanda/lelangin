import { useQuery } from '@tanstack/react-query';

import { fetchAuctionById } from '@/services/firebase/auction-service';
import { queryKeys } from '@/services/query-keys';
import type { Auction } from '@/types';

/**
 * Fetch a single auction by id.
 * Data is considered fresh for 30 seconds before a background refetch is triggered.
 */
export function useAuction(id: string) {
  return useQuery<Auction, Error>({
    queryKey: queryKeys.auctions.detail(id),
    queryFn: () => fetchAuctionById(id),
    staleTime: 30_000,
    enabled: Boolean(id),
  });
}
