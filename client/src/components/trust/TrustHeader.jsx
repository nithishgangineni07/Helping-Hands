import React from 'react';
import { Menu, PlusCircle, ExternalLink, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TrustHeader = ({ setMobileOpen }) => {
  const { user } = useAuth();
  const status = user?.verificationStatus || 'Verified';

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-3.5 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs min-w-0">
      {/* Mobile Menu Button & Trust Identity */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="font-extrabold text-xs sm:text-sm text-charcoal-900 truncate max-w-[120px] xs:max-w-[180px] sm:max-w-[260px] md:max-w-none">
            {user?.trustName || 'Trust Partner'}
          </span>
          {status === 'Verified' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              <CheckCircle2 className="w-3 h-3" />
              <span className="hidden xs:inline">Verified</span>
            </span>
          ) : status === 'Pending' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
              <Clock className="w-3 h-3" />
              <span className="hidden xs:inline">Pending</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
              <XCircle className="w-3 h-3" />
              <span className="hidden xs:inline">{status}</span>
            </span>
          )}
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Link
          to="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-brand-600 hover:bg-emerald-50/40 rounded-xl transition-colors border border-gray-200"
          title="Open Public Portal"
        >
          <span>Public Portal</span>
          <ExternalLink className="w-3 h-3 text-gray-400" />
        </Link>

        <Link
          to="/trust/add-cause"
          className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-emerald hover:shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">New Cause</span>
          <span className="xs:hidden">Cause</span>
        </Link>

        {/* Trust Profile Mini Avatar */}
        <Link
          to="/trust/profile"
          className="pl-2 border-l border-gray-200 flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
          title="View Trust Profile"
        >
          <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 font-extrabold flex items-center justify-center text-xs overflow-hidden shrink-0">
            {user?.logo ? (
              <img src={user.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              (user?.trustName ? user.trustName[0] : 'T')
            )}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default TrustHeader;
