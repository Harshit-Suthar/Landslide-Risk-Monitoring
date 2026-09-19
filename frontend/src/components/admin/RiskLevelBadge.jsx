import React from 'react';

export default function RiskLevelBadge({ level = 'Low', size = 'md' }) {
  const normalized = String(level).toLowerCase();

  const styles = {
    critical: 'bg-red-100 text-red-800 border-red-200 ring-red-500/20',
    high: 'bg-orange-100 text-orange-800 border-orange-200 ring-orange-500/20',
    medium: 'bg-amber-100 text-amber-800 border-amber-200 ring-amber-500/20',
    low: 'bg-emerald-100 text-emerald-800 border-emerald-200 ring-emerald-500/20',
    resolved: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
  };

  const dotColors = {
    critical: 'bg-red-500 animate-pulse',
    high: 'bg-orange-500',
    medium: 'bg-amber-500',
    low: 'bg-emerald-500',
    resolved: 'bg-slate-400',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-semibold px-3 py-1.5',
  };

  const currentStyle = styles[normalized] || styles.low;
  const dotColor = dotColors[normalized] || dotColors.low;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ring-1 ${currentStyle} ${sizeClasses[size] || sizeClasses.md}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="capitalize">{level}</span>
    </span>
  );
}
