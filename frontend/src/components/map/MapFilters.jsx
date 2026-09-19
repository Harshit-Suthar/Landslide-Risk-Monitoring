import React from 'react';
import { Filter, MapPin } from 'lucide-react';

const DISTRICTS = [
  'All Districts',
  'Guwahati',
  'Shillong',
  'Itanagar',
  'Kohima',
  'Aizawl',
  'Agartala',
  'Imphal',
  'Gangtok',
];

const RISK_LEVELS = [
  { level: 'Critical', color: 'bg-red-500', label: 'Critical' },
  { level: 'High', color: 'bg-orange-500', label: 'High' },
  { level: 'Medium', color: 'bg-amber-500', label: 'Medium' },
  { level: 'Low', color: 'bg-emerald-500', label: 'Low' },
];

export default function MapFilters({
  selectedDistrict,
  onDistrictChange,
  activeRiskLevels,
  onToggleRiskLevel,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
      {/* Risk Level Toggles */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          Filter Risk:
        </span>
        {RISK_LEVELS.map((item) => {
          const isSelected = activeRiskLevels.includes(item.level);
          return (
            <button
              key={item.level}
              onClick={() => onToggleRiskLevel(item.level)}
              className={`inline-flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 opacity-60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* District Dropdown Filter */}
      <div className="flex items-center space-x-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          District:
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-700"
        >
          {DISTRICTS.map((d) => (
            <option key={d} value={d === 'All Districts' ? '' : d}>
              {d}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
