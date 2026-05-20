import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/radius';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

/** Props for the AppButton primitive. */
interface Props {
  /** Visual style variant. */
  variant: Variant;
  /** Size preset controlling padding and font size. */
  size: Size;
  /** Replaces children with an `ActivityIndicator` and disables interaction. */
  isLoading?: boolean;
  /** Disables interaction and reduces opacity. */
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}

/**
 * Atomic button primitive with Reanimated press-scale animation.
 * Shows `ActivityIndicator` when `isLoading`. Disabled when `isLoading || disabled`.
 */
export function AppButton({
  variant,
  size,
  isLoading = false,
  disabled = false,
  onPress,
  children,
}: Props): React.ReactElement {
  const scale = useSharedValue(1);
  const isDisabled = isLoading || disabled;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: isDisabled ? 0.5 : 1,
  }));

  function handlePressIn(): void {
    scale.value = withTiming(0.96, { duration: 80 });
  }

  function handlePressOut(): void {
    scale.value = withTiming(1, { duration: 120 });
  }

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.base, styles[variant], styles[size]]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={1}
      >
        {isLoading ? (
          <ActivityIndicator
            color={variant === 'primary' ? colors.surface : colors.primary}
            size="small"
          />
        ) : (
          <Text style={[styles.label, styles[`${variant}Label`], styles[`${size}Label`]]}>
            {children}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  // Variant backgrounds
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Size padding
  sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  // Label base
  label: {
    fontFamily: fontFamily.semibold,
  },
  // Variant label colors
  primaryLabel: {
    color: colors.surface,
  },
  secondaryLabel: {
    color: colors.primary,
  },
  ghostLabel: {
    color: colors.primary,
  },
  // Size label fonts
  smLabel: {
    fontSize: fontSize.xs,
  },
  mdLabel: {
    fontSize: fontSize.sm,
  },
  lgLabel: {
    fontSize: fontSize.md,
  },
});
