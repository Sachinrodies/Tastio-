import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";

interface RestaurantStore {
    loading: boolean;
    searchedRestaurant: any;
    restaurantResult: any;
    restaurant: any;
    createRestaurant: (formData: FormData) => Promise<void>;
    getRestaurants: () => Promise<void>;
    updateRestaurant: (formData: FormData) => Promise<void>;
    searchRestaurant: (searchText: string, searchQuery: string, selectedCuisines: any) => Promise<void>;
    clearRestaurantState: () => void;
    addMenuTorestaurant: (menu: any) => Promise<void>;
    removeMenuFromRestaurant: (menuId: string) => Promise<void>;
}

const API_END_POINT="http://localhost:8001/api/v1/restaurant"
axios.defaults.withCredentials=true;

export const useRestaurantStore = create<RestaurantStore>()(persist((set,get)=>({
    loading: false,
    searchedRestaurant: null,
    restaurantResult: null,
    restaurant: null,
    createRestaurant: async(formData:FormData)=>{
        try{
            set({loading:true});
            const response=await axios.post(`${API_END_POINT}/`,formData,{
                headers:{
                    'Content-Type':'multipart/form-data',
                }
            });
            if(response.status===201){
                toast.success('Restaurant created successfully');
                await get().getRestaurants();
            }
        }catch(error:any){
            toast.error(error.response?.data?.message || 'Restaurant creation failed');
        }finally{
            set({loading:false});
        }
    },

    getRestaurants: async()=>{
        try{
            set({loading:true});
            const response=await axios.get(`${API_END_POINT}/`);
            if(response.status===200){
                const restaurants = response.data.restaurant;
                if (restaurants && restaurants.length > 0) {
                    set({restaurant: restaurants[0]});
                } else {
                    set({restaurant: null});
                }
            }
        }catch(error:any){
            if(error.response?.status===404){
                set({restaurant:null});
            }
        }finally{
            set({loading:false});
        }
    },
    updateRestaurant: async(formData:FormData)=>{
        try{
            set({loading:true});
            const response=await axios.put(`${API_END_POINT}/`,formData,{
                headers:{
                    'Content-Type':'multipart/form-data',
                }
            });
            if(response.status===200){
                toast.success('Restaurant updated successfully');
                await get().getRestaurants();
            }
        }catch(error:any){
            toast.error(error.response?.data?.message || 'Restaurant update failed');
        }finally{
            set({loading:false});
        }
    },
    searchRestaurant: async(searchText:string,searchQuery:string,selectedCuisines:any)=>{
        try{
            set({loading:true});
            const params=new URLSearchParams();
            params.set('searchQuery',searchQuery);
            params.set('selectedCuisines',selectedCuisines);
            const response=await axios.get(`${API_END_POINT}/search/${searchText}?${params.toString()}`);
            if(response.status===200){
                set({searchedRestaurant:response.data});
            }
        }catch(error:any){
            console.error('Search failed:', error);
        }finally{
            set({loading:false});
        }
    },
    clearRestaurantState: () => {
        set({
            restaurant: null,
            searchedRestaurant: null,
            restaurantResult: null
        });
    },
    addMenuTorestaurant:async(menu:any)=>{
        set((state:any)=>{
            if (!state.restaurant) return state;
            return {
                ...state,
                restaurant: {
                    ...state.restaurant,
                    menus: [...state.restaurant.menus, menu]
                }
            };
        });
    },
    removeMenuFromRestaurant:async(menuId:string)=>{
        set((state:any)=>{
            if (!state.restaurant) return state;
            return {
                ...state,
                restaurant: {
                    ...state.restaurant,
                    menus: state.restaurant.menus.filter((menu:any) => menu._id !== menuId)
                }
            };
        });
    }

            

   
    
}),{
    name:'restaurant-name',
    storage:createJSONStorage(()=>localStorage),
}))

 