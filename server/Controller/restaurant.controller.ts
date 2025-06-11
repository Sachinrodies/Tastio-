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
        res.status(500).json({message:"Internal server error"});
    }
}
export const getRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.find({user:req.userId});
        if(!restaurant || restaurant.length === 0){
            res.status(404).json({message:"Restaurant not found"});
            return;
        }
        res.status(200).json({message:"Restaurants fetched successfully", restaurant});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}
export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisine } = req.body;
        const file = req.file;
        const restaurant = await Restaurant.findOne({ user: req.userId });
      
        if (!restaurant) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }

        // Update basic fields
        if (restaurantName) restaurant.restaurantName = restaurantName;
        if (city) restaurant.city = city;
        if (country) restaurant.country = country;
        if (deliveryTime) restaurant.deliveryTime = deliveryTime;
        
        // Handle cuisine update
        if (cuisine) {
            try {
                const cuisineData = typeof cuisine === 'string' ? JSON.parse(cuisine) : cuisine;
                restaurant.cuisines = cuisineData;
            } catch (error) {
                res.status(400).json({ message: "Invalid cuisine data format" });
                return;
            }
        }

        // Handle image update
        if (file) {
            try {
                const image = await uploadImageOnCloudinary(file as Express.Multer.File);
                restaurant.imageUrl = image;
            } catch (error) {
                res.status(500).json({ message: "Failed to upload image" });
                return;
            }
        }

        await restaurant.save();
        res.status(200).json({ message: "Restaurant updated successfully", restaurant });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getRestaurantOrMenu = async (req: Request, res: Response) => {
    try {
        const restaurant=await Restaurant.findOne({user:req.userId}).populate("menus");
        if(!restaurant){
            res.status(404).json({message:"Restaurant not found"});
            
            return;
        }
        const orders=await Order.find({restaurant:restaurant._id}).populate("restaurant").populate("user");
        res.status(200).json({message:"Orders fetched successfully",orders});
    } catch (error) {
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
        res.status(500).json({message:"Internal server error"});
    }
}

export const searchRestaurant = async (req: Request, res: Response) => {
    try{
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery || "";
        // Filter out empty strings from selectedCuisines
        let selectedCuisines: string[] = [];
        if (Array.isArray(req.query.selectedCuisines)) {
            selectedCuisines = (req.query.selectedCuisines as string[]).filter(Boolean);
        } else if (typeof req.query.selectedCuisines === 'string' && req.query.selectedCuisines) {
            selectedCuisines = [req.query.selectedCuisines];
        }
        
        const searchConditions = [];
        
        // Handle searchText
        if(searchText) {
            searchConditions.push(
                { restaurantName: { $regex: searchText, $options: "i" } },
                { city: { $regex: searchText, $options: "i" } },
                { country: { $regex: searchText, $options: "i" } }
            );
        }
        
        // Handle searchQuery
        if(searchQuery) {
            searchConditions.push(
                { restaurantName: { $regex: searchQuery, $options: "i" } },
                { cuisines: { $regex: searchQuery, $options: "i" } }
            );
        }
        
        // Cuisine OR logic
        if(selectedCuisines.length > 0) {
            searchConditions.push({ cuisines: { $in: selectedCuisines } });
        }
        
        const query: any = {};
        if(searchConditions.length > 0) {
            query.$or = searchConditions;
        }
        
        const restaurants = await Restaurant.find(query);
        res.status(200).json({
            message: "Restaurants fetched successfully",
            data: restaurants
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getSingleRestaurant = async (req: Request, res: Response) => {
    try{
        const {restaurantId}=req.params;
        const restaurant=await Restaurant.findOne({_id:restaurantId}).populate({
            path:"menus",
            options:{createdAt:-1},
        })
        if(!restaurant){
            res.status(404).json({message:"Restaurant not found"});
            return;
        }
        res.status(200).json({success:true,restaurant});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}

export const getRestaurantOrders = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.params.id;
        const orders = await Order.find({ restaurant: restaurantId })
            .populate("restaurant")
            .populate("user");
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}


    
    

