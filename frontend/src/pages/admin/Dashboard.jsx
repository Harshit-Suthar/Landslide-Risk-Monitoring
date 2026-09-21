import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Flame,
  FileCheck2,
  Home,
  MapPin,
  ArrowUpRight,
  ShieldAlert,
  Layers,
  Filter,
} from 'lucide-react';
import AdminStatCard from '../../components/admin/AdminStatCard';
import RiskSummary from '../../components/dashboard/RiskSummary';
import RecentEvents from '../../components/dashboard/RecentEvents';
import RiskMap from '../../components/map/RiskMap';
import { landslideService } from '../../services/landslideService';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [locations, setLocations] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  useEffect(() => {
    async function loadLocations() {
      try {
        const data = await landslideService.getLocations();
        setLocations(data || []);
      } catch (err) {
        console.error('Failed to load locations in dashboard:', err);
      }
    }
    loadLocations();
  }, []);

  const filteredLocations = locations.filter(
    (l) => selectedDistrict === 'All' || l.district === selectedDistrict
  );

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
            <span>Open Dedicated GIS Console</span>
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

      {/* Live Operational Risk Map Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Live Operational Geospatial Telemetry</span>
            </h3>
            <p className="text-xs text-slate-500">
              Interactive OpenStreetMap tracking {filteredLocations.length} monitored slope installations
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
            >
              <option value="All">All Districts</option>
              <option value="Shillong">Shillong</option>
              <option value="Kohima">Kohima</option>
              <option value="Aizawl">Aizawl</option>
              <option value="Guwahati">Guwahati</option>
              <option value="Itanagar">Itanagar</option>
              <option value="Gangtok">Gangtok</option>
              <option value="Imphal">Imphal</option>
            </select>

            <Link
              to="/admin/risk-management"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
            >
              Full GIS View &rarr;
            </Link>
          </div>
        </div>

        {/* Embedded Map Component */}
        <div className="h-[380px] rounded-2xl overflow-hidden border border-slate-200">
          <RiskMap locations={filteredLocations} height="380px" />
        </div>
      </div>
    </div>
  );
}
