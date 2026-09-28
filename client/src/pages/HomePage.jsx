import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  BookOpen,
  Activity,
  Utensils,
  Baby,
  HeartHandshake,
  Sparkles,
  Flame,
  Zap,
  HelpCircle,
  ArrowRight,
  Target,
  Clock,
  Coins
} from 'lucide-react';
import { getCampaigns, getTrusts } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import { CampaignCardSkeleton } from '../components/Skeletons';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [nearlyFundedCampaigns, setNearlyFundedCampaigns] = useState([]);
  const [trusts, setTrusts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [campaignsRes, nearlyRes, trustsRes] = await Promise.all([
          getCampaigns({ limit: 6, sort: 'recent' }),
          getCampaigns({ nearlyFunded: 'true', limit: 3 }),
          getTrusts({ status: 'Verified' })
        ]);

        setFeaturedCampaigns(campaignsRes.data || []);
        setNearlyFundedCampaigns(nearlyRes.data || []);
        setTrusts(trustsRes.data || []);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    { name: 'Education', icon: BookOpen, count: '14 Active', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { name: 'Healthcare', icon: Activity, count: '18 Active', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { name: 'Food & Nutrition', icon: Utensils, count: '12 Active', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { name: 'Children', icon: Baby, count: '15 Active', color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { name: 'Elderly Care', icon: HeartHandshake, count: '8 Active', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    { name: 'Women Empowerment', icon: Sparkles, count: '10 Active', color: 'bg-pink-50 text-pink-600 border-pink-100' },
    { name: 'Disaster Relief', icon: Zap, count: '6 Active', color: 'bg-orange-50 text-orange-600 border-orange-100' },
    { name: 'Animal Welfare', icon: Flame, count: '9 Active', color: 'bg-teal-50 text-teal-600 border-teal-100' },
    { name: 'Community Development', icon: Target, count: '11 Active', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-white pt-12 pb-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-bold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                100% Verified Non-Profit Discovery Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal-950 tracking-tight leading-[1.15]">
                Together, We Can Make a <span className="text-brand-600 underline decoration-brand-300 decoration-wavy decoration-2">Difference</span>
              </h1>

              <p className="text-lg text-charcoal-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Discover verified charity needs, support meaningful causes, and see exactly how your contribution directly changes lives.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/explore"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-emerald hover:shadow-lg hover:-translate-y-0.5 transition-smooth flex items-center justify-center gap-2"
                >
                  Explore Causes
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/explore"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border-2 border-gray-200 hover:border-brand-500 text-charcoal-800 hover:text-brand-600 font-bold text-base shadow-soft hover:shadow-md transition-smooth flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5 text-brand-500 fill-brand-100" />
                  Donate Now
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-gray-200/60 flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-500" />
                  <span>Tax Exempted (80G)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-500" />
                  <span>Direct NGO Impact</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-500" />
                  <span>Transparent Tracking</span>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1000&q=80"
                    alt="Helping people community"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Floating Impact Pill */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce-slow">
                  <div className="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-emerald font-bold">
                    ₹
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">Total Raised</div>
                    <div className="text-lg font-extrabold text-charcoal-900">₹2.4 Cr+</div>
                  </div>
                </div>

                {/* Floating Donors Pill */}
                <div className="absolute -top-4 -right-4 bg-white px-4 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-500" />
                  <span className="text-xs font-bold text-charcoal-900">85K+ Generous Donors</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-charcoal-900 to-brand-950 rounded-3xl p-8 sm:p-12 shadow-xl text-white">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-brand-800/60">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-300">250+</div>
              <div className="text-sm font-semibold text-gray-300">Verified Trusts</div>
            </div>

            <div className="space-y-1 pt-4 sm:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-300">480+</div>
              <div className="text-sm font-semibold text-gray-300">Active Causes</div>
            </div>

            <div className="space-y-1 pt-4 sm:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-300">₹2.4 Cr+</div>
              <div className="text-sm font-semibold text-gray-300">Total Donated</div>
            </div>

            <div className="space-y-1 pt-4 sm:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-300">85K+</div>
              <div className="text-sm font-semibold text-gray-300">People Helped</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED / TRENDING CAMPAIGNS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-brand-600 text-xs font-extrabold uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Urgently Needed
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              Causes That Need Your Help
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            View All Causes ({featuredCampaigns.length > 0 ? '480+' : '0'})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CampaignCardSkeleton />
            <CampaignCardSkeleton />
            <CampaignCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCampaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        )}
      </section>

      {/* NEARLY FUNDED SECTION ("ALMOST THERE") */}
      {nearlyFundedCampaigns.length > 0 && (
        <section className="bg-brand-50/60 py-16 border-y border-brand-100/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-amber-600 text-xs font-extrabold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> Finish The Goal
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
                  Almost There
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Campaigns between 75% and 99% funded. Your small boost can help complete these causes today!
                </p>
              </div>
              <Link
                to="/explore?sort=nearly_funded"
                className="inline-flex items-center gap-1 text-sm font-bold text-amber-700 hover:text-amber-800 transition-colors"
              >
                Explore Nearly Funded
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearlyFundedCampaigns.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-brand-600 text-xs font-extrabold uppercase tracking-widest">
            Diverse Impact Areas
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
            Explore Causes by Category
          </h2>
          <p className="text-sm text-gray-600">
            Choose a sector close to your heart and support verified non-profit initiatives.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => navigate(`/explore?category=${encodeURIComponent(cat.name)}`)}
                className="p-5 rounded-2xl bg-white border border-gray-100 hover:border-brand-300 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-smooth cursor-pointer flex items-center gap-4 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal-900 text-sm group-hover:text-brand-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-gray-500 font-medium">{cat.count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* VERIFIED TRUSTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-brand-600 text-xs font-extrabold uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Vetted Organizations
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              Trusted Organizations
            </h2>
          </div>
          <Link
            to="/trusts"
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            View All Trusts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trusts.slice(0, 3).map((trust) => (
            <div
              key={trust._id}
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-soft hover:shadow-soft-lg transition-smooth flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <img
                    src={trust.logo}
                    alt={trust.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-sm"
                  />
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    Verified
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{trust.name}</h3>
                  <p className="text-xs text-gray-500 font-medium">{trust.location}</p>
                </div>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {trust.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                  {trust.activeCampaignsCount || 2} Active Causes
                </span>
                <Link
                  to={`/trusts/${trust._id}`}
                  className="text-xs font-bold text-charcoal-700 hover:text-brand-600 transition-colors flex items-center gap-1"
                >
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-charcoal-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-brand-400 text-xs font-extrabold uppercase tracking-widest">
              Simple 4-Step Process
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How Helping Hands Works
            </h2>
            <p className="text-sm text-gray-400">
              Direct, transparent giving with zero unnecessary middleman friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-extrabold text-xl">
                1
              </div>
              <h3 className="font-bold text-lg text-white">Discover a Cause</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Browse verified campaigns published directly by audited charity trusts and NGOs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-extrabold text-xl">
                2
              </div>
              <h3 className="font-bold text-lg text-white">Choose a Need</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Review specific goal amounts, cost breakdowns, and how each rupee is utilized.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-extrabold text-xl">
                3
              </div>
              <h3 className="font-bold text-lg text-white">Make a Donation</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Donate safely with preset or custom amounts. Option to remain anonymous.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-extrabold text-xl">
                4
              </div>
              <h3 className="font-bold text-lg text-white">See the Impact</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Receive milestone updates, utilization reports, and see completed progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPARENCY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-soft space-y-8">
          <div className="max-w-3xl space-y-2">
            <div className="text-brand-600 text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Uncompromising Clarity
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              Know Where Your Help Goes
            </h2>
            <p className="text-sm text-gray-600">
              We believe in 100% financial transparency. Every campaign displays real-time target versus raised statistics and step-by-step impact milestones.
            </p>
          </div>

          {/* Sample Transparency Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div>
              <div className="text-xs text-gray-500 font-semibold mb-1">Campaign Goal</div>
              <div className="text-xl font-extrabold text-charcoal-900">₹5,00,000</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold mb-1">Raised</div>
              <div className="text-xl font-extrabold text-brand-600">₹3,75,000</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold mb-1">Remaining</div>
              <div className="text-xl font-extrabold text-amber-600">₹1,25,000</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold mb-1">Total Donors</div>
              <div className="text-xl font-extrabold text-charcoal-900">284</div>
            </div>
          </div>

          {/* Visual Timeline */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
              Campaign Lifecycle & Update Process
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 text-center space-y-1">
                <div className="text-xs font-bold text-brand-700">1. Need Published</div>
                <div className="text-[11px] text-gray-500">NGO submits verified cost breakdown</div>
              </div>
              <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 text-center space-y-1">
                <div className="text-xs font-bold text-brand-700">2. Donations Received</div>
                <div className="text-[11px] text-gray-500">Real-time progress bar updates</div>
              </div>
              <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 text-center space-y-1">
                <div className="text-xs font-bold text-brand-700">3. Goal Reached</div>
                <div className="text-[11px] text-gray-500">Funds disbursed to NGO account</div>
              </div>
              <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 text-center space-y-1">
                <div className="text-xs font-bold text-brand-700">4. Need Completed</div>
                <div className="text-[11px] text-gray-500">Ground distribution executed</div>
              </div>
              <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 text-center space-y-1">
                <div className="text-xs font-bold text-brand-700">5. Utilization Update</div>
                <div className="text-[11px] text-gray-500">Photos & receipts posted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-3xl p-10 sm:p-14 shadow-emerald text-white text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Your Helping Hand Can Change Someone's Tomorrow.
            </h2>
            <p className="text-brand-100 text-base">
              Join thousands of donors who are making verified, direct impact across India.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/explore"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-brand-700 font-bold text-base shadow-lg hover:bg-brand-50 transition-smooth"
            >
              Explore Causes
            </Link>
            <Link
              to="/explore"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-800/80 hover:bg-brand-900 text-white font-bold text-base border border-brand-500 transition-smooth"
            >
              Support a Cause
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
