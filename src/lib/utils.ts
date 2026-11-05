import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TieredPriceSlab, TieredPriceType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscountPercent(mrp: number, price: number): number {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export const DEFAULT_TIERED_SLABS: TieredPriceSlab[] = [
  { min_qty: 2, max_qty: 4, value: 5 },
  { min_qty: 5, max_qty: 9, value: 10 },
  { min_qty: 10, max_qty: 999, value: 15 },
];

export function calculateTieredUnitPrice(
  basePrice: number,
  qty: number,
  tieredType?: TieredPriceType,
  slabs?: TieredPriceSlab[]
): {
  unitPrice: number;
  activeSlab: TieredPriceSlab | null;
  savingsPerUnit: number;
} {
  const effectiveType = tieredType || 'percentage_discount';
  const effectiveSlabs =
    tieredType === 'none'
      ? []
      : slabs && slabs.length > 0
      ? slabs
      : DEFAULT_TIERED_SLABS;

  if (effectiveType === 'none' || effectiveSlabs.length === 0 || qty <= 1) {
    // Still check if a slab starts at min_qty = 1
    const slabForOne = effectiveSlabs.find((s) => qty >= s.min_qty && qty <= (s.max_qty || 99999));
    if (!slabForOne || effectiveType === 'none') {
      return { unitPrice: basePrice, activeSlab: null, savingsPerUnit: 0 };
    }
  }

  const matched = effectiveSlabs.find(
    (s) => qty >= Number(s.min_qty) && qty <= Number(s.max_qty || 99999)
  );

  if (!matched) {
    return { unitPrice: basePrice, activeSlab: null, savingsPerUnit: 0 };
  }

  let unitPrice = basePrice;
  if (effectiveType === 'percentage_discount') {
    unitPrice = Math.max(1, Math.round(basePrice * (1 - Number(matched.value) / 100)));
  } else if (effectiveType === 'fixed_discount') {
    unitPrice = Math.max(1, Math.round(basePrice - Number(matched.value)));
  } else if (effectiveType === 'fixed_price') {
    unitPrice = Math.max(1, Math.round(Number(matched.value)));
  }

  return {
    unitPrice,
    activeSlab: matched,
    savingsPerUnit: Math.max(0, basePrice - unitPrice),
  };
}

export interface ProductCulinaryProfile {
  spiceLabel: 'Mild & Aromatic' | 'Medium Tangy' | 'Fiery Coastal' | 'Non-Spicy';
  chilies: 0 | 1 | 2 | 3;
  dietary: '100% Veg' | 'Coastal Seafood' | 'Ayurvedic Herbal';
  noOnionGarlic: boolean;
  pairings: string[];
}

export function getProductCulinaryProfile(product: {
  name?: string;
  category?: string;
  ingredients?: string;
}): ProductCulinaryProfile {
  const name = (product.name || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();
  const ing = (product.ingredients || '').toLowerCase();

  if (cat.includes('wellness') || name.includes('oil') || name.includes('hair')) {
    return {
      spiceLabel: 'Non-Spicy',
      chilies: 0,
      dietary: 'Ayurvedic Herbal',
      noOnionGarlic: true,
      pairings: ['Scalp Massage', 'Overnight Care', 'Daily Hair Nourishment'],
    };
  }

  if (cat.includes('fish') || name.includes('mackerel') || name.includes('shrimp') || name.includes('anchovy') || name.includes('sardine')) {
    return {
      spiceLabel: 'Fiery Coastal',
      chilies: 3,
      dietary: 'Coastal Seafood',
      noOnionGarlic: false,
      pairings: ['Boiled Red Rice & Ganji', 'Crispy Rava Fry', 'Kundapura Fish Curry'],
    };
  }

  if (cat.includes('sweet') || cat.includes('rice') || name.includes('poha') || name.includes('avalakki') || name.includes('laddu') || name.includes('halwa')) {
    return {
      spiceLabel: 'Mild & Aromatic',
      chilies: 0,
      dietary: '100% Veg',
      noOnionGarlic: true,
      pairings: ['Evening Filter Coffee', 'Mangalorean Sajjige-Bajil', 'Festive Platter'],
    };
  }

  const hasGarlic = name.includes('garlic') || ing.includes('garlic');

  if (name.includes('avakaya') || name.includes('ghee roast') || name.includes('bonda') || name.includes('chilli') || cat.includes('spice')) {
    return {
      spiceLabel: 'Fiery Coastal',
      chilies: 3,
      dietary: '100% Veg',
      noOnionGarlic: !hasGarlic,
      pairings: ['Steaming Rice & Ghee', 'Neer Dosa', 'Paneer / Chicken Ghee Roast'],
    };
  }

  return {
    spiceLabel: 'Medium Tangy',
    chilies: 2,
    dietary: '100% Veg',
    noOnionGarlic: !hasGarlic,
    pairings: ['Hot Dosa & Idli', 'Curd Rice Tiffin', 'Chapati & Parotta'],
  };
}

export interface ProductNutritionFacts {
  energyKcal: number;
  proteinG: string;
  carbsG: string;
  totalFatG: string;
  transFatG: string;
  sodiumMg: number;
  preservatives: string;
  oilBase: string;
  shelfLife: string;
}

export function getProductNutritionFacts(product: {
  name?: string;
  category?: string;
}): ProductNutritionFacts {
  const name = (product.name || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();

  if (cat.includes('fish') || name.includes('mackerel') || name.includes('shrimp') || name.includes('anchovy')) {
    return {
      energyKcal: 265,
      proteinG: '48.5g',
      carbsG: '1.2g',
      totalFatG: '7.4g',
      transFatG: '0g',
      sodiumMg: 680,
      preservatives: '0% (Natural Sea Salt Sun-Cured)',
      oilBase: 'Natural Marine Omega-3',
      shelfLife: '6 Months (Dry Storage)',
    };
  }

  if (cat.includes('spice') || name.includes('masala') || name.includes('podi')) {
    return {
      energyKcal: 340,
      proteinG: '11.2g',
      carbsG: '44.0g',
      totalFatG: '13.5g',
      transFatG: '0g',
      sodiumMg: 320,
      preservatives: '0% (100% Whole Roasted Spices)',
      oilBase: 'Dry Roasted in Iron Uruli',
      shelfLife: '9 Months',
    };
  }

  if (cat.includes('rice') || name.includes('poha') || name.includes('avalakki')) {
    return {
      energyKcal: 352,
      proteinG: '7.2g',
      carbsG: '76.5g',
      totalFatG: '1.4g',
      transFatG: '0g',
      sodiumMg: 12,
      preservatives: '0% (Unbleached Whole Grain)',
      oilBase: 'Zero Oil (Sun-Dried Grain)',
      shelfLife: '9 Months',
    };
  }

  return {
    energyKcal: 218,
    proteinG: '3.8g',
    carbsG: '18.4g',
    totalFatG: '14.2g',
    transFatG: '0g',
    sodiumMg: 540,
    preservatives: '0% (Zero Synthetic Preservatives)',
    oilBase: '100% Wood-Pressed Gingelly Oil',
    shelfLife: '6 Months',
  };
}


