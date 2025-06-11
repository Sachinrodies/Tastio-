import { Request, Response } from "express";
import mongoose from "mongoose";
import { Menu } from "../models/menu.model";
import uploadImageOnCloudinary from "../Utils/imageUpload";
import { Restaurant } from "../models/restaurant.model";

export const addMenu=async(req:Request,res:Response)=>{
    try {
        const {name,description,price}=req.body;
        const file=req.file;
        if(!file){
            res.status(400).json({message:"Image is required"});
            return;
        }
        const imageUrl=await uploadImageOnCloudinary(file as Express.Multer.File);
        const menu=await Menu.create({name,description,price,imageUrl});
        const restaurant=await Restaurant.findOne({user:req.userId}); 
        if(restaurant){
            (restaurant.menus as unknown as mongoose.Types.ObjectId[]).push(menu._id);
            await restaurant.save();
        }
        res.status(201).json({message:"Menu added successfully",menu});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}

export const editMenu=async(req:Request,res:Response)=>{
    try {
        const {id}=req.params;
        const {name,description,price}=req.body;
        const file=req.file;
        const menu=await Menu.findById(id);
        if(!menu){
            res.status(404).json({message:"Menu not found"});
            return;
        }
        if(name) menu.name=name;
        if(description) menu.description=description;
        if(price) menu.price=price;
        if(file){
            const imageUrl=await uploadImageOnCloudinary(file as Express.Multer.File);
            menu.imageUrl=imageUrl;
        }
        await menu.save();
        res.status(200).json({message:"Menu updated successfully",menu});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}