import React from 'react';
import { Clock, MapPin, AlertCircle } from 'lucide-react';
import RiskLevelBadge from '../admin/RiskLevelBadge';

const RECENT_EVENTS = [
  {
    id: 1,
    location: 'Durtlang Hills Sector 4, Aizawl',
    time: '45 mins ago',
    risk: 'Critical',
    summary: 'Accelerated soil displacement (8mm/h) recorded near bypass.',
  },
  {
    id: 2,
    location: 'Nongthymmai Ridge, Shillong',
    time: '2 hours ago',
    risk: 'Critical',
    summary: 'Heavy water seepage reported through weathered granite joints.',
  },
  {
    id: 3,
    location: 'NH-29 Kohima By-Pass Corridor',
    time: '5 hours ago',
    risk: 'High',
    summary: 'Highway shoulder subsidence observed; traffic redirected to single lane.',
  },
  {
    id: 4,
    location: 'Kamakhya Hill Western Flank, Guwahati',
    time: '8 hours ago',
    risk: 'High',
    summary: 'Minor debris runout stopped by roadside catch-basin.',
  },
  {
    id: 5,
    location: 'Kangchup Foothills, Imphal',
    time: '18 hours ago',
    risk: 'Medium',
    summary: 'Stream scouring slope base; field team on site for inspection.',
  },
  {
    id: 6,
    location: 'Baramura Hill Range, Agartala',
    time: '1 day ago',
    risk: 'Low',
    summary: 'Post-stabilization sensor reading confirms slope equilibrium.',
  },
];

export default function RecentEvents({ events = RECENT_EVENTS }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Recent Incident Activity</h3>
          <p className="text-xs text-slate-500 mt-0.5">Live sensor & field reports across NER</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          6 Events
        </span>
      </div>

      <div className="p-4 flex-1 overflow-y-auto max-h-[380px] space-y-3">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col gap-1.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-1.5 font-semibold text-slate-900 text-xs">
                <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="truncate">{evt.location}</span>
              </div>
              <RiskLevelBadge level={evt.risk} size="sm" />
            </div>

            <p className="text-xs text-slate-600 pl-5">
              {evt.summary}
            </p>

            <div className="flex items-center space-x-1 text-[11px] text-slate-400 pl-5 pt-0.5">
              <Clock className="w-3 h-3" />
              <span>{evt.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
