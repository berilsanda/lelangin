import { View, StyleSheet } from 'react-native';

import { RegisterForm } from '@/features/auth/components';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <RegisterForm />
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
