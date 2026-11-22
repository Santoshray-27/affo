import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Users,
  Wallet,
  Gift,
  BarChart3,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { useAppStore } from '../../store/AppStoreContext';
import { cn } from '../../lib/utils';

export interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const { lowStockProducts, pendingOrdersCount } = useAppStore();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/products', label: 'Produce Catalog', icon: Package },
    {
      to: '/admin/orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
    },
    {
      to: '/admin/inventory',
      label: 'Inventory',
      icon: Boxes,
      badge: lowStockProducts.length > 0 ? lowStockProducts.length : undefined,
    },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/wallet', label: 'Wallet Ledger', icon: Wallet },
    { to: '/admin/referrals', label: 'Referrals', icon: Gift },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-[240px] bg-forest-deep text-[#DDE6D6] h-full flex flex-col justify-between shrink-0 select-none border-r border-[#144723]">
      <div>
        {/* Admin Header with Brand Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#144723]">
          <Link to="/admin" className="flex items-center gap-2.5">
            <img
              src="/brand/logo-simple.png"
              alt="Annapurna"
              className="h-7 w-auto brightness-110"
            />
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-normal text-white text-base tracking-tight">
                अन्नपूर्णा
              </span>
              <span className="text-[11px] font-mono text-lime uppercase tracking-wider font-medium">
                Owner
              </span>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded text-[#DDE6D6]/70 hover:text-white hover:bg-white/10"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'relative flex items-center justify-between h-9 px-3 rounded-[8px] text-[13px] font-normal transition-colors group',
                    isActive
                      ? 'bg-[#C6E08D]/12 text-white font-medium before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:rounded-r before:bg-lime'
                      : 'text-[#DDE6D6]/80 hover:bg-white/5 hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          'w-4 h-4 stroke-[1.75]',
                          isActive ? 'text-lime' : 'text-[#DDE6D6]/70 group-hover:text-white'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          'text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-full border',
                          isActive
                            ? 'bg-lime text-forest-deep border-lime font-bold'
                            : 'bg-white/10 text-white border-white/20'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Link */}
      <div className="p-3 border-t border-[#144723] space-y-2">
        <Link
          to="/"
          className="w-full flex items-center justify-between h-9 px-3 rounded-[8px] text-[12px] text-[#DDE6D6]/80 hover:text-white hover:bg-white/5 transition-colors font-mono group"
        >
          <span>View Storefront</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#DDE6D6]/60 group-hover:text-lime" />
        </Link>
        <p className="text-[10px] text-[#DDE6D6]/40 text-center font-mono">
          Annapurna v1.0
        </p>
      </div>
    </aside>
  );
};
