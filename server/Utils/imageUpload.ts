import { v2 as cloudinary } from "cloudinary";
const uploadImageOnCloudinary=async(file:Express.Multer.File)=>{
    const base64Image=file.buffer.toString("base64");
    const dataUrl=`data:${file.mimetype};base64,${base64Image}`;
    const response=await cloudinary.uploader.upload(dataUrl,{
        resource_type:"auto",
    });
    return response.secure_url;
}
export default uploadImageOnCloudinary;