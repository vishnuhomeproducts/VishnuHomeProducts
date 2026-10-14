import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Coupon } from '@/types';

interface CartStore {
  items: CartItem[];
  coupon: Coupon | null;
  isDrawerOpen: boolean;
  
  // Drawer controls
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  
  // Cart Actions
  addItem: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void;
  removeItem: (productId: string, size: string) => void;
  updateQty: (productId: string, size: string, qty: number) => void;
  clearCart: () => void;
  
  // Coupon Actions
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  
  // Calculations
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      addItem: (newItem) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.product_id === newItem.product_id && item.size === newItem.size
        );

        const qtyToAdd = newItem.qty || 1;

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingIndex].qty += qtyToAdd;
          set({ items: updatedItems, isDrawerOpen: true });
        } else {
          set({
            items: [...currentItems, { ...newItem, qty: qtyToAdd }],
            isDrawerOpen: true,
          });
        }
      },

      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.product_id === productId && item.size === size)
          ),
        });
      },

      updateQty: (productId, size, qty) => {
        if (qty <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.product_id === productId && item.size === size
              ? { ...item, qty }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.qty, 0);
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 999 ? 0 : 80;
      },

      getDiscount: () => {
        const { coupon } = get();
        const subtotal = get().getSubtotal();
        if (!coupon || subtotal === 0) return 0;
        if (coupon.min_order && subtotal < coupon.min_order) return 0;

        if (coupon.discount_type === 'percent') {
          return Math.round((subtotal * coupon.discount_value) / 100);
        }
        return Math.min(coupon.discount_value, subtotal);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const delivery = get().getDeliveryFee();
        const discount = get().getDiscount();
        return Math.max(0, subtotal + delivery - discount);
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.qty, 0);
      },
    }),
    {
      name: 'vishnu-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, coupon: state.coupon }),
    }
  )
);
