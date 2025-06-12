import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { RestaurantSchema, type RestaurantSchemaType } from '@/schema/RestaurantSchema'
import { useRestaurantStore } from '@/store/useRestaurantStore'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'




const Restaurants = () => {
    const {loading, restaurant, createRestaurant, updateRestaurant, getRestaurants, clearRestaurantState} = useRestaurantStore();
    const [errors, setErrors] = useState<Partial<RestaurantSchemaType>>({});
    const [formData, setFormData] = useState<{
        restaurantName: string;
        city: string;
        country: string;
        deliveryTime: number;
        cuisine: string[];
        image: File | undefined;
    }>({
        restaurantName: '',
        city: '',
        country: '',
        deliveryTime: 0,
        cuisine: [],
        image: undefined
    });

    // Clear state and fetch restaurant data on component mount
    useEffect(() => {
        const initializeData = async () => {
            clearRestaurantState(); // Clear any existing state
            await getRestaurants(); // Fetch fresh data
        };
        initializeData();
    }, []);

    // Update form data when restaurant data changes
    useEffect(() => {
        if (restaurant) {
            setFormData({
                restaurantName: restaurant.restaurantName || '',
                city: restaurant.city || '',
                country: restaurant.country || '',
                deliveryTime: restaurant.deliveryTime || 0,
                cuisine: restaurant.cuisines || [],
                image: undefined
            });
        } else {
            // Reset form when no restaurant exists
            setFormData({
                restaurantName: '',
                city: '',
                country: '',
                deliveryTime: 0,
                cuisine: [],
                image: undefined
            });
        }
    }, [restaurant]);

    const changeHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value,type}=e.target;
        setFormData({...formData,[name]:type==="number"? Number(value):type==="file"? (e.target as HTMLInputElement).files?.[0]:value})
    }
    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(loading) return; // Prevent multiple submissions
        
        const result=RestaurantSchema.safeParse(formData);
        if(!result.success){
            const fieldErrors=result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<RestaurantSchemaType>);
            return;
        }
        
        const formDataToSend=new FormData();
        formDataToSend.append('restaurantName',result.data.restaurantName);
        formDataToSend.append('city',result.data.city);
        formDataToSend.append('country',result.data.country);
        formDataToSend.append('deliveryTime',result.data.deliveryTime.toString());
        formDataToSend.append('cuisine',JSON.stringify(result.data.cuisine));
        
        // Only append image if it's a new file
        if (result.data.image instanceof File) {
            formDataToSend.append('image', result.data.image);
        }
        
        if(restaurant){
            await updateRestaurant(formDataToSend);
        }else{
            await createRestaurant(formDataToSend);
        }
    };
    
   
    return (
        <div className="max-w-6xl mx-auto my-10 px-4">
            <div className="mb-8">
                <h1 className='font-extrabold text-3xl text-gray-800'>
                    {restaurant ? 'Update Restaurant' : 'Add Restaurant'}
                </h1>
                <p className="text-gray-600 mt-2">
                    {restaurant ? 'Update your restaurant details' : 'Fill in the details to add your restaurant to our platform'}
                </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Restaurant Name */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-100">Restaurant Name</Label>
                            <Input 
                                value={formData.restaurantName} 
                                onChange={changeHandler} 
                                type="text" 
                                name="restaurantName" 
                                placeholder='Enter restaurant name'
                                className="h-11 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700" 
                            />
                            {errors.restaurantName && 
                                <span className="text-xs text-red-600 font-medium dark:text-red-400">{errors.restaurantName}</span>
                            }
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-100">City</Label>
                            <Input 
                                value={formData.city} 
                                onChange={changeHandler} 
                                type="text" 
                                name="city" 
                                placeholder='Enter city'
                                className="h-11 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700" 
                            />
                            {errors.city && 
                                <span className="text-xs text-red-600 font-medium dark:text-red-400">{errors.city}</span>
                            }
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-100">Country</Label>
                            <Input 
                                value={formData.country} 
                                onChange={changeHandler} 
                                type="text" 
                                name="country" 
                                placeholder='Enter country'
                                className="h-11 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700" 
                            />
                            {errors.country && 
                                <span className="text-xs text-red-600 font-medium dark:text-red-400">{errors.country}</span>
                            }
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-100">Delivery Time (minutes)</Label>
                            <Input 
                                value={formData.deliveryTime} 
                                onChange={changeHandler} 
                                type="number" 
                                name="deliveryTime" 
                                placeholder='Enter delivery time'
                                className="h-11 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700" 
                            />
                            {errors.deliveryTime && 
                                <span className="text-xs text-red-600 font-medium dark:text-red-400">{errors.deliveryTime}</span>
                            }
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-100">Cuisine</Label>
                            <Input 
                                value={formData.cuisine} 
                                onChange={(e)=>setFormData({...formData,cuisine:e.target.value.split(",")})} 
                                type="text" 
                                name="cuisine" 
                                placeholder='e.g Momos, Pizza, Burger'
                                className="h-11 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700" 
                            />
                            {errors.cuisine && 
                                <span className="text-xs text-red-600 dark:text-red-400">{errors.cuisine}</span>
                            }
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-100">Restaurant Image</Label>
                            <Input
                                onChange={e => setFormData({ ...formData, image: (e.target as HTMLInputElement).files?.[0] })}
                                type="file"
                                name="image"
                                className="h-11 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
                                accept="image/*"
                            />
                            {errors.image && 
                                <span className="text-xs text-red-600 dark:text-red-400">{errors.image?.name || "Image file is required"}</span>
                            }
                        </div>
                    </div>

                    <div className="flex justify-end mt-8">
                        {loading ? (
                            <Button disabled className='bg-[#D19254] text-white hover:bg-[#D19254]/80 px-8 h-11'>
                                <Loader2 className='w-4 h-4 animate-spin mr-2' />
                                Please wait...
                            </Button>
                        ) : (
                            <Button type="submit" className='bg-[#D19254] text-white hover:bg-[#D19254]/80 px-8 h-11'>
                                {restaurant ? 'Update Restaurant' : 'Add Restaurant'}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Restaurants