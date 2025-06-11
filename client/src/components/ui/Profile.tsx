import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Globe, Locate, Mail, MapPin, Phone, Plus } from "lucide-react"
import { useRef, useState, type FormEvent, useEffect } from "react"
import { Input } from "./input"
import { Label } from "./label"
import { Button } from "./button"
import { Loader2 } from "lucide-react"
import { useUserStore } from "@/store/useUseStore"
import { toast } from "sonner"

const Profile = () => {
    const {user, updateUserProfile, loading} = useUserStore()
    const [formData, setFormData] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        contact: user?.contact || "",
        address: user?.address || "",
        city: user?.city || "",
        country: user?.country || "",
        profilePicture: user?.profilePicture || "",
    })
    const imageRef = useRef<HTMLInputElement | null>(null);
    const [profileImage, setProfileImage] = useState<string>(user?.profilePicture || "");

    // Update form data when user data changes
    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.fullname || "",
                email: user.email || "",
                contact: user.contact || "",
                address: user.address || "",
                city: user.city || "",
                country: user.country || "",
                profilePicture: user.profilePicture || "",
            });
            setProfileImage(user.profilePicture || "");
        }
    }, [user]);
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            
            // Validate file size (max 1MB)
            if (file.size > 1 * 1024 * 1024) {
                toast.error('Image size should be less than 1MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                // Ensure the base64 string is properly formatted
                if (!result.startsWith('data:image')) {
                    toast.error('Invalid image format');
                    return;
                }
                setProfileImage(result);
                setFormData(prev => ({ ...prev, profilePicture: result }));
            }
            reader.onerror = () => {
                toast.error('Error reading image file');
            }
            reader.readAsDataURL(file);
        }
    }

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldName = name === 'phone' ? 'contact' : name;
        setFormData(prev => ({ ...prev, [fieldName]: value }))
    }

    const handleProfileUpdate = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await updateUserProfile(formData);
        } catch (error) {
        }
    }

    return (
        <form onSubmit={handleProfileUpdate} className="max-w-7xl mx-auto my-5">
            <div className="flex items-center justify between">
                <div className="flex items-center gap-2">
                    <Avatar className="relative w-20 h-20 md:w-25 md:h-25 rounded-full overflow-hidden">
                        <AvatarImage 
                            src={profileImage} 
                            alt={formData.fullname} 
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                                setProfileImage(user?.profilePicture || "");
                            }}
                        />
                        <AvatarFallback>{formData.fullname?.charAt(0) || 'U'}</AvatarFallback>
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
                        <input name="phone" value={formData.contact} onChange={changeHandler} className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"></input>
                    </div>
                </div>

                <div className="text-center mt-5 md:col-span-2">
                    {loading ? (
                        <Button disabled className="bg-[#D19254] hover:bg-[#d18c47]">
                            <Loader2 className="w-4 mr-2 h-4 text-gray-500 animate-spin" />
                            Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="bg-[#D19254] hover:bg-[#d18c47]">
                            Update
                        </Button>
                    )}
                </div>
            </div>
        </form>
    )
}

export default Profile