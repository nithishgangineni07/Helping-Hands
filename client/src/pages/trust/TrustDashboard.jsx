import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  PlusCircle,
  TrendingUp,
  Users,
  Target,
  FileText,
  Upload,
  Calendar,
  AlertCircle,
  Share2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  HeartHandshake,
  DollarSign
} from 'lucide-react';
import { getTrustDashboard } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const TrustDashboard = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getTrustDashboard();
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load trust dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-gray-500">Retrieving your trust workspace analytics...</p>
      </div>
    );
  }

  const trust = dashboardData?.trust;
  const stats = dashboardData?.stats || {};
  const recentCampaigns = dashboardData?.recentCampaigns || [];
  const recentDonations = dashboardData?.recentDonations || [];

  const {
    totalCampaigns = 0,
    activeCauses = 0,
    totalRaised = 0,
    supportersCount = 0,
    completedCauses = 0,
    pendingReviewCount = 0,
    pendingImpactCount = 0
  } = stats;

  const isVerified = trust?.verificationStatus === 'Verified';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Profile Strip */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-gray-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
            {trust?.logo ? (
              <img src={trust.logo} alt={trust.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-charcoal-900 tracking-tight truncate max-w-full">
                {trust?.name}
              </h1>
              {isVerified ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Organization
                </span>
              ) : trust?.verificationStatus === 'Pending' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  Pending Review
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                  <XCircle className="w-3.5 h-3.5" />
                  {trust?.verificationStatus}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Trustee: <strong className="text-charcoal-700">{trust?.organizerName || 'Authorized Signatory'}</strong></span>
              <span className="text-gray-300">•</span>
              <span>Reg: <strong className="font-mono text-charcoal-700">{trust?.registrationNumber}</strong></span>
              {trust?.location && (
                <>
                  <span className="text-gray-300">•</span>
                  <span>{trust?.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
          <Link
            to="/trust/profile"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-charcoal-700 font-bold text-xs hover:bg-gray-50 transition-colors shadow-xs text-center"
          >
            Edit Profile & Compliance
          </Link>
          <Link
            to="/trust/add-cause"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Cause</span>
          </Link>
        </div>
      </div>

      {/* Verification Status Warning if Pending */}
      {!isVerified && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 sm:gap-4 text-amber-900">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5 text-amber-600" />
          <div className="text-xs">
            <h4 className="font-extrabold text-sm text-amber-950">Organization Verification In Progress</h4>
            <p className="mt-1 text-amber-800 leading-relaxed">
              Your registration documents are currently queued for administrator validation. While pending, you can prepare fundraising causes and complete your 80G/GST compliance profile.
            </p>
          </div>
        </div>
      )}

      {/* CLICKABLE ANALYTICS CARDS (MANDATORY INTERACTIVE AFFORDANCE) */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Your Performance Dashboard (Click to Filter Causes & Ledger)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* Total Campaigns */}
          <Link
            to="/trust/campaigns"
            className="group bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Total Causes</span>
              <Target className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
            </div>
            <div className="mt-2.5 sm:mt-3">
              <div className="text-xl sm:text-2xl font-black text-charcoal-900">{totalCampaigns}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Active Causes */}
          <Link
            to="/trust/campaigns?status=active"
            className="group bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Active Causes</span>
              <TrendingUp className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
            </div>
            <div className="mt-2.5 sm:mt-3">
              <div className="text-xl sm:text-2xl font-black text-emerald-600">{activeCauses}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Currently live</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Total Funds Raised */}
          <Link
            to="/trust/donations"
            className="group bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between min-w-0"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Total Raised</span>
              <DollarSign className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
            </div>
            <div className="mt-2.5 sm:mt-3 min-w-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-black text-emerald-700 truncate" title={formatCurrency(totalRaised)}>
                {formatCurrency(totalRaised)}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Donation ledger</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Supporters / Donors */}
          <Link
            to="/trust/donations"
            className="group bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-purple-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Supporters</span>
              <Users className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform shrink-0" />
            </div>
            <div className="mt-2.5 sm:mt-3">
              <div className="text-xl sm:text-2xl font-black text-purple-700">{supportersCount}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-purple-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>View donors</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Completed Causes */}
          <Link
            to="/trust/campaigns?status=completed"
            className="group bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Completed</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform shrink-0" />
            </div>
            <div className="mt-2.5 sm:mt-3">
              <div className="text-xl sm:text-2xl font-black text-blue-600">{completedCauses}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Funded causes</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Pending Review */}
          <Link
            to="/trust/campaigns?status=pending_review"
            className="group bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Pending Review</span>
              <Clock className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
            </div>
            <div className="mt-2.5 sm:mt-3">
              <div className="text-xl sm:text-2xl font-black text-amber-600">{pendingReviewCount}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Under audit</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

        </div>
      </div>

      {/* QUICK WORKSPACE ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/trust/add-cause"
          className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Fundraising</span>
            <h3 className="font-extrabold text-charcoal-900 text-base mt-0.5">+ Add New Cause</h3>
            <p className="text-xs text-gray-500 mt-1">Multi-step wizard with compliance validation and document submission.</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/trust/campaigns"
          className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Causes</span>
            <h3 className="font-extrabold text-charcoal-900 text-base mt-0.5">My Causes / Campaigns</h3>
            <p className="text-xs text-gray-500 mt-1">Manage draft, active, and completed causes with 12 sorting options.</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/trust/impact-updates"
          className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Transparency</span>
            <h3 className="font-extrabold text-charcoal-900 text-base mt-0.5">Post-Donation Evidence</h3>
            <p className="text-xs text-gray-500 mt-1">Upload field photographs, beneficiary reports, and expenditure invoices.</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* RECENT CAUSES & DONATIONS RECENT FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Causes */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-charcoal-900">Your Recent Causes</h3>
              <p className="text-xs text-gray-500">Latest fundraising drives under your trust.</p>
            </div>
            <Link to="/trust/campaigns" className="text-xs font-bold text-emerald-600 hover:underline">
              View all →
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentCampaigns.length > 0 ? (
              recentCampaigns.map((c) => (
                <div key={c._id} className="py-3 flex items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-200"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-xs text-charcoal-900 truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs">
                        {c.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 block truncate">{c.category}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-emerald-700 block">
                      {formatCurrency(c.raisedAmount)}
                    </span>
                    <span className="text-[10px] text-gray-400 block">of {formatCurrency(c.targetAmount)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-6 text-center">No causes created yet.</p>
            )}
          </div>
        </div>

        {/* Recent Supporters */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-charcoal-900">Recent Supporters</h3>
              <p className="text-xs text-gray-500">Donations contributed toward your causes.</p>
            </div>
            <Link to="/trust/donations" className="text-xs font-bold text-emerald-600 hover:underline">
              Supporters ledger →
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentDonations.length > 0 ? (
              recentDonations.map((d) => (
                <div key={d._id} className="py-3 flex items-center justify-between gap-3 min-w-0">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-xs text-charcoal-900 truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs">
                      {d.anonymous ? 'Anonymous Supporter' : d.donorName}
                    </h4>
                    <span className="text-[10px] text-gray-400 block truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs">
                      {d.campaign?.title || 'Cause'}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-emerald-700 block">
                      +{formatCurrency(d.amount)}
                    </span>
                    <span className="text-[10px] text-gray-400 block">{formatDate(d.createdAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-6 text-center">No donations received yet.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default TrustDashboard;
