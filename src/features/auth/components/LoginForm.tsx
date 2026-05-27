import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';

import { useLogin } from '../hooks/use-login';
import { loginSchema, type LoginFormValues } from '../schemas/login-schema';

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values);
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.globalError}>{error.message}</Text> : null}

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholder="you@example.com"
              placeholderTextColor={colors.textSecondary}
            />
          )}
        />
        {errors.email ? <Text style={styles.fieldError}>{errors.email.message}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              autoComplete="password"
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
            />
          )}
        />
        {errors.password ? <Text style={styles.fieldError}>{errors.password.message}</Text> : null}
      </View>

      <TouchableOpacity
        style={[styles.button, isPending ? styles.buttonDisabled : null]}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
        accessibilityRole="button"
        accessibilityState={{ disabled: isPending }}
      >
        {isPending ? (
          <ActivityIndicator testID="activity-indicator" color={colors.surface} />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.error,
  },
  fieldError: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.error,
  },
  globalError: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.error,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: spacing.xs,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: spacing.xxl,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.semibold,
    color: colors.surface,
  },
});
