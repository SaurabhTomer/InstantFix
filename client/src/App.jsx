
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import {ToastContainer} from "react-toastify"

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
        <Route path='/signup' element={<SignUp />} />
      </Routes>
    </>
  )
}

export default App