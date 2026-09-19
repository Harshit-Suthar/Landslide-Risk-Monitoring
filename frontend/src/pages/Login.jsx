import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Users,
  Shield,
} from 'lucide-react';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await authService.signIn(email, password, 'auto');
      const role = res.role || res.user?.user_metadata?.role;
      const isAdmin =
        role === 'Admin' ||
        role === 'District Officer' ||
        role === 'Field Agent' ||
        email.toLowerCase().includes('admin') ||
        email.toLowerCase().includes('gov.in');

      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/citizen/home', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoCitizen = () => {
    setEmail('priya.sharma@example.com');
    setPassword('citizen123');
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@ner-landslide.gov.in');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 items-center justify-center shadow-lg shadow-amber-500/25 mb-1">
            <ShieldAlert className="w-9 h-9 text-slate-950" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            NER Landslide Watch
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Sign in to access your portal. Citizens will be directed to the Community Reporting Portal, and authorized officers to the Admin Console.
          </p>
        </div>

        {/* Demo Mode Quick Fill Helper */}
        <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/70 text-xs text-amber-900 space-y-2.5">
          <div className="flex items-center space-x-2 font-semibold">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{isSupabaseConfigured ? 'Live Supabase Authentication' : 'Demo Mode Active — 1-Click Quick Fill:'}</span>
          </div>

          {!isSupabaseConfigured && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleQuickDemoCitizen}
                className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-slate-800 font-medium transition text-left cursor-pointer shadow-2xs"
              >
                <Users className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span className="truncate">Demo Citizen</span>
              </button>

              <button
                type="button"
                onClick={handleQuickDemoAdmin}
                className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-slate-800 font-medium transition text-left cursor-pointer shadow-2xs"
              >
                <Shield className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                <span className="truncate">Demo Admin</span>
              </button>
            </div>
          )}
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {forgotPasswordNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
              <span>
                Password reset request received. If an account exists with this email, instructions have been sent.
              </span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com or admin@ner-landslide.gov.in"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordNotice(true)}
                  className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition shadow-md shadow-amber-500/25 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Citizen Sign Up */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Don't have an account yet?{' '}
              <Link
                to="/citizen/signup"
                className="font-bold text-amber-600 hover:text-amber-700 hover:underline"
              >
                Sign up as Citizen Reporter
              </Link>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-slate-700 font-medium"
          >
            ← Return to Public Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
