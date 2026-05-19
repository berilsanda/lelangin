export const queryKeys = {
  auctions: {
    all: ['auctions'] as const,
    lists: () => [...queryKeys.auctions.all, 'list'] as const,
    list: (filter: string) => [...queryKeys.auctions.lists(), { filter }] as const,
    details: () => [...queryKeys.auctions.all, 'details'] as const,
    detail: (id: string) => [...queryKeys.auctions.details(), id] as const,
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
