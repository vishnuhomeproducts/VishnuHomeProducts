import { z } from 'zod';

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long').regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Please enter a valid email address'),
  line1: z.string().min(5, 'Street address must be at least 5 characters').max(200, 'Address is too long'),
  line2: z.string().max(200, 'Address line 2 is too long').optional().or(z.literal('')),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit PIN code'),
  paymentMethod: z.enum(['razorpay', 'cod']).default('razorpay'),
  saveAddress: z.boolean().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
