'use client';

import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CheckoutFormData } from '@/lib/schemas/checkout';
import { Input } from '@/components/ui/Input';
import { Truck, MapPin, CreditCard, Banknote, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface AddressFormProps {
  form: UseFormReturn<CheckoutFormData>;
}

export const AddressForm: React.FC<AddressFormProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const { codEnabled } = useCart();
  const selectedPaymentMethod = watch('paymentMethod');
  const isGift = watch('isGift');
  const enteredPincode = watch('pincode');

  const [delhiveryStatus, setDelhiveryStatus] = useState<{
    loading: boolean;
    serviceable: boolean;
    message: string;
    zone?: string;
    expectedDate?: string;
  } | null>(null);

  // Debounced Delhivery PIN code serviceability check
  useEffect(() => {
    const cleanPin = (enteredPincode || '').replace(/\D/g, '').slice(0, 6);
    if (cleanPin.length !== 6) {
      setDelhiveryStatus(null);
      return;
    }

    setDelhiveryStatus({
      loading: true,
      serviceable: false,
      message: 'Checking Delhivery serviceability from Bangalore Hub...',
    });

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/shipping/delhivery?pincode=${cleanPin}`);
        if (res.ok) {
          const data = await res.json();
          if (data.service) {
            setDelhiveryStatus({
              loading: false,
              serviceable: data.service.serviceable,
              message: data.service.message,
              zone: data.service.zone,
              expectedDate: data.service.expected_delivery_date,
            });

            // Auto-fill City & State if available and currently blank
            if (data.service.city && !form.getValues('city')) {
              setValue('city', data.service.city, { shouldValidate: true });
            }
            if (data.service.state && !form.getValues('state')) {
              setValue('state', data.service.state, { shouldValidate: true });
            }
          }
        }
      } catch (e) {
        setDelhiveryStatus(null);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [enteredPincode, form, setValue]);

  const quickAddresses = [
    {
      label: '🏢 Bangalore Central Hub',
      name: 'Pooja Hegde',
      phone: '9845012345',
      email: 'pooja.hegde@gmail.com',
      line1: '100 Feet Road, Indiranagar Stage 2',
      line2: 'Near Metro Station',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
    },
    {
      label: '🏠 Coastal Delivery (Mangalore)',
      name: 'Pooja Hegde',
      phone: '9845012345',
      email: 'pooja.hegde@gmail.com',
      line1: 'Flat 302, Sagar View Apts, Kadri Temple Road',
      line2: 'Near Mallikatte Circle',
      city: 'Mangaluru',
      state: 'Karnataka',
      pincode: '575002',
    },
  ];

  const handleSelectQuickAddress = (addr: (typeof quickAddresses)[0]) => {
    setValue('name', addr.name, { shouldValidate: true });
    setValue('phone', addr.phone, { shouldValidate: true });
    setValue('email', addr.email, { shouldValidate: true });
    setValue('line1', addr.line1, { shouldValidate: true });
    setValue('line2', addr.line2, { shouldValidate: true });
    setValue('city', addr.city, { shouldValidate: true });
    setValue('state', addr.state, { shouldValidate: true });
    setValue('pincode', addr.pincode, { shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      {/* 1-Tap Saved Address Quick Fill */}
      <div className="bg-amber-50/70 p-4 rounded-card border border-amber-200/80 space-y-2.5">
        <div className="text-xs font-bold text-brandText flex items-center justify-between">
          <span>⚡ 1-Tap Saved Address Fill</span>
          <span className="text-[10px] text-brandAccent font-semibold">Bangalore Dispatch Hub</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickAddresses.map((addr, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectQuickAddress(addr)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-brandAccent hover:text-white text-brandText border border-brandBorder text-xs font-semibold transition-colors shadow-2xs"
            >
              {addr.label} ({addr.pincode})
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: Customer Contact Details */}
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
              label="Email Address (for order tracking & Delhivery receipt)"
              type="email"
              placeholder="e.g. pooja@example.com"
              required
              {...register('email')}
              error={errors.email?.message}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Delivery Address & Exclusive Delhivery Live Serviceability */}
      <div className="bg-white p-6 rounded-card border border-brandBorder shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-brandBorder font-bold text-sm text-brandText">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brandAccent" />
            <span>2. Shipping Address &amp; Delhivery Logistics</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
            🚚 Exclusive Partner: Delhivery
          </span>
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
            placeholder="e.g. Near Metro Station / Landmark"
            {...register('line2')}
            error={errors.line2?.message}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Input
                label="City / Town"
                placeholder="e.g. Bangalore"
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
                placeholder="e.g. 560038"
                maxLength={6}
                required
                {...register('pincode')}
                error={errors.pincode?.message}
              />
            </div>
          </div>

          {/* Delhivery Live Serviceability Badge */}
          {delhiveryStatus && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                delhiveryStatus.loading
                  ? 'bg-slate-50 border-slate-200 text-slate-600'
                  : delhiveryStatus.serviceable
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-medium'
                  : 'bg-red-50 border-red-200 text-brandRed'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {delhiveryStatus.loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-brandRed border-t-transparent rounded-full animate-spin shrink-0" />
                ) : delhiveryStatus.serviceable ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-brandRed shrink-0" />
                )}
                <span className="truncate">{delhiveryStatus.message}</span>
              </div>

              {delhiveryStatus.expectedDate && (
                <span className="text-[11px] font-bold text-emerald-800 shrink-0 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200">
                  Est: {delhiveryStatus.expectedDate}
                </span>
              )}
            </div>
          )}

          {/* Festive Gift Note & Custom Greeting Card Toggle */}
          <div className="pt-2 border-t border-brandBorder space-y-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-brandText">
              <input
                type="checkbox"
                {...register('isGift')}
                className="w-4 h-4 rounded text-brandRed accent-brandRed"
              />
              <span>🎀 Sending this as a Gift? Add a FREE Personalized Mangalore Heritage Greeting Card</span>
            </label>

            {isGift && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <label className="block text-[11px] font-bold text-brandText">
                  Personal Gift Note (Printed on a Heritage Greeting Card inside the box)
                </label>
                <textarea
                  rows={2}
                  maxLength={240}
                  placeholder="e.g. Sending you authentic Mangalore homemade treats with lots of love from Bangalore!"
                  {...register('giftMessage')}
                  className="w-full px-3 py-2 text-xs bg-white border border-brandBorder rounded-button focus:outline-none focus:border-brandAccent"
                />
              </div>
            )}
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

          {/* Cash on Delivery (Controlled by Admin StoreSettingsView) */}
          {codEnabled !== false ? (
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
                  <span>Cash on Delivery (Delhivery COD)</span>
                </div>
                <p className="text-[11px] text-brandText2 mt-1">
                  Pay cash or UPI QR at your doorstep to the Delhivery executive.
                </p>
              </div>
            </label>
          ) : (
            <div className="p-4 rounded-card border border-brandBorder bg-brandBg text-xs text-brandText3 flex items-center gap-2">
              <Banknote className="w-4 h-4 text-brandText3 shrink-0" />
              <span>Cash on Delivery is currently paused. Please use Online Payment (UPI / Cards).</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
