
import image from "@/assets/restaurant.jpg"
import { Badge } from "./badge"
import { Timer } from "lucide-react"
import AvailableMenu from "./AvailableMenu"
const RestaurantDetails = () => {
    return (
        <div className="max-w-6xl mx-auto my-10">
            <div className="w-full">
                <div className="relative w-full h-32 md:h-64 lg:h-72">
                    <img src={image} alt="restaurant" className="w-full h-full object-cover rounded-lg shadow-lg" />
                </div>
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="my-5">
                        <h1 className="font-medium text-xl">Tandoori Tadka</h1>
                        <div className="flex gap-2 my-2">
                            {
                                ["Biryani", "Thali", "Pizza", "Burger", "Dessert"].map((item: string, idx: number) => (
                                    <Badge key={idx}>{item}</Badge>
                                ))

                            }

                        </div>
                        <div className=" flex md:flex-row flex-col gap-2 my-2">
                            <div className="flex items-center gap-2">
                                <Timer className="w-5 h-5" />
                                <h1 className="flex items-center font-medium  gap-2">Delivery Time:{" "}
                                    <span className="text-[#D19254]">35 mins</span>
                                </h1>

                            </div>


                        </div>

                    </div>

                </div>
                <AvailableMenu/>
                


            </div>


        </div>
    )
}

export default RestaurantDetails