import React, { useState, useEffect } from 'react';
import { Plus, Mountain, Filter, Search } from 'lucide-react';
import LocationTable from '../../components/admin/LocationTable';
import LocationModal from '../../components/admin/LocationModal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { landslideService } from '../../services/landslideService';
import { useToast } from '../../layouts/AdminLayout';

const DISTRICTS = [
  'All Districts',
  'Guwahati',
  'Shillong',
  'Itanagar',
  'Kohima',
  'Aizawl',
  'Agartala',
  'Imphal',
  'Gangtok',
];

const RISK_LEVELS = ['All Levels', 'Critical', 'High', 'Medium', 'Low'];
const STATUSES = ['All Statuses', 'Monitored', 'Resolved'];

export default function Landslides() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [riskFilter, setRiskFilter] = useState('All Levels');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Modals
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await landslideService.getLocations();
      setLocations(data);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setError(err.message || 'Could not load landslide monitoring points.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Filter logic
  const filteredLocations = locations.filter((loc) => {
    const matchesSearch =
      loc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDistrict =
      districtFilter === 'All Districts' || loc.district === districtFilter;

    const matchesRisk =
      riskFilter === 'All Levels' || loc.risk_level === riskFilter;

    const matchesStatus =
      statusFilter === 'All Statuses' || loc.status === statusFilter;

    return matchesSearch && matchesDistrict && matchesRisk && matchesStatus;
  });

  const handleOpenCreateModal = () => {
    setSelectedLocation(null);
    setIsLocationModalOpen(true);
  };

  const handleOpenEditModal = (loc) => {
    setSelectedLocation(loc);
    setIsLocationModalOpen(true);
  };

  const handleOpenDeleteModal = (loc) => {
    setLocationToDelete(loc);
    setIsDeleteModalOpen(true);
  };

  const handleSaveLocation = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedLocation) {
        await landslideService.updateLocation(selectedLocation.id, formData);
        showToast(`Updated location ${formData.name}`, 'success');
      } else {
        await landslideService.createLocation(formData);
        showToast(`Added new monitoring point ${formData.name}`, 'success');
      }
      setIsLocationModalOpen(false);
      await fetchLocations();
    } catch (err) {
      console.error('Save location failed:', err);
      showToast(err.message || 'Failed to save location.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLocation = async () => {
    if (!locationToDelete) return;
    setIsSubmitting(true);
    try {
      await landslideService.deleteLocation(locationToDelete.id);
      showToast(`Location ${locationToDelete.name} removed.`, 'success');
      setIsDeleteModalOpen(false);
      setLocationToDelete(null);
      await fetchLocations();
    } catch (err) {
      console.error('Delete location failed:', err);
      showToast(err.message || 'Failed to delete location.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Mountain className="w-7 h-7 text-amber-500" />
            Landslide Incidents & Locations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registered vulnerable slopes, GPS markers, hazard classifications, and active field sensors
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Location</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by slope, district, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* District */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-700"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Risk Level */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-700"
          >
            {RISK_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-700"
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table / Content */}
      {isLoading ? (
        <Loading message="Loading monitored landslide sites..." />
      ) : error ? (
        <ErrorMessage
          title="Could not load locations"
          message={error}
          onRetry={fetchLocations}
        />
      ) : (
        <LocationTable
          locations={filteredLocations}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
        />
      )}

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        location={selectedLocation}
        onClose={() => setIsLocationModalOpen(false)}
        onSave={handleSaveLocation}
        isLoading={isSubmitting}
      />

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Remove Monitoring Location"
        message={`Are you sure you want to remove "${locationToDelete?.name}" (${locationToDelete?.district})? Telemetry history will be archived.`}
        confirmText="Yes, Remove Location"
        onConfirm={handleDeleteLocation}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}
