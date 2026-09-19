import React from 'react';
import { AlertTriangle, Clock, MapPin, ExternalLink } from 'lucide-react';
import RiskLevelBadge from './RiskLevelBadge';

export default function AlertTable({ alerts = [] }) {
  const defaultAlerts = [
    {
      id: 'alt-1',
      location: 'Durtlang Hills Sector 4',
      district: 'Aizawl',
      risk: 'Critical',
      time: '45m ago',
      details: 'Vertical rock fissure expansion exceeding 5mm/hr rate.',
    },
    {
      id: 'alt-2',
      location: 'Nongthymmai Ridge',
      district: 'Shillong',
      risk: 'Critical',
      time: '2h ago',
      details: 'Sub-surface aquifer pressure spike detected by piezometer.',
    },
    {
      id: 'alt-3',
      location: 'NH-29 Kohima By-Pass',
      district: 'Kohima',
      risk: 'High',
      time: '5h ago',
      details: 'Roadbed subsidence 15cm along heavy transport lane.',
    },
    {
      id: 'alt-4',
      location: 'Tathangchen Ward',
      district: 'Gangtok',
      risk: 'High',
      time: '4h ago',
      details: 'Unlined drainage discharge saturating upper terrace.',
    },
  ];

  const items = alerts.length > 0 ? alerts : defaultAlerts;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <h3 className="font-bold text-slate-900 text-sm">Active Severe Alerts</h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">Auto-refreshes every 5 mins</span>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.id} className="p-4 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-slate-900">{item.location}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {item.district}
                </span>
                <RiskLevelBadge level={item.risk} size="sm" />
              </div>
              <p className="text-xs text-slate-600">{item.details}</p>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-500 flex-shrink-0">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
