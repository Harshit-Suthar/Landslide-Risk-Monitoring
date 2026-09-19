import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  LogOut,
  User,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Menu,
  Database,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function AdminHeader({ user, onMobileToggle }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const adminName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Administrator';
  const adminEmail = user?.email || 'admin@ner-landslide.gov.in';

  const mockNotifications = [
    {
      id: 1,
      title: 'Critical Alert: Durtlang Hills',
      time: '45m ago',
      type: 'danger',
    },
    {
      id: 2,
      title: 'Rainfall threshold exceeded in Shillong',
      time: '2h ago',
      type: 'warning',
    },
    {
      id: 3,
      title: 'Baramura Hill stabilization verified',
      time: '1d ago',
      type: 'success',
    },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center space-x-3">
        {onMobileToggle && (
          <button
            onClick={onMobileToggle}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            Admin Operations
          </span>
          {isSupabaseConfigured ? (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-600" />
              Supabase Connected
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1" title="Add Supabase credentials to .env to switch from local storage to live backend">
              <Database className="w-3 h-3 text-amber-600" />
              Demo Data Mode
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-800">
                  Notifications
                </span>
                <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition flex items-start space-x-2.5">
                    {n.type === 'danger' && <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />}
                    {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />}
                    {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-sm font-semibold text-slate-900 leading-tight">
              {adminName}
            </div>
            <div className="text-xs text-slate-500 leading-tight truncate max-w-[160px]">
              {adminEmail}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition border border-red-100"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
