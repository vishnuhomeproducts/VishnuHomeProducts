import Razorpay from 'razorpay';

export const RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  process.env.RAZORPAY_KEY_ID ||
  'rzp_live_TwPhPdtyvx4ygv';

const RAZORPAY_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET || 'aBxBNXdsixOBCjadbUseaiFY';

export function getRazorpayInstance() {
  return new Razorpay({
    key_id:
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET || RAZORPAY_KEY_SECRET,
  });
}

export const razorpay = getRazorpayInstance();
export const getRazorpaySecret = () =>
  process.env.RAZORPAY_KEY_SECRET || RAZORPAY_KEY_SECRET;

