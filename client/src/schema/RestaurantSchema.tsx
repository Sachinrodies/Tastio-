import { z } from "zod";

export const RestaurantSchema = z.object({
    restaurantName:z.string().min(1,{message:"Restaurant name is required"}),
    city:z.string().min(1,{message:"City is required"}),
    country:z.string().min(1,{message:"Country is required"}),
    deliveryTime:z.number().min(0,{message:"Delivery time must be greater than 0"}),
    cuisine:z.array(z.string()).min(1,{message:"Cuisine is required"}),
    image: z.instanceof(File).refine(
        (file) => file && file.size <= 1024 * 1024 * 5,
        { message: "Image file is required and must be less than 5MB" }
    )
})

export type RestaurantSchemaType = z.infer<typeof RestaurantSchema>;