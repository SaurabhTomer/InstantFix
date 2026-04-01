import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Sidebar from './components/Sidebar'
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  started: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
}

const Requests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const { accessToken } = useSelector((state) => state.auth)

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 10 })
      if (statusFilter) params.append('status', statusFilter)

      const res = await axios.get(
        `http://localhost:5000/api/admin/requests?${params}`,
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      )
      setRequests(res.data.requests)
      setPagination(res.data.pagination)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRequests() }, [page, statusFilter])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Service Requests</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination?.total || 0} total requests</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['', 'pending', 'accepted', 'started', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1) }}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'
              }`}
            >
              {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Electrician</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-5 py-4 text-sm font-medium text-gray-800">{req.category}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-800">{req.customer?.name || '—'}</p>
                      <p className="text-xs text-gray-400">{req.customer?.phone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-800">{req.electrician?.name || 'Not assigned'}</p>
                      <p className="text-xs text-gray-400">{req.electrician?.phone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[req.status]}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-blue-600">
                      {req.totalAmount > 0 ? `₹${req.totalAmount}` : '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {requests.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-sm">No requests found</p>
              </div>
            )}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPrevPage}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <HiOutlineChevronLeft size={16} /> Previous
            </button>
            <p className="text-sm text-gray-500">Page {page} of {pagination.totalPages}</p>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next <HiOutlineChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Requests