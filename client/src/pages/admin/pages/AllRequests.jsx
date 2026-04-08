import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { setAllRequests, setToast } from "../../../store/adminSlice"
import Spinner from "../../../components/Spinner"
import {
  MdSearch, MdFilterList, MdListAlt,
  MdPending, MdCheckCircle, MdCancel,
  MdElectricBolt, MdPerson
} from "react-icons/md"

const STATUSES = ["all", "pending", "accepted", "started", "completed", "cancelled"]

const statusConfig = {
  pending:   { color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",  icon: <MdPending size={12} /> },
  accepted:  { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",          icon: <MdCheckCircle size={12} /> },
  started:   { color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",  icon: <MdElectricBolt size={12} /> },
  completed: { color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",      icon: <MdCheckCircle size={12} /> },
  cancelled: { color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",             icon: <MdCancel size={12} /> },
}

export default function AllRequests() {
  const dispatch = useDispatch()
  const { allRequests, requestsMeta } = useSelector(s => s.admin)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("all")
  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState(null) // row expand for details

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400)
    return () => clearTimeout(t)
  }, [search])

  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (status !== "all") params.append("status", status)
        if (debounced) params.append("search", debounced)
        params.append("page", page)

        const { data } = await axios.get(
          `http://localhost:5000/api/admin/requests?${params}`,
          { withCredentials: true }
        )
        dispatch(setAllRequests({ requests: data.requests, meta: data.meta }))
      } catch {
        dispatch(setToast({ message: "Requests load nahi hue", type: "error" }))
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [status, debounced, page])

  // Reset page on filter change
  useEffect(() => { setPage(1) }, [status, debounced])

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          All Requests
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Total {requestsMeta.total} requests
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        {/* Search */}
        <div className="relative">
          <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Category ya customer name se search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm
              bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              text-gray-800 dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Status chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <MdFilterList size={18} className="text-gray-400" />
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all
                ${status === s
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-yellow-400"
                }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm
        border border-gray-100 dark:border-gray-700 overflow-hidden">

        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner /></div>
        ) : allRequests.length === 0 ? (
          <div className="text-center py-12">
            <MdListAlt size={40} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Koi request nahi mili</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b
                  border-gray-100 dark:border-gray-700">
                  {["Category", "Customer", "Electrician", "Amount", "Status", "Date", ""].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold
                      text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {allRequests.map(r => (
                  <>
                    <tr
                      key={r._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                      onClick={() => setExpanded(expanded === r._id ? null : r._id)}
                    >
                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-800 dark:text-white capitalize">
                          {r.category}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center
                            justify-center text-white font-bold text-xs shrink-0">
                            {r.customer?.name?.[0]?.toUpperCase() || "?"}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                            {r.customer?.name || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Electrician */}
                      <td className="px-5 py-3.5">
                        {r.electrician ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center
                              justify-center text-gray-900 font-bold text-xs shrink-0">
                              {r.electrician?.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                              {r.electrician?.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Not assigned</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 font-medium">
                        {r.totalAmount > 0
                          ? `₹${r.totalAmount.toLocaleString("en-IN")}`
                          : "—"
                        }
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1
                          rounded-full text-xs font-medium capitalize
                          ${statusConfig[r.status]?.color}`}>
                          {statusConfig[r.status]?.icon}
                          {r.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(r.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </td>

                      {/* Expand toggle */}
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-gray-400 text-xs">
                          {expanded === r._id ? "▲" : "▼"}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {expanded === r._id && (
                      <tr key={`${r._id}-detail`}
                        className="bg-gray-50 dark:bg-gray-900/40">
                        <td colSpan={7} className="px-5 py-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">

                            <div>
                              <p className="text-xs text-gray-400 mb-1">Description</p>
                              <p className="text-gray-700 dark:text-gray-300">
                                {r.description || "—"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400 mb-1">Address</p>
                              <p className="text-gray-700 dark:text-gray-300">
                                {r.address?.street
                                  ? `${r.address.street}, ${r.address.city}, ${r.address.state} - ${r.address.pincode}`
                                  : "—"
                                }
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400 mb-1">Payment</p>
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium
                                ${r.paymentStatus === "paid"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                                  : "bg-orange-100 dark:bg-orange-900/30 text-orange-500"
                                }`}>
                                {r.paymentStatus}
                              </span>
                            </div>

                            {r.startTime && (
                              <div>
                                <p className="text-xs text-gray-400 mb-1">Start Time</p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {new Date(r.startTime).toLocaleString("en-IN")}
                                </p>
                              </div>
                            )}

                            {r.endTime && (
                              <div>
                                <p className="text-xs text-gray-400 mb-1">End Time</p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {new Date(r.endTime).toLocaleString("en-IN")}
                                </p>
                              </div>
                            )}

                            {r.hourlyRate > 0 && (
                              <div>
                                <p className="text-xs text-gray-400 mb-1">Hourly Rate</p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  ₹{r.hourlyRate}/hr
                                </p>
                              </div>
                            )}

                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {requestsMeta.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg text-sm bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400
              hover:border-yellow-400 disabled:opacity-40 transition-all"
          >
            ← Prev
          </button>

          {Array.from({ length: requestsMeta.pages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all
                ${page === p
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-yellow-400"
                }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(requestsMeta.pages, p + 1))}
            disabled={page === requestsMeta.pages}
            className="px-4 py-2 rounded-lg text-sm bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400
              hover:border-yellow-400 disabled:opacity-40 transition-all"
          >
            Next →
          </button>
        </div>
      )}

    </div>
  )
}