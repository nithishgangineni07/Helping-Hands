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
  X
} from 'lucide-react';
import {
  getAdminCampaigns,
  approveCampaign,
  rejectCampaign,
  suspendCampaign,
  getTrusts
} from '../../services/api';
import { formatCurrency, calculatePercentage, formatDate } from '../../utils/formatters';

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

const AdminCampaigns = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const statusParam = searchParams.get('status') || 'all';
  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'newest';
  const searchParam = searchParams.get('search') || '';

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trustsList, setTrustsList] = useState([]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [selectedStatus, setSelectedStatus] = useState(statusParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedTrust, setSelectedTrust] = useState('all');
  const [selectedFunding, setSelectedFunding] = useState('all');
  const [selectedSort, setSelectedSort] = useState(sortParam);

  // Moderation Modal
  const [confirmModal, setConfirmModal] = useState(null); // { type: 'approve'|'reject'|'suspend', campaign: {} }
  const [modalNotes, setModalNotes] = useState('');
  const [modalProcessing, setModalProcessing] = useState(false);

  // Fetch Trusts for filter dropdown
  useEffect(() => {
    const loadTrusts = async () => {
      try {
        const res = await getTrusts({ limit: 100 });
        setTrustsList(res.data || []);
      } catch (e) {
        console.error('Failed to load trust filter options:', e);
      }
    };
    loadTrusts();
  }, []);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        status: selectedStatus,
        category: selectedCategory,
        trust: selectedTrust !== 'all' ? selectedTrust : undefined,
        funding: selectedFunding,
        sort: selectedSort
      };

      const res = await getAdminCampaigns(params);
      setCampaigns(res.data || []);
    } catch (err) {
      console.error('Error loading campaigns:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStatus, selectedCategory, selectedTrust, selectedFunding, selectedSort]);

  // Debounced search
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
    if (selectedCategory !== 'all') nextParams.category = selectedCategory;
    if (selectedSort !== 'newest') nextParams.sort = selectedSort;
    if (searchTerm) nextParams.search = searchTerm;
    setSearchParams(nextParams, { replace: true });
  }, [selectedStatus, selectedCategory, selectedSort, searchTerm, setSearchParams]);

  const handleExecuteModeration = async () => {
    if (!confirmModal) return;
    try {
      setModalProcessing(true);
      const { type, campaign } = confirmModal;
      if (type === 'approve') {
        await approveCampaign(campaign._id);
      } else if (type === 'reject') {
        await rejectCampaign(campaign._id, { notes: modalNotes });
      } else if (type === 'suspend') {
        await suspendCampaign(campaign._id, { notes: modalNotes });
      }

      setConfirmModal(null);
      setModalNotes('');
      fetchCampaigns();
    } catch (err) {
      alert(err.message || 'Action failed.');
    } finally {
      setModalProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[11px]">
            <TrendingUp className="w-3 h-3" /> Completed
          </span>
        );
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[11px]">
            <AlertCircle className="w-3 h-3" /> Pending Review
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-300 text-[11px]">
            <Ban className="w-3 h-3" /> Suspended
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[11px]">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold text-[11px]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
            Campaign & Cause Moderation
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review fundraising causes, audit target amounts, approve public publishing, or suspend causes.
          </p>
        </div>

        <Link
          to="/admin/create-campaign"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center gap-2 w-fit"
        >
          <PlusCircle className="w-4 h-4" /> Publish New Cause
        </Link>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cause title or category..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="pending_review">Pending Review</option>
              <option value="completed">Completed</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat === 'All' ? 'all' : cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Funding Status Filter */}
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

          {/* Sorting */}
          <div className="lg:col-span-2">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="shares">Most Shared</option>
              <option value="donors_desc">Most Donors</option>
              <option value="raised_desc">Highest Raised</option>
              <option value="target_desc">Highest Target</option>
            </select>
          </div>

        </div>
      </div>

      {/* CAMPAIGNS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Cause Title</th>
                <th className="py-3.5 px-4">Trust Partner</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Target</th>
                <th className="py-3.5 px-4">Raised</th>
                <th className="py-3.5 px-4">Progress</th>
                <th className="py-3.5 px-4">Engagement</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-charcoal-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading campaign records...</span>
                    </div>
                  </td>
                </tr>
              ) : campaigns.length > 0 ? (
                campaigns.map((c) => {
                  const pct = calculatePercentage(c.raisedAmount, c.targetAmount);
                  return (
                    <tr key={c._id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Title & Thumbnail */}
                      <td className="py-3.5 px-4 font-bold text-charcoal-900 max-w-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.image || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=100&q=80'}
                            alt={c.title}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-200"
                          />
                          <div className="min-w-0">
                            <span className="font-extrabold text-xs block truncate">{c.title}</span>
                            <span className="text-[10px] text-gray-400 block">
                              Deadline: {formatDate(c.deadline)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Trust */}
                      <td className="py-3.5 px-4 text-gray-600 font-semibold truncate max-w-[130px]">
                        {c.trust?.name || 'Trust Partner'}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold text-[10px]">
                          {c.category}
                        </span>
                      </td>

                      {/* Target */}
                      <td className="py-3.5 px-4 font-bold text-charcoal-900">
                        {formatCurrency(c.targetAmount)}
                      </td>

                      {/* Raised */}
                      <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                        {formatCurrency(c.raisedAmount)}
                      </td>

                      {/* Progress Bar */}
                      <td className="py-3.5 px-4 min-w-[100px]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span>{pct}%</span>
                          </div>
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Donors & Shares */}
                      <td className="py-3.5 px-4 text-gray-500">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="flex items-center gap-0.5">
                            <Users className="w-3 h-3 text-emerald-600" />
                            {c.donorCount || 0}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Share2 className="w-3 h-3 text-blue-500" />
                            {c.shareCount || 0}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(c.status)}
                      </td>

                      {/* Moderation Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/campaigns/${c._id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-charcoal-900 transition-colors"
                            title="View Public Campaign Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {c.status === 'pending_review' && (
                            <>
                              <button
                                onClick={() => setConfirmModal({ type: 'approve', campaign: c })}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => setConfirmModal({ type: 'reject', campaign: c })}
                                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {c.status === 'active' && (
                            <button
                              onClick={() => setConfirmModal({ type: 'suspend', campaign: c })}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] transition-colors"
                            >
                              Suspend
                            </button>
                          )}

                          {c.status === 'suspended' && (
                            <button
                              onClick={() => setConfirmModal({ type: 'approve', campaign: c })}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-gray-400">
                    No campaigns found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              {confirmModal.type === 'approve' ? (
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : confirmModal.type === 'suspend' ? (
                <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                  <Ban className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="text-base font-extrabold text-charcoal-900 capitalize">
                  {confirmModal.type} Campaign?
                </h3>
                <p className="text-xs text-gray-500 truncate max-w-[250px]">
                  {confirmModal.campaign.title}
                </p>
              </div>
            </div>

            <p className="text-xs text-charcoal-700">
              {confirmModal.type === 'approve' && 'Approving this cause will publish it immediately on the public explore page and enable guest donations.'}
              {confirmModal.type === 'reject' && 'Rejecting this cause will deny publication and record administrative reason.'}
              {confirmModal.type === 'suspend' && 'Suspending will freeze further donor contributions and hide it from the active public registry.'}
            </p>

            {confirmModal.type !== 'approve' && (
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Reason / Moderation Notes
                </label>
                <textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Explain reason for the audit trail..."
                  rows="3"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                ></textarea>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmModal(null)}
                disabled={modalProcessing}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteModeration}
                disabled={modalProcessing}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
                  confirmModal.type === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : confirmModal.type === 'suspend'
                    ? 'bg-gray-900 hover:bg-gray-800'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {modalProcessing ? 'Processing...' : `Confirm ${confirmModal.type.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCampaigns;
