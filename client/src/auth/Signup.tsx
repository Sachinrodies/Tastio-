import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {  Loader2, LockKeyhole, Mail, Phone, User } from "lucide-react"
import { useState } from "react";

import { userSignupSchema, type UserSignupSchemaType } from "@/schema/userSchema";

const Signup = () => {
    const Loading=false;
    const [input,setInput]=useState<UserSignupSchemaType>({
        fullname:'',
        email:'',
        password:'',
        contact:""
    })
    const [errors,setErrors]=useState<Partial<UserSignupSchemaType>>({})
    const changeEventHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target;
        setInput({...input,[name]:value})
    }
    const loginSubmitHandler=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const result=userSignupSchema.safeParse(input);
        if(!result.success){
            const fieldErrors=result.error.flatten().fieldErrors;
            setErrors(fieldErrors as Partial<UserSignupSchemaType>);
            return ;
        }
        console.log(input);

    }

  return (
    <div className="flex items-center justify-center min-h-screen ">

        <form  onSubmit={loginSubmitHandler} className="md:p-8 w-full  rounded-lg md:border md:border-gray-200 mx-4">
            <div className="mb-4">
                <h1 className="font-bold text-2xl">Tastio</h1>
            </div>
            <div className="mb-4">
                <div className="relative">
                <Input type="text" name="fullname" value={input.fullname} onChange={changeEventHandler}placeholder="Full Name" className="pl-10 focus-visible:ring-1  "/>
                <User className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                {
                    errors && <span className=" text-sm text-red-500">{errors.fullname}</span>
                }

                </div>

            </div>

            <div className="mb-4">
                <div className="relative">
                <Input type="email" name="email" value={input.email} onChange={changeEventHandler}placeholder="Email" className="pl-10 focus-visible:ring-1  "/>
                <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                {
                    errors && <span className=" text-sm text-red-500">{errors.email}</span>
                }
                </div>

            </div>
            <div className="mb-4">
                <div className="relative">
                    <Input type="password"  name="password" value={input.password} onChange={changeEventHandler} placeholder="Password" className="pl-10 focus-visible:ring-1 "/>
                    <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                    {
                        errors && <span className=" text-sm text-red-500">{errors.password}</span>
                    }
                </div>
                
            </div>
            <div className="mb-4">
                <div className="relative">
                    <Input type="text" name="contact" value={input.contact} onChange={changeEventHandler}placeholder="Contact" className="pl-10 focus-visible:ring-1  "/>
                    <Phone className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                    {
                        errors && <span className=" text-sm text-red-500">{errors.contact}</span>
                    }
                </div>
            </div>


            <div className="mb-10">
                {
                Loading? <Button disabled={true} type="submit" className="bg-[#D19254] hover:bg-[#d18c47] w-full"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</Button>
                :<Button type="submit" className="bg-[#D19254] hover:bg-[#d18c47] w-full">Signup</Button>
                }
                
            </div>
            <Separator/>
            <p className="mt-2">
                Already have an account?{" "} 
                <Link to="/login" className="text-blue-500">Login</Link>
                

            </p>
            
            
          
         
          

        </form>
    </div>
  )
}

export default Signup