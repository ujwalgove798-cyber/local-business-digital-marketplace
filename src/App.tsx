/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';

import { HomePage } from './pages/HomePage';
import { ShopsPage } from './pages/ShopsPage';
import { ShopDetailPage } from './pages/ShopDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { VendorRegisterPage } from './pages/VendorRegisterPage';
import { VendorDashboardPage } from './pages/VendorDashboardPage';
import { CustomerRegisterPage } from './pages/CustomerRegisterPage';
import { LoginPage } from './pages/LoginPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { BookingTermsPage } from './pages/BookingTermsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; errorMessage: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message || 'An unexpected error occurred.' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0c10] text-[#f5f2eb] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#131522] border border-[#2a2f45] rounded-2xl p-6 text-center space-y-4">
            <h1 className="text-xl font-bold text-[#d4af37]">Something went wrong</h1>
            <p className="text-xs text-[#a49f91]">{this.state.errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 rounded-full bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Auto scroll to top on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <StoreProvider>
          <HashRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#0b0c10] text-[#f5f2eb]">
            <Navbar />
            <main className="flex-grow">
            <Routes>
              {/* Marketplace Core Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/shops" element={<ShopsPage />} />
              <Route path="/shop/:id" element={<ShopDetailPage />} />
              <Route path="/shops/:id" element={<ShopDetailPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/products" element={<CollectionsPage />} />
              <Route path="/shop" element={<CollectionsPage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />

              {/* Vendor Multi-Vendor Experience */}
              <Route path="/vendor/register" element={<VendorRegisterPage />} />
              <Route path="/vendor-register" element={<VendorRegisterPage />} />
              <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
              <Route path="/vendor" element={<VendorDashboardPage />} />

              {/* Customer Account & Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<CustomerRegisterPage />} />
              <Route path="/account" element={<CustomerAccountPage />} />
              <Route path="/customer/dashboard" element={<CustomerAccountPage />} />

              {/* E-Commerce Shopping & Checkout */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/track-order" element={<OrderTrackingPage />} />

              {/* Physical Store & Appointment Booking */}
              <Route path="/book" element={<BookAppointmentPage />} />
              <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<BookingTermsPage />} />

              {/* Admin Back-Office */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />

              {/* Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </HashRouter>
    </StoreProvider>
  </LanguageProvider>
  </ErrorBoundary>
  );
}
