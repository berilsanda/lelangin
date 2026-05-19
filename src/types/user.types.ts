export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  createdAt: Date;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;
  totalAuctionsWon: number;
  activeListings: number;
}
