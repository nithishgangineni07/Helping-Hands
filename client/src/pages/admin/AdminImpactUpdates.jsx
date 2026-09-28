import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Building2,
  X
} from 'lucide-react';
import {
  getAdminImpactUpdates,
  approveImpactUpdate,
  rejectImpactUpdate
} from '../../services/api';
import { formatDate } from '../../utils/formatters';

const AdminImpactUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('');

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const res = await getAdminImpactUpdates();
      setUpdates(res.data || []);
    } catch (err) {
      console.error('Error loading impact updates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleApprove = async (id) => {
    try {
      setProcessing(true);
      await approveImpactUpdate(id);
      fetchUpdates();
      if (selectedUpdate && selectedUpdate._id === id) {
        setSelectedUpdate((prev) => ({ ...prev, status: 'approved' }));
      }
    } catch (err) {
      alert('Failed to approve update: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModal) return;
    try {
      setProcessing(true);
      await rejectImpactUpdate(rejectModal._id, { notes: rejectNotes });
      setRejectModal(null);
      setRejectNotes('');
      fetchUpdates();
      if (selectedUpdate && selectedUpdate._id === rejectModal._id) {
        setSelectedUpdate((prev) => ({ ...prev, status: 'rejected' }));
      }
    } catch (err) {
      alert('Failed to reject update: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
          Impact & Utilization Review
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review evidence submitted by trusts explaining fund utilization, field deliverables, and photographic verification.
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Update Title</th>
                <th className="py-3.5 px-4">Cause</th>
                <th className="py-3.5 px-4">Trust</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4">Evidence</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-charcoal-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading impact updates...</span>
                    </div>
                  </td>
                </tr>
              ) : updates.length > 0 ? (
                updates.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Title */}
                    <td className="py-3.5 px-4 font-bold text-charcoal-900 max-w-xs truncate">
                      <button
                        onClick={() => setSelectedUpdate(u)}
                        className="hover:text-emerald-700 text-left font-extrabold"
                      >
                        {u.title}
                      </button>
                    </td>

                    {/* Cause */}
                    <td className="py-3.5 px-4 text-gray-600 truncate max-w-[150px]">
                      {u.campaign?.title || 'Cause'}
                    </td>

                    {/* Trust */}
                    <td className="py-3.5 px-4 text-gray-600 truncate max-w-[130px]">
                      {u.trust?.name || 'Trust Partner'}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-gray-400">
                      {formatDate(u.createdAt)}
                    </td>

                    {/* Evidence count */}
                    <td className="py-3.5 px-4 text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-0.5">
                          <ImageIcon className="w-3 h-3 text-emerald-600" />
                          {u.photos?.length || 0}
                        </span>
                        <span className="inline-flex items-center gap-0.5">
                          <FileText className="w-3 h-3 text-purple-600" />
                          {u.documents?.length || 0}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {u.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : u.status === 'pending_review' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[11px]">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[11px]">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUpdate(u)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                          title="View Full Report"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {u.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(u._id)}
                            disabled={processing}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors"
                          >
                            Approve
                          </button>
                        )}

                        {u.status !== 'rejected' && (
                          <button
                            onClick={() => setRejectModal(u)}
                            disabled={processing}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] transition-colors"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    No impact updates submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL / EVIDENCE PREVIEW */}
      {selectedUpdate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">
                  Cause: {selectedUpdate.campaign?.title}
                </span>
                <h3 className="text-lg font-black text-charcoal-950 mt-0.5">
                  {selectedUpdate.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUpdate(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              <div>
                <h4 className="font-bold text-gray-400 uppercase tracking-wider mb-1">Executive Summary</h4>
                <p className="text-charcoal-800 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  {selectedUpdate.description}
                </p>
              </div>

              {selectedUpdate.whatWasAchieved && (
                <div>
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider mb-1">What Was Achieved</h4>
                  <p className="text-charcoal-800 leading-relaxed bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
                    {selectedUpdate.whatWasAchieved}
                  </p>
                </div>
              )}

              {selectedUpdate.howFundsWereUsed && (
                <div>
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider mb-1">How Funds Were Used</h4>
                  <p className="text-charcoal-800 leading-relaxed bg-blue-50/40 p-4 rounded-2xl border border-blue-100">
                    {selectedUpdate.howFundsWereUsed}
                  </p>
                </div>
              )}

              {/* Photos */}
              {selectedUpdate.photos && selectedUpdate.photos.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider mb-2">Field Photographs</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedUpdate.photos.map((p, idx) => (
                      <a
                        key={idx}
                        href={p}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-video rounded-xl overflow-hidden border border-gray-200 group"
                      >
                        <img src={p} alt="Milestone" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF Documents */}
              {selectedUpdate.documents && selectedUpdate.documents.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider mb-2">Invoices & Reports</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUpdate.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 font-bold text-charcoal-700 hover:text-emerald-700 shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        <span>{doc.name || 'Document'}</span>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedUpdate(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              {selectedUpdate.status !== 'approved' && (
                <button
                  onClick={() => handleApprove(selectedUpdate._id)}
                  disabled={processing}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-colors"
                >
                  Approve for Public Viewing
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-extrabold text-charcoal-900">
              Reject Impact Update?
            </h3>
            <p className="text-xs text-charcoal-600">
              Please specify what required evidence or clarification the trust must provide before this update can be published.
            </p>

            <textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="e.g. Missing supplier invoices or field beneficiary photos..."
              rows="3"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            ></textarea>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={processing}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition-colors"
              >
                {processing ? 'Processing...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminImpactUpdates;
