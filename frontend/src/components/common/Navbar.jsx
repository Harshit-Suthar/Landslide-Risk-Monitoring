import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, LogIn } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight block leading-tight">
              NER Landslide Watch
            </span>
            <span className="text-xs text-slate-400 block font-normal">
              Early Warning & Response System
            </span>
          </div>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link
            to="/student"
            className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white font-medium px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition"
          >
            <span>Research & Students</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
