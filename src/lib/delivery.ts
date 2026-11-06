// Delivery fee & pincode classification for Vishnu Home Products
// Exclusive Shipping Partner: Delhivery (delhivery.com)
// Central Dispatch Warehouse Origin: Bangalore, Karnataka (560038)

export interface DeliveryClassification {
  fee: number;
  isLocal: boolean;
  deliveryType: string;
  courier: 'Delhivery';
  estimatedDays: number;
  expectedDelivery: string;
}

export function calculateDeliveryFee(
  pincode: string | undefined,
  subtotal: number,
  clientFee?: number
): DeliveryClassification {
  // If explicitly overridden by dynamic Delhivery API calculation
  if (typeof clientFee === 'number' && clientFee >= 0) {
    const isBlr = (pincode || '').trim().startsWith('560');
    return {
      fee: clientFee,
      isLocal: isBlr,
      deliveryType: isBlr ? 'BANGALORE_LOCAL_DELHIVERY' : 'PAN_INDIA_DELHIVERY',
      courier: 'Delhivery',
      estimatedDays: isBlr ? 1 : 3,
      expectedDelivery: isBlr ? 'Next-Day Express' : '2–4 Business Days',
    };
  }

  // Free shipping on subtotal >= ₹499
  if (subtotal >= 499) {
    const isBlr = (pincode || '').trim().startsWith('560');
    return {
      fee: 0,
      isLocal: isBlr,
      deliveryType: 'FREE_DELHIVERY_SHIPPING (> ₹499)',
      courier: 'Delhivery',
      estimatedDays: isBlr ? 1 : 3,
      expectedDelivery: isBlr ? 'Next-Day Express (Free)' : '2–4 Days (Free Express)',
    };
  }

  const cleanPincode = (pincode || '').trim();

  // Bangalore Local Delivery (560xxx)
  if (cleanPincode.startsWith('560')) {
    return {
      fee: 40,
      isLocal: true,
      deliveryType: 'BANGALORE_LOCAL_DELHIVERY',
      courier: 'Delhivery',
      estimatedDays: 1,
      expectedDelivery: 'Next-Day Express by Delhivery',
    };
  }

  // South Regional (Karnataka 57/58/59, TN, Kerala, AP, Telangana)
  if (['57', '58', '59', '60', '61', '62', '63', '64', '67', '68', '69', '50', '51', '52', '53'].some((p) => cleanPincode.startsWith(p))) {
    return {
      fee: 50,
      isLocal: false,
      deliveryType: 'SOUTH_REGIONAL_DELHIVERY',
      courier: 'Delhivery',
      estimatedDays: 2,
      expectedDelivery: '2–3 Business Days from Bangalore Hub',
    };
  }

  // Pan-India Express Surface/Air
  return {
    fee: 60,
    isLocal: false,
    deliveryType: 'PAN_INDIA_DELHIVERY',
    courier: 'Delhivery',
    estimatedDays: 4,
    expectedDelivery: '3–5 Business Days from Bangalore Hub',
  };
}
