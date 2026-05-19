import { format } from 'date-fns';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { borderRadius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';

interface Props {
  totalAuctionsWon: number;
  activeListings: number;
  createdAt: Date;
}

interface StatCardProps {
  label: string;
  value: string;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function ProfileStats({ totalAuctionsWon, activeListings, createdAt }: Props) {
  return (
    <View style={styles.row}>
      <StatCard label="Auctions Won" value={String(totalAuctionsWon)} />
      <StatCard label="Active Listings" value={String(activeListings)} />
      <StatCard label="Member Since" value={format(createdAt, 'MMM yyyy')} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  label: {
    color: colors.textSecondary,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  value: {
    color: colors.textPrimary,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
  },
});
