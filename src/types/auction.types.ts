import type { QueryDocumentSnapshot } from 'firebase/firestore';

/** Lifecycle states for an auction. */
export type AuctionStatus = 'active' | 'closed' | 'pending';

/**
 * Canonical Auction shape used across the app.
 * `createdAt` and `endAt` are stored as Firestore `Timestamp` and converted
 * to native `Date` by the `auctionConverter` on read.
 */
export interface Auction {
  id: string;
  title: string;
  description: string;
  startingBid: number;
  currentBid: number;
  reservePrice?: number;
  status: AuctionStatus;
  images: string[];
  sellerId: string;
  createdAt: Date;
  endAt: Date;
}

/**
 * Filters / pagination cursor passed to `fetchAuctions`.
 * `cursor` is a Firestore `QueryDocumentSnapshot<Auction>` returned from a
 * previous page — pass it back in to fetch the next page via `startAfter`.
 */
export interface AuctionFilters {
  status?: AuctionStatus;
  sellerId?: string;
  pageSize?: number;
  cursor?: QueryDocumentSnapshot<Auction>;
}

/**
 * Payload accepted by `createAuction`.
 * `currentBid` is initialised from `startingBid` and `status` defaults to
 * `'active'` inside the service, so callers don't need to supply them.
 */
export interface CreateAuctionPayload {
  title: string;
  description: string;
  startingBid: number;
  reservePrice?: number;
  images: string[];
  sellerId: string;
  endAt: Date;
}
