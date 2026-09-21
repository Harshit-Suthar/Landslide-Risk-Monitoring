import React, { useState } from 'react';
import {
  BrainCircuit,
  Cpu,
  Sparkles,
  Play,
  CheckCircle2,
  AlertCircle,
  X,
  Gauge,
  Calendar,
  Layers,
  RefreshCw,
  Sliders,
  CloudRain,
  MapPin,
  Check,
} from 'lucide-react';
import RiskLevelBadge from '../../components/admin/RiskLevelBadge';
import { predictionService } from '../../services/predictionService';
import { useToast } from '../../layouts/AdminLayout';

const SAMPLE_LOCATIONS = [
  { id: 'loc-1', name: 'Nongthymmai Ridge, Shillong', district: 'Shillong', lat: 25.5682, lon: 91.8933, defaultRain: 95 },
  { id: 'loc-2', name: 'NH-29 Kohima By-Pass Corridor', district: 'Kohima', lat: 25.6747, lon: 94.1103, defaultRain: 110 },
  { id: 'loc-5', name: 'Durtlang Hills Sector 4, Aizawl', district: 'Aizawl', lat: 23.7712, lon: 92.7303, defaultRain: 140 },
  { id: 'loc-4', name: 'Kamakhya Western Escarpment, Guwahati', district: 'Guwahati', lat: 26.1664, lon: 91.7056, defaultRain: 70 },
  { id: 'loc-3', name: 'Banderdewa Slope, Itanagar', district: 'Itanagar', lat: 27.1264, lon: 93.8188, defaultRain: 50 },
];

export default function AIModel() {
  const [isRunningPrediction, setIsRunningPrediction] = useState(false);
  const [selectedLocId, setSelectedLocId] = useState('loc-1');
  const [customRainfall, setCustomRainfall] = useState(115);
  const [liveResult, setLiveResult] = useState(null);

  const { showToast } = useToast();

  const modelInfo = predictionService.getModelInfo();
  const featureInputs = predictionService.getFeatureInputs();
  const [predictionsList, setPredictionsList] = useState(predictionService.getPredictions());

  const handleRunWorkbenchInference = async (e) => {
    e?.preventDefault();
    setIsRunningPrediction(true);
    const loc = SAMPLE_LOCATIONS.find((l) => l.id === selectedLocId) || SAMPLE_LOCATIONS[0];

    try {
      const res = await predictionService.runLivePrediction({
        location_id: loc.id,
        lat: loc.lat,
        lon: loc.lon,
        rainfall_mm: customRainfall,
      });

      setLiveResult(res);

      // Prepend to prediction list
      const newEntry = {
        id: `pred-live-${Date.now()}`,
        location: loc.name,
        predictedRisk: res.risk_level,
        confidence: res.confidence,
        predictedDate: 'Next 12-24 Hours',
        triggerFactor: res.contributing_factors?.[0] || 'Hydro-geological pore pressure elevation',
      };

      setPredictionsList((prev) => [newEntry, ...prev]);
      showToast(`Inference completed: Classified as ${res.risk_level} (${res.confidence}% confidence)`, 'success');
    } catch (err) {
      console.error('Inference error:', err);
      showToast('Model inference error', 'error');
    } finally {
      setIsRunningPrediction(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live System Operational Strip */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/5 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white flex-shrink-0 shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              FastAPI AI Inference Microservice Active &amp; Serving
            </h4>
            <p className="text-xs text-slate-600">
              Live weighted-scoring inference engine connected on port 8000 &bull; Multi-spectral telemetry calibrated
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-2xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time Pipeline Online</span>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <BrainCircuit className="w-7 h-7 text-amber-500" />
          AI Landslide Susceptibility Model
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Machine learning hazard scoring trained on multi-sensor geospatial and meteorological datasets
        </p>
      </div>

      {/* Interactive Live Inference Workbench Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Live Prediction Workbench</span>
            </h3>
            <p className="text-xs text-slate-500">
              Trigger instant geotechnical inference for monitored locations with custom rainfall parameters
            </p>
          </div>
          <span className="text-2xs font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
            POST /api/predict
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-1">
          {/* Location Picker */}
          <div className="md:col-span-6 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Target Monitored Slope Location
            </label>
            <select
              value={selectedLocId}
              onChange={(e) => {
                setSelectedLocId(e.target.value);
                const l = SAMPLE_LOCATIONS.find((x) => x.id === e.target.value);
                if (l) setCustomRainfall(l.defaultRain);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white"
            >
              {SAMPLE_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.district})
                </option>
              ))}
            </select>
          </div>

          {/* Rainfall Input */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              24h Antecedent Rain (mm)
            </label>
            <input
              type="number"
              min="0"
              max="300"
              value={customRainfall}
              onChange={(e) => setCustomRainfall(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Trigger Button */}
          <div className="md:col-span-3">
            <button
              onClick={handleRunWorkbenchInference}
              disabled={isRunningPrediction}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunningPrediction ? 'animate-spin' : ''}`} />
              <span>{isRunningPrediction ? 'Computing...' : 'Run Live Inference'}</span>
            </button>
          </div>
        </div>

        {/* Live Result Callout */}
        {liveResult && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900">Inference Output:</span>
                <RiskLevelBadge level={liveResult.risk_level} />
                <span className="font-bold text-slate-700">({liveResult.confidence}% confidence)</span>
              </div>
              <span className="text-2xs font-mono text-slate-400">{liveResult.source}</span>
            </div>
            <div className="text-2xs text-slate-600 space-y-0.5">
              <strong>Contributing Geological Factors:</strong>
              <ul className="list-disc pl-4 space-y-0.5">
                {liveResult.contributing_factors?.map((fac, idx) => (
                  <li key={idx}>{fac}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Top Cards: Model Status & Feature Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Model Status Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-base">Model Telemetry & Architecture</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Ready for Inference
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Model Version
                </span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">
                  {modelInfo.version}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Last Calibrated
                </span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">
                  {modelInfo.lastTrained}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Cross-Validation Score
                </span>
                <span className="text-sm font-extrabold text-emerald-600 mt-1 block">
                  {modelInfo.accuracy}%
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1 mt-3">
              <p>
                <strong>Architecture:</strong> {modelInfo.algorithm}
              </p>
              <p>
                <strong>Training Sample Corpus:</strong> {modelInfo.trainingSamples}
              </p>
            </div>
          </div>
        </div>

        {/* Feature Inputs Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Layers className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-base">Feature Weighting Scheme</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Dynamic sensor parameters and geotechnical weights applied in each inference cycle
            </p>

            <div className="space-y-2.5">
              {featureInputs.map((f, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      {f.name}
                    </span>
                    <span className="text-2xs text-slate-400 block">
                      {f.threshold}
                    </span>
                  </div>
                  <span className="font-bold font-mono text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-2xs">
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Results Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Latest Slope Hazard Predictions
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated high-risk zone forecasts generated by model v0.1
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {predictionsList.length} Slope Predictions Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Predicted Risk Level</th>
                <th className="px-6 py-3.5">Confidence Score</th>
                <th className="px-6 py-3.5">Forecast Window</th>
                <th className="px-6 py-3.5">Key Geological Trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {predictionsList.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {p.location}
                  </td>
                  <td className="px-6 py-4">
                    <RiskLevelBadge level={p.predictedRisk} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${p.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {p.confidence}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">
                    {p.predictedDate}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {p.triggerFactor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
