import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImageOnCloudinary = async (file: Express.Multer.File) => {
    try {
        const base64Image = file.buffer.toString("base64");
        const dataUrl = `data:${file.mimetype};base64,${base64Image}`;
        const response = await cloudinary.uploader.upload(dataUrl, {
            resource_type: "auto",
        });
        return response.secure_url;
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new Error("Failed to upload image");
    }
}

export default uploadImageOnCloudinary;