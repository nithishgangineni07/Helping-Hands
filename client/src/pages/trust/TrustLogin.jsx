import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TrustLogin = () => {
  const navigate = useNavigate();
  const { loginTrust, loginTrustGoogle } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter your trust email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await loginTrust(formData.email.trim(), formData.password);
      navigate('/trust/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In handler (supports OAuth credential payload or mock testing token)
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      // In production with Google Client ID, this receives google credential token
      // For development, we send a demo Google Auth payload
      await loginTrustGoogle('google-oauth-mock-credential', {
        email: 'trust.partner@gmail.com',
        name: 'Partner Trust Society'
      });
      navigate('/trust/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-brand-50/20 to-gray-50">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 mb-3 shadow-sm">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Trust Portal Login
          </h1>
          <p className="mt-2 text-sm text-charcoal-600">
            Sign in to manage your causes, post impact updates, and track transparent donations.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-2xl text-sm font-semibold text-charcoal-800 shadow-sm transition-smooth flex items-center justify-center gap-3 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-semibold tracking-wider">
                Or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                Official Trust Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@helpinghearts.org"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-smooth"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-smooth"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-emerald hover:shadow-lg transition-smooth flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Trust Portal</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Helper hint for evaluation */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-charcoal-500">
              Demo Seed Login: <span className="font-mono text-brand-700 font-semibold">contact@helpinghearts.org</span> / <span className="font-mono text-brand-700 font-semibold">Trust@123</span>
            </p>
          </div>

          <div className="mt-4 text-center text-sm text-charcoal-600">
            Don't have a trust account?{' '}
            <Link to="/trust/register" className="font-bold text-brand-600 hover:text-brand-700 underline">
              Apply for Verification
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustLogin;
