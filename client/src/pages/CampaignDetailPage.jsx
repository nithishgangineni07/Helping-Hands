import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Calendar,
  Heart,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Info,
  Layers,
  MapPin,
  FileText,
  ExternalLink,
  Download
} from 'lucide-react';
import { getCampaignById } from '../services/api';
import { formatCurrency, calculatePercentage, daysRemaining, formatDate } from '../utils/formatters';
import { DetailSkeleton } from '../components/Skeletons';
import DonorListModal from '../components/campaign/DonorListModal';
import ShareModal from '../components/sharing/ShareModal';

const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [selectedImage, setSelectedImage] = useState(null);

  // Modals state
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const res = await getCampaignById(id);
        setCampaign(res.data);
        setShareCount(res.data?.shareCount || 0);
        if (res.data?.image) {
          setSelectedImage(res.data.image);
        }
      } catch (err) {
        setError(err.message || 'Campaign not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (loading) return <DetailSkeleton />;

  if (error || !campaign) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 p-8 bg-white rounded-2xl border border-gray-100 shadow-soft">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-charcoal-900">Campaign Not Found</h2>
        <p className="text-xs text-gray-500">{error || 'The requested cause could not be loaded.'}</p>
        <Link
          to="/explore"
          className="inline-block px-6 py-2.5 rounded-full bg-brand-500 text-white font-bold text-xs shadow-emerald"
        >
          Back to Explore Causes
        </Link>
      </div>
    );
  }

  const {
    _id,
    title,
    category,
    description,
    image,
    galleryImages,
    targetAmount,
    raisedAmount,
    donorCount,
    deadline,
    trust,
    whyNeeded,
    detailedNeed,
    expectedFundsUse,
    compliance,
    howDonationHelps,
    updates,
    status,
    updatedAt
  } = campaign;

  const percentage = calculatePercentage(raisedAmount, targetAmount);
  const daysLeft = daysRemaining(deadline);
  const remainingAmount = Math.max(0, targetAmount - raisedAmount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* TOP SECTION: LEFT MEDIA + RIGHT DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Main Image & Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-soft">
            <img
              src={selectedImage || image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-white/95 backdrop-blur-md text-charcoal-900 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-sm">
                {category}
              </span>
              {status === 'completed' && (
                <span className="bg-emerald-600 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-sm">
                  Goal Successfully Met!
                </span>
              )}
            </div>

            <button
              onClick={() => setShowShareModal(true)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur hover:bg-white text-charcoal-800 hover:text-brand-600 flex items-center justify-center shadow-md hover:scale-110 transition-smooth"
              title="Share this campaign"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Thumbnail Gallery */}
          {galleryImages && galleryImages.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[image, ...galleryImages.filter((img) => img !== image)].map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-smooth ${
                    selectedImage === imgUrl ? 'border-brand-500 ring-2 ring-brand-200' : 'border-gray-200 hover:border-brand-300'
                  }`}
                >
                  <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Campaign Summary & Progress */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft space-y-6">
          
          {/* Trust Badge */}
          {trust && (
            <Link
              to={`/trusts/${trust._id}`}
              className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-300 transition-smooth group"
            >
              <img
                src={trust.logo}
                alt={trust.name}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-charcoal-900 group-hover:text-brand-600 transition-colors truncate">
                    {trust.name}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                </div>
                <span className="text-[11px] text-gray-500 block truncate">{trust.location}</span>
              </div>
            </Link>
          )}

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-950 leading-tight">
            {title}
          </h1>

          {/* Progress Box */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-2xl font-extrabold text-charcoal-950">
                  {formatCurrency(raisedAmount)}
                </span>
                <span className="text-xs text-gray-500 font-medium ml-1">
                  raised of {formatCurrency(targetAmount)}
                </span>
              </div>
              <span className="text-lg font-black text-brand-600">
                {percentage}%
              </span>
            </div>

            {/* Large Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  percentage >= 100 ? 'bg-emerald-600' : 'bg-brand-500'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            {/* Key Metrics with Clickable Donors & Shares */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <button
                onClick={() => setShowDonorModal(true)}
                className="p-3 rounded-xl bg-brand-50/60 border border-brand-100 hover:bg-brand-100/60 transition-smooth group text-left sm:text-center"
                title="Click to view donors"
              >
                <div className="text-xs text-brand-700 font-semibold flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Donors</span>
                </div>
                <div className="text-base font-extrabold text-brand-900 group-hover:scale-105 transition-transform underline decoration-dotted">
                  {donorCount || 0}
                </div>
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 hover:bg-blue-100/60 transition-smooth group text-left sm:text-center"
                title="Click to share cause"
              >
                <div className="text-xs text-blue-700 font-semibold flex items-center justify-center gap-1">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Shares</span>
                </div>
                <div className="text-base font-extrabold text-blue-900 group-hover:scale-105 transition-transform">
                  {shareCount}
                </div>
              </button>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Days Left</span>
                </div>
                <div className="text-base font-extrabold text-charcoal-900">
                  {daysLeft > 0 ? daysLeft : 'Met'}
                </div>
              </div>
            </div>
          </div>

          {/* Primary Donate CTA */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate(`/donate/${campaign._id}`)}
              className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-base shadow-emerald hover:shadow-lg transition-smooth flex items-center justify-center gap-2 group"
            >
              <Heart className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              Donate to This Cause
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="w-full py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 text-charcoal-800 font-bold text-xs border border-gray-200 transition-smooth flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 text-blue-600" />
              <span>Share & Spread the Word ({shareCount})</span>
            </button>
          </div>

        </div>
      </div>

      {/* LOWER SECTION: TABBED DETAILS */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-soft space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-100 overflow-x-auto pb-2">
          {[
            { id: 'about', label: 'About This Cause' },
            { id: 'why', label: 'Why This Is Needed' },
            { id: 'impact', label: 'How Your Donation Helps' },
            { id: 'updates', label: `Impact & Milestone Updates (${updates?.length || 0})` },
            { id: 'transparency', label: 'Transparency & Compliance' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-smooth ${
                activeTab === tab.id
                  ? 'bg-brand-50 text-brand-700 border border-brand-200'
                  : 'text-gray-500 hover:text-charcoal-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT: ABOUT */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-charcoal-900">About This Cause</h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {description}
            </p>
            {detailedNeed && (
              <div className="mt-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-charcoal-700 leading-relaxed">
                <h4 className="font-bold text-charcoal-900 mb-1">Detailed Operational Need:</h4>
                <p>{detailedNeed}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: WHY NEEDED */}
        {activeTab === 'why' && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-charcoal-900">Why This Is Urgently Needed</h2>
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-100 text-amber-900 text-sm leading-relaxed">
              {whyNeeded || 'Direct grassroots intervention is critical to deliver aid promptly to affected families.'}
            </div>
            {expectedFundsUse && (
              <div className="p-5 rounded-2xl bg-brand-50/40 border border-brand-100 text-xs text-charcoal-800">
                <h4 className="font-bold text-brand-900 mb-1">Target Allocation Plan:</h4>
                <p>{expectedFundsUse}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: HOW DONATION HELPS */}
        {activeTab === 'impact' && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-charcoal-900">How Your Donation Helps</h2>
            {howDonationHelps && howDonationHelps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {howDonationHelps.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-brand-50/50 border border-brand-100 space-y-2 hover:border-brand-300 transition-smooth"
                  >
                    <div className="text-xl font-extrabold text-brand-700">
                      {formatCurrency(item.amount)}
                    </div>
                    <p className="text-xs text-charcoal-800 font-medium leading-relaxed">
                      {item.impact}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">Every rupee contributed goes directly toward achieving the campaign target.</p>
            )}
          </div>
        )}

        {/* TAB CONTENT: UPDATES / WHERE YOUR SUPPORT WENT */}
        {activeTab === 'updates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-charcoal-900">Where Your Support Went</h2>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Verified photographic evidence and expenditure receipts from the ground.
                </p>
              </div>
            </div>

            {updates && updates.length > 0 ? (
              <div className="space-y-6">
                {updates.map((up) => (
                  <div key={up._id} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                      <span className="font-extrabold text-base text-brand-700">{up.title}</span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(up.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-charcoal-800 leading-relaxed whitespace-pre-line">
                      {up.description}
                    </p>

                    {/* Photos attached to update */}
                    {up.photos && up.photos.length > 0 && (
                      <div className="pt-2">
                        <h5 className="text-[11px] font-bold text-charcoal-700 mb-2 uppercase tracking-wider">
                          Field Photographs
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {up.photos.map((photoUrl, pIdx) => (
                            <div key={pIdx} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200">
                              <img src={photoUrl} alt="Update milestone" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Verification documents attached to update */}
                    {up.documents && up.documents.length > 0 && (
                      <div className="pt-2">
                        <h5 className="text-[11px] font-bold text-charcoal-700 mb-2 uppercase tracking-wider">
                          Proof of Delivery & Financial Receipts
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {up.documents.map((doc, dIdx) => (
                            <a
                              key={dIdx}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-brand-400 text-xs font-semibold text-charcoal-700 transition-smooth shadow-sm"
                            >
                              <FileText className="w-3.5 h-3.5 text-brand-600" />
                              <span>{doc.name || 'Receipt Document'}</span>
                              <ExternalLink className="w-3 h-3 text-gray-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-charcoal-700">Initial Milestone In Progress</p>
                <p className="text-xs text-charcoal-400 mt-1">
                  Once milestone disbursements begin, the trust will upload live photo updates and PDF receipts here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: TRANSPARENCY */}
        {activeTab === 'transparency' && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-charcoal-900">Transparency & Regulatory Compliance</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div>
                <div className="text-xs text-gray-500 font-semibold">Target Goal</div>
                <div className="text-lg font-extrabold text-charcoal-900">{formatCurrency(targetAmount)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Total Raised</div>
                <div className="text-lg font-extrabold text-brand-600">{formatCurrency(raisedAmount)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Remaining Need</div>
                <div className="text-lg font-extrabold text-amber-600">{formatCurrency(remainingAmount)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Last Updated</div>
                <div className="text-sm font-extrabold text-charcoal-900">{formatDate(updatedAt)}</div>
              </div>
            </div>

            {/* Compliance badges */}
            <div className="p-6 rounded-2xl bg-brand-50/50 border border-brand-100 space-y-3">
              <h4 className="font-bold text-sm text-brand-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                Verified Indian NGO Compliance
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-charcoal-700">
                <div>• Registration: <span className="font-mono font-semibold">{trust?.registrationNumber}</span></div>
                <div>• Tax Status: <span className="font-semibold">{compliance?.eightyGDetails || '80G Registered'}</span></div>
                <div>• 12A Certification: <span className="font-semibold">{compliance?.twelveADetails || 'Certified Income Tax Act'}</span></div>
                <div>• Banking: <span className="font-semibold">Dedicated Escrow Beneficiary Account</span></div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* TRUST SUMMARY CARD AT BOTTOM */}
      {trust && (
        <div className="bg-gradient-to-r from-gray-900 to-charcoal-950 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={trust.logo}
              alt={trust.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">{trust.name}</h3>
                <ShieldCheck className="w-5 h-5 text-brand-400" />
              </div>
              <p className="text-xs text-gray-300 max-w-xl">{trust.description}</p>
            </div>
          </div>

          <Link
            to={`/trusts/${trust._id}`}
            className="px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-emerald transition-smooth whitespace-nowrap"
          >
            View Trust Profile
          </Link>
        </div>
      )}

      {/* Donor Modal */}
      <DonorListModal
        isOpen={showDonorModal}
        onClose={() => setShowDonorModal(false)}
        campaignId={_id}
        campaignTitle={title}
        totalDonorsCount={donorCount}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        campaign={campaign}
        onShareSuccess={(newCount) => setShareCount(newCount)}
      />

    </div>
  );
};

export default CampaignDetailPage;
