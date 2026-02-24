
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import {ToastContainer} from "react-toastify"
import SignIn from './pages/SignIn';

// Server URL
export const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";


const App = () => {
  return (
    <>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        theme="colored"
      />


      <Routes>
        {/* <Route path='/' element={<SignUp />} /> */}
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
      </Routes>
    </>
  )
}

export default App