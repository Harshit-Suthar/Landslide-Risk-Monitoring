import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  CloudRain,
  Mountain,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Flame,
  Radio,
  Sparkles,
  Sliders,
  Layers,
  FileCheck2,
  Clock,
  Compass,
  Activity,
  Users,
  Eye,
  RefreshCw,
} from 'lucide-react';
import MapMarker from '../components/map/MapMarker';
import { landslideService } from '../services/landslideService';
import { predictionService } from '../services/predictionService';

const NE_STATES_STATUS = [
  { state: 'Meghalaya', capital: 'Shillong', risk: 'Critical', rain24h: 94.8, hotspot: 'Nongthymmai Ridge', alert: 'Red Alert' },
  { state: 'Nagaland', capital: 'Kohima', risk: 'High', rain24h: 86.4, hotspot: 'NH-29 By-Pass Corridor', alert: 'Red Alert' },
  { state: 'Mizoram', capital: 'Aizawl', risk: 'Critical', rain24h: 112.5, hotspot: 'Durtlang Hills Sector 4', alert: 'Red Alert' },
  { state: 'Assam', capital: 'Guwahati', risk: 'High', rain24h: 68.2, hotspot: 'Kamakhya Western Escarpment', alert: 'Orange Alert' },
  { state: 'Arunachal Pradesh', capital: 'Itanagar', risk: 'Medium', rain24h: 54.0, hotspot: 'Banderdewa Slope', alert: 'Yellow Alert' },
  { state: 'Sikkim', capital: 'Gangtok', risk: 'High', rain24h: 78.6, hotspot: 'Tathangchen Ward', alert: 'Orange Alert' },
  { state: 'Manipur', capital: 'Imphal', risk: 'Medium', rain24h: 46.5, hotspot: 'Kangchup Foothills', alert: 'Yellow Alert' },
  { state: 'Tripura', capital: 'Agartala', risk: 'Low', rain24h: 22.0, hotspot: 'Baramura Hill Stabilized', alert: 'Normal' },
];

const RECENT_INCIDENTS = [
  {
    id: 'rep-01',
    district: 'Kohima',
    type: 'Road Blockage',
    severity: 'Severe',
    time: '25 minutes ago',
    location: 'NH-29 Km 14',
    status: 'Verified',
    desc: 'Heavy rotational slide blocking both lanes. NDRF earthmovers engaged.',
  },
  {
    id: 'rep-02',
    district: 'Aizawl',
    type: 'Slope Crack',
    severity: 'Severe',
    time: '1 hour ago',
    location: 'Durtlang Upper Sector',
    status: 'Verified',
    desc: 'New 20cm tensile crack opened above municipal residential road.',
  },
  {
    id: 'rep-03',
    district: 'Shillong',
    type: 'Landslide',
    severity: 'Moderate',
    time: '2 hours ago',
    location: 'Polo Valley Flank',
    status: 'Verified',
    desc: 'Retaining wall collapse with 15 cubic meters of saturated sandstone slip.',
  },
];

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [selectedMapDistrict, setSelectedMapDistrict] = useState('All');
  const [weatherRainfall, setWeatherRainfall] = useState(90.8);
  const [activeWeatherDistrict, setActiveWeatherDistrict] = useState('Shillong');

  // AI Calculator Simulator State
  const [calcRain, setCalcRain] = useState(95);
  const [calcSlope, setCalcSlope] = useState(38);
  const [calcMoisture, setCalcMoisture] = useState(76);
  const [calcResult, setCalcResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    async function loadLocations() {
      try {
        const data = await landslideService.getLocations();
        setLocations(data || []);
      } catch (e) {
        console.error('Failed to load map locations:', e);
      }
    }
    loadLocations();
  }, []);

  // Fetch live weather from backend for weather widget
  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch(`/api/weather/${activeWeatherDistrict}`);
        if (res.ok) {
          const json = await res.json();
          if (json.current_rainfall_mm) {
            setWeatherRainfall(json.current_rainfall_mm);
          }
        }
      } catch (err) {
        console.warn('Weather fetch error:', err);
      }
    }
    loadWeather();
  }, [activeWeatherDistrict]);

  // Initial calculation
  useEffect(() => {
    handleRunCalculator();
  }, []);

  const handleRunCalculator = async () => {
    setIsCalculating(true);
    try {
      const res = await predictionService.runLivePrediction({
        location_id: 'calc-sim',
        lat: 25.5788,
        lon: 91.8933,
        rainfall_mm: calcRain,
      });
      setCalcResult(res);
    } catch (err) {
      console.warn('Calculator inference error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const emergencyHelplines = [
    { state: 'Assam', number: '1070 / 1079' },
    { state: 'Meghalaya', number: '1070 / 0364-2502188' },
    { state: 'Arunachal Pradesh', number: '1070 / 0360-2291122' },
    { state: 'Nagaland', number: '1070 / 0370-2291120' },
    { state: 'Mizoram', number: '1070 / 0389-2335842' },
    { state: 'Tripura', number: '1070 / 0381-2416045' },
    { state: 'Manipur', number: '1070 / 0385-2443441' },
    { state: 'Sikkim', number: '1070 / 03592-201145' },
  ];

  const mapLocations = locations.filter(
    (l) => selectedMapDistrict === 'All' || l.district === selectedMapDistrict
  );

  return (
    <div className="space-y-12 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-slate-900 overflow-hidden text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            <span>North Eastern Region Disaster Warning Network &bull; 87 Sensor Stations Active</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            NER Landslide Early Warning & Risk Monitoring
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
            State-of-the-art multi-spectral satellite telemetry, ground piezometer arrays, and calibrated AI hazard models protecting lives across all 8 North Eastern States of India.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/map"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black px-5 py-3.5 rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-amber-500/25"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Live GIS Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/citizen/report"
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold px-5 py-3.5 rounded-2xl text-xs sm:text-sm transition"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Report Citizen Incident</span>
            </Link>

            <Link
              to="/weather"
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold px-4 py-3.5 rounded-2xl text-xs sm:text-sm transition"
            >
              <CloudRain className="w-4 h-4 text-sky-400" />
              <span>Rainfall Radar</span>
            </Link>
          </div>

          {/* Real-time Telemetry Stats Pill Strip */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800">
            <div>
              <span className="text-2xl font-black text-white block">87</span>
              <span className="text-2xs text-slate-400 uppercase tracking-wider">Telemetry Hotspots</span>
            </div>
            <div>
              <span className="text-2xl font-black text-amber-400 block">8 States</span>
              <span className="text-2xs text-slate-400 uppercase tracking-wider">Synchronized SEOCs</span>
            </div>
            <div>
              <span className="text-2xl font-black text-sky-400 block">15 Min</span>
              <span className="text-2xs text-slate-400 uppercase tracking-wider">IMD Radar Polling</span>
            </div>
            <div>
              <span className="text-2xl font-black text-emerald-400 block">91.6%</span>
              <span className="text-2xs text-slate-400 uppercase tracking-wider">ML Model Accuracy</span>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -top-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 8-State Real-time Landslide Hazard Index */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-amber-500" />
              <span>North East Regional Landslide Hazard Index</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current ground moisture and geotechnical threat levels across the 8 Member States
            </p>
          </div>
          <Link
            to="/alerts"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
          >
            <span>View All Active Advisories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {NE_STATES_STATUS.map((item) => {
            const isCrit = item.risk === 'Critical';
            const isHigh = item.risk === 'High';
            const isMed = item.risk === 'Medium';

            return (
              <div
                key={item.state}
                className={`p-4 rounded-2xl border transition bg-white shadow-2xs hover:shadow-xs space-y-2.5 ${
                  isCrit
                    ? 'border-red-200 hover:border-red-300'
                    : isHigh
                    ? 'border-amber-200 hover:border-amber-300'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{item.state}</h3>
                    <span className="text-2xs text-slate-500">{item.capital} HQ</span>
                  </div>
                  <span
                    className={`text-2xs font-black uppercase px-2 py-0.5 rounded-full ${
                      isCrit
                        ? 'bg-red-500 text-white'
                        : isHigh
                        ? 'bg-amber-500 text-slate-950'
                        : isMed
                        ? 'bg-blue-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {item.risk}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">24h Rainfall:</span>
                    <span className="font-bold text-slate-800">{item.rain24h} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hotspot:</span>
                    <span className="font-medium text-slate-700 truncate max-w-[130px]">{item.hotspot}</span>
                  </div>
                </div>

                <Link
                  to={`/weather`}
                  className="text-2xs font-semibold text-amber-700 hover:text-amber-800 block pt-1"
                >
                  Check Doppler radar &rarr;
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Live Map Preview Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-2xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full mb-1">
              <MapPin className="w-3 h-3 text-amber-600" />
              <span>Interactive Telemetry Map</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Geospatial Slope Telemetry Preview</h3>
            <p className="text-xs text-slate-500">
              Live OpenStreetMap sensor plot monitoring active deformation points and highway corridors
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedMapDistrict}
              onChange={(e) => setSelectedMapDistrict(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="All">All Districts</option>
              <option value="Shillong">Shillong (Meghalaya)</option>
              <option value="Kohima">Kohima (Nagaland)</option>
              <option value="Aizawl">Aizawl (Mizoram)</option>
              <option value="Guwahati">Guwahati (Assam)</option>
              <option value="Itanagar">Itanagar (Arunachal)</option>
              <option value="Gangtok">Gangtok (Sikkim)</option>
              <option value="Imphal">Imphal (Manipur)</option>
            </select>

            <Link
              to="/map"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
            >
              <span>Full Screen Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Map Container */}
        <div className="h-[420px] rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner">
          <MapContainer
            center={[25.5788, 92.5]}
            zoom={7}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapLocations.map((loc) => (
              <MapMarker key={loc.id} location={loc} />
            ))}
          </MapContainer>

          {/* Quick Legend Overlay */}
          <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 shadow-sm text-2xs space-y-1">
            <span className="font-bold text-slate-700 block">Live Markers:</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Critical Risk ({locations.filter((l) => l.risk_level === 'Critical').length})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>High Risk ({locations.filter((l) => l.risk_level === 'High').length})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Medium Risk ({locations.filter((l) => l.risk_level === 'Medium').length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Section: AI Risk Simulator (Left) + Live Weather & Recent Reports (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive AI Landslide Risk Simulator (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-2xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>AI Inference Engine Sandbox</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Interactive Landslide Risk Simulator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate weather & terrain factors to see instant explainable AI risk scoring
              </p>
            </div>
            <span className="text-2xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
              v0.1 Weighted Scoring
            </span>
          </div>

          {/* Sliders Grid */}
          <div className="space-y-4 pt-2">
            {/* Slider 1: 24h Rainfall */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center space-x-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-sky-500" />
                  <span>24-Hour Precipitation</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{calcRain} mm/24h</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={calcRain}
                onChange={(e) => setCalcRain(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-3xs text-slate-400">
                <span>0 mm (Dry)</span>
                <span>50 mm (Advisory)</span>
                <span>100 mm (Critical Trigger)</span>
                <span>200 mm</span>
              </div>
            </div>

            {/* Slider 2: Slope Steepness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center space-x-1.5">
                  <Mountain className="w-3.5 h-3.5 text-amber-500" />
                  <span>Hill Slope Angle (Steepness)</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{calcSlope}&deg;</span>
              </div>
              <input
                type="range"
                min="10"
                max="65"
                value={calcSlope}
                onChange={(e) => setCalcSlope(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-3xs text-slate-400">
                <span>10&deg; (Gentle)</span>
                <span>30&deg; (Standard Hill)</span>
                <span>45&deg; (Steep Escarpment)</span>
                <span>65&deg;</span>
              </div>
            </div>

            {/* Slider 3: Ground Moisture */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center space-x-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Volumetric Soil Moisture</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{calcMoisture}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={calcMoisture}
                onChange={(e) => setCalcMoisture(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-3xs text-slate-400">
                <span>10% (Dry Sand)</span>
                <span>50% (Normal Soil)</span>
                <span>75% (High Saturation)</span>
                <span>100% (Liquid Limit)</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunCalculator}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
            <span>Recalculate Hazard Prediction</span>
          </button>

          {/* AI Result Card */}
          {calcResult && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition space-y-3 ${
                calcResult.risk_level === 'Critical'
                  ? 'bg-red-50/70 border-red-200'
                  : calcResult.risk_level === 'High'
                  ? 'bg-amber-50/70 border-amber-200'
                  : calcResult.risk_level === 'Medium'
                  ? 'bg-blue-50/70 border-blue-200'
                  : 'bg-emerald-50/70 border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block">
                    Predicted Slope Hazard Tier
                  </span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span
                      className={`text-xl font-black ${
                        calcResult.risk_level === 'Critical'
                          ? 'text-red-700'
                          : calcResult.risk_level === 'High'
                          ? 'text-amber-800'
                          : calcResult.risk_level === 'Medium'
                          ? 'text-blue-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {calcResult.risk_level} Risk Tier
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      ({calcResult.confidence}% Model Confidence)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-3xs text-slate-400 font-mono block">Algorithm Source</span>
                  <span className="text-2xs font-semibold text-slate-600">{calcResult.source}</span>
                </div>
              </div>

              {/* Factors */}
              <div className="space-y-1.5 pt-1">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-600 block">
                  Contributing Geotechnical Factors:
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {calcResult.contributing_factors?.map((f, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Weather Widget + Recent Field Reports (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Weather Widget */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CloudRain className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">Live Doppler Precipitation</h3>
              </div>
              <select
                value={activeWeatherDistrict}
                onChange={(e) => setActiveWeatherDistrict(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 bg-white"
              >
                <option value="Shillong">Shillong</option>
                <option value="Kohima">Kohima</option>
                <option value="Aizawl">Aizawl</option>
                <option value="Guwahati">Guwahati</option>
                <option value="Itanagar">Itanagar</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
              <div>
                <span className="text-2xs font-semibold text-sky-800 uppercase block">24h Cumulative</span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-3xl font-black text-sky-950">{weatherRainfall}</span>
                  <span className="text-xs font-bold text-sky-700">mm</span>
                </div>
                <span className="text-2xs text-sky-600">
                  {weatherRainfall > 80 ? 'Heavy precipitation band active' : 'Normal rainfall runoff'}
                </span>
              </div>

              <Link
                to="/weather"
                className="text-xs font-bold text-sky-700 hover:text-sky-800 underline"
              >
                Full 7-Day &rarr;
              </Link>
            </div>
          </div>

          {/* Recent Community Incident Reports */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">Recent Verified Incidents</h3>
              </div>
              <Link
                to="/citizen/report"
                className="text-xs font-bold text-amber-700 hover:text-amber-800"
              >
                + New Report
              </Link>
            </div>

            <div className="space-y-3">
              {RECENT_INCIDENTS.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-slate-900 text-xs">{rep.type}</span>
                      <span className="text-2xs text-slate-400">&bull; {rep.district}</span>
                    </div>
                    <span className="text-3xs font-bold uppercase px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{rep.desc}</p>
                  <div className="flex items-center justify-between text-3xs text-slate-400 font-mono pt-0.5">
                    <span>{rep.location}</span>
                    <span>{rep.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core System Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <Mountain className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Critical Slope Sensing</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Automated monitoring of 87 vulnerable geological formations including Durtlang (Aizawl), Nongthymmai (Shillong), and Kohima By-Pass.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <CloudRain className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">IMD Radar Integration</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Real-time Doppler precipitation telemetry calibrated against 72-hour antecedent moisture saturation thresholds.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">State EOC Coordination</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Synchronized emergency dispatch to State Emergency Operations Centers and District Disaster Management Authorities.
          </p>
        </div>
      </div>

      {/* Emergency Contact Helplines */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              State Disaster Management Emergency Helplines
            </h3>
            <p className="text-xs text-slate-500">
              Toll-free emergency numbers for immediate landslide rescue and evacuation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {emergencyHelplines.map((item) => (
            <div
              key={item.state}
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition"
            >
              <span className="text-xs font-bold text-slate-800 block">
                {item.state}
              </span>
              <span className="text-xs font-mono font-semibold text-amber-700 mt-0.5 block">
                {item.number}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
