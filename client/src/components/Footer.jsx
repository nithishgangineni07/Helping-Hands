import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Mail, Phone, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-charcoal-950 text-gray-300 pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-charcoal-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-emerald">
                <Heart className="w-5 h-5 fill-current text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight block">
                  Helping Hands
                </span>
                <span className="text-xs font-semibold text-brand-400">
                  Small Help. Big Change.
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Helping Hands is a transparent charity discovery platform connecting verified NGOs with compassionate donors. 100% of public contributions go directly toward verified project milestones.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 bg-brand-950/60 border border-brand-900/80 px-3.5 py-2 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4" />
              Verified Charity Marketplace MVP
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Quick Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-500" /> Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-500" /> Explore Causes
                </Link>
              </li>
              <li>
                <Link to="/trusts" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-500" /> Verified Trusts
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-500" /> About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Trusts & Partners */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Trust Network</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/trust/login" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-500" /> Trust Portal Login
                </Link>
              </li>
              <li>
                <Link to="/trust/register" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-500" /> Register Your Trust
                </Link>
              </li>
              <li>
                <Link to="/trusts" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-500" /> Verified Trust Registry
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-500" /> Verification Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Hyderabad & Bengaluru, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <span>support@helpinghands.org</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                <span>+91 1800 123 4567 (Toll Free)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Helping Hands Foundation. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-300 cursor-pointer">80G Tax Exemption</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
