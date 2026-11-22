import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { useAppStore } from '../../store/AppStoreContext';
import { DemoGuideModal } from '../common/DemoGuideModal';
import { TopProgressBar } from '../common/TopProgressBar';
import { PageTransition } from '../common/PageTransition';
import { X } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { isAdminLoggedIn } = useAppStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showDemoRibbon, setShowDemoRibbon] = useState(() => {
    return localStorage.getItem('annapurna_admin_ribbon_dismissed') !== 'true';
  });
  const location = useLocation();

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const dismissRibbon = () => {
    setShowDemoRibbon(false);
    localStorage.setItem('annapurna_admin_ribbon_dismissed', 'true');
  };

  // Human-friendly title based on route
  const getPageTitle = (path: string) => {
    if (path === '/admin') return 'Dashboard';
    if (path.startsWith('/admin/products/new')) return 'Add Farm Produce';
    if (path.includes('/edit')) return 'Edit Produce Details';
    if (path.startsWith('/admin/products')) return 'Produce Catalog';
    if (path.startsWith('/admin/orders/')) return 'Order Fulfillment';
    if (path.startsWith('/admin/orders')) return 'Orders Queue';
    if (path.startsWith('/admin/inventory')) return 'Farm Inventory';
    if (path.startsWith('/admin/customers')) return 'Customer Directory';
    if (path.startsWith('/admin/wallet')) return 'Wallet Ledger';
    if (path.startsWith('/admin/referrals')) return 'Referrals Performance';
    if (path.startsWith('/admin/analytics')) return 'Analytics & Reports';
    return 'Owner Portal';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F2] text-ink selection:bg-mint selection:text-forest">
      <TopProgressBar />

      {/* Dismissible Demo Ribbon */}
      {showDemoRibbon && (
        <aside aria-label="Demo sandbox notification" className="bg-forest-deep text-cream text-xs px-4 py-2 border-b border-forest flex items-center justify-between shrink-0 font-mono">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-lime shrink-0" />
            <span className="truncate">
              Demo sandbox — changes here reflect in the customer storefront immediately.
            </span>
            <button
              onClick={dismissRibbon}
              className="ml-auto text-cream/70 hover:text-white p-0.5 rounded transition-colors"
              title="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      <div className="flex-1 flex min-h-0">
        {/* Desktop Sidebar (Fixed 240px) */}
        <div className="hidden lg:block shrink-0">
          <AdminSidebar />
        </div>

        {/* Mobile Drawer Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-forest/60 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-10">
              <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <AdminTopbar
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            title={getPageTitle(location.pathname)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </main>

          <footer className="p-4 border-t border-line bg-white text-xs text-muted">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1400px] mx-auto font-mono text-[11px]">
              <span>Annapurna Farm Fresh &amp; Organics — Owner Operations Backstage</span>
              <span>In-Browser State Synchronizer</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Shared Demo Guide Modal for Easy Verification */}
      <DemoGuideModal />
    </div>
  );
};
