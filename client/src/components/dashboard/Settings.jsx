import React, { useState } from 'react';
import { FaBell, FaLock, FaPalette, FaGlobe, FaQuestionCircle, FaTrash, FaDownload, FaShieldAlt } from 'react-icons/fa';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    serviceUpdates: true,
    promotions: false
  });

  const [preferences, setPreferences] = useState({
    language: 'english',
    theme: 'light',
    timezone: 'UTC-5',
    currency: 'USD'
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
            <nav className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-yellow-50 text-yellow-700 rounded-xl font-medium">
                <FaBell className="w-5 h-5" />
                Notifications
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">
                <FaPalette className="w-5 h-5" />
                Preferences
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">
                <FaLock className="w-5 h-5" />
                Privacy & Security
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">
                <FaGlobe className="w-5 h-5" />
                Language & Region
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">
                <FaQuestionCircle className="w-5 h-5" />
                Help & Support
              </button>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notification Settings */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaBell className="w-5 h-5 text-yellow-500" />
              Notification Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h4 className="font-semibold text-gray-800">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive updates about your service requests via email</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('emailNotifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.emailNotifications ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h4 className="font-semibold text-gray-800">SMS Notifications</h4>
                  <p className="text-sm text-gray-600">Get text messages for important updates</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('smsNotifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.smsNotifications ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h4 className="font-semibold text-gray-800">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('pushNotifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.pushNotifications ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h4 className="font-semibold text-gray-800">Service Updates</h4>
                  <p className="text-sm text-gray-600">Updates about your ongoing service requests</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('serviceUpdates')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.serviceUpdates ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.serviceUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h4 className="font-semibold text-gray-800">Marketing Emails</h4>
                  <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('marketingEmails')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.marketingEmails ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaPalette className="w-5 h-5 text-blue-500" />
              Preferences
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Theme</label>
                <select
                  value={preferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Timezone</label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                  <option value="UTC-6">Central Time (UTC-6)</option>
                  <option value="UTC-7">Mountain Time (UTC-7)</option>
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Currency</label>
                <select
                  value={preferences.currency}
                  onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaShieldAlt className="w-5 h-5 text-green-500" />
              Privacy & Security
            </h3>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FaLock className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">Change Password</h4>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FaDownload className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">Download My Data</h4>
                    <p className="text-sm text-gray-600">Get a copy of your personal data</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FaTrash className="w-5 h-5 text-red-600" />
                  <div className="text-left">
                    <h4 className="font-semibold text-red-600">Delete Account</h4>
                    <p className="text-sm text-gray-600">Permanently delete your account</p>
                  </div>
                </div>
                <span className="text-red-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
