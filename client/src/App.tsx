import './App.css'
import Signup from './auth/Signup'
import Login from './auth/Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<MainLayout/>,
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
        element:<Restaurants/>
      }
    ]
  },

  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/forget-password',
    element: <ForgetPassword />
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


  return (
    <>
      <main>
        <RouterProvider router={appRouter} />
      </main>
    </>
  )
}

export default App
