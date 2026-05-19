import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';
import { borderRadius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';

export function AuctionSkeleton() {
  return (
    <MotiView
      from={{ opacity: 1 }}
      animate={{ opacity: 0.4 }}
      transition={{ type: 'timing', duration: 800, loop: true }}
      style={styles.card}
    >
      <View style={styles.thumbnail} />
      <View style={styles.body}>
        <View style={styles.titleLine} />
        <View style={styles.titleLineShort} />
        <View style={styles.row}>
          <View style={styles.bidChip} />
          <View style={styles.badgeChip} />
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  badgeChip: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    height: 20,
    width: 56,
  },
  bidChip: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    height: 20,
    width: 80,
  },
  body: {
    flex: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  thumbnail: {
    backgroundColor: colors.border,
    height: 100,
    width: 100,
  },
  titleLine: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    height: 14,
    width: '80%',
  },
  titleLineShort: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    height: 14,
    width: '50%',
  },
});
