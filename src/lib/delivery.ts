// Delivery fee & pincode classification for Vishnu Home Products

export interface DeliveryClassification {
  fee: number;
  isLocal: boolean;
  deliveryType: string;
}

export function calculateDeliveryFee(
  pincode: string | undefined,
  subtotal: number
): DeliveryClassification {
  if (subtotal >= 999) {
    return { fee: 0, isLocal: false, deliveryType: 'Free Shipping (> ₹999)' };
  }

  const cleanPincode = (pincode || '').trim();
  // Coastal Karnataka (575xxx Mangaluru, 576xxx Udupi)
  if (cleanPincode.startsWith('575') || cleanPincode.startsWith('576')) {
    return { fee: 40, isLocal: true, deliveryType: 'MANGALURU_LOCAL' };
  }
  // Bengaluru Urban/Rural (560xxx)
  if (cleanPincode.startsWith('560')) {
    return { fee: 79, isLocal: false, deliveryType: 'BENGALURU_LOCAL' };
  }
  // Standard pan-India courier
  return { fee: 80, isLocal: false, deliveryType: 'PAN_INDIA_COURIER' };
}
