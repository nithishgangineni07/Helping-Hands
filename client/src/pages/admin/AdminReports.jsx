import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  CheckCircle2,
  Users,
  Share2,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { getAdminReports } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await getAdminReports();
        setReports(res.data);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-gray-500">Aggregating cross-platform analytics...</p>
      </div>
    );
  }

  const {
    monthlyDonations = [],
    donationsByCategory = [],
    topCampaigns = [],
    mostShared = [],
    completionRate = 0,
    verificationRate = 0,
    donorFrequency = [],
    summary = {}
  } = reports || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
          Executive Reports & Analytics
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          High-level institutional insights derived strictly from active MongoDB aggregation pipelines.
        </p>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Campaign Completion Rate
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{completionRate}%</div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            {summary.completedCampaigns} of {summary.totalCampaigns} causes completed
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Trust Verification Rate
          </span>
          <div className="text-2xl font-black text-blue-600 mt-1">{verificationRate}%</div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            {summary.verifiedTrusts} of {summary.totalTrusts} trusts verified
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Cause Categories Active
          </span>
          <div className="text-2xl font-black text-purple-600 mt-1">{donationsByCategory.length}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Sectors receiving community aid
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Total Causes Published
          </span>
          <div className="text-2xl font-black text-charcoal-900 mt-1">{summary.totalCampaigns}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Active and archived campaigns
          </span>
        </div>
      </div>

      {/* CHARTS / BREAKDOWN GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Donations Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-charcoal-900">Donations Received by Month</h3>
              <p className="text-xs text-gray-500">Aggregated successful transaction volume.</p>
            </div>
            <Calendar className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="space-y-3 pt-2">
            {monthlyDonations.length > 0 ? (
              monthlyDonations.map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-charcoal-800">
                      {MONTH_NAMES[m._id.month - 1]} {m._id.year} ({m.count} donations)
                    </span>
                    <span className="text-emerald-700 font-extrabold">{formatCurrency(m.totalAmount)}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((m.totalAmount / (monthlyDonations[0]?.totalAmount || 1)) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-6 text-center">No monthly donation history recorded yet.</p>
            )}
          </div>
        </div>

        {/* Donations by Category */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-charcoal-900">Funding by Cause Sector</h3>
              <p className="text-xs text-gray-500">Distribution of raised funds across categories.</p>
            </div>
            <PieChart className="w-5 h-5 text-purple-600" />
          </div>

          <div className="space-y-3 pt-2">
            {donationsByCategory.length > 0 ? (
              donationsByCategory.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-charcoal-800">
                      {cat._id} <span className="text-gray-400 font-normal">({cat.campaignCount} causes)</span>
                    </span>
                    <span className="text-charcoal-900 font-extrabold">{formatCurrency(cat.totalRaised)}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((cat.totalRaised / (donationsByCategory[0]?.totalRaised || 1)) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-6 text-center">No categorical donations available.</p>
            )}
          </div>
        </div>

      </div>

      {/* TOP FUNDED & MOST SHARED LEADERBOARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Funded Causes */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-charcoal-900">Highest Funded Causes</h3>
              <p className="text-xs text-gray-500">Campaigns achieving milestone contributions.</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-2">Cause Title</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2 text-right">Raised</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-charcoal-800 font-medium">
                {topCampaigns.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/50">
                    <td className="py-2.5 font-bold text-charcoal-900 truncate max-w-[200px]">{c.title}</td>
                    <td className="py-2.5 text-gray-500">{c.category}</td>
                    <td className="py-2.5 text-right font-extrabold text-emerald-600">{formatCurrency(c.raisedAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Shared Campaigns */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-charcoal-900">Most Viral Causes (Shares)</h3>
              <p className="text-xs text-gray-500">Top shared campaigns driving community advocacy.</p>
            </div>
            <Share2 className="w-5 h-5 text-blue-600" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-2">Cause Title</th>
                  <th className="pb-2">Donors</th>
                  <th className="pb-2 text-right">Shares</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-charcoal-800 font-medium">
                {mostShared.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/50">
                    <td className="py-2.5 font-bold text-charcoal-900 truncate max-w-[200px]">{c.title}</td>
                    <td className="py-2.5 text-gray-500">{c.donorCount || 0}</td>
                    <td className="py-2.5 text-right font-extrabold text-blue-600">{c.shareCount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminReports;
