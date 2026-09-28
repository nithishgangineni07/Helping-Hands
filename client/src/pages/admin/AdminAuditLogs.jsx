import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  ShieldCheck,
  Building2,
  Megaphone,
  Heart,
  FileCheck2,
  Calendar,
  Lock,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { getAdminAuditLogs } from '../../services/api';
import { formatDate } from '../../utils/formatters';

const ACTIONS = [
  'All Actions',
  'TRUST_REGISTERED',
  'TRUST_VERIFIED',
  'TRUST_REJECTED',
  'TRUST_SUSPENDED',
  'TRUST_PROFILE_UPDATED',
  'COMPLIANCE_UPDATED',
  'CAMPAIGN_SUBMITTED',
  'CAMPAIGN_APPROVED',
  'CAMPAIGN_REJECTED',
  'CAMPAIGN_SUSPENDED',
  'CAMPAIGN_COMPLETED',
  'DONATION_RECEIVED',
  'IMPACT_UPDATE_SUBMITTED',
  'IMPACT_UPDATE_APPROVED',
  'IMPACT_UPDATE_REJECTED'
];

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedActorType, setSelectedActorType] = useState('all');
  const [sortOrder, setSortOrder] = useState('date_desc');

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        action: selectedAction !== 'all' ? selectedAction : undefined,
        actorType: selectedActorType !== 'all' ? selectedActorType : undefined,
        sort: sortOrder,
        page: currentPage,
        limit: 25
      };

      const res = await getAdminAuditLogs(params);
      setLogs(res.data || []);
      setTotalRecords(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedAction, selectedActorType, sortOrder, currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchLogs]);

  const getActionBadge = (action) => {
    if (action.includes('VERIFIED') || action.includes('APPROVED')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
          {action}
        </span>
      );
    }
    if (action.includes('REJECTED') || action.includes('SUSPENDED')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[10px]">
          {action}
        </span>
      );
    }
    if (action.includes('DONATION')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[10px]">
          {action}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200 text-[10px]">
        {action}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 mb-2">
            <Lock className="w-3.5 h-3.5" />
            Append-Only Regulatory Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
            System & Compliance Audit Trail
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Immutable log of all administrative validations, financial events, and trust actions. Records cannot be edited or deleted.
          </p>
        </div>

        <div className="text-xs font-bold text-gray-500">
          Total Logged Events: <strong className="text-charcoal-900">{totalRecords}</strong>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          {/* Search Term */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search event type or actor name..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>

          {/* Action Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            >
              {ACTIONS.map((act) => (
                <option key={act} value={act === 'All Actions' ? 'all' : act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          {/* Actor Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedActorType}
              onChange={(e) => {
                setSelectedActorType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            >
              <option value="all">All Actors</option>
              <option value="Admin">Admin</option>
              <option value="Trust">Trust</option>
              <option value="Donor">Donor</option>
              <option value="System">System</option>
            </select>
          </div>

          {/* Date Sort */}
          <div className="lg:col-span-2">
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
            </select>
          </div>

        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Entity Type</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Metadata & Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-charcoal-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying append-only audit trail records...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                      {formatDate(log.timestamp || log.createdAt)}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4">
                      {getActionBadge(log.action)}
                    </td>

                    {/* Entity Type */}
                    <td className="py-3.5 px-4 font-bold text-charcoal-900">
                      {log.entityType}
                    </td>

                    {/* Actor */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-charcoal-900 block">{log.actorName || 'System'}</span>
                      <span className="text-[10px] text-gray-400 font-semibold block uppercase tracking-wider">
                        Role: {log.actorType}
                      </span>
                    </td>

                    {/* Metadata details */}
                    <td className="py-3.5 px-4 text-gray-600 max-w-md">
                      <div className="bg-gray-50 rounded-xl p-2 font-mono text-[11px] text-charcoal-700 border border-gray-100 truncate">
                        {log.metadata ? JSON.stringify(log.metadata) : 'None'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    No audit records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="p-4 bg-gray-50/70 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Page {currentPage} of {totalPages} ({totalRecords} total entries)
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

export default AdminAuditLogs;
