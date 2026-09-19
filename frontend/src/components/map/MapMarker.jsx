import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import RiskLevelBadge from '../admin/RiskLevelBadge';
import { MapPin, Calendar, Compass, AlertCircle } from 'lucide-react';

const createCustomIcon = (riskLevel) => {
  const normalized = String(riskLevel).toLowerCase();
  
  const colors = {
    critical: '#ef4444', // red
    high: '#f97316',     // orange
    medium: '#f59e0b',   // amber/yellow
    low: '#10b981',      // emerald/green
  };

  const color = colors[normalized] || '#10b981';

  const html = `
    <div style="
      position: relative;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: ${color};
        opacity: 0.3;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: ${color};
        border: 2.5px solid #ffffff;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25);
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-map-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

export default function MapMarker({ location }) {
  if (!location.latitude || !location.longitude) return null;

  const position = [Number(location.latitude), Number(location.longitude)];
  const icon = createCustomIcon(location.risk_level);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Marker position={position} icon={icon}>
      <Popup className="custom-leaflet-popup">
        <div className="p-1 min-w-[220px]">
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-sm">
              {location.name}
            </span>
            <RiskLevelBadge level={location.risk_level} size="sm" />
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span>District: <strong className="text-slate-800">{location.district}</strong></span>
            </div>

            <div className="flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="font-mono text-[11px]">
                {Number(location.latitude).toFixed(4)}°N, {Number(location.longitude).toFixed(4)}°E
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>Reported: {formatDate(location.last_reported)}</span>
            </div>

            {location.description && (
              <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-snug">
                {location.description}
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
