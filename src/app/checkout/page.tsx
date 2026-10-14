'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, ShieldCheck, ShoppingBag, ArrowLeft } from 'lucide-react';
import { checkoutSchema, CheckoutFormData } from '@/lib/schemas/checkout';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { AddressForm } from '@/components/checkout/AddressForm';
import { RazorpayButton } from '@/components/checkout/RazorpayButton';
import { formatINR } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getDeliveryFee, getDiscount, getTotal, coupon } = useCart();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = getDiscount();
  const total = getTotal();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      line1: '',
      line2: '',
      city: 'Mangaluru',
      state: 'Karnataka',
      pincode: '575002',
      paymentMethod: 'razorpay',
      saveAddress: true,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-16 text-center text-xs text-brandText3">
        Loading checkout details...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-brandAccent-light text-brandAccent flex items-center justify-center mx-auto text-3xl">
          🛒
        </div>
        <h2 className="font-bold text-lg text-brandText">Your cart is empty</h2>
        <p className="text-xs text-brandText2">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brandAccent text-white text-xs font-semibold rounded-button shadow-sm"
        >
          <span>Return to Shop</span>
        </Link>
      </div>
    );
  }

  const handleValidateForm = async (): Promise<boolean> => {
    const valid = await form.trigger();
    return valid;
  };

  return (
    <div className="py-8 bg-brandBg min-h-screen">
      <div className="max-w-site mx-auto px-4 space-y-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-brandText3">
          <Link href="/" className="hover:text-brandAccent transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/cart" className="hover:text-brandAccent transition-colors">
            Cart
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brandText font-semibold">Secure Checkout</span>
        </nav>

        <div className="pb-2 border-b border-brandBorder">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brandText">
            Checkout & Delivery
          </h1>
          <p className="text-xs text-brandText2 mt-1">
            Enter your shipping destination to receive your fresh coastal order
          </p>
        </div>

        {/* 2-Column Checkout Layout (60/40 split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Form Fields (7 cols / 60%) */}
          <div className="lg:col-span-7">
            <AddressForm form={form} />
          </div>

          {/* Right: Condensed Order Summary + Razorpay Action (5 cols / 40%) */}
          <div className="lg:col-span-5 space-y-6 self-start sticky top-20">
            
            <div className="bg-white p-6 rounded-card border border-brandBorder shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-brandBorder font-bold text-sm text-brandText">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-brandAccent" />
                  <span>Order Items ({items.reduce((s, i) => s + i.qty, 0)})</span>
                </div>
                <Link href="/cart" className="text-xs text-brandAccent hover:underline font-normal">
                  Edit
                </Link>
              </div>

              {/* Condensed Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-brandBorder pr-1">
                {items.map((item) => (
                  <div key={`${item.product_id}-${item.size}`} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded bg-brandAccent-light flex items-center justify-center text-lg shrink-0">
                        {item.emoji || '🫙'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-brandText truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-brandText3">
                          {item.size} × {item.qty}
                        </div>
                      </div>
                    </div>

                    <div className="font-bold text-brandText shrink-0">
                      {formatINR(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-brandBorder text-xs">
                <div className="flex justify-between text-brandText2">
                  <span>Subtotal</span>
                  <span className="font-semibold text-brandText">{formatINR(subtotal)}</span>
                </div>

                <div className="flex justify-between text-brandText2">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-brandGreen font-bold">FREE</span>
                    ) : (
                      formatINR(deliveryFee)
                    )}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-brandGreen font-semibold">
                    <span>Discount ({coupon?.code})</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-brandBorder flex justify-between items-baseline">
                  <span className="text-sm font-bold text-brandText">Total to Pay</span>
                  <span className="text-xl font-bold text-brandAccent">{formatINR(total)}</span>
                </div>
              </div>

              {/* Razorpay Action Button */}
              <div className="pt-3 border-t border-brandBorder">
                <RazorpayButton
                  formData={form.watch()}
                  isValid={form.formState.isValid}
                  onValidate={handleValidateForm}
                />
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
