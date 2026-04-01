import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Sidebar from './components/Sidebar'
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
}

const Electricians = () => {
  const [electricians, setElectricians] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const { accessToken } = useSelector((state) => state.auth)

  const fetchElectricians = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 10 })
      if (statusFilter) params.append('status', statusFilter)

      const res = await axios.get(
        `http://localhost:5000/api/admin/electricians?${params}`,
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      )
      setElectricians(res.data.electricians)
      setPagination(res.data.pagination)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchElectricians() }, [page, statusFilter])

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/electricians/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      )
      fetchElectricians()
    } catch (err) {
      console.log(err)
    }
  }

  const handleReject = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/electricians/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      )
      fetchElectricians()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Electricians</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination?.total || 0} total electricians</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {['', 'pending', 'approved', 'rejected'].map((status) => (
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
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Phone</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Joined</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {electricians.map((e) => (
                  <tr key={e._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {e.name?.[0]}
                        </div>
                        <p className="text-sm font-medium text-gray-800">{e.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{e.email}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{e.phone || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[e.approvalStatus]}`}>
                        {e.approvalStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {new Date(e.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {e.approvalStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(e._id)}
                              className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(e._id)}
                              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {e.approvalStatus === 'approved' && (
                          <button
                            onClick={() => handleReject(e._id)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 text-xs px-3 py-1.5 rounded-lg transition"
                          >
                            Revoke
                          </button>
                        )}
                        {e.approvalStatus === 'rejected' && (
                          <button
                            onClick={() => handleApprove(e._id)}
                            className="bg-green-100 hover:bg-green-200 text-green-600 text-xs px-3 py-1.5 rounded-lg transition"
                          >
                            Re-approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {electricians.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-sm">No electricians found</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
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

export default Electricians