import type { MenuItem } from "./restaurantType"
export interface cartItem extends MenuItem{
    quantity:number,
    restaurantId:string
}
export type CartState={
    cartItems:cartItem[],
    addToCart:(item:cartItem)=>void
    clearCart:()=>void
    removeFromCart:(id:string)=>void
    incrementQuantity:(id:string)=>void
    decrementQuantity:(id:string)=>void
    
}

