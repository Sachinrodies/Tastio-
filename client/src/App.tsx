
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

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<MainLayout/>,
    children:[
      {
        path:'/',
        element:<HeroSection/>
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
