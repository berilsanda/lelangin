/**
 * Typed environment variable access.
 * All vars use the EXPO_PUBLIC_ prefix — no babel plugin required.
 * Populate values via .env.local (local dev) or EAS Secrets (CI/CD).
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  firebase: {
    apiKey: requireEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
    authDomain: requireEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    projectId: requireEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket: requireEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: requireEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    appId: requireEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
  },
} as const;
