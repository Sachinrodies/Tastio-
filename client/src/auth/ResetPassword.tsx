import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, LockKeyhole, Mail } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

const ResetPassword = () => {
    const [password,setPassword]=useState<string>("")
    const loading:boolean=false;
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
        <form className="flex flex-col gap-5 md:p-8 w-full  max-w-md  mx-4">
            <div className="text-center">
                <h1 className="font-extrabold text-2xl mb-2">Reset Password</h1>
                <p className="text-sm text-gray-600">Enter your new password</p>

            </div>
            <div className="relative  w-full">
                <Input type="password" onChange={(e)=>setPassword(e.target.value)} 
                placeholder="Password" className="pl-10  "/>
                <LockKeyhole className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
            </div>
            {
                loading ? <Button disabled={true} type="submit" className="bg-[#D19254] hover:bg-[#d18c47] w-full"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</Button>
                : <Button type="submit" className="bg-[#D19254] hover:bg-[#d18c47] w-full">Reset Password</Button>
            }
            <span>
                Back to{" "}
                <Link to="/login" className="text-blue-500"> Login</Link>
            </span>

        </form>

    </div>
  )
}

export default ResetPassword