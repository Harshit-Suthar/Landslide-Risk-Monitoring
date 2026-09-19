import React from 'react';
import { ShieldAlert, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <span className="font-semibold text-slate-200">
            NER Landslide Early Warning System
          </span>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
            v0.1.0-alpha
          </span>
        </div>
        <div className="text-xs text-center md:text-right text-slate-500">
          Coordinating with GSI, IMD & Disaster Management Authorities of North Eastern States
        </div>
      </div>
    </footer>
  );
}
