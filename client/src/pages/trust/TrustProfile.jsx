import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Globe,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Save,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { getTrustProfile, updateTrustProfile } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TrustProfile = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    organizerName: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    location: '',
    registrationNumber: '',
    yearsOfService: 0,
    peopleHelpedCount: 0,
    // Compliance fields
    gstStatus: 'not_applicable',
    gstNumber: '',
    taxExemptionStatus: 'not_applicable',
    taxExemptionType: '',
    taxExemptionNumber: '',
    fcraStatus: 'not_applicable',
    fcraRegistrationNumber: ''
  });

  const [currentLogo, setCurrentLogo] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await getTrustProfile();
        if (res.success && res.data) {
          const t = res.data;
          setFormData({
            name: t.name || '',
            organizerName: t.organizerName || '',
            description: t.description || '',
            phone: t.contact?.phone || '',
            email: t.contact?.email || '',
            website: t.contact?.website || '',
            location: t.location || '',
            registrationNumber: t.registrationNumber || '',
            yearsOfService: t.yearsOfService || 0,
            peopleHelpedCount: t.peopleHelpedCount || 0,
            gstStatus: t.gstStatus || 'not_applicable',
            gstNumber: t.gstNumber || '',
            taxExemptionStatus: t.taxExemptionStatus || 'not_applicable',
            taxExemptionType: t.taxExemptionType || '',
            taxExemptionNumber: t.taxExemptionNumber || '',
            fcraStatus: t.fcraStatus || 'not_applicable',
            fcraRegistrationNumber: t.fcraRegistrationNumber || ''
          });
          setCurrentLogo(t.logo || '');
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccessMsg('');

      const submission = new FormData();
      Object.keys(formData).forEach((k) => {
        submission.append(k, formData[k]);
      });

      if (logoFile) {
        submission.append('logoFile', logoFile);
      }

      const res = await updateTrustProfile(submission);
      if (res.success) {
        setSuccessMsg(res.message || 'Trust profile updated successfully!');
        if (res.data?.logo) {
          setCurrentLogo(res.data.logo);
          refreshUser({ logo: res.data.logo, trustName: res.data.name });
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-2">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500">Loading trust profile settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
          Organization Profile & Statutory Compliance
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Maintain your institutional identity, registered contact numbers, and 80G/FCRA regulatory status.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* ORGANIZATION IDENTIFICATION */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Institutional Details
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-5 pb-2">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
              {logoPreview ? (
                <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : currentLogo ? (
                <img src={currentLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-gray-400 m-auto mt-6" />
              )}
            </div>
            <div className="w-full">
              <label className="block text-xs font-bold text-charcoal-700 mb-1">Update Organization Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">Trust Name</label>
              <input
                type="text"
                disabled
                value={formData.name}
                className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 cursor-not-allowed"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Trust name is verified per registration cert.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">Registration Number</label>
              <input
                type="text"
                disabled
                value={formData.registrationNumber}
                className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">Organization Bio / Mission</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell supporters about your founding history and core mission..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            ></textarea>
          </div>
        </div>

        {/* REGISTERED CONTACT INFORMATION */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            <User className="w-5 h-5 text-emerald-600" />
            Authorized Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Organizer / Managing Trustee <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                name="organizerName"
                value={formData.organizerName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Operational Location / State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Official Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Contact Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* STATUTORY COMPLIANCE PROFILE (GST, 80G, FCRA) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <h3 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                Statutory Compliance & Legal Certificates
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Modifying verified compliance information triggers re-audit review by platform officers.
              </p>
            </div>
            <Lock className="w-4 h-4 text-purple-600" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">GST Registration Status</label>
              <select
                name="gstStatus"
                value={formData.gstStatus}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                <option value="not_applicable">Not Applicable (Exempt Trust)</option>
                <option value="registered">Registered</option>
                <option value="pending_verification">Pending Registration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">GST Number</label>
              <input
                type="text"
                disabled={formData.gstStatus !== 'registered'}
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder={formData.gstStatus === 'registered' ? 'e.g. 27AAAAA0000A1Z5' : 'N/A'}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">Tax Exemption Status (80G / 12A)</label>
              <select
                name="taxExemptionStatus"
                value={formData.taxExemptionStatus}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                <option value="applicable">Applicable (Certified)</option>
                <option value="not_applicable">Not Applicable</option>
                <option value="pending_verification">Pending Verification</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">Exemption Certificate Number</label>
              <input
                type="text"
                name="taxExemptionNumber"
                value={formData.taxExemptionNumber}
                onChange={handleChange}
                placeholder="e.g. ITBA/EXM/80G/2026-27"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">FCRA Regulatory Status</label>
              <select
                name="fcraStatus"
                value={formData.fcraStatus}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                <option value="not_applicable">Not Applicable</option>
                <option value="registered">Registered under FCRA 2010</option>
                <option value="prior_permission">Prior Permission</option>
                <option value="eligible">Eligible / Application Submitted</option>
                <option value="not_eligible">Not Eligible</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">FCRA Registration Number</label>
              <input
                type="text"
                name="fcraRegistrationNumber"
                value={formData.fcraRegistrationNumber}
                onChange={handleChange}
                placeholder="e.g. 083780000"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating Records...' : 'Save Profile & Compliance'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default TrustProfile;
