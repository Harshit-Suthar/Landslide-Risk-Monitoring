// Service for Citizen and Field Incident Reports

const INITIAL_REPORTS = [
  {
    id: 'rep-101',
    reporterName: 'Malsawma Fanai',
    reporterContact: '+91 98621 44512',
    location: 'Durtlang North Hillside, Aizawl',
    district: 'Aizawl',
    description: 'Noticed fresh 3-inch fissures opening along the rear compound wall of the community hall after torrential rain last night.',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=600&q=80',
    status: 'Pending',
    submittedDate: 'Today at 09:30 AM',
    severity: 'High',
  },
  {
    id: 'rep-102',
    reporterName: 'Wandashisha Mawlong',
    reporterContact: '+91 94361 88901',
    location: 'Mawkhar-Laitumkhrah Link, Shillong',
    district: 'Shillong',
    description: 'Mudflow spilled across the lower bypass road. Small boulders rolling down from the quarry area.',
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    status: 'Verified',
    submittedDate: 'Today at 07:15 AM',
    severity: 'Critical',
  },
  {
    id: 'rep-103',
    reporterName: 'Kiphire Field Post (Agent K. Sema)',
    reporterContact: '+91 87310 99231',
    location: 'NH-29 Milepost 44, Kohima',
    district: 'Kohima',
    description: 'Roadbed sinking by 12cm. Geotextile membrane exposed under the culvert.',
    photoUrl: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80',
    status: 'Verified',
    submittedDate: 'Yesterday at 04:20 PM',
    severity: 'High',
  },
  {
    id: 'rep-104',
    reporterName: 'Bipul Kalita',
    reporterContact: '+91 98540 12345',
    location: 'Noonmati Hills, Guwahati',
    district: 'Guwahati',
    description: 'Water accumulation on terraced backyard. Earth retaining wall showing minor dampness.',
    photoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    status: 'Rejected',
    submittedDate: 'Yesterday at 11:00 AM',
    severity: 'Low',
  },
  {
    id: 'rep-105',
    reporterName: 'Wangchu Gompa Resident',
    reporterContact: '+91 94360 45678',
    location: 'Upper Banderdewa, Itanagar',
    district: 'Itanagar',
    description: 'Minor debris accumulation in roadside drain. No active slope displacement noted.',
    photoUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    status: 'Pending',
    submittedDate: 'Sep 17, 2026',
    severity: 'Medium',
  },
  {
    id: 'rep-106',
    reporterName: 'Karma Bhutia',
    reporterContact: '+91 97740 67890',
    location: 'Deorali Slope, Gangtok',
    district: 'Gangtok',
    description: 'Retaining wall bulging outward near pedestrian stairway. Immediate site inspection requested.',
    photoUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
    status: 'Pending',
    submittedDate: 'Sep 17, 2026',
    severity: 'High',
  },
];

let currentReports = [...INITIAL_REPORTS];

export const reportService = {
  getReports() {
    return [...currentReports];
  },

  addReport(newReport) {
    const report = {
      id: 'rep-' + Date.now().toString().slice(-4),
      submittedDate: 'Just now',
      status: 'Pending',
      ...newReport,
    };
    currentReports = [report, ...currentReports];
    return report;
  },

  updateReportStatus(id, newStatus) {
    currentReports = currentReports.map(r =>
      r.id === id ? { ...r, status: newStatus } : r
    );
    return currentReports.find(r => r.id === id);
  },
};

export default reportService;
