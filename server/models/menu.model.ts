import mongoose, { Document } from "mongoose";
export interface IMenu{
    // _id:mongoose.Schema.Types.ObjectId;
    name:string;
    description:string;
    price:number;
    imageUrl:string;
}
export interface IMenuModel extends IMenu,Document{
    createdAt:Date;
    updatedAt:Date;
}
const menuSchema=new mongoose.Schema<IMenuModel>({
   
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true,
    }
},{timestamps:true} ) 

export const Menu=mongoose.model("Menu",menuSchema);
