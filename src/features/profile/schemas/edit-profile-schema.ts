import { z } from 'zod';

export const editProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
