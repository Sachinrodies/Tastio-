import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import { IMenuModel } from "../models/menu.model";
import Stripe from "stripe";
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
        fullname: string;
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
        res.status(500).json({message:"Internal server error"});
    }
}

export const createCheckoutSession=async(req:Request,res:Response): Promise<void>=>{
    try {
        const checkoutSession=req.body;
        
        if (!checkoutSession.restaurantId) {
            res.status(400).json({ message: "Restaurant ID is required" });
            return;
        }

        if (!process.env.STRIPE_KEY) {
            res.status(500).json({ message: "Stripe configuration is missing" });
            return;
        }

        const restaurant = await Restaurant.findById(checkoutSession.restaurantId).populate<{ menus: IMenuModel[] }>("menus");
        if(!restaurant){
            res.status(404).json({message:"Restaurant not found"});
            return;
        }

        if (!checkoutSession.cartItems || checkoutSession.cartItems.length === 0) {
            res.status(400).json({ message: "Cart items are required" });
            return;
        }

        const totalAmount = checkoutSession.cartItems.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);

        // Transform cartItems to include menu field
        const transformedCartItems = checkoutSession.cartItems.map((item: { menuId: string; name: string; image: string; price: number; quantity: number }) => ({
            menu: item.menuId, // Use menuId as the menu field
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity
        }));

        const order=new Order({
            restaurant:restaurant._id,
            user:req.userId,
            deliveryDetails:{
                ...checkoutSession.deliveryDetails,
                name: checkoutSession.deliveryDetails.fullname
            },
            cartItems: transformedCartItems,
            totalAmount,
            status:"pending",
        });

        const menuItems = restaurant.menus.map(menu => ({
            menuId: (menu as any)._id.toString(),
            name: menu.name,
            image: menu.imageUrl,
            price: menu.price,
            quantity: 0
        }));

        const lineItems = await createLineItems(checkoutSession, menuItems);

        if (!lineItems || lineItems.length === 0) {
            res.status(400).json({ message: "Failed to create line items" });
            return;
        }

        try {
            const session=await stripe.checkout.sessions.create({
                payment_method_types:["card"],
                shipping_address_collection:{
                    allowed_countries:["IN"],
                },
                line_items:lineItems as any,
                mode:"payment",
                success_url:`${process.env.FRONTEND_URL}/order/status?orderId=${order._id}`,
                cancel_url:`${process.env.FRONTEND_URL}/cart`,
                metadata:{
                    orderId:order._id.toString(),
                    images:JSON.stringify(menuItems.map((item:any)=>item.image))
                },
            });

            if(!session.url){
                res.status(500).json({message:"Failed to create checkout session"});
                return;
            }

            await order.save();
            
            res.status(200).json({url:session.url});
        } catch (stripeError: any) {
            res.status(500).json({
                message: "Failed to create checkout session",
                error: stripeError.message
            });
        }
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}
export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
    let event;

    try {
        const signature = req.headers["stripe-signature"];

        // Construct the payload string for verification
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;

        // Generate test header string for event construction
        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });

        // Construct the event using the payload string and header
        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error: any) {
        res.status(400).send(`Webhook error: ${error.message}`);
        return;
    }

    // Handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
        try {
            const session = event.data.object as Stripe.Checkout.Session;
            const order = await Order.findById(session.metadata?.orderId);

            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return;
            }

            // Update the order with the amount and status
            if (session.amount_total) {
                order.totalAmount = session.amount_total;
            }
            order.status = "confirmed";

            await order.save();
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }
    }
    // Send a 200 response to acknowledge receipt of the event
    res.status(200).send();
};



export const createLineItems=async(checkoutSession:CheckoutSession,menuItems:MenuItems[])=>{
    try {
        const lineItems=checkoutSession.cartItems.map((item)=>{
            const menuItem=menuItems.find((menuItem)=>menuItem.menuId.toString()===item.menuId);
            if(!menuItem){
                throw new Error(`Menu item not found for ID: ${item.menuId}`);
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
        });
        return lineItems;
    } catch (error) {
        throw error;
    }
}

export const getOrderStatus = async (req: Request, res: Response) => {
    try {
        const orderId = req.query.orderId as string;
        
        if (!orderId) {
            res.status(400).json({ message: "Order ID is required" });
            return;
        }

        const order = await Order.findById(orderId)
            .populate("restaurant")
            .populate("user");

        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}