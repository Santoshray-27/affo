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
    <div className="min-h-screen flex flex-col bg-cream text-app-text selection:bg-mint-dark selection:text-primary-dark">
      <TopProgressBar />

      <StoreHeader />

      <main className="flex-1 flex flex-col">
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

