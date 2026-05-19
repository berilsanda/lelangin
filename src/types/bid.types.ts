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
