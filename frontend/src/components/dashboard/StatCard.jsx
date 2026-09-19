import React from 'react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'amber',
  subtitle,
}) {
  const colors = {
    red: 'bg-red-50 text-red-600 border-red-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    blue: 'bg-sky-50 text-sky-600 border-sky-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors[color] || colors.amber}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs font-medium text-slate-500">
          {trend}
        </div>
      )}
    </div>
  );
}
