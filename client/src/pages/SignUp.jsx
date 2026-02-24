import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
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
            toast.success("Account created successfully...")
            navigate("/")
        } catch (error) {
            // setErr(error?.response?.data?.message)
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen w-full flex items-center justify-center p-4 bg-blue-50'>
            <div className='bg-white rounded-xl shadow-xl w-full max-w-md p-8 border border-blue-200'>

                <h1 className='text-3xl font-bold mb-2 text-blue-600'>InstantFix</h1>
                <p className='text-gray-600 mb-8'>
                    Create your account to get started
                </p>

                {/* Full Name */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1'>Name</label>
                    <input
                        type="text"
                        className='w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400'
                        placeholder='Enter your Name'
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </div>

                {/* Email */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1'>Email</label>
                    <input
                        type="email"
                        className='w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400'
                        placeholder='Enter your Email'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>

                {/* Mobile */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1'>Phone</label>
                    <input
                        type="text"
                        className='w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400'
                        placeholder='Enter your Phone Number'
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone}
                    />
                </div>

                {/* Password */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1'>Password</label>
                    <div className='relative'>
                        <input
                            type={showPassword ? "text" : "password"}
                            className='w-full border border-blue-200 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400'
                            placeholder='Enter your password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <button
                            type="button"
                            className='absolute right-3 top-3.5 text-gray-500'
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                    </div>
                </div>

                {/* Role */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1'>Role</label>
                    <div className='flex gap-2'>
                        {["USER", "ELECTRICIAN"].map((r) => (
                            <button
                                key={r}
                                type="button"
                                className={`flex-1 border rounded-lg px-3 py-2 font-medium transition 
                                ${role === r
                                        ? "bg-yellow-400 text-black"
                                        : "border-blue-500 text-blue-600 hover:bg-blue-50"}`}
                                onClick={() => setRole(r)}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button
                    className='w-full font-semibold py-2 rounded-lg transition duration-200 bg-blue-600 text-white hover:bg-blue-700'
                    onClick={handleSignUp}
                    disabled={loading}
                >
                    {loading ? <ClipLoader size={20} color='white' /> : "Sign Up"}
                </button>

                {err && <p className='text-red-500 text-center my-2.5'>*{err}</p>}


                <p className='text-center mt-6 cursor-pointer'>
                    Already have an account?
                    <span
                        className='text-blue-600 font-semibold ml-1'
                        onClick={() => navigate("/signin")}
                    >
                        Sign In
                    </span>
                </p>

            </div>
        </div>
    )
}

export default SignUp