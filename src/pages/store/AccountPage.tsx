import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppStoreContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import {
  ShoppingBag,
  Wallet,
  Gift,
  MapPin,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  Phone,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCustomer, orders, resetDemoData } = useAppStore();
  const toast = useToast();

  const customerOrders = orders.filter((o) => o.customerId === currentCustomer.id);
  const recentOrder = customerOrders[0];

  const handleReset = () => {
    resetDemoData();
    toast.success('Demo Reset', 'Catalog, orders, and wallet balance reset.');
  };

  const navMenuItems = [
    {
      title: 'Orders & Tracking',
      subtitle: `${customerOrders.length} orders placed`,
      icon: ShoppingBag,
      to: '/orders',
    },
    {
      title: 'Annapurna Wallet',
      subtitle: `Balance: ${formatCurrency(currentCustomer.walletBalance)}`,
      icon: Wallet,
      to: '/wallet',
    },
    {
      title: 'Refer & Earn',
      subtitle: `Code: ${currentCustomer.referralCode}`,
      icon: Gift,
      to: '/referrals',
    },
    {
      title: 'Profile & Addresses',
      subtitle: `${currentCustomer.addresses.length} delivery addresses`,
      icon: MapPin,
      to: '/profile',
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8 pb-20">
      <div>
        <h1 className="font-heading text-3xl font-medium text-ink">My Account</h1>
        <p className="text-xs text-muted mt-1">
          Personal details, orders, and wallet balance
        </p>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Vertical Menu Card with Left Bar Highlight */}
        <div className="lg:col-span-4 bg-white rounded-card border border-line p-6 space-y-6">
          <div className="flex items-center gap-3.5 pb-5 border-b border-line">
            <div className="w-12 h-12 rounded-[10px] bg-cream text-forest font-heading text-lg font-semibold flex items-center justify-center border border-line shrink-0">
              {currentCustomer.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-ink truncate text-sm">
                {currentCustomer.name}
              </h2>
              <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-muted" /> {currentCustomer.mobile}
              </p>
            </div>
          </div>

          {/* Navigation Menu Rows with left bar active styling per Section 6 */}
          <nav className="space-y-1">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center justify-between p-3 rounded-[8px] hover:bg-cream transition-colors group text-xs text-ink"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 stroke-[1.5] text-forest" />
                    <div>
                      <p className="font-medium text-ink group-hover:text-forest transition-colors">
                        {item.title}
                      </p>
                      <p className="text-muted text-[11px]">{item.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted group-hover:text-forest transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-line">
            <button
              onClick={handleReset}
              className="text-xs text-muted hover:text-forest flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset demo seed data
            </button>
          </div>
        </div>

        {/* Right: Overview & Recent Order */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Wallet Highlight */}
          <div className="p-5 bg-mint rounded-card border border-line flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-muted font-medium">
                Wallet Balance
              </span>
              <div className="font-heading text-2xl font-semibold text-ink mt-0.5 tabular-nums">
                {formatCurrency(currentCustomer.walletBalance)}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/wallet')}
            >
              View ledger
            </Button>
          </div>

          {/* Recent Order Preview */}
          <div className="bg-white rounded-card border border-line p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-heading text-base font-medium text-ink">
                Recent order
              </h3>
              <Link
                to="/orders"
                className="text-xs font-semibold text-forest hover:underline flex items-center gap-1"
              >
                <span>All orders ({customerOrders.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentOrder ? (
              <div className="space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-semibold text-ink">{recentOrder.id}</span>
                    <span className="text-muted ml-2">Placed {formatDate(recentOrder.createdAt)}</span>
                  </div>
                  <StatusBadge status={recentOrder.orderStatus} />
                </div>

                {/* Thumbnails */}
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {recentOrder.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-[8px] bg-cream border border-line shrink-0"
                    >
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-10 h-10 rounded-[6px] object-cover"
                      />
                      <div>
                        <p className="font-medium text-ink text-[11px] truncate max-w-[120px]">
                          {it.name}
                        </p>
                        <p className="text-[10px] text-muted">{it.quantity} x {it.unitLabel}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-line">
                  <div>
                    <span className="text-muted text-[11px]">Total:</span>
                    <span className="font-semibold text-ink tabular-nums ml-1.5">
                      {formatCurrency(recentOrder.total)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/orders/${recentOrder.id}`)}
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View order
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted py-4 text-center">No orders placed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccountPage;
