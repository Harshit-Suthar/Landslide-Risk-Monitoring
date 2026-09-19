import React, { useState, useEffect } from 'react';
import { X, Mountain, MapPin, Compass, AlertCircle, FileText } from 'lucide-react';

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

const RISK_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Monitored', 'Resolved'];

export default function LocationModal({
  isOpen,
  location = null,
  onClose,
  onSave,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: '',
    district: 'Shillong',
    latitude: '',
    longitude: '',
    risk_level: 'High',
    description: '',
    status: 'Monitored',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || '',
        district: location.district || 'Shillong',
        latitude: location.latitude !== undefined ? String(location.latitude) : '',
        longitude: location.longitude !== undefined ? String(location.longitude) : '',
        risk_level: location.risk_level || 'High',
        description: location.description || '',
        status: location.status || 'Monitored',
      });
    } else {
      setFormData({
        name: '',
        district: 'Shillong',
        latitude: '25.5682',
        longitude: '91.8933',
        risk_level: 'High',
        description: '',
        status: 'Monitored',
      });
    }
    setErrors({});
  }, [location, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Location name is required';
    if (!formData.latitude.trim() || isNaN(Number(formData.latitude))) {
      newErrors.latitude = 'Valid latitude is required (-90 to 90)';
    }
    if (!formData.longitude.trim() || isNaN(Number(formData.longitude))) {
      newErrors.longitude = 'Valid longitude is required (-180 to 180)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900">
            {location ? 'Edit Landslide Monitoring Point' : 'Add Monitoring Point'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {location
              ? 'Update GPS coordinates, slope condition, and risk level'
              : 'Add a new vulnerable slope or active landslide observation point'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Location Name
            </label>
            <div className="relative">
              <Mountain className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Nongthymmai Ridge"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              />
            </div>
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* District & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                District
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-white"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Monitoring Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-white"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Latitude (°N)
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="25.5682"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
              </div>
              {errors.latitude && <p className="text-xs text-red-600 mt-1">{errors.latitude}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Longitude (°E)
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="91.8933"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
              </div>
              {errors.longitude && <p className="text-xs text-red-600 mt-1">{errors.longitude}</p>}
            </div>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Assessed Risk Level
            </label>
            <div className="relative">
              <AlertCircle className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={formData.risk_level}
                onChange={(e) => setFormData({ ...formData, risk_level: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-white"
              >
                {RISK_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes / Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Notes & Slope Assessment
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Observed fissures, recent rockfall, drainage seepage condition..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-sm font-medium text-slate-950 bg-amber-500 hover:bg-amber-600 rounded-xl transition shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : location ? 'Save Changes' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
