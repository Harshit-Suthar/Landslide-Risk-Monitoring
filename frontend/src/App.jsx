import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import CitizenLayout from './layouts/CitizenLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import LiveMap from './pages/public/LiveMap';
import WeatherRadar from './pages/public/WeatherRadar';
import AlertsBulletin from './pages/public/AlertsBulletin';
import SafetyGuide from './pages/public/SafetyGuide';
import About from './pages/public/About';

// Citizen Auth & Pages
import CitizenSignup from './pages/citizen/CitizenSignup';
import CitizenHome from './pages/citizen/CitizenHome';
import CitizenReport from './pages/citizen/CitizenReport';
import CitizenMyReports from './pages/citizen/CitizenMyReports';
import CitizenMap from './pages/citizen/CitizenMap';
import CitizenProfile from './pages/citizen/CitizenProfile';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Landslides from './pages/admin/Landslides';
import RiskManagement from './pages/admin/RiskManagement';
import AIModel from './pages/admin/AIModel';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

export default function App() {
  return (
    <Routes>
      {/* Public Pages with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<LiveMap />} />
        <Route path="/weather" element={<WeatherRadar />} />
        <Route path="/alerts" element={<AlertsBulletin />} />
        <Route path="/safety" element={<SafetyGuide />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="/citizen/login" element={<Navigate to="/login" replace />} />
        <Route path="/citizen/signup" element={<CitizenSignup />} />
      </Route>

      {/* Citizen & Community Portal (Protected with CitizenLayout) */}
      <Route path="/citizen" element={<CitizenLayout />}>
        <Route index element={<Navigate to="/citizen/home" replace />} />
        <Route path="home" element={<CitizenHome />} />
        <Route path="report" element={<CitizenReport />} />
        <Route path="my-reports" element={<CitizenMyReports />} />
        <Route path="map" element={<CitizenMap />} />
        <Route path="profile" element={<CitizenProfile />} />
      </Route>


      {/* Protected Admin Console with AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="landslides" element={<Landslides />} />
        <Route path="risk-management" element={<RiskManagement />} />
        <Route path="ai-model" element={<AIModel />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
