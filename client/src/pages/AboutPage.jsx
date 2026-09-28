import React from 'react';
import { ShieldCheck, Heart, Eye, Target, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const values = [
    {
      title: 'Verified Organizations',
      desc: '100% of charity trusts registered on Helping Hands undergo rigorous registration & government audit checks.',
      icon: ShieldCheck
    },
    {
      title: 'Transparent Funding Progress',
      desc: 'Real-time calculation of target vs. raised amounts so donors know exactly how close a cause is to fulfillment.',
      icon: Eye
    },
    {
      title: 'Specific Charitable Needs',
      desc: 'Instead of generic donations, fund exact tangible needs like school supplies for 200 children or rural clinics.',
      icon: Target
    },
    {
      title: 'Easy & Secure Experience',
      desc: 'Simplified checkout with zero platform fees, anonymous option, and instant tax-exemption receipt generation.',
      icon: Heart
    },
    {
      title: 'Impact Updates & Accountability',
      desc: 'Charity trusts regularly post ground photos, receipts, and progress updates for completed milestones.',
      icon: Sparkles
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
          <Heart className="w-4 h-4 text-brand-600 fill-brand-200" />
          About Helping Hands
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-charcoal-950 tracking-tight leading-tight">
          Small Help. <span className="text-brand-600">Big Change.</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
          Helping Hands is a non-profit discovery and donation platform built to restore trust, transparency, and personal connection to charitable giving.
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Our Mission */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-charcoal-900">Our Mission</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            "To connect people who want to help with verified organizations that need support."
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            We bridge the gap between compassionate individual donors and grassroots NGOs working tirelessly across India's remote villages and urban centers.
          </p>
        </div>

        {/* Our Vision */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-charcoal-900">Our Vision</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            "A world where every genuine charitable need can find the people willing to help."
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            We envision a transparent ecosystem where no child drops out of school for lack of books, no patient suffers without medicine, and no elder is left abandoned.
          </p>
        </div>

      </div>

      {/* Why Helping Hands? */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-charcoal-900">Why Helping Hands?</h2>
          <p className="text-sm text-gray-600">Built on five core principles of trust and donor transparency.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-charcoal-900 text-base">{v.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-brand-900 via-charcoal-900 to-brand-950 rounded-3xl p-10 text-white text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Support a Meaningful Cause?</h2>
        <div className="flex justify-center gap-4">
          <Link
            to="/explore"
            className="px-8 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-emerald transition-smooth flex items-center gap-2"
          >
            Explore Causes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;
