import {
  collection,
  doc,
  type DocumentData,
  type FirestoreDataConverter,
  FirestoreError,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  type QueryDocumentSnapshot,
  runTransaction,
  serverTimestamp,
  type SnapshotOptions,
  Timestamp,
  type Unsubscribe,
  type WithFieldValue,
} from 'firebase/firestore';

import type { Bid } from '@/types';
import { BidTooLowError } from '@/types';

import { db } from './firebase-config';

const AUCTIONS_COLLECTION = 'auctions';
const BIDS_SUBCOLLECTION = 'bids';

/**
 * Firestore type-safe converter for `Bid`. Converts `Timestamp` ↔ `Date`
 * for the `timestamp` field, and folds the document id into the model.
 */
export const bidConverter: FirestoreDataConverter<Bid> = {
  toFirestore(bid: WithFieldValue<Bid>): DocumentData {
    const source = bid as Partial<Bid> & Record<string, unknown>;
    const { id, timestamp, ...rest } = source;
    void id;
    const data: DocumentData = { ...rest };
    if (timestamp instanceof Date) {
      data.timestamp = Timestamp.fromDate(timestamp);
    }
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): Bid {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      auctionId: data.auctionId,
      bidderId: data.bidderId,
      bidderName: data.bidderName ?? '',
      amount: data.amount,
      timestamp: (data.timestamp as Timestamp).toDate(),
    };
  },
};

const bidsCollection = (auctionId: string) =>
  collection(db, AUCTIONS_COLLECTION, auctionId, BIDS_SUBCOLLECTION).withConverter(bidConverter);

/**
 * Place a bid atomically using a Firestore transaction.
 * Verifies the bid amount is greater than the current highest bid,
 * updates the auction's `currentBid`, and adds a bid sub-document.
 * @throws {BidTooLowError} if amount ≤ current highest bid
 * @throws {FirestoreError} on any Firestore failure
 */
export async function placeBid(auctionId: string, amount: number, userId: string): Promise<void> {
  try {
    const auctionRef = doc(db, AUCTIONS_COLLECTION, auctionId);

    await runTransaction(db, async (transaction) => {
      const auctionSnap = await transaction.get(auctionRef);

      if (!auctionSnap.exists()) {
        throw new Error(`Auction ${auctionId} not found`);
      }

      const currentBid = auctionSnap.data().currentBid as number;

      if (amount <= currentBid) {
        throw new BidTooLowError(currentBid, amount);
      }

      transaction.update(auctionRef, { currentBid: amount });

      const bidRef = doc(collection(db, AUCTIONS_COLLECTION, auctionId, BIDS_SUBCOLLECTION));
      transaction.set(bidRef, {
        auctionId,
        bidderId: userId,
        bidderName: '',
        amount,
        timestamp: serverTimestamp(),
      });
    });
  } catch (error) {
    if (error instanceof BidTooLowError) {
      throw error;
    }
    throw error as FirestoreError;
  }
}

/**
 * Fetch the full bid history for an auction, ordered by timestamp descending.
 * @throws {FirestoreError}
 */
export async function fetchBidHistory(auctionId: string): Promise<Bid[]> {
  try {
    const q = query(bidsCollection(auctionId), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data());
  } catch (error) {
    throw error as FirestoreError;
  }
}

/**
 * Subscribe to real-time updates on the bids subcollection for an auction.
 * Returns the unsubscribe function — call it on unmount.
 */
export function subscribeToBids(auctionId: string, cb: (bids: Bid[]) => void): Unsubscribe {
  const q = query(bidsCollection(auctionId), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const bids = snapshot.docs.map((d) => d.data());
    cb(bids);
  });
}
