import React, { useState, useEffect } from 'react';
import { Users, X, Shield, Heart, Clock, AlertCircle } from 'lucide-react';
import { getCampaignDonors } from '../../services/api';

const DonorListModal = ({ isOpen, onClose, campaignId, campaignTitle, totalDonorsCount }) => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (!isOpen || !campaignId) return;

    const fetchDonors = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getCampaignDonors(campaignId, { page, limit: 10 });
        if (res.success) {
          setDonors(res.data);
          setPagination(res.pagination);
        }
      } catch (err) {
        setError(err.message || 'Failed to load donors');
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [isOpen, campaignId, page]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-brand-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-emerald">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-charcoal-900 leading-tight">
                Generous Supporters
              </h3>
              <p className="text-xs text-charcoal-500 truncate max-w-xs">
                {campaignTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-charcoal-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total stats bar */}
        <div className="bg-brand-50/50 px-6 py-3 border-b border-brand-100/60 flex items-center justify-between text-xs">
          <span className="font-bold text-brand-800">
            {totalDonorsCount || pagination?.totalDonations || donors.length} Total Contributions
          </span>
          <span className="flex items-center gap-1 text-charcoal-600">
            <Shield className="w-3.5 h-3.5 text-brand-600" />
            Anonymous privacy protected
          </span>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-charcoal-500">
              <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-medium">Fetching verified contributions...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : donors.length === 0 ? (
            <div className="text-center py-12 text-charcoal-500">
              <Heart className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">Be the first to back this cause!</p>
              <p className="text-xs text-gray-400 mt-1">Every contribution directly funds critical milestones.</p>
            </div>
          ) : (
            donors.map((item) => {
              const isAnon = item.anonymous || item.displayName === 'Anonymous Supporter';
              const formattedDate = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'Recent';

              return (
                <div
                  key={item._id}
                  className="p-3.5 rounded-2xl bg-gray-50/80 hover:bg-brand-50/40 border border-gray-100 hover:border-brand-100 transition-smooth flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold ${
                        isAnon
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-brand-100 text-brand-700'
                      }`}
                    >
                      {isAnon ? <Shield className="w-4 h-4" /> : item.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-charcoal-900">
                          {item.displayName}
                        </span>
                        {isAnon && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-200/70 text-gray-600">
                            Private
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-charcoal-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-brand-600">
                      ₹{item.amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination controls */}
        {pagination && pagination.pages > 1 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-3 py-1.5 rounded-lg border border-gray-200 font-semibold text-charcoal-700 hover:bg-white disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-charcoal-500 font-medium">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages || loading}
              className="px-3 py-1.5 rounded-lg border border-gray-200 font-semibold text-charcoal-700 hover:bg-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorListModal;
