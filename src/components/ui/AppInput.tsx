import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet, Text } from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/radius';

/** Props for the AppInput primitive. */
interface Props extends TextInputProps {
  /** Optional label rendered above the input. */
  label?: string;
  /** Error message rendered below the input; also changes border to `colors.error`. */
  error?: string;
  /** Node rendered on the left side inside the input container. */
  leftIcon?: React.ReactNode;
  /** Node rendered on the right side inside the input container. */
  rightIcon?: React.ReactNode;
}

/**
 * Fully controlled text input primitive with label, error, and icon support.
 * Border turns `colors.error` when `error` is provided.
 */
export function AppInput({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  ...rest
}: Props): React.ReactElement {
  const borderColor = error ? colors.error : colors.border;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.container, { borderColor }]}>
        {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textSecondary}
          {...rest}
        />
        {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
  error: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: colors.error,
  },
});
