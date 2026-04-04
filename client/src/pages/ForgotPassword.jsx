import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import {
  FiZap, FiMail, FiPhone, FiLock,
  FiEye, FiEyeOff, FiAlertCircle,
  FiCheck, FiArrowLeft, FiShield,
} from 'react-icons/fi'

// ── Step indicator ────────────────────────────────────────
function StepBar({ current }) {
  const steps = ['Send OTP', 'Verify OTP', 'New Password']
  return (
    <div className="flex items-center mb-8">
      {steps.map((label, i) => {
        const isDone    = current > i
        const isActive  = current === i
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                ${isDone
                  ? 'bg-blue-600 border-blue-600'
                  : isActive
                  ? 'bg-white border-blue-600'
                  : 'bg-white border-slate-200'
                }`}
              >
                {isDone
                  ? <FiCheck className="text-white text-xs" />
                  : <span className={`text-xs font-bold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                      {i + 1}
                    </span>
                }
              </div>
              <span className={`text-[10px] font-semibold whitespace-nowrap
                ${isDone || isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all
                ${isDone ? 'bg-blue-600' : 'bg-slate-200'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── OTP Input ─────────────────────────────────────────────
function OTPInput({ value, onChange }) {
  const digits = 6

  const handleChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, '')
    if (!val) return
    const arr = value.split('')
    arr[i] = val[val.length - 1]
    onChange(arr.join(''))
    // auto focus next
    if (i < digits - 1) {
      document.getElementById(`otp-${i + 1}`)?.focus()
    }
  }

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace') {
      const arr = value.split('')
      if (arr[i]) {
        arr[i] = ''
        onChange(arr.join(''))
      } else if (i > 0) {
        document.getElementById(`otp-${i - 1}`)?.focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, digits)
    onChange(pasted.padEnd(digits, '').slice(0, digits))
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: digits }).map((_, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className={`w-11 h-12 text-center text-lg font-bold border-2 rounded-xl
            bg-slate-50 text-slate-800 outline-none transition-all
            ${value[i]
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-200 focus:border-blue-400 focus:bg-white'
            }`}
        />
      ))}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────
export default function ForgotPassword() {
  const navigate = useNavigate()

  const [step,       setStep]       = useState(0)   // 0, 1, 2
  const [method,     setMethod]     = useState('email')
  const [identifier, setIdentifier] = useState('')
  const [otp,        setOtp]        = useState('')
  const [password,   setPassword]   = useState('')
  const [confirmPass,setConfirmPass] = useState('')
  const [showPass,   setShowPass]   = useState(false)
  const [showConf,   setShowConf]   = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  // resend countdown
  const startResendTimer = () => {
    setResendTimer(30)
    const t = setInterval(() => {
      setResendTimer(p => {
        if (p <= 1) { clearInterval(t); return 0 }
        return p - 1
      })
    }, 1000)
  }

  // ── Step 0: Send OTP ──────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post(
        'http://localhost:5000/api/auth/forgot-password/send-otp',
        {
          method,
          ...(method === 'email' ? { email: identifier } : { phone: identifier }),
        },
        { withCredentials: true }
      )
      setStep(1)
      startResendTimer()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 1: Verify OTP ────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (otp.length < 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }
    setError('')
    setLoading(true)
    try {
      await axios.post(
        'http://localhost:5000/api/auth/forgot-password/verify-otp',
        {
          method,
          otp,
          ...(method === 'email' ? { email: identifier } : { phone: identifier }),
        },
        { withCredentials: true }
      )
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP')
      setOtp('')
    } finally {
      setLoading(false)
    }
  }

  // resend OTP
  const handleResend = async () => {
    if (resendTimer > 0) return
    setError('')
    setOtp('')
    try {
      await axios.post(
        'http://localhost:5000/api/auth/forgot-password/send-otp',
        {
          method,
          ...(method === 'email' ? { email: identifier } : { phone: identifier }),
        },
        { withCredentials: true }
      )
      startResendTimer()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP')
    }
  }

  // ── Step 2: Reset Password ────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPass) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await axios.post(
        'http://localhost:5000/api/auth/forgot-password/reset-password',
        {
          method,
          password,
          confirmPassword: confirmPass,
          ...(method === 'email' ? { email: identifier } : { phone: identifier }),
        },
        { withCredentials: true }
      )
      navigate('/login', {
        state: { msg: 'Password reset successfully! Please login.' },
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password')
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
            Reset Password
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Follow the steps to recover your account
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">

          <StepBar current={step} />

          {/* error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <FiAlertCircle className="text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* ── STEP 0: Send OTP ── */}
          {step === 0 && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  How do you want to receive your OTP?
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  We'll send a 6-digit code to verify your identity
                </p>

                {/* method toggle */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { key: 'email', label: 'Email',  icon: FiMail },
                    { key: 'phone', label: 'Phone',  icon: FiPhone },
                  ].map(m => {
                    const Icon = m.icon
                    const isSel = method === m.key
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => { setMethod(m.key); setIdentifier('') }}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all
                          ${isSel
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                      >
                        <Icon className="text-base" />
                        {m.label}
                      </button>
                    )
                  })}
                </div>

                {/* identifier input */}
                <div className="relative">
                  {method === 'email'
                    ? <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    : <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  }
                  <input
                    type={method === 'email' ? 'email' : 'tel'}
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    className={inputCls}
                    placeholder={method === 'email' ? 'you@example.com' : '+91 XXXXX XXXXX'}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60 shadow-sm shadow-blue-200"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : 'Send OTP'}
              </button>
            </form>
          )}

          {/* ── STEP 1: Verify OTP ── */}
          {step === 1 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="text-center mb-2">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FiShield className="text-blue-600 text-xl" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Enter the 6-digit OTP
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Sent to <span className="font-semibold text-slate-600">{identifier}</span>
                </p>
              </div>

              <OTPInput value={otp} onChange={setOtp} />

              {/* resend */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className={`text-xs font-semibold transition-colors
                    ${resendTimer > 0
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-blue-600 hover:text-blue-700'
                    }`}
                >
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : 'Resend OTP'
                  }
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60 shadow-sm shadow-blue-200"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => { setStep(0); setOtp(''); setError('') }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-slate-500 hover:text-slate-700 text-sm transition-colors"
              >
                <FiArrowLeft className="text-sm" />
                Change {method === 'email' ? 'email' : 'phone'}
              </button>
            </form>
          )}

          {/* ── STEP 2: New Password ── */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FiCheck className="text-emerald-600 text-xl" />
                </div>
                <p className="text-sm font-semibold text-slate-700">OTP Verified!</p>
                <p className="text-xs text-slate-400 mt-1">Now set your new password</p>
              </div>

              {/* new password */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  New Password
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

                {/* strength bar */}
                {password.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          password.length >= i * 3
                            ? password.length >= 10 ? 'bg-emerald-500'
                            : password.length >= 6  ? 'bg-amber-400'
                            : 'bg-red-400'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* confirm password */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type={showConf ? 'text' : 'password'}
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                    className={`${inputCls} pr-10 ${
                      confirmPass.length > 0
                        ? password === confirmPass
                          ? 'border-emerald-400 bg-emerald-50'
                          : 'border-red-300 bg-red-50'
                        : ''
                    }`}
                    placeholder="Repeat your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConf(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConf ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                  </button>
                </div>
                {confirmPass.length > 0 && password !== confirmPass && (
                  <p className="text-[11px] text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || password !== confirmPass || password.length < 8}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60 shadow-sm shadow-blue-200 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Resetting...
                  </>
                ) : 'Reset Password'}
              </button>
            </form>
          )}

          {/* back to login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FiArrowLeft className="text-xs" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}