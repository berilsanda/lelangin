export interface Auction {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  endTime: Date;
  sellerId: string;
  sellerName: string;
  imageUrl: string | null;
  status: 'active' | 'ended' | 'cancelled';
  createdAt: Date;
}

export interface CreateAuctionInput {
  title: string;
  description: string;
  startingPrice: number;
  endTime: Date;
  imageUrl: string | null;
}
