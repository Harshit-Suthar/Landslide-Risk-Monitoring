import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  Map as MapIcon,
  CloudRain,
  Radio,
  BookOpen,
  Info,
  LogIn,
  Menu,
  X,
  PhoneCall,
  User,
  Shield,
} from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Live Risk Map', path: '/map', icon: MapIcon },
    { name: 'Weather Radar', path: '/weather', icon: CloudRain },
    { name: 'Alerts Bulletin', path: '/alerts', icon: Radio, badge: 'Live' },
    { name: 'Safety Guide', path: '/safety', icon: BookOpen },
    { name: 'About System', path: '/about', icon: Info },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top Emergency Advisory Strip */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white text-2xs sm:text-xs py-1.5 px-4 font-semibold border-b border-red-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
            </span>
            <span className="truncate">
              <strong>MONSOON ADVISORY:</strong> Active slope displacement alerts active in Kohima (NH-29) & Aizawl (Durtlang). Heavy rainfall band over Shillong plateau.
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-3 flex-shrink-0 ml-3">
            <Link
              to="/alerts"
              className="text-amber-200 hover:text-white underline font-bold transition"
            >
              View Bulletins &rarr;
            </Link>
            <span className="text-red-300">|</span>
            <span className="flex items-center space-x-1 text-white">
              <PhoneCall className="w-3 h-3 text-amber-300" />
              <span>Helpline: <strong>1070</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Navbar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-black text-base sm:text-lg tracking-tight block leading-tight text-white group-hover:text-amber-400 transition-colors">
                NER Landslide Watch
              </span>
              <span className="text-2xs text-slate-400 block font-normal tracking-wide">
                Early Warning & Geospatial Telemetry
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 relative ${
                    active
                      ? 'bg-slate-800 text-amber-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${active ? 'text-amber-400' : 'text-slate-400'}`} />}
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-3xs font-black bg-red-600 text-white animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Group */}
          <div className="hidden sm:flex items-center space-x-2.5">
            <Link
              to="/citizen/report"
              className="flex items-center space-x-1.5 text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black px-3.5 py-2 rounded-xl transition shadow-xs shadow-amber-500/20"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Incident</span>
            </Link>

            <Link
              to="/login"
              className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold px-3 py-2 rounded-xl border border-slate-700 transition"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Sign In / Console</span>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Link
              to="/citizen/report"
              className="flex items-center space-x-1 text-2xs bg-amber-500 text-slate-950 font-bold px-2.5 py-1.5 rounded-lg"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Report</span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="space-y-1 pt-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    active
                      ? 'bg-slate-800 text-amber-400'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-3xs font-black bg-red-600 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
            <Link
              to="/citizen/home"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-800 text-xs font-bold text-white border border-slate-700"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Citizen Portal</span>
            </Link>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-amber-500 text-xs font-bold text-slate-950"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Officer Console</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
