import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Ban,
  Search,
  Filter,
  Users,
  Share2,
  Calendar,
  DollarSign,
  TrendingUp,
  Upload,
  AlertTriangle,
  FileCheck2,
  Clock,
  X,
  FileText
} from 'lucide-react';
import { getTrustCampaigns, uploadImpactUpdate } from '../../services/api';
import { formatCurrency, calculatePercentage, formatDate } from '../../utils/formatters';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Highest Target', value: 'highest_target' },
  { label: 'Lowest Target', value: 'lowest_target' },
  { label: 'Highest Raised', value: 'highest_raised' },
  { label: 'Lowest Raised', value: 'lowest_raised' },
  { label: 'Highest Progress %', value: 'highest_progress' },
  { label: 'Most Donors', value: 'most_donors' },
  { label: 'Most Shares', value: 'most_shares' },
  { label: 'Deadline: Soonest', value: 'deadline_soonest' },
  { label: 'Deadline: Latest', value: 'deadline_latest' },
  { label: 'Status Grouping', value: 'status' }
];

const CATEGORIES = [
  'All',
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

const TrustCampaigns = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const statusParam = searchParams.get('status') || 'all';
  const sortParam = searchParams.get('sort') || 'newest';
  const searchParam = searchParams.get('search') || '';

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [selectedStatus, setSelectedStatus] = useState(statusParam);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFunding, setSelectedFunding] = useState('all');
  const [selectedImpact, setSelectedImpact] = useState('all');
  const [selectedDeadline, setSelectedDeadline] = useState('all');
  const [selectedSort, setSelectedSort] = useState(sortParam);

  // Impact Upload Modal
  const [impactModalCampaign, setImpactModalCampaign] = useState(null);
  const [impactTitle, setImpactTitle] = useState('');
  const [impactDesc, setImpactDesc] = useState('');
  const [whatAchieved, setWhatAchieved] = useState('');
  const [howUsed, setHowUsed] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [submittingImpact, setSubmittingImpact] = useState(false);
  const [impactError, setImpactError] = useState('');

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        status: selectedStatus,
        category: selectedCategory,
        funding: selectedFunding,
        impactStatus: selectedImpact,
        deadline: selectedDeadline,
        sort: selectedSort
      };

      const res = await getTrustCampaigns(params);
      setCampaigns(res.data || []);
    } catch (err) {
      console.error('Error loading trust campaigns:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStatus, selectedCategory, selectedFunding, selectedImpact, selectedDeadline, selectedSort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCampaigns();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCampaigns]);

  // Sync to URL
  useEffect(() => {
    const nextParams = {};
    if (selectedStatus !== 'all') nextParams.status = selectedStatus;
    if (selectedSort !== 'newest') nextParams.sort = selectedSort;
    if (searchTerm) nextParams.search = searchTerm;
    setSearchParams(nextParams, { replace: true });
  }, [selectedStatus, selectedSort, searchTerm, setSearchParams]);

  const handleImpactSubmit = async (e) => {
    e.preventDefault();
    if (!impactTitle || !impactDesc) {
      setImpactError('Please fill in both Update Title and Impact Description.');
      return;
    }

    try {
      setSubmittingImpact(true);
      setImpactError('');

      const formData = new FormData();
      formData.append('title', impactTitle);
      formData.append('description', impactDesc);
      formData.append('whatWasAchieved', whatAchieved);
      formData.append('howFundsWereUsed', howUsed);
      formData.append('beneficiariesReached', beneficiaries || '0');

      for (let i = 0; i < mediaFiles.length; i++) {
        formData.append('mediaFiles', mediaFiles[i]);
      }

      await uploadImpactUpdate(impactModalCampaign._id, formData);
      setImpactModalCampaign(null);
      setImpactTitle('');
      setImpactDesc('');
      setWhatAchieved('');
      setHowUsed('');
      setBeneficiaries('');
      setMediaFiles([]);
      fetchCampaigns();
    } catch (err) {
      setImpactError(err.message || 'Failed to submit impact report.');
    } finally {
      setSubmittingImpact(false);
    }
  };

  const getImpactBadge = (camp) => {
    if (camp.status !== 'completed') return null;

    if (camp.impactStatus === 'approved') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-[11px] border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Impact Verified ✓
        </span>
      );
    }
    if (camp.impactStatus === 'pending_review' || camp.impactStatus === 'submitted') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200">
          <Clock className="w-3.5 h-3.5" /> Impact Update Pending Review
        </span>
      );
    }

    // Impact Required Warning
    return (
      <button
        onClick={() => setImpactModalCampaign(camp)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] shadow-sm transition-all animate-pulse"
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>IMPORTANT — Impact Update Required</span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
            My Causes & Campaigns
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your drafts, active appeals, and upload transparent impact updates for completed causes.
          </p>
        </div>

        <Link
          to="/trust/add-cause"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center gap-2 w-fit"
        >
          <PlusCircle className="w-4 h-4" /> Create New Cause
        </Link>
      </div>

      {/* FILTER & 12-WAY SORT TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          {/* Search */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cause title..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Status */}
          <div className="lg:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="completed">Completed</option>
              <option value="pending_review">Pending Review</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Category */}
          <div className="lg:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c === 'All' ? 'all' : c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Funding */}
          <div className="lg:col-span-2">
            <select
              value={selectedFunding}
              onChange={(e) => setSelectedFunding(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="all">All Funding</option>
              <option value="fully">Fully Funded (≥100%)</option>
              <option value="partially">Partially Funded (&gt;0%)</option>
              <option value="not">Not Funded (0%)</option>
            </select>
          </div>

          {/* 12-Option Sort Select */}
          <div className="lg:col-span-2">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* CAUSES LIST / CARDS */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-2">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500">Loading your causes...</p>
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp) => {
            const pct = calculatePercentage(camp.raisedAmount, camp.targetAmount);
            return (
              <div
                key={camp._id}
                className="bg-white rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image & Status Tag */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={camp.image}
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur text-charcoal-900 shadow-sm">
                        {camp.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${
                          camp.status === 'active'
                            ? 'bg-emerald-500 text-white'
                            : camp.status === 'completed'
                            ? 'bg-blue-600 text-white'
                            : camp.status === 'pending_review'
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        {camp.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    <h3 className="font-extrabold text-charcoal-950 text-base line-clamp-2 leading-snug">
                      {camp.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-emerald-700">{formatCurrency(camp.raisedAmount)}</span>
                        <span className="text-gray-400">Target: {formatCurrency(camp.targetAmount)}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                        <span>{pct}% Funded</span>
                        <span>Deadline: {formatDate(camp.deadline)}</span>
                      </div>
                    </div>

                    {/* Donors & Shares */}
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                      <span className="flex items-center gap-1 font-semibold">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        {camp.donorCount || 0} supporters
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Share2 className="w-3.5 h-3.5 text-blue-500" />
                        {camp.shareCount || 0} shares
                      </span>
                    </div>

                    {/* COMPLETED CAUSE IMPACT BADGE / WARNING */}
                    {camp.status === 'completed' && (
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-center">
                        {getImpactBadge(camp)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-4 sm:px-5 py-3.5 bg-gray-50/80 border-t border-gray-100 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5 text-xs font-bold">
                  <Link
                    to={`/campaigns/${camp._id}`}
                    target="_blank"
                    className="text-gray-600 hover:text-emerald-700 flex items-center justify-center xs:justify-start gap-1 transition-colors py-1 xs:py-0"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  {camp.status === 'completed' && camp.impactStatus !== 'approved' && (
                    <button
                      onClick={() => setImpactModalCampaign(camp)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors w-full xs:w-auto"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Post Evidence</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-xs space-y-3">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-extrabold text-charcoal-900">No campaigns found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You haven't created any causes matching your filters yet. Launch a new cause to start raising transparent community donations.
          </p>
          <Link
            to="/trust/add-cause"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-500 transition-colors mt-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Cause</span>
          </Link>
        </div>
      )}

      {/* IMPACT REPORT SUBMISSION MODAL */}
      {impactModalCampaign && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between bg-emerald-50/40">
              <div className="min-w-0 pr-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block truncate">
                  Mandatory Post-Completion Evidence
                </span>
                <h3 className="text-base sm:text-lg font-black text-charcoal-950 mt-0.5 truncate">
                  {impactModalCampaign.title}
                </h3>
              </div>
              <button
                onClick={() => setImpactModalCampaign(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner */}
            {impactError && (
              <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{impactError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleImpactSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Report Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={impactTitle}
                  onChange={(e) => setImpactTitle(e.target.value)}
                  placeholder="e.g. 50 Rural Elders Underwent Free Cataract Surgeries in Pune"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Comprehensive Impact Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows="3"
                  value={impactDesc}
                  onChange={(e) => setImpactDesc(e.target.value)}
                  placeholder="Tell donors how their support changed lives on the ground..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    What Was Achieved
                  </label>
                  <input
                    type="text"
                    value={whatAchieved}
                    onChange={(e) => setWhatAchieved(e.target.value)}
                    placeholder="e.g. Procured 4 dialysis units and delivered to primary clinic"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Beneficiaries Reached (Count)
                  </label>
                  <input
                    type="number"
                    value={beneficiaries}
                    onChange={(e) => setBeneficiaries(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  How Funds Were Used (Expenditure Breakdown)
                </label>
                <input
                  type="text"
                  value={howUsed}
                  onChange={(e) => setHowUsed(e.target.value)}
                  placeholder="e.g. Equipment 75%, Doctor Honorarium 15%, Local Logistics 10%"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Upload field photos / PDF receipts */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Attach Evidence Files (Photos, Invoices, PDF Deliverable Proofs)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={(e) => setMediaFiles(Array.from(e.target.files))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs cursor-pointer"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Supports JPG, PNG, WEBP and PDF reports up to 10MB per file.
                </span>
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setImpactModalCampaign(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingImpact}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  {submittingImpact ? (
                    'Uploading Evidence...'
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit for Verification</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TrustCampaigns;
