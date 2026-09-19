import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GraduationCap, ShieldAlert, ArrowLeft } from 'lucide-react';
import Footer from '../components/common/Footer';

export default function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-slate-900 border-b border-slate-800 text-white h-16 flex items-center px-4 sm:px-8 justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight block">
              NER Geoscience & Disaster Education Portal
            </span>
            <span className="text-[11px] text-slate-400 block font-normal">
              Student & Academic Research View
            </span>
          </div>
        </div>

        <Link
          to="/"
          className="flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
