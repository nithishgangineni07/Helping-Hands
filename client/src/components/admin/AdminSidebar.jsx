import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Megaphone,
  HeartHandshake,
  FileCheck2,
  BarChart3,
  ScrollText,
  AlertOctagon,
  Settings,
  LogOut,
  X,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { name: 'Dashboard', to: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Trust Management', to: '/admin/trusts', icon: Building2 },
  { name: 'Campaign Management', to: '/admin/campaigns', icon: Megaphone },
  { name: 'Donations', to: '/admin/donations', icon: HeartHandshake },
  { name: 'Impact Updates', to: '/admin/impact-updates', icon: FileCheck2 },
  { name: 'Reports & Analytics', to: '/admin/reports', icon: BarChart3 },
  { name: 'Audit Logs', to: '/admin/audit-logs', icon: ScrollText },
  { name: 'Complaints / Reports', to: '/admin/complaints', icon: AlertOctagon },
  { name: 'Settings', to: '/admin/settings', icon: Settings }
];

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/secure-admin-login');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#0F172A] text-slate-300 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-950">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-black text-lg text-white tracking-tight flex items-center gap-1.5">
              Helping Hands
            </span>
            <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        {setMobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
          Administration
        </div>
        {NAV_ITEMS.map((item) => {
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
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
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
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center justify-between gap-3 mb-3 px-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@helpinghands.org'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
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

export default AdminSidebar;
