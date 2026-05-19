export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: Date;
}

export interface PlaceBidInput {
  auctionId: string;
  amount: number;
}

export class BidTooLowError extends Error {
  constructor(currentHighest: number, attemptedAmount: number) {
    super(
      `Bid of ${attemptedAmount} is too low. Must be greater than current highest bid of ${currentHighest}.`,
    );
    this.name = 'BidTooLowError';
  }
}
