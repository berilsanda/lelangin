import type { AuctionFilters } from '@/types';

export const queryKeys = {
  auctions: {
    all: ['auctions'] as const,
    list: (filters?: AuctionFilters) => ['auctions', 'list', filters] as const,
    detail: (id: string) => ['auctions', id] as const,
    bids: (auctionId: string) => ['auctions', auctionId, 'bids'] as const,
  },
  bids: {
    all: ['bids'] as const,
    byAuction: (auctionId: string) => [...queryKeys.bids.all, auctionId] as const,
  },
  profile: {
    all: ['profile'] as const,
    user: (uid: string) => [...queryKeys.profile.all, uid] as const,
  },
};
