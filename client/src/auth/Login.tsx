import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Loader2, LockKeyhole, Mail } from "lucide-react"
import { useState } from "react";
import { userLoginSchema, type UserLoginSchemaType } from "@/schema/userSchema";


const Login = () => {
    const Loading = false;
    const [input, setInput] = useState<UserLoginSchemaType>({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState<Partial<UserLoginSchemaType>>({})
    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value })
    }
    const loginSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = userLoginSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors as Partial<UserLoginSchemaType>);
            return;

        }
        console.log(input);



    }

    return (
        <div className="flex items-center justify-center min-h-screen ">

            <form onSubmit={loginSubmitHandler} className="md:p-8 w-full  rounded-lg md:border md:border-gray-200 mx-4">
                <div className="mb-4">
                    <h1 className="font-bold text-2xl">Tastio</h1>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input type="email" name="email" value={input.email} onChange={changeEventHandler} placeholder="Email" className="pl-10 focus-visible:ring-1  " />
                        <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {
                            errors && <span className=" text-sm text-red-500">{errors.email}</span>
                        }
                    </div>

                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input type="password" name="password" value={input.password} onChange={changeEventHandler} placeholder="Password" className="pl-10 focus-visible:ring-1 " />
                        <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {
                            errors && <span className=" text-sm text-red-500">{errors.password}</span>
                        }
                    </div>

                </div>
                <div className="mb-10">
                    {
                        Loading ? <Button disabled={true} type="submit" className="bg-[#D19254] hover:bg-[#d18c47] w-full"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</Button>
                            : <Button type="submit" className="bg-[#D19254] hover:bg-[#d18c47] w-full">Login</Button>
                    }
                    <div className="mt-4 text-center">
                        <Link to="/forget-password" className="hover:underline hover:text-blue-500">Forget Password?</Link>
                    </div>

                </div>

                <Separator />
                <p className="mt-2">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500">Sign up</Link>


                </p>






            </form>
        </div>
    )
}

export default Login