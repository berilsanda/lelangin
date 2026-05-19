import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { NumericFormat } from 'react-number-format';

import { borderRadius } from '@/constants/radius';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { AuctionStatus } from '@/types/auction.types';
import { formatCurrency } from '@/utils/currency';

interface BidInputProps {
  currentBid: number;
  minimumIncrement?: number;
  auctionStatus: AuctionStatus;
  currentUserId: string;
  highestBidderId: string | null;
  onSubmit: (amount: number) => void;
  isSubmitting: boolean;
}

const DEFAULT_INCREMENT = 500;
const ANIMATION_DURATION = 150;
const SCALE_UP = 1.15;
const SCALE_NORMAL = 1;

export function BidInput({
  currentBid,
  minimumIncrement = DEFAULT_INCREMENT,
  auctionStatus,
  currentUserId,
  highestBidderId,
  onSubmit,
  isSubmitting,
}: BidInputProps) {
  const [bidAmount, setBidAmount] = useState<number | undefined>(undefined);

  const scale = useSharedValue(SCALE_NORMAL);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    scale.value = withSequence(
      withTiming(SCALE_UP, { duration: ANIMATION_DURATION }),
      withTiming(SCALE_NORMAL, { duration: ANIMATION_DURATION }),
    );
  }, [currentBid, scale]);

  const isDisabled =
    auctionStatus !== 'active' || currentUserId === highestBidderId || isSubmitting;

  const minimumBid = currentBid + minimumIncrement;

  const handleSubmit = () => {
    if (bidAmount !== undefined && bidAmount >= minimumBid) {
      onSubmit(bidAmount);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.currentBidContainer, animatedStyle]}>
        <Text style={styles.currentBidLabel}>Current Bid</Text>
        <Text style={styles.currentBidAmount}>{formatCurrency(currentBid)}</Text>
      </Animated.View>

      <View style={styles.inputSection}>
        <Text style={styles.hintText}>Minimum bid: {formatCurrency(minimumBid)}</Text>

        <NumericFormat
          value={bidAmount}
          thousandSeparator="."
          decimalSeparator=","
          prefix="Rp "
          onValueChange={(vals) => {
            setBidAmount(vals.floatValue);
          }}
          renderText={(formatted) => (
            <TextInput
              style={[styles.input, isDisabled ? styles.inputDisabled : null]}
              value={formatted}
              onChangeText={(text) => {
                const raw = text.replace(/[^0-9]/g, '');
                setBidAmount(raw ? Number(raw) : undefined);
              }}
              keyboardType="numeric"
              placeholder="Rp 0"
              placeholderTextColor={colors.textSecondary}
              editable={!isDisabled}
              accessibilityLabel="Bid amount"
            />
          )}
        />

        <TouchableOpacity
          style={[styles.submitButton, isDisabled ? styles.buttonDisabled : null]}
          onPress={handleSubmit}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityState={{ disabled: isDisabled, busy: isSubmitting }}
          accessibilityLabel="Place bid"
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={styles.submitText}>Place Bid</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonDisabled: {
    opacity: 0.5,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    padding: spacing.md,
  },
  currentBidAmount: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
  },
  currentBidContainer: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  currentBidLabel: {
    color: colors.textSecondary,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
  },
  hintText: {
    color: colors.textSecondary,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  inputSection: {
    gap: spacing.sm,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    minHeight: spacing.xxl,
    paddingVertical: spacing.sm,
  },
  submitText: {
    color: colors.surface,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
  },
});
