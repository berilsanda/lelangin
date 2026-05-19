import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary, Slot, useRouter, useSegments } from 'expo-router';
import { Try } from 'expo-router/build/views/Try';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { auth } from '@/services/firebase/firebase-config';
import { queryClient } from '@/services/query-client';
import { useAuthStore } from '@/store/auth-store';

function AuthGuard() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(
        user
          ? {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            }
          : null,
      );
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setLoading]);

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) router.replace('/(auth)/login');
    if (user && inAuthGroup) router.replace('/(tabs)/');
  }, [user, isLoading, segments, router]);

  return null;
}

export default function RootLayout() {
  return (
    <Try catch={ErrorBoundary}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={styles.root}>
          <SafeAreaProvider>
            <AuthGuard />
            <Slot />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </Try>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
