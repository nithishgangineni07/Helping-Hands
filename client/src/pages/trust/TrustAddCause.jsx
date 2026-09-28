import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  ShieldCheck,
  Building2,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  DollarSign,
  FileCheck2
} from 'lucide-react';
import {
  getTrustProfile,
  getTrustComplianceStatus,
  createTrustCampaign
} from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

const CATEGORIES = [
  'Education',
  'Healthcare',
  'Food & Nutrition',
  'Children',
  'Elderly Care',
  'Women Empowerment',
  'Disaster Relief',
  'Animal Welfare',
  'Community Development',
  'General'
];

const TrustAddCause = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Step 1: Cause Info
  const [causeInfo, setCauseInfo] = useState({
    title: '',
    category: 'Education',
    targetAmount: '',
    deadline: '',
    description: '',
    whyNeeded: '',
    detailedNeed: '',
    expectedFundsUse: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Step 2: Organization / Compliance Info (Pre-filled from Trust Model)
  const [complianceInfo, setComplianceInfo] = useState({
    organizerName: '',
    contactEmail: '',
    contactPhone: '',
    location: '',
    gstStatus: 'not_applicable',
    gstNumber: '',
    taxExemptionStatus: 'not_applicable',
    taxExemptionType: '',
    taxExemptionNumber: '',
    fcraStatus: 'not_applicable'
  });

  // Step 3: Supporting Documents
  const [docNotes, setDocNotes] = useState('');

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoadingProfile(true);
        const res = await getTrustProfile();
        if (res.success && res.data) {
          const t = res.data;
          setComplianceInfo({
            organizerName: t.organizerName || '',
            contactEmail: t.contact?.email || '',
            contactPhone: t.contact?.phone || '',
            location: t.location || '',
            gstStatus: t.gstStatus || 'not_applicable',
            gstNumber: t.gstNumber || '',
            taxExemptionStatus: t.taxExemptionStatus || 'not_applicable',
            taxExemptionType: t.taxExemptionType || '',
            taxExemptionNumber: t.taxExemptionNumber || '',
            fcraStatus: t.fcraStatus || 'not_applicable'
          });
        }
      } catch (err) {
        console.error('Failed to load profile for cause wizard:', err);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfileData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (!causeInfo.title || !causeInfo.targetAmount || !causeInfo.deadline || !causeInfo.description) {
      setErrorMsg('Please complete all required campaign fields.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleNextStep2 = (e) => {
    e.preventDefault();
    if (!complianceInfo.contactEmail || !complianceInfo.contactPhone) {
      setErrorMsg('Contact Email and Phone number are strictly required for fundraising compliance.');
      return;
    }
    if (complianceInfo.gstStatus === 'registered' && !complianceInfo.gstNumber) {
      setErrorMsg('Please enter your GST registration number or mark status as Not Applicable.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleNextStep3 = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setStep(4);
  };

  const handleSubmitFinal = async () => {
    try {
      setSubmitting(true);
      setErrorMsg('');

      const formData = new FormData();
      // Cause info
      Object.keys(causeInfo).forEach((k) => {
        if (causeInfo[k]) formData.append(k, causeInfo[k]);
      });
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      // Compliance info
      Object.keys(complianceInfo).forEach((k) => {
        if (complianceInfo[k] !== undefined) formData.append(k, complianceInfo[k]);
      });

      const res = await createTrustCampaign(formData);
      if (res.success) {
        setSuccessMsg('Cause submitted successfully! Redirecting to your campaigns ledger...');
        setTimeout(() => {
          navigate('/trust/campaigns');
        }, 1500);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit cause request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-2">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500">Preparing cause creation wizard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
          Create Fundraising Cause
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          4-step regulatory submission. Once verified, compliance information is securely reused for all future causes.
        </p>
      </div>

      {/* STEP PROGRESS INDICATOR */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center text-xs font-bold">
        <div className={`p-2 sm:p-2.5 rounded-xl border transition-colors ${step === 1 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : step > 1 ? 'bg-gray-100 text-charcoal-900 border-gray-200' : 'bg-white text-gray-400 border-gray-200'}`}>
          <span className="hidden sm:inline">1. Cause Info</span>
          <span className="sm:hidden">1. Info</span>
        </div>
        <div className={`p-2 sm:p-2.5 rounded-xl border transition-colors ${step === 2 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : step > 2 ? 'bg-gray-100 text-charcoal-900 border-gray-200' : 'bg-white text-gray-400 border-gray-200'}`}>
          <span className="hidden sm:inline">2. Compliance</span>
          <span className="sm:hidden">2. Rules</span>
        </div>
        <div className={`p-2 sm:p-2.5 rounded-xl border transition-colors ${step === 3 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : step > 3 ? 'bg-gray-100 text-charcoal-900 border-gray-200' : 'bg-white text-gray-400 border-gray-200'}`}>
          <span className="hidden sm:inline">3. Documents</span>
          <span className="sm:hidden">3. Docs</span>
        </div>
        <div className={`p-2 sm:p-2.5 rounded-xl border transition-colors ${step === 4 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-white text-gray-400 border-gray-200'}`}>
          <span className="hidden sm:inline">4. Review</span>
          <span className="sm:hidden">4. Review</span>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Success Alert */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* WIZARD CONTAINER */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-200/80 shadow-xs">
        
        {/* STEP 1: CAUSE INFORMATION */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-charcoal-900 pb-2 border-b border-gray-100">
              Step 1: Campaign Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Campaign Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={causeInfo.title}
                onChange={(e) => setCauseInfo({ ...causeInfo, title: e.target.value })}
                placeholder="e.g. Clean Drinking Water Purification Setup in 5 Villages"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={causeInfo.category}
                  onChange={(e) => setCauseInfo({ ...causeInfo, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Fundraising Target (INR ₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  value={causeInfo.targetAmount}
                  onChange={(e) => setCauseInfo({ ...causeInfo, targetAmount: e.target.value })}
                  placeholder="e.g. 250000"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Fundraising Deadline <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={causeInfo.deadline}
                onChange={(e) => setCauseInfo({ ...causeInfo, deadline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Campaign Banner Image <span className="text-rose-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Campaign Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows="4"
                value={causeInfo.description}
                onChange={(e) => setCauseInfo({ ...causeInfo, description: e.target.value })}
                placeholder="Describe the background and urgency of this appeal..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Compliance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: ORGANIZATION / COMPLIANCE */}
        {step === 2 && (
          <form onSubmit={handleNextStep2} className="space-y-4 text-xs">
            <div className="pb-2 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-charcoal-900">
                  Step 2: Statutory Compliance & Contact
                </h3>
                <p className="text-[11px] text-gray-500">
                  Required before raising donations. Stored in MongoDB and automatically reused for your next causes.
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Organizer / Authorized Contact Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={complianceInfo.organizerName}
                  onChange={(e) => setComplianceInfo({ ...complianceInfo, organizerName: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Location / Operational City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={complianceInfo.location}
                  onChange={(e) => setComplianceInfo({ ...complianceInfo, location: e.target.value })}
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Contact Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={complianceInfo.contactEmail}
                  onChange={(e) => setComplianceInfo({ ...complianceInfo, contactEmail: e.target.value })}
                  placeholder="e.g. contact@helpinghearts.org"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Contact Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={complianceInfo.contactPhone}
                  onChange={(e) => setComplianceInfo({ ...complianceInfo, contactPhone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* GST Section */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <span className="font-extrabold text-charcoal-900 block text-xs">GST Registration Information</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">GST Status</label>
                  <select
                    value={complianceInfo.gstStatus}
                    onChange={(e) => setComplianceInfo({ ...complianceInfo, gstStatus: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="not_applicable">Not Applicable (Exempt NGO)</option>
                    <option value="registered">Registered Organization</option>
                    <option value="pending_verification">Pending Registration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">GST Number</label>
                  <input
                    type="text"
                    disabled={complianceInfo.gstStatus !== 'registered'}
                    value={complianceInfo.gstNumber}
                    onChange={(e) => setComplianceInfo({ ...complianceInfo, gstNumber: e.target.value })}
                    placeholder={complianceInfo.gstStatus === 'registered' ? 'e.g. 27AAAAA0000A1Z5' : 'N/A for Exempt'}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Tax Exemption Section */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <span className="font-extrabold text-charcoal-900 block text-xs">Tax Exemption Certification (80G / 12A)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Status</label>
                  <select
                    value={complianceInfo.taxExemptionStatus}
                    onChange={(e) => setComplianceInfo({ ...complianceInfo, taxExemptionStatus: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="applicable">Applicable (Certified)</option>
                    <option value="not_applicable">Not Applicable</option>
                    <option value="pending_verification">Pending Approval</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Certificate / Order Number</label>
                  <input
                    type="text"
                    value={complianceInfo.taxExemptionNumber}
                    onChange={(e) => setComplianceInfo({ ...complianceInfo, taxExemptionNumber: e.target.value })}
                    placeholder="e.g. ITBA/EXM/S/80G/2026-27"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* FCRA Section */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
              <span className="font-extrabold text-charcoal-900 block text-xs">FCRA Regulatory Declaration</span>
              <select
                value={complianceInfo.fcraStatus}
                onChange={(e) => setComplianceInfo({ ...complianceInfo, fcraStatus: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
              >
                <option value="not_applicable">Not Applicable (Domestic Contributions Only)</option>
                <option value="registered">Registered under FCRA 2010</option>
                <option value="prior_permission">Prior Permission Granted</option>
                <option value="eligible">Eligible / Application Queued</option>
                <option value="not_eligible">Not Eligible</option>
              </select>
            </div>

            <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-charcoal-700 font-bold text-xs hover:bg-gray-50 flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Documents</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUPPORTING DOCUMENTS */}
        {step === 3 && (
          <form onSubmit={handleNextStep3} className="space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-charcoal-900 pb-2 border-b border-gray-100">
              Step 3: Needs Assessment & Verification Documents
            </h3>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Detailed Operational Need (Why are funds needed?)
              </label>
              <textarea
                rows="3"
                value={causeInfo.detailedNeed}
                onChange={(e) => setCauseInfo({ ...causeInfo, detailedNeed: e.target.value })}
                placeholder="Detail beneficiary assessment, community requirements, and immediate field priorities..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Target Allocation Plan (How funds will be utilized)
              </label>
              <textarea
                rows="3"
                value={causeInfo.expectedFundsUse}
                onChange={(e) => setCauseInfo({ ...causeInfo, expectedFundsUse: e.target.value })}
                placeholder="e.g. 75% Direct beneficiary materials, 15% Medical honorarium, 10% Local logistics..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-charcoal-700 font-bold text-xs hover:bg-gray-50 flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Review & Submit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {step === 4 && (
          <div className="space-y-5 text-xs">
            <div className="pb-2 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-charcoal-900">
                Step 4: Final Verification Review
              </h3>
              <p className="text-[11px] text-gray-500">
                Please verify your details. Upon submission, this cause will be reviewed by platform compliance officers before publishing live.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Cause Overview</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-400 font-bold block">Title</span>
                  <span className="font-extrabold text-charcoal-900">{causeInfo.title}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block">Category</span>
                  <span className="font-extrabold text-charcoal-900">{causeInfo.category}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block">Target Amount</span>
                  <span className="font-black text-emerald-700 text-sm">{formatCurrency(causeInfo.targetAmount)}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block">Deadline</span>
                  <span className="font-bold text-charcoal-900">{causeInfo.deadline}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">Statutory Compliance Profile</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-gray-400 font-bold block">Organizer</span>
                  <span className="font-bold text-charcoal-900">{complianceInfo.organizerName}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block">Contact Email</span>
                  <span className="font-bold text-charcoal-900">{complianceInfo.contactEmail}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block">Contact Phone</span>
                  <span className="font-bold text-charcoal-900">{complianceInfo.contactPhone}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block">GST Status</span>
                  <span className="font-bold uppercase text-charcoal-900">{complianceInfo.gstStatus}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block">80G / 12A Status</span>
                  <span className="font-bold uppercase text-charcoal-900">{complianceInfo.taxExemptionStatus}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block">FCRA Status</span>
                  <span className="font-bold uppercase text-charcoal-900">{complianceInfo.fcraStatus}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-charcoal-700 font-bold text-xs hover:bg-gray-50 flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleSubmitFinal}
                disabled={submitting}
                className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  'Submitting Cause...'
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit for Verification</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TrustAddCause;
