import React, { useState, useRef } from 'react';
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
  UploadCloud,
  Plus,
  Video,
  Loader2,
} from 'lucide-react';
import reportService from '../../services/reportService';
import storageService from '../../services/storageService';
import { useToast } from '../../layouts/AdminLayout';
import Loading from '../../components/common/Loading';

const DISTRICTS = [
  'Guwahati',
  'Shillong',
  'Itanagar',
  'Kohima',
  'Aizawl',
  'Agartala',
  'Imphal',
  'Gangtok',
];

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadMediaType, setUploadMediaType] = useState('image');
  const [isUploading, setIsUploading] = useState(false);
  const [newReportForm, setNewReportForm] = useState({
    reporterName: '',
    reporterContact: '',
    location: '',
    district: 'Shillong',
    description: '',
    severity: 'High',
  });

  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await reportService.getReports();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load reports:', err);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = Array.isArray(reports)
    ? reports.filter((r) => {
        if (statusFilter === 'All') return true;
        return r.status === statusFilter;
      })
    : [];

  const handleStatusChange = async (id, newStatus) => {
    await reportService.updateReportStatus(id, newStatus);
    await loadReports();
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport({ ...selectedReport, status: newStatus });
    }
    showToast(`Report #${id} marked as ${newStatus}`, 'success');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    setUploadMediaType(isVideo ? 'video' : 'image');
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      showToast('Please attach a photo or video from the incident site.', 'error');
      return;
    }

    if (!newReportForm.reporterName.trim() || !newReportForm.location.trim()) {
      showToast('Please fill in reporter name and location.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to Supabase Storage 'incident-media' bucket
      const uploadResult = await storageService.uploadMedia(uploadFile, 'reports');

      const created = reportService.addReport({
        reporterName: newReportForm.reporterName,
        reporterContact: newReportForm.reporterContact || 'Unspecified',
        location: `${newReportForm.location}, ${newReportForm.district}`,
        district: newReportForm.district,
        description: newReportForm.description,
        photoUrl: uploadResult.publicUrl,
        mediaType: uploadResult.mediaType,
        severity: newReportForm.severity,
      });

      await loadReports();
      showToast(`Media uploaded to 'incident-media' bucket and report #${created.id} logged!`, 'success');
      
      // Reset form
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadPreview(null);
      setNewReportForm({
        reporterName: '',
        reporterContact: '',
        location: '',
        district: 'Shillong',
        description: '',
        severity: 'High',
      });
    } catch (err) {
      console.error('Upload failed:', err);
      showToast(err.message || 'Failed to upload media to Supabase storage.', 'error');
    } finally {
      setIsUploading(false);
    }
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
            Review ground-level eyewitness accounts, uploaded media, and verify field agent submissions
          </p>
        </div>

        {/* Actions: Upload & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-amber-500/20"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Incident Media</span>
          </button>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
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
                <th className="px-6 py-4">Media (Bucket)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <Loading message="Loading incident reports..." />
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center py-6">
                      <FileText className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-sm font-medium text-slate-700">No incident reports found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {statusFilter !== 'All'
                          ? `No reports matching status "${statusFilter}".`
                          : 'No reports have been submitted yet.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
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
                      className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 hover:opacity-85 transition bg-slate-100 flex items-center justify-center cursor-pointer relative group"
                      title="Click to view media"
                    >
                      {report.mediaType === 'video' ? (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-amber-400">
                          <Video className="w-5 h-5" />
                        </div>
                      ) : report.photoUrl ? (
                        <img
                          src={report.photoUrl}
                          alt="Hazard site"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
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
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal to incident-media Bucket */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-500" />
                Upload Incident Media
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload photos or videos directly to the Supabase <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">incident-media</code> public bucket
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Attach Photo or Video (Max 50MB)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-4 text-center cursor-pointer transition bg-slate-50/50 hover:bg-amber-50/30"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {uploadPreview ? (
                    <div className="space-y-2">
                      {uploadMediaType === 'video' ? (
                        <video
                          src={uploadPreview}
                          className="max-h-40 rounded-xl mx-auto"
                          controls
                        />
                      ) : (
                        <img
                          src={uploadPreview}
                          alt="Upload preview"
                          className="max-h-40 rounded-xl mx-auto object-cover"
                        />
                      )}
                      <p className="text-xs text-slate-600 font-medium">
                        {uploadFile?.name} ({(uploadFile?.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                      <span className="text-[11px] text-amber-600 underline">
                        Click to choose another file
                      </span>
                    </div>
                  ) : (
                    <div className="py-4">
                      <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-700">
                        Click to select photo or video
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        JPG, PNG, WEBP, MP4, WEBM
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reporter Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Reporter Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Officer D. Lyngdoh"
                    value={newReportForm.reporterName}
                    onChange={(e) => setNewReportForm({ ...newReportForm, reporterName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98621 ..."
                    value={newReportForm.reporterContact}
                    onChange={(e) => setNewReportForm({ ...newReportForm, reporterContact: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Location & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Specific Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lower Mawlai Highway"
                    value={newReportForm.location}
                    onChange={(e) => setNewReportForm({ ...newReportForm, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    District
                  </label>
                  <select
                    value={newReportForm.district}
                    onChange={(e) => setNewReportForm({ ...newReportForm, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Incident Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail slope fissure, road subsidence, rockfall, or mudflow observations..."
                  value={newReportForm.description}
                  onChange={(e) => setNewReportForm({ ...newReportForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-600 rounded-xl transition shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isUploading ? 'Uploading to Supabase...' : 'Submit & Save Media'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

            {/* Media Preview (Video or Photo) */}
            <div className="rounded-xl overflow-hidden border border-slate-200 mb-4 bg-slate-900 h-64 flex items-center justify-center">
              {selectedReport.mediaType === 'video' ? (
                <video
                  src={selectedReport.photoUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={selectedReport.photoUrl}
                  alt="Full report preview"
                  className="w-full h-full object-cover"
                />
              )}
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
