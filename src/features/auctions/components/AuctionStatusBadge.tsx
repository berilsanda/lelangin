import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { borderRadius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { AuctionStatus } from '@/types';

interface Props {
  status: AuctionStatus;
}

const STATUS_LABELS: Record<AuctionStatus, string> = {
  active: 'Active',
  closed: 'Closed',
  pending: 'Pending',
};

const STATUS_COLORS: Record<AuctionStatus, { bg: string; text: string }> = {
  active: { bg: '#DCFCE7', text: '#15803D' },
  closed: { bg: '#FEE2E2', text: '#B91C1C' },
  pending: { bg: '#FEF9C3', text: '#A16207' },
};

export function AuctionStatusBadge({ status }: Props) {
  const { bg, text } = STATUS_COLORS[status];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xs,
  },
});
