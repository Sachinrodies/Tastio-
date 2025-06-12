import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";
import type { RestaurantStore } from "@/types/restaurantType.ts";

const API_END_POINT="http://localhost:8000/api/v1/restaurant"
axios.defaults.withCredentials=true;

// Initialize state from localStorage if available
const getInitialState = () => {
    try {
        const savedState = localStorage.getItem('restaurant-name');
        return savedState ? JSON.parse(savedState) : null;
    } catch (error) {
        console.error('Error loading initial state:', error);
        return null;
    }
};

export const useRestaurantStore = create<RestaurantStore>()(persist((set,get)=>({
    loading: false,
    appliedFilters:[],
    searchedRestaurant: null,
    restaurantResult: null,
    restaurant: null,
    menu: null,
    singleRestaurant:null,
    restaurantOrders:[],

    // Initialize the store with saved state
    initializeStore: () => {
        const savedState = getInitialState();
        if (savedState) {
            set(savedState);
        }
    },

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
            if(searchQuery && searchQuery.trim()) {
                params.set('searchQuery', searchQuery.trim());
            }
            const cuisines = Array.isArray(selectedCuisines) ? selectedCuisines : [selectedCuisines];
            const validCuisines = cuisines.filter(Boolean);
            validCuisines.forEach(cuisine => {
                params.append('selectedCuisines', cuisine);
            });

            const response=await axios.get(`${API_END_POINT}/search/${searchText}?${params.toString()}`);
            if(response.status===200){
                set({searchedRestaurant:response.data});
            }
        }catch(error:any){
            if (error.response?.status === 401) {
                toast.error('Please log in to search restaurants');
                set({searchedRestaurant: null});
            } else if (error.response?.status === 404) {
                toast.error('No restaurants found matching your search');
                set({searchedRestaurant: { data: [] }});
            } else {
                toast.error(error.response?.data?.message || 'Search failed. Please try again.');
                set({searchedRestaurant: null});
            }
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
    updateMenuInRestaurant:async(updateMenu:any)=>{
        try {
            const currentState = get();
            if (!currentState.restaurant) {
                return;
            }

            const currentMenus = currentState.restaurant.menus || [];
            const updatedMenus = currentMenus.map((menu:any) =>
                menu._id === updateMenu._id ? updateMenu : menu
            );

            const updatedRestaurant = {
                ...currentState.restaurant,
                menus: updatedMenus
            };

            set((state) => ({
                ...state,
                restaurant: updatedRestaurant,
                menu: null
            }));

            // Persist the changes
            const newState = get();
            localStorage.setItem('restaurant-name', JSON.stringify(newState));

            // Refresh the restaurant data
            try {
                const response = await axios.get(`${API_END_POINT}/`);
                if (response.status === 200 && response.data.restaurant) {
                    set((state) => ({
                        ...state,
                        restaurant: response.data.restaurant
                    }));
                    const freshState = get();
                    localStorage.setItem('restaurant-name', JSON.stringify(freshState));
                }
            } catch (error) {
            }

        } catch (error) {
            toast.error('Failed to update menu. Please try again.');
        }
    },
    setAppliedFilters:async(filters:string)=>{
        set((state)=>{
            const alreadyAppliedFilters=state.appliedFilters.includes(filters);
            const updatedFilters = alreadyAppliedFilters 
                ? state.appliedFilters.filter((filter: string) => filter !== filters) 
                : [...state.appliedFilters, filters];
            return {
                ...state,
                appliedFilters: updatedFilters
            };
        })
    },
    resetFilters: () => {
        set((state) => ({
            ...state,
            appliedFilters: []
        }));
    },
    getSingleRestaurant:async(id:string)=>{
        try{
            const response=await axios.get(`${API_END_POINT}/${id}`);
            if(response.data.success){
                set({singleRestaurant:response.data.restaurant});
            }
        }catch(error:any){
            toast.error(error.response?.data?.message || 'Failed to fetch restaurant');
        }finally{
            set({loading:false});
        }
    },
    getRestaurantOrders:async(id:string)=>{
        try{
            const response=await axios.get(`${API_END_POINT}/order/${id}`);     
            set({restaurantOrders:response.data.orders});
        }catch(error:any){
            toast.error(error.response?.data?.message || 'Failed to fetch restaurant orders');
        }finally{
            set({loading:false});
        }
    },
    updateRestaurantOrders:async(id:string,order:any)=>{
        try{
            const response=await axios.put(`${API_END_POINT}/order/${id}`,order,
                {
                    headers:{
                        'Content-Type':'application/json',
                    }
                }
            );
           if(response.data.success){
           const updatedOrders=get().restaurantOrders.map((order:any)=>order._id===id?{...order,status:response.data.order.status}:order);
           set({restaurantOrders:updatedOrders});
           toast.success('Restaurant orders updated successfully');
           }
        }catch(error:any){
            toast.error(error.response?.data?.message || 'Failed to update restaurant orders');
        }finally{
            set({loading:false});
        }
    }
}), {
    name: 'restaurant-name',
    storage: createJSONStorage(() => localStorage)
}));

 