import * as ImagePicker from 'expo-image-picker';

import { uploadAvatar } from '@/services/firebase/user-service';

import { useUpdateProfile } from './use-update-profile';

/**
 * Encapsulates the image-picker → upload → mutate flow for avatar updates.
 */
export function useAvatarUpload(uid: string) {
  const { mutate } = useUpdateProfile(uid);

  return async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      const downloadUrl = await uploadAvatar(uid, result.assets[0].uri);
      mutate({ avatarUrl: downloadUrl });
    }
  };
}
