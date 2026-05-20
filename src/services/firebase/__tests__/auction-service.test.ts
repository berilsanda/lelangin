import { addDoc, getDocs, getDoc, setDoc } from 'firebase/firestore';

import type { Auction, CreateAuctionPayload } from '@/types';

import { fetchAuctions, fetchAuctionById, createAuction, closeAuction } from '../auction-service';

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

jest.mock('firebase/firestore', () => {
  const withConverter = jest.fn().mockReturnThis();
  return {
    collection: jest.fn(() => ({ withConverter })),
    doc: jest.fn(() => ({ withConverter })),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
    addDoc: jest.fn(),
    setDoc: jest.fn(),
    query: jest.fn((...args: unknown[]) => args[0]),
    orderBy: jest.fn(),
    where: jest.fn(),
    limit: jest.fn(),
    startAfter: jest.fn(),
    Timestamp: {
      fromDate: jest.fn((d: Date) => ({ toDate: () => d })),
    },
  };
});

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock('../firebase-config', () => ({
  db: {},
  storage: {},
}));

// ---------------------------------------------------------------------------
// Typed mock helpers
// ---------------------------------------------------------------------------

const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>;

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const now = new Date('2025-01-01T00:00:00.000Z');
const endDate = new Date('2025-02-01T00:00:00.000Z');

const makeAuction = (id: string): Auction => ({
  id,
  title: `Auction ${id}`,
  description: 'A test auction',
  startingBid: 100,
  currentBid: 100,
  status: 'active',
  images: ['https://example.com/img.jpg'],
  sellerId: 'seller-1',
  createdAt: now,
  endAt: endDate,
});

const auction1 = makeAuction('auction-1');
const auction2 = makeAuction('auction-2');

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('auction-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // fetchAuctions
  // -------------------------------------------------------------------------

  describe('fetchAuctions', () => {
    it('returns an Auction[] of length 2 when snapshot has 2 docs', async () => {
      mockGetDocs.mockResolvedValueOnce({
        docs: [{ data: () => auction1 }, { data: () => auction2 }],
      } as ReturnType<typeof getDocs> extends Promise<infer T> ? T : never);

      const result = await fetchAuctions();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(auction1);
      expect(result[1]).toEqual(auction2);
    });

    it('returns [] when snapshot is empty', async () => {
      mockGetDocs.mockResolvedValueOnce({
        docs: [],
      } as ReturnType<typeof getDocs> extends Promise<infer T> ? T : never);

      const result = await fetchAuctions();

      expect(result).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // fetchAuctionById
  // -------------------------------------------------------------------------

  describe('fetchAuctionById', () => {
    it('returns the correct Auction when the document exists', async () => {
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => auction1,
      } as ReturnType<typeof getDoc> extends Promise<infer T> ? T : never);

      const result = await fetchAuctionById('auction-1');

      expect(result).toEqual(auction1);
    });

    it('throws an error containing the auction id when the document does not exist', async () => {
      mockGetDoc.mockResolvedValueOnce({
        exists: () => false,
        data: () => undefined,
      } as ReturnType<typeof getDoc> extends Promise<infer T> ? T : never);

      await expect(fetchAuctionById('missing-id')).rejects.toThrow('missing-id');
    });
  });

  // -------------------------------------------------------------------------
  // createAuction
  // -------------------------------------------------------------------------

  describe('createAuction', () => {
    it('returns the new document id and calls addDoc once', async () => {
      mockAddDoc.mockResolvedValueOnce({
        id: 'new-id',
      } as ReturnType<typeof addDoc> extends Promise<infer T> ? T : never);

      const payload: CreateAuctionPayload = {
        title: 'New Auction',
        description: 'Description',
        startingBid: 500,
        images: ['https://example.com/img.jpg'],
        sellerId: 'seller-1',
        endAt: endDate,
      };

      const result = await createAuction(payload);

      expect(result).toBe('new-id');
      expect(mockAddDoc).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // closeAuction
  // -------------------------------------------------------------------------

  describe('closeAuction', () => {
    it('calls setDoc with a payload containing { status: "closed" }', async () => {
      mockSetDoc.mockResolvedValueOnce(undefined);

      await closeAuction('auction-1');

      expect(mockSetDoc).toHaveBeenCalledTimes(1);
      const [, payload] = mockSetDoc.mock.calls[0];
      expect(payload).toMatchObject({ status: 'closed' });
    });
  });
});
