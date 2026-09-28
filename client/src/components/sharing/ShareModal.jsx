import React, { useState } from 'react';
import {
  Share2,
  X,
  Copy,
  Check,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Send,
  ExternalLink
} from 'lucide-react';
import { shareCampaign } from '../../services/api';

const ShareModal = ({ isOpen, onClose, campaign, onShareSuccess }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !campaign) return null;

  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/campaigns/${campaign._id}`
    : `https://helpinghands.org/campaigns/${campaign._id}`;

  const shareText = `Support "${campaign.title}" on Helping Hands. Every small contribution creates a big change:`;

  const trackShare = async () => {
    try {
      const res = await shareCampaign(campaign._id);
      if (res.success && onShareSuccess) {
        onShareSuccess(res.shareCount);
      }
    } catch (e) {
      console.error('Failed to log share event:', e);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      trackShare();
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareChannels = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-black hover:bg-gray-900 text-white',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800 text-white',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`
    }
  ];

  const handleChannelClick = (url) => {
    trackShare();
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-brand-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-emerald">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-charcoal-900 leading-tight">
                Amplify This Cause
              </h3>
              <p className="text-xs text-charcoal-500">
                Sharing expands the donor circle by 4x
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

        {/* Campaign Preview Mini Card */}
        <div className="p-6 pb-4">
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3 mb-6">
            <img
              src={campaign.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&q=80'}
              alt={campaign.title}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
                {campaign.category}
              </span>
              <h4 className="text-xs font-bold text-charcoal-900 truncate">
                {campaign.title}
              </h4>
              <p className="text-[11px] text-charcoal-500 mt-0.5">
                Organized by {campaign.trust?.name || 'Verified Trust'}
              </p>
            </div>
          </div>

          {/* Social Icons Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {shareChannels.map((ch) => {
              const Icon = ch.icon;
              return (
                <button
                  key={ch.name}
                  onClick={() => handleChannelClick(ch.url)}
                  className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-smooth shadow-sm hover:scale-[1.02] ${ch.color}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{ch.name}</span>
                </button>
              );
            })}
          </div>

          {/* Copy Link Section */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
              Or Copy Direct Link
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-200">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full bg-transparent px-3 py-1.5 text-xs text-charcoal-700 font-mono focus:outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-smooth flex items-center gap-1.5 shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-brand-600 hover:bg-brand-500 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 text-center">
          <p className="text-[11px] text-charcoal-500">
            Current Shares: <span className="font-bold text-brand-600 font-mono">{campaign.shareCount || 0}</span> times
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
