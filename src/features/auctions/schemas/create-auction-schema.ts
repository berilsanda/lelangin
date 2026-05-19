import { addHours } from 'date-fns';
import { z } from 'zod';

const ONE_HOUR_FROM_NOW = () => addHours(new Date(), 1);

export const createAuctionSchema = z
  .object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    startingBid: z
      .number({ invalid_type_error: 'Starting bid is required' })
      .positive('Starting bid must be a positive number'),
    reservePrice: z
      .number({ invalid_type_error: 'Reserve price must be a number' })
      .positive('Reserve price must be a positive number')
      .optional(),
    endDate: z
      .date({ invalid_type_error: 'End date is required' })
      .refine((d) => d >= ONE_HOUR_FROM_NOW(), {
        message: 'End date must be at least 1 hour from now',
      }),
    images: z.array(z.string()).max(5, 'You can upload at most 5 images'),
  })
  .refine((data) => data.reservePrice === undefined || data.reservePrice >= data.startingBid, {
    message: 'Reserve price must be greater than or equal to starting bid',
    path: ['reservePrice'],
  });

export type CreateAuctionFormValues = z.infer<typeof createAuctionSchema>;
