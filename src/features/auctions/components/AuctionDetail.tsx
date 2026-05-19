import { Image } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { borderRadius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { Auction } from '@/types';

import { useCountdown } from '../hooks/use-countdown';

import { AuctionStatusBadge } from './AuctionStatusBadge';

interface Props {
  auction: Auction;
}

const IMAGE_HEIGHT = 300;
const BLUR_HASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function AuctionDetailComponent({ auction }: Props) {
  const countdown = useCountdown(auction.endAt);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ImageGallery images={auction.images} />
      <View style={styles.infoSection}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{auction.title}</Text>
          <AuctionStatusBadge status={auction.status} />
        </View>
        <Text style={styles.description}>{auction.description}</Text>
        <View style={styles.bidSection}>
          <Text style={styles.bidLabel}>Current Highest Bid</Text>
          <Text style={styles.bidAmount}>{formatIDR(auction.currentBid)}</Text>
        </View>
        <View style={styles.countdownSection}>
          <Text style={styles.countdownLabel}>Time Remaining</Text>
          <Text style={styles.countdownValue}>{countdown}</Text>
        </View>
        <Pressable
          style={styles.bidButton}
          accessibilityRole="button"
          accessibilityLabel="Place a bid"
        >
          <Text style={styles.bidButtonText}>Place Bid</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export const AuctionDetail = React.memo(AuctionDetailComponent);

function ImageGallery({ images }: { images: string[] }) {
  if (images.length === 0) {
    return <View style={styles.imagePlaceholder} />;
  }

  return (
    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
      {images.map((uri) => (
        <Image
          key={uri}
          source={uri}
          style={styles.galleryImage}
          contentFit="cover"
          placeholder={{ blurhash: BLUR_HASH }}
          transition={200}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bidAmount: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
  },
  bidButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  bidButtonText: {
    color: colors.surface,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
  },
  bidLabel: {
    color: colors.textSecondary,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
  },
  bidSection: {
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  countdownLabel: {
    color: colors.textSecondary,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
  },
  countdownSection: {
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  countdownValue: {
    color: colors.textPrimary,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
  },
  description: {
    color: colors.textSecondary,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  galleryImage: {
    height: IMAGE_HEIGHT,
    width: 400,
  },
  imagePlaceholder: {
    backgroundColor: colors.border,
    height: IMAGE_HEIGHT,
  },
  infoSection: {
    padding: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    flex: 1,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xl,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
