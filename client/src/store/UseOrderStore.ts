import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { CheckoutSessionResponse } from "@/types/OrderType"
import axios from "axios"

import { toast } from "sonner"
const API_END_POINT ="http://localhost:8000/api/v1/order"

interface OrderState {
  loading: boolean;
  orders: any[];
  createCheckoutSession: (checkoutData: CheckoutSessionResponse) => Promise<void>;
  getOrders: () => Promise<void>;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      loading: false,
      orders: [],
      createCheckoutSession: async (checkoutData: CheckoutSessionResponse) => {
        try {
          set({ loading: true })
          const response = await axios.post(`${API_END_POINT}/checkout/create-checkout-session`, checkoutData, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          
          if (!response.data || !response.data.url) {
            throw new Error('Invalid checkout session response');
          }
          
          window.location.href = response.data.url;
          set({ loading: false })
        } catch (error: any) {
          console.error('Checkout error:', error);
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            toast.error(error.response.data.message || 'Failed to create checkout session');
          } else if (error.request) {
            // The request was made but no response was received
            toast.error('No response from server. Please check if the server is running.');
          } else {
            // Something happened in setting up the request that triggered an Error
            toast.error('Failed to create checkout session');
          }
          set({ loading: false })
        }
      },
      getOrders: async () => {
        set({ loading: true })
        try {
          const response = await axios.get(`${API_END_POINT}`, {
            withCredentials: true
          })
          set({ loading: false, orders: response.data.orders })
          toast.success("Orders fetched successfully")
        } catch (error: any) {
          set({ loading: false })
          if (error.response) {
            toast.error(error.response.data.message || 'Failed to fetch orders')
          } else if (error.request) {
            toast.error('No response from server. Please check if the server is running.')
          } else {
            toast.error('Failed to fetch orders')
          }
        }
      }
    }),
    {
      name: "order-name",
      storage: createJSONStorage(() => localStorage)
    }
  )
)
