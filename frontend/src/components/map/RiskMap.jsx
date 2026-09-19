import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import MapMarker from './MapMarker';

// District coordinate centers for smooth panning
const DISTRICT_COORDS = {
  Guwahati: [26.1664, 91.7056],
  Shillong: [25.5788, 91.8933],
  Itanagar: [27.0844, 93.6053],
  Kohima: [25.6747, 94.1103],
  Aizawl: [23.7271, 92.7176],
  Agartala: [23.8315, 91.2868],
  Imphal: [24.8170, 93.9368],
  Gangtok: [27.3389, 88.6065],
};

function MapViewUpdater({ district }) {
  const map = useMap();

  useEffect(() => {
    if (district && DISTRICT_COORDS[district]) {
      map.flyTo(DISTRICT_COORDS[district], 11, { duration: 1.2 });
    } else if (!district) {
      // General North East India center
      map.flyTo([25.5788, 92.5], 7, { duration: 1.2 });
    }
  }, [district, map]);

  return null;
}

export default function RiskMap({ locations = [], selectedDistrict = '' }) {
  // North East India center coordinates
  const defaultCenter = [25.5788, 92.5];
  const defaultZoom = 7;

  return (
    <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative z-10">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewUpdater district={selectedDistrict} />

        {locations.map((loc) => (
          <MapMarker key={loc.id} location={loc} />
        ))}
      </MapContainer>

      {/* Floating Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-lg text-xs space-y-1.5 pointer-events-auto">
        <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider mb-1">
          Hazard Severity
        </span>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-slate-700">Critical Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span className="text-slate-700">High Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-700">Medium Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-700">Low / Monitored</span>
        </div>
      </div>
    </div>
  );
}
