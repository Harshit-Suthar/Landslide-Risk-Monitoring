import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  CloudRain,
  Mountain,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function Home() {
  const emergencyHelplines = [
    { state: 'Assam', number: '1070 / 1079' },
    { state: 'Meghalaya', number: '1070 / 0364-2502188' },
    { state: 'Arunachal Pradesh', number: '1070 / 0360-2291122' },
    { state: 'Nagaland', number: '1070 / 0370-2291120' },
    { state: 'Mizoram', number: '1070 / 0389-2335842' },
    { state: 'Tripura', number: '1070 / 0381-2416045' },
    { state: 'Manipur', number: '1070 / 0385-2443441' },
    { state: 'Sikkim', number: '1070 / 03592-201145' },
  ];

  return (
    <div className="space-y-12 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-slate-900 overflow-hidden text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>North Eastern Region Disaster Warning Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            NER Landslide Early Warning & Risk Monitoring
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Multi-spectral satellite telemetry, ground-based piezometers, and artificial intelligence models monitoring slope stability across 8 North Eastern States.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/citizen/home"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm transition shadow-lg shadow-amber-500/25"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Citizen Portal & Incident Reporting</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
            <Mountain className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Critical Slope Sensing</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Automated monitoring of 87 vulnerable geological formations including Durtlang (Aizawl), Nongthymmai (Shillong), and Kohima By-Pass.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
            <CloudRain className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">IMD Radar Integration</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Real-time Doppler precipitation telemetry calibrated against 72-hour antecedent moisture saturation thresholds.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">State EOC Coordination</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Synchronized emergency dispatch to State Emergency Operations Centers and District Disaster Management Authorities.
          </p>
        </div>
      </div>

      {/* Emergency Contact Helplines */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              State Disaster Management Emergency Helplines
            </h3>
            <p className="text-xs text-slate-500">
              Toll-free emergency numbers for immediate landslide rescue and evacuation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {emergencyHelplines.map((item) => (
            <div
              key={item.state}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition"
            >
              <span className="text-xs font-bold text-slate-800 block">
                {item.state}
              </span>
              <span className="text-xs font-mono font-semibold text-amber-700 mt-0.5 block">
                {item.number}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
