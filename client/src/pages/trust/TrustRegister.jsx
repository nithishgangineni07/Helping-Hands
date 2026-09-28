import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Upload,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TrustRegister = () => {
  const navigate = useNavigate();
  const { registerTrust } = useAuth();

  const [formData, setFormData] = useState({
    trustName: '',
    organizerName: '',
    phone: '',
    email: '',
    location: '',
    registrationNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo file size must not exceed 5MB');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      if (error) setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.trustName ||
      !formData.organizerName ||
      !formData.phone ||
      !formData.email ||
      !formData.location ||
      !formData.registrationNumber ||
      !formData.password
    ) {
      setError('Please fill in all 7 required registration fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const submissionData = new FormData();
      submissionData.append('trustName', formData.trustName.trim());
      submissionData.append('organizerName', formData.organizerName.trim());
      submissionData.append('phone', formData.phone.trim());
      submissionData.append('email', formData.email.trim());
      submissionData.append('location', formData.location.trim());
      submissionData.append('registrationNumber', formData.registrationNumber.trim());
      submissionData.append('password', formData.password);

      if (logoFile) {
        submissionData.append('logoFile', logoFile);
      }

      await registerTrust(submissionData);
      setRegisteredSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (registeredSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-9 h-9 text-brand-600" />
          </div>

          <h2 className="text-2xl font-extrabold text-charcoal-900 mb-3">
            Registration Submitted!
          </h2>
          <p className="text-sm text-charcoal-600 leading-relaxed mb-6">
            Thank you for applying to join the Helping Hands verified network. Your trust profile is currently in{' '}
            <span className="font-bold text-amber-600">Pending Review</span> status.
          </p>

          <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100 text-left text-xs text-charcoal-700 space-y-2 mb-8">
            <div className="flex items-center gap-2 font-bold text-brand-800">
              <ShieldAlert className="w-4 h-4 text-brand-600" />
              <span>What happens next?</span>
            </div>
            <p>
              1. Our verification team validates your registration number and credentials against regulatory registries.
            </p>
            <p>
              2. Once approved, your status will become <strong>Verified</strong> and you will be empowered to publish active donation requests.
            </p>
          </div>

          <button
            onClick={() => navigate('/trust/dashboard')}
            className="w-full py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-smooth shadow-emerald flex items-center justify-center gap-2"
          >
            <span>Proceed to Trust Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-brand-50/20 to-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 mb-3 shadow-sm">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Trust & NGO Registration
          </h1>
          <p className="mt-2 text-sm text-charcoal-600 max-w-md mx-auto">
            Apply to partner with Helping Hands. Complete our 7-point verification profile to start raising funds transparently.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field 1: Trust Name */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                1. Official Trust / NGO Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="trustName"
                  required
                  value={formData.trustName}
                  onChange={handleChange}
                  placeholder="e.g. Karuna Seva Welfare Trust"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-smooth"
                />
              </div>
            </div>

            {/* Field 2: Organizer / Authorized Person Name */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                2. Organizer / Authorized Person Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="organizerName"
                  required
                  value={formData.organizerName}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Rajesh Kumar (Managing Trustee)"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-smooth"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Field 3: Phone */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                  3. Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-smooth"
                  />
                </div>
              </div>

              {/* Field 4: Email */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                  4. Email Address <span className="text-red-500">*</span>
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
                    placeholder="contact@karunaseva.org"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-smooth"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Field 5: Location */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                  5. Location (City, State) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Hyderabad, Telangana"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-smooth"
                  />
                </div>
              </div>

              {/* Field 6: Registration Number */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                  6. Registration Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="registrationNumber"
                    required
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="REG-HYD-2021-9988"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-smooth"
                  />
                </div>
              </div>
            </div>

            {/* Field 7: Trust Logo / Seal */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                7. Official Trust Logo / Official Seal
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-200 hover:border-brand-400 rounded-2xl cursor-pointer bg-gray-50 hover:bg-brand-50/30 transition-smooth">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs font-semibold text-charcoal-600">
                    Click to select logo (PNG, JPG, WebP up to 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {logoPreview && (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 bg-white p-1 shrink-0">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Portal Credentials */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-charcoal-900 mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-600" />
                <span>Portal Login Credentials</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 6 characters"
                      className="w-full pl-4 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-smooth"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-smooth"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-emerald hover:shadow-lg transition-smooth flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Trust Registration</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-charcoal-600">
            Already registered your trust?{' '}
            <Link to="/trust/login" className="font-bold text-brand-600 hover:text-brand-700 underline">
              Sign in to Trust Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustRegister;
