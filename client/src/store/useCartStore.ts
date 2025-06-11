import type { CartState, cartItem } from "@/types/CartType";
import type { MenuItem } from "@/types/restaurantType";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartItem extends MenuItem {
    quantity: number;
    restaurantId: string;
}

export const useCartStore = create<CartState>()(persist((set) => ({
    cartItems: [],
    addToCart: (item: CartItem) => {
        set((state) => {
            // If cart is not empty and the new item is from a different restaurant, clear the cart
            if (state.cartItems.length > 0 && state.cartItems[0].restaurantId !== item.restaurantId) {
                return {
                    cartItems: [item]
                };
            }

            const existingItem = state.cartItems.find((i) => i._id === item._id);
            if (existingItem) {
                return {
                    cartItems: state.cartItems.map((i) => 
                        i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
                    )
                };
            }
            return {
                cartItems: [...state.cartItems, item]
            };
        });
    },
    clearCart: () => set({ cartItems: [] }),
    removeFromCart: (id: string) => 
        set((state) => ({
            cartItems: state.cartItems.filter((item) => item._id !== id)
        })),
    incrementQuantity: (id: string) =>
        set((state) => ({
            cartItems: state.cartItems.map((item) =>
                item._id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        })),
    decrementQuantity: (id: string) =>
        set((state) => ({
            cartItems: state.cartItems.map((item) =>
                item._id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        }))
}), {
    name: "cart-store",
    storage: createJSONStorage(() => localStorage)
}));




