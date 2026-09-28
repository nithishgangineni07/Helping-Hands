import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { getTrusts, createCampaign } from '../../services/api';

const AdminCreateCampaign = () => {
  const navigate = useNavigate();
  const [trusts, setTrusts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
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

  const [formData, setFormData] = useState({
    trust: '',
    title: '',
    category: 'Education',
    description: '',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
    targetAmount: 200000,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    whyNeeded: '',
    impact1Amount: 500,
    impact1Desc: 'Provides stationery kit for 1 student',
    impact2Amount: 2500,
    impact2Desc: 'Provides complete learning supplies for 5 children'
  });

  useEffect(() => {
    const fetchTrusts = async () => {
      try {
        const res = await getTrusts();
        const list = res.data || [];
        setTrusts(list);
        if (list.length > 0) {
          setFormData((prev) => ({ ...prev, trust: list[0]._id }));
        }
      } catch (err) {
        console.error('Failed to load trusts for dropdown', err);
      }
    };

    fetchTrusts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.trust) {
      alert('Please select a verified trust organization');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await createCampaign({
        trust: formData.trust,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        image: formData.image,
        targetAmount: Number(formData.targetAmount),
        deadline: formData.deadline,
        whyNeeded: formData.whyNeeded,
        howDonationHelps: [
          { amount: Number(formData.impact1Amount), impact: formData.impact1Desc },
          { amount: Number(formData.impact2Amount), impact: formData.impact2Desc }
        ]
      });

      navigate('/explore');
    } catch (err) {
      setError(err.message || 'Failed to create campaign');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-3">
        <Link to="/admin/campaigns" className="p-2 rounded-xl bg-white border border-gray-200 text-charcoal-700 hover:bg-gray-50">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal-950">Publish New Cause</h1>
          <p className="text-xs text-gray-500">Create a verified fundraising cause for an accredited NGO.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft space-y-6">
        
        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Trust / NGO *</label>
            <select
              name="trust"
              value={formData.trust}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-brand-500"
              required
            >
              {trusts.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.location})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">Campaign Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Help Provide School Supplies to 200 Children"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-brand-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Target Amount (INR ₹) *</label>
            <input
              type="number"
              min="1"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-extrabold text-brand-600 focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Deadline Date *</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Cover Image URL *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">Campaign Description *</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the cause..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500"
              required
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">Why This Is Needed *</label>
            <textarea
              name="whyNeeded"
              rows="3"
              value={formData.whyNeeded}
              onChange={handleChange}
              placeholder="Explain the background problem and emergency context..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500"
              required
            ></textarea>
          </div>

          {/* Impact Tiers */}
          <div className="md:col-span-2 p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <label className="block text-xs font-extrabold text-charcoal-900 uppercase">
              Donation Impact Tiers
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-bold text-gray-600">Tier 1 Amount (₹)</span>
                <input
                  type="number"
                  name="impact1Amount"
                  value={formData.impact1Amount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                />
                <input
                  type="text"
                  name="impact1Desc"
                  value={formData.impact1Desc}
                  onChange={handleChange}
                  placeholder="Impact description..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs mt-1"
                />
              </div>

              <div>
                <span className="text-[11px] font-bold text-gray-600">Tier 2 Amount (₹)</span>
                <input
                  type="number"
                  name="impact2Amount"
                  value={formData.impact2Amount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                />
                <input
                  type="text"
                  name="impact2Desc"
                  value={formData.impact2Desc}
                  onChange={handleChange}
                  placeholder="Impact description..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs mt-1"
                />
              </div>
            </div>
          </div>

        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm shadow-emerald transition-smooth disabled:opacity-50"
        >
          {submitting ? 'Publishing Campaign...' : 'Publish Cause'}
        </button>

      </form>
    </div>
  );
};

export default AdminCreateCampaign;
