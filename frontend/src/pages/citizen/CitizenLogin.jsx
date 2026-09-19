import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function CitizenLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/citizen/home';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.signIn(email, password, 'Citizen');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Citizen login error:', err);
      setError(err.message || 'Unable to sign in. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoCitizen = () => {
    setEmail('priya.sharma@example.com');
    setPassword('citizen123');
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
            Citizen & Community Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Sign in to submit landslide eyewitness reports, track hazards, and view regional alerts.
          </p>
        </div>

        {/* Demo Mode Notice */}
        <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-amber-900 flex items-start space-x-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            {isSupabaseConfigured ? (
              <span>Connected to live Supabase project. Enter your registered citizen email & password.</span>
            ) : (
              <span>
                <strong>Demo Mode Active:</strong> You can test immediately using any credentials, or click{' '}
                <button
                  type="button"
                  onClick={handleQuickDemoCitizen}
                  className="font-bold underline text-amber-800 hover:text-amber-950"
                >
                  Quick Fill Demo Citizen
                </button>
                .
              </span>
            )}
          </div>
        </div>

        {/* Card Form */}
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
                Password reset link sent to your registered email address if it exists in our system.
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
                  placeholder="name@example.com"
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

          {/* Switch to Sign Up */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Don't have a citizen reporter account yet?{' '}
              <Link
                to="/citizen/signup"
                className="font-bold text-amber-600 hover:text-amber-700 hover:underline"
              >
                Sign up here
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
