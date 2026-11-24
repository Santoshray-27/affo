import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { StorefrontLayout } from './components/storefront/StorefrontLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { ToastProvider } from './components/ui/Toast';
import { AppStoreProvider } from './store/AppStoreContext';
import Preloader from './components/Preloader';

// Customer Pages (Lazy loaded for optimal performance)
const HomePage = lazy(() => import('./pages/store/HomePage').then((m) => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('./pages/store/ShopPage').then((m) => ({ default: m.ShopPage })));
const CategoryPage = lazy(() => import('./pages/store/CategoryPage').then((m) => ({ default: m.CategoryPage })));
const ProductDetailPage = lazy(() => import('./pages/store/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/store/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/store/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./pages/store/OrderSuccessPage').then((m) => ({ default: m.OrderSuccessPage })));
const AccountPage = lazy(() => import('./pages/store/AccountPage').then((m) => ({ default: m.AccountPage })));
const OrdersPage = lazy(() => import('./pages/store/OrdersPage').then((m) => ({ default: m.OrdersPage })));
const OrderDetailPage = lazy(() => import('./pages/store/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage })));
const WalletPage = lazy(() => import('./pages/store/WalletPage').then((m) => ({ default: m.WalletPage })));
const ReferralsPage = lazy(() => import('./pages/store/ReferralsPage').then((m) => ({ default: m.ReferralsPage })));
const ProfilePage = lazy(() => import('./pages/store/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Admin Pages (Lazy loaded)
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage })));
const AdminProductNewPage = lazy(() => import('./pages/admin/AdminProductNewPage').then((m) => ({ default: m.AdminProductNewPage })));
const AdminProductEditPage = lazy(() => import('./pages/admin/AdminProductEditPage').then((m) => ({ default: m.AdminProductEditPage })));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage').then((m) => ({ default: m.AdminOrdersPage })));
const AdminOrderDetailPage = lazy(() => import('./pages/admin/AdminOrderDetailPage').then((m) => ({ default: m.AdminOrderDetailPage })));
const AdminInventoryPage = lazy(() => import('./pages/admin/AdminInventoryPage').then((m) => ({ default: m.AdminInventoryPage })));
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage').then((m) => ({ default: m.AdminCustomersPage })));
const AdminWalletPage = lazy(() => import('./pages/admin/AdminWalletPage').then((m) => ({ default: m.AdminWalletPage })));
const AdminReferralsPage = lazy(() => import('./pages/admin/AdminReferralsPage').then((m) => ({ default: m.AdminReferralsPage })));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage').then((m) => ({ default: m.AdminAnalyticsPage })));

const SuspenseLoader: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-forest border-t-transparent animate-spin" />
  </div>
);

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <Preloader
            onDone={() => {
              setLoading(false);
            }}
          />
        )}
      </AnimatePresence>

      <AppStoreProvider>
        <ToastProvider>
          <Suspense fallback={<SuspenseLoader />}>
            <Routes>
              {/* Customer Storefront Routes */}
              <Route path="/" element={<StorefrontLayout />}>
                <Route index element={<HomePage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="category/:slug" element={<CategoryPage />} />
                <Route path="product/:productId" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="order-success/:orderId" element={<OrderSuccessPage />} />
                <Route path="account" element={<AccountPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:orderId" element={<OrderDetailPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="referrals" element={<ReferralsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Admin Dashboard Protected Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="products/new" element={<AdminProductNewPage />} />
                <Route path="products/:productId/edit" element={<AdminProductEditPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
                <Route path="inventory" element={<AdminInventoryPage />} />
                <Route path="customers" element={<AdminCustomersPage />} />
                <Route path="wallet" element={<AdminWalletPage />} />
                <Route path="referrals" element={<AdminReferralsPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
              </Route>
            </Routes>
          </Suspense>
        </ToastProvider>
      </AppStoreProvider>
    </>
  );
};

export default App;
