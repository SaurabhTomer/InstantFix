import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { setUsers, updateUserInList, setToast } from "../../../store/adminSlice"
import Spinner from "../../../components/Spinner"
import ConfirmModal from "../../../components/ConfirmModal"
import {
  MdSearch, MdPerson, MdElectricBolt,
  MdBlock, MdCheckCircle, MdFilterList
} from "react-icons/md"

const ROLES = ["all", "customer", "electrician"]

export default function UsersManagement() {
  const dispatch = useDispatch()
  const { users, usersMeta } = useSelector(s => s.admin)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")
  const [page, setPage] = useState(1)
  const [actionId, setActionId] = useState(null)
  const [modal, setModal] = useState(null) // { id, currentStatus, name }
  const [debounced, setDebounced] = useState("")

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400)
    return () => clearTimeout(t)
  }, [search])

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (role !== "all") params.append("role", role)
        if (debounced) params.append("search", debounced)
        params.append("page", page)

        const { data } = await axios.get(
          `http://localhost:5000/api/admin/users?${params}`,
          { withCredentials: true }
        )
        dispatch(setUsers({ users: data.users, meta: data.meta }))
      } catch {
        dispatch(setToast({ message: "Users load nahi hue", type: "error" }))
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [role, debounced, page])

  // Reset page on filter change
  useEffect(() => { setPage(1) }, [role, debounced])

  const handleToggleStatus = async () => {
    const { id, currentStatus } = modal
    const newStatus = currentStatus === "active" ? "suspended" : "active"
    setModal(null)
    setActionId(id)
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/admin/users/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      )
      dispatch(updateUserInList(data.user))
      dispatch(setToast({
        message: newStatus === "suspended"
          ? "User suspend kar diya 🚫"
          : "User activate kar diya ✅",
        type: newStatus === "suspended" ? "error" : "success"
      }))
    } catch {
      dispatch(setToast({ message: "Action fail hua", type: "error" }))
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Users Management
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Total {usersMeta.total} users
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Name ya email se search karo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm
              bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              text-gray-800 dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Role filter chips */}
        <div className="flex items-center gap-2">
          <MdFilterList size={18} className="text-gray-400" />
          {ROLES.map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all
                ${role === r
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-yellow-400"
                }`}
            >
              {r === "all" ? "All" : r === "customer" ? "Customers" : "Electricians"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm
        border border-gray-100 dark:border-gray-700 overflow-hidden">

        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner /></div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <MdPerson size={40} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Koi user nahi mila</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b
                  border-gray-100 dark:border-gray-700">
                  <th className="text-left px-5 py-3 text-xs font-semibold
                    text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    User
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold
                    text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Role
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold
                    text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Phone
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold
                    text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Joined
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold
                    text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map(u => (
                  <tr key={u._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    {/* User */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center
                          justify-center text-gray-900 font-bold text-sm shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{u.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[160px]">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                        text-xs font-medium
                        ${u.role === "electrician"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        }`}>
                        {u.role === "electrician"
                          ? <MdElectricBolt size={12} />
                          : <MdPerson size={12} />
                        }
                        {u.role}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">
                      {u.phone || "—"}
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1
                        rounded-full text-xs font-medium
                        ${u.status === "suspended"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        }`}>
                        {u.status === "suspended"
                          ? <><MdBlock size={12} /> Suspended</>
                          : <><MdCheckCircle size={12} /> Active</>
                        }
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 text-right">
                      {actionId === u._id ? (
                        <Spinner small />
                      ) : (
                        <button
                          onClick={() => setModal({
                            id: u._id,
                            currentStatus: u.status || "active",
                            name: u.name
                          })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                            ${u.status === "suspended"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200"
                            }`}
                        >
                          {u.status === "suspended" ? "Activate" : "Suspend"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {usersMeta.pages > 1 && (
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

          {Array.from({ length: usersMeta.pages }, (_, i) => i + 1).map(p => (
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
            onClick={() => setPage(p => Math.min(usersMeta.pages, p + 1))}
            disabled={page === usersMeta.pages}
            className="px-4 py-2 rounded-lg text-sm bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400
              hover:border-yellow-400 disabled:opacity-40 transition-all"
          >
            Next →
          </button>
        </div>
      )}

      {/* Confirm Modal */}
      {modal && (
        <ConfirmModal
          title={modal.currentStatus === "suspended" ? "User Activate Karen?" : "User Suspend Karen?"}
          message={
            modal.currentStatus === "suspended"
              ? `${modal.name} ko dobara activate karne par woh platform use kar sakta hai.`
              : `${modal.name} ko suspend karne par woh login nahi kar payega.`
          }
          confirmText={modal.currentStatus === "suspended" ? "Activate" : "Suspend"}
          confirmColor={
            modal.currentStatus === "suspended"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }
          onConfirm={handleToggleStatus}
          onCancel={() => setModal(null)}
        />
      )}

    </div>
  )
}