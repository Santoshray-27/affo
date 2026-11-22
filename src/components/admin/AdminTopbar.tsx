import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  RotateCcw,
  LogOut,
  ChevronDown,
  ShoppingBag,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '../../store/AppStoreContext';
import { useToast } from '../ui/Toast';
import { Modal } from '../ui/Modal';

export interface AdminTopbarProps {
  onToggleMobileSidebar: () => void;
  title?: string;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ onToggleMobileSidebar, title }) => {
  const navigate = useNavigate();
  const {
    lowStockProducts,
    pendingOrdersCount,
    orders,
    products,
    dispatch,
    resetDemoData,
  } = useAppStore();
  const toast = useToast();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const totalNotifications = (lowStockProducts.length > 0 ? 1 : 0) + (pendingOrdersCount > 0 ? 1 : 0);

  const handleOpenDemoGuide = () => {
    setIsProfileOpen(false);
    window.dispatchEvent(new CustomEvent('open-demo-guide'));
  };

  const handleReset = () => {
    resetDemoData();
    toast.success('Data Restored', 'Catalog, sample orders, and wallet ledger reset to initial state.');
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    dispatch({ type: 'SET_ADMIN_AUTH', payload: false });
    toast.info('Logged out from Owner Portal');
    navigate('/admin/login');
  };

  // Quick search results
  const matchingProducts = searchTerm.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 4)
    : [];
  const matchingOrders = searchTerm.trim()
    ? orders
        .filter((o) => o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 4)
    : [];

  return (
    <header className="h-16 bg-white border-b border-line px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-[8px] text-ink hover:bg-cream"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5 stroke-[1.5]" />
        </button>

        <h1 className="font-heading text-xl font-normal text-ink truncate">
          {title || 'Dashboard'}
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quiet Quick Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-[10px] bg-cream/70 hover:bg-cream border border-line text-xs text-muted transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-muted" />
          <span className="hidden md:inline text-ink/70">Search products or orders</span>
          <span className="md:hidden">Search</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-white rounded border border-line font-mono text-muted">
            ⌘K
          </kbd>
        </button>

        {/* Back to Storefront Link */}
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-mono text-forest hover:bg-cream border border-transparent hover:border-line transition-colors"
          title="Return to Customer Storefront"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </Link>

        {/* Notifications Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-[8px] hover:bg-cream text-ink relative transition-colors"
            aria-label="Owner notifications"
          >
            <Bell className="w-4 h-4 stroke-[1.75]" />
            {totalNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-forest" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-card shadow-dropdown border border-line py-2 z-50 overflow-hidden">
              <div className="px-4 py-2 border-b border-line bg-cream/40 flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-ink">
                  Fulfillment Alerts
                </span>
                <span className="text-[11px] text-muted font-mono">Live</span>
              </div>

              <div className="p-2 space-y-1.5">
                {pendingOrdersCount > 0 && (
                  <Link
                    to="/admin/orders"
                    onClick={() => setIsNotifOpen(false)}
                    className="p-2.5 rounded-[8px] bg-cream/60 border border-line flex items-start gap-2.5 text-xs hover:bg-cream transition-colors block"
                  >
                    <ShoppingBag className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-ink">
                        {pendingOrdersCount} Pending {pendingOrdersCount === 1 ? 'Order' : 'Orders'}
                      </p>
                      <p className="text-[11px] text-muted">Awaiting confirmation and packaging.</p>
                    </div>
                  </Link>
                )}

                {lowStockProducts.length > 0 && (
                  <Link
                    to="/admin/inventory"
                    onClick={() => setIsNotifOpen(false)}
                    className="p-2.5 rounded-[8px] bg-cream/60 border border-line flex items-start gap-2.5 text-xs hover:bg-cream transition-colors block"
                  >
                    <AlertCircle className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-ink">
                        {lowStockProducts.length} Items Low Stock (&lt; 10)
                      </p>
                      <p className="text-[11px] text-muted truncate">
                        {lowStockProducts.map((p) => p.name).slice(0, 2).join(', ')}...
                      </p>
                    </div>
                  </Link>
                )}

                {totalNotifications === 0 && (
                  <div className="p-4 text-center text-xs text-muted">
                    <span>All inventory healthy &amp; orders fulfilled.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Owner Avatar & Settings Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-1.5 p-1 rounded-full hover:bg-cream transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-forest text-cream font-mono font-medium text-xs flex items-center justify-center">
              AP
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-card shadow-dropdown border border-line py-1.5 z-50">
              <div className="px-4 py-2 border-b border-line bg-cream/40">
                <p className="text-xs font-semibold text-ink">Annapurna Operations</p>
                <p className="text-[11px] text-muted font-mono">owner@annapurna.demo</p>
              </div>

              <div className="p-1 space-y-0.5 text-xs">
                <button
                  onClick={handleOpenDemoGuide}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-ink hover:bg-cream rounded-[8px] transition-colors text-left"
                >
                  <HelpCircle className="w-4 h-4 text-forest" />
                  <span>Interactive Demo Guide</span>
                </button>
                <button
                  onClick={handleReset}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-ink hover:bg-cream rounded-[8px] transition-colors text-left"
                >
                  <RotateCcw className="w-4 h-4 text-forest" />
                  <span>Reset Demo Data</span>
                </button>
                <div className="border-t border-line/60 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-red hover:bg-red/5 rounded-[8px] transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-red" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchTerm('');
        }}
        title="Quick Search"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products or orders..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-cream/50 rounded-[10px] border border-line focus:outline-none focus:border-forest text-ink"
            />
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {matchingProducts.length > 0 && (
              <div>
                <p className="text-[11px] font-mono font-semibold text-muted uppercase tracking-wider mb-1">
                  Products
                </p>
                <div className="space-y-1">
                  {matchingProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(`/admin/products/${p.id}/edit`);
                      }}
                      className="w-full px-3 py-2 flex items-center justify-between text-xs hover:bg-cream rounded-[8px] text-left transition-colors"
                    >
                      <span className="font-semibold text-ink">{p.name}</span>
                      <span className="text-muted font-mono text-[11px]">Stock: {p.stockQuantity}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {matchingOrders.length > 0 && (
              <div>
                <p className="text-[11px] font-mono font-semibold text-muted uppercase tracking-wider mb-1">
                  Orders
                </p>
                <div className="space-y-1">
                  {matchingOrders.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(`/admin/orders/${o.id}`);
                      }}
                      className="w-full px-3 py-2 flex items-center justify-between text-xs hover:bg-cream rounded-[8px] text-left transition-colors"
                    >
                      <span className="font-semibold text-ink">
                        {o.id} ({o.customerName})
                      </span>
                      <span className="text-forest font-mono font-bold">₹{o.total}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchTerm && matchingProducts.length === 0 && matchingOrders.length === 0 && (
              <p className="text-xs text-muted text-center py-4">No matching records found.</p>
            )}
          </div>
        </div>
      </Modal>
    </header>
  );
};
