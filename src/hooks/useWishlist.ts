import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WishlistStore {
  productIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggleWishlist: (productId: string) => {
        const current = get().productIds;
        if (current.includes(productId)) {
          set({ productIds: current.filter((id) => id !== productId) });
        } else {
          set({ productIds: [...current, productId] });
        }
      },
      isInWishlist: (productId: string) => {
        return get().productIds.includes(productId);
      },
      clearWishlist: () => set({ productIds: [] }),
    }),
    {
      name: 'vishnu-wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
