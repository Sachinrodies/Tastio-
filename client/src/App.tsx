import './App.css'
import Signup from './auth/Signup'
import Login from './auth/Login'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import ForgetPassword from './auth/ForgetPassword'
import ResetPassword from './auth/ResetPassword'
import VerifyEmail from './auth/VerifyEmail'
import Navbar from './components/ui/Navbar'
import HeroSection from './components/ui/HeroSection'
import MainLayout from './Layout/MainLayout'
import Profile from './components/ui/Profile'
import SearchPage from './components/ui/SearchPage'
import RestaurantDetails from './components/ui/RestaurantDetails'
import Cart from './components/ui/Cart'
import Restaurants from './admin/Restaurants'
import AddMenu from './admin/AddMenu'
import Orders from './admin/Orders'
import OrderStatus from './components/ui/OrderStatus'
import { useUserStore } from './store/useUseStore'
import { useEffect } from 'react'
import Loading from './components/ui/Loading'
import { useThemeStore } from './store/UseThemeStore'

const AdminRoute=({children}:{children:React.ReactNode})=>{
  const {user,isAuthenticated}=useUserStore();
  if(!isAuthenticated){
    return <Navigate to="/login" replace/>
  }
  if(!user?.admin){
    return <Navigate to="/" replace/>
  }
  return children;
}
const ProtectedRoute=({children}:{children:React.ReactNode})=>{
  const {isAuthenticated,user}=useUserStore();
  if(!isAuthenticated){
    return <Navigate to="/login" replace/>
  }
  if(!user?.isVerified){
    return <Navigate to="/verify-email" replace/>
  }
  return children;
}
const AuthenticatedRoute=({children}:{children:React.ReactNode})=>{
  const {isAuthenticated,user}=useUserStore();
  if(isAuthenticated && user?.isVerified){
    return <Navigate to="/" replace/>
  }
  return children;
}

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<ProtectedRoute><MainLayout/></ProtectedRoute>,
    children:[
      {
        path:'/',
        element:<HeroSection/>
      },
      {
        path:'/profile',
        element:<Profile/>
      }
      ,
      {
        path:'/search/:query',
        element:<SearchPage/>
      },
      {
        path:'/restaurant/:id',
        element:<RestaurantDetails/>
      },
      {
        path:'/cart',
        element:<Cart/>
      },
      // admin service starts from here
      {
        path:'/admin/restaurants',
        element:<AdminRoute><Restaurants/></AdminRoute>
      },
      {
        path:'/admin/add-menu',
        element:<AdminRoute><AddMenu/></AdminRoute>
      },
      {
        path:'/admin/orders',
        element:<AdminRoute><Orders/></AdminRoute>  
      },
      {
        path:'/orders/status',
        element:<AdminRoute><OrderStatus/></AdminRoute>
      }
    ]
  },
  {
    path:'/order/status',
    element:<ProtectedRoute><OrderStatus/></ProtectedRoute>
  },
  {
    path: '/login',
    element: <AuthenticatedRoute><Login /></AuthenticatedRoute>
  },
  {
    path: '/signup',
    element: <AuthenticatedRoute><Signup /></AuthenticatedRoute>
  },
  {
    path: '/forget-password',
    element: <AuthenticatedRoute><ForgetPassword /></AuthenticatedRoute>
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />
  },

])

function App() {
  //checking auth everytimes when page is loaded
  const {checkAuth,isCheckingAuth}=useUserStore();
  const { initializeTheme } = useThemeStore();
  useEffect(()=>{
    checkAuth();
    initializeTheme();
  },[checkAuth, initializeTheme]);
  if(isCheckingAuth){
    return <Loading/>
  }
 


  return (
    <>
      <main>
        <RouterProvider router={appRouter} />
      </main>
    </>
  )
}

export default App
