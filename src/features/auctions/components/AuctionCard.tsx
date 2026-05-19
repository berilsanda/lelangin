import { formatDistanceToNowStrict } from 'date-fns';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { borderRadius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { Auction } from '@/types';

import { AuctionStatusBadge } from './AuctionStatusBadge';

interface Props {
  auction: Auction;
}

const THUMBNAIL_SIZE = 100;

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getTimeRemaining(endAt: Date): string {
  const now = new Date();
  if (endAt <= now) return 'Ended';
  return formatDistanceToNowStrict(endAt, { addSuffix: false });
}

function AuctionCardComponent({ auction }: Props) {
  const thumbnail = auction.images[0] ?? null;
  const timeRemaining = getTimeRemaining(auction.endAt);

  return (
    <View style={styles.card}>
      <Image
        source={thumbnail}
        style={styles.thumbnail}
        contentFit="cover"
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        transition={200}
      />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {auction.title}
        </Text>
        <Text style={styles.bid}>{formatIDR(auction.currentBid)}</Text>
        <View style={styles.footer}>
          <Text style={styles.timeRemaining}>{timeRemaining}</Text>
          <AuctionStatusBadge status={auction.status} />
        </View>
      </View>
    </View>
  );
}

export const AuctionCard = React.memo(AuctionCardComponent);

const styles = StyleSheet.create({
  bid: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
  },
  body: {
    flex: 1,
    gap: spacing.xs,
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
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  thumbnail: {
    height: THUMBNAIL_SIZE,
    width: THUMBNAIL_SIZE,
  },
  timeRemaining: {
    color: colors.textSecondary,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
  },
});
