import React, { useState, useEffect } from 'react';
import { ShieldAlert, Map as MapIcon, BarChart3, CloudRain } from 'lucide-react';
import RiskMap from '../../components/map/RiskMap';
import MapFilters from '../../components/map/MapFilters';
import RiskChart from '../../components/charts/RiskChart';
import RainfallChart from '../../components/charts/RainfallChart';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { landslideService } from '../../services/landslideService';

export default function RiskManagement() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map Filter State
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [activeRiskLevels, setActiveRiskLevels] = useState([
    'Critical',
    'High',
    'Medium',
    'Low',
  ]);

  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await landslideService.getLocations();
      setLocations(data);
    } catch (err) {
      console.error('Failed to load risk map locations:', err);
      setError(err.message || 'Could not load hazard telemetry points.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleToggleRiskLevel = (level) => {
    setActiveRiskLevels((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };

  // Filter locations for map view
  const mapLocations = locations.filter((loc) => {
    const matchesDistrict = !selectedDistrict || loc.district === selectedDistrict;
    const matchesRisk = activeRiskLevels.includes(loc.risk_level);
    return matchesDistrict && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <ShieldAlert className="w-7 h-7 text-amber-500" />
          Risk Management & Geospatial GIS
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Interactive North East India slope vulnerability map, risk level distributions, and IMD precipitation telemetry
        </p>
      </div>

      {isLoading ? (
        <Loading message="Loading geospatial risk telemetry and map layers..." />
      ) : error ? (
        <ErrorMessage
          title="Map Telemetry Error"
          message={error}
          onRetry={fetchLocations}
        />
      ) : (
        <>
          {/* Map Filters */}
          <MapFilters
            selectedDistrict={selectedDistrict}
            onDistrictChange={setSelectedDistrict}
            activeRiskLevels={activeRiskLevels}
            onToggleRiskLevel={handleToggleRiskLevel}
          />

          {/* Interactive Leaflet Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapIcon className="w-3.5 h-3.5 text-amber-500" />
                Live OpenStreetMap Sensor Plot ({mapLocations.length} locations active)
              </span>
              <span className="text-xs text-slate-400">
                Click any marker to view localized slope report
              </span>
            </div>
            <RiskMap
              locations={mapLocations}
              selectedDistrict={selectedDistrict}
            />
          </div>

          {/* Visual Analytics Row: RiskChart & RainfallChart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="h-[360px]">
              <RiskChart locations={locations} />
            </div>
            <div className="h-[360px]">
              <RainfallChart />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
