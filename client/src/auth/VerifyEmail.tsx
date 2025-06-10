import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useUserStore } from "@/store/useUseStore"
import { toast } from "sonner"

const VerifyEmail = () => {
    const [otp,setOtp]=useState<string[]>(["","","","","",""])
    const inputRef=useRef<any>([]);
    const navigate=useNavigate();
    
    const handleOtpChange=(index:number,value:string)=>{
        if(/^[a-zA-Z0-9]$/.test(value)||value===""){
            const newOtp=[...otp];
            newOtp[index]=value;
            setOtp(newOtp);
            
            if(value.length>0 && index<otp.length-1){
                inputRef.current[index+1].focus();
            }
        }
    }
    const handleKeyDown=(index:number,e:React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.key==="Backspace" && !otp[index] && index>0){
            inputRef.current[index-1].focus();
        }
    }
    const {verfyEmail,loading}=useUserStore();
    const submitHandler=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const verificationCode=otp.join("");
        try{
            await verfyEmail(verificationCode);
            navigate("/");
        }catch(error:any){
            toast.error(error.response?.data?.message || 'Verification failed');
        }
    }

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
        <div className="p-8 rounded-md  w-full  max-w-md  flex flex-col gap-10 border border-gray-200">
            <div className="text-center">
                <h1 className="font-extrabold text-2xl mb-2">Verify Email</h1>
                <p className="text-sm text-gray-600">Enter the code sent to your email</p>
            </div>
            <form onSubmit={submitHandler}>
                <div className="flex justify-between">
                    
                    {
                        otp.map((letter:string ,index:number)=>(
                            <Input key={index} ref={(e: HTMLInputElement | null) => { inputRef.current[index] = e }} type="text" onKeyDown={(e:React.KeyboardEvent<HTMLInputElement>)=>handleKeyDown(index,e)} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>handleOtpChange(index,e.target.value)} value={letter}  className="md:w-12 md:h-12 w-8 h-8  text-center text-sm md:text-2xl font-normal md:font-bold rounded-lg focus-outline-none focus:ring-2 focus:ring-indigo-500" />
                        ))
                    }
                </div>
                {
                    loading ? <Button disabled={true} type="submit" className=" mt-6 bg-[#D19254] hover:bg-[#d18c47] w-full"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</Button>
                    : <Button type="submit" className=" mt-6 bg-[#D19254] hover:bg-[#d18c47] w-full">Verify</Button>
                }

            </form>
            
        </div>

    </div>
  )
}

export default VerifyEmail