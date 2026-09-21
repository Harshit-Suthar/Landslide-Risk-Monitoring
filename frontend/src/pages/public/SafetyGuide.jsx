import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Briefcase,
  PhoneCall,
  Volume2,
  Home,
  Mountain,
  Eye,
  ArrowRight,
} from 'lucide-react';

const WARNING_SIGNS = [
  {
    title: 'Doors or Windows Sticking or Jamming',
    desc: 'New difficulty in closing doors or windows indicates the foundations of the house or slope beneath are subtly shifting.',
    severity: 'Early Indicator',
  },
  {
    title: 'Fissures in Ground, Pavement, or Walls',
    desc: 'Cracks appearing on hillsides, driveways, retaining walls, or concrete stairs are clear signs of tension movement.',
    severity: 'Active Movement',
  },
  {
    title: 'Tilting Trees, Utility Poles, or Fences',
    desc: 'Telephone poles, power cables, and trees on slopes leaning downward or curving outward indicate soil creep.',
    severity: 'Escalating Danger',
  },
  {
    title: 'Water Turning Muddy in Local Streams or Springs',
    desc: 'A sudden increase in stream water murkiness, or springs drying up or erupting in new spots, signals underground soil failure.',
    severity: 'Hydrological Trigger',
  },
  {
    title: 'Faint Rumbling Sound That Increases in Volume',
    desc: 'A low rumble or grinding sound like a passing freight train indicates mass soil or boulder displacement uphill.',
    severity: 'Imminent Collapse — Evacuate',
  },
  {
    title: 'Bulging Ground at the Toe of the Slope',
    desc: 'Soil mounding up at the base of a hillside or pavement buckling under compression.',
    severity: 'Severe Structural Failure',
  },
];

const GO_BAG_ITEMS = [
  { id: 'item-1', label: 'Drinking Water (at least 3 liters per person for 3 days)', category: 'Survival' },
  { id: 'item-2', label: 'Non-perishable food (high energy biscuits, dry fruits, canned food)', category: 'Survival' },
  { id: 'item-3', label: 'LED Flashlight / Torch with extra batteries', category: 'Emergency' },
  { id: 'item-4', label: 'Loud Emergency Whistle (to signal search and rescue teams)', category: 'Emergency' },
  { id: 'item-5', label: 'First Aid Kit (bandages, antiseptics, sterile gauze, burn ointments)', category: 'Medical' },
  { id: 'item-6', label: 'Essential Prescription Medicines (at least 7 days supply)', category: 'Medical' },
  { id: 'item-7', label: 'Waterproof pouch with Aadhaar, voter ID, bank passbook, and property papers', category: 'Documents' },
  { id: 'item-8', label: 'Charged Power Bank and smartphone cables', category: 'Communication' },
  { id: 'item-9', label: 'Rain Poncho / Waterproof jacket and sturdy trekking boots', category: 'Clothing' },
  { id: 'item-10', label: 'Emergency Cash (small denomination notes in a sealed zip-lock bag)', category: 'Financial' },
];

export default function SafetyGuide() {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleItem = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / GO_BAG_ITEMS.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
            <span>Community Disaster Preparedness Manual</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Landslide Safety & Evacuation Protocols
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Standard operating procedures, warning signs detection, and emergency survival guides tailored for hilly North East terrains
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/citizen/report"
            className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report Hazard in Your Area</span>
          </Link>
        </div>
      </div>

      {/* 6 Early Warning Signs Grid */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900">Critical Warning Signs to Watch For</h2>
        </div>
        <p className="text-xs text-slate-500 max-w-3xl">
          Most landslides do not happen without prior physical indicators. Inspect your property and slope surroundings following heavy rainfall.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WARNING_SIGNS.map((sign, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-sm transition space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </span>
                <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {sign.severity}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{sign.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{sign.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Phase Action Plan: Before, During, After */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <Mountain className="w-5 h-5 text-sky-600" />
          <span>Action Protocol: Before, During & After a Landslide</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Before */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
              <span className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-xs">
                01
              </span>
              <h3 className="font-bold text-slate-900 text-base">BEFORE: Preparedness</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <span>Keep hillside rainwater drainages and weepholes clear of fallen leaves and mud.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <span>Identify at least two evacuation routes away from steep slopes to open high ground.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <span>Plant deep-rooted native grass and trees (like bamboo and alder) on vulnerable slopes.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <span>Pack your Emergency Go-Bag and store it near the main door.</span>
              </li>
            </ul>
          </div>

          {/* During */}
          <div className="bg-white rounded-3xl border border-amber-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                02
              </span>
              <h3 className="font-bold text-slate-900 text-base">DURING: Evacuation</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Evacuate immediately without delaying to gather belongings if rumbling is heard.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Move perpendicular (sideways) to the flow direction, never run downhill in the path.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>If trapped inside a home, curl into a tight ball and protect your head under heavy furniture.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Avoid river valleys, gulches, and low culverts where flash mudflows funnel.</span>
              </li>
            </ul>
          </div>

          {/* After */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                03
              </span>
              <h3 className="font-bold text-slate-900 text-base">AFTER: Recovery</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Stay clear of the slide zone &mdash; secondary slides and sudden collapses often follow.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Check for injured or trapped persons and notify NDRF / SDRF teams (Dial 1070).</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Inspect electrical lines, gas connections, and water mains for breaches before entering.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Submit real-time geo-tagged photos via the Citizen Portal to assist rescue teams.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Emergency Go-Bag Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl font-bold text-slate-900">Interactive 72-Hour Emergency Go-Bag Checklist</h3>
            </div>
            <p className="text-xs text-slate-500">
              Every household in steep terrain must maintain a grab-and-go kit ready at all times.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-center">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-700 block">Kit Preparedness</span>
              <span className="text-sm font-black text-amber-600">{completedCount} of {GO_BAG_ITEMS.length} Ready ({progressPercent}%)</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-amber-200 flex items-center justify-center font-bold text-xs text-amber-800">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GO_BAG_ITEMS.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <label
                key={item.id}
                className={`p-3.5 rounded-2xl border transition flex items-center space-x-3 cursor-pointer ${
                  isChecked
                    ? 'bg-emerald-50/70 border-emerald-300 text-slate-900'
                    : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(item.id)}
                  className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <div className="flex-1 text-xs">
                  <span className={`font-semibold block ${isChecked ? 'line-through text-slate-500' : ''}`}>
                    {item.label}
                  </span>
                  <span className="text-2xs text-slate-400 uppercase tracking-wider">{item.category}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Do's and Don'ts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-200 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>DO's during Heavy Monsoon Seasons</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <li>&bull; Check local IMD rainfall telemetry and early warning bulletins before embarking on mountain journeys.</li>
            <li>&bull; Listen for unusual sounds like trees cracking or boulders knocking together.</li>
            <li>&bull; Keep drains and culverts unobstructed to ensure free downhill water drainage.</li>
            <li>&bull; Follow police and district disaster advisories for highway detours immediately.</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-red-50/50 border border-red-200 space-y-3">
          <div className="flex items-center space-x-2 text-red-800 font-bold text-base">
            <XCircle className="w-5 h-5 text-red-600" />
            <span>DON'Ts during Mountain Rainfalls</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <li>&bull; <strong>DO NOT</strong> build houses or cut road toes into steep slopes without engineered retaining walls.</li>
            <li>&bull; <strong>DO NOT</strong> sleep in rooms adjacent to the upslope wall of the house during severe storms.</li>
            <li>&bull; <strong>DO NOT</strong> drive through flooded culverts or across active road fractures.</li>
            <li>&bull; <strong>DO NOT</strong> return to an evacuated building until cleared by district engineers.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
