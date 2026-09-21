import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  ExternalLink,
  Radio,
  FileText,
  Lock,
  Heart,
  Globe,
} from 'lucide-react';

export default function Footer() {
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
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      {/* Upper Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <ShieldAlert className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <span className="font-black text-base text-white block">NER Landslide Watch</span>
                <span className="text-2xs text-slate-400 block">Early Warning & Geospatial Telemetry</span>
              </div>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              An integrated geological and hydrological disaster management initiative deploying ground sensor telemetry, IMD Doppler precipitation tracking, and explainable AI risk scoring to safeguard the 8 North Eastern States of India.
            </p>

            <div className="flex items-center space-x-3 pt-1">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-3xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>87 Telemetry Stations Online</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-3xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <span>IMD Radar Sync: 15m</span>
              </span>
            </div>
          </div>

          {/* Col 3: Public Portals */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Public Services</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/map" className="hover:text-amber-400 transition">
                  Live GIS Hazard Map
                </Link>
              </li>
              <li>
                <Link to="/weather" className="hover:text-amber-400 transition">
                  Weather & Rainfall Radar
                </Link>
              </li>
              <li>
                <Link to="/alerts" className="hover:text-amber-400 transition">
                  Emergency Warnings Bulletin
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-amber-400 transition">
                  Safety & Evacuation Guide
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition">
                  About Sensors & Tech Stack
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Officers */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Citizen & Officers</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/citizen/report" className="hover:text-amber-400 transition flex items-center space-x-1">
                  <span className="text-amber-500 font-semibold">Report an Incident</span>
                </Link>
              </li>
              <li>
                <Link to="/citizen/home" className="hover:text-amber-400 transition">
                  Community Reporting Desk
                </Link>
              </li>
              <li>
                <Link to="/citizen/signup" className="hover:text-amber-400 transition">
                  Citizen Volunteer Signup
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Officer & Admin Login</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-amber-400 transition">
                  Emergency Control Room
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Partner Bodies */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Partner Agencies</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white transition">Geological Survey of India (GSI)</li>
              <li className="hover:text-white transition">India Meteorological Dept (IMD)</li>
              <li className="hover:text-white transition">North Eastern Space Centre (NESAC)</li>
              <li className="hover:text-white transition">National Disaster Authority (NDMA)</li>
              <li className="hover:text-white transition">North Eastern Council (NEC)</li>
            </ul>
          </div>
        </div>

        {/* State Helplines Strip */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center space-x-2 text-slate-300 font-bold text-xs">
            <PhoneCall className="w-4 h-4 text-amber-500" />
            <span>State Emergency Operations Centers (SEOC) 24x7 Helplines:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {emergencyHelplines.map((h) => (
              <div
                key={h.state}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-2xs space-y-0.5"
              >
                <span className="font-bold text-slate-300 block truncate">{h.state}</span>
                <span className="font-mono text-amber-400 font-semibold block truncate">{h.number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Disclaimer */}
      <div className="bg-slate-950 border-t border-slate-900 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-2xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} NER Landslide Early Warning & Risk Monitoring System. All rights reserved.
          </div>
          <div className="text-center md:text-right">
            Emergency public warning platform for North Eastern Region (NER), India &bull; Toll-Free Emergency: 1070 / 112
          </div>
        </div>
      </div>
    </footer>
  );
}
