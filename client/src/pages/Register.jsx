import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { setUser } from '../store/slices/authSlice'
import {
    FiZap, FiMail, FiLock, FiUser, FiPhone,
    FiEye, FiEyeOff, FiAlertCircle, FiCheck,
} from 'react-icons/fi'

const ROLES = [
    {
        key: 'customer',
        label: 'Customer',
        desc: 'I need electrical services',
        icon: FiUser,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
    },
    {
        key: 'electrician',
        label: 'Electrician',
        desc: 'I provide electrical services',
        icon: FiZap,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
    },
]

export default function Register() {
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const { user, accessToken } = useSelector(s => s.auth)

     if (accessToken && user) {
    if (user.role === 'electrician') return <Navigate to="/electrician/dashboard" replace />
    if (user.role === 'admin')       return <Navigate to="/admin/dashboard"       replace />
    return                                  <Navigate to="/customer/dashboard"    replace />
  }

    const [role, setRole] = useState('customer')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setLoading(true)
        try {
            const res = await axios.post(
                'http://localhost:5000/api/auth/register',
                { name, email, phone, password, role },
                { withCredentials: true }
            )

            // electrician — pending approval, login nahi hoga seedha
            if (role === 'electrician') {
                navigate('/login', {
                    state: {
                        msg: 'Registration successful! Wait for admin approval before logging in.',
                    },
                })
                return
            }

            // customer — seedha login + redirect
            dispatch(setUser({
                user: res.data.user,
                accessToken: res.data.accessToken,
            }))
            navigate('/customer/dashboard', { replace: true })

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.')
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
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                        <FiZap className="text-white text-2xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Create account
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Join InstantFix today
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">

                    {/* error */}
                    {error && (
                        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
                            <FiAlertCircle className="text-red-500 shrink-0" />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* role selector */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {ROLES.map(r => {
                            const Icon = r.icon
                            const isSelected = role === r.key
                            return (
                                <button
                                    key={r.key}
                                    type="button"
                                    onClick={() => setRole(r.key)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all
                    ${isSelected
                                            ? `${r.bg} ${r.border}`
                                            : 'bg-slate-50 border-transparent hover:border-slate-200'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${isSelected ? r.bg : 'bg-white'}`}>
                                        <Icon className={`text-lg ${isSelected ? r.color : 'text-slate-400'}`} />
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-sm font-bold ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>
                                            {r.label}
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">{r.desc}</p>
                                    </div>
                                    {isSelected && (
                                        <div className={`w-5 h-5 ${r.bg} rounded-full flex items-center justify-center`}>
                                            <FiCheck className={`text-[10px] ${r.color}`} />
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    {/* electrician approval notice */}
                    {role === 'electrician' && (
                        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
                            <FiAlertCircle className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700 leading-relaxed">
                                Electrician accounts require admin approval. You won't be able to accept jobs until approved.
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* name */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className={inputCls}
                                    placeholder="Your full name"
                                    required
                                />
                            </div>
                        </div>

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

                        {/* phone */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Phone Number
                            </label>
                            <div className="relative">
                                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className={inputCls}
                                    placeholder="+91 XXXXX XXXXX"
                                    required
                                />
                            </div>
                        </div>

                        {/* password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className={`${inputCls} pr-10`}
                                    placeholder="Min. 8 characters"
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

                            {/* password strength */}
                            {password.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-all ${password.length >= i * 3
                                                    ? password.length >= 10 ? 'bg-emerald-500'
                                                        : password.length >= 6 ? 'bg-amber-400'
                                                            : 'bg-red-400'
                                                    : 'bg-slate-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
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
                                    Creating account...
                                </>
                            ) : `Create ${role === 'electrician' ? 'Electrician' : 'Customer'} Account`}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}