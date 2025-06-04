import { Button } from "./button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card"
import image from "@/assets/restaurant.jpg"
import { Skeleton } from "./skeleton"

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

const AvailableMenu = () => {
  // This would typically come from your data fetching logic
  const isLoading = false;

  return (
    <div className="md:p-4">
        <h1 className="text-xl md:text-2xl font-extrabold mb-6">Available Menus</h1>
        <div className="grid md:grid-cols-3 space-y-4 md:space-y-0">
          {isLoading ? (
            // Show 3 skeleton cards while loading
            <>
              <MenuSkeleton />
              <MenuSkeleton />
              <MenuSkeleton />
            </>
          ) : (
            <Card className="max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden">
              <img src={image} alt="menu" className="w-full h-40 object-cover"/>
              <CardContent className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Tandoori Biryani</h2>
                  <p className="text-sm text-gray-600 mt-2">
                      A delicious and flavorful biryani made with tender chicken and aromatic spices.
                  </p>
                  <h3 className="text-lg font-semibold mt-4">
                      Price:<span className="text-[#D19254] ">₹80</span>
                  </h3>
              </CardContent>
              <CardFooter className="p-4">
                  <Button className="w-full bg-[#D19254] text-white hover:bg-[#D19254]/80">Add to Cart</Button>
              </CardFooter>
            </Card>
          )}
        </div>
    </div>
  )
}

export default AvailableMenu