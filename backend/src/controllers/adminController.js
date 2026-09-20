const supabase = require('../config/supabase');
const mlProxyService = require('../services/mlProxyService');
const weatherProvider = require('../providers/weatherProvider');
const notificationProvider = require('../providers/notificationProvider');

/**
 * Admin Controller
 * Protected by requireRole(['Admin'])
 */

/**
 * Aggregates real statistics directly from Supabase DB tables ('locations' and 'reports').
 * GET /api/admin/dashboard/stats
 */
async function getDashboardStats(req, res, next) {
  try {
    // 1. Fetch locations data
    const { data: locations, error: locationsError } = await supabase
      .from('locations')
      .select('risk_level, status');

    if (locationsError) {
      throw new Error(`Database error fetching locations: ${locationsError.message}`);
    }

    // 2. Fetch reports data
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('status, severity, incident_type');

    if (reportsError) {
      throw new Error(`Database error fetching reports: ${reportsError.message}`);
    }

    // Tally locations
    const locationStats = {
      total: locations.length,
      byRiskLevel: {
        Low: 0,
        Medium: 0,
        High: 0,
        Critical: 0
      },
      byStatus: {
        Monitored: 0,
        Resolved: 0
      }
    };

    locations.forEach(loc => {
      if (locationStats.byRiskLevel[loc.risk_level] !== undefined) {
        locationStats.byRiskLevel[loc.risk_level]++;
      }
      if (locationStats.byStatus[loc.status] !== undefined) {
        locationStats.byStatus[loc.status]++;
      }
    });

    // Tally reports
    const reportStats = {
      total: reports.length,
      byStatus: {
        Pending: 0,
        Verified: 0,
        Rejected: 0
      },
      bySeverity: {
        Minor: 0,
        Moderate: 0,
        Severe: 0
      }
    };

    reports.forEach(rep => {
      if (reportStats.byStatus[rep.status] !== undefined) {
        reportStats.byStatus[rep.status]++;
      }
      if (reportStats.bySeverity[rep.severity] !== undefined) {
        reportStats.bySeverity[rep.severity]++;
      }
    });

    res.json({
      success: true,
      data: {
        locations: locationStats,
        reports: reportStats
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Triggers ML landslide risk prediction for a specific location.
 * POST /api/admin/ai-model/predict
 * Body: { location_id, lat?, lon?, rainfall_mm? }
 */
async function predictRisk(req, res, next) {
  try {
    const { location_id } = req.body;
    let lat = req.body.lat;
    let lon = req.body.lon;
    let rainfall_mm = req.body.rainfall_mm;
    let district = req.body.district || 'Unknown';

    // If coordinates or rainfall are not directly supplied, resolve from Supabase
    if (lat === undefined || lon === undefined || rainfall_mm === undefined) {
      const { data: location, error } = await supabase
        .from('locations')
        .select('*')
        .eq('id', location_id)
        .maybeSingle();

      if (error) {
        throw new Error(`Error resolving location: ${error.message}`);
      }

      if (location) {
        lat = lat ?? location.latitude;
        lon = lon ?? location.longitude;
        district = location.district || district;
      }
    }

    if (lat === undefined || lon === undefined) {
      return res.status(400).json({
        success: false,
        message: `Coordinates could not be found for location_id '${location_id}'. Please supply lat and lon.`
      });
    }

    // Resolve rainfall from weather provider if not explicitly passed
    if (rainfall_mm === undefined) {
      const weather = await weatherProvider.getWeather(district);
      rainfall_mm = weather.current_rainfall_mm;
    }

    // Forward to ML service via proxy
    const mlResult = await mlProxyService.predict({
      location_id,
      lat,
      lon,
      rainfall_mm
    });

    res.json({
      success: true,
      data: mlResult
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Verifies or rejects an incident report and alerts the district if verified.
 * PATCH /api/admin/reports/:id/verify
 * Body: { status: 'Verified' | 'Rejected', notes?: string }
 */
async function verifyReport(req, res, next) {
  try {
    const { id } = req.params;
    const { status = 'Verified', notes } = req.body;

    if (!['Verified', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Verified' or 'Rejected'"
      });
    }

    // Update report in Supabase
    const { data: report, error } = await supabase
      .from('reports')
      .update({
        status,
        ...(notes ? { notes } : {})
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update report: ${error.message}`);
    }

    let alertResult = null;
    // If verified, notify district disaster management
    if (status === 'Verified') {
      alertResult = await notificationProvider.sendPushNotification(
        `district_${report.district}`,
        {
          title: `Verified Incident: ${report.incident_type}`,
          body: `A ${report.severity} landslide incident in ${report.district} has been verified by the control room.`,
          reportId: report.id
        }
      );

      await notificationProvider.sendEmail(
        `officer.${report.district.toLowerCase()}@ner-landslide.gov.in`,
        `[URGENT] Incident Report Verified - ${report.district}`,
        `Incident report ${report.id} (${report.incident_type}, ${report.severity}) has been officially verified.`
      );
    }

    res.json({
      success: true,
      message: `Report ${id} updated to ${status}`,
      data: {
        report,
        alertDispatched: status === 'Verified',
        alertResult
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardStats,
  predictRisk,
  verifyReport
};
