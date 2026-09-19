import React, { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { authService } from '../services/authService';
import Loading from '../components/common/Loading';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContext = createContext({
  showToast: (msg, type) => {},
});

export const useToast = () => useContext(ToastContext);

export default function AdminLayout() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const currentSession = await authService.getSession();
        if (mounted) {
          setSession(currentSession);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Session check failed:', err);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loading message="Authenticating administrator session..." />
      </div>
    );
  }

  // Route protection
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-shrink-0">
          <AdminSidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex flex-col max-w-xs w-full bg-slate-900 z-10">
              <AdminSidebar
                isCollapsed={false}
                onToggleCollapse={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminHeader
            user={session?.user}
            onMobileToggle={() => setMobileMenuOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
            <div className="max-w-7xl mx-auto space-y-6">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Toast Container */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-5 duration-200 ${
                toast.type === 'error'
                  ? 'bg-red-900 text-white border-red-700'
                  : toast.type === 'warning'
                  ? 'bg-amber-900 text-white border-amber-700'
                  : 'bg-slate-900 text-white border-slate-700'
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
    </ToastContext.Provider>
  );
}
