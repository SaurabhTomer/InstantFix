import { Routes, Route, Navigate } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"
import AdminTopbar from "./AdminTopbar"
import AdminOverview from "./pages/AdminOverview"
import UsersManagement from "./pages/UsersManagement"
import ElectricianApprovals from "./pages/ElectricianApprovals"
import AllRequests from "./pages/AllRequests"
import AdminStats from "./pages/AdminStats"
import Toast from "../../components/Toast"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />

      {/* Main content — sidebar width offset */}
      <div className="flex-1 flex flex-col ml-64">
        <AdminTopbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview"  element={<AdminOverview />} />
            <Route path="users"     element={<UsersManagement />} />
            <Route path="approvals" element={<ElectricianApprovals />} />
            <Route path="requests"  element={<AllRequests />} />
            <Route path="stats"     element={<AdminStats />} />
          </Routes>
        </main>
      </div>

      <Toast slice="admin" />
    </div>
  )
}