import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export default function RiskSummary({
  data = [
    { level: 'Critical', count: 2, percentage: 25, color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50', border: 'border-red-200' },
    { level: 'High', count: 3, percentage: 37.5, color: 'bg-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-50', border: 'border-orange-200' },
    { level: 'Medium', count: 2, percentage: 25, color: 'bg-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-50', border: 'border-amber-200' },
    { level: 'Low', count: 1, percentage: 12.5, color: 'bg-emerald-500', textColor: 'text-emerald-700', bgLight: 'bg-emerald-50', border: 'border-emerald-200' },
  ],
}) {
  const totalZones = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Regional Risk Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of monitored slope stability zones across North Eastern States
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            Total {totalZones} Zones
          </span>
        </div>

        {/* Stacked Bar Representation */}
        <div className="mt-4 mb-6">
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            {data.map((item) => (
              <div
                key={item.level}
                style={{ width: `${item.percentage}%` }}
                className={`${item.color} h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
                title={`${item.level}: ${item.count} zones (${item.percentage}%)`}
              />
            ))}
          </div>
        </div>

        {/* Individual Bar Columns / Indicators */}
        <div className="space-y-3.5">
          {data.map((item) => (
            <div key={item.level} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-md ${item.color}`} />
                  <span className="font-semibold text-slate-800">{item.level} Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">{item.count} zones</span>
                  <span className="text-slate-400">({item.percentage}%)</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advisory Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-start space-x-2.5 bg-amber-50/50 rounded-xl p-3 border border-amber-100">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          <span className="font-semibold">Precipitation Warning:</span> Continuous monsoon rainfall over Meghalaya and Mizoram is currently driving 62.5% of monitored slopes into High or Critical risk thresholds.
        </p>
      </div>
    </div>
  );
}
