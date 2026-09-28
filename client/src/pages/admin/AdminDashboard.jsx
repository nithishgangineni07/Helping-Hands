import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Heart,
  TrendingUp,
  Clock,
  PlusCircle,
  CheckSquare,
  DollarSign,
  ArrowRight,
  Users,
  Share2,
  AlertTriangle,
  FileCheck2,
  Ban,
  FileText
} from 'lucide-react';
import { getAdminStats } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getAdminStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-gray-500">Querying live database analytics...</p>
      </div>
    );
  }

  const {
    totalTrusts = 0,
    verifiedTrusts = 0,
    pendingTrusts = 0,
    suspendedTrusts = 0,
    totalCampaigns = 0,
    activeCampaigns = 0,
    completedCampaigns = 0,
    suspendedCampaigns = 0,
    pendingCampaigns = 0,
    totalDonationsCount = 0,
    totalAmountRaised = 0,
    totalDonors = 0,
    totalShares = 0,
    pendingReviews = 0,
    recentDonations = [],
    recentCampaigns = []
  } = stats || {};

  return (
    <div className="space-y-8">
      {/* Top Banner / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified Admin Portal • Live MongoDB Sync
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
            Administrative Command Center
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time oversight of trusts, fundraising campaigns, verified donations, and compliance audits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/create-trust"
            className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-charcoal-800 font-bold text-xs hover:border-emerald-500 hover:text-emerald-700 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Add Trust</span>
          </Link>
          <Link
            to="/admin/create-campaign"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Cause</span>
          </Link>
        </div>
      </div>

      {/* CLICKABLE ANALYTICS CARDS GRID */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Key Performance Indicators (Click to View Filtered Records)
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          
          {/* Total Trusts */}
          <Link
            to="/admin/trusts"
            className="group bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Total Trusts</span>
              <Building2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-charcoal-900">{totalTrusts}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Verified Trusts */}
          <Link
            to="/admin/trusts?status=Verified"
            className="group bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Verified Trusts</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-emerald-600">{verifiedTrusts}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Filtered verified</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Pending Trusts */}
          <Link
            to="/admin/trusts?status=Pending"
            className="group bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Pending Trusts</span>
              <Clock className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-amber-600">{pendingTrusts}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Review queue</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Active Campaigns */}
          <Link
            to="/admin/campaigns?status=active"
            className="group bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Active Causes</span>
              <TrendingUp className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-charcoal-900">{activeCampaigns}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Live causes</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Completed Campaigns */}
          <Link
            to="/admin/campaigns?status=completed"
            className="group bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Completed</span>
              <CheckSquare className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-blue-600">{completedCampaigns}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Funded causes</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Suspended Campaigns */}
          <Link
            to="/admin/campaigns?status=suspended"
            className="group bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-gray-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Suspended</span>
              <Ban className="w-4 h-4 text-gray-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-gray-600">{suspendedCampaigns}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Paused causes</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Total Donations */}
          <Link
            to="/admin/donations"
            className="group bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-rose-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Total Donations</span>
              <Heart className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-charcoal-900">{totalDonationsCount}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>View ledger</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Total Amount Raised */}
          <Link
            to="/admin/donations"
            className="group bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Total Raised</span>
              <DollarSign className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3">
              <div className="text-xl font-black text-emerald-700 truncate">{formatCurrency(totalAmountRaised)}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Financial details</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Total Donors */}
          <Link
            to="/admin/donations?sort=most_frequent"
            className="group bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-purple-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Unique Donors</span>
              <Users className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-purple-700">{totalDonors}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-purple-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Frequent donors</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Total Shares */}
          <Link
            to="/admin/campaigns?sort=shares"
            className="group bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Total Shares</span>
              <Share2 className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-blue-700">{totalShares}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Viral causes</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Pending Reviews */}
          <Link
            to="/admin/campaigns?status=pending_review"
            className="group bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Pending Reviews</span>
              <AlertTriangle className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-amber-600">{pendingReviews}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Pending causes</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Suspended Trusts */}
          <Link
            to="/admin/trusts?status=Suspended"
            className="group bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-gray-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
              <span>Suspended Trusts</span>
              <Ban className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-rose-700">{suspendedTrusts}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 mt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Suspended list</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

        </div>
      </div>

      {/* QUICK WORKSPACE SHORTCUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/admin/trusts"
          className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Accreditation</span>
            <h3 className="font-extrabold text-charcoal-900 text-base mt-0.5">Trust Management</h3>
            <p className="text-xs text-gray-500 mt-1">Review NGO compliance docs, verify or suspend accounts.</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/admin/campaigns"
          className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Fundraising</span>
            <h3 className="font-extrabold text-charcoal-900 text-base mt-0.5">Campaign Moderation</h3>
            <p className="text-xs text-gray-500 mt-1">Approve pending causes, monitor progress, mark completed.</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/admin/audit-logs"
          className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Security</span>
            <h3 className="font-extrabold text-charcoal-900 text-base mt-0.5">Audit Trail & Ledger</h3>
            <p className="text-xs text-gray-500 mt-1">Append-only administrative actions & financial log.</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* LIVE DONATIONS & RECENT CAMPAIGNS TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations Feed */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-charcoal-900">Recent Contributions</h3>
              <p className="text-xs text-gray-500">Real-time public donor ledger transactions.</p>
            </div>
            <Link to="/admin/donations" className="text-xs font-bold text-emerald-600 hover:underline">
              View all →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-2.5">Donor</th>
                  <th className="pb-2.5">Cause</th>
                  <th className="pb-2.5">Amount</th>
                  <th className="pb-2.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-charcoal-800 font-medium">
                {recentDonations && recentDonations.length > 0 ? (
                  recentDonations.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 font-bold text-charcoal-900 truncate max-w-[130px]">
                        {d.anonymous ? `${d.donorName} (Anon)` : d.donorName}
                      </td>
                      <td className="py-2.5 text-gray-600 truncate max-w-[140px]">
                        {d.campaign?.title || 'Cause'}
                      </td>
                      <td className="py-2.5 font-extrabold text-emerald-600">
                        {formatCurrency(d.amount)}
                      </td>
                      <td className="py-2.5 text-gray-400">
                        {formatDate(d.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-gray-400">No donations recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-charcoal-900">Latest Campaigns</h3>
              <p className="text-xs text-gray-500">Recently published and pending fundraising causes.</p>
            </div>
            <Link to="/admin/campaigns" className="text-xs font-bold text-emerald-600 hover:underline">
              Manage →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-2.5">Title</th>
                  <th className="pb-2.5">Trust</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Raised</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-charcoal-800 font-medium">
                {recentCampaigns && recentCampaigns.length > 0 ? (
                  recentCampaigns.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 font-bold text-charcoal-900 truncate max-w-[150px]">
                        {c.title}
                      </td>
                      <td className="py-2.5 text-gray-600 truncate max-w-[120px]">
                        {c.trust?.name || 'Trust'}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : c.status === 'completed'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-2.5 font-bold text-right text-emerald-600">
                        {formatCurrency(c.raisedAmount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-gray-400">No campaigns found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
