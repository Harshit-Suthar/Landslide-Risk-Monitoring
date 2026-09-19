import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Sliders,
  Save,
  Key,
  Globe,
  Power,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '../../layouts/AdminLayout';

export default function Settings() {
  const { showToast } = useToast();

  // Profile Form State
  const [profile, setProfile] = useState({
    name: 'Dr. Arindam Sarmah',
    email: 'admin@ner-landslide.gov.in',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    pushNotifications: false,
  });

  // System State
  const [system, setSystem] = useState({
    maintenanceMode: false,
    defaultLanguage: 'English',
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    showToast('Profile and security credentials saved successfully.', 'success');
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    showToast('Alert and notification channels updated.', 'success');
  };

  const handleSaveSystem = (e) => {
    e.preventDefault();
    showToast(`System settings updated. Language: ${system.defaultLanguage}`, 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-amber-500" />
          System Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure administrative profiles, regional emergency notification relays, and system localization
        </p>
      </div>

      {/* 1. Profile Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Profile & Security</h3>
            <p className="text-xs text-slate-500">Update administrative contact and security keys</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Official Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
              />
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-bold text-slate-800 block mb-2 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              Change Password (optional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="password"
                placeholder="Current Password"
                value={profile.currentPassword}
                onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="password"
                placeholder="New Password"
                value={profile.newPassword}
                onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={profile.confirmPassword}
                onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-xl text-xs transition shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Notification Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Notification Preferences</h3>
            <p className="text-xs text-slate-500">Manage dispatch channels for Critical and High hazard alerts</p>
          </div>
        </div>

        <form onSubmit={handleSaveNotifications} className="space-y-4">
          <div className="space-y-3">
            {/* Email Alerts */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Email Alerts</span>
                <span className="text-[11px] text-slate-500">
                  Send instant hazard notifications to all registered state emergency officers
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setNotifications({ ...notifications, emailAlerts: !notifications.emailAlerts })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  notifications.emailAlerts ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* SMS Alerts */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-800 block">SMS Flash Alerts</span>
                <span className="text-[11px] text-slate-500">
                  Broadcast high-priority SMS messages to field agents and village headmen
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setNotifications({ ...notifications, smsAlerts: !notifications.smsAlerts })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  notifications.smsAlerts ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.smsAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Browser Push Notifications</span>
                <span className="text-[11px] text-slate-500">
                  Show real-time desktop popups when rainfall exceeds warning threshold
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    pushNotifications: !notifications.pushNotifications,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  notifications.pushNotifications ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-xl text-xs transition shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. System Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">System Configuration</h3>
            <p className="text-xs text-slate-500">Control maintenance modes and regional language localization</p>
          </div>
        </div>

        <form onSubmit={handleSaveSystem} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Maintenance Mode */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                  <Power className="w-3.5 h-3.5 text-red-500" />
                  Maintenance Mode
                </span>
                <span className="text-[11px] text-slate-500">
                  Restrict citizen portals during radar calibration
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSystem({ ...system, maintenanceMode: !system.maintenanceMode })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  system.maintenanceMode ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    system.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Default Language */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-500" />
                  Default Language
                </span>
                <span className="text-[11px] text-slate-500">
                  Regional advisory broadcast language
                </span>
              </div>
              <select
                value={system.defaultLanguage}
                onChange={(e) => setSystem({ ...system, defaultLanguage: e.target.value })}
                className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Assamese">Assamese (অসমীয়া)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-xl text-xs transition shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
