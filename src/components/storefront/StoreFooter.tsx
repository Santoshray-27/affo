import React from 'react';
import { Link } from 'react-router-dom';
import { businessInfo } from '../../config/business';
import { Lock, Mail, Phone, MapPin } from 'lucide-react';

export const StoreFooter: React.FC = () => {
  return (
    <footer className="bg-forest-deep text-white mt-auto border-t border-forest/40">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 lg:py-20">
        {/* 4-COLUMN EDITORIAL FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Note (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/brand/logo-full.png"
                alt="Annapurna Farm Fresh & Organics"
                className="h-12 w-auto object-contain brightness-0 invert opacity-95"
              />
            </Link>
            <p className="text-xs text-white/70 max-w-sm leading-relaxed">
              Seasonal fruits and cold-pressed kitchen essentials, harvested from regional partner growers and delivered to your doorstep across Delhi NCR.
            </p>
            <p className="font-hindi text-xs text-lime/80 font-medium pt-1">
              अन्नपूर्णा – सबके लिए स्वस्थ और शुद्ध भोजन
            </p>
          </div>

          {/* Column 2: Shop Produce (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Produce
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  All Harvests
                </Link>
              </li>
              <li>
                <Link to="/category/fruits" className="hover:text-white transition-colors">
                  Fresh Fruits
                </Link>
              </li>
              <li>
                <Link to="/category/vegetables" className="hover:text-white transition-colors">
                  Farm Vegetables
                </Link>
              </li>
              <li>
                <Link to="/category/organics" className="hover:text-white transition-colors">
                  Pure Organics
                </Link>
              </li>
              <li>
                <Link to="/category/exotics" className="hover:text-white transition-colors">
                  Hydroponics &amp; Exotics
                </Link>
              </li>
              <li>
                <Link to="/category/juices-beverages" className="hover:text-white transition-colors">
                  Cold-Pressed Juices
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Service (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track Existing Order
                </Link>
              </li>
              <li>
                <Link to="/wallet" className="hover:text-white transition-colors">
                  Annapurna Wallet
                </Link>
              </li>
              <li>
                <Link to="/referrals" className="hover:text-white transition-colors">
                  Refer Friends &amp; Earn
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Delivery Addresses
                </Link>
              </li>
              <li>
                <span className="text-white/40">Delivery Timings: 6:00 AM – 9:00 AM</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Hubs (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Contact &amp; Hubs
            </h4>
            <div className="space-y-2.5 text-xs text-white/70">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-lime/80 shrink-0 mt-0.5" />
                <span>Cold hubs in South Delhi, Gurugram Cyber-City &amp; Noida.</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-lime/80 shrink-0" />
                <span className="text-white/60">{businessInfo.supportEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-lime/80 shrink-0" />
                <span className="text-white/60">{businessInfo.supportPhone}</span>
              </div>
              <div className="pt-1 text-[11px] text-white/40 font-mono">
                FSSAI Lic. {businessInfo.fssaiNumber.split(' ')[0]}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: Copyright, Payment Icons & Owner Demo */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Annapurna Farm Fresh &amp; Organics. All rights reserved.
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('annapurna:open-demo-guide'))}
              className="text-[11px] text-white/50 hover:text-white transition-colors"
            >
              Demo Guide
            </button>

            <div className="text-[11px] text-white/40 hidden md:flex items-center gap-2">
              <span>UPI</span>
              <span>•</span>
              <span>Cards</span>
              <span>•</span>
              <span>NetBanking</span>
              <span>•</span>
              <span>Cash on Delivery</span>
            </div>

            {/* Small discreet Owner Demo link per Section 8 */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-xs"
              title="Access Owner Dashboard"
            >
              <Lock className="w-3 h-3 text-lime" />
              <span>Owner Demo</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default StoreFooter;
