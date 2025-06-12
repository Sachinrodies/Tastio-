import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";
import { useRestaurantStore } from "./useRestaurantStore";

const API_END_POINT="https://tastio-4.onrender.com/api/v1/menu";
axios.defaults.withCredentials = true;

type MenuState={
    loading:boolean,
    menu:null,
    createMenu:(formData:FormData)=>Promise<void>,
    editMenu:(menuId:string,formData:FormData)=>Promise<void>,
}

export const userMenuStore=create<MenuState>()(persist((set)=>({
    loading:false,
    menu:null,
    createMenu:async(formData:FormData)=>{
        try{
            set({loading:true});
            const response=await axios.post(`${API_END_POINT}/`,formData,{
                headers:{
                    'Content-Type':'multipart/form-data',
                }
            });
            if(response.status === 201){
                toast.success(response.data.message);
                set({menu:response.data.menu,loading:false});
                useRestaurantStore.getState().addMenuTorestaurant(response.data.menu);
            } else {
                toast.error(response.data.message || 'Menu creation failed');
                set({loading:false});
            }
        }catch(error:any){
            console.error('Menu creation error:', error);
            toast.error(error.response?.data?.message || 'Menu creation failed');
            set({loading:false});
        }
    },
    editMenu:async(menuId:string,formData:FormData)=>{
        try{
            set({loading:true});
            const response=await axios.put(`${API_END_POINT}/${menuId.toString()}`,formData,{  
                headers:{
                    'Content-Type':'multipart/form-data',
                }
            });
            if(response.status === 200){
                toast.success(response.data.message);
                set({menu:response.data.menu,loading:false});
                // Update the menu in the restaurant store
                const restaurant = useRestaurantStore.getState().restaurant;
                if (restaurant) {
                    const updatedMenus = restaurant.menus.map((menu: any) => 
                        menu._id === menuId ? response.data.menu : menu
                    );
                    useRestaurantStore.setState({
                        restaurant: {
                            ...restaurant,
                            menus: updatedMenus
                        }
                    });
                }
            } else {
                toast.error(response.data.message || 'Menu update failed');
                set({loading:false});
            }
        }catch(error:any){
            console.error('Menu update error:', error);
            toast.error(error.response?.data?.message || 'Menu update failed');
            set({loading:false});
        }
    },
}),{
    name:'menu-name',
    storage:createJSONStorage(()=>localStorage),
}))
