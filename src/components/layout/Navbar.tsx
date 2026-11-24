import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Phone, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Clock,
  ShoppingBag,
  Heart,
  User,
  Truck,
  Store,
  ChevronDown,
  Navigation
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';

const AVAILABLE_LOCATIONS = [
  'All Bengaluru',
  'BTM Layout',
  'Indiranagar',
  'Koramangala',
  'Jayanagar',
  'HSR Layout',
  'Whitefield',
  'MG Road',
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const location = useLocation();
  const { 
    settings, 
    adminUser, 
    cartCount, 
    wishlist, 
    userProfile, 
    currentVendorShop, 
    selectedLocation, 
    setSelectedLocation,
    addToast 
  } = useStore();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIsLocationModalOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Local Shops', path: '/shops' },
    { name: 'Explore Products', path: '/collections' },
    { name: 'Vendor Hub', path: userProfile?.role === 'vendor' ? '/vendor/dashboard' : '/vendor/register' },
    { name: 'Appointments', path: '/book' },
  ];

  const wishlistCount = wishlist?.length || 0;

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setSelectedLocation('BTM Layout, Bengaluru (Nearby)');
        setIsLocationModalOpen(false);
        addToast('Location updated to nearby local shops in Bengaluru', 'success');
      },
      () => {
        setSelectedLocation('BTM Layout');
        setIsLocationModalOpen(false);
        addToast('Defaulted to BTM Layout, Bengaluru', 'info');
      }
    );
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-[#07080b] border-b border-[#222430] text-xs py-2 px-4 text-[#bfb8aa] hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center tracking-wide">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#d4af37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Local Business Digital Marketplace • Zero Commission Discovery</span>
            </span>

            {/* Location selector dropdown button */}
            <div className="relative">
              <button
                onClick={() => setIsLocationModalOpen(!isLocationModalOpen)}
                className="flex items-center gap-1.5 text-xs text-[#f5f2eb] bg-[#161824] px-2.5 py-1 rounded-full border border-[#2c3045] hover:border-[#d4af37] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="max-w-[140px] truncate">{selectedLocation || 'All Bengaluru'}</span>
                <ChevronDown className="w-3 h-3 text-[#9a9486]" />
              </button>

              {isLocationModalOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-[#12141f] border border-[#2b3046] rounded-xl shadow-2xl py-2 z-50 text-left">
                  <div className="px-3 py-1.5 border-b border-[#222638] flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9a9486]">Select City / Area</span>
                    <button
                      onClick={handleUseMyLocation}
                      className="text-[11px] text-[#d4af37] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Navigation className="w-3 h-3" />
                      Auto-Detect
                    </button>
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1">
                    {AVAILABLE_LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsLocationModalOpen(false);
                          addToast(`Marketplace filtered to ${loc}`, 'info');
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#1a1e2f] transition-colors ${
                          selectedLocation === loc ? 'text-[#d4af37] font-semibold bg-[#d4af37]/10' : 'text-[#cfc8b8]'
                        }`}
                      >
                        <span>{loc}</span>
                        {selectedLocation === loc && <span className="text-[10px] text-[#d4af37]">✓ Active</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/vendor/register"
              className="text-[#d4af37] hover:underline flex items-center gap-1.5 font-medium"
            >
              <Store className="w-3.5 h-3.5" />
              <span>List Your Shop Free</span>
            </Link>
            <span className="text-[#323646]">|</span>
            <Link
              to="/track-order"
              className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{t('store.trackOrder', 'Track Order')}</span>
            </Link>
            <span className="text-[#323646]">|</span>
            <a 
              href={`https://wa.me/${settings.whatsapp}?text=Hello%20LocalBiz%20Marketplace,%20I%20have%20an%20enquiry%20regarding%20local%20shops`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              {t('store.whatsappSupport', 'WhatsApp Support')}
            </a>
            <span className="text-[#323646]">|</span>
            <Link 
              to={adminUser ? "/admin" : "/admin/login"} 
              className="text-[#888377] hover:text-[#d4af37] flex items-center gap-1 transition-colors"
              title="Marketplace Admin Console"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{adminUser ? t('store.adminConsole', 'Admin') : t('store.login', 'Admin Login')}</span>
            </Link>
            <span className="text-[#323646]">|</span>
            {/* Topbar Language Selector */}
            <LanguageSelector variant="topbar" />
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#0d0e14]/95 backdrop-blur-md shadow-2xl py-3 border-b border-[#252838]' 
            : 'bg-[#0c0d12]/80 backdrop-blur-sm py-4 border-b border-[#1b1e2a]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-[#d4af37]/60 flex items-center justify-center bg-gradient-to-br from-[#1c1d28] to-[#0f1017] group-hover:border-[#d4af37] transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <Store className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-[0.14em] text-[#f8f5ee] group-hover:text-[#d4af37] transition-colors block">
                  LOCALBIZ
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.2em] text-[#d4af37] uppercase block -mt-1 font-semibold">
                  DIGITAL MARKETPLACE
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const isVendorHub = link.path.includes('/vendor');

                if (isVendorHub) {
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 bg-gradient-to-r from-[#d4af37] via-[#e5c567] to-[#c59d33] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>{currentVendorShop ? 'My Shop' : 'Sell with Us'}</span>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 text-xs font-medium tracking-widest uppercase transition-colors relative group ${
                      isActive ? 'text-[#d4af37]' : 'text-[#cfc7b8] hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    <span 
                      className={`absolute bottom-0 left-3 right-3 h-[1.5px] bg-[#d4af37] transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`} 
                    />
                  </Link>
                );
              })}
            </nav>

            {/* E-Commerce Action Icons (Language, Cart, Wishlist, Account) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Selector in Navbar */}
              <div className="hidden sm:block">
                <LanguageSelector variant="navbar" />
              </div>

              {/* Account Link */}
              <Link
                to={userProfile ? "/account" : "/login"}
                className="p-2 rounded-full text-[#cfc7b8] hover:text-[#d4af37] hover:bg-[#191c2b] transition-colors relative"
                title={userProfile ? `Logged in as ${userProfile.fullName || userProfile.name}` : 'Login / Register'}
              >
                <User className="w-5 h-5" />
                {userProfile && (
                  <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </Link>

              {/* Wishlist Link */}
              <Link
                to="/account"
                className="p-2 rounded-full text-[#cfc7b8] hover:text-rose-400 hover:bg-[#191c2b] transition-colors relative"
                title={t('nav.wishlist', 'Wishlist')}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Link */}
              <Link
                to="/cart"
                className="p-2.5 rounded-full bg-[#171926] border border-[#2d3246] text-[#f5f2eb] hover:border-[#d4af37] hover:text-[#d4af37] transition-all relative group shadow-md"
                title={t('nav.cart', 'Shopping Cart')}
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black text-[11px] font-bold flex items-center justify-center shadow-lg">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg text-[#cfc7b8] hover:text-white hover:bg-[#1a1c28] focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#d4af37]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[73px] bg-[#0d0f17]/98 border-b border-[#25283a] shadow-2xl backdrop-blur-xl animate-in slide-in-from-top duration-200">
            <div className="px-6 pt-4 pb-8 space-y-3">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium tracking-wider uppercase transition-colors ${
                      isActive 
                        ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30' 
                        : 'text-[#d7cfc0] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{link.name}</span>
                      {link.path === '/book' && (
                        <span className="px-2 py-0.5 text-[10px] bg-[#d4af37] text-black font-bold rounded">
                          SLOTS OPEN
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}

              {/* Mobile Language Switcher */}
              <LanguageSelector variant="mobile" />

              <div className="pt-4 border-t border-[#222536] space-y-2">
                <Link
                  to="/cart"
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#171a26] text-xs font-semibold text-[#f5f2eb]"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                    <span>{t('cart.title', 'Shopping Cart')}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#d4af37] text-black font-bold text-[10px]">
                    {cartCount} Items
                  </span>
                </Link>

                <Link
                  to="/account"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#171a26] text-xs font-semibold text-[#f5f2eb]"
                >
                  <User className="w-4 h-4 text-[#d4af37]" />
                  <span>{t('store.customerAccount', 'Customer Dashboard & Orders')}</span>
                </Link>

                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 px-4 py-2 text-xs text-[#c7bfb0] hover:text-[#d4af37]"
                >
                  <Phone className="w-4 h-4 text-[#d4af37]" />
                  <span>Call: {settings.phone}</span>
                </a>

                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 text-xs text-[#c7bfb0] hover:text-[#d4af37]"
                >
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  <span>Directions (BTM 1st Stage)</span>
                </a>

                <Link
                  to={adminUser ? "/admin" : "/admin/login"}
                  className="flex items-center gap-3 px-4 py-2 text-xs text-[#878070] hover:text-[#d4af37]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{adminUser ? t('store.adminConsole', 'Admin Dashboard') : t('store.login', 'Store Admin Login')}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
