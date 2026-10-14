'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CheckoutFormData } from '@/lib/schemas/checkout';
import { Input } from '@/components/ui/Input';
import { Truck, MapPin, CreditCard, Banknote } from 'lucide-react';

interface AddressFormProps {
  form: UseFormReturn<CheckoutFormData>;
}

export const AddressForm: React.FC<AddressFormProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
    watch,
  } = form;

  const selectedPaymentMethod = watch('paymentMethod');

  return (
    <div className="space-y-8">
      
      {/* Section 1: Contact Information */}
      <div className="bg-white p-6 rounded-card border border-brandBorder shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-brandBorder font-bold text-sm text-brandText">
          <Truck className="w-4 h-4 text-brandAccent" />
          <span>1. Customer & Contact Details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Full Name"
              placeholder="e.g. Pooja Hegde"
              required
              {...register('name')}
              error={errors.name?.message}
            />
          </div>

          <div>
            <Input
              label="Mobile Number (10 Digits)"
              placeholder="e.g. 9845012345"
              required
              maxLength={10}
              {...register('phone')}
              error={errors.phone?.message}
            />
          </div>

          <div>
            <Input
              label="Email Address (for order tracking & receipt)"
              type="email"
              placeholder="e.g. pooja@example.com"
              required
              {...register('email')}
              error={errors.email?.message}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Delivery Address */}
      <div className="bg-white p-6 rounded-card border border-brandBorder shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-brandBorder font-bold text-sm text-brandText">
          <MapPin className="w-4 h-4 text-brandAccent" />
          <span>2. Shipping Address</span>
        </div>

        <div className="space-y-4">
          <Input
            label="Flat / House No. / Building Name / Street"
            placeholder="e.g. Flat 302, Sagar View Apts, Main Road"
            required
            {...register('line1')}
            error={errors.line1?.message}
          />

          <Input
            label="Landmark / Locality (Optional)"
            placeholder="e.g. Near Kadri Temple"
            {...register('line2')}
            error={errors.line2?.message}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Input
                label="City / Town"
                placeholder="e.g. Mangaluru"
                required
                {...register('city')}
                error={errors.city?.message}
              />
            </div>

            <div>
              <Input
                label="State"
                placeholder="e.g. Karnataka"
                required
                {...register('state')}
                error={errors.state?.message}
              />
            </div>

            <div>
              <Input
                label="PIN Code (6 digits)"
                placeholder="e.g. 575002"
                maxLength={6}
                required
                {...register('pincode')}
                error={errors.pincode?.message}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Payment Method */}
      <div className="bg-white p-6 rounded-card border border-brandBorder shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-brandBorder font-bold text-sm text-brandText">
          <CreditCard className="w-4 h-4 text-brandAccent" />
          <span>3. Select Payment Method</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Razorpay Online */}
          <label
            className={`flex items-start gap-3 p-4 rounded-card border cursor-pointer transition-all ${
              selectedPaymentMethod === 'razorpay'
                ? 'border-brandAccent bg-brandAccent-light/40 ring-1 ring-brandAccent'
                : 'border-brandBorder bg-white hover:border-brandAccent/40'
            }`}
          >
            <input
              type="radio"
              value="razorpay"
              {...register('paymentMethod')}
              className="mt-1 text-brandAccent accent-brandAccent"
            />
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-brandText">
                <span>Online Payment (Razorpay)</span>
                <span className="text-[10px] bg-brandGreen text-white px-1.5 py-0.2 rounded">Recommended</span>
              </div>
              <p className="text-[11px] text-brandText2 mt-1">
                UPI (GPay / PhonePe / Paytm), Credit & Debit Cards, NetBanking.
              </p>
            </div>
          </label>

          {/* Cash on Delivery */}
          <label
            className={`flex items-start gap-3 p-4 rounded-card border cursor-pointer transition-all ${
              selectedPaymentMethod === 'cod'
                ? 'border-brandAccent bg-brandAccent-light/40 ring-1 ring-brandAccent'
                : 'border-brandBorder bg-white hover:border-brandAccent/40'
            }`}
          >
            <input
              type="radio"
              value="cod"
              {...register('paymentMethod')}
              className="mt-1 text-brandAccent accent-brandAccent"
            />
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-brandText">
                <Banknote className="w-3.5 h-3.5 text-brandAccent" />
                <span>Cash on Delivery (COD)</span>
              </div>
              <p className="text-[11px] text-brandText2 mt-1">
                Pay in cash or UPI QR at your doorstep upon delivery.
              </p>
            </div>
          </label>
        </div>
      </div>

    </div>
  );
};
