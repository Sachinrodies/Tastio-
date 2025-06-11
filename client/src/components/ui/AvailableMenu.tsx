import { Button } from "./button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card"
import image from "@/assets/restaurant.jpg"
import { Skeleton } from "./skeleton"
import { useCartStore } from "@/store/useCartStore";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

const MenuSkeleton = () => {
  return (
    <Card className="max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden">
      <Skeleton className="w-full h-40" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-6 w-1/3 mt-4" />
      </CardContent>
      <CardFooter className="p-4">
        <Skeleton className="w-full h-10" />
      </CardFooter>
    </Card>
  )
}

const AvailableMenu = ({ menus, restaurantId }: { menus: MenuItem[], restaurantId: string }) => {
  const isLoading = false;
  const {addToCart}=useCartStore()
  const navigate=useNavigate()
  
  return (
    <div className="md:p-4">
        <h1 className="text-xl md:text-2xl font-extrabold mb-6">Available Menus</h1>
        <div className="grid md:grid-cols-3 space-y-4 md:space-y-0">
          {isLoading ? (
            <>
              <MenuSkeleton />
              <MenuSkeleton />
              <MenuSkeleton />
            </>
          ) : (
            menus.map((menu) => (
              <Card key={menu._id} className="max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden">
                <img src={menu.imageUrl || image} alt={menu.name} className="w-full h-40 object-cover"/>
                <CardContent className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{menu.name}</h2>
                    <p className="text-sm text-gray-600 mt-2">
                        {menu.description}
                    </p>
                    <h3 className="text-lg font-semibold mt-4">
                        Price:<span className="text-[#D19254] ">₹{menu.price}</span>
                    </h3>
                </CardContent>
                <CardFooter className="p-4">
                    <Button onClick={()=>{
                      const cartItem = {...menu, quantity: 1, image: menu.imageUrl || image, restaurantId};
                      addToCart(cartItem);
                      navigate("/cart")
                    }} className="w-full bg-[#D19254] text-white hover:bg-[#D19254]/80">Add to Cart</Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
    </div>
  )
}

export default AvailableMenu