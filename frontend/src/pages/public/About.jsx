import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Cpu,
  Radio,
  Mountain,
  CloudRain,
  Database,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  Layers,
  Award,
  ExternalLink,
} from 'lucide-react';

export default function About() {
  const SENSORS = [
    {
      name: 'Vibrating Wire Piezometers',
      purpose: 'Pore-Water Pressure',
      desc: 'Embedded 5 to 25 meters sub-surface to track underground water head accumulation that lubricates slip planes.',
    },
    {
      name: 'Borehole Inclinometers',
      purpose: 'Lateral Shear Displacement',
      desc: 'High-precision biaxial probes detecting millimeter-scale horizontal ground deformation inside fragile slopes.',
    },
    {
      name: 'IMD Doppler Weather Radar',
      purpose: 'Precipitation Telemetry',
      desc: 'Continuous precipitation tracking across Shillong, Guwahati, and Agartala radar installations calibrated in real-time.',
    },
    {
      name: 'Sentinel-1 SAR Satellite Interferometry',
      purpose: 'Regional Surface Subsidence',
      desc: 'Synthetic Aperture Radar satellite passes providing millimetric vertical terrain deformation maps.',
    },
  ];

  const PARTNERS = [
    { name: 'Geological Survey of India (GSI)', role: 'Baseline Geological Formations & Landslide Inventory' },
    { name: 'India Meteorological Department (IMD)', role: 'Doppler Radar Precipitation & Antecedent Telemetry' },
    { name: 'North Eastern Space Applications Centre (NESAC)', role: 'Satellite InSAR Imagery & GIS Infrastructure' },
    { name: 'National Disaster Management Authority (NDMA)', role: 'Emergency Protocols & Early Warning Standards' },
    { name: 'North Eastern Council (NEC)', role: 'Inter-State Regional Coordination & Funding' },
    { name: 'State Disaster Management Authorities (SDMAs)', role: 'District Emergency Operations Center Dispatch' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-12 overflow-hidden border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>North Eastern Region Disaster Warning Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            About the NER Landslide Early Warning System
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            The Landslide Early Warning & Risk Monitoring System is an integrated hydro-geological warning platform designed to safeguard communities and strategic transit corridors across the 8 North Eastern States of India.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/map"
              className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-xs"
            >
              <span>Explore Sensor GIS Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/citizen/home"
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition"
            >
              <span>Citizen Science Portal</span>
            </Link>
          </div>
        </div>

        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 3 Core Pillars of System Architecture */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900">How the Technology Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">1. Real-time Telemetry Acquisition</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ground sensors and Doppler weather radars stream rainfall accumulation, ground pore-water saturation, and borehole inclinometer displacement every 15 minutes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">2. Explainable AI Risk Inference</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              An intelligent geotechnical scoring engine combines 24h precipitation (35%), ground moisture (25%), terrain steepness (25%), and historical landslide catalogs (15%) to classify hazard tiers.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">3. Rapid Citizen & EOC Dispatch</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When a critical trigger is confirmed, automated emergency SMS, push notifications, and State EOC bulletins are dispatched within 60 seconds to prompt timely evacuation.
            </p>
          </div>
        </div>
      </div>

      {/* Sensor Technologies Details */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-500" />
            <span>Multi-Spectral Sensor Network</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Combining subsurface geotechnical instruments with spaceborne remote sensing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SENSORS.map((s, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                <span className="text-2xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  {s.purpose}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Collaborators */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Institutional Collaborators & Supporting Bodies</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Inter-agency collaboration enabling multi-state disaster resilience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PARTNERS.map((p, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-1">
              <h4 className="font-bold text-slate-900 text-xs">{p.name}</h4>
              <p className="text-2xs text-slate-500 leading-relaxed">{p.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
