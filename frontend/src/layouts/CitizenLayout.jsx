import React, { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Home,
  AlertTriangle,
  FileText,
  Map as MapIcon,
  User,
  LogOut,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  PlusCircle,
} from 'lucide-react';
import { authService } from '../services/authService';
import Loading from '../components/common/Loading';

export const CitizenToastContext = createContext({
  showToast: (msg, type) => {},
});

export const useCitizenToast = () => useContext(CitizenToastContext);

export default function CitizenLayout() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const currentSession = await authService.getSession('Citizen');
        if (mounted) {
          setSession(currentSession);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Citizen session check failed:', err);
        if (mounted) {
          setSession(null);
          setIsLoading(false);
        }
      }
    }

    checkAuth();

    const unsubscribe = authService.onAuthStateChange((event, newSession) => {
      if (mounted) {
        setSession(newSession);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = async () => {
    try {
      await authService.signOut('citizen');
      showToast('You have been signed out.', 'info');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loading message="Loading citizen portal..." />
      </div>
    );
  }

  // Route protection: redirect to login if no active session
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const user = session?.user;
  const userMetadata = user?.user_metadata || {};
  const citizenName = userMetadata.full_name || userMetadata.name || user?.email?.split('@')[0] || 'Citizen';
  const district = userMetadata.district || 'Shillong';

  const navLinks = [
    { label: 'Home', path: '/citizen/home', icon: Home },
    { label: 'Report Incident', path: '/citizen/report', icon: AlertTriangle, highlight: true },
    { label: 'My Reports', path: '/citizen/my-reports', icon: FileText },
    { label: 'Risk Map', path: '/citizen/map', icon: MapIcon },
  ];

  const isLinkActive = (path) => location.pathname === path;

  return (
    <CitizenToastContext.Provider value={{ showToast }}>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 pb-20 md:pb-8 selection:bg-amber-100 selection:text-amber-900">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Left: Brand / Logo */}
            <Link to="/citizen/home" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    NER Landslide Watch
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                    Citizen
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Early Warning & Citizen Response
                </span>
              </div>
            </Link>

            {/* Center: Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isLinkActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                      link.highlight
                        ? active
                          ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80'
                        : active
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: District Badge, Profile & Logout */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* District Badge */}
              <div className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold text-[11px]">{district}</span>
              </div>

              {/* Profile Icon Button */}
              <Link
                to="/citizen/profile"
                title={`Profile (${citizenName})`}
                className={`p-2 rounded-xl border transition flex items-center space-x-2 ${
                  isLinkActive('/citizen/profile')
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  {citizenName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline text-xs font-semibold max-w-[120px] truncate">
                  {citizenName}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet context={{ session, user, userMetadata, district, citizenName }} />
        </main>

        {/* Bottom Mobile Navigation Bar (Fixed for small screens) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 py-2 shadow-lg flex items-center justify-around">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.path);
            if (link.highlight) {
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex flex-col items-center justify-center -mt-5"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-white">
                    <PlusCircle className="w-6 h-6 text-slate-950 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 mt-0.5">
                    Report
                  </span>
                </Link>
              );
            }
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition ${
                  active ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${active ? 'text-amber-600' : 'text-slate-400'}`} />
                <span>{link.label === 'Report Incident' ? 'Report' : link.label === 'Risk Map' ? 'Map' : link.label === 'My Reports' ? 'Reports' : link.label}</span>
              </Link>
            );
          })}

          <Link
            to="/citizen/profile"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition ${
              isLinkActive('/citizen/profile') ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className={`w-5 h-5 mb-0.5 ${isLinkActive('/citizen/profile') ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>Profile</span>
          </Link>
        </div>

        {/* Toast Container */}
        <div className="fixed bottom-20 md:bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 md:px-0">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-xl shadow-xl border flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-5 duration-200 ${
                toast.type === 'error'
                  ? 'bg-red-900 text-white border-red-700'
                  : toast.type === 'warning'
                  ? 'bg-amber-900 text-white border-amber-700'
                  : toast.type === 'info'
                  ? 'bg-sky-900 text-white border-sky-700'
                  : 'bg-slate-900 text-white border-slate-800'
              }`}
            >
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />}
              {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />}
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />}

              <div className="flex-1 text-xs font-medium leading-relaxed">
                {toast.message}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </CitizenToastContext.Provider>
  );
}
