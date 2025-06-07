import {v2 as cloudinary} from "cloudinary";
cloudinary.config({
   
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
    cloud_name:process.env.CLOUD_NAME,
});
export const uploadImage=async(image:string)=>{
    try{
        const result=await cloudinary.uploader.upload(image);
        return result.secure_url;
    }
    catch(error){
        console.log(error);
        return null;
    }
}
