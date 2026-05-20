import { getDocs, runTransaction } from 'firebase/firestore';

import { BidTooLowError } from '@/types';

import { fetchBidHistory, placeBid } from '../bid-service';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn().mockReturnValue({
    withConverter: jest.fn().mockReturnThis(),
  }),
  doc: jest.fn().mockReturnValue({
    withConverter: jest.fn().mockReturnThis(),
  }),
  getDocs: jest.fn(),
  orderBy: jest.fn(),
  query: jest.fn(),
  runTransaction: jest.fn(),
  serverTimestamp: jest.fn(),
  Timestamp: {
    fromDate: jest.fn(),
  },
}));

jest.mock('../firebase-config', () => ({ db: {} }));

const mockRunTransaction = runTransaction as jest.MockedFunction<typeof runTransaction>;
const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;

describe('bid-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('placeBid', () => {
    it('calls runTransaction once on success', async () => {
      const mockTransaction = {
        get: jest.fn().mockResolvedValueOnce({
          exists: () => true,
          data: () => ({ currentBid: 100 }),
        }),
        update: jest.fn(),
        set: jest.fn(),
      };

      mockRunTransaction.mockImplementationOnce(async (_db, fn) => fn(mockTransaction));

      await placeBid('auction-1', 200, 'user-1');

      expect(mockRunTransaction).toHaveBeenCalledTimes(1);
    });

    it('throws BidTooLowError when amount is less than or equal to currentBid', async () => {
      const mockTransaction = {
        get: jest.fn().mockResolvedValueOnce({
          exists: () => true,
          data: () => ({ currentBid: 300 }),
        }),
        update: jest.fn(),
        set: jest.fn(),
      };

      mockRunTransaction.mockImplementationOnce(async (_db, fn) => fn(mockTransaction));

      await expect(placeBid('auction-1', 200, 'user-1')).rejects.toBeInstanceOf(BidTooLowError);
    });
  });

  describe('fetchBidHistory', () => {
    it('returns Bid[] with length matching the number of docs returned', async () => {
      const bid1 = {
        auctionId: 'auction-1',
        bidderId: 'user-1',
        bidderName: 'Alice',
        amount: 150,
        timestamp: { toDate: () => new Date('2024-01-01') },
      };
      const bid2 = {
        auctionId: 'auction-1',
        bidderId: 'user-2',
        bidderName: 'Bob',
        amount: 200,
        timestamp: { toDate: () => new Date('2024-01-02') },
      };

      mockGetDocs.mockResolvedValueOnce({
        docs: [
          { id: 'bid-1', data: () => bid1 },
          { id: 'bid-2', data: () => bid2 },
        ],
      } as ReturnType<typeof getDocs> extends Promise<infer T> ? T : never);

      const result = await fetchBidHistory('auction-1');

      expect(result).toHaveLength(2);
    });
  });
});
