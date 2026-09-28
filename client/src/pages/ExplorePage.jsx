import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, RefreshCw, HeartHandshake } from 'lucide-react';
import { getCampaigns } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import { CampaignCardSkeleton } from '../components/Skeletons';

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialCategory = searchParams.get('category') || 'All';
  const initialSort = searchParams.get('sort') || 'recent';

  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState(initialSort);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Education',
    'Healthcare',
    'Food & Nutrition',
    'Children',
    'Elderly Care',
    'Women Empowerment',
    'Disaster Relief',
    'Animal Welfare',
    'Community Development'
  ];

  useEffect(() => {
    const fetchFilteredCampaigns = async () => {
      try {
        setLoading(true);
        const params = {
          category: category !== 'All' ? category : undefined,
          search: searchTerm ? searchTerm : undefined,
          sort
        };

        if (sort === 'nearly_funded') {
          params.nearlyFunded = 'true';
        }

        const res = await getCampaigns(params);
        setCampaigns(res.data || []);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchFilteredCampaigns();
    }, 300);

    return () => clearTimeout(timer);
  }, [category, searchTerm, sort]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSort(val);
    searchParams.set('sort', val);
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setCategory('All');
    setSearchTerm('');
    setSort('recent');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-950 tracking-tight">
          Explore Causes
        </h1>
        <p className="text-base text-gray-600">
          Find a verified cause that matters to you and make a direct, transparent impact today.
        </p>
      </div>

      {/* Search & Sorting Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-soft space-y-4">
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search causes, trusts, or keywords (e.g. school, medical, food)..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500 focus:bg-white transition-smooth"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-auto flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500 shrink-0" />
            <select
              value={sort}
              onChange={handleSortChange}
              className="w-full md:w-48 py-3 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-charcoal-800 focus:outline-none focus:border-brand-500 transition-smooth"
            >
              <option value="recent">Recently Added</option>
              <option value="most_funded">Most Funded (%)</option>
              <option value="ending_soon">Ending Soon</option>
              <option value="nearly_funded">Nearly Funded (75%-99%)</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-smooth ${
                category === cat
                  ? 'bg-brand-500 text-white shadow-emerald'
                  : 'bg-gray-100 text-charcoal-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Active Filter Indicators */}
        {(category !== 'All' || searchTerm || sort !== 'recent') && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
            <span>
              Showing results for{' '}
              <strong className="text-charcoal-800">{category !== 'All' ? category : 'All Categories'}</strong>
              {searchTerm && <> matching "<strong>{searchTerm}</strong>"</>}
            </span>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 font-bold text-brand-600 hover:text-brand-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CampaignCardSkeleton />
          <CampaignCardSkeleton />
          <CampaignCardSkeleton />
          <CampaignCardSkeleton />
          <CampaignCardSkeleton />
          <CampaignCardSkeleton />
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 space-y-4 max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-500 mx-auto flex items-center justify-center">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-charcoal-900">No Causes Found</h3>
          <p className="text-xs text-gray-500">
            We couldn't find any active campaigns matching your selected category or search filters.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-emerald transition-smooth inline-block"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};

export default ExplorePage;
