import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  Receipt,
  Download,
  ArrowRight,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { getCampaignById, createDonation } from '../services/api';
import { formatCurrency, calculatePercentage, formatDate } from '../utils/formatters';
import { DetailSkeleton } from '../components/Skeletons';
import DonationCancelMessage from '../components/donation/DonationCancelMessage';

const DonatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Form State
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  // Receipt Modal State
  const [receiptData, setReceiptData] = useState(null);

  const presetAmounts = [100, 250, 500, 1000, 2500];

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const res = await getCampaignById(id);
        setCampaign(res.data);
      } catch (err) {
        setError(err.message || 'Campaign not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id]);

  const getFinalAmount = () => {
    if (selectedAmount === 'custom') {
      return Number(customAmount) || 0;
    }
    return Number(selectedAmount) || 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalAmount = getFinalAmount();

    if (finalAmount <= 0) {
      alert('Please select or enter a donation amount greater than 0');
      return;
    }
    if (!donorName.trim() || !donorEmail.trim()) {
      alert('Please enter your name and email address');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await createDonation({
        campaignId: campaign._id,
        donorName: donorName.trim(),
        donorEmail: donorEmail.trim(),
        donorPhone: donorPhone.trim(),
        amount: finalAmount,
        anonymous
      });

      if (res.success && res.data) {
        setReceiptData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to process donation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DetailSkeleton />;

  if (!campaign) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 p-8 bg-white rounded-2xl border border-gray-100 shadow-soft">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-charcoal-900">Campaign Not Found</h2>
        <Link to="/explore" className="inline-block px-6 py-2.5 rounded-full bg-brand-500 text-white font-bold text-xs">
          Explore Causes
        </Link>
      </div>
    );
  }

  const { title, image, targetAmount, raisedAmount, trust } = campaign;
  const percentage = calculatePercentage(raisedAmount, targetAmount);
  const finalAmount = getFinalAmount();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
          <Lock className="w-3.5 h-3.5 text-brand-600" />
          Secure Direct Mock Donation
        </div>
        <h1 className="text-3xl font-extrabold text-charcoal-950">
          Support This Cause
        </h1>
      </div>

      {/* Main Donation Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Campaign Summary Card */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft space-y-4">
          <img
            src={image}
            alt={title}
            className="w-full aspect-[16/10] rounded-2xl object-cover"
          />

          <div>
            <div className="flex items-center gap-1 text-xs text-brand-600 font-bold mb-1">
              <span>{trust?.name}</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <h2 className="font-extrabold text-charcoal-900 text-base leading-snug line-clamp-2">
              {title}
            </h2>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
            <div className="flex justify-between font-bold">
              <span className="text-charcoal-900">{formatCurrency(raisedAmount)} raised</span>
              <span className="text-brand-600">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-500 h-full rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="text-gray-500 text-right">Target: {formatCurrency(targetAmount)}</div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft space-y-6">
          
          {/* Preset Amount Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold text-charcoal-900 uppercase tracking-wider">
              Select Donation Amount (INR ₹)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {presetAmounts.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`py-3 px-3 rounded-2xl font-extrabold text-sm border transition-smooth ${
                    selectedAmount === amt
                      ? 'bg-brand-500 text-white border-brand-500 shadow-emerald'
                      : 'bg-gray-50 text-charcoal-800 border-gray-200 hover:border-brand-300'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelectedAmount('custom')}
                className={`py-3 px-3 rounded-2xl font-extrabold text-xs border transition-smooth ${
                  selectedAmount === 'custom'
                    ? 'bg-brand-500 text-white border-brand-500 shadow-emerald'
                    : 'bg-gray-50 text-charcoal-800 border-gray-200 hover:border-brand-300'
                }`}
              >
                Custom
              </button>
            </div>

            {selectedAmount === 'custom' && (
              <div className="pt-2">
                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter custom amount in ₹ (e.g. 5000)..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            )}
          </div>

          {/* Donor Information */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="block text-xs font-extrabold text-charcoal-900 uppercase tracking-wider">
              Donor Information
            </label>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="e.g. ananya@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 border-gray-300"
                />
                <label htmlFor="anonymousCheck" className="text-xs text-gray-700 font-medium cursor-pointer">
                  Make my donation anonymous on public leaderboards
                </label>
              </div>
            </div>
          </div>

          {/* Donation Financial Summary */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Donation Amount</span>
              <span className="font-bold text-charcoal-900">{formatCurrency(finalAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Platform Fee</span>
              <span className="font-bold text-emerald-600">₹0 (100% Free)</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-charcoal-950 pt-2 border-t border-gray-200">
              <span>Total Contribution</span>
              <span className="text-brand-600 text-base">{formatCurrency(finalAmount)}</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-base shadow-emerald hover:shadow-lg transition-smooth flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Heart className="w-5 h-5 fill-white" />
            {submitting ? 'Processing Donation...' : `Proceed to Donate ${formatCurrency(finalAmount)}`}
          </button>

          {/* Empathetic Cancel Button */}
          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 hover:bg-gray-100 transition-smooth"
          >
            Cancel and Return
          </button>

        </form>
      </div>

      {/* Empathetic Donation Cancel Message Modal */}
      {showCancelModal && (
        <DonationCancelMessage
          category={campaign?.category}
          campaignId={campaign?._id}
          onRetry={() => setShowCancelModal(false)}
          onClose={() => setShowCancelModal(false)}
        />
      )}

      {/* CONFIRMATION / RECEIPT MODAL */}
      {receiptData && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <h2 className="text-2xl font-extrabold text-charcoal-950">
                Thank You for Your Helping Hand! ❤️
              </h2>
              <p className="text-xs text-gray-600">
                You donated <strong className="text-brand-600">{formatCurrency(receiptData.amount)}</strong> to help{' '}
                <span className="font-semibold text-charcoal-900">{campaign.title}</span>.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 font-bold text-gray-700">
                <span className="flex items-center gap-1">
                  <Receipt className="w-4 h-4 text-brand-600" />
                  Official Donation Receipt
                </span>
                <span className="text-brand-600">{receiptData.transactionId}</span>
              </div>

              <div className="space-y-1 text-gray-600">
                <div className="flex justify-between">
                  <span>Donor:</span>
                  <span className="font-semibold text-charcoal-900">{receiptData.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span>{receiptData.donorEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formatDate(receiptData.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-600">Payment Successful</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-500 italic">
                * Eligible for 80G Income Tax Deduction under Indian Tax Laws.
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/campaigns/${campaign._id}`)}
                className="w-full py-3 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-emerald hover:bg-brand-600 transition-smooth"
              >
                Back to Campaign
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-charcoal-800 font-bold text-xs flex items-center gap-1.5 transition-smooth"
              >
                <Download className="w-4 h-4" /> Print
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DonatePage;
