import {z} from "zod"

export const userSignupSchema=z.object({
    fullname:z.string().min(1,"Fullname is required"),
    email:z.string().email("Invalid email address"),
    password:z.string().min(8,"Password must be at least 8 characters long"),
    contact:z.string().min(10,"Contact must be at least 10 characters long"),

})
export type UserSignupSchemaType=z.infer<typeof userSignupSchema>

export const userLoginSchema=z.object({
    
    email:z.string().email("Invalid email address"),
    password:z.string().min(8,"Password must be at least 8 characters long"),
    

})
export type UserLoginSchemaType=z.infer<typeof userLoginSchema>

