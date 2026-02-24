
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import {ToastContainer} from "react-toastify"
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import CreateRequest from './pages/CreateRequest';
import Home from './pages/Home';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ElectricianDashboardPage from './pages/ElectricianDashboardPage';
import useGetLocation from './hook/UseGetLocation';

// Server URL
export const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";


const App = () => {

//hook
  useGetLocation();
  
  return (
    <>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        theme="colored"
      />


      <Routes>
        {/* <Route path='/' element={<SignUp />} /> */}
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/create-request' element={<CreateRequest />} />
        <Route path='/dashboard' element={<UserDashboardPage />} />
        <Route path='/admin' element={<AdminDashboardPage />} />
        <Route path='/electrician' element={<ElectricianDashboardPage />} />
      </Routes>
    </>
  )
}

export default App