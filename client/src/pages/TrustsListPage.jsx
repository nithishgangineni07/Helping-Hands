import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Search, ArrowRight, Award, FileText } from 'lucide-react';
import { getTrusts } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const TrustsListPage = () => {
  const [trusts, setTrusts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTrusts = async () => {
      try {
        setLoading(true);
        const res = await getTrusts({ search: searchTerm });
        setTrusts(res.data || []);
      } catch (err) {
        console.error('Error fetching trusts list:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchAllTrusts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-950 tracking-tight">
          Verified Charity Trusts
        </h1>
        <p className="text-base text-gray-600">
          Discover audited non-profit organizations operating transparent campaigns across India.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search verified trusts by name..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-brand-500 shadow-soft"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-sm text-gray-500">Loading verified trusts...</div>
      ) : trusts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trusts.map((trust) => (
            <div
              key={trust._id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-smooth flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <img
                    src={trust.logo}
                    alt={trust.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-sm"
                  />
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    Verified
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-charcoal-900 text-lg">{trust.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                    <span>{trust.location}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {trust.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs font-semibold text-gray-500">
                  <span className="font-bold text-brand-600">{trust.activeCampaignsCount || 0}</span> Active Causes
                </div>

                <Link
                  to={`/trusts/${trust._id}`}
                  className="px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-smooth flex items-center gap-1"
                >
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-sm text-gray-500">No verified trusts found.</div>
      )}

    </div>
  );
};

export default TrustsListPage;
