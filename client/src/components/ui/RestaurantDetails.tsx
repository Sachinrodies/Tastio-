// import image from "@/assets/restaurant.jpg"
import { Badge } from "./badge"
import { Timer } from "lucide-react"
import AvailableMenu from "./AvailableMenu"
import { useRestaurantStore } from "@/store/useRestaurantStore"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { useUserStore } from "@/store/useUseStore"
// import { toast } from "sonner"

const RestaurantDetails = () => {
    const {singleRestaurant, getSingleRestaurant, loading}=useRestaurantStore()
    const {id}=useParams()
    const {isAuthenticated, isCheckingAuth}=useUserStore()

    useEffect(()=>{
        if(id && isAuthenticated && !isCheckingAuth){
            getSingleRestaurant(id!)
        }
    },[id, isAuthenticated, isCheckingAuth])

    if(isCheckingAuth){
        return <div>Loading...</div>
    }

    if(!isAuthenticated){
        return <div>Please login to view restaurant details</div>
    }

    if(loading){
        return <div>Loading restaurant details...</div>
    }

    if(!singleRestaurant){
        return <div>Restaurant not found</div>
    }

    return (
        <div className="max-w-6xl mx-auto my-10">
            <div className="w-full">
                <div className="relative w-full h-32 md:h-64 lg:h-72">
                    <img src={singleRestaurant.imageUrl} alt="restaurant" className="w-full h-full object-cover rounded-lg shadow-lg" />
                </div>
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="my-5">
                        <h1 className="font-medium text-xl">{singleRestaurant.restaurantName}</h1>
                        <div className="flex gap-2 my-2">
                            {
                                singleRestaurant.cuisines.map((item: string, idx: number) => (
                                    <Badge key={idx}>{item}</Badge>
                                ))
                            }
                        </div>
                        <div className="flex md:flex-row flex-col gap-2 my-2">
                            <div className="flex items-center gap-2">
                                <Timer className="w-5 h-5" />
                                <h1 className="flex items-center font-medium gap-2">Delivery Time:{" "}
                                    <span className="text-[#D19254]">{singleRestaurant.deliveryTime} mins</span>
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <AvailableMenu menus={singleRestaurant.menus} restaurantId={singleRestaurant._id} />
            </div>
        </div>
    )
}

export default RestaurantDetails