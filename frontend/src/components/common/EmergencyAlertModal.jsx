import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  X,
  PhoneCall,
  Volume2,
  VolumeX,
  Radio,
  MapPin,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  BellRing,
} from 'lucide-react';

export default function EmergencyAlertModal({
  isOpen,
  onClose,
  alertData,
}) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const location = useLocation();

  const defaultAlert = {
    id: 'alt-urgent-01',
    tier: 'CRITICAL RED ALERT',
    hazard: 'Massive Slope Failure & Active Debris Avalanche',
    location: 'NH-29 Corridor (Kohima) & Durtlang Hills (Aizawl)',
    timestamp: 'Live Active Advisory',
    issuedBy: 'State Disaster Management Authorities (NSDMA & Mizoram SDMA)',
    description:
      'Continuous 72-hour antecedent rainfall (142mm) has triggered catastrophic geotechnical pore-pressure failure. Multiple active rockfalls and rotational debris flows have breached arterial mountain roads. Threat to hillside dwellings is acute.',
    instructions: [
      'Immediate evacuation ordered for settlements within 200m of tension fissures.',
      'All commercial and private vehicular transit on NH-29 By-Pass is strictly suspended.',
      'Seek shelter at designated Municipal Government Higher Secondary School Relief Camps.',
      'Report any newly detected ground cracks or retaining wall bulges immediately.',
    ],
    helpline: '1070',
    deocPhone: '0370-2291120 / 0389-2335842',
  };

  const alert = alertData || defaultAlert;

  // Optional: Play subtle beep when modal opens if sound is toggled on
  useEffect(() => {
    if (isOpen && soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (err) {
        // audio context not supported or user hasn't interacted
      }
    }
  }, [isOpen, soundEnabled]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Dialog Card */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-title"
        className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-red-500 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Top Emergency Red Flashing Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-6 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-300"></span>
            </span>
            <span className="font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              {alert.tier}
            </span>
            <span className="text-red-200 hidden sm:inline">&bull;</span>
            <span className="text-xs text-red-100 hidden sm:inline">{alert.timestamp}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Alert Sound' : 'Enable Siren Tone'}
              className="p-1.5 rounded-lg bg-red-700/80 hover:bg-red-700 text-white transition cursor-pointer text-xs flex items-center gap-1"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-red-200" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-red-800/80 hover:bg-red-850 text-white transition cursor-pointer"
              aria-label="Close alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-7 space-y-5 overflow-y-auto flex-1">
          {/* Main Title & Hazard Spot */}
          <div className="space-y-1.5 border-b border-slate-100 pb-4">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-bounce" />
              <span>IMMEDIATE LIFE-SAFETY ACTION REQUIRED</span>
            </div>

            <h2 id="alert-dialog-title" className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {alert.hazard}
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-semibold pt-0.5">
              <span className="flex items-center space-x-1 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>{alert.location}</span>
              </span>
              <span>&bull;</span>
              <span className="text-slate-400">Authority: {alert.issuedBy}</span>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 text-xs sm:text-sm text-red-950 leading-relaxed font-medium">
            {alert.description}
          </div>

          {/* Mandatory Emergency Directives */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <Radio className="w-4 h-4 text-red-600" />
              <span>Mandatory Protective Instructions:</span>
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {alert.instructions?.map((inst, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 flex items-start space-x-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold text-2xs flex items-center justify-center flex-shrink-0 mt-0.2">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{inst}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Helpline Strip */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="space-y-0.5">
              <span className="text-2xs font-bold text-amber-400 uppercase tracking-wider block">
                24x7 State Emergency Operations Center (SEOC)
              </span>
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span className="text-base font-black text-white">
                  Toll-Free Dial: <strong>{alert.helpline}</strong> / <strong>112</strong>
                </span>
              </div>
              <span className="text-2xs text-slate-400 block font-mono">
                Direct Control Room: {alert.deocPhone}
              </span>
            </div>

            <a
              href={`tel:${alert.helpline}`}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md self-start sm:self-center"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Helpline Now</span>
            </a>
          </div>
        </div>

        {/* Action Footer Buttons */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Link
              to="/safety"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 transition text-center shadow-2xs"
            >
              <span>Evacuation Steps & Go-Bag</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/map"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 transition text-center shadow-2xs"
            >
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>View Danger Pin on Map</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>I Acknowledge Emergency Warning</span>
          </button>
        </div>
      </div>
    </div>
  );
}
