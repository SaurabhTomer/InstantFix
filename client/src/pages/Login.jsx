import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { setUser } from '../store/slices/authSlice'
// import { FiZap, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi'
import { FiZap, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheck } from 'react-icons/fi'

export default function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const location = useLocation()
    const successMsg = location.state?.msg

    const { user, accessToken } = useSelector(s => s.auth)

    if (accessToken && user) {
    if (user.role === 'electrician') return <Navigate to="/electrician/dashboard" replace />
    if (user.role === 'admin')       return <Navigate to="/admin/dashboard"       replace />
    return                                  <Navigate to="/customer/dashboard"    replace />
  }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await axios.post(
                'http://localhost:5000/api/auth/login',
                { email, password },
                { withCredentials: true }
            )

            dispatch(setUser({
                user: res.data.user,
                accessToken: res.data.accessToken,
            }))

            const role = res.data.user.role

            if (role === 'electrician') {
                navigate('/electrician/dashboard', { replace: true })
            } else if (role === 'admin') {
                navigate('/admin/dashboard', { replace: true })
            } else {
                navigate('/customer/dashboard', { replace: true })
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const inputCls = `
    w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
    text-sm text-slate-700 placeholder-slate-300
    focus:outline-none focus:border-blue-400 focus:bg-white transition-colors
  `

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                        <FiZap className="text-white text-2xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Sign in to your InstantFix account
                    </p>
                </div>

                {/* card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">


                    {/* SUCCESS MESSAGE — register/forgot password se aane par */}
                    {successMsg && (
                        <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-5">
                            <FiCheck className="text-emerald-500 shrink-0" />
                            <p className="text-sm text-emerald-700">{successMsg}</p>
                        </div>
                    )}

                    {/* error */}
                    {error && (
                        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
                            <FiAlertCircle className="text-red-500 shrink-0" />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className={inputCls}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Password
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className={`${inputCls} pr-10`}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPass ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                                </button>
                            </div>
                        </div>

                        {/* submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60 shadow-sm shadow-blue-200 mt-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    {/* divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-xs text-slate-400">or</span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    {/* register link */}
                    <p className="text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}