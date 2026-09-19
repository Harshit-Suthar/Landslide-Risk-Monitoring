import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  AlertTriangle,
  Map as MapIcon,
  FileText,
  CloudRain,
  ShieldAlert,
  ArrowRight,
  Clock,
  MapPin,
  X,
  Bell,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function CitizenHome() {
  const context = useOutletContext() || {};
  const district = context.district || 'Shillong';
  const citizenName = context.citizenName || 'Citizen';

  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  // Weather-linked risk forecasts per district (static mock data with severity)
  const weatherForecasts = {
    Shillong: {
      level: 'Moderate',
      color: 'amber',
      text: 'Moderate landslide probability active in East Khasi Hills (Shillong) due to 78mm cumulative rainfall recorded over 24 hours. Saturated slope conditions near Shillong Peak and Nongthymmai.',
    },
    Guwahati: {
      level: 'Low',
      color: 'emerald',
      text: 'Low risk conditions prevailing across Kamakhya & Noonmati hill tracts. Light showers forecasted over the next 48 hours.',
    },
    Aizawl: {
      level: 'Severe',
      color: 'red',
      text: 'High hazard alert for Durtlang ridge sector in Aizawl. Continuous downpours exceeding 110mm threshold. Residents along unstable escarpments advised to observe fissure movement.',
    },
    Kohima: {
      level: 'Moderate',
      color: 'orange',
      text: 'Active subsidence warning along NH-29 Kohima corridor. Heavy morning fog and groundwater saturation along cut slopes.',
    },
    Itanagar: {
      level: 'Moderate',
      color: 'amber',
      text: 'Moderate slope movement warning near Banderdewa highway cuts. Intermittent heavy rainfall expected this afternoon.',
    },
    Gangtok: {
      level: 'Moderate',
      color: 'orange',
      text: 'Heightened pore water pressure observed along Tathangchen slopes. Debris flow alerts active on high-altitude state roads.',
    },
    Imphal: {
      level: 'Low',
      color: 'emerald',
      text: 'Normal geological stability recorded in Imphal West foothills. Riverbanks monitored for minor toe erosion.',
    },
    Agartala: {
      level: 'Low',
      color: 'emerald',
      text: 'Low geological hazard level in Baramura ranges. Embankment structures stable.',
    },
  };

  const currentForecast = weatherForecasts[district] || weatherForecasts['Shillong'];

  // 3-4 Recent Alerts relevant to citizen's district / region
  const recentAlerts = [
    {
      id: 'alt-1',
      title: 'Active Debris Displacement near NH-29 Bypass',
      location: `${district === 'Kohima' ? 'Kohima Sector 3' : 'Upper Shillong Bypass'}`,
      district: district,
      riskLevel: 'Severe',
      badgeClass: 'bg-red-100 text-red-700 border-red-200',
      timestamp: '25 mins ago',
      details: 'Rock fragments and earth detachment observed onto the outer carriage line. Road authorities dispatched.',
    },
    {
      id: 'alt-2',
      title: 'Soil Fissure Expansion Warning',
      location: `${district} Valley Slope #4`,
      district: district,
      riskLevel: 'Moderate',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      timestamp: '2 hours ago',
      details: 'Fresh surface tension cracks extending 4 meters. Geotechnical sensors show 8mm displacement.',
    },
    {
      id: 'alt-3',
      title: 'Culvert Overflow & Mud Runoff',
      location: `Lower ${district} Arterial Link`,
      district: district,
      riskLevel: 'Moderate',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
      timestamp: '5 hours ago',
      details: 'Drainage blockage causing minor mud spillover onto walkway. Field teams clearing culvert.',
    },
    {
      id: 'alt-4',
      title: 'Geotechnical Slope Stabilization Cleared',
      location: `${district} Eastern Escarpment`,
      district: district,
      riskLevel: 'Low',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      timestamp: '1 day ago',
      details: 'Post-rain inspection completed. Retaining mesh and drainage pipes operating normally.',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Weather-Linked Risk Forecast Dismissible Banner */}
      {!isBannerDismissed && (
        <div
          className={`relative rounded-2xl p-4 border flex items-start space-x-3 shadow-xs transition ${
            currentForecast.level === 'Severe'
              ? 'bg-red-50/90 border-red-200 text-red-900'
              : currentForecast.level === 'High' || currentForecast.color === 'orange'
              ? 'bg-orange-50/90 border-orange-200 text-orange-900'
              : currentForecast.level === 'Moderate'
              ? 'bg-amber-50/90 border-amber-200 text-amber-900'
              : 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="p-2 rounded-xl bg-white/80 shadow-xs flex-shrink-0 mt-0.5">
            <CloudRain
              className={`w-5 h-5 ${
                currentForecast.color === 'red'
                  ? 'text-red-600'
                  : currentForecast.color === 'orange'
                  ? 'text-orange-600'
                  : currentForecast.color === 'amber'
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            />
          </div>

          <div className="flex-1 pr-6">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-bold text-xs uppercase tracking-wider">
                Weather-Linked Risk Advisory • {district}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  currentForecast.color === 'red'
                    ? 'bg-red-200 text-red-900 border-red-300'
                    : currentForecast.color === 'orange'
                    ? 'bg-orange-200 text-orange-900 border-orange-300'
                    : currentForecast.color === 'amber'
                    ? 'bg-amber-200 text-amber-900 border-amber-300'
                    : 'bg-emerald-200 text-emerald-900 border-emerald-300'
                }`}
              >
                {currentForecast.level} Risk
              </span>
            </div>
            <p className="text-xs leading-relaxed font-medium opacity-95">
              {currentForecast.text}
            </p>
          </div>

          <button
            onClick={() => setIsBannerDismissed(true)}
            className="absolute top-3.5 right-3.5 p-1 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 transition"
            title="Dismiss advisory"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-200/60 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-100 p-6 sm:p-10 shadow-xs">
        {/* Subtle Mountain Topography Background Pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 40%, rgba(245, 158, 11, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(234, 88, 12, 0.3) 0%, transparent 60%)`,
          }}
        />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/90 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold text-amber-900 shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>North Eastern Region Early Warning System</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Stay Safe. Stay Informed.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Welcome, <strong>{citizenName}</strong>. Empowering citizens and communities across the 8 North Eastern States with real-time landslide risk intelligence, eyewitness reporting, and proactive hazard mitigation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/citizen/report"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-md shadow-amber-500/20"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report an Incident</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/citizen/map"
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 transition shadow-xs"
            >
              <MapIcon className="w-4 h-4 text-amber-600" />
              <span>Explore Risk Map</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Quick-Access Cards */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Report Incident */}
          <Link
            to="/citizen/report"
            className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-amber-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-700 transition">
                Report an Incident
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Spotted a rockfall, slope crack, or blocked highway? Submit photo/video evidence with automatic GPS detection.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-amber-600 group-hover:text-amber-700">
              <span>File a New Report</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: View Risk Map */}
          <Link
            to="/citizen/map"
            className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-amber-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-slate-950 transition">
                <MapIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-orange-700 transition">
                View Risk Map
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Browse monitored geological formations and real-time hazard severity zones across your district.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-orange-600 group-hover:text-orange-700">
              <span>Open Interactive Map</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: My Reports */}
          <Link
            to="/citizen/my-reports"
            className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-amber-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-sky-700 transition">
                My Reports History
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Check verification status, officer notes, and review all previous eyewitness reports submitted by your account.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-sky-600 group-hover:text-sky-700">
              <span>View Submitted Reports</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Alerts Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">
                Recent Alerts & Advisories
              </h2>
              <p className="text-xs text-slate-500">
                Ground monitoring updates relevant to {district} and adjacent hill corridors
              </p>
            </div>
          </div>

          <Link
            to="/citizen/map"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
          >
            <span>Inspect map markers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${alert.badgeClass}`}
                  >
                    {alert.riskLevel}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {alert.title}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {alert.details}
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/60">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-amber-500" />
                  <span>{alert.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{alert.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
