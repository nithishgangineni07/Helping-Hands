import React, { useState, useEffect, useCallback } from 'react';
import {
  Heart,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Building2
} from 'lucide-react';
import { getTrustDonations, getTrustCampaigns } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const TrustDonations = () => {
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');

  // Load campaigns for filter
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const res = await getTrustCampaigns({ limit: 100 });
        setCampaigns(res.data || []);
      } catch (err) {
        console.error('Failed to load campaigns for donation filter:', err);
      }
    };
    loadCampaigns();
  }, []);

  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        campaignId: selectedCampaign || undefined,
        sort: selectedSort,
        page: currentPage,
        limit: 20
      };

      const res = await getTrustDonations(params);
      setDonations(res.data || []);
      setTotalRecords(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load trust donations:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCampaign, selectedSort, currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDonations();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchDonations]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
            Supporters & Donations Ledger
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time verified public contributions made exclusively toward your trust's campaigns.
          </p>
        </div>

        <div className="text-xs font-bold text-gray-500">
          Total Backers: <strong className="text-charcoal-900">{totalRecords}</strong>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search supporter name or TXN ID..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Filter by Campaign */}
          <div className="lg:col-span-4">
            <select
              value={selectedCampaign}
              onChange={(e) => {
                setSelectedCampaign(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">All Campaigns</option>
              {campaigns.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="lg:col-span-3">
            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* DONATIONS LEDGER (DUAL VIEW: CARDS ON MOBILE, TABLE ON TABLET/DESKTOP) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        
        {/* MOBILE CARD VIEW (Block on < md) */}
        <div className="block md:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Loading supporters...</span>
              </div>
            </div>
          ) : donations.length > 0 ? (
            donations.map((d) => (
              <div key={d._id} className="p-4 space-y-2.5 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-xs text-charcoal-950">{d.donorName}</span>
                      {d.anonymous && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                          <Lock className="w-2.5 h-2.5" /> Anon
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 line-clamp-1 mt-0.5" title={d.campaign?.title}>
                      {d.campaign?.title || 'Cause'}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-emerald-700 block">
                      +{formatCurrency(d.amount)}
                    </span>
                    <span className="text-[10px] text-gray-400 block">{formatDate(d.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-50 text-gray-500">
                  <span className="font-mono text-[10px] text-gray-400 truncate max-w-[150px]">
                    TXN: {d.transactionId}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                    <CheckCircle2 className="w-2.5 h-2.5" /> {d.paymentStatus}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-gray-400">
              No donations have been recorded for your campaigns yet.
            </div>
          )}
        </div>

        {/* DESKTOP TABLE VIEW (Hidden on mobile, block on md+) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Supporter</th>
                <th className="py-3.5 px-4">Target Cause</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-charcoal-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading supporters...</span>
                    </div>
                  </td>
                </tr>
              ) : donations.length > 0 ? (
                donations.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      {d.transactionId}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-charcoal-900">
                      <div className="flex items-center gap-1.5">
                        <span>{d.donorName}</span>
                        {d.anonymous && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                            <Lock className="w-2.5 h-2.5" /> Anonymous
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 truncate max-w-xs">
                      {d.campaign?.title || 'Cause'}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-emerald-700 text-sm">
                      {formatCurrency(d.amount)}
                    </td>

                    <td className="py-3.5 px-4 text-gray-400">
                      {formatDate(d.createdAt)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
                        <CheckCircle2 className="w-3 h-3" /> {d.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    No donations have been recorded for your campaigns yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="p-3.5 sm:p-4 bg-gray-50/70 border-t border-gray-200 flex flex-col xs:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500 font-medium">
              Page {currentPage} of {totalPages} ({totalRecords} supporters)
            </span>

            <div className="flex items-center gap-2 w-full xs:w-auto justify-end">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex-1 xs:flex-none px-3.5 py-2 sm:py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-charcoal-700 hover:bg-gray-50 disabled:opacity-40 transition-colors text-center"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex-1 xs:flex-none px-3.5 py-2 sm:py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-charcoal-700 hover:bg-gray-50 disabled:opacity-40 transition-colors text-center"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default TrustDonations;
