import { View, StyleSheet } from 'react-native';

import { LoginForm } from '@/features/auth/components';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <LoginForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
});
