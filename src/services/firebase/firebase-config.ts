import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { env } from '@/config/env';

const app = initializeApp(env.firebase);

/**
 * Auth with React Native AsyncStorage persistence.
 * Uses initializeAuth (not getAuth) to set persistence explicitly.
 * No firebase/compat imports — modular API only.
 */
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export const storage = getStorage(app);
