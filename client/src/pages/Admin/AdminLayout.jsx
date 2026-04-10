import { useState } from "react";
import { Outlet, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import ManageUsers from "./ManageUsers";
import ManageElectricians from "./ManageElectricians";
import ManageRequests from "./ManageRequests";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white shadow-md border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/electricians" element={<ManageElectricians />} />
            <Route path="/admin/requests" element={<ManageRequests />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
