import {
  addDoc,
  collection,
  doc,
  type DocumentData,
  type FirestoreDataConverter,
  FirestoreError,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  type PartialWithFieldValue,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  query,
  setDoc,
  type SnapshotOptions,
  startAfter,
  Timestamp,
  type Unsubscribe,
  where,
  type WithFieldValue,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import type { Auction, AuctionFilters, CreateAuctionPayload } from '@/types';

import { db, storage } from './firebase-config';

const AUCTIONS_COLLECTION = 'auctions';
const DEFAULT_PAGE_SIZE = 20;

/**
 * Firestore type-safe converter for `Auction`. Converts `Timestamp` <-> `Date`
 * for `createdAt` and `endAt`, and folds the document id into the model.
 */
export const auctionConverter: FirestoreDataConverter<Auction> = {
  toFirestore(auction: WithFieldValue<Auction> | PartialWithFieldValue<Auction>): DocumentData {
    const source = auction as Partial<Auction> & Record<string, unknown>;
    const { id, createdAt, endAt, ...rest } = source;
    void id;
    const data: DocumentData = { ...rest };
    if (createdAt instanceof Date) data.createdAt = Timestamp.fromDate(createdAt);
    if (endAt instanceof Date) data.endAt = Timestamp.fromDate(endAt);
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): Auction {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      description: data.description,
      startingBid: data.startingBid,
      currentBid: data.currentBid,
      reservePrice: data.reservePrice,
      status: data.status,
      images: data.images ?? [],
      sellerId: data.sellerId,
      createdAt: (data.createdAt as Timestamp).toDate(),
      endAt: (data.endAt as Timestamp).toDate(),
    };
  },
};

const auctionsCollection = () =>
  collection(db, AUCTIONS_COLLECTION).withConverter(auctionConverter);
const auctionDoc = (id: string) => doc(db, AUCTIONS_COLLECTION, id).withConverter(auctionConverter);

/**
 * Fetch a single page of auctions. Always paginated via Firestore cursor —
 * never reads the full collection. Pass `filters.cursor` (the last
 * `QueryDocumentSnapshot<Auction>` from the previous page) to fetch the next
 * page.
 * @throws {FirestoreError}
 */
export async function fetchAuctions(filters?: AuctionFilters): Promise<Auction[]> {
  try {
    const constraints: QueryConstraint[] = [];
    if (filters?.status) constraints.push(where('status', '==', filters.status));
    if (filters?.sellerId) constraints.push(where('sellerId', '==', filters.sellerId));
    constraints.push(orderBy('createdAt', 'desc'));
    if (filters?.cursor) constraints.push(startAfter(filters.cursor));
    constraints.push(limit(filters?.pageSize ?? DEFAULT_PAGE_SIZE));

    const snapshot = await getDocs(query(auctionsCollection(), ...constraints));
    return snapshot.docs.map((d) => d.data());
  } catch (error) {
    throw error as FirestoreError;
  }
}

/**
 * Fetch a single auction by id.
 * @throws {FirestoreError} if the document does not exist or the read fails.
 */
export async function fetchAuctionById(id: string): Promise<Auction> {
  try {
    const snapshot = await getDoc(auctionDoc(id));
    const data = snapshot.data();
    if (!data) {
      throw new Error(`Auction ${id} not found`);
    }
    return data;
  } catch (error) {
    throw error as FirestoreError;
  }
}

/**
 * Create a new auction. Returns the new document id.
 * `currentBid` initialises to `startingBid`, `status` defaults to `'active'`,
 * `createdAt` is set to the server's current time at call site.
 * @throws {FirestoreError}
 */
export async function createAuction(payload: CreateAuctionPayload): Promise<string> {
  try {
    const auction: Omit<Auction, 'id'> = {
      title: payload.title,
      description: payload.description,
      startingBid: payload.startingBid,
      currentBid: payload.startingBid,
      reservePrice: payload.reservePrice,
      images: payload.images,
      sellerId: payload.sellerId,
      status: 'active',
      createdAt: new Date(),
      endAt: payload.endAt,
    };
    const ref = await addDoc(auctionsCollection(), auction as WithFieldValue<Auction>);
    return ref.id;
  } catch (error) {
    throw error as FirestoreError;
  }
}

/**
 * Patch an existing auction. Uses `setDoc(..., { merge: true })` with the
 * converter so any `Date` fields are translated to `Timestamp` automatically.
 * @throws {FirestoreError}
 */
export async function updateAuction(id: string, payload: Partial<Auction>): Promise<void> {
  try {
    await setDoc(auctionDoc(id), payload as PartialWithFieldValue<Auction>, { merge: true });
  } catch (error) {
    throw error as FirestoreError;
  }
}

/**
 * Mark an auction as closed.
 * @throws {FirestoreError}
 */
export async function closeAuction(id: string): Promise<void> {
  try {
    await setDoc(auctionDoc(id), { status: 'closed' } as PartialWithFieldValue<Auction>, {
      merge: true,
    });
  } catch (error) {
    throw error as FirestoreError;
  }
}

/**
 * Subscribe to real-time updates for a single auction. Returns the
 * unsubscribe function — call it on unmount.
 */
export function subscribeToAuction(id: string, cb: (auction: Auction) => void): Unsubscribe {
  return onSnapshot(auctionDoc(id), (snapshot) => {
    const data = snapshot.data();
    if (data) cb(data);
  });
}

/**
 * Upload an array of local image URIs to Firebase Storage under
 * `auctions/{sellerId}/{filename}` and return the public download URLs.
 * @throws {Error} if any upload fails
 */
export async function uploadAuctionImages(sellerId: string, uris: string[]): Promise<string[]> {
  const uploads = uris.map(async (uri) => {
    const filename = uri.split('/').pop() ?? `${Date.now()}.jpg`;
    const storageRef = ref(storage, `auctions/${sellerId}/${filename}`);
    const response = await fetch(uri);
    const blob = await response.blob();
    const snapshot = await uploadBytes(storageRef, blob);
    return getDownloadURL(snapshot.ref);
  });
  return Promise.all(uploads);
}
