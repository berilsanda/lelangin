import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/constants/colors';
import { borderRadius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { UserProfile } from '@/types';

interface Props {
  profile: UserProfile;
  onEditPress: () => void;
  onAvatarPress: () => void;
}

const AVATAR_SIZE = 88;

function getInitials(displayName: string): string {
  return displayName
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

function ProfileHeaderComponent({ profile, onEditPress, onAvatarPress }: Props) {
  const initials = getInitials(profile.displayName);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.8} style={styles.avatarWrapper}>
        {profile.avatarUrl !== null ? (
          <Image
            source={{ uri: profile.avatarUrl }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.displayName}>{profile.displayName}</Text>
      <Text style={styles.email}>{profile.email}</Text>

      <TouchableOpacity onPress={onEditPress} style={styles.editButton} activeOpacity={0.8}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

export const ProfileHeader = React.memo(ProfileHeaderComponent);

const styles = StyleSheet.create({
  avatar: {
    borderRadius: borderRadius.full,
    height: AVATAR_SIZE,
    width: AVATAR_SIZE,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    height: AVATAR_SIZE,
    justifyContent: 'center',
    width: AVATAR_SIZE,
  },
  avatarWrapper: {
    marginBottom: spacing.md,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  displayName: {
    color: colors.textPrimary,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    marginBottom: spacing.xs,
  },
  editButton: {
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  editButtonText: {
    color: colors.primary,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
  },
  email: {
    color: colors.textSecondary,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
  },
  initials: {
    color: colors.textSecondary,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
  },
});
