// Delivery fee & pincode classification for Vishnu Home Products
// Bengaluru primary local delivery; extensible for upcoming Shiprocket integration

export interface DeliveryClassification {
  fee: number;
  isLocal: boolean;
  deliveryType: string;
}

export function calculateDeliveryFee(
  pincode: string | undefined,
  subtotal: number,
  clientFee?: number
): DeliveryClassification {
  // If Shiprocket or dynamic delivery fee is explicitly provided, respect it
  if (typeof clientFee === 'number' && clientFee >= 0) {
    return {
      fee: clientFee,
      isLocal: (pincode || '').trim().startsWith('560'),
      deliveryType: (pincode || '').trim().startsWith('560') ? 'BENGALURU_LOCAL' : 'PAN_INDIA_COURIER',
    };
  }

  if (subtotal >= 999) {
    return { fee: 0, isLocal: false, deliveryType: 'Free Shipping (> ₹999)' };
  }

  const cleanPincode = (pincode || '').trim();

  // Bengaluru Primary Local Delivery (560xxx)
  if (cleanPincode.startsWith('560')) {
    return { fee: 50, isLocal: true, deliveryType: 'BENGALURU_LOCAL' };
  }

  // Coastal / Mangaluru Regional (575xxx, 576xxx)
  if (cleanPincode.startsWith('575') || cleanPincode.startsWith('576')) {
    return { fee: 60, isLocal: false, deliveryType: 'MANGALURU_REGIONAL' };
  }

  // Pan-India Surface Courier
  return { fee: 80, isLocal: false, deliveryType: 'PAN_INDIA_COURIER' };
}
