import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import uploadImageOnCloudinary from "../Utils/imageUpload";
import { Order } from "../models/order.model";
import { Menu } from "../models/menu.model";
export const createRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city,country,deliveryTime,cuisine} = req.body;
        const file=req.file;
        const restaurant=await Restaurant.findOne({user:req.userId});
        if(restaurant){
            res.status(400).json({message:"Restaurant already exists"});
            return;
        }
        if(!file){
            res.status(400).json({message:"Image is required"});
            return;
        }
        const imageUrl=await uploadImageOnCloudinary(file as Express.Multer.File);
        const newRestaurant=await Restaurant.create({
            user:req.userId,
            restaurantName,
            city,
            country,
            deliveryTime,
            cuisine:JSON.parse(cuisine),
            imageUrl,
        });
        res.status(201).json({message:"Restaurant created successfully",restaurant:newRestaurant});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
export const getRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant=await Restaurant.find({user:req.userId});
        if(!restaurant){
            res.status(404).json({message:"Restaurant not found"});
            return;
        }
        res.status(200).json({message:"Restaurants fetched successfully",restaurant});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city,country,deliveryTime,cuisine,imageUrl} = req.body;
        const file=req.file;
        const restaurant=await Restaurant.findOne({user:req.userId});
      
        if(!restaurant){
            res.status(404).json({message:"Restaurant not found"});
            return;
        }
        restaurant.restaurantName=restaurantName;
        restaurant.city=city;
        restaurant.country=country;
        restaurant.deliveryTime=deliveryTime;
        restaurant.cuisines=JSON.parse(cuisine);
        if(file){
            const image=await uploadImageOnCloudinary(file as Express.Multer.File);
            restaurant.imageUrl=image;
        }
        await restaurant.save();
        res.status(200).json({message:"Restaurant updated successfully",restaurant});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
export const getRestaurantOrMenu = async (req: Request, res: Response) => {
    try {
        const restaurant=await Restaurant.findOne({user:req.userId});
        if(!restaurant){
            res.status(404).json({message:"Restaurant not found"});
            return;
        }
        const orders=await Order.find({restaurant:restaurant._id}).populate("restaurant").populate("user");
        res.status(200).json({message:"Orders fetched successfully",orders});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
export const updateOrderStatus = async (req: Request, res: Response) => {
    try{
        const {orderId}=req.params;
        const {status}=req.body;
        const order=await Order.findOne({_id:orderId});
        if(!order){
            res.status(404).json({message:"Order not found"});
            return;
        }
        order.status=status;
        await order.save();
        res.status(200).json({message:"Order status updated successfully",order});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

export const searchRestaurant = async (req: Request, res: Response) => {
    try{
        const searchText=req.params.searchText||"";
        const searchQuery=req.query.searchQuery||"";
        const selectedCuisine=(req.query.selectedCuisine as string ||"").split(",").filter((cuisine: string)=>cuisine);
        const query:any={};
        if(searchText){
            query.$or=[
                {restaurantName:{$regex:searchText,$options:"i"}},
                {city:{$regex:searchText,$options:"i"}},
                {country:{$regex:searchText,$options:"i"}},
            ];
        }
        if(searchQuery){
            query.$or=[
                {restaurantName:{$regex:searchQuery,$options:"i"}},
                {cuisines:{$regex:searchQuery,$options:"i"}},
            ];
        }
        if(selectedCuisine.length>0){
            query.cuisines={$in:selectedCuisine};
        }
        const restaurants=await Restaurant.find(query);
        res.status(200).json({message:"Restaurants fetched successfully",restaurants});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

export const getSingleRestaurant = async (req: Request, res: Response) => {
    try{
        const {restaurantId}=req.params;
        const restaurant=await Restaurant.findOne({_id:restaurantId}).populate({
            path:"menu",
            options:{createdAt:-1},
        })
        if(!restaurant){
            res.status(404).json({message:"Restaurant not found"});
            return;
        }
        res.status(200).json({message:"Restaurant fetched successfully",restaurant});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
    
    

