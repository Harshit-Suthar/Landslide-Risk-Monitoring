import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  Radio,
  Clock,
  MapPin,
  Search,
  Filter,
  PhoneCall,
  Share2,
  CheckCircle2,
  ArrowRight,
  Send,
  ExternalLink,
} from 'lucide-react';

const INITIAL_ALERTS = [
  {
    id: 'alt-001',
    tier: 'Red Alert',
    title: 'Critical Slope Collapse & Mass Debris Flow — NH-29 Kohima By-Pass',
    district: 'Kohima',
    state: 'Nagaland',
    category: 'Highway Severed',
    timestamp: '28 minutes ago',
    validUntil: 'Until 18:00 hrs, September 22, 2026',
    issuedBy: 'Nagaland State Disaster Management Authority (NSDMA)',
    description:
      'Massive rockfall and rotational mudslide has breached both carriage lanes near Pagla Pahar and Old KMC dumping ground. Heavy vehicular transit is suspended immediately. Commuters are advised to divert via Medziphema-Niuland route.',
    actionRequired: 'Avoid corridor entirely. Heavy earth-movers deployed. Toll-free helpline 1070 active.',
    status: 'Active',
  },
  {
    id: 'alt-002',
    tier: 'Red Alert',
    title: 'Catastrophic Fissure Expansion — Durtlang Hills Sector 4',
    district: 'Aizawl',
    state: 'Mizoram',
    category: 'Residential Evacuation',
    timestamp: '1 hour ago',
    validUntil: 'Until 12:00 hrs, September 23, 2026',
    issuedBy: 'Disaster Management & Rehabilitation Dept, Mizoram',
    description:
      'Continuous antecedent precipitation of 142mm has widened vertical tension cracks to over 18 inches across the upper escarpment. Sub-surface sensors indicate immediate risk of planar rock slide threatening 28 hillside dwellings.',
    actionRequired: 'Immediate evacuation of residents within 200m buffer zone to Government Higher Secondary School relief shelter.',
    status: 'Active',
  },
  {
    id: 'alt-003',
    tier: 'Orange Alert',
    title: 'Pore-Water Saturation Hazard — Nongthymmai Ridge & Polo Valley',
    district: 'Shillong',
    state: 'Meghalaya',
    category: 'Slope Subsidence',
    timestamp: '3 hours ago',
    validUntil: 'Until 20:00 hrs, September 22, 2026',
    issuedBy: 'State Emergency Operations Center (SEOC), Meghalaya',
    description:
      'High saturation of sandstone regolith. Inclinometers registered 4.2mm lateral displacement over the last 12 hours. Surface runoff is overflowing municipal catchments.',
    actionRequired: 'Hillside property owners advised to clear blocked downspouts and report new building fractures.',
    status: 'Active',
  },
  {
    id: 'alt-004',
    tier: 'Orange Alert',
    title: 'Stream Bank Erosion & Toe Cutting — Kangchup Foothills',
    district: 'Imphal',
    state: 'Manipur',
    category: 'Erosion & Mudflow',
    timestamp: '5 hours ago',
    validUntil: 'Until 06:00 hrs, September 23, 2026',
    issuedBy: 'Relief & Disaster Management, Govt. of Manipur',
    description:
      'Surging river discharge has undercut natural slope berms. Localized slumping detected along secondary access roads.',
    actionRequired: 'Light vehicles only. Heavy freight transit prohibited on hill roads.',
    status: 'Active',
  },
  {
    id: 'alt-005',
    tier: 'Yellow Alert',
    title: 'Pre-Monsoon Hydro-Geological Watch — Banderdewa Escarpment',
    district: 'Itanagar',
    state: 'Arunachal Pradesh',
    category: 'Advisory Monitoring',
    timestamp: '8 hours ago',
    validUntil: 'Until September 24, 2026',
    issuedBy: 'Department of Disaster Management, Arunachal Pradesh',
    description:
      'IMD forecasts moderate-to-heavy rainfall bands over Papum Pare district. Roadside cuttings remain vulnerable to minor loose gravel fall.',
    actionRequired: 'Drivers should proceed with reduced speed and maintain headlights during rain.',
    status: 'Active',
  },
  {
    id: 'alt-006',
    tier: 'Yellow Alert',
    title: 'Sub-surface Seepage Watch — Tathangchen Ward Ridge',
    district: 'Gangtok',
    state: 'Sikkim',
    category: 'Advisory Monitoring',
    timestamp: '12 hours ago',
    validUntil: 'Until September 24, 2026',
    issuedBy: 'Sikkim State Disaster Management Authority (SSDMA)',
    description:
      'Elevated water table detected in piezometer array PZ-4. Retaining structures are functioning within safe limits.',
    actionRequired: 'Field teams conducting 6-hourly geotechnical inspections.',
    status: 'Active',
  },
];

export default function AlertsBulletin() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [selectedTier, setSelectedTier] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const filteredAlerts = alerts.filter((alt) => {
    const matchesTier = selectedTier === 'All' || alt.tier === selectedTier;
    const matchesSearch =
      alt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alt.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alt.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const handleShare = (alt) => {
    const text = `[${alt.tier}] ${alt.title} (${alt.district}, ${alt.state}) - ${alt.actionRequired}. Check live updates: ${window.location.origin}/alerts`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(alt.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 bg-red-500/10 text-red-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>Official Emergency Early Warning Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Active Landslide Warnings & Emergency Bulletins
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time hazard notifications synchronized with State Disaster Management Authorities and District Emergency Operation Centers
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/citizen/report"
            className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report Slope Anomaly</span>
          </Link>
        </div>
      </div>

      {/* Control Bar: Tier Filter + Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Tier Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['All', 'Red Alert', 'Orange Alert', 'Yellow Alert'].map((tier) => {
            const isSelected = selectedTier === tier;
            return (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? tier === 'Red Alert'
                      ? 'bg-red-600 text-white shadow-xs'
                      : tier === 'Orange Alert'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : tier === 'Yellow Alert'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tier}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by district, road, or state..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-500 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Alert Cards Stream */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500 text-xs">
            No active bulletins matching your filter criteria.
          </div>
        ) : (
          filteredAlerts.map((alt) => {
            const isRed = alt.tier === 'Red Alert';
            const isOrange = alt.tier === 'Orange Alert';

            return (
              <div
                key={alt.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-xs transition hover:shadow-md ${
                  isRed
                    ? 'border-red-300 ring-1 ring-red-200'
                    : isOrange
                    ? 'border-amber-300 ring-1 ring-amber-100'
                    : 'border-slate-200'
                }`}
              >
                {/* Header Strip */}
                <div
                  className={`px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-xs ${
                    isRed
                      ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white'
                      : isOrange
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="font-black uppercase tracking-wider">{alt.tier}</span>
                    <span>&bull;</span>
                    <span>{alt.category}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-2xs opacity-90">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{alt.timestamp}</span>
                    </span>
                    <span>|</span>
                    <span>{alt.validUntil}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                        {alt.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span>{alt.district}, {alt.state}</span>
                        <span>&bull;</span>
                        <span className="text-slate-400">Issued by: {alt.issuedBy}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleShare(alt)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition self-start cursor-pointer"
                    >
                      {copiedId === alt.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>Share Bulletin</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    {alt.description}
                  </p>

                  {/* Immediate Action Directive */}
                  <div
                    className={`p-4 rounded-2xl flex items-start space-x-3 text-xs ${
                      isRed
                        ? 'bg-red-50 border border-red-200 text-red-950 font-medium'
                        : isOrange
                        ? 'bg-amber-50 border border-amber-200 text-amber-950 font-medium'
                        : 'bg-blue-50 border border-blue-200 text-blue-950'
                    }`}
                  >
                    <AlertTriangle
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        isRed ? 'text-red-600' : isOrange ? 'text-amber-600' : 'text-blue-600'
                      }`}
                    />
                    <div>
                      <strong className="font-bold block mb-0.5">Mandatory Advisory Action:</strong>
                      <span>{alt.actionRequired}</span>
                    </div>
                  </div>

                  {/* Quick Action Footer */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2 text-slate-500">
                      <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                      <span>Control Room Toll-Free: <strong>1070</strong> (State EOC)</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Link
                        to="/map"
                        className="text-slate-700 hover:text-slate-900 font-semibold flex items-center space-x-1"
                      >
                        <span>View on GIS Map</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to="/safety"
                        className="text-amber-700 hover:text-amber-800 font-bold flex items-center space-x-1"
                      >
                        <span>Evacuation Steps</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
