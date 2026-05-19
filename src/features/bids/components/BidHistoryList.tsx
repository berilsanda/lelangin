import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { Bid } from '@/types/bid.types';

import { BidHistoryItem } from './BidHistoryItem';

interface BidHistoryListProps {
  bids: Bid[];
  isLoading: boolean;
}

function BidHistoryListComponent({ bids, isLoading }: BidHistoryListProps) {
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (bids.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No bids yet</Text>
      </View>
    );
  }

  return (
    <FlashList
      data={bids}
      keyExtractor={(bid) => bid.id}
      renderItem={({ item }) => <BidHistoryItem bid={item} />}
      inverted
    />
  );
}

export const BidHistoryList = React.memo(BidHistoryListComponent);

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    color: colors.textSecondary,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
  },
});
