import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building2, ShieldCheck } from 'lucide-react';
import { createTrust } from '../../services/api';

const AdminCreateTrust = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80',
    location: '',
    email: '',
    phone: '',
    website: '',
    registrationNumber: `REG-IND-${Math.floor(1000 + Math.random() * 9000)}`,
    verificationStatus: 'Verified'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      await createTrust({
        name: formData.name,
        description: formData.description,
        logo: formData.logo,
        location: formData.location,
        contact: {
          email: formData.email,
          phone: formData.phone,
          website: formData.website
        },
        registrationNumber: formData.registrationNumber,
        verificationStatus: formData.verificationStatus
      });

      navigate('/admin/trusts');
    } catch (err) {
      setError(err.message || 'Failed to create trust');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-3">
        <Link to="/admin/trusts" className="p-2 rounded-xl bg-white border border-gray-200 text-charcoal-700 hover:bg-gray-50">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal-950">Add Charity Trust / NGO</h1>
          <p className="text-xs text-gray-500">Register a new audited non-profit organization on Helping Hands.</p>
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
            <label className="block text-xs font-bold text-gray-700 mb-1">Trust / NGO Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Swasthya Seva Foundation"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Hyderabad, Telangana"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Registration Number *</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500 font-mono"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the mission, activities, and beneficiaries served..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Contact Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@trust.org"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">Logo URL</label>
            <input
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Verification Status</label>
            <select
              name="verificationStatus"
              value={formData.verificationStatus}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-brand-500"
            >
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm shadow-emerald transition-smooth disabled:opacity-50"
        >
          {submitting ? 'Creating Trust...' : 'Register Trust'}
        </button>

      </form>
    </div>
  );
};

export default AdminCreateTrust;
