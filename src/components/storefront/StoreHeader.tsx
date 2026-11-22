import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/AppStoreContext';
import { CartDrawer } from './CartDrawer';
import { formatCurrency } from '../../lib/utils';
import {
  Search,
  ShoppingBag,
  Wallet,
  User,
  MapPin,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { pricingConfig } from '../../config/pricing';
import { Marquee } from '../ui/Marquee';

export const StoreHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, cartTotal, currentCustomer, products } = useAppStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [currentPincode, setCurrentPincode] = useState('122002 (Gurugram)');
  const [inputPincode, setInputPincode] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close search and account popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchExpanded(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const searchSuggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.isActive &&
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchExpanded(false);
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPincode.trim().length === 6) {
      setCurrentPincode(`${inputPincode.trim()} (NCR Service Hub)`);
      setIsPincodeModalOpen(false);
    }
  };

  // Nav links per specification: Shop, Fruits, Vegetables, Organics, Exotics, Juices, Offers
  const navLinks = [
    { label: 'Shop All', to: '/shop' },
    { label: 'Fruits', to: '/category/fruits' },
    { label: 'Vegetables', to: '/category/vegetables' },
    { label: 'Organics', to: '/category/organics' },
    { label: 'Exotics', to: '/category/exotics' },
    { label: 'Juices', to: '/category/juices-beverages' },
    { label: 'Offers', to: '/shop?onOffer=true' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-line">
        {/* 1. SLIM 36PX ANNOUNCEMENT MARQUEE */}
        <div className="bg-forest-deep text-white text-[12px] h-9 flex items-center overflow-hidden">
          <Marquee speed="slow" pauseOnHover={true} gap="gap-12" fadeEdges={false}>
            <span className="flex items-center gap-12 font-medium tracking-wide">
              <span>Free delivery above ₹{pricingConfig.freeDeliveryThreshold}</span>
              <span className="text-white/30">•</span>
              <span>Fresh from regional partner farms</span>
              <span className="text-white/30">•</span>
              <span>Hand-sorted and packed daily</span>
              <span className="text-white/30">•</span>
              <span>Refer a friend and earn ₹{pricingConfig.referralRewardAmount}</span>
              <span className="text-white/30">•</span>
              <span>Code ANNA10 for 10% off</span>
              <span className="text-white/30">•</span>
            </span>
          </Marquee>
        </div>

        {/* 2. MAIN NAVBAR */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-18">
            {/* Left: Mobile Menu Button & Brand Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-ink hover:text-forest"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link to="/" className="flex items-center shrink-0">
                <img
                  src="/brand/logo-full.png"
                  alt="Annapurna Farm Fresh & Organics"
                  className="h-11 sm:h-12 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Center: Clean Nav Links with subtle underline on hover */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.to ||
                  (link.to.includes('?') &&
                    location.pathname + location.search === link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-sm font-medium transition-colors relative py-1 ${
                      isActive
                        ? 'text-forest font-semibold'
                        : 'text-ink/80 hover:text-forest'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Search, Location, Account, Wallet, Cart */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Expandable Search */}
              <div ref={searchRef} className="relative">
                {isSearchExpanded ? (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center bg-cream border border-forest rounded-[10px] px-3 py-1.5 w-60 sm:w-72"
                  >
                    <Search className="w-4 h-4 text-forest shrink-0 mr-2" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search produce..."
                      className="bg-transparent text-xs text-ink placeholder:text-muted focus:outline-none w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchExpanded(false)}
                      className="text-muted hover:text-ink p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchExpanded(true)}
                    className="p-2 text-ink hover:text-forest rounded-[10px] hover:bg-cream transition-colors"
                    title="Search catalog"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5 stroke-[1.5]" />
                  </button>
                )}

                {/* Live search dropdown results */}
                {isSearchExpanded && searchSuggestions.length > 0 && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-line rounded-[12px] shadow-soft p-2 z-50">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted px-2 py-1">
                      Quick Matches
                    </div>
                    {searchSuggestions.map((prod) => (
                      <Link
                        key={prod.id}
                        to={`/product/${prod.id}`}
                        onClick={() => setIsSearchExpanded(false)}
                        className="flex items-center justify-between p-2 rounded-[8px] hover:bg-cream text-xs text-ink transition-colors"
                      >
                        <span className="truncate">{prod.name}</span>
                        <span className="font-semibold tabular-nums text-forest ml-2">
                          {formatCurrency(prod.price)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Pill (Quiet, minimal) */}
              <button
                onClick={() => setIsPincodeModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted hover:text-forest rounded-[10px] hover:bg-cream transition-colors"
                title="Change delivery area"
              >
                <MapPin className="w-4 h-4 stroke-[1.5] text-forest" />
                <span className="truncate max-w-[120px] font-medium text-ink">
                  {currentPincode.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-muted" />
              </button>

              {/* Wallet Link */}
              <Link
                to="/wallet"
                className="p-2 text-ink hover:text-forest rounded-[10px] hover:bg-cream transition-colors"
                title="Annapurna Wallet"
                aria-label="Wallet"
              >
                <Wallet className="w-5 h-5 stroke-[1.5]" />
              </Link>

              {/* Account Dropdown */}
              <div ref={accountRef} className="relative">
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="p-2 text-ink hover:text-forest rounded-[10px] hover:bg-cream transition-colors"
                  title="My Account"
                  aria-label="Account"
                >
                  <User className="w-5 h-5 stroke-[1.5]" />
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-line rounded-[12px] shadow-soft p-1.5 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-line mb-1">
                      <div className="font-semibold text-ink">{currentCustomer.name}</div>
                      <div className="text-[11px] text-muted">{currentCustomer.mobile}</div>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setIsAccountOpen(false)}
                      className="block px-3 py-2 rounded-[8px] hover:bg-cream text-ink"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsAccountOpen(false)}
                      className="block px-3 py-2 rounded-[8px] hover:bg-cream text-ink"
                    >
                      Orders &amp; Tracking
                    </Link>
                    <Link
                      to="/wallet"
                      onClick={() => setIsAccountOpen(false)}
                      className="block px-3 py-2 rounded-[8px] hover:bg-cream text-ink"
                    >
                      Wallet ({formatCurrency(currentCustomer.walletBalance)})
                    </Link>
                    <Link
                      to="/referrals"
                      onClick={() => setIsAccountOpen(false)}
                      className="block px-3 py-2 rounded-[8px] hover:bg-cream text-ink"
                    >
                      Refer &amp; Earn
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsAccountOpen(false)}
                      className="block px-3 py-2 rounded-[8px] hover:bg-cream text-ink"
                    >
                      Profile &amp; Addresses
                    </Link>
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 bg-cream hover:bg-mint/60 border border-line px-3.5 py-2 rounded-[10px] text-ink transition-colors"
                title="View cart"
                aria-label={`Cart with ${cartCount} items`}
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.5] text-forest" />
                <span className="text-xs font-semibold tabular-nums">
                  {cartCount}
                </span>
                {cartCount > 0 && (
                  <span className="hidden sm:inline text-xs text-muted tabular-nums">
                    • {formatCurrency(cartTotal)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-line bg-white px-4 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-line">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 rounded-[8px] text-xs font-medium text-ink hover:bg-cream"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted pt-1">
              <span>Delivery Pincode:</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsPincodeModalOpen(true);
                }}
                className="font-semibold text-forest underline"
              >
                {currentPincode}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Pincode Modal */}
      <Modal
        isOpen={isPincodeModalOpen}
        onClose={() => setIsPincodeModalOpen(false)}
        title="Check Delivery Serviceability"
        maxWidth="sm"
      >
        <form onSubmit={handlePincodeSubmit} className="space-y-4">
          <p className="text-xs text-muted leading-relaxed">
            Enter your 6-digit postal code to check early morning sunrise delivery slots across Delhi NCR.
          </p>
          <Input
            value={inputPincode}
            onChange={(e) => setInputPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="e.g. 122002, 110001"
            maxLength={6}
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPincodeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm Area
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default StoreHeader;
