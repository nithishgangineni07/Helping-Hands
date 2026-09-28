import React from 'react';
import { Menu, PlusCircle, Bell, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ setMobileOpen }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-gray-600">Helping Hands Administrative Network</span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-xl transition-colors border border-gray-200"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3 h-3 text-gray-400" />
        </Link>

        <Link
          to="/admin/create-trust"
          className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-charcoal-800 font-bold text-xs hover:border-emerald-500 hover:text-emerald-700 bg-white transition-all shadow-xs flex items-center gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Add Trust</span>
        </Link>

        <Link
          to="/admin/create-campaign"
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Cause</span>
        </Link>

        {/* User Pill */}
        <div className="pl-2 border-l border-gray-200 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 font-bold flex items-center justify-center text-xs">
            {user?.name ? user.name[0] : 'A'}
          </div>
          <span className="hidden md:inline text-xs font-bold text-charcoal-800">
            {user?.name || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
