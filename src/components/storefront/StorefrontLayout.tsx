import React from 'react';
import { Outlet } from 'react-router-dom';
import { StoreHeader } from './StoreHeader';
import { StoreFooter } from './StoreFooter';
import { MobileBottomTabBar } from './MobileBottomTabBar';
import { HelpDrawer } from './HelpDrawer';
import { DemoGuideModal } from '../common/DemoGuideModal';
import { TopProgressBar } from '../common/TopProgressBar';
import { PageTransition } from '../common/PageTransition';

export const StorefrontLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink selection:bg-mint selection:text-forest">
      <TopProgressBar />

      <StoreHeader />

      <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col focus:outline-none">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <StoreFooter />

      {/* Floating Helpers */}
      <HelpDrawer />
      <DemoGuideModal />
      <MobileBottomTabBar />
    </div>
  );
};

