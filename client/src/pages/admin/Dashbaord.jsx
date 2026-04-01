import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Sidebar from './components/Sidebar'
import { HiOutlineUsers, HiOutlineClipboardList, HiOutlineClock, HiOutlineCheckCircle } from 'react-icons/hi'
import { MdElectricBolt } from 'react-icons/md'

const Dashbaord = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { accessToken } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true
        })
        setStats(res.data.stats)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = stats ? [
    { label: 'Total Customers', value: stats.totalUsers, icon: <HiOutlineUsers size={22} className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Total Electricians', value: stats.totalElectricians, icon: <MdElectricBolt size={22} className="text-yellow-600" />, bg: 'bg-yellow-50' },
    { label: 'Pending Approvals', value: stats.pendingElectricians, icon: <HiOutlineClock size={22} className="text-orange-600" />, bg: 'bg-orange-50' },
    { label: 'Total Requests', value: stats.totalRequests, icon: <HiOutlineClipboardList size={22} className="text-purple-600" />, bg: 'bg-purple-50' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: <HiOutlineClock size={22} className="text-red-600" />, bg: 'bg-red-50' },
    { label: 'Completed Requests', value: stats.completedRequests, icon: <HiOutlineCheckCircle size={22} className="text-green-600" />, bg: 'bg-green-50' },
  ] : []

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {statCards.map((card, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${card.bg} p-3 rounded-xl`}>
                    {card.icon}
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashbaord