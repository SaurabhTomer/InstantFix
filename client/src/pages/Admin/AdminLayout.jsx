import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import ManageUsers from "./ManageUsers";
import ManageElectricians from "./ManageElectricians";
import ManageRequests from "./ManageRequests";
import UserDetails from "./UserDetails";
import ElectricianDetails from "./ElectricianDetails";
import RequestDetails from "./RequestDetails";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Welcome, <span className="font-medium text-gray-900">{user?.name || 'Admin'}</span>
            </span>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-purple-700">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="users/:userId" element={<UserDetails />} />
            <Route path="electricians" element={<ManageElectricians />} />
            <Route path="electricians/:electricianId" element={<ElectricianDetails />} />
            <Route path="requests" element={<ManageRequests />} />
            <Route path="requests/:requestId" element={<RequestDetails />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}