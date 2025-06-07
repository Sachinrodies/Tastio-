import jwt from "jsonwebtoken";
import { Response } from "express";
import { IUserModel } from "../models/User.model";
import { Document } from "mongoose";
export const generateToken=(res:Response,user:IUserModel & Document)=>{
    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET! ,{expiresIn:"1d"});
    res.cookie("token",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",maxAge:24*60*60*1000});
    return token;
}
export const verifyToken=(token:string)=>{
    return jwt.verify(token,process.env.JWT_SECRET as string);
}