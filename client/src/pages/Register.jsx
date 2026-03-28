import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

const Register = () => {
  const [role, setRole] = useState('customer')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })

  const handleChange = (e) => {
    setFormData({
       ...formData, 
      [e.target.name]: e.target.value  // jis input ka name change hua (e.target.name), uski value ko update kar rahe hain (e.target.value) 
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ ...formData, role })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-gray-100 p-8">

        <div className="mb-8 text-center">
          <Logo size="md" />
          <p className="text-gray-500 text-sm mt-3">Create your account</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${role === 'customer'
                ? 'bg-white text-blue-600 shadow-sm '
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('electrician')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${role === 'electrician'
                ? 'bg-white text-blue-600 shadow-sm '
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Electrician
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"     //  "name" attribute batata hai kaunsa field update hoga (formData.name)
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9999999999"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {role === 'electrician' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              <p className="text-yellow-700 text-xs">
                Your account will be reviewed by admin before activation.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all duration-200 mt-2"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register