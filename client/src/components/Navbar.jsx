import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, Building2, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isTrust, isAdmin } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Causes', path: '/explore' },
    { name: 'Trusts', path: '/trusts' },
    { name: 'About Us', path: '/about' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-smooth">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-emerald group-hover:scale-105 transition-smooth">
              <Heart className="w-6 h-6 fill-current text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-charcoal-900 tracking-tight block group-hover:text-brand-600 transition-colors">
                Helping Hands
              </span>
              <span className="text-xs font-medium text-brand-600 tracking-wide block -mt-1">
                Small Help. Big Change.
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-full border border-gray-200/80">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-smooth ${
                  isActive(link.path)
                    ? 'bg-white text-brand-600 shadow-sm border border-gray-100'
                    : 'text-charcoal-600 hover:text-brand-600 hover:bg-gray-100/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isTrust ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/trust/dashboard"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-smooth flex items-center gap-1.5"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{user?.trustName || 'Trust Portal'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2.5 rounded-xl text-charcoal-500 hover:text-red-600 hover:bg-red-50 transition-smooth"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : isAdmin ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-smooth flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2.5 rounded-xl text-charcoal-500 hover:text-red-600 hover:bg-red-50 transition-smooth"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/trust/login"
                className="px-4 py-2 rounded-full text-xs font-bold text-charcoal-700 hover:text-brand-600 hover:bg-gray-100 transition-smooth flex items-center gap-1.5 border border-transparent hover:border-gray-200"
              >
                <Building2 className="w-4 h-4 text-brand-600" />
                <span>For Trusts</span>
              </Link>
            )}

            <Link
              to="/explore"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-emerald hover:shadow-lg hover:-translate-y-0.5 transition-smooth active:translate-y-0"
            >
              <Heart className="w-4 h-4 fill-white" />
              Donate Now
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center gap-2">
            {!user && (
              <Link
                to="/trust/login"
                className="p-2 text-xs font-bold text-brand-600"
              >
                For Trusts
              </Link>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-charcoal-700 hover:text-brand-600 hover:bg-brand-50 transition-smooth focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-xl font-medium text-base transition-smooth ${
                  isActive(link.path)
                    ? 'bg-brand-50 text-brand-600 font-semibold'
                    : 'text-charcoal-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isTrust ? (
              <>
                <Link
                  to="/trust/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-xl font-medium text-base text-brand-700 bg-brand-50 flex items-center justify-between"
                >
                  <span>{user?.trustName || 'Trust Dashboard'}</span>
                  <Building2 className="w-4 h-4 text-brand-600" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : isAdmin ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-xl font-medium text-base text-charcoal-900 bg-gray-100 flex items-center justify-between"
                >
                  <span>Admin Dashboard</span>
                  <LayoutDashboard className="w-4 h-4 text-charcoal-700" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/trust/login"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-xl font-medium text-base text-charcoal-700 hover:bg-gray-50 flex items-center justify-between"
              >
                <span>For Trusts / Partner Portal</span>
                <Building2 className="w-4 h-4 text-brand-600" />
              </Link>
            )}
          </div>

          <div className="pt-2">
            <Link
              to="/explore"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-emerald"
            >
              <Heart className="w-5 h-5 fill-white" />
              Donate Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
