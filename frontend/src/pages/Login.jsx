import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Database,
  Sparkles,
} from 'lucide-react';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState(false);

  const navigate = useNavigate();
  const targetPath = location.state?.from?.pathname;
  const from = (targetPath && !['/login', '/admin/login', '/'].includes(targetPath))
    ? targetPath
    : '/admin/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@ner-landslide.gov.in');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 items-center justify-center shadow-xl shadow-amber-500/20 mb-4">
            <ShieldAlert className="w-9 h-9 text-slate-950" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            NER Landslide Early Warning
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Official Administrative Access & Monitoring Console
          </p>
        </div>

        {/* Notice on Supabase Config */}
        <div className="mb-6 p-3.5 rounded-xl border bg-slate-50 border-slate-200 text-xs text-slate-600 flex items-start space-x-2.5">
          <Database className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            {isSupabaseConfigured ? (
              <span>Connected to live Supabase project. Enter your registered credentials.</span>
            ) : (
              <span>
                <strong>Demo Mode Active:</strong> You can test immediately using any email/password, or click{' '}
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="text-amber-700 underline font-semibold hover:text-amber-800"
                >
                  Quick Fill Demo Admin
                </button>
                .
              </span>
            )}
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {forgotPasswordMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
              <span>
                Password reset request sent. Please contact your North East State Disaster Management Authority coordinator.
              </span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ner-landslide.gov.in"
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
                  onClick={() => setForgotPasswordMessage(true)}
                  className="text-xs text-amber-600 hover:text-amber-700 font-medium"
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
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Access restricted to authorized personnel of GSI & NER State Disaster Authorities.
        </p>
      </div>
    </div>
  );
}
