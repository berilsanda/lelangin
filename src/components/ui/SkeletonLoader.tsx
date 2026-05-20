import React from 'react';
import { StyleSheet } from 'react-native';
import { MotiView } from 'moti';

import { colors } from '@/constants/colors';
import { borderRadius } from '@/constants/radius';

/** Props for the SkeletonLoader primitive. */
interface Props {
  /** Width of the skeleton block. Accepts a number (dp) or a percentage string. */
  width: number | string;
  /** Height of the skeleton block in dp. */
  height: number;
  /** Border radius of the skeleton block. Defaults to `borderRadius.sm`. */
  borderRadius?: number;
}

/**
 * Reusable skeleton placeholder with a looping opacity shimmer animation.
 * Use in place of content while data is loading.
 */
export function SkeletonLoader({
  width,
  height,
  borderRadius: br = borderRadius.sm,
}: Props): React.ReactElement {
  return (
    <MotiView
      style={[styles.base, { width, height, borderRadius: br }]}
      from={{ opacity: 0.3 }}
      animate={{ opacity: 0.7 }}
      transition={{
        type: 'timing',
        duration: 700,
        loop: true,
      }}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.border,
  },
});
