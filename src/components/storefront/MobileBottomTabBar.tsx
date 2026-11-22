import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, ShoppingBag, Wallet, User } from 'lucide-react';
import { useAppStore } from '../../store/AppStoreContext';
import { cn } from '../../lib/utils';

export const MobileBottomTabBar: React.FC = () => {
  const { cartCount } = useAppStore();

  const tabs = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/shop', label: 'Shop', icon: Compass },
    { to: '/cart', label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { to: '/wallet', label: 'Wallet', icon: Wallet },
    { to: '/account', label: 'Account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-line sm:hidden flex items-center justify-around py-2 px-1 safe-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors relative min-w-[56px]',
                isActive ? 'text-forest font-semibold' : 'text-muted hover:text-ink'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={cn('w-5 h-5 mb-0.5 stroke-[1.5]', isActive && 'text-forest')} />
                  {tab.badge && tab.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2 bg-red text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
                <span>{tab.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
export default MobileBottomTabBar;
