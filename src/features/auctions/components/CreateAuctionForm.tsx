import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { addHours } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NumericFormat } from 'react-number-format';

import { borderRadius } from '@/constants/radius';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { uploadAuctionImages } from '@/services/firebase/auction-service';
import { useAuthStore } from '@/store/auth-store';

import { useCreateAuction } from '../hooks/use-create-auction';
import {
  createAuctionSchema,
  type CreateAuctionFormValues,
} from '../schemas/create-auction-schema';

const MAX_IMAGES = 5;

export function CreateAuctionForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { mutateAsync: createAuction, isPending: isCreating } = useCreateAuction();

  const [localImages, setLocalImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isSubmitting = isCreating || isUploading;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAuctionFormValues>({
    resolver: zodResolver(createAuctionSchema),
    defaultValues: {
      title: '',
      description: '',
      startingBid: undefined,
      reservePrice: undefined,
      endDate: addHours(new Date(), 24),
      images: [],
    },
  });

  const endDate = watch('endDate');

  const pickImages = async () => {
    if (localImages.length >= MAX_IMAGES) {
      Alert.alert('Limit reached', `You can only add up to ${MAX_IMAGES} images.`);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: MAX_IMAGES - localImages.length,
    });
    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      const next = [...localImages, ...uris].slice(0, MAX_IMAGES);
      setLocalImages(next);
    }
  };

  const removeImage = (index: number) => {
    setLocalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selected) setValue('endDate', selected, { shouldValidate: true });
  };

  const onSubmit = async (values: CreateAuctionFormValues) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create an auction.');
      return;
    }
    try {
      setIsUploading(true);
      const downloadUrls =
        localImages.length > 0 ? await uploadAuctionImages(user.uid, localImages) : [];
      setIsUploading(false);

      await createAuction({
        title: values.title,
        description: values.description,
        startingBid: values.startingBid,
        reservePrice: values.reservePrice,
        images: downloadUrls,
        sellerId: user.uid,
        endAt: values.endDate,
      });

      router.back();
    } catch (err) {
      setIsUploading(false);
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      Alert.alert('Failed to create auction', message);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>Title</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.title ? styles.inputError : null]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="e.g. Vintage Rolex Submariner"
              placeholderTextColor={colors.textSecondary}
              editable={!isSubmitting}
            />
          )}
        />
        {errors.title ? <Text style={styles.fieldError}>{errors.title.message}</Text> : null}
      </View>

      {/* Description */}
      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea, errors.description ? styles.inputError : null]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Describe the item in detail (min 20 characters)"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
          )}
        />
        {errors.description ? (
          <Text style={styles.fieldError}>{errors.description.message}</Text>
        ) : null}
      </View>

      {/* Starting Bid */}
      <View style={styles.field}>
        <Text style={styles.label}>Starting Bid (IDR)</Text>
        <Controller
          control={control}
          name="startingBid"
          render={({ field: { onChange, onBlur, value } }) => (
            <NumericFormat
              value={value}
              thousandSeparator="."
              decimalSeparator=","
              prefix="Rp "
              onValueChange={(vals) => {
                onChange(vals.floatValue ?? undefined);
              }}
              renderText={(formatted) => (
                <TextInput
                  style={[styles.input, errors.startingBid ? styles.inputError : null]}
                  onBlur={onBlur}
                  value={formatted}
                  onChangeText={(text) => {
                    const raw = text.replace(/[^0-9]/g, '');
                    onChange(raw ? Number(raw) : undefined);
                  }}
                  keyboardType="numeric"
                  placeholder="Rp 0"
                  placeholderTextColor={colors.textSecondary}
                  editable={!isSubmitting}
                />
              )}
            />
          )}
        />
        {errors.startingBid ? (
          <Text style={styles.fieldError}>{errors.startingBid.message}</Text>
        ) : null}
      </View>

      {/* Reserve Price */}
      <View style={styles.field}>
        <Text style={styles.label}>Reserve Price (IDR) — optional</Text>
        <Controller
          control={control}
          name="reservePrice"
          render={({ field: { onChange, onBlur, value } }) => (
            <NumericFormat
              value={value}
              thousandSeparator="."
              decimalSeparator=","
              prefix="Rp "
              onValueChange={(vals) => {
                onChange(vals.floatValue ?? undefined);
              }}
              renderText={(formatted) => (
                <TextInput
                  style={[styles.input, errors.reservePrice ? styles.inputError : null]}
                  onBlur={onBlur}
                  value={formatted}
                  onChangeText={(text) => {
                    const raw = text.replace(/[^0-9]/g, '');
                    onChange(raw ? Number(raw) : undefined);
                  }}
                  keyboardType="numeric"
                  placeholder="Rp 0"
                  placeholderTextColor={colors.textSecondary}
                  editable={!isSubmitting}
                />
              )}
            />
          )}
        />
        {errors.reservePrice ? (
          <Text style={styles.fieldError}>{errors.reservePrice.message}</Text>
        ) : null}
      </View>

      {/* End Date */}
      <View style={styles.field}>
        <Text style={styles.label}>End Date &amp; Time</Text>
        <TouchableOpacity
          style={[styles.input, styles.dateButton, errors.endDate ? styles.inputError : null]}
          onPress={() => setShowDatePicker(true)}
          disabled={isSubmitting}
          accessibilityRole="button"
        >
          <Text style={styles.dateText}>
            {endDate.toLocaleString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </TouchableOpacity>
        {errors.endDate ? <Text style={styles.fieldError}>{errors.endDate.message}</Text> : null}
        {showDatePicker ? (
          <DateTimePicker
            value={endDate}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            minimumDate={addHours(new Date(), 1)}
            onChange={onDateChange}
          />
        ) : null}
      </View>

      {/* Images */}
      <View style={styles.field}>
        <Text style={styles.label}>Images (max {MAX_IMAGES})</Text>
        <TouchableOpacity
          style={[styles.imagePicker, isSubmitting ? styles.buttonDisabled : null]}
          onPress={pickImages}
          disabled={isSubmitting || localImages.length >= MAX_IMAGES}
          accessibilityRole="button"
        >
          <Text style={styles.imagePickerText}>
            {localImages.length >= MAX_IMAGES ? 'Max images reached' : '+ Add Images'}
          </Text>
        </TouchableOpacity>

        {localImages.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageScroll}
            contentContainerStyle={styles.imageScrollContent}
          >
            {localImages.map((uri, index) => (
              <View key={uri} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.thumbnail} contentFit="cover" />
                <Pressable
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                  accessibilityRole="button"
                  accessibilityLabel="Remove image"
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        ) : null}
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting ? styles.buttonDisabled : null]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        accessibilityRole="button"
        accessibilityState={{ disabled: isSubmitting }}
      >
        {isSubmitting ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.surface} />
            <Text style={styles.submitText}>
              {isUploading ? 'Uploading images…' : 'Creating auction…'}
            </Text>
          </View>
        ) : (
          <Text style={styles.submitText}>Create Auction</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
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
    borderRadius: borderRadius.md,
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
  textArea: {
    minHeight: spacing.xxl * 2,
  },
  dateButton: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
  },
  fieldError: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.error,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    borderStyle: 'dashed',
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  imagePickerText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: colors.primary,
  },
  imageScroll: {
    marginTop: spacing.xs,
  },
  imageScrollContent: {
    gap: spacing.sm,
  },
  imageWrapper: {
    position: 'relative',
  },
  thumbnail: {
    width: spacing.xxl * 2,
    height: spacing.xxl * 2,
    borderRadius: borderRadius.md,
  },
  removeButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.error,
    borderRadius: borderRadius.full,
    width: spacing.lg,
    height: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: colors.surface,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bold,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: spacing.xxl,
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.semibold,
    color: colors.surface,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
