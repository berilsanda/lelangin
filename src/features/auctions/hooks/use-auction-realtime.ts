import { useEffect } from 'react';

import { subscribeToAuction } from '@/services/firebase/auction-service';
import { queryClient } from '@/services/query-client';
import { queryKeys } from '@/services/query-keys';
import type { Auction } from '@/types';

/**
 * Subscribe to real-time Firestore updates for a single auction.
 * Pushes each snapshot directly into the TanStack Query cache so the UI
 * stays in sync without polling. Cleans up the listener on unmount.
 */
export function useAuctionRealtime(id: string): void {
  useEffect(() => {
    if (!id) return;

    const unsubscribe = subscribeToAuction(id, (auction: Auction) => {
      queryClient.setQueryData(queryKeys.auctions.detail(id), auction);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);
}
