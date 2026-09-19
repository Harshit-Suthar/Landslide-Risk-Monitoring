import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Compass,
  Video,
  Image as ImageIcon,
  Plus,
  Filter,
  ArrowRight,
  ShieldCheck,
  AlertOctagon,
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import Loading from '../../components/common/Loading';

export default function CitizenMyReports() {
  const context = useOutletContext() || {};
  const user = context.user;
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await reportService.getUserReports(user?.id);
      setReports(data || []);
    } catch (err) {
      console.error('Failed to fetch user reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user?.id]);

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'All') return true;
    return r.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  const getStatusBadge = (status) => {
    const normalized = (status || 'Pending').toLowerCase();
    switch (normalized) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
    }
  };

  const getSeverityBadge = (severity) => {
    const norm = (severity || 'Moderate').toLowerCase();
    if (norm === 'severe' || norm === 'critical' || norm === 'high') {
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-800">Severe</span>;
    }
    if (norm === 'minor' || norm === 'low') {
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">Minor</span>;
    }
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">Moderate</span>;
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-amber-500" />
            My Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track the verification progress of your submitted slope and hazard eyewitness accounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filters */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
            {['All', 'Pending', 'Verified', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  filterStatus === status
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <Link
            to="/citizen/report"
            className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Report</span>
          </Link>
        </div>
      </div>

      {/* Reports Feed */}
      {isLoading ? (
        <div className="py-16">
          <Loading message="Loading your submitted reports..." />
        </div>
      ) : filteredReports.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900">
              {filterStatus === 'All'
                ? "You haven't submitted any reports yet"
                : `No ${filterStatus} reports found`}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Help your local community stay safe by reporting slope cracks, rockfalls, or blocked hillside roadways.
            </p>
          </div>
          <div>
            <Link
              to="/citizen/report"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Report an Incident</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map((report) => {
            const mediaSrc = report.media_url || report.photoUrl;
            const isVideo = report.mediaType === 'video' || (mediaSrc && mediaSrc.endsWith('.mp4'));

            return (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-amber-300 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                <div>
                  {/* Card Media Preview Header */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden border-b border-slate-100">
                    {mediaSrc ? (
                      isVideo ? (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                          <Video className="w-8 h-8 text-amber-400" />
                          <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-slate-900/80 text-white px-2 py-0.5 rounded-md">
                            Video Attachment
                          </span>
                        </div>
                      ) : (
                        <img
                          src={mediaSrc}
                          alt="Incident thumbnail"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-[11px] font-medium">No media attached</span>
                      </div>
                    )}

                    {/* Floating Status Badge */}
                    <div className="absolute top-3 right-3 shadow-xs">
                      {getStatusBadge(report.status)}
                    </div>

                    {/* Incident Type Pill */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 border border-slate-200/80 shadow-xs flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{report.incident_type || 'Incident'}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span className="truncate">{report.district || 'NER Region'}</span>
                      </div>
                      <div>{getSeverityBadge(report.severity)}</div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDisplayDate(report.created_at || report.submittedDate)}</span>
                  </div>

                  <span className="font-semibold text-amber-600 group-hover:text-amber-700 flex items-center space-x-1">
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 space-y-5">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center justify-between pr-8 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Report #{selectedReport.id}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  {selectedReport.incident_type || 'Landslide Report'}
                </h3>
              </div>
              <div>{getStatusBadge(selectedReport.status)}</div>
            </div>

            {/* Larger Media Preview */}
            {(selectedReport.media_url || selectedReport.photoUrl) ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-72 flex items-center justify-center">
                {selectedReport.mediaType === 'video' || (selectedReport.media_url && selectedReport.media_url.endsWith('.mp4')) ? (
                  <video
                    src={selectedReport.media_url || selectedReport.photoUrl}
                    controls
                    className="max-h-72 w-full object-contain"
                  />
                ) : (
                  <img
                    src={selectedReport.media_url || selectedReport.photoUrl}
                    alt="Full incident preview"
                    className="max-h-72 w-full object-cover"
                  />
                )}
              </div>
            ) : null}

            {/* Incident Details Grid */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    District
                  </span>
                  <span className="font-bold text-slate-800 text-sm">
                    {selectedReport.district}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Assessed Severity
                  </span>
                  <div className="mt-0.5">{getSeverityBadge(selectedReport.severity)}</div>
                </div>
              </div>

              {(selectedReport.latitude && selectedReport.longitude) && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 flex items-center space-x-2 text-slate-800">
                  <Compass className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="font-mono">
                    GPS Coordinates: {Number(selectedReport.latitude).toFixed(4)}°N, {Number(selectedReport.longitude).toFixed(4)}°E
                  </span>
                </div>
              )}

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Eyewitness Observation
                </span>
                <p className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed text-xs">
                  {selectedReport.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Submitted on {formatDisplayDate(selectedReport.created_at || selectedReport.submittedDate)}</span>
                <span className="italic text-slate-500">
                  {selectedReport.status === 'Verified'
                    ? 'Verified by State EOC / Geological Surveyor'
                    : selectedReport.status === 'Rejected'
                    ? 'Closed after review'
                    : 'Awaiting site inspection'}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
