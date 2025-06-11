import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import type { UserSignupSchemaType,UserLoginSchemaType } from "@/schema/userSchema";
import { toast } from "sonner";

interface UserStore {
  user: null | any;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  loading: boolean;
  signup: (userData: UserSignupSchemaType) => Promise<void>;
}

const API_URL="http://localhost:8001/api/v1/user";
axios.defaults.withCredentials=true;
type User={
    _id: string;
    fullname: string;
    email: string;
    contact: string;
    address: string;
    city: string;
    country: string;
    profilePicture: string;
    admin: boolean;
    isVerified: boolean;
    createdAt?: string;
    updatedAt?: string;
    lastlogin?: string;
}
type UserState={
    user:null | User;
    isAuthenticated:boolean;
    isCheckingAuth:boolean;
    loading:boolean;
    signup: (userData: UserSignupSchemaType) => Promise<void>;
    login: (userData: UserLoginSchemaType) => Promise<void>;
    verfyEmail: (verificationToken: string) => Promise<void>;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (password: string, token: string) => Promise<void>;
    updateUserProfile: (input: any) => Promise<void>;

}

export const useUserStore = create<any>()(persist((set, get) => ({
  user:null,
  isAuthenticated:false,
  isCheckingAuth:true,
  loading:false,
  //signup api implementation
  signup:async(userData:UserSignupSchemaType)=>{
    try {
        set({loading:true});
        const response=await axios.post(`${API_URL}/signup`,userData,{
            headers:{
                "Content-Type":"application/json"
            }
        });
        if(response.status===201){
            toast.success(response.data.message);
            set({user:response.data.user,isAuthenticated:true,isCheckingAuth:false,loading:false});
        }
    } catch (error: any) {
       set({loading:false});
       if (error.response) {
           // The request was made and the server responded with a status code
           // that falls out of the range of 2xx
           toast.error(error.response.data.message || 'Signup failed');
       } else if (error.request) {
           // The request was made but no response was received
           toast.error('No response from server. Please check your connection.');
       } else {
           // Something happened in setting up the request that triggered an Error
           toast.error('An error occurred during signup');
       }
    }
  },
  login:async(userData:UserLoginSchemaType)=>{
    try {
        set({loading:true});
        const response=await axios.post(`${API_URL}/login`,userData,{
            headers:{
                "Content-Type":"application/json"
            }
        });
            if(response.status===200){
            toast.success(response.data.message);
            set({user:response.data.user,isAuthenticated:true,isCheckingAuth:false,loading:false});
        }
    } catch (error: any) {
       set({loading:false});
       if (error.response) {
           // The request was made and the server responded with a status code
           // that falls out of the range of 2xx
           toast.error(error.response.data.message || 'Login failed');
       } else if (error.request) {
           // The request was made but no response was received
           toast.error('No response from server. Please check your connection.');
       } else {
           // Something happened in setting up the request that triggered an Error
           toast.error('An error occurred during login');
       }
    }
  },
  verfyEmail:async(verificationToken:string)=>{
    try{
        set({loading:true});
        const response=await axios.post(`${API_URL}/verify-email`, {
            verificationCode: verificationToken
        }, {
            headers:{
                "Content-Type":"application/json"
            }
        });
        if(response.status===200){
            toast.success(response.data.message);
            set({loading:false,isAuthenticated:true,isCheckingAuth:false,user:response.data.user});
        }
        
    } catch (error: any) {
        set({loading:false});
        toast.error(error.response?.data?.message || 'Email verification failed');
    }
  },
  checkAuth:async()=>{
    try{
        set({isCheckingAuth:true});
        const response=await axios.get(`${API_URL}/check-auth`);
        if(response.status===200){
            set({user:response.data.user,isAuthenticated:true,isCheckingAuth:false});

        }
    } catch (error: any) {
        set({isAuthenticated:false,isCheckingAuth:false});
        toast.error(error.response?.data?.message || 'Authentication check failed');
    }
  },
  logout:async()=>{
    try{
        set({loading:true});
        const response=await axios.post(`${API_URL}/logout`);
        if(response.status===200){
            toast.success(response.data.message);
            set({loading:false,isAuthenticated:false,isCheckingAuth:false,user:null});
        }
    } catch (error: any) {
        set({loading:false,isAuthenticated:false,isCheckingAuth:false,user:null});
        toast.error(error.response?.data?.message || 'Logout failed');
    }
  },
  forgotPassword:async(email:string)=>{
    try{
        set({loading:true});
        const response=await axios.post(`${API_URL}/forgot-password`,{email});
        if(response.status===200){
            toast.success(response.data.message);
            set({loading:false});
        }
    } catch (error: any) {
        set({loading:false});
        toast.error(error.response?.data?.message || 'Password reset failed');
    }
  },
  resetPassword:async(password:string,token:string)=>{
    try{
        set({loading:true});
        const response=await axios.post(`${API_URL}/reset-password`,{password,token});
        if(response.status===200){
            toast.success(response.data.message);
            set({loading:false});
        }   
    } catch (error: any) {
        set({loading:false});
        toast.error(error.response?.data?.message || 'Password reset failed');
    }
  },
  updateUserProfile:async(input:any)=>{
    try{
        set({loading:true});
        
        // Create FormData for the request
        const formData = new FormData();
        
        // Add all text fields
        formData.append('fullname', input.fullname);
        formData.append('email', input.email);
        formData.append('contact', input.contact);
        formData.append('address', input.address);
        formData.append('city', input.city);
        formData.append('country', input.country);

        // Get current user state
        const currentUser = get().user;

        // Handle profile picture if it exists and is different from current
        if (input.profilePicture && 
            input.profilePicture.startsWith('data:image') && 
            input.profilePicture !== currentUser?.profilePicture) {
            // Convert base64 to blob
            const base64Data = input.profilePicture.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            const blob = new Blob(byteArrays, { type: 'image/jpeg' });
            formData.append('profilePicture', blob, 'profile.jpg');
        }

        console.log('Sending profile update request with FormData');
        
        const response = await axios.put(`${API_URL}/profile/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        if(response.status===200){
            toast.success(response.data.message);
            
            // Update the user state with the new data
            set((state: UserState) => {
                const updatedUser = {
                    ...state.user,
                    ...response.data.user,
                    profilePicture: response.data.user.profilePicture
                };
                return {
                    ...state,
                    loading: false,
                    user: updatedUser,
                    isAuthenticated: true,
                    isCheckingAuth: false
                };
            });
        }
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.message || 'Profile update failed');
        } else {
            toast.error('Profile update failed');
        }
        set({loading:false});
    }
  },

}),{
    name:"user-store",
    storage:createJSONStorage(()=>localStorage)
}))