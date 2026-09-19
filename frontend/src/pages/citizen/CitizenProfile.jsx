import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  User,
  Phone,
  MapPin,
  Mail,
  Bell,
  Languages,
  Save,
  LogOut,
  CheckCircle2,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { useCitizenToast } from '../../layouts/CitizenLayout';

const DISTRICTS = [
  'Guwahati',
  'Shillong',
  'Itanagar',
  'Kohima',
  'Aizawl',
  'Agartala',
  'Imphal',
  'Gangtok',
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi (हिंदी)' },
  { code: 'as', label: 'Assamese (অসমীয়া)' },
];

export default function CitizenProfile() {
  const context = useOutletContext() || {};
  const user = context.user;
  const userMetadata = context.userMetadata || {};
  const { showToast } = useCitizenToast();
  const navigate = useNavigate();

  // Profile fields
  const [name, setName] = useState(
    userMetadata.full_name || userMetadata.name || user?.email?.split('@')[0] || ''
  );
  const [phone, setPhone] = useState(userMetadata.phone || '');
  const [district, setDistrict] = useState(userMetadata.district || 'Shillong');

  // Notification toggles (UI state)
  const [smsAlerts, setSmsAlerts] = useState(
    userMetadata.preferences?.sms ?? true
  );
  const [emailAlerts, setEmailAlerts] = useState(
    userMetadata.preferences?.email ?? true
  );
  const [pushAlerts, setPushAlerts] = useState(
    userMetadata.preferences?.push ?? true
  );

  // Language preference (UI state)
  const [language, setLanguage] = useState(
    userMetadata.preferences?.language || 'English'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await authService.updateProfile({
        name,
        full_name: name,
        phone,
        district,
        preferences: {
          sms: smsAlerts,
          email: emailAlerts,
          push: pushAlerts,
          language,
        },
      });

      showToast('Profile and notification preferences updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update profile:', err);
      showToast(err.message || 'Unable to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.signOut('citizen');
      showToast('Signed out successfully.', 'info');
      navigate('/citizen/login');
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <User className="w-7 h-7 text-amber-500" />
          Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal details, home district assignment, and emergency broadcast notification alerts.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* User Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md shadow-amber-500/20">
              {name ? name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{name || 'Citizen User'}</h2>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.email || 'citizen@example.com'}
              </span>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 mt-2">
                Citizen Reporter • {district} Sector
              </span>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Personal Information
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98621 00000"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Assigned District
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences: Notifications & Language */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Notification Preferences */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Notification Preferences
              </h3>
            </div>

            <div className="space-y-3">
              {/* SMS Alerts */}
              <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    SMS Warning Bulletins
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Immediate SMS text alerts during red/high landslide alerts in your district
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Email Alerts */}
              <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Email Rainfall & Hazard Digest
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Daily summary of cumulative precipitation and monitored slope changes
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Instant Browser / Push Notifications
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Live toasts when reports you filed are verified or when new alerts trigger
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pushAlerts}
                    onChange={(e) => setPushAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Language Preference Dropdown */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <Languages className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Language Preference
              </h3>
            </div>

            <div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.label} value={lang.label}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Preferred language for regional safety messages, SMS broadcasts, and advisory audio alerts.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Save & Logout */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span>Sign Out</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile & Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
