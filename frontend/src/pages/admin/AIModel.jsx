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
} from 'lucide-react';
import RiskLevelBadge from '../../components/admin/RiskLevelBadge';
import { predictionService } from '../../services/predictionService';
import { useToast } from '../../layouts/AdminLayout';

export default function AIModel() {
  const [showBanner, setShowBanner] = useState(true);
  const [isRunningPrediction, setIsRunningPrediction] = useState(false);

  const { showToast } = useToast();

  const modelInfo = predictionService.getModelInfo();
  const featureInputs = predictionService.getFeatureInputs();
  const predictions = predictionService.getPredictions();

  const handleRunPrediction = async () => {
    setIsRunningPrediction(true);
    try {
      await predictionService.triggerPrediction();
      showToast('Prediction triggered. Running inference pipeline on latest telemetry...', 'info');
    } catch (err) {
      showToast('Inference trigger error', 'error');
    } finally {
      setIsRunningPrediction(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dismissible Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                AI Predictive Inference Shell
              </h4>
              <p className="text-xs text-slate-600">
                This page will connect to the live prediction API in a future phase. The data below illustrates features, confidence metrics, and warning forecasts.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowBanner(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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

      {/* Top Cards: Model Status & Feature Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Model Status Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-base">Model Status</h3>
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
                  Last Trained Date
                </span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">
                  {modelInfo.lastTrained}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Test Accuracy
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
                <strong>Corpus:</strong> {modelInfo.trainingSamples}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Next scheduled retraining in 4 days
            </span>
            <button
              onClick={handleRunPrediction}
              disabled={isRunningPrediction}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunningPrediction ? 'Dispatching...' : 'Run Prediction'}</span>
            </button>
          </div>
        </div>

        {/* Feature Inputs Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Layers className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-base">Feature Inputs</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Current sensor values fed into the gradient boost feature pipeline
            </p>

            <div className="space-y-3">
              {featureInputs.map((f, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      {f.name}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {f.threshold}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Latest Prediction Results
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated high-risk zone forecasts generated by model v0.1
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {predictions.length} Slope Predictions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Predicted Risk Level</th>
                <th className="px-6 py-3.5">Confidence Score</th>
                <th className="px-6 py-3.5">Predicted Forecast Window</th>
                <th className="px-6 py-3.5">Key Trigger Factor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {predictions.map((p) => (
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
