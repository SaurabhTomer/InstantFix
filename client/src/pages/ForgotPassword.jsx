import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Logo from '../components/Logo'

const BASE_URL = 'http://localhost:5000/api/auth'

const ForgotPassword = () => {
    const [step, setStep] = useState(1)
    const [otpMethod, setOtpMethod] = useState('email')
    const [formData, setFormData] = useState({
        email: '',
        phone: ''
    })
    const [otp, setOtp] = useState('')
    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const maskedValue = otpMethod === 'email'
        ? formData.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
        : formData.phone.replace(/(\d{2})(\d+)(\d{2})/, '$1****$3')

    // Step 1 — Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await axios.post(`${BASE_URL}/forgot-password/send-otp`, {
                method: otpMethod,
                email: formData.email,
                phone: formData.phone
            })
            setStep(2)
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    // Step 2 — Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await axios.post(`${BASE_URL}/forgot-password/verify-otp`, {
                method: otpMethod,
                email: formData.email,
                phone: formData.phone,
                otp
            })
            setStep(3)
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP')
        } finally {
            setLoading(false)
        }
    }

    // Step 3 — Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (passwords.password !== passwords.confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        try {
            await axios.post(`${BASE_URL}/forgot-password/reset-password`, {
                method: otpMethod,
                email: formData.email,
                phone: formData.phone,
                password: passwords.password,
                confirmPassword: passwords.confirmPassword
            })
            setStep(4)
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    // step 4 set hone ke baad auto redirect
    useEffect(() => {
        if (step === 4) {
            const timer = setTimeout(() => {
                navigate('/login')
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [step])


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-gray-100 p-8">

                <div className="mb-7 text-center">
                    <Logo size="md" />
                    <p className="text-gray-500 text-sm mt-2">Forgot Password</p>
                </div>

                {/* Step Indicator */}
                {step !== 4 && (
                    <div className="flex items-center justify-center gap-2 mb-7">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${step === s
                                        ? 'bg-blue-600 text-white'
                                        : step > s
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    {step > s ? (
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : s}
                                </div>
                                {s !== 3 && (
                                    <div className={`w-10 h-0.5 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* Step 1 — Send OTP */}
                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-1">
                                How do you want to receive OTP?
                            </h3>
                            <p className="text-xs text-gray-400 mb-4">Choose your preferred method.</p>

                            <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setOtpMethod('email')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${otpMethod === 'email'
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Email
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOtpMethod('sms')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${otpMethod === 'sms'
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    SMS
                                </button>
                            </div>

                            {otpMethod === 'email' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="9999999999"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {/* Step 2 — Verify OTP */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-1">Enter OTP</h3>
                            <p className="text-xs text-gray-400 mb-4">
                                OTP sent to <span className="text-gray-600 font-medium">{maskedValue}</span>
                                {' '}via {otpMethod === 'email' ? 'email' : 'SMS'}
                            </p>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6 digit OTP"
                                maxLength={6}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition tracking-widest text-center"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-sm text-gray-500 hover:text-blue-600 transition"
                        >
                            Change {otpMethod === 'email' ? 'email' : 'phone'}
                        </button>
                    </form>
                )}

                {/* Step 3 — Reset Password */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-1">Set new password</h3>
                            <p className="text-xs text-gray-400 mb-4">Choose a strong password.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                            <input
                                type="password"
                                placeholder="Min 6 characters"
                                value={passwords.password}
                                onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Re-enter password"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Resetting...' : 'Change Password'}
                        </button>
                    </form>
                )}

                {/* Step 4 — Success */}
                {step === 4 && (
                    <div className="text-center py-4">
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Password Reset!</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Your password has been reset successfully.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition-all duration-200"
                        >
                            Back to Login
                        </button>
                    </div>
                )}

                {step !== 4 && (
                    <p className="text-center text-sm text-gray-500 mt-6">
                        <Link to="/login" className="text-blue-600 font-medium hover:underline">
                            Back to Login
                        </Link>
                    </p>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword