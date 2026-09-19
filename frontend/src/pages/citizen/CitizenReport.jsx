import React, { useState, useRef } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import {
  AlertTriangle,
  MapPin,
  Compass,
  UploadCloud,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileCheck2,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { reportService } from '../../services/reportService';
import { useCitizenToast } from '../../layouts/CitizenLayout';

const INCIDENT_TYPES = [
  'Landslide',
  'Slope Crack',
  'Road Blockage',
  'Flooding',
  'Other',
];

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

const SEVERITY_LEVELS = [
  {
    value: 'Minor',
    label: 'Minor',
    description: 'Surface soil wash, small cracks, no immediate obstruction',
    color: 'emerald',
    borderClass: 'border-emerald-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-50/50',
    dotClass: 'bg-emerald-500',
  },
  {
    value: 'Moderate',
    label: 'Moderate',
    description: 'Partial road blockage, widening fissures, localized mudflow',
    color: 'amber',
    borderClass: 'border-amber-300 peer-checked:border-amber-500 peer-checked:bg-amber-50/50',
    dotClass: 'bg-amber-500',
  },
  {
    value: 'Severe',
    label: 'Severe',
    description: 'Major slope collapse, complete road cut, threat to dwellings',
    color: 'red',
    borderClass: 'border-red-300 peer-checked:border-red-500 peer-checked:bg-red-50/50',
    dotClass: 'bg-red-500',
  },
];

export default function CitizenReport() {
  const context = useOutletContext() || {};
  const user = context.user;
  const userDistrict = context.district || 'Shillong';
  const { showToast } = useCitizenToast();
  const navigate = useNavigate();

  // Form State
  const [incidentType, setIncidentType] = useState('Landslide');
  const [district, setDistrict] = useState(userDistrict);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationSuccessMessage, setLocationSuccessMessage] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Moderate');

  // Media File State
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mediaType, setMediaType] = useState('image');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [formError, setFormError] = useState(null);

  // Geolocation Handler
  const handleDetectLocation = () => {
    setLocationError(null);
    setLocationSuccessMessage(null);

    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setLatitude(lat);
        setLongitude(lng);
        setIsDetectingLocation(false);
        setLocationSuccessMessage(`GPS Fixed: ${lat}°N, ${lng}°E (Accuracy: ~${Math.round(pos.coords.accuracy)}m)`);
      },
      (err) => {
        setIsDetectingLocation(false);
        console.warn('Geolocation error:', err);
        setLocationError(
          err.code === 1
            ? 'Location permission denied. You may enter approximate coordinates manually or rely on district tagging.'
            : 'Unable to acquire satellite GPS fix. Please check location settings.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // File Handlers
  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    // Validate size (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setFormError('File size exceeds the 50MB limit.');
      return;
    }

    const isVideo = selectedFile.type.startsWith('video/');
    const isImage = selectedFile.type.startsWith('image/');

    if (!isImage && !isVideo) {
      setFormError('Please select a valid image (JPG, PNG, WEBP) or video (MP4, WEBM).');
      return;
    }

    setFormError(null);
    setFile(selectedFile);
    setMediaType(isVideo ? 'video' : 'image');

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveMedia = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!description.trim()) {
      setFormError('Please provide a brief description of the observed hazard.');
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedMediaUrl = null;

      // 1. Upload to Supabase Storage 'incident-media' bucket if a file is attached
      if (file) {
        const uploadResult = await storageService.uploadMedia(file, 'reports');
        uploadedMediaUrl = uploadResult.publicUrl;
      }

      // 2. Insert row into Supabase 'reports' table
      const reportPayload = {
        user_id: user?.id || 'citizen-demo-001',
        incident_type: incidentType,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        district: district,
        description: description.trim(),
        media_url: uploadedMediaUrl,
        severity: severity,
        reporterName: context.citizenName || 'Citizen Reporter',
        reporterContact: context.userMetadata?.phone || '',
      };

      const createdReport = await reportService.submitReport(reportPayload);

      showToast('Incident report submitted successfully to emergency dispatch!', 'success');
      setSubmissionSuccess(createdReport);
    } catch (err) {
      console.error('Report submission failed:', err);
      setFormError(err.message || 'Failed to submit report. Please verify connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIncidentType('Landslide');
    setDistrict(userDistrict);
    setLatitude('');
    setLongitude('');
    setLocationSuccessMessage(null);
    setLocationError(null);
    setDescription('');
    setSeverity('Moderate');
    handleRemoveMedia();
    setSubmissionSuccess(null);
    setFormError(null);
  };

  // Confirmation / Success Screen
  if (submissionSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 animate-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Report Submitted Successfully
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Your report has been logged with ID{' '}
              <span className="font-mono font-bold text-slate-800">
                #{submissionSuccess.id || 'NER-' + Date.now().toString().slice(-4)}
              </span>{' '}
              and queued for State Disaster Management Authority verification.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200/80 space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500">Incident Type</span>
              <span className="font-bold text-slate-800">{submissionSuccess.incident_type}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500">District / Region</span>
              <span className="font-bold text-slate-800">{submissionSuccess.district}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500">Assessed Severity</span>
              <span className="font-bold text-slate-800">{submissionSuccess.severity}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Status</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {submissionSuccess.status || 'Pending Verification'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={resetForm}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Report Another Incident</span>
            </button>

            <Link
              to="/citizen/my-reports"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
            >
              <span>View My Reports</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <AlertTriangle className="w-7 h-7 text-amber-500" />
          Report an Incident
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Submit real-time observations to alert district emergency coordinators and fellow citizens of slope failures or road blockages.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Incident Type & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Incident Type <span className="text-red-500">*</span>
              </label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition"
              >
                {INCIDENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                District / State Sector <span className="text-red-500">*</span>
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Geolocation with Auto-Detect */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Location Coordinates (GPS)
                </label>
                <p className="text-[11px] text-slate-500">
                  Acquire high-precision satellite coordinates directly from your device
                </p>
              </div>

              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isDetectingLocation}
                className="inline-flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer self-start sm:self-auto"
              >
                {isDetectingLocation ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                    <span>Detecting GPS...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                    <span>Use my current location</span>
                  </>
                )}
              </button>
            </div>

            {locationSuccessMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{locationSuccessMessage}</span>
              </div>
            )}

            {locationError && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>{locationError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Latitude (°N) {latitude && '(Auto-Detected)'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    readOnly={Boolean(latitude)}
                    placeholder="e.g. 25.5788"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 ${
                      latitude ? 'bg-slate-100 text-slate-800 font-mono font-medium' : 'bg-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Longitude (°E) {longitude && '(Auto-Detected)'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    readOnly={Boolean(longitude)}
                    placeholder="e.g. 91.8933"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 ${
                      longitude ? 'bg-slate-100 text-slate-800 font-mono font-medium' : 'bg-white'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Incident Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe specific hazard indicators: visible tension fissures, rockfall debris, saturated embankment, or lane obstruction..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition leading-relaxed"
            />
          </div>

          {/* 4. Photo/Video Upload with Dropzone */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Photo or Video Evidence
              </label>
              <span className="text-[11px] text-slate-400">
                Uploads to Supabase <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">incident-media</code>
              </span>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition ${
                isDragOver
                  ? 'border-amber-500 bg-amber-50/50'
                  : previewUrl
                  ? 'border-slate-200 bg-slate-50/40'
                  : 'border-slate-300 hover:border-amber-400 bg-slate-50/60 hover:bg-amber-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="hidden"
              />

              {previewUrl ? (
                <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                  <div className="relative inline-block max-w-full">
                    {mediaType === 'video' ? (
                      <video
                        src={previewUrl}
                        controls
                        className="max-h-56 rounded-xl mx-auto shadow-sm border border-slate-200"
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Incident Preview"
                        className="max-h-56 rounded-xl mx-auto object-cover shadow-sm border border-slate-200"
                      />
                    )}

                    <button
                      type="button"
                      onClick={handleRemoveMedia}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition"
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-600 font-medium">
                    {file?.name} ({(file?.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-amber-600 hover:text-amber-700 underline font-semibold"
                  >
                    Replace with another photo or video
                  </button>
                </div>
              ) : (
                <div className="py-4 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Click to choose photo or video, or drag and drop here
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Accepts JPG, PNG, WEBP, MP4, WEBM (Max 50MB)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. Severity Self-Assessment Radio Buttons */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Severity Assessment <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SEVERITY_LEVELS.map((level) => {
                const isChecked = severity === level.value;
                return (
                  <label
                    key={level.value}
                    className={`relative p-3.5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                      isChecked
                        ? level.value === 'Severe'
                          ? 'border-red-500 bg-red-50/50 shadow-xs'
                          : level.value === 'Moderate'
                          ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                          : 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={level.value}
                      checked={isChecked}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="sr-only"
                    />

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">
                          {level.label}
                        </span>
                        <span
                          className={`w-3 h-3 rounded-full ${level.dotClass}`}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {level.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <Link
              to="/citizen/home"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Uploading & Submitting...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4 text-slate-950" />
                  <span>Submit Incident Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
