import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import {
  MapPin,
  ShieldAlert,
  Search,
  Filter,
  Layers,
  ArrowRight,
  AlertTriangle,
  Flame,
  Info,
  Compass,
  CloudRain,
  ExternalLink,
  RefreshCw,
  Mountain,
} from 'lucide-react';
import { landslideService } from '../../services/landslideService';
import geotechService from '../../services/geotechService';
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

const DISTRICT_CENTERS = {
  Guwahati: [26.1664, 91.7056],
  Shillong: [25.5788, 91.8933],
  Itanagar: [27.0844, 93.6053],
  Kohima: [25.6747, 94.1103],
  Aizawl: [23.7271, 92.7176],
  Agartala: [23.8315, 91.2868],
  Imphal: [24.8170, 93.9368],
  Gangtok: [27.3389, 88.6065],
};

function MapViewUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function LiveMap() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [activeRiskLevels, setActiveRiskLevels] = useState(['Critical', 'High', 'Medium', 'Low']);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedGeotech, setSelectedGeotech] = useState(null);
  const [loadingGeotech, setLoadingGeotech] = useState(false);

  useEffect(() => {
    if (!selectedLocation) {
      setSelectedGeotech(null);
      return;
    }
    let isCancelled = false;
    setLoadingGeotech(true);
    geotechService.getTelemetry(
      selectedLocation.id,
      selectedLocation.latitude,
      selectedLocation.longitude,
      85.0
    ).then((data) => {
      if (!isCancelled) {
        setSelectedGeotech(data);
        setLoadingGeotech(false);
      }
    }).catch(() => {
      if (!isCancelled) setLoadingGeotech(false);
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedLocation]);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const data = await landslideService.getLocations();
      setLocations(data || []);
    } catch (err) {
      console.error('Failed to load locations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const toggleRiskLevel = (level) => {
    setActiveRiskLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const filteredLocations = locations.filter((loc) => {
    const matchesDistrict =
      selectedDistrict === 'All Districts' || loc.district === selectedDistrict;
    const matchesRisk = activeRiskLevels.includes(loc.risk_level);
    const matchesSearch =
      loc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.district?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesRisk && matchesSearch;
  });

  const criticalCount = locations.filter((l) => l.risk_level === 'Critical').length;
  const highCount = locations.filter((l) => l.risk_level === 'High').length;
  const mediumCount = locations.filter((l) => l.risk_level === 'Medium').length;
  const lowCount = locations.filter((l) => l.risk_level === 'Low').length;

  const mapCenter =
    selectedDistrict !== 'All Districts' && DISTRICT_CENTERS[selectedDistrict]
      ? DISTRICT_CENTERS[selectedDistrict]
      : [25.5788, 92.5];
  const mapZoom = selectedDistrict !== 'All Districts' ? 11 : 7;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Public GIS Hotspot Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Live Landslide Risk Map — North Eastern Region
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time geospatial visualization of monitored hills, slopes, and transport corridors across 8 North Eastern states
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchLocations}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh</span>
          </button>
          <Link
            to="/citizen/report"
            className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report Incident</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-red-50/80 border border-red-200 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-red-700 block">Critical Zones</span>
            <span className="text-xl font-black text-red-900">{criticalCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            CRIT
          </div>
        </div>

        <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-700 block">High Risk Slopes</span>
            <span className="text-xl font-black text-amber-900">{highCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
            HIGH
          </div>
        </div>

        <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-700 block">Medium Watch</span>
            <span className="text-xl font-black text-blue-900">{mediumCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            MED
          </div>
        </div>

        <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-700 block">Stable / Resolved</span>
            <span className="text-xl font-black text-emerald-900">{lowCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            LOW
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hill, sector, or road..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-500 bg-slate-50/50"
            />
          </div>

          {/* District Selector */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full md:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:outline-hidden focus:border-amber-500"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level Toggles */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-600 mr-1">Tiers:</span>
            {[
              { level: 'Critical', bg: 'bg-red-500', text: 'text-white' },
              { level: 'High', bg: 'bg-amber-500', text: 'text-slate-950' },
              { level: 'Medium', bg: 'bg-blue-500', text: 'text-white' },
              { level: 'Low', bg: 'bg-emerald-500', text: 'text-white' },
            ].map(({ level, bg, text }) => {
              const active = activeRiskLevels.includes(level);
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => toggleRiskLevel(level)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    active ? `${bg} ${text} shadow-2xs` : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="h-[550px] relative w-full">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-20">
              <Loading message="Loading geospatial risk telemetry..." />
            </div>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
              className="z-10"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapViewUpdater center={mapCenter} zoom={mapZoom} />

              {filteredLocations.map((loc) => (
                <MapMarker
                  key={loc.id}
                  location={loc}
                  onClick={() => setSelectedLocation(loc)}
                />
              ))}
            </MapContainer>
          )}

          {/* Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-slate-200 shadow-md text-xs space-y-1.5 hidden sm:block">
            <span className="font-bold text-slate-800 block text-2xs uppercase tracking-wider mb-1">
              Hazard Legend
            </span>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="text-slate-700">Critical (Immediate danger / evacuation)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="text-slate-700">High (Imminent slope movement)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              <span className="text-slate-700">Medium (Advisory monitoring)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-700">Low (Stable hillside)</span>
            </div>
          </div>
        </div>

        {/* Selected Location Detail Bar (when user clicks a marker) */}
        {selectedLocation && (
          <div className="p-4 sm:p-5 bg-slate-900 text-white border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base text-white">{selectedLocation.name}</span>
                <span
                  className={`text-2xs font-black uppercase px-2 py-0.5 rounded-full ${
                    selectedLocation.risk_level === 'Critical'
                      ? 'bg-red-500 text-white'
                      : selectedLocation.risk_level === 'High'
                      ? 'bg-amber-500 text-slate-950'
                      : selectedLocation.risk_level === 'Medium'
                      ? 'bg-blue-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {selectedLocation.risk_level} Risk
                </span>
                <span className="text-xs text-slate-400">District: {selectedLocation.district}</span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl">{selectedLocation.description}</p>
              <div className="flex items-center space-x-4 text-2xs text-slate-400 font-mono">
                <span>GPS: {selectedLocation.latitude.toFixed(4)}° N, {selectedLocation.longitude.toFixed(4)}° E</span>
                <span>Status: {selectedLocation.status}</span>
              </div>

              {/* Live Geotechnical Sensor Telemetry Bar */}
              {selectedGeotech && (
                <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap items-center gap-3 text-2xs">
                  <span className="flex items-center gap-1 font-bold text-amber-400">
                    <Mountain className="w-3 h-3" /> Geotech API Telemetry:
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-200">
                    FoS: <strong className={selectedGeotech.factor_of_safety < 1.0 ? 'text-red-400' : selectedGeotech.factor_of_safety < 1.25 ? 'text-amber-400' : 'text-emerald-400'}>{selectedGeotech.factor_of_safety}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-200">
                    Pore Pressure: <strong className="text-sky-300">{selectedGeotech.pore_water_pressure_kpa} kPa</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-200">
                    Inclinometer Creep: <strong className="text-purple-300">{selectedGeotech.inclinometer_shear_displacement_mm} mm</strong>
                  </span>
                  <span className="text-slate-400 truncate max-w-xs font-sans">
                    Strata: <span className="text-slate-300">{selectedGeotech.rock_strata}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to={`/weather`}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition flex items-center space-x-1.5"
              >
                <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                <span>Check Rainfall</span>
              </Link>
              <Link
                to="/citizen/report"
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-bold text-slate-950 transition flex items-center space-x-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report Situation</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Monitored Locations List Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Monitored Geological Hotspots ({filteredLocations.length})</span>
          </h3>
          <span className="text-xs text-slate-500">Telemetry updated hourly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition cursor-pointer space-y-2 hover:border-amber-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{loc.name}</h4>
                  <span className="text-xs text-slate-500">{loc.district}</span>
                </div>
                <span
                  className={`text-2xs font-bold px-2 py-0.5 rounded-md ${
                    loc.risk_level === 'Critical'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : loc.risk_level === 'High'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : loc.risk_level === 'Medium'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {loc.risk_level}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{loc.description}</p>
              <div className="flex items-center justify-between text-2xs text-slate-400 pt-1 font-mono">
                <span>{loc.latitude}°N, {loc.longitude}°E</span>
                <span className="text-amber-700 font-sans font-semibold">Click to focus &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
