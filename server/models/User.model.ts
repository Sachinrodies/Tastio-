import mongoose, { Document } from "mongoose";
export interface IUser{
    fullname:string;
    email:string;
    password:string;
    contact:number;
    address:string;
    city:string;
    country:string;
    profilePicture:string;
    admin:boolean;
    lastlogin?:Date;
    isVerified?:boolean;
    resetPasswordToken?:string;
    resetPasswordExpires?:Date;
    verificationToken?:string;
    verificationTokenExpires?:Date;
}
export interface IUserModel extends IUser,Document{
    createdAt:Date;
    updatedAt:Date;
    
}
const userSchema=new mongoose.Schema<IUserModel>({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        
    },
    password:{
        type:String,
        required:true,
    },
    contact:{
       type:Number,
       required:true,
    },
    address:{
        type:String,
       default:"Update your address",
    },
    city:{
        type:String,
        default:"Update your city",
    },
    country:{
        type:String,
        default:"Update your country",
    },
    profilePicture:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
   admin:{
    type:Boolean,
    default:false,
   },
//    Advanced authentication
   lastlogin:{
    type:Date,
    default:Date.now,
   },
   isVerified:{
    type:Boolean,
    default:true,
   },
   resetPasswordToken:{
    type:String,
   },
   resetPasswordExpires:{
    type:Date,
   },
   verificationToken:{
    type:String,
   },
   verificationTokenExpires:{
    type:Date,
   }
  
},{timestamps:true})

export const User=mongoose.model("User",userSchema);