import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash, FaUserPlus, FaUser, FaEnvelope, FaPhone, FaLock, FaBolt, FaTools, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App'
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { toast } from 'react-toastify';

function SignUp() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("USER")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)

    // handle signup function
    const handleSignUp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                name,
                email,
                password,
                phone,
                role
            }, { withCredentials: true })
            // console.log(result);
            dispatch(setUserData(result.data))
                  if(result?.data?.user?.role === "ADMIN"){
                    navigate("/admin");
                  }
                  else if(result?.data?.user?.role === "USER"){
                    navigate("user");
                  }
                  else{
                    toast.warn("Wait for admin approval...");
                    navigate("/")
                  }
            toast.success("Account created successfully...")
            // navigate("/")
        } catch (error) {
            // setErr(error?.response?.data?.message)
            toast.warn(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-yellow-50 via-amber-50 to-blue-50 relative overflow-hidden'>
            {/* Background decoration */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fbbf24' fill-opacity='0.05'%3E%3Cpath d='M30 30l15-15v30L30 30zm0 0L15 45V15l15 15z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
            ></div>
            
            <div className='bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md p-8 border border-yellow-200/50 relative z-10'>
                {/* Top decorative icons */}
                <div className="flex justify-center gap-8 mb-4">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <FaBolt className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaTools className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FaShieldAlt className="w-4 h-4 text-green-500" />
                    </div>
                </div>
                
              

                <h1 className='text-3xl font-bold text-center mb-2 bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent'>InstantFix</h1>
                <p className='text-gray-600 text-center mb-8'>
                    Create your account to get started with ⚡ electrical services
                </p>

                {/* Full Name */}
                <div className='mb-5'>
                    <label className='block text-gray-700 font-semibold mb-2 flex items-center gap-2'>
                        <FaUser className="w-4 h-4 text-blue-500" />
                        Full Name
                    </label>
                    <input
                        type="text"
                        className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white'
                        placeholder='Enter your full name'
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </div>

                {/* Email */}
                <div className='mb-5'>
                    <label className='block text-gray-700 font-semibold mb-2 flex items-center gap-2'>
                        <FaEnvelope className="w-4 h-4 text-blue-500" />
                        Email Address
                    </label>
                    <input
                        type="email"
                        className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white'
                        placeholder='Enter your email address'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>

                {/* Mobile */}
                <div className='mb-5'>
                    <label className='block text-gray-700 font-semibold mb-2 flex items-center gap-2'>
                        <FaPhone className="w-4 h-4 text-blue-500" />
                        Phone Number
                    </label>
                    <input
                        type="text"
                        className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white'
                        placeholder='Enter your phone number'
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone}
                    />
                </div>

                {/* Password */}
                <div className='mb-5'>
                    <label className='block text-gray-700 font-semibold mb-2 flex items-center gap-2'>
                        <FaLock className="w-4 h-4 text-blue-500" />
                        Password
                    </label>
                    <div className='relative'>
                        <input
                            type={showPassword ? "text" : "password"}
                            className='w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white'
                            placeholder='Create a strong password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <button
                            type="button"
                            className='absolute right-3 top-3.5 text-gray-400 hover:text-blue-500 transition-colors'
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                    </div>
                </div>

                {/* Role */}
                <div className='mb-6'>
                    <label className='block text-gray-700 font-semibold mb-2'>I want to join as</label>
                    <div className='flex gap-3'>
                        {["USER", "ELECTRICIAN"].map((r) => (
                            <button
                                key={r}
                                type="button"
                                className={`flex-1 border-2 rounded-xl px-4 py-3 font-semibold transition-all duration-200 transform hover:scale-105
                                ${role === r
                                        ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-transparent shadow-lg"
                                        : "border-gray-200 text-gray-600 hover:border-yellow-300 hover:bg-yellow-50"}`}
                                onClick={() => setRole(r)}
                            >
                                {r === "USER" ? "🏠 Customer" : "⚡ Electrician"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button
                    className='w-full font-bold py-4 rounded-xl transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none'
                    onClick={handleSignUp}
                    disabled={loading}
                >
                    {loading ? <ClipLoader size={20} color='white' /> : "Create Account"}
                </button>

                {err && <p className='text-red-500 text-center mt-4 font-medium'>*{err}</p>}

                <p className='text-center mt-8 text-gray-600'>
                    Already have an account?
                    <span
                        className='text-blue-600 font-bold ml-2 hover:text-blue-700 cursor-pointer transition-colors'
                        onClick={() => navigate("/signin")}
                    >
                        Sign In →
                    </span>
                </p>

            </div>
        </div>
    )
}

export default SignUp