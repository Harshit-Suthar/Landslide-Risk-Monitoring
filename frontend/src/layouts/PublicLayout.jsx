import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import EmergencyAlertModal from '../components/common/EmergencyAlertModal';
import { ShieldAlert, Radio } from 'lucide-react';

export default function PublicLayout() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [customAlertData, setCustomAlertData] = useState(null);

  useEffect(() => {
    // Auto popup on initial visit if not dismissed yet
    const hasSeenAlert = sessionStorage.getItem('ner_emergency_popup_seen');
    if (!hasSeenAlert) {
      const timer = setTimeout(() => {
        setIsAlertOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Global event listener to trigger the emergency alert modal from anywhere
  useEffect(() => {
    const handleTriggerAlert = (event) => {
      if (event.detail) {
        setCustomAlertData(event.detail);
      }
      setIsAlertOpen(true);
    };

    window.addEventListener('ner:trigger-emergency-alert', handleTriggerAlert);
    return () => window.removeEventListener('ner:trigger-emergency-alert', handleTriggerAlert);
  }, []);

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
    sessionStorage.setItem('ner_emergency_popup_seen', 'true');
  };

  const handleOpenAlert = (customData = null) => {
    setCustomAlertData(customData);
    setIsAlertOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Navbar onOpenEmergencyAlert={() => handleOpenAlert()} />

      <main className="flex-1">
        <Outlet context={{ openEmergencyAlert: handleOpenAlert }} />
      </main>

      <Footer />

      {/* Emergency Alert Modal */}
      <EmergencyAlertModal
        isOpen={isAlertOpen}
        onClose={handleCloseAlert}
        alertData={customAlertData}
      />

      {/* Floating Emergency Alert Quick Launcher (Bottom Right) */}
      {!isAlertOpen && (
        <button
          type="button"
          onClick={() => handleOpenAlert()}
          title="Open Active Emergency Disaster Warning"
          className="fixed bottom-5 right-5 z-40 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-xl shadow-red-500/30 flex items-center space-x-2 transition transform hover:scale-105 cursor-pointer border border-red-400/50"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
          </span>
          <ShieldAlert className="w-4 h-4 text-amber-300" />
          <span className="hidden sm:inline">Active Emergency Warning</span>
          <span className="sm:hidden">Alerts</span>
        </button>
      )}
    </div>
  );
}
