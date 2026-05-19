import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AuctionDetail } from '@/features/auctions/components/AuctionDetail';
import { useAuction, useAuctionRealtime } from '@/features/auctions/hooks';

export default function AuctionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: auction, isLoading } = useAuction(id);
  useAuctionRealtime(id);

  if (isLoading || !auction) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <AuctionDetail auction={auction} />;
}

const styles = StyleSheet.create({
  loader: { alignItems: 'center', flex: 1, justifyContent: 'center' },
});
