import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Megaphone,
  PlusCircle,
  HeartHandshake,
  FileCheck2,
  Building2,
  FolderLock,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TRUST_NAV_ITEMS = [
  { name: 'Dashboard', to: '/trust/dashboard', icon: LayoutDashboard, exact: true },
  { name: 'My Causes / Campaigns', to: '/trust/campaigns', icon: Megaphone },
  { name: '+ Add Cause', to: '/trust/add-cause', icon: PlusCircle },
  { name: 'Donations / Supporters', to: '/trust/donations', icon: HeartHandshake },
  { name: 'Impact Updates', to: '/trust/impact-updates', icon: FileCheck2 },
  { name: 'My Trust Profile', to: '/trust/profile', icon: Building2 },
  { name: 'Documents / Verification', to: '/trust/documents', icon: FolderLock },
  { name: 'Settings', to: '/trust/settings', icon: Settings }
];

const TrustSidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/trust/login');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#0E1F1A] text-emerald-100 border-r border-emerald-900/60">
      {/* Brand Header */}
      <div className="p-6 border-b border-emerald-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950 overflow-hidden">
            {user?.logo ? (
              <img src={user.logo} alt="Trust Logo" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-5 h-5 text-emerald-950" />
            )}
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-sm text-white truncate block">
              {user?.trustName || 'Trust Partner'}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Trust Portal
              </span>
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        {setMobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 text-emerald-400 hover:text-white rounded-lg hover:bg-emerald-900/40"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-emerald-500/80">
          Trust Workspace
        </div>
        {TRUST_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm font-bold'
                    : 'text-emerald-300/70 hover:text-white hover:bg-emerald-900/40'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-emerald-900/60 bg-emerald-950/40">
        <div className="flex items-center justify-between gap-3 mb-3 px-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-800/40 border border-emerald-700/50 text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0">
              {user?.trustName ? user.trustName[0] : 'T'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.trustName || 'Trust'}</p>
              <p className="text-[10px] text-emerald-400/80 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Portal</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer (Collapsible) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

export default TrustSidebar;
