// import { useState } from "react";
// import { Routes, Route } from "react-router-dom";
// import AdminSidebar from "./AdminSidebar";
// import AdminDashboard from "./AdminDashboard";
// import ManageUsers from "./ManageUsers";
// import ManageElectricians from "./ManageElectricians";
// import ManageRequests from "./ManageRequests";

// export default function AdminLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <AdminSidebar 
//         isOpen={sidebarOpen} 
//         onClose={() => setSidebarOpen(false)} 
//       />

//       {/* <div className="flex-1 lg:ml-52"> */}
//       <div className="flex-1 lg:ml-56">
//         <div className="lg:hidden fixed top-4 left-4 z-40">
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-2 rounded-lg bg-white shadow-md border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//         </div>

//         <main className="flex-1">
//           <Routes>
//             {/* Relative paths - /admin/* ke baad ka part */}
//             <Route index element={<AdminDashboard />} />
//             <Route path="dashboard" element={<AdminDashboard />} />
//             <Route path="users" element={<ManageUsers />} />
//             <Route path="electricians" element={<ManageElectricians />} />
//             <Route path="requests" element={<ManageRequests />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import ManageUsers from "./ManageUsers";
import ManageElectricians from "./ManageElectricians";
import ManageRequests from "./ManageRequests";
import { Menu } from "lucide-react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* <div className="flex-1 lg:ml-56 flex flex-col">
       */}
        <div className="flex-1 flex flex-col min-w-0">
            
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:block" /> {/* spacer */}
          
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
            <Route path="electricians" element={<ManageElectricians />} />
            <Route path="requests" element={<ManageRequests />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}