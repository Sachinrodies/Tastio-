import { Request, Response, RequestHandler, NextFunction } from "express";
import { User } from "../models/User.model";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { generateVerificationCode } from "../Utils/generateVerification";
import { generateToken } from "../Utils/generateToken";
import { resetPasswordSuccessEmail, sendResetPasswordEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email";


export const signup = async (req: Request, res: Response) => {
    try {
        const { fullname, email, password, contact } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationCode();
        user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            contact: Number(contact),
            verificationToken: verificationToken,
            verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            isVerified: true // Set to true by default for now
        });
        generateToken(res, user);
        try {
            await sendVerificationEmail(user.email, verificationToken);
        } catch (emailError) {
            console.log("Failed to send verification email:", emailError);
            // Continue with signup even if email fails
        }
        const userWithoutPassword = await User.findOne({ email }).select("-password");
        res.status(201).json({ message: "User created successfully", user: userWithoutPassword });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }
        if (!user.isVerified) {
            res.status(400).json({ message: "Please verify your email before logging in" });
            return;
        }
        generateToken(res, user);
        user.lastlogin = new Date();
        await user.save();
        const userWithoutPassword = await User.findOne({ email }).select("-password");
        res.status(200).json({ 
            message: `Welcome back ${user.fullname}`, 
            user: userWithoutPassword 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { verificationCode } = req.body;
        
        const user = await User.findOne({ verificationToken: verificationCode, verificationTokenExpires: { $gt: Date.now() } }).select("-password");
        if (!user) {
            res.status(400).json({ message: "Invalid or expired verification code" });
            return;
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.fullname);
        res.status(200).json({ message: "Email verified successfully", user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        await sendResetPasswordEmail(user.email, resetToken);
        res.status(200).json({ message: "Reset password link sent to your email" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            res.status(400).json({ message: "Invalid or expired reset token" });
            return;
        }
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const checkAuth = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            user: user
        });
    }
    catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getUserProfile=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId;
        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        return res.status(200).json({message:"User profile",user})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"})
    }
};
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const { fullname, email, address, city, country, profilePicture } = req.body;
        let cloudResponse: any;
        cloudResponse = await cloudinary.uploader.upload(profilePicture);
        const updatedData = {
            fullname,
            email,
            address,
            city,
            country,
        };
        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User profile updated", user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
