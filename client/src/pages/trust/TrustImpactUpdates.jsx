import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Calendar,
  ExternalLink,
  PlusCircle,
  FileText
} from 'lucide-react';
import { getTrustCampaigns, uploadImpactUpdate } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const TrustImpactUpdates = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [whatAchieved, setWhatAchieved] = useState('');
  const [howUsed, setHowUsed] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getTrustCampaigns({ status: 'completed' });
      setCampaigns(res.data || []);
    } catch (e) {
      console.error('Failed to load completed campaigns:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !desc) {
      setErrorMsg('Please enter both Title and Description.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', desc);
      formData.append('whatWasAchieved', whatAchieved);
      formData.append('howFundsWereUsed', howUsed);
      formData.append('beneficiariesReached', beneficiaries || '0');

      for (let i = 0; i < files.length; i++) {
        formData.append('mediaFiles', files[i]);
      }

      await uploadImpactUpdate(selectedCamp._id, formData);
      setSelectedCamp(null);
      setTitle('');
      setDesc('');
      setWhatAchieved('');
      setHowUsed('');
      setBeneficiaries('');
      setFiles([]);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit impact report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
          Impact & Fund Utilization Updates
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Post-completion reporting to show donors exactly how their contributions were deployed on the ground.
        </p>
      </div>

      {/* COMPLETED CAUSES REQUIRING UPDATES */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">Loading completed causes...</div>
        ) : campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {campaigns.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full sm:w-20 h-36 sm:h-20 rounded-2xl object-cover shrink-0 border border-gray-200"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      {c.category} • Raised {formatCurrency(c.raisedAmount)}
                    </span>
                    <h3 className="font-extrabold text-charcoal-950 text-sm mt-0.5 line-clamp-2">{c.title}</h3>
                    <div className="mt-2">
                      {c.impactStatus === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Impact Verified ✓
                        </span>
                      ) : c.impactStatus === 'pending_review' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200">
                          <Clock className="w-3.5 h-3.5" /> Impact Update Under Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 text-white font-extrabold text-[11px] shadow-sm">
                          <AlertTriangle className="w-3.5 h-3.5" /> IMPORTANT — Impact Update Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <Link
                    to={`/campaigns/${c._id}`}
                    target="_blank"
                    className="text-xs font-bold text-gray-500 hover:text-emerald-700 flex items-center justify-center sm:justify-start gap-1 py-1 sm:py-0"
                  >
                    <span>View Public Cause</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={() => setSelectedCamp(c)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{c.impactStatus === 'approved' ? 'Add Another Milestone' : 'Upload Evidence'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-200/80 shadow-xs space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-extrabold text-sm text-charcoal-900">No completed causes awaiting impact reports</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              When one of your fundraising causes reaches 100% target and completes, it will appear here to submit transparent evidence for donors.
            </p>
          </div>
        )}
      </div>

      {/* UPLOAD MODAL */}
      {selectedCamp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
              <h3 className="text-sm sm:text-base font-extrabold text-charcoal-900 truncate pr-3">
                Submit Impact Evidence • {selectedCamp.title}
              </h3>
              <button
                onClick={() => setSelectedCamp(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl shrink-0"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="mx-4 sm:mx-6 mt-4 p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Report Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Free Eye Surgery Delivered to 50 Rural Elders"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Impact Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows="3"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Detail the milestone achievement and community outcome..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">What Was Achieved</label>
                  <input
                    type="text"
                    value={whatAchieved}
                    onChange={(e) => setWhatAchieved(e.target.value)}
                    placeholder="e.g. 50 surgeries, 100 medicine kits"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Beneficiaries Reached</label>
                  <input
                    type="number"
                    value={beneficiaries}
                    onChange={(e) => setBeneficiaries(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">How Funds Were Used</label>
                <input
                  type="text"
                  value={howUsed}
                  onChange={(e) => setHowUsed(e.target.value)}
                  placeholder="e.g. 70% Surgical lenses, 20% Hospital care, 10% Post-op food"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Upload Evidence (Field Photos, PDF Invoices/Receipts)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs cursor-pointer"
                />
              </div>

              <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedCamp(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit for Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TrustImpactUpdates;
