import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';

/** Props for the Screen layout primitive. */
interface Props {
  children: React.ReactNode;
  /** When `true`, wraps content in a `ScrollView`. Defaults to `false`. */
  scroll?: boolean;
  /** Additional styles applied to the inner content container. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Root screen wrapper. Applies `SafeAreaView` and `colors.background` automatically.
 * Use `scroll={true}` for screens whose content may overflow the viewport.
 */
export function Screen({ children, scroll = false, style }: Props): React.ReactElement {
  return (
    <SafeAreaView style={styles.safe}>
      {scroll ? (
        <ScrollView
          style={styles.fill}
          contentContainerStyle={[styles.content, style]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fill: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
