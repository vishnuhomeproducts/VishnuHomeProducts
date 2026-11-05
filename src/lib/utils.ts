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
