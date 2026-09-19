import React from 'react';
import {
  AlertTriangle,
  Flame,
  FileCheck2,
  Home,
  MapPin,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import AdminStatCard from '../../components/admin/AdminStatCard';
import RiskSummary from '../../components/dashboard/RiskSummary';
import RecentEvents from '../../components/dashboard/RecentEvents';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            NER Landslide Early Warning — Admin Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time hazard telemetry, slope stability monitoring, and regional crisis dispatch
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/risk-management"
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-xs"
          >
            <span>Open Live Risk Map</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4 Admin Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          title="Active Alerts"
          value="12"
          color="red"
          icon={AlertTriangle}
          trend="+3 critical since 06:00 AM"
          subtitle="Requires immediate emergency action"
        />
        <AdminStatCard
          title="High Risk Zones"
          value="5"
          color="orange"
          icon={Flame}
          trend="2 in Shillong, 2 in Kohima, 1 in Aizawl"
          subtitle="Continuous telemetry streaming"
        />
        <AdminStatCard
          title="Reports Today"
          value="34"
          color="blue"
          icon={FileCheck2}
          trend="21 verified by field officers"
          subtitle="Citizen & automated sensor reports"
        />
        <AdminStatCard
          title="Villages Monitored"
          value="87"
          color="green"
          icon={Home}
          trend="Across 8 North Eastern States"
          subtitle="Coverage expanding this season"
        />
      </div>

      {/* Two-Column Row: RiskSummary (60%) & RecentEvents (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 h-full">
          <RiskSummary />
        </div>
        <div className="lg:col-span-5 h-full">
          <RecentEvents />
        </div>
      </div>

      {/* Placeholder Card: Risk Map (coming in next phase) */}
      <div className="w-full h-[400px] border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-xs">
          <MapPin className="w-8 h-8 text-slate-400 stroke-[1.75]" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          Risk Map (coming in next phase)
        </h3>
        <p className="text-xs text-slate-500 max-w-md mt-1.5 leading-relaxed">
          Interactive GIS overlay with live satellite precipitation, slope displacement radar, and drone survey point clouds is scheduled for release in Phase 2.
        </p>
        <Link
          to="/admin/risk-management"
          className="mt-4 text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl transition border border-amber-200"
        >
          View Current Interactive GIS Map &rarr;
        </Link>
      </div>
    </div>
  );
}
