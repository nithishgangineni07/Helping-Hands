import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { getTrustById } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import CampaignCard from '../components/CampaignCard';
import { DetailSkeleton } from '../components/Skeletons';

const TrustDetailPage = () => {
  const { id } = useParams();
  const [trust, setTrust] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrust = async () => {
      try {
        setLoading(true);
        const res = await getTrustById(id);
        setTrust(res.data);
      } catch (err) {
        setError(err.message || 'Trust details not found');
      } finally {
        setLoading(false);
      }
    };

    fetchTrust();
  }, [id]);

  if (loading) return <DetailSkeleton />;

  if (error || !trust) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 p-8 bg-white rounded-2xl border border-gray-100 shadow-soft">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-charcoal-900">Trust Not Found</h2>
        <p className="text-xs text-gray-500">{error || 'The requested organization could not be loaded.'}</p>
        <Link
          to="/trusts"
          className="inline-block px-6 py-2.5 rounded-full bg-brand-500 text-white font-bold text-xs shadow-emerald"
        >
          View All Trusts
        </Link>
      </div>
    );
  }

  const {
    name,
    description,
    logo,
    location,
    contact,
    registrationNumber,
    verificationStatus,
    yearsOfService,
    activeCampaigns,
    completedCampaigns,
    totalRaised,
    totalDonors
  } = trust;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* TRUST PROFILE HEADER */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-soft space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <img
              src={logo}
              alt={name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-brand-100 shadow-sm shrink-0"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
                  {name}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  {verificationStatus || 'Verified NGO'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" />
                  {location}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-brand-500" />
                  Reg: {registrationNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-brand-500" />
                  {yearsOfService || 5} Years of Service
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Contact Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-gray-100">
          <div className="lg:col-span-8 space-y-3">
            <h3 className="text-sm font-extrabold text-charcoal-900 uppercase tracking-wider">
              About the Organization
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="lg:col-span-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
            <h3 className="text-xs font-extrabold text-charcoal-900 uppercase tracking-wider">
              Contact Information
            </h3>
            <div className="space-y-2 text-xs text-gray-600">
              {contact?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>{contact.email}</span>
                </div>
              )}
              {contact?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact?.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-brand-500 shrink-0" />
                  <a href={contact.website} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                    {contact.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
          <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100 text-center">
            <div className="text-2xl font-extrabold text-brand-700">
              {formatCurrency(totalRaised)}
            </div>
            <div className="text-xs font-semibold text-gray-500">Total Donated</div>
          </div>

          <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100 text-center">
            <div className="text-2xl font-extrabold text-brand-700">
              {totalDonors || 120}
            </div>
            <div className="text-xs font-semibold text-gray-500">Generous Donors</div>
          </div>

          <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100 text-center">
            <div className="text-2xl font-extrabold text-brand-700">
              {activeCampaigns?.length || 0}
            </div>
            <div className="text-xs font-semibold text-gray-500">Active Causes</div>
          </div>

          <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100 text-center">
            <div className="text-2xl font-extrabold text-brand-700">
              {completedCampaigns?.length || 0}
            </div>
            <div className="text-xs font-semibold text-gray-500">Projects Completed</div>
          </div>
        </div>
      </div>

      {/* SECTION: ACTIVE CAUSES */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-charcoal-900">
          Active Causes by {name}
        </h2>
        {activeCampaigns && activeCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCampaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 bg-white p-6 rounded-2xl border border-gray-100">
            No active campaigns currently listed for this trust.
          </p>
        )}
      </div>

      {/* SECTION: COMPLETED CAUSES */}
      {completedCampaigns && completedCampaigns.length > 0 && (
        <div className="space-y-6 pt-4">
          <h2 className="text-2xl font-extrabold text-charcoal-900">
            Completed Causes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCampaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default TrustDetailPage;
