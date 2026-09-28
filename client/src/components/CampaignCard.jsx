import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Calendar, Heart, Share2 } from 'lucide-react';
import { formatCurrency, calculatePercentage, daysRemaining } from '../utils/formatters';
import DonorListModal from './campaign/DonorListModal';
import ShareModal from './sharing/ShareModal';

const CampaignCard = ({ campaign }) => {
  if (!campaign) return null;

  const {
    _id,
    title,
    category,
    description,
    image,
    targetAmount,
    raisedAmount,
    donorCount,
    shareCount: initialShareCount = 0,
    deadline,
    trust,
    status
  } = campaign;

  const [showDonorModal, setShowDonorModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCount, setShareCount] = useState(initialShareCount);

  const percentage = calculatePercentage(raisedAmount, targetAmount);
  const daysLeft = daysRemaining(deadline);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-smooth flex flex-col overflow-hidden group">
        
        {/* Cover Image & Category Pill */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={image || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-white/95 backdrop-blur-md text-charcoal-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {category}
            </span>
            {status === 'completed' && (
              <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Goal Reached!
              </span>
            )}
          </div>

          {/* Share icon quick button on card image */}
          <button
            onClick={() => setShowShareModal(true)}
            aria-label="Share campaign"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur hover:bg-white text-charcoal-700 hover:text-brand-600 flex items-center justify-center shadow-sm hover:scale-110 transition-smooth"
            title="Share campaign"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Trust Name */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold mb-2">
              <span className="text-charcoal-700 truncate">{trust?.name || 'Verified Trust'}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-brand-500 fill-brand-50 shrink-0" title="Verified NGO" />
            </div>

            {/* Title */}
            <Link to={`/campaigns/${_id}`}>
              <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 hover:text-brand-600 transition-colors mb-2">
                {title}
              </h3>
            </Link>

            {/* Short Description */}
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-4">
              {description}
            </p>
          </div>

          {/* Progress Section */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            
            {/* Numbers Header */}
            <div className="flex justify-between items-baseline text-xs">
              <div>
                <span className="font-extrabold text-charcoal-900 text-base">
                  {formatCurrency(raisedAmount)}
                </span>
                <span className="text-gray-500 text-xs font-medium ml-1">
                  raised of {formatCurrency(targetAmount)}
                </span>
              </div>
              <span className="font-extrabold text-brand-600 text-sm">
                {percentage}%
              </span>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  percentage >= 100 ? 'bg-emerald-600' : 'bg-brand-500'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            {/* Meta Info: Donors & Shares & Days Remaining */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <button
                onClick={() => setShowDonorModal(true)}
                className="flex items-center gap-1 hover:text-brand-600 group/donor transition-colors cursor-pointer"
                title="Click to view donors list"
              >
                <Users className="w-3.5 h-3.5 text-brand-600" />
                <span className="font-bold text-charcoal-900 group-hover/donor:text-brand-600 underline decoration-dotted">
                  {donorCount || 0} donors
                </span>
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-1 text-charcoal-600 hover:text-blue-600 transition-colors"
                title="Share this cause"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-semibold">{shareCount} shares</span>
              </button>

              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{daysLeft > 0 ? `${daysLeft}d left` : 'Goal Met'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to={`/campaigns/${_id}`}
                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-charcoal-700 hover:bg-gray-50 text-xs font-bold text-center transition-smooth flex items-center justify-center gap-1"
              >
                View Details
              </Link>

              <Link
                to={`/donate/${_id}`}
                className="w-full py-2.5 px-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold text-center shadow-emerald transition-smooth flex items-center justify-center gap-1.5 group/btn"
              >
                <Heart className="w-3.5 h-3.5 fill-white group-hover/btn:scale-110 transition-transform" />
                Donate
              </Link>
            </div>

          </div>
        </div>
      </div>

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
    </>
  );
};

export default CampaignCard;
