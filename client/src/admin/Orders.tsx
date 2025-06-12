import { useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRestaurantStore } from '@/store/useRestaurantStore'

// Define the correct type for a restaurant order
interface RestaurantOrder {
    _id: string;
    deliveryDetails: {
        address: string;
        city: string;
    };
    totalAmount: number;
    status: string;
    // Add other fields as needed
}

const Orders = () => {
    const {restaurantOrders, loading, getRestaurantOrders, updateRestaurantOrders, restaurant} = useRestaurantStore()
    
    useEffect(() => {
        if (restaurant?._id) {
            getRestaurantOrders(restaurant._id)
        }
    }, [getRestaurantOrders, restaurant?._id])

    if (loading) {
        return <div className="max-w-6xl mx-auto py-10 px-6">Loading...</div>
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-10">Orders</h1>
            <div className="space-y-8">
                {(restaurantOrders as unknown as RestaurantOrder[]).map((order) => (
                    <div key={order._id} className="flex flex-col md:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 border-gray-200 dark:border-gray-700">
                        <div className="flex-1 mb-6 sm:mb-0">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Order #{order._id}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                <span className="font-semibold">Address: </span>
                                {order.deliveryDetails.address}, {order.deliveryDetails.city}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                <span className="font-semibold">Amount: </span>
                                {(order.totalAmount / 100).toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                            </p>
                        </div>
                        <div className="w-full sm:w-1/3">
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Status</Label>
                            <Select defaultValue={order.status} onValueChange={(value) => updateRestaurantOrders(order._id, { status: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Order Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["Pending", "Confirmed", "Preparing", "OutForDelivery", "Delivered"].map((status) => (
                                        <SelectItem key={status} value={status.toLowerCase()}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders