import React, { useState } from 'react';
import {
  Settings,
  Building,
  Save,
  CheckCircle2,
  Lock,
  CreditCard,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TrustSettings = () => {
  const { user } = useAuth();

  const [bankInfo, setBankInfo] = useState({
    bankName: 'State Bank of India',
    accountNumber: '•••• •••• 4892',
    ifscCode: 'SBIN0001234',
    branch: 'Shivaji Nagar, Pune'
  });

  const [notifications, setNotifications] = useState({
    emailOnDonation: true,
    weeklyReport: true,
    urgentComplianceReminders: true
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
          Trust Account Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Configure banking disbursement details, donor alert preferences, and security options.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Disbursement and notification settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* BANKING DISBURSEMENT DETAILS */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            Direct Banking Disbursement Account
          </h3>
          <p className="text-[11px] text-gray-500">
            Funds raised for your causes are settled directly into this verified NGO bank account upon milestone verification.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={bankInfo.bankName}
                onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">Account Number</label>
              <input
                type="text"
                value={bankInfo.accountNumber}
                onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">IFSC Code</label>
              <input
                type="text"
                value={bankInfo.ifscCode}
                onChange={(e) => setBankInfo({ ...bankInfo, ifscCode: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">Branch City</label>
              <input
                type="text"
                value={bankInfo.branch}
                onChange={(e) => setBankInfo({ ...bankInfo, branch: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* NOTIFICATION PREFERENCES */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            <Bell className="w-5 h-5 text-purple-600" />
            Alerts & Notification Preferences
          </h3>

          <div className="space-y-3">
            <div className="flex items-start sm:items-center justify-between gap-3 p-3.5 bg-gray-50 rounded-xl">
              <div>
                <span className="font-bold text-charcoal-900 block">Immediate Email Alert per Donation</span>
                <span className="text-[11px] text-gray-500">Receive transactional receipt alerts whenever a donor backs your causes.</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailOnDonation}
                onChange={() => setNotifications({ ...notifications, emailOnDonation: !notifications.emailOnDonation })}
                className="w-4 h-4 accent-emerald-600 cursor-pointer shrink-0 mt-0.5 sm:mt-0"
              />
            </div>

            <div className="flex items-start sm:items-center justify-between gap-3 p-3.5 bg-gray-50 rounded-xl">
              <div>
                <span className="font-bold text-charcoal-900 block">Weekly Digest & Impact Reminders</span>
                <span className="text-[11px] text-gray-500">Summary of fund progress, donor reach, and milestone updates.</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.weeklyReport}
                onChange={() => setNotifications({ ...notifications, weeklyReport: !notifications.weeklyReport })}
                className="w-4 h-4 accent-emerald-600 cursor-pointer shrink-0 mt-0.5 sm:mt-0"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default TrustSettings;
