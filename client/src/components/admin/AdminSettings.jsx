import React, { useState } from 'react';
import { FaCog, FaBell, FaShieldAlt, FaPalette, FaDatabase, FaUsers, FaTools, FaSave, FaTimes, FaPlus, FaEdit, FaTrash, FaCheckSquare, FaSquare, FaKey, FaEnvelope, FaLock, FaUserShield, FaGlobe, FaCreditCard } from 'react-icons/fa';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showModal, setShowModal] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const generalSettings = [
    {
      category: 'Platform Settings',
      settings: [
        { key: 'platformName', label: 'Platform Name', value: 'InstantFix', type: 'text' },
        { key: 'platformVersion', label: 'Version', value: '2.1.0', type: 'text', readonly: true },
        { key: 'maxFileUpload', label: 'Max File Upload Size', value: '10MB', type: 'text' },
        { key: 'sessionTimeout', label: 'Session Timeout (minutes)', value: '30', type: 'number' },
      ]
    },
    {
      category: 'Contact Information',
      settings: [
        { key: 'supportEmail', label: 'Support Email', value: 'support@instantfix.com', type: 'email' },
        { key: 'supportPhone', label: 'Support Phone', value: '+1-800-INSTANT', type: 'text' },
        { key: 'companyAddress', label: 'Company Address', value: '123 Business Ave, Tech City, TC 12345', type: 'text' },
      ]
    }
  ];

  const securitySettings = [
    {
      category: 'Authentication',
      settings: [
        { key: 'passwordMinLength', label: 'Min Password Length', value: '8', type: 'number' },
        { key: 'requireSpecialChars', label: 'Require Special Characters', value: true, type: 'boolean' },
        { key: 'sessionTimeout', label: 'Session Timeout (minutes)', value: '30', type: 'number' },
        { key: 'maxLoginAttempts', label: 'Max Login Attempts', value: '5', type: 'number' },
      ]
    },
    {
      category: 'API Security',
      settings: [
        { key: 'rateLimitEnabled', label: 'Enable Rate Limiting', value: true, type: 'boolean' },
        { key: 'rateLimitRequests', label: 'Rate Limit (requests/min)', value: '100', type: 'number' },
        { key: 'corsEnabled', label: 'Enable CORS', value: true, type: 'boolean' },
        { key: 'apiVersion', label: 'API Version', value: 'v1', type: 'text' },
      ]
    }
  ];

  const notificationSettings = [
    {
      category: 'Email Notifications',
      settings: [
        { key: 'newUserRegistration', label: 'New User Registration', value: true, type: 'boolean' },
        { key: 'electricianApplications', label: 'Electrician Applications', value: true, type: 'boolean' },
        { key: 'serviceRequests', label: 'New Service Requests', value: true, type: 'boolean' },
        { key: 'paymentIssues', label: 'Payment Issues', value: true, type: 'boolean' },
        { key: 'systemErrors', label: 'System Errors', value: true, type: 'boolean' },
      ]
    },
    {
      category: 'SMS Notifications',
      settings: [
        { key: 'emergencyRequests', label: 'Emergency Requests', value: true, type: 'boolean' },
        { key: 'serviceCompletion', label: 'Service Completion', value: false, type: 'boolean' },
        { key: 'paymentReminders', label: 'Payment Reminders', value: false, type: 'boolean' },
      ]
    }
  ];

  const paymentSettings = [
    {
      category: 'Payment Gateway',
      settings: [
        { key: 'razorpayEnabled', label: 'Enable Razorpay', value: true, type: 'boolean' },
        { key: 'razorpayKeyId', label: 'Razorpay Key ID', value: 'rzp_test_...', type: 'password' },
        { key: 'razorpaySecret', label: 'Razorpay Secret', value: '••••••••', type: 'password' },
        { key: 'webhookSecret', label: 'Webhook Secret', value: '••••••••', type: 'password' },
      ]
    },
    {
      category: 'Pricing',
      settings: [
        { key: 'serviceFee', label: 'Service Fee (%)', value: '10', type: 'number' },
        { key: 'minServiceCharge', label: 'Min Service Charge ($)', value: '50', type: 'number' },
        { key: 'emergencyFee', label: 'Emergency Fee (%)', value: '25', type: 'number' },
      ]
    }
  ];

  const systemUsers = [
    { id: 1, name: 'John Admin', email: 'admin@instantfix.com', role: 'Super Admin', status: 'active', lastLogin: '2024-02-15T10:30:00Z' },
    { id: 2, name: 'Sarah Manager', email: 'manager@instantfix.com', role: 'Admin', status: 'active', lastLogin: '2024-02-14T15:45:00Z' },
    { id: 3, name: 'Mike Support', email: 'support@instantfix.com', role: 'Support', status: 'inactive', lastLogin: '2024-02-10T09:20:00Z' },
  ];

  const backupHistory = [
    { id: 1, date: '2024-02-15T02:00:00Z', size: '245 MB', type: 'Full', status: 'completed' },
    { id: 2, date: '2024-02-14T02:00:00Z', size: '238 MB', type: 'Full', status: 'completed' },
    { id: 3, date: '2024-02-13T02:00:00Z', size: '232 MB', type: 'Incremental', status: 'completed' },
  ];

  const renderSettingsContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            {generalSettings.map((section, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.category}</h3>
                <div className="space-y-4">
                  {section.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {setting.label}
                        </label>
                        {setting.type === 'boolean' ? (
                          <button
                            onClick={() => {
                              // Handle boolean toggle
                            }}
                            className="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {setting.value ? (
                              <FaCheckSquare className="w-11 h-6 text-blue-600" />
                            ) : (
                              <FaSquare className="w-11 h-6 text-gray-400" />
                            )}
                          </button>
                        ) : (
                          <input
                            type={setting.type}
                            value={setting.value}
                            readOnly={setting.readonly}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            {securitySettings.map((section, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.category}</h3>
                <div className="space-y-4">
                  {section.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {setting.label}
                        </label>
                        {setting.type === 'boolean' ? (
                          <button
                            onClick={() => {
                              // Handle boolean toggle
                            }}
                            className="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {setting.value ? (
                              <FaCheckSquare className="w-11 h-6 text-blue-600" />
                            ) : (
                              <FaSquare className="w-11 h-6 text-gray-400" />
                            )}
                          </button>
                        ) : (
                          <input
                            type={setting.type}
                            value={setting.value}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            {notificationSettings.map((section, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.category}</h3>
                <div className="space-y-4">
                  {section.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {setting.label}
                        </label>
                        <p className="text-xs text-gray-500">
                          {setting.key === 'newUserRegistration' && 'Get notified when new users register'}
                          {setting.key === 'electricianApplications' && 'Get notified of new electrician applications'}
                          {setting.key === 'serviceRequests' && 'Get notified of new service requests'}
                          {setting.key === 'paymentIssues' && 'Get notified of payment-related issues'}
                          {setting.key === 'systemErrors' && 'Get notified of system errors and exceptions'}
                          {setting.key === 'emergencyRequests' && 'Send SMS for emergency service requests'}
                          {setting.key === 'serviceCompletion' && 'Send SMS when services are completed'}
                          {setting.key === 'paymentReminders' && 'Send SMS payment reminders to customers'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          // Handle boolean toggle
                        }}
                        className="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {setting.value ? (
                          <FaToggleOn className="w-11 h-6 text-blue-600" />
                        ) : (
                          <FaToggleOff className="w-11 h-6 text-gray-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            {paymentSettings.map((section, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.category}</h3>
                <div className="space-y-4">
                  {section.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {setting.label}
                        </label>
                        {setting.type === 'boolean' ? (
                          <button
                            onClick={() => {
                              // Handle boolean toggle
                            }}
                            className="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {setting.value ? (
                              <FaCheckSquare className="w-11 h-6 text-blue-600" />
                            ) : (
                              <FaSquare className="w-11 h-6 text-gray-400" />
                            )}
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type={setting.type}
                              value={setting.value}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {setting.type === 'password' && (
                              <button className="text-blue-600 hover:text-blue-700">
                                <FaKey className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">System Users</h3>
                <button
                  onClick={() => setShowModal('addUser')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <FaPlus />
                  Add User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="pb-3">User</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Last Login</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {systemUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-500">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Backup Management</h3>
                <div className="flex items-center gap-2">
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
                    <FaDatabase />
                    Create Backup
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                    <FaDownload />
                    Download Backup
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Size</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {backupHistory.map((backup) => (
                      <tr key={backup.id} className="hover:bg-gray-50">
                        <td className="py-3 text-sm text-gray-900">
                          {new Date(backup.date).toLocaleString()}
                        </td>
                        <td className="py-3 text-sm text-gray-900">{backup.size}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            backup.type === 'Full' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {backup.type}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            {backup.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <FaDownload className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Add CSS animations */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaCog className="w-6 h-6 text-gray-500" />
            Admin Settings
          </h2>
          <p className="text-gray-600 mt-1">Configure platform settings and preferences</p>
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
          <FaSave />
          Save All Changes
        </button>
      </div>

      <div className="flex gap-6">
        {/* Settings Navigation */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'general' 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaCog className="w-4 h-4" />
                General
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'security' 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaShieldAlt className="w-4 h-4" />
                Security
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'notifications' 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaBell className="w-4 h-4" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'payments' 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaCreditCard className="w-4 h-4" />
                Payments
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'users' 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaUsers className="w-4 h-4" />
                Users
              </button>
              <button
                onClick={() => setActiveTab('backup')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'backup' 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaDatabase className="w-4 h-4" />
                Backup
              </button>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {renderSettingsContent()}
        </div>
      </div>

      {/* Add User Modal */}
      {showModal === 'addUser' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add System User</h3>
              <button
                onClick={() => setShowModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter user name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="admin">Admin</option>
                  <option value="support">Support</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
