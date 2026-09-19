import React from 'react';
import { Edit2, Trash2, Mountain, MapPin, Calendar, Compass } from 'lucide-react';
import RiskLevelBadge from './RiskLevelBadge';

export default function LocationTable({
  locations = [],
  onEdit,
  onDelete,
  isLoading = false,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (!isLoading && locations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <Mountain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-800">No locations found</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No landslide monitoring points match the selected filters. Try broadening your criteria or adding a new location.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4">Location Name</th>
              <th className="px-6 py-4">District</th>
              <th className="px-6 py-4">Coordinates (Lat / Long)</th>
              <th className="px-6 py-4">Risk Level</th>
              <th className="px-6 py-4">Last Reported</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {locations.map((loc) => (
              <tr key={loc.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{loc.name}</div>
                  {loc.description && (
                    <div className="text-xs text-slate-500 truncate max-w-xs">
                      {loc.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{loc.district}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1 text-xs font-mono text-slate-600">
                    <Compass className="w-3.5 h-3.5 text-slate-400" />
                    <span>{Number(loc.latitude).toFixed(4)}°N, {Number(loc.longitude).toFixed(4)}°E</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <RiskLevelBadge level={loc.risk_level} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(loc.last_reported)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      loc.status === 'Monitored'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {loc.status || 'Monitored'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(loc)}
                      className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      title="Edit Location"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(loc)}
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Location"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
