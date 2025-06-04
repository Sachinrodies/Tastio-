import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RestaurantSchema, type RestaurantSchemaType } from '@/schema/RestaurantSchema'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'




const Restaurants = () => {
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
    const changeHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value,type}=e.target;
        setFormData({...formData,[name]:type==="number"? Number(value):type==="file"? (e.target as HTMLInputElement).files?.[0]:value})
    }
    const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const result=RestaurantSchema.safeParse(formData);
        if(!result.success){
            const fieldErrors=result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<RestaurantSchemaType>);
            return ;
        }
        // add restaurant api implementation start from here
        else{
            console.log(result.data);
        }
    }
    const loading = false;
    const restaurantExist = false;
    return (
        <div className="max-w-6xl mx-auto my-10">
            <div>
                <div className="flex flex-col md:flex-row md:items-start md:space-x-10">
                    <h1 className='font-extrabold text-2xl mb-5 md:mb-0 md:mt-2 md:min-w-[200px] text-left'>Add restaurant</h1>
                    <form onSubmit={handleSubmit} className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            {/* Restaurant Name */}
                            <div className="flex flex-col gap-2">
                                <Label>Restaurant Name</Label>

                                <Input value={formData.restaurantName} onChange={changeHandler} type="text" name="restaurantName" placeholder='Enter restaurant name' />
                                {
                                    errors.restaurantName && <span className="text-xs text-red-600 font-medium"> {errors.restaurantName}</span>
                                }
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>City</Label>
                                <Input value={formData.city} onChange={changeHandler} type="text" name="city" placeholder='Enter city' />
                                {
                                    errors.city && <span className="text-xs text-red-600 font-medium"> {errors.city}</span>
                                }
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Country</Label>
                                <Input value={formData.country} onChange={changeHandler} type="text" name="country" placeholder='Enter country' />
                                {
                                    errors.country && <span className="text-xs text-red-600 font-medium"> {errors.country}</span>
                                }
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Delivery Time</Label>
                                <Input value={formData.deliveryTime} onChange={changeHandler} type="number" name="deliveryTime" placeholder='Enter delivery time' />
                                {
                                    errors.deliveryTime && <span className="text-xs text-red-600 font-medium"> {errors.deliveryTime}</span>
                                }
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Cuisine</Label>
                                <Input value={formData.cuisine} onChange={(e)=>setFormData({...formData,cuisine:e.target.value.split(",")})} type="text" name="cuisine" placeholder='e.g Momos,Pizza,Burger' />
                                {
                                    errors.cuisine && <span className="text-xs text-red-600">{errors.cuisine}</span>
                                }
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Upload Restaurant Image</Label>
                                <Input
                                    onChange={e => setFormData({ ...formData, image: (e.target as HTMLInputElement).files?.[0] })}
                                    type="file"
                                    name="image"
                                    placeholder="Upload Restaurant Image"
                                />
                                  {
                                        errors.image && <span className="text-xs text-red-600">{errors.image?.name||"Image file  is required"}</span>
                                }
                            </div>
                        </div>
                        <div className=" my-5 w-fit">
                            {
                                loading ? <Button disabled className='bg-[#D19254] text-white hover:bg-[#D19254]/80'>
                                    <Loader2 className='w-4 h-4 animate-spin' />Please wait...
                                </Button> : <Button className='bg-[#D19254] text-white hover:bg-[#D19254]/80'>
                                    {
                                        restaurantExist?'Update Your':"Add Your Restaurant"
                                    }</Button>
                            }
                        </div>
                    </form>
                </div>
            </div>


        </div>
    )
}

export default Restaurants