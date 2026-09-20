// Service for Citizen and Field Incident Reports
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const CITIZEN_REPORTS_KEY = 'ner_citizen_reports';

// Initial sample reports for demonstration
const INITIAL_DEMO_REPORTS = [
  {
    id: 'rep-101',
    user_id: 'citizen-demo-001',
    incident_type: 'Slope Crack',
    latitude: 23.7312,
    longitude: 92.7198,
    district: 'Aizawl',
    description: 'Fresh 3-inch fissures opening along the rear compound wall of the community hall after torrential rain.',
    media_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80',
    severity: 'Severe',
    status: 'Pending',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    reporterName: 'Priya Sharma',
    reporterContact: '+91 98621 55432',
    location: 'Durtlang North Hillside, Aizawl',
    submittedDate: '2 hours ago',
  },
  {
    id: 'rep-102',
    user_id: 'citizen-demo-001',
    incident_type: 'Landslide',
    latitude: 25.5788,
    longitude: 91.8933,
    district: 'Shillong',
    description: 'Mudflow spilled across the lower bypass road. Small boulders rolling down from the quarry area.',
    media_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    severity: 'Severe',
    status: 'Verified',
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    reporterName: 'Priya Sharma',
    reporterContact: '+91 98621 55432',
    location: 'Mawkhar-Laitumkhrah Link, Shillong',
    submittedDate: '8 hours ago',
  },
  {
    id: 'rep-103',
    user_id: 'citizen-other',
    incident_type: 'Road Blockage',
    latitude: 25.6747,
    longitude: 94.1103,
    district: 'Kohima',
    description: 'Roadbed sinking by 12cm. Geotextile membrane exposed under the culvert on NH-29.',
    media_url: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80',
    severity: 'Moderate',
    status: 'Verified',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    reporterName: 'Kiphire Field Post',
    reporterContact: '+91 87310 99231',
    location: 'NH-29 Milepost 44, Kohima',
    submittedDate: 'Yesterday',
  },
  {
    id: 'rep-104',
    user_id: 'citizen-demo-001',
    incident_type: 'Flooding',
    latitude: 26.1664,
    longitude: 91.7056,
    district: 'Guwahati',
    description: 'Severe water accumulation on terraced backyard causing soil washout towards access road.',
    media_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    severity: 'Minor',
    status: 'Rejected',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    reporterName: 'Priya Sharma',
    reporterContact: '+91 98621 55432',
    location: 'Noonmati Hills, Guwahati',
    submittedDate: '2 days ago',
  },
];

function getStoredReports() {
  const data = localStorage.getItem(CITIZEN_REPORTS_KEY);
  if (!data) {
    localStorage.setItem(CITIZEN_REPORTS_KEY, JSON.stringify(INITIAL_DEMO_REPORTS));
    return INITIAL_DEMO_REPORTS;
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error('Error parsing stored reports:', err);
    return INITIAL_DEMO_REPORTS;
  }
}

function saveStoredReports(reports) {
  localStorage.setItem(CITIZEN_REPORTS_KEY, JSON.stringify(reports));
}

export const reportService = {
  /**
   * Submit a new citizen incident report to Supabase "reports" table
   * with local storage fallback
   */
  async submitReport({
    user_id,
    incident_type,
    latitude,
    longitude,
    district,
    description,
    media_url,
    severity = 'Moderate',
    reporterName,
    reporterContact,
  }) {
    const payload = {
      user_id: user_id || null,
      incident_type,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      district: district || 'Shillong',
      description,
      media_url: media_url || null,
      severity,
      status: 'Pending',
      created_at: new Date().toISOString(),
    };

    // 1. If Supabase is configured, insert to Supabase 'reports' table
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .insert([payload])
          .select();

        if (error) {
          console.warn('Supabase reports insert error, fallback to local:', error.message);
        } else if (data && data[0]) {
          const inserted = data[0];
          // Also save in local cache for offline views
          const localList = getStoredReports();
          saveStoredReports([inserted, ...localList]);
          return inserted;
        }
      } catch (err) {
        console.warn('Supabase reports insert exception, using local:', err);
      }
    }

    // 2. Demo fallback
    const newReport = {
      id: 'rep-' + Date.now().toString(36),
      ...payload,
      reporterName: reporterName || 'Citizen Reporter',
      reporterContact: reporterContact || '',
      location: `${district} Sector`,
      submittedDate: 'Just now',
    };

    const current = getStoredReports();
    const updated = [newReport, ...current];
    saveStoredReports(updated);
    return newReport;
  },

  /**
   * Fetch reports for a specific logged-in citizen
   */
  async getUserReports(userId) {
    // 1. Supabase query if configured
    if (isSupabaseConfigured && supabase && userId) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data;
        }
        console.warn('Supabase getUserReports error, checking local store:', error?.message);
      } catch (err) {
        console.warn('Supabase getUserReports exception:', err);
      }
    }

    // 2. Local fallback
    const allReports = getStoredReports();
    if (!userId) return allReports;

    // Filter by userId, fallback to demo user, or include reports submitted in this session
    const userReports = allReports.filter(
      r => r.user_id === userId || r.user_id === 'citizen-demo-001' || !r.user_id
    );
    return userReports.length > 0 ? userReports : allReports;
  },

  /**
   * Fetch all reports (used by admin or overall monitoring)
   */
  async getReports() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(r => ({
            ...r,
            reporterName: r.reporterName || 'Citizen User',
            reporterContact: r.reporterContact || 'Unspecified',
            location: r.location || `${r.district || 'NER'} (${r.latitude ? r.latitude.toFixed(3) : ''})`,
            photoUrl: r.media_url || r.photoUrl,
            submittedDate: r.submittedDate || new Date(r.created_at).toLocaleDateString('en-IN'),
          }));
        }
      } catch (err) {
        console.warn('Supabase getReports exception:', err);
      }
    }

    return getStoredReports().map(r => ({
      ...r,
      photoUrl: r.media_url || r.photoUrl,
      location: r.location || `${r.district} Sector`,
      submittedDate: r.submittedDate || new Date(r.created_at).toLocaleDateString('en-IN'),
    }));
  },

  /**
   * Update report status (Verified, Rejected, Pending)
   * When Verified, automatically promotes the report into Landslide Locations!
   */
  async updateReportStatus(id, newStatus) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('reports')
          .update({ status: newStatus })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase updateReportStatus error:', err);
      }
    }

    const current = getStoredReports();
    let updatedReport = null;
    const updated = current.map(r => {
      if (r.id === id) {
        updatedReport = { ...r, status: newStatus };
        return updatedReport;
      }
      return r;
    });
    saveStoredReports(updated);

    // If verified, auto-promote to Landslide Locations so it appears in the Landslides tab
    if (newStatus === 'Verified' && updatedReport) {
      try {
        const { landslideService } = await import('./landslideService');
        const existingLocations = await landslideService.getLocations();
        const alreadyExists = existingLocations.some(
          loc => loc.report_id === id || loc.name?.includes(updatedReport.incident_type && updatedReport.district)
        );

        if (!alreadyExists) {
          const riskLevel =
            updatedReport.severity === 'Severe' || updatedReport.severity === 'Critical'
              ? 'Critical'
              : updatedReport.severity === 'Moderate'
              ? 'High'
              : 'Medium';

          await landslideService.createLocation({
            name: `${updatedReport.incident_type || 'Landslide'} Site (${updatedReport.district})`,
            district: updatedReport.district || 'Shillong',
            latitude: updatedReport.latitude || 25.5682,
            longitude: updatedReport.longitude || 91.8933,
            risk_level: riskLevel,
            description: `Verified eyewitness report #${updatedReport.id}: ${updatedReport.description}`,
            status: 'Monitored',
            report_id: updatedReport.id,
          });
        }
      } catch (promoteErr) {
        console.warn('Could not auto-promote report to monitored locations:', promoteErr);
      }
    }

    return updated.find(r => r.id === id);
  },

  // Legacy compatibility for existing admin components
  addReport(newReport) {
    const report = {
      id: 'rep-' + Date.now().toString().slice(-4),
      user_id: 'citizen-demo-001',
      incident_type: 'Other',
      submittedDate: 'Just now',
      status: 'Pending',
      created_at: new Date().toISOString(),
      ...newReport,
      media_url: newReport.photoUrl || newReport.media_url,
    };
    const current = getStoredReports();
    saveStoredReports([report, ...current]);
    return report;
  },
};

export default reportService;
