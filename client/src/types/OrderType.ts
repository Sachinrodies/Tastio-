export type CheckoutSessionResponse={
    cartItems:{
        menuId:string,
        name:string,
        image:string,
        price:number,
        quantity:number,
    }[],
   deliveryDetails:{
    fullname:string,
    email:string,
    contact:string,
    address:string,
    city:string,
    country:string,
   },
   restaurantId:string,
}

export interface orders extends CheckoutSessionResponse{
    _id:string,
   
    orderStatus:string,
    orderTotal:number,
 
}
export type OrderState={
    loading:boolean,
    orders:orders[],
    createCheckoutSession:(checkoutData:CheckoutSessionResponse)=>Promise<void>,
    getOrders:()=>Promise<void>,
    getOrderById:(id:string)=>Promise<void>,
    updateOrderStatus:(id:string,status:string)=>Promise<void>,
    deleteOrder:(id:string)=>Promise<void>,
}