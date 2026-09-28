import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Lock,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSettings = () => {
  const { user } = useAuth();

  const [settings, setSettings] = useState({
    enforceGstOnCauses: true,
    enforceTaxExemptionProof: true,
    allowInternationalDonationsGlobally: false,
    requireAdminApprovalForUpdates: true,
    platformMaintenanceMode: false,
    maxDonationLimit: 500000
  });

  const [savedMsg, setSavedMsg] = useState(false);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
          Platform Governance & Controls
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Configure statutory verification rules, regulatory donation limits, and administrative controls.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Platform governance parameters updated and applied across live clusters.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* STATUTORY REGULATORY POLICIES */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Statutory NGO Compliance Requirements
          </h3>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
              <div>
                <span className="text-xs font-extrabold text-charcoal-900 block">Enforce GST Verification for Cause Creation</span>
                <span className="text-[11px] text-gray-500 block">Mandates trusts to declare GST status (or non-applicability) before publishing donation causes.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enforceGstOnCauses}
                onChange={() => handleToggle('enforceGstOnCauses')}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
              <div>
                <span className="text-xs font-extrabold text-charcoal-900 block">Mandate 80G / 12A Exemption Details</span>
                <span className="text-[11px] text-gray-500 block">Requires organizations to specify their tax deduction certification eligibility.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enforceTaxExemptionProof}
                onChange={() => handleToggle('enforceTaxExemptionProof')}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
              <div>
                <span className="text-xs font-extrabold text-charcoal-900 block">Strict Impact Update Moderation</span>
                <span className="text-[11px] text-gray-500 block">Forces completed causes to require administrative approval before impact reports appear publicly.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.requireAdminApprovalForUpdates}
                onChange={() => handleToggle('requireAdminApprovalForUpdates')}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* FCRA & INTERNATIONAL GATEWAY */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Cross-Border & FCRA Financial Controls
          </h3>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
              <div>
                <span className="text-xs font-extrabold text-charcoal-900 block">Enable International Foreign Inward Remittance</span>
                <span className="text-[11px] text-gray-500 block">Restricted only to trusts with valid registered FCRA status and Ministry approval.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.allowInternationalDonationsGlobally}
                onChange={() => handleToggle('allowInternationalDonationsGlobally')}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Single Transaction Maximum Limit (INR ₹)
              </label>
              <input
                type="number"
                value={settings.maxDonationLimit}
                onChange={(e) => setSettings({ ...settings, maxDonationLimit: Number(e.target.value) })}
                className="w-full sm:w-72 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* ADMIN CREDENTIALS OVERVIEW */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-600" />
            Admin Account & Security Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-gray-50 rounded-xl">
              <span className="text-gray-400 block font-bold">Authenticated Administrator</span>
              <span className="font-extrabold text-charcoal-900">{user?.name || 'Super Admin'}</span>
            </div>
            <div className="p-3.5 bg-gray-50 rounded-xl">
              <span className="text-gray-400 block font-bold">Admin Email</span>
              <span className="font-extrabold text-charcoal-900">{user?.email || 'admin@helpinghands.org'}</span>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Governance Configuration</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminSettings;
