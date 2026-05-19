import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ProfileHeader, ProfileStats, EditProfileSheet } from '@/features/profile/components';
import { useProfile } from '@/features/profile/hooks/use-profile';
import { useAvatarUpload } from '@/features/profile/hooks/use-avatar-upload';
import { useAuthStore } from '@/store/auth-store';

export default function ProfileScreen() {
  const uid = useAuthStore((s) => s.user?.uid ?? '');
  const { data: profile, isLoading } = useProfile(uid);
  const handleAvatarPress = useAvatarUpload(uid);
  const [editSheetVisible, setEditSheetVisible] = useState(false);
  if (isLoading || !profile) return <ActivityIndicator style={styles.loader} />;
  return (
    <View style={styles.container}>
      <ProfileHeader
        profile={profile}
        onEditPress={() => setEditSheetVisible(true)}
        onAvatarPress={handleAvatarPress}
      />
      <ProfileStats
        totalAuctionsWon={profile.totalAuctionsWon}
        activeListings={profile.activeListings}
        createdAt={profile.createdAt}
      />
      <EditProfileSheet
        visible={editSheetVisible}
        onClose={() => setEditSheetVisible(false)}
        profile={profile}
      />
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1 }, loader: { flex: 1 } });
