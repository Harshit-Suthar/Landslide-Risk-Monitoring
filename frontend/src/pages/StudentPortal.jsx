import React from 'react';
import { BookOpen, Mountain, Layers, Award, ExternalLink } from 'lucide-react';
import LandslideChart from '../components/charts/LandslideChart';

export default function StudentPortal() {
  const learningModules = [
    {
      title: 'Geotechnical Slope Mechanics',
      description: 'Understanding Mohr-Coulomb failure criteria, pore-water pressure, and shear strength in North Eastern geological terrains.',
      level: 'Undergraduate',
      duration: '4 Hours',
    },
    {
      title: 'Satellite Remote Sensing & InSAR',
      description: 'Sentinel-1 synthetic aperture radar interferometry for millimeter-scale surface displacement detection.',
      level: 'Graduate',
      duration: '6 Hours',
    },
    {
      title: 'Monsoon Hydrology & Rainfall Thresholds',
      description: 'Empirical rainfall intensity-duration (I-D) thresholds formulated specifically for Himalayan and Indo-Burma ranges.',
      level: 'Research',
      duration: '5 Hours',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-7 h-7 text-amber-500" />
          Geoscience & Landslide Research Repository
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Curated case studies, geotechnical data, and historical records for students and geoscientists
        </p>
      </div>

      {/* Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {learningModules.map((mod, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                {mod.level}
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-2">
                {mod.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {mod.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{mod.duration}</span>
              <span className="font-semibold text-amber-600 hover:text-amber-700 cursor-pointer flex items-center gap-1">
                Explore Syllabus &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Landslide Analysis */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <LandslideChart />
      </div>
    </div>
  );
}
