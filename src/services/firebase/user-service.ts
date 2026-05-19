import {
  doc,
  type DocumentData,
  type FirestoreDataConverter,
  FirestoreError,
  getDoc,
  type PartialWithFieldValue,
  type QueryDocumentSnapshot,
  setDoc,
  type SnapshotOptions,
  Timestamp,
  type WithFieldValue,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import type { UserProfile } from '@/types';

import { db, storage } from './firebase-config';

const USERS_COLLECTION = 'users';

/**
 * Firestore type-safe converter for `UserProfile`.
 * Converts `createdAt` between Firestore `Timestamp` and JS `Date`.
 */
export const userConverter: FirestoreDataConverter<UserProfile> = {
  toFirestore(
    profile: WithFieldValue<UserProfile> | PartialWithFieldValue<UserProfile>,
  ): DocumentData {
    const source = profile as Partial<UserProfile> & Record<string, unknown>;
    const { uid, createdAt, ...rest } = source;
    void uid;
    const data: DocumentData = { ...rest };
    if (createdAt instanceof Date) data.createdAt = Timestamp.fromDate(createdAt);
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): UserProfile {
    const data = snapshot.data(options);
    return {
      uid: snapshot.id,
      displayName: data.displayName,
      email: data.email,
      avatarUrl: data.avatarUrl ?? null,
      createdAt: (data.createdAt as Timestamp).toDate(),
      totalAuctionsWon: data.totalAuctionsWon ?? 0,
      activeListings: data.activeListings ?? 0,
    };
  },
};

const userDoc = (uid: string) => doc(db, USERS_COLLECTION, uid).withConverter(userConverter);

/**
 * Fetch a user profile by uid.
 * @throws {Error} if the document does not exist
 * @throws {FirestoreError} if the read fails
 */
export async function fetchUserProfile(uid: string): Promise<UserProfile> {
  try {
    const snapshot = await getDoc(userDoc(uid));
    const data = snapshot.data();
    if (!data) {
      throw new Error(`User profile ${uid} not found`);
    }
    return data;
  } catch (error) {
    if (error instanceof Error && !(error instanceof FirestoreError)) {
      throw error;
    }
    throw error as FirestoreError;
  }
}

/**
 * Create or merge a user profile document.
 * Uses `setDoc` with `merge: true` so partial updates don't overwrite existing fields.
 * @throws {FirestoreError}
 */
export async function updateUserProfile(uid: string, payload: Partial<UserProfile>): Promise<void> {
  try {
    await setDoc(userDoc(uid), payload as PartialWithFieldValue<UserProfile>, { merge: true });
  } catch (error) {
    throw error as FirestoreError;
  }
}

/**
 * Upload a local image URI to Firebase Storage at `avatars/{uid}` and return
 * the public download URL.
 * @throws {Error} if the upload or URL fetch fails
 */
export async function uploadAvatar(uid: string, uri: string): Promise<string> {
  try {
    const storageRef = ref(storage, `avatars/${uid}`);
    const response = await fetch(uri);
    const blob = await response.blob();
    const snapshot = await uploadBytes(storageRef, blob);
    return getDownloadURL(snapshot.ref);
  } catch (error) {
    throw error as Error;
  }
}
