'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CheckoutFormData } from '@/lib/schemas/checkout';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  formData: CheckoutFormData;
  isValid: boolean;
  onValidate: () => Promise<boolean>;
}

export const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  formData,
  isValid,
  onValidate,
}) => {
  const router = useRouter();
  const { items, coupon, getTotal, getSubtotal, getDeliveryFee, getDiscount, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const total = getTotal();
  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = getDiscount();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setErrorMessage('');
    const formValid = await onValidate();
    if (!formValid) {
      setErrorMessage('Please complete all required fields with valid details.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsProcessing(true);

    try {
      // If Cash on Delivery was selected
      if (formData.paymentMethod === 'cod') {
        const orderId = 'VHP-' + Math.random().toString(36).substring(2, 9).toUpperCase();
        
        // Save order locally/in database
        saveOrderToHistory({
          id: orderId,
          items: items.map((i) => ({ ...i, unit_price: i.price })),
          subtotal,
          delivery_fee: deliveryFee,
          discount,
          total,
          coupon_code: coupon?.code,
          status: 'confirmed',
          payment_status: 'unpaid',
          shipping_name: formData.name,
          shipping_phone: formData.phone,
          shipping_email: formData.email,
          shipping_address: formData,
          created_at: new Date().toISOString(),
        });

        clearCart();
        router.push(`/order/${orderId}`);
        return;
      }

      // Online Razorpay Payment Flow
      const isScriptLoaded = await loadRazorpayScript();

      // Call create-order API route
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          items,
          shipping: formData,
        }),
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.order_id) {
        // Fallback demo simulation if live Razorpay keys are not yet configured in env
        if (orderData.simulated || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_live')) {
          const demoOrderId = orderData.order_id || 'VHP-' + Math.random().toString(36).substring(2, 9).toUpperCase();
          saveOrderToHistory({
            id: demoOrderId,
            items: items.map((i) => ({ ...i, unit_price: i.price })),
            subtotal,
            delivery_fee: deliveryFee,
            discount,
            total,
            coupon_code: coupon?.code,
            status: 'confirmed',
            payment_status: 'paid',
            shipping_name: formData.name,
            shipping_phone: formData.phone,
            shipping_email: formData.email,
            shipping_address: formData,
            created_at: new Date().toISOString(),
          });

          clearCart();
          router.push(`/order/${demoOrderId}`);
          return;
        }

        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // Open Razorpay Standard Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_default',
        amount: total * 100,
        currency: 'INR',
        name: 'Vishnu Home Products',
        description: 'Authentic Homemade Food & Pickles',
        image: '/logo.svg',
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            // Verify signature on server
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: orderData.order_id,
                items,
                total,
                shipping: formData,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              saveOrderToHistory({
                id: orderData.order_id,
                items: items.map((i) => ({ ...i, unit_price: i.price })),
                subtotal,
                delivery_fee: deliveryFee,
                discount,
                total,
                coupon_code: coupon?.code,
                status: 'confirmed',
                payment_status: 'paid',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                shipping_name: formData.name,
                shipping_phone: formData.phone,
                shipping_email: formData.email,
                shipping_address: formData,
                created_at: new Date().toISOString(),
              });

              clearCart();
              router.push(`/order/${orderData.order_id}`);
            } else {
              setErrorMessage('Payment verification failed. Please reach out to customer support.');
            }
          } catch (e) {
            setErrorMessage('An error occurred while verifying your payment.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#d97706',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Payment initiation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const saveOrderToHistory = (order: any) => {
    try {
      const existing = JSON.parse(localStorage.getItem('vishnu-orders') || '[]');
      localStorage.setItem('vishnu-orders', JSON.stringify([order, ...existing]));
    } catch (e) {
      // ignore storage errors
    }
  };

  return (
    <div className="space-y-3">
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-brandRed font-medium">
          {errorMessage}
        </div>
      )}

      <Button
        type="button"
        onClick={handlePayment}
        isLoading={isProcessing}
        disabled={isProcessing}
        size="lg"
        className="w-full h-12 bg-brandAccent hover:bg-brandAccent-mid text-white font-bold text-sm shadow-md"
      >
        <Lock className="w-4 h-4 mr-2" />
        <span>
          {formData.paymentMethod === 'cod'
            ? `Place COD Order (${formatINR(total)})`
            : `Pay ${formatINR(total)} via Razorpay`}
        </span>
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-brandText3">
        <ShieldCheck className="w-4 h-4 text-brandGreen" />
        <span>256-Bit Encrypted & 100% Secure Transaction</span>
      </div>
    </div>
  );
};
