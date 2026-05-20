import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';

type Variant = 'heading1' | 'heading2' | 'body' | 'caption' | 'label';

/** Props for the AppText primitive. */
interface Props {
  /** Visual style variant that maps to typography tokens. */
  variant: Variant;
  children: React.ReactNode;
  /** One-off style overrides — use sparingly. */
  style?: StyleProp<TextStyle>;
}

/**
 * Atomic text primitive. Maps `variant` to typography design tokens.
 * Never use raw `<Text>` in feature code — use `<AppText>` instead.
 */
export function AppText({ variant, children, style }: Props): React.ReactElement {
  return <Text style={[styles[variant], style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  heading1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    color: colors.textPrimary,
    lineHeight: 32,
  },
  heading2: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
    lineHeight: 28,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
