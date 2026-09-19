import React from 'react';

export default function AdminStatCard({
  title,
  value,
  color = 'blue', // 'red' | 'orange' | 'blue' | 'green'
  icon: Icon,
  trend,
  subtitle,
}) {
  const colorThemes = {
    red: {
      bg: 'bg-red-50/70',
      border: 'border-red-100',
      iconBg: 'bg-red-500',
      iconText: 'text-white',
      valueText: 'text-red-700',
      shadow: 'shadow-red-500/10',
    },
    orange: {
      bg: 'bg-orange-50/70',
      border: 'border-orange-100',
      iconBg: 'bg-orange-500',
      iconText: 'text-white',
      valueText: 'text-orange-700',
      shadow: 'shadow-orange-500/10',
    },
    blue: {
      bg: 'bg-sky-50/70',
      border: 'border-sky-100',
      iconBg: 'bg-sky-600',
      iconText: 'text-white',
      valueText: 'text-sky-800',
      shadow: 'shadow-sky-500/10',
    },
    green: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-600',
      iconText: 'text-white',
      valueText: 'text-emerald-800',
      shadow: 'shadow-emerald-500/10',
    },
  };

  const theme = colorThemes[color] || colorThemes.blue;

  return (
    <div
      className={`bg-white rounded-2xl border ${theme.border} p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className={`text-3xl font-extrabold tracking-tight ${theme.valueText}`}>
              {value}
            </span>
            {trend && (
              <span className="text-xs font-semibold text-slate-500">
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`w-12 h-12 rounded-2xl ${theme.iconBg} ${theme.iconText} flex items-center justify-center shadow-lg ${theme.shadow} flex-shrink-0`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className={`h-1 w-full absolute bottom-0 left-0 ${theme.bg}`} />
    </div>
  );
}
