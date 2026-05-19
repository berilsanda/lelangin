import { useInfiniteQuery } from '@tanstack/react-query';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

import { fetchAuctions } from '@/services/firebase/auction-service';
import { queryKeys } from '@/services/query-keys';
import type { Auction, AuctionFilters } from '@/types';

const DEFAULT_PAGE_SIZE = 20;

/**
 * Paginated auction list using Firestore cursor-based pagination.
 *
 * `pageParam` carries the `QueryDocumentSnapshot<Auction>` cursor returned by
 * the previous page. On the first fetch it is `undefined` (start of collection).
 *
 * NOTE: `fetchAuctions` currently returns `Auction[]` without exposing the raw
 * snapshot cursor. Until the service is updated to return the last snapshot,
 * `getNextPageParam` uses the page-length heuristic: a page shorter than
 * `pageSize` signals the end of the collection.
 */
export function useAuctions(filters?: Omit<AuctionFilters, 'cursor'>) {
  const pageSize = filters?.pageSize ?? DEFAULT_PAGE_SIZE;

  return useInfiniteQuery<
    Auction[],
    Error,
    { pages: Auction[][]; pageParams: Array<QueryDocumentSnapshot<Auction> | undefined> },
    ReturnType<typeof queryKeys.auctions.list>,
    QueryDocumentSnapshot<Auction> | undefined
  >({
    queryKey: queryKeys.auctions.list({ ...filters, pageSize }),
    queryFn: ({ pageParam }) => fetchAuctions({ ...filters, pageSize, cursor: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      // When the service exposes the last snapshot, return it here as the cursor.
      // Until then, returning undefined stops pagination after the first page
      // if the page is full — callers can trigger re-fetch manually.
      if (lastPage.length < pageSize) return undefined;
      // Cannot derive cursor from Auction[] — signal no further pages for now.
      return undefined;
    },
  });
}
