import { Stack } from 'expo-router';

import { CreateAuctionForm } from '@/features/auctions/components/CreateAuctionForm';

export default function CreateAuctionScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Create Auction' }} />
      <CreateAuctionForm />
    </>
  );
}
