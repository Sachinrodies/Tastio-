import image from "@/assets/hero_pizza.png"
import { ArrowLeft, IndianRupee } from "lucide-react";
import { Separator } from "./separator";
import { Button } from "./button";
import { Link } from "react-router-dom";

const OrderStatus = () => {
    const orders = [1, 2, 3];
    if (orders.length === 0)
        return (<div className="flex items-center justify-center min-h-screen">
            <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-bold">No orders found</h1>
        </div>
        );


    return (
        <div className="flex items-center px-4 justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Order Status
                        :{" "}
                        <span className="text-[#FF5A5A]">{"confirm".toUpperCase()}</span>
                    </h1>

                </div>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 text-left">
                        Order Summary
                    </h2>
                    {/* Your order items displayed here */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <img src={image} alt="pizza" className="w-14 h-14 rounded-md object-cover" />
                                <h3 className="ml-4 text-gray-800 dark:text-gray-200 font-medium">Pizza</h3>


                            </div>
                            <div className="text-right">
                                <div className="text-gray-800 dark:text-gray-200 flex items-center">
                                    <IndianRupee  />
                                    <span className="text-lg font-medium">299</span>

                                </div>

                            </div>


                        </div>
                        <Separator className="my-4" />

                    </div>


                </div>
                <Link to="/cart" className="w-full">
                    <Button className="w-full py-3 rounded-md shadow-lg bg-[#D19254] hover:bg-[#D19254]">
                        Continue Shopping
                    </Button>
                </Link>

                
            </div>
        </div>


    )
}

export default OrderStatus