import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { HiOutlineArrowLeft, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'
import { MdElectricBolt } from 'react-icons/md'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  started: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
}

const RequestHistory = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')

  const { accessToken } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const fetchRequests = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page, limit: 10 })
      if (statusFilter) params.append('status', statusFilter)

      const res = await axios.get(
        `http://localhost:5000/api/requests/my?${params}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true
        }
      )
    //   console.log(res);
      
      setRequests(res.data.requests)
      setPagination(res.data.pagination)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [page, statusFilter])

  const handleCancel = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/requests/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true
        }
      )
      fetchRequests()
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot cancel request')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => navigate('/customer/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-xl transition"
        >
          <HiOutlineArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-800">My Requests</h1>
          <p className="text-xs text-gray-400">
            {pagination?.total || 0} total requests
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">

        {/* Status Filter */}
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

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && requests.length === 0 && (
          <div className="text-center py-16">
            <MdElectricBolt size={48} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No requests found</p>
            <button
              onClick={() => navigate('/customer/booking')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition"
            >
              Book a Service
            </button>
          </div>
        )}

        {/* Requests List */}
        {!loading && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-blue-200 transition"
              >
                {/* Top */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2.5 rounded-xl">
                      <MdElectricBolt size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{req.category}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        #{req._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[req.status]}`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {req.description}
                </p>

                {/* Address */}
                <p className="text-xs text-gray-400 mb-3">
                  📍 {req.address?.street}, {req.address?.city}
                </p>

                {/* Photos */}
                {req.photos?.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {req.photos.slice(0, 3).map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt="request"
                        className="w-12 h-12 object-cover rounded-xl border border-gray-200"
                      />
                    ))}
                    {req.photos.length > 3 && (
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <p className="text-xs text-gray-500">+{req.photos.length - 3}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Electrician */}
                {req.electrician && (
                  <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {req.electrician.name?.[0]}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700">{req.electrician.name}</p>
                      <p className="text-xs text-gray-400">{req.electrician.phone}</p>
                    </div>
                  </div>
                )}

                {/* Bottom */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <p className="text-xs text-gray-400">
                    {new Date(req.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>

                  <div className="flex gap-2">
                    {req.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(req._id)}
                        className="text-xs text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-xl transition"
                      >
                        Cancel
                      </button>
                    )}
                    {req.totalAmount > 0 && (
                      <p className="text-sm font-bold text-blue-600">
                        ₹{req.totalAmount}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPrevPage}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <HiOutlineChevronLeft size={16} />
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-xl text-sm font-medium transition ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
              <HiOutlineChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RequestHistory