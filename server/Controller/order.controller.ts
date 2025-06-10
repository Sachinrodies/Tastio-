import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import { IMenuModel } from "../models/menu.model";
const stripe=require("stripe")(process.env.STRIPE_KEY!);

type CheckoutSession={
    cartItems:{
        menuId:string;
        name:string;
        image:string;
        price:number;
        quantity:number;

    }[],
    deliveryDetails:{
        name:string;
        email:string;
        address:string;
        city:string;

    },
    restaurantId:string;

   
   
    
}
type MenuItems={
    
        menuId:string;
        name:string;
        image:string;
        price:number;
        quantity:number;
    
}
export const getOrders=async(req:Request,res:Response)=>{
    try {
        const orders=await Order.find({user:req.userId}).populate("user").populate("restaurant");
        res.status(200).json({orders});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
export const createCheckoutSession=async(req:Request,res:Response)=>{
    try {
        const checkoutSession=req.body;
        const restaurant = await Restaurant.findById(checkoutSession.restaurantId).populate<{ menus: IMenuModel[] }>("menus");
        if(!restaurant){
            res.status(404).json({message:"Restaurant not found"});
            return;
        }
        const order=new Order({
           
            restaurant:restaurant._id,
            user:req.userId,
           
            deliveryDetails:checkoutSession.deliveryDetails,
            items:checkoutSession.cartItems,

            status:"pending",
        });
        //line items
        const menuItems = restaurant.menus.map(menu => ({
            menuId: (menu as any)._id.toString(),
            name: menu.name,
            image: menu.imageUrl,
            price: menu.price,
            quantity: 0
        }));
        const lineItems = await createLineItems(checkoutSession, menuItems);
        const session=await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            shipping_address_collection:{
                allowed_countries:["IN"],
            },

            line_items:lineItems as any,
            mode:"payment",
            success_url:`${process.env.FRONTEND_URL}/order/status`,
            cancel_url:`${process.env.FRONTEND_URL}/cart`,
            metadata:{
                orderId:order._id.toString(),
                images:JSON.stringify(menuItems.map((item:any)=>item.image))
            },


        });
        if(!session.url){
            res.status(500).json({message:"Failed to create checkout session"});
        }
        await order.save();
        res.status(200).json({url:session.url});
      
       
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
export const createLineItems=async(checkoutSession:CheckoutSession,menuItems:MenuItems[])=>{
    const lineItems=checkoutSession.cartItems.map((item)=>{
        const menuItem=menuItems.find((menuItem)=>menuItem.menuId===item.menuId);
        if(!menuItem){
            throw new Error("Menu item not found");
        }
        return {
            price_data:{
                currency:"inr",
                product_data:{
                    name:menuItem.name,
                    images:[menuItem.image],
                },
                unit_amount:menuItem.price*100,
            },
            quantity:item.quantity,
        }
    })
    return lineItems;
}