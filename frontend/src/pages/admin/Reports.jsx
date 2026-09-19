import React, { useState } from 'react';
import {
  FileText,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Image as ImageIcon,
  MapPin,
  X,
  Phone,
} from 'lucide-react';
import reportService from '../../services/reportService';
import { useToast } from '../../layouts/AdminLayout';

export default function Reports() {
  const [reports, setReports] = useState(reportService.getReports());
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);

  const { showToast } = useToast();

  const filteredReports = reports.filter((r) => {
    if (statusFilter === 'All') return true;
    return r.status === statusFilter;
  });

  const handleStatusChange = (id, newStatus) => {
    reportService.updateReportStatus(id, newStatus);
    setReports(reportService.getReports());
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport({ ...selectedReport, status: newStatus });
    }
    showToast(`Report #${id} marked as ${newStatus}`, 'success');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-amber-500" />
            Citizen & Field Incident Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review ground-level eyewitness accounts, crack reports, and verify field agent submissions
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Filter Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-700 shadow-xs"
          >
            <option value="All">All Reports</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Reporter</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Photo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{report.reporterName}</div>
                    <div className="text-xs text-slate-400">{report.reporterContact}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>{report.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-600 line-clamp-2 max-w-xs">
                      {report.description}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 hover:opacity-80 transition bg-slate-100 flex items-center justify-center cursor-pointer"
                      title="Click to view image"
                    >
                      {report.photoUrl ? (
                        <img
                          src={report.photoUrl}
                          alt="Hazard site"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {report.submittedDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        title="View Report Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(report.id, 'Verified')}
                        disabled={report.status === 'Verified'}
                        className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition disabled:opacity-30"
                        title="Verify Report"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(report.id, 'Rejected')}
                        disabled={report.status === 'Rejected'}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition disabled:opacity-30"
                        title="Reject Report"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between mb-4 pr-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Incident Report #{selectedReport.id}
                </h3>
                <span className="text-xs text-slate-400">
                  Submitted {selectedReport.submittedDate}
                </span>
              </div>
              <div>{getStatusBadge(selectedReport.status)}</div>
            </div>

            {/* Photo Preview */}
            <div className="rounded-xl overflow-hidden border border-slate-200 mb-4 bg-slate-900 h-64 flex items-center justify-center">
              <img
                src={selectedReport.photoUrl}
                alt="Full report preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Information Grid */}
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs">
                <div>
                  <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">
                    Reporter Name
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedReport.reporterName}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">
                    Contact Phone
                  </span>
                  <span className="font-mono text-slate-700">
                    {selectedReport.reporterContact}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 text-xs block mb-1">
                  Location
                </span>
                <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>{selectedReport.location}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 text-xs block mb-1">
                  Eyewitness Observation
                </span>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Close
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedReport.id, 'Rejected')}
                  className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition border border-red-200"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedReport.id, 'Verified')}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-md shadow-emerald-600/20"
                >
                  Verify Incident
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
