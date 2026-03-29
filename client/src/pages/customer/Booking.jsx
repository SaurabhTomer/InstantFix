import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlinePhotograph, HiOutlineX } from 'react-icons/hi'
import { MdElectricBolt } from 'react-icons/md'
import Toast from '../../components/Toast'

const categories = [
  { icon: '💡', title: 'Wiring & Rewiring' },
  { icon: '🔌', title: 'Switchboard' },
  { icon: '❄️', title: 'AC Services' },
  { icon: '🌀', title: 'Fan Installation' },
  { icon: '🔦', title: 'Lighting' },
  { icon: '⚡', title: 'Short Circuit' },
  { icon: '🏠', title: 'Home Inspection' },
  { icon: '🪫', title: 'Power Backup' }
]

const Booking = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showToast, setShowToast] = useState(false)

  const [formData, setFormData] = useState({
    category: '',
    description: '',
    photos: [],
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  })

  const [previewPhotos, setPreviewPhotos] = useState([])
  const { accessToken } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + formData.photos.length > 5) {
      setError('Max 5 photos allowed')
      return
    }
    setFormData({ ...formData, photos: [...formData.photos, ...files] })
    const previews = files.map(file => URL.createObjectURL(file))
    setPreviewPhotos([...previewPhotos, ...previews])
  }

  const removePhoto = (index) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index)
    const newPreviews = previewPhotos.filter((_, i) => i !== index)
    setFormData({ ...formData, photos: newPhotos })
    setPreviewPhotos(newPreviews)
  }

  const handleAddressChange = (e) => {
    setFormData({
      ...formData,
      address: { ...formData.address, [e.target.name]: e.target.value }
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = new FormData()
      data.append('category', formData.category)
      data.append('description', formData.description)
      data.append('address', JSON.stringify(formData.address))
      formData.photos.forEach(photo => data.append('photos', photo))

      await axios.post('http://localhost:5000/api/requests', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })

        setLoading(false)  // pehle loading band karo
    setShowToast(true) // phir toast dikhao

      // 3 second baad navigate karo
      setTimeout(() => {
        navigate('/customer/requests')
      }, 3000)

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

    {/* toast  */}
       <Toast
      message="Request submitted successfully!"
      show={showToast}
      onClose={() => setShowToast(false)}
    />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => step === 1 ? navigate('/customer/dashboard') : setStep(step - 1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition"
        >
          <HiOutlineArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-800">Book a Service</h1>
          <p className="text-xs text-gray-400">Step {step} of 3</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 max-w-md">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                step === s
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
                <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 max-w-md">
          <p className="text-xs text-gray-500">Service</p>
          <p className="text-xs text-gray-500">Address</p>
          <p className="text-xs text-gray-500">Confirm</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Step 1 — Service Details */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">Select Service</h2>
              <p className="text-sm text-gray-500 mb-4">What do you need help with?</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat, i) => (
                  <div
                    key={i}
                    onClick={() => setFormData({ ...formData, category: cat.title })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.category === cat.title
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-100 bg-white hover:border-blue-200'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <p className={`text-xs font-medium text-center ${
                      formData.category === cat.title ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {cat.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Describe the issue
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. My AC is not cooling properly, making a noise..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Add Photos <span className="text-gray-400 font-normal">(optional, max 5)</span>
              </label>

              <div className="flex flex-wrap gap-3">
                {previewPhotos.map((preview, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <HiOutlineX size={12} />
                    </button>
                  </div>
                ))}

                {previewPhotos.length < 5 && (
                  <label className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition">
                    <HiOutlinePhotograph size={20} className="text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                if (!formData.category) return setError('Please select a category')
                if (!formData.description) return setError('Please describe the issue')
                setError(null)
                setStep(2)
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              Next <HiOutlineArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2 — Address */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">Service Address</h2>
              <p className="text-sm text-gray-500 mb-4">Where do you need the service?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Street</label>
              <input
                type="text"
                name="street"
                value={formData.address.street}
                onChange={handleAddressChange}
                placeholder="House no, Street name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.address.state}
                  onChange={handleAddressChange}
                  placeholder="State"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.address.pincode}
                onChange={handleAddressChange}
                placeholder="282001"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              onClick={() => {
                const { street, city, state, pincode } = formData.address
                if (!street || !city || !state || !pincode) return setError('Please fill all address fields')
                setError(null)
                setStep(3)
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              Next <HiOutlineArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">Confirm Booking</h2>
              <p className="text-sm text-gray-500 mb-4">Review your request before submitting.</p>
            </div>

            {/* Summary Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">

              {/* Service */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <MdElectricBolt size={22} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Service</p>
                  <p className="text-sm font-semibold text-gray-800">{formData.category}</p>
                </div>
              </div>

              {/* Description */}
              <div className="pb-4 border-b border-gray-50">
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-700">{formData.description}</p>
              </div>

              {/* Photos */}
              {previewPhotos.length > 0 && (
                <div className="pb-4 border-b border-gray-50">
                  <p className="text-xs text-gray-400 mb-2">Photos ({previewPhotos.length})</p>
                  <div className="flex gap-2 flex-wrap">
                    {previewPhotos.map((preview, i) => (
                      <img
                        key={i}
                        src={preview}
                        alt="preview"
                        className="w-14 h-14 object-cover rounded-xl border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Address */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Address</p>
                <p className="text-sm text-gray-700">
                  {formData.address.street}, {formData.address.city}, {formData.address.state} - {formData.address.pincode}
                </p>
              </div>
            </div>

            {/* Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              <p className="text-yellow-700 text-xs">
                An electrician will be assigned to your request shortly. You will be notified once accepted.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Booking