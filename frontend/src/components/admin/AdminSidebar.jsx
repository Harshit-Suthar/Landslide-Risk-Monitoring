import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Mountain,
  ShieldAlert,
  BrainCircuit,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/landslides', label: 'Landslides & Locations', icon: Mountain },
  { path: '/admin/risk-management', label: 'Risk Management', icon: ShieldAlert },
  { path: '/admin/ai-model', label: 'AI Model', icon: BrainCircuit },
  { path: '/admin/reports', label: 'Reports', icon: FileText },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ isCollapsed, onToggleCollapse }) {
  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 text-slate-200 transition-all duration-300 flex flex-col z-30 flex-shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
            <Activity className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-200 truncate">
              <span className="font-bold text-white text-base tracking-tight block truncate">
                NER Landslide
              </span>
              <span className="text-[11px] text-amber-400 font-medium block truncate">
                Early Warning Admin
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className={`text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 mb-2 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? '•••' : 'Main Menu'}
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                } ${isCollapsed ? 'justify-center' : 'space-x-3'}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* NER Region Status Indicator Footer */}
      <div className="p-3 border-t border-slate-800">
        <div
          className={`rounded-xl bg-slate-800/60 border border-slate-700/60 p-2.5 ${
            isCollapsed ? 'text-center' : ''
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {!isCollapsed && (
              <span className="text-xs font-medium text-slate-300 truncate">
                NER Network: Operational
              </span>
            )}
          </div>
          {!isCollapsed && (
            <p className="text-[10px] text-slate-500 text-center mt-1">
              8 States Connected
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
