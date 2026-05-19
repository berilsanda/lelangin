import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { Bid } from '@/types/bid.types';
import { formatCurrency } from '@/utils/currency';
import { maskName } from '@/utils/string';

export interface BidHistoryItemProps {
  bid: Bid;
}

function BidHistoryItemComponent({ bid }: BidHistoryItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.bidder}>{maskName(bid.bidderName)}</Text>
      <Text style={styles.amount}>{formatCurrency(bid.amount)}</Text>
      <Text style={styles.timestamp}>
        {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
      </Text>
    </View>
  );
}

export const BidHistoryItem = React.memo(BidHistoryItemComponent);

const styles = StyleSheet.create({
  amount: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
  },
  bidder: {
    color: colors.textPrimary,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
  },
  container: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  timestamp: {
    color: colors.textSecondary,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
  },
});
