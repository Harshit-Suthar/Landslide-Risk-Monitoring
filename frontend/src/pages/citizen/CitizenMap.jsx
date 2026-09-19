import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import {
  Map as MapIcon,
  MapPin,
  ShieldAlert,
  Info,
  Layers,
  Search,
  Filter,
} from 'lucide-react';
import { landslideService } from '../../services/landslideService';
import MapMarker from '../../components/map/MapMarker';
import Loading from '../../components/common/Loading';

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

// Coordinate centers for each North East district for panning
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

function CitizenMapUpdater({ district }) {
  const map = useMap();

  useEffect(() => {
    if (district && district !== 'All Districts' && DISTRICT_COORDS[district]) {
      map.flyTo(DISTRICT_COORDS[district], 11, { duration: 1.2 });
    } else {
      // Zoom out to whole North East Region
      map.flyTo([25.5788, 92.5], 7, { duration: 1.2 });
    }
  }, [district, map]);

  return null;
}

export default function CitizenMap() {
  const context = useOutletContext() || {};
  const citizenDistrict = context.district || 'Shillong';

  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState(citizenDistrict);
  const [riskFilter, setRiskFilter] = useState('All');

  useEffect(() => {
    async function loadLocations() {
      setIsLoading(true);
      try {
        const data = await landslideService.getLocations();
        setLocations(data || []);
      } catch (err) {
        console.error('Failed to load locations for risk map:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadLocations();
  }, []);

  const filteredLocations = locations.filter((loc) => {
    const matchesDistrict =
      selectedDistrict === 'All Districts' || loc.district === selectedDistrict;
    const matchesRisk =
      riskFilter === 'All' || loc.risk_level?.toLowerCase() === riskFilter.toLowerCase();
    return matchesDistrict && matchesRisk;
  });

  const criticalCount = locations.filter((l) => l.risk_level === 'Critical').length;
  const highCount = locations.filter((l) => l.risk_level === 'High').length;
  const districtPoints = locations.filter((l) => l.district === selectedDistrict).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <MapIcon className="w-7 h-7 text-amber-500" />
            Risk Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time monitored geological formations, active slope hazards, and localized risk levels across North East India.
          </p>
        </div>

        {/* District Selector - defaults to citizen's district */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-white rounded-xl border border-slate-200 px-3 py-1.5 shadow-xs">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-slate-700">Zoom to Area:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs font-bold text-slate-900 bg-transparent focus:outline-hidden cursor-pointer"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d} {d === citizenDistrict ? '(Your Area)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-white rounded-xl border border-slate-200 px-3 py-1.5 shadow-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Severity Levels</option>
              <option value="Critical">Critical Only</option>
              <option value="High">High Only</option>
              <option value="Medium">Medium Only</option>
              <option value="Low">Low / Monitored</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Selected District
          </span>
          <span className="text-sm font-bold text-slate-800 truncate block">
            {selectedDistrict}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Visible Sites
          </span>
          <span className="text-sm font-bold text-amber-600 block">
            {filteredLocations.length} monitored formations
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Critical Alerts
          </span>
          <span className="text-sm font-bold text-red-600 block">
            {criticalCount} high-hazard slopes
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Platform Mode
          </span>
          <span className="text-sm font-bold text-emerald-600 block flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Public View (Live)
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[580px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 z-10">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loading message="Rendering geological risk map..." />
          </div>
        ) : (
          <MapContainer
            center={
              selectedDistrict && DISTRICT_COORDS[selectedDistrict]
                ? DISTRICT_COORDS[selectedDistrict]
                : [25.5788, 92.5]
            }
            zoom={selectedDistrict === 'All Districts' ? 7 : 11}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <CitizenMapUpdater district={selectedDistrict} />

            {filteredLocations.map((location) => (
              <MapMarker key={location.id} location={location} />
            ))}
          </MapContainer>
        )}

        {/* Legend positioned at Bottom-Left of the map */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-lg text-xs space-y-2 pointer-events-auto max-w-[200px]">
          <div className="flex items-center space-x-1.5 pb-1 border-b border-slate-100">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
              Hazard Legend
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-xs flex-shrink-0" />
              <span className="text-slate-700 font-medium">Critical Risk</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 border border-white shadow-xs flex-shrink-0" />
              <span className="text-slate-700 font-medium">High Risk</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-xs flex-shrink-0" />
              <span className="text-slate-700 font-medium">Medium Risk</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-xs flex-shrink-0" />
              <span className="text-slate-700 font-medium">Low / Monitored</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 leading-tight">
            Click any marker to inspect slope notes and coordinates.
          </p>
        </div>
      </div>
    </div>
  );
}
