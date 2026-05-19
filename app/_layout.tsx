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
  const { user, isHydrated, setAuth, clearAuth } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        firebaseUser.getIdToken().then((token) => {
          setAuth(
            {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
            },
            token,
          );
        });
      } else {
        clearAuth();
      }
    });
    return unsubscribe;
  }, [setAuth, clearAuth]);

  useEffect(() => {
    if (!isHydrated) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) router.replace('/(auth)/login');
    if (user && inAuthGroup) router.replace('/(tabs)/');
  }, [user, isHydrated, segments, router]);

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
