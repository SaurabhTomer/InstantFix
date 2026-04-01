import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from './components/Sidebar'
import { HiOutlineBriefcase, HiOutlineCheckCircle, HiOutlineCurrencyRupee, HiOutlineClock, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineChartBar, HiOutlineUser, HiOutlineCog } from 'react-icons/hi'
import { MdElectricBolt, MdLocationOn, MdTrendingUp, MdAttachMoney } from 'react-icons/md'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  accepted: 'bg-blue-100 text-blue-700 border-blue-200',
  started: 'bg-purple-100 text-purple-700 border-purple-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200'
}

const ElectricianDashboard = () => {
  const [stats, setStats] = useState(null)
  const [availableJobs, setAvailableJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [serviceRadius, setServiceRadius] = useState(5) // Default 5km
  const [showRadiusModal, setShowRadiusModal] = useState(false)
  const [analytics, setAnalytics] = useState(null)
  const { accessToken, user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  // Check if electrician is approved
  const isApproved = user?.approvalStatus === 'approved'
  const canAcceptJobs = isApproved && !stats?.activeJob

  const fetchData = async () => {
    try {
      const [statsRes, jobsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/electrician/stats', {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true
        }),
        axios.get('http://localhost:5000/api/electrician/jobs?limit=5', {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true
        })
      ])
      setStats(statsRes.data.stats)
      setAvailableJobs(jobsRes.data.jobs)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleAccept = async (id) => {
    setActionLoading(id)
    try {
      await axios.put(`http://localhost:5000/api/electrician/jobs/${id}/accept`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true
      })
      fetchData()
    } catch (err) {
      console.log(err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleStart = async (id) => {
    setActionLoading(id)
    try {
      await axios.put(`http://localhost:5000/api/electrician/jobs/${id}/start`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true
      })
      fetchData()
    } catch (err) {
      console.log(err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleComplete = async (id) => {
    setActionLoading(id)
    try {
      await axios.put(`http://localhost:5000/api/electrician/jobs/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true
      })
      fetchData()
    } catch (err) {
      console.log(err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdateRadius = async () => {
    try {
      await axios.put('http://localhost:5000/api/electrician/radius', 
        { serviceRadius }, 
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true
        }
      )
      setShowRadiusModal(false)
      fetchData() // Refresh data with new radius
    } catch (err) {
      console.log(err)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/electrician/analytics', {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true
      })
      setAnalytics(response.data.analytics)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => { 
    fetchData() 
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">

        {/* Top Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Good morning, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Here's what's happening today</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Approval Status */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
              isApproved ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isApproved ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className={`text-sm font-medium ${
                isApproved ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {isApproved ? 'Approved' : 'Pending Approval'}
              </span>
            </div>
            {/* Online Status */}
            <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 text-sm font-medium">Online</span>
            </div>
            {/* Radius Control */}
            <button
              onClick={() => setShowRadiusModal(true)}
              className="flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-200 transition"
            >
              <MdLocationOn size={16} className="text-blue-600" />
              <span className="text-blue-700 text-sm font-medium">{serviceRadius}km</span>
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Jobs',
                value: stats?.totalJobs || 0,
                icon: <HiOutlineBriefcase size={20} className="text-blue-600" />,
                bg: 'bg-blue-50',
                border: 'border-blue-100'
              },
              {
                label: 'Completed',
                value: stats?.completedJobs || 0,
                icon: <HiOutlineCheckCircle size={20} className="text-green-600" />,
                bg: 'bg-green-50',
                border: 'border-green-100'
              },
              {
                label: 'Total Earnings',
                value: `₹${stats?.totalEarnings || 0}`,
                icon: <HiOutlineCurrencyRupee size={20} className="text-yellow-600" />,
                bg: 'bg-yellow-50',
                border: 'border-yellow-100'
              },
              {
                label: 'Active Job',
                value: stats?.activeJob ? '1' : '0',
                icon: <HiOutlineClock size={20} className="text-purple-600" />,
                bg: 'bg-purple-50',
                border: 'border-purple-100'
              }
            ].map((card, i) => (
              <div key={i} className={`bg-white rounded-2xl border ${card.border} p-5`}>
                <div className={`${card.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                  {card.icon}
                </div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Active Job */}
          {stats?.activeJob && (
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <span className="text-blue-200 text-sm font-medium">Active Job</span>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full bg-white bg-opacity-20 text-white`}>
                  {stats.activeJob.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{stats.activeJob.category}</h3>
                  <p className="text-blue-200 text-sm mt-1">{stats.activeJob.description?.slice(0, 60)}...</p>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold">
                        {stats.activeJob.customer?.name?.[0]}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{stats.activeJob.customer?.name}</p>
                        <p className="text-blue-200 text-xs">{stats.activeJob.customer?.phone}</p>
                      </div>
                    </div>
                  </div>

                  {stats.activeJob.address && (
                    <div className="flex items-center gap-1.5 mt-3">
                      <HiOutlineLocationMarker size={14} className="text-blue-300" />
                      <p className="text-blue-200 text-xs">
                        {stats.activeJob.address?.street}, {stats.activeJob.address?.city}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {stats.activeJob.status === 'accepted' && (
                    <button
                      onClick={() => handleStart(stats.activeJob._id)}
                      disabled={actionLoading === stats.activeJob._id}
                      className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition disabled:opacity-60"
                    >
                      {actionLoading === stats.activeJob._id ? 'Starting...' : 'Start Job'}
                    </button>
                  )}
                  {stats.activeJob.status === 'started' && (
                    <button
                      onClick={() => handleComplete(stats.activeJob._id)}
                      disabled={actionLoading === stats.activeJob._id}
                      className="bg-green-400 hover:bg-green-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition disabled:opacity-60"
                    >
                      {actionLoading === stats.activeJob._id ? 'Completing...' : 'Mark Complete'}
                    </button>
                  )}
                  <a
                    href={`tel:${stats.activeJob.customer?.phone}`}
                    className="flex items-center justify-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-5 py-2.5 rounded-xl text-sm transition"
                  >
                    <HiOutlinePhone size={16} />
                    Call
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Radius Modal */}
        {showRadiusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 max-w-full mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MdLocationOn size={20} className="text-blue-600" />
                Set Service Radius
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Choose the maximum distance you're willing to travel for service requests
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Radius: {serviceRadius} km
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={serviceRadius}
                    onChange={(e) => setServiceRadius(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 km</span>
                    <span>20 km</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateRadius}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition"
                >
                  Update Radius
                </button>
                <button
                  onClick={() => setShowRadiusModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 rounded-xl text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ElectricianDashboard