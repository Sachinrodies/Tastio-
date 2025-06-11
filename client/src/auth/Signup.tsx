import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import {  Loader2, LockKeyhole, Mail, Phone, User } from "lucide-react"
import { useState } from "react";

import { userSignupSchema, type UserSignupSchemaType } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUseStore";

const Signup = () => {
  
    const [input,setInput]=useState<UserSignupSchemaType>({
        fullname:'',
        email:'',
        password:'',
        contact:""
    })
    const [errors,setErrors]=useState<Partial<UserSignupSchemaType>>({})
    const {signup,loading}=useUserStore();
    const navigate=useNavigate();
    const changeEventHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target;
        setInput({...input,[name]:value})
    }
    const loginSubmitHandler=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const result=userSignupSchema.safeParse(input);
        if(!result.success){
            const fieldErrors=result.error.flatten().fieldErrors;
            setErrors(fieldErrors as Partial<UserSignupSchemaType>);
            return ;
        }
        try{
            await signup(input);
            navigate("/verify-email");
        }catch(error){
            // Remove all console.log statements
        }

    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <form onSubmit={loginSubmitHandler} className="md:p-8 p-4 w-full max-w-md rounded-lg bg-white shadow-lg mx-4">
            <div className="mb-6 text-center">
                <h1 className="font-bold text-3xl text-[#D19254]">Tastio</h1>
                <p className="text-gray-600 mt-2">Create your account</p>
            </div>
            <div className="space-y-4">
                <div className="relative">
                    <Input type="text" name="fullname" value={input.fullname} onChange={changeEventHandler} placeholder="Full Name" className="pl-10 focus-visible:ring-1 h-11" />
                    <User className="absolute inset-y-3 left-3 text-gray-500 pointer-events-none" />
                    {errors.fullname && <span className="text-sm text-red-500 mt-1 block">{errors.fullname}</span>}
                </div>

                <div className="relative">
                    <Input type="email" name="email" value={input.email} onChange={changeEventHandler} placeholder="Email" className="pl-10 focus-visible:ring-1 h-11" />
                    <Mail className="absolute inset-y-3 left-3 text-gray-500 pointer-events-none" />
                    {errors.email && <span className="text-sm text-red-500 mt-1 block">{errors.email}</span>}
                </div>

                <div className="relative">
                    <Input type="password" name="password" value={input.password} onChange={changeEventHandler} placeholder="Password" className="pl-10 focus-visible:ring-1 h-11" />
                    <LockKeyhole className="absolute inset-y-3 left-3 text-gray-500 pointer-events-none" />
                    {errors.password && <span className="text-sm text-red-500 mt-1 block">{errors.password}</span>}
                </div>

                <div className="relative">
                    <Input type="text" name="contact" value={input.contact} onChange={changeEventHandler} placeholder="Contact" className="pl-10 focus-visible:ring-1 h-11" />
                    <Phone className="absolute inset-y-3 left-3 text-gray-500 pointer-events-none" />
                    {errors.contact && <span className="text-sm text-red-500 mt-1 block">{errors.contact}</span>}
                </div>
            </div>

            <div className="mt-6">
                {loading ? (
                    <Button disabled={true} type="submit" className="bg-[#D19254] hover:bg-[#d18c47] w-full h-11">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait
                    </Button>
                ) : (
                    <Button type="submit" className="bg-[#D19254] hover:bg-[#d18c47] w-full h-11">Signup</Button>
                )}
            </div>

            <Separator className="my-6" />
            
            <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-[#D19254] hover:text-[#d18c47] font-medium">Login</Link>
            </p>
        </form>
    </div>
  )
}

export default Signup