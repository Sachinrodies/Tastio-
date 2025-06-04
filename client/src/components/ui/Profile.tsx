import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Globe, Locate, Mail, MapPin, Phone, Plus } from "lucide-react"
import { useRef, useState, type FormEvent } from "react"
import { Input } from "./input"
import { Label } from "./label"
import { Button } from "./button"
import { Loader2 } from "lucide-react"


const Profile = () => {
    const loading = false;
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        profileImage: "",
    })
    const imageRef = useRef<HTMLInputElement | null>(null);
    const [profileImage, setProfileImage] = useState<string>("");
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setProfileImage(result);
                setFormData((prev) => ({ ...prev, profileImage: result }))
            }
            reader.readAsDataURL(file);

        }

    }
    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })


    }
    const updateProfileHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // update profile api implementation
    }
    return (
        <form className="max-w-7xl mx-auto my-5">
            <div className="flex items-center justify between">
                <div className="flex items-center gap-2">
                    <Avatar className="relative w-20 h-20 md:w-25 md:h-25 rounded-full overflow-hidden">
                        <AvatarImage src={profileImage} className="w-full h-full object-cover rounded-full" />
                        <AvatarFallback>CN</AvatarFallback>
                        <input
                            ref={imageRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <div
                            onClick={() => imageRef.current?.click()}
                            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full cursor-pointer"
                        >
                            <Plus className="w-8 h-8 text-white" />
                        </div>
                    </Avatar>
                    <div>
                        <Input
                            onChange={changeHandler}
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            className="font-bold md:text-3xl text-2xl outline-none border-none focus-visible:ring-transparent"
                        />
                    </div>


                </div>

            </div>
            <div className="grid md:grid-cols-4 md:gap-2 gap-3 my-10">
                <div className="flex items-center gap-4 bg-gray-200 rounded-sm p-2">
                    <Mail className="w-6 h-6 text-gray-500" />
                    <div className="w-full">
                        <Label>Email</Label>
                        <input name="email" value={formData.email} onChange={changeHandler} className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"></input>

                    </div>

                </div>
                <div className="flex items-center gap-4 bg-gray-200 rounded-sm p-2">
                    <Locate className="w-6 h-6 text-gray-500" />
                    <div className="w-full">
                        <Label>Address</Label>
                        <input name="address" value={formData.address} onChange={changeHandler} className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"></input>

                    </div>

                </div>
                <div className="flex items-center gap-4 bg-gray-200 rounded-sm p-2">
                    <MapPin className="w-6 h-6 text-gray-500" />
                    <div className="w-full">
                        <Label>City</Label>
                        <input name="city" value={formData.city} onChange={changeHandler} className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"></input>

                    </div>

                </div>
                <div className="flex items-center gap-4 bg-gray-200 rounded-sm p-2">
                    <Globe className="w-6 h-6 text-gray-500" />
                    <div className="w-full">
                        <Label>Country</Label>
                        <input name="country" value={formData.country} onChange={changeHandler} className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"></input>

                    </div>

                </div>
                <div className="flex items-center gap-4 bg-gray-200 rounded-sm p-2">
                    <Phone className="w-6 h-6 text-gray-500" />
                    <div className="w-full">
                        <Label>Phone</Label>
                        <input name="phone" value={formData.phone} onChange={changeHandler} className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"></input>

                    </div>

                </div>

                <div className="text-center 
                mt-5 md:col-span-2">
                    {
                        loading ? <Button disabled className="bg-[#D19254] hover:bg-[#d18c47]"> <Loader2 className="w-4 mr-2 h-4 text-gray-500 animate-spin" />Please wait </Button>
                            : <Button className="bg-[#D19254] hover:bg-[#d18c47] ">Update</Button>
                    }

                </div>

            </div>

        </form>
    )
}

export default Profile