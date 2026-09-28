import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  PlusCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Ban,
  Search,
  Filter,
  Eye,
  FileText,
  Lock,
  Globe,
  ExternalLink,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X
} from 'lucide-react';
import {
  getAdminTrusts,
  getAdminTrustById,
  verifyTrust,
  rejectTrust,
  suspendTrust
} from '../../services/api';
import { formatDate, formatCurrency } from '../../utils/formatters';

const AdminTrusts = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const statusParam = searchParams.get('status') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [trusts, setTrusts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [selectedStatus, setSelectedStatus] = useState(statusParam);
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');

  // Drawer / Detail modal
  const [selectedTrustDetail, setSelectedTrustDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Confirmation Modal
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'verify'|'reject'|'suspend', trust: {} }
  const [actionNotes, setActionNotes] = useState('');
  const [actionProcessing, setActionProcessing] = useState(false);

  const fetchTrusts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        status: selectedStatus,
        location: locationFilter
      };
      if (selectedActivity === 'has_active') {
        params.hasActiveCampaigns = 'true';
      } else if (selectedActivity === 'no_active') {
        params.hasActiveCampaigns = 'false';
      }

      const res = await getAdminTrusts(params);
      setTrusts(res.data || []);
    } catch (err) {
      console.error('Error loading trusts:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStatus, selectedActivity, locationFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTrusts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchTrusts]);

  // Sync with searchParams
  useEffect(() => {
    const nextParams = {};
    if (selectedStatus !== 'all') nextParams.status = selectedStatus;
    if (searchTerm) nextParams.search = searchTerm;
    setSearchParams(nextParams, { replace: true });
  }, [selectedStatus, searchTerm, setSearchParams]);

  const handleOpenDetail = async (trustId) => {
    try {
      setLoadingDetail(true);
      const res = await getAdminTrustById(trustId);
      setSelectedTrustDetail(res.data);
    } catch (err) {
      alert('Failed to load trust details: ' + err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    try {
      setActionProcessing(true);
      const { type, trust } = confirmAction;
      if (type === 'verify') {
        await verifyTrust(trust._id, { notes: actionNotes });
      } else if (type === 'reject') {
        await rejectTrust(trust._id, { notes: actionNotes });
      } else if (type === 'suspend') {
        await suspendTrust(trust._id, { notes: actionNotes });
      }

      setConfirmAction(null);
      setActionNotes('');
      fetchTrusts();

      // Refresh detail modal if open
      if (selectedTrustDetail && selectedTrustDetail.trust._id === trust._id) {
        handleOpenDetail(trust._id);
      }
    } catch (err) {
      alert(err.message || 'Action failed.');
    } finally {
      setActionProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[11px]">
            <AlertCircle className="w-3 h-3" /> Pending Review
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[11px]">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'Suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-300 text-[11px]">
            <Ban className="w-3 h-3" /> Suspended
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
            Trust & NGO Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review compliance accreditation, registration numbers, tax exemption certs, and operational statuses.
          </p>
        </div>

        <Link
          to="/admin/create-trust"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center gap-2 w-fit"
        >
          <PlusCircle className="w-4 h-4" /> Add New Trust
        </Link>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Trust Name, Organizer, Reg #, Email, Location..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="all">All Verification Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Pending">Pending Review</option>
              <option value="Rejected">Rejected</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Campaign Activity Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="all">All Activity</option>
              <option value="has_active">Has Active Causes</option>
              <option value="no_active">No Active Causes</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="md:col-span-2 flex items-center justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
                setSelectedActivity('all');
                setLocationFilter('');
              }}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-charcoal-900 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>

        </div>
      </div>

      {/* TRUSTS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Trust Name</th>
                <th className="py-3.5 px-4">Organizer</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Registration #</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Causes</th>
                <th className="py-3.5 px-4">Total Raised</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-charcoal-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading trust records...</span>
                    </div>
                  </td>
                </tr>
              ) : trusts.length > 0 ? (
                trusts.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Clickable Trust Name */}
                    <td className="py-3.5 px-4 font-bold text-charcoal-900">
                      <button
                        onClick={() => handleOpenDetail(t._id)}
                        className="flex items-center gap-3 text-left hover:text-emerald-700 transition-colors group"
                      >
                        <img
                          src={t.logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=100&q=80'}
                          alt={t.name}
                          className="w-9 h-9 rounded-xl object-cover shrink-0 border border-gray-200"
                        />
                        <div>
                          <span className="font-extrabold text-xs block group-hover:underline">{t.name}</span>
                          <span className="text-[10px] text-gray-400 font-normal block truncate max-w-[140px]">
                            {t.contact?.email}
                          </span>
                        </div>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 font-semibold truncate max-w-[130px]">
                      {t.organizerName || 'Trustee'}
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 truncate max-w-[120px]">
                      {t.location}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-charcoal-700 font-bold">
                      {t.registrationNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(t.verificationStatus)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-emerald-700">{t.activeCampaignsCount || 0} active</span>
                      <span className="text-gray-400 block text-[10px]">({t.campaignsCount || 0} total)</span>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-charcoal-900">
                      {formatCurrency(t.totalRaised || 0)}
                    </td>

                    {/* Moderation Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(t._id)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-charcoal-900 transition-colors"
                          title="View Administrative Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {t.verificationStatus !== 'Verified' && (
                          <button
                            onClick={() => setConfirmAction({ type: 'verify', trust: t })}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors"
                          >
                            Verify
                          </button>
                        )}

                        {t.verificationStatus !== 'Rejected' && (
                          <button
                            onClick={() => setConfirmAction({ type: 'reject', trust: t })}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] transition-colors"
                          >
                            Reject
                          </button>
                        )}

                        {t.verificationStatus !== 'Suspended' && (
                          <button
                            onClick={() => setConfirmAction({ type: 'suspend', trust: t })}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] transition-colors"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    No trusts found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER: Complete Administrative Dossier */}
      {selectedTrustDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTrustDetail.trust.logo}
                  alt={selectedTrustDetail.trust.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                />
                <div>
                  <h3 className="text-lg font-black text-charcoal-950">
                    {selectedTrustDetail.trust.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {getStatusBadge(selectedTrustDetail.trust.verificationStatus)}
                    <span className="text-[11px] text-gray-400 font-mono">
                      Reg: {selectedTrustDetail.trust.registrationNumber}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedTrustDetail(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* SECTION: PUBLIC TRUST INFORMATION */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg w-fit mb-3">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Public Trust Profile Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div>
                    <span className="text-gray-400 font-bold block">Organizer / Trustee</span>
                    <span className="font-extrabold text-charcoal-900">{selectedTrustDetail.trust.organizerName || 'Authorized Signatory'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block">Location</span>
                    <span className="font-extrabold text-charcoal-900">{selectedTrustDetail.trust.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block">Contact Email</span>
                    <span className="font-extrabold text-charcoal-900">{selectedTrustDetail.trust.contact?.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block">Contact Phone</span>
                    <span className="font-extrabold text-charcoal-900">{selectedTrustDetail.trust.contact?.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block">Years of Service</span>
                    <span className="font-extrabold text-charcoal-900">{selectedTrustDetail.trust.yearsOfService} years</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block">People Helped</span>
                    <span className="font-extrabold text-charcoal-900">{selectedTrustDetail.trust.peopleHelpedCount}+ beneficiaries</span>
                  </div>
                </div>
              </div>

              {/* SECTION: PRIVATE / ADMIN-ONLY VERIFICATION & COMPLIANCE */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-lg w-fit mb-3">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Private Administrative Compliance & Verification Data</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-4 rounded-2xl bg-purple-50/30 border border-purple-100">
                  <div>
                    <span className="text-gray-500 font-bold block">GST Status</span>
                    <span className="font-extrabold uppercase text-charcoal-900">
                      {selectedTrustDetail.trust.gstStatus || 'Not Declared'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold block">GST Number</span>
                    <span className="font-mono font-extrabold text-charcoal-900">
                      {selectedTrustDetail.trust.gstNumber || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold block">Tax Exemption (80G / 12A)</span>
                    <span className="font-extrabold text-charcoal-900">
                      {selectedTrustDetail.trust.taxExemptionStatus || 'Not Applicable'} • {selectedTrustDetail.trust.taxExemptionType || ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold block">Tax Exemption Cert #</span>
                    <span className="font-mono font-extrabold text-charcoal-900">
                      {selectedTrustDetail.trust.taxExemptionNumber || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold block">FCRA Regulatory Status</span>
                    <span className="font-extrabold uppercase text-charcoal-900">
                      {selectedTrustDetail.trust.fcraStatus || 'Not Applicable'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold block">International Donations</span>
                    <span className={`font-bold ${selectedTrustDetail.trust.internationalDonationsEnabled ? 'text-emerald-700' : 'text-gray-500'}`}>
                      {selectedTrustDetail.trust.internationalDonationsEnabled ? 'Enabled' : 'Disabled (Domestic Only)'}
                    </span>
                  </div>
                </div>

                {/* Verification Documents List */}
                {selectedTrustDetail.trust.verificationDocuments && selectedTrustDetail.trust.verificationDocuments.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs font-bold text-gray-500 block mb-2">Submitted Proof of Registration / Legal Certificates:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedTrustDetail.trust.verificationDocuments.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-charcoal-700 hover:text-emerald-700 shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-600" />
                          <span>{doc.name || 'Certificate'}</span>
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: PERFORMANCE & FINANCIAL SUMMARY */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">Fundraising Summary</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Total Raised</span>
                    <span className="text-base font-black text-emerald-600">
                      {formatCurrency(selectedTrustDetail.metrics?.totalRaised || 0)}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Donations</span>
                    <span className="text-base font-black text-charcoal-900">
                      {selectedTrustDetail.metrics?.donationCount || 0}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Causes</span>
                    <span className="text-base font-black text-charcoal-900">
                      {selectedTrustDetail.metrics?.totalCampaigns || 0} ({selectedTrustDetail.metrics?.activeCampaigns || 0} Active)
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-400">Created: {formatDate(selectedTrustDetail.trust.createdAt)}</span>

              <div className="flex items-center gap-2">
                {selectedTrustDetail.trust.verificationStatus !== 'Verified' && (
                  <button
                    onClick={() => setConfirmAction({ type: 'verify', trust: selectedTrustDetail.trust })}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
                  >
                    Verify Trust
                  </button>
                )}
                {selectedTrustDetail.trust.verificationStatus !== 'Rejected' && (
                  <button
                    onClick={() => setConfirmAction({ type: 'reject', trust: selectedTrustDetail.trust })}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Reject
                  </button>
                )}
                {selectedTrustDetail.trust.verificationStatus !== 'Suspended' && (
                  <button
                    onClick={() => setConfirmAction({ type: 'suspend', trust: selectedTrustDetail.trust })}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Suspend Trust
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ACTION CONFIRMATION MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              {confirmAction.type === 'verify' ? (
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : confirmAction.type === 'suspend' ? (
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
                  {confirmAction.type} Trust?
                </h3>
                <p className="text-xs text-gray-500">
                  {confirmAction.trust.name}
                </p>
              </div>
            </div>

            <p className="text-xs text-charcoal-700">
              {confirmAction.type === 'verify' && 'Approving this trust will enable public cause publishing and fundraising operations.'}
              {confirmAction.type === 'reject' && 'Rejecting this trust will notify the organizer and disable active cause requests.'}
              {confirmAction.type === 'suspend' && 'Suspending this trust will automatically pause all active campaigns and restrict donor access.'}
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Administrative Notes / Reason (Optional)
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Enter regulatory verification notes for the audit trail..."
                rows="3"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                disabled={actionProcessing}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={actionProcessing}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
                  confirmAction.type === 'verify'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : confirmAction.type === 'suspend'
                    ? 'bg-gray-900 hover:bg-gray-800'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {actionProcessing ? 'Processing...' : `Confirm ${confirmAction.type.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminTrusts;
