import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Heart,
  Search,
  Filter,
  ArrowUpDown,
  Lock,
  UserCheck,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getAdminDonations, getCampaigns, getTrusts } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const SORT_OPTIONS = [
  { label: 'Date: Newest → Oldest', value: 'date_desc' },
  { label: 'Date: Oldest → Newest', value: 'date_asc' },
  { label: 'Donor Name: A → Z', value: 'donor_asc' },
  { label: 'Donor Name: Z → A', value: 'donor_desc' },
  { label: 'Amount: Highest → Lowest', value: 'amount_desc' },
  { label: 'Amount: Lowest → Highest', value: 'amount_asc' },
  { label: 'Most Frequent Donors 🔥', value: 'most_frequent' },
  { label: 'Least Frequent Donors', value: 'least_frequent' }
];

const AdminDonations = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortParam = searchParams.get('sort') || 'date_desc';
  const statusParam = searchParams.get('status') || 'all';
  const anonParam = searchParams.get('anonymous') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);
  const [selectedStatus, setSelectedStatus] = useState(statusParam);
  const [selectedAnon, setSelectedAnon] = useState(anonParam);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        sort: selectedSort,
        status: selectedStatus,
        anonymous: selectedAnon,
        minAmount: minAmount || undefined,
        maxAmount: maxAmount || undefined,
        page: currentPage,
        limit: 20
      };

      const res = await getAdminDonations(params);
      setDonations(res.data || []);
      setTotalRecords(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Error loading donations:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedSort, selectedStatus, selectedAnon, minAmount, maxAmount, currentPage]);

  // Debounced Search & Filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDonations();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchDonations]);

  // Sync state to URL
  useEffect(() => {
    const nextParams = {};
    if (selectedSort !== 'date_desc') nextParams.sort = selectedSort;
    if (selectedStatus !== 'all') nextParams.status = selectedStatus;
    if (selectedAnon !== 'all') nextParams.anonymous = selectedAnon;
    if (searchTerm) nextParams.search = searchTerm;
    setSearchParams(nextParams, { replace: true });
  }, [selectedSort, selectedStatus, selectedAnon, searchTerm, setSearchParams]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSort('date_desc');
    setSelectedStatus('all');
    setSelectedAnon('all');
    setMinAmount('');
    setMaxAmount('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
            Donation Ledger & Audits
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Complete platform transaction history, payment verification status, and donor frequency analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">
            Total Records: <strong className="text-charcoal-900">{totalRecords}</strong>
          </span>
        </div>
      </div>

      {/* FILTER & 8-WAY SORT TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-4">
        
        {/* Row 1: Search & Sorting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search donor name, email, TXN ID..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* 8-Way Sort Select */}
          <div className="lg:col-span-4">
            <div className="relative">
              <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
              <select
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Anonymous Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedAnon}
              onChange={(e) => {
                setSelectedAnon(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="all">All Donors (Anon & Named)</option>
              <option value="named">Named Supporters Only</option>
              <option value="anonymous">Anonymous Donors Only</option>
            </select>
          </div>
        </div>

        {/* Row 2: Secondary Filters & Amount Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-2 border-t border-gray-100">
          {/* Payment Status */}
          <div className="lg:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="all">All Payment Statuses</option>
              <option value="Success">Success / Paid</option>
              <option value="Pending">Pending Confirmation</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Min Amount */}
          <div className="lg:col-span-3">
            <input
              type="number"
              value={minAmount}
              onChange={(e) => {
                setMinAmount(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Min Amount (₹)"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Max Amount */}
          <div className="lg:col-span-3">
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => {
                setMaxAmount(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Max Amount (₹)"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Reset Filters */}
          <div className="lg:col-span-3 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-charcoal-900 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

      </div>

      {/* DONATIONS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Donor (Admin View)</th>
                <th className="py-3.5 px-4">Donor Email</th>
                <th className="py-3.5 px-4">Cause</th>
                <th className="py-3.5 px-4">Trust</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-charcoal-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Retrieving donation ledger records...</span>
                    </div>
                  </td>
                </tr>
              ) : donations.length > 0 ? (
                donations.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Transaction ID */}
                    <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold">
                      {d.transactionId}
                    </td>

                    {/* Donor Name with Anon Badge */}
                    <td className="py-3.5 px-4 font-bold text-charcoal-900">
                      <div className="flex items-center gap-1.5">
                        <span>{d.donorName}</span>
                        {d.anonymous && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200" title="Hidden from public, visible to admin">
                            <Lock className="w-2.5 h-2.5" /> Anon
                          </span>
                        )}
                        {d.donorFrequency && d.donorFrequency > 1 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-extrabold text-[10px] border border-purple-200" title={`${d.donorFrequency} total contributions by this donor`}>
                            {d.donorFrequency}x
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Donor Email (Internal Data) */}
                    <td className="py-3.5 px-4 text-gray-500 truncate max-w-[150px]">
                      {d.donorEmail}
                    </td>

                    {/* Cause Title */}
                    <td className="py-3.5 px-4 text-gray-700 truncate max-w-[160px]">
                      {d.campaign?.title || 'Cause'}
                    </td>

                    {/* Trust */}
                    <td className="py-3.5 px-4 text-gray-600 truncate max-w-[130px]">
                      {d.trust?.name || 'Trust'}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-extrabold text-emerald-700 text-sm">
                      {formatCurrency(d.amount)}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-gray-400">
                      {formatDate(d.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        {d.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    No donation records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="p-4 bg-gray-50/70 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Page {currentPage} of {totalPages} ({totalRecords} records)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-charcoal-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-charcoal-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDonations;
