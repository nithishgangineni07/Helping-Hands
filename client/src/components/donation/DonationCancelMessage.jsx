import React from 'react';
import { HeartHandshake, ArrowLeft, RefreshCw, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const getCategoryCancelMessage = (category) => {
  switch (category?.toLowerCase()) {
    case 'education':
      return {
        title: 'Every Learner Matters',
        body: "Every book, pencil, and scholarship changes a future. If today isn't the right time, we hope you'll keep this student's dreams in your heart. You can always return whenever you are ready."
      };
    case 'healthcare':
      return {
        title: 'Warm Wishes for Good Health',
        body: 'Healing lives requires collective warmth. Thank you for considering this patient’s medical care. We completely understand, and we wish health and peace for you and your family.'
      };
    case 'hunger relief':
      return {
        title: 'Compassion Never Goes Unnoticed',
        body: 'A single meal saved is an evening of dignity for a struggling family. We appreciate you stopping by and caring about empty plates in our community.'
      };
    case 'animal welfare':
      return {
        title: 'Thank You for Caring for Voiceless Lives',
        body: 'Every injured animal deserves shelter and tenderness. Thank you for taking a moment to view this rescue cause today.'
      };
    case 'elderly care':
      return {
        title: 'Respect & Care for Elders',
        body: 'Offering comfort and hot meals to senior citizens means everything. Thank you for holding them in your thoughts.'
      };
    case 'disaster relief':
      return {
        title: 'Standing Together in Rebuilding',
        body: 'Rebuilding communities after tragedy takes patience and steady support. We are grateful for your time and solidarity.'
      };
    default:
      return {
        title: 'Giving Comes from the Heart',
        body: 'Giving is personal, and timing matters most. We completely understand and are sincerely grateful for your empathy and goodwill today.'
      };
  }
};

const DonationCancelMessage = ({ category, campaignId, onRetry, onClose }) => {
  const navigate = useNavigate();
  const message = getCategoryCancelMessage(category);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 p-8 text-center relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-100 rounded-full blur-2xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-brand-100 rounded-full blur-2xl opacity-60 pointer-events-none" />

        {/* Close icon */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-5 shadow-sm">
          <HeartHandshake className="w-8 h-8 text-amber-600" />
        </div>

        <h3 className="text-xl font-extrabold text-charcoal-900 tracking-tight mb-2">
          {message.title}
        </h3>

        <p className="text-xs text-charcoal-600 leading-relaxed mb-8">
          {message.body}
        </p>

        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-emerald transition-smooth flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Resume Contribution</span>
            </button>
          )}

          <button
            onClick={() => navigate(campaignId ? `/campaigns/${campaignId}` : '/explore')}
            className="w-full py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-charcoal-700 font-semibold text-xs transition-smooth flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Campaign</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationCancelMessage;
