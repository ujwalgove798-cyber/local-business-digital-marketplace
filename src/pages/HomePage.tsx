import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search,
  MapPin,
  Store,
  Sparkles,
  Phone,
  MessageCircle,
  Star,
  ShieldCheck,
  Tag,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Percent,
  Clock,
  Heart,
  ExternalLink,
  ChevronRight,
  Eye,
  BadgePercent,
  ShoppingBag,
  Navigation
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/product/ProductCard';

const MARKETPLACE_CATEGORIES = [
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    description: 'Boutiques, designer wear, ethnic silks & casual trends',
    icon: '👗',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    link: '/shops?category=Fashion',
    count: '24+ Shops'
  },
  {
    id: 'groceries',
    name: 'Groceries & Essentials',
    description: 'Farm-fresh vegetables, organic staples & daily groceries',
    icon: '🥦',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    link: '/shops?category=Groceries',
    count: '18+ Stores'
  },
  {
    id: 'electronics',
    name: 'Electronics & Mobiles',
    description: 'Smartphones, audio gear, accessories & repair shops',
    icon: '📱',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    link: '/shops?category=Electronics',
    count: '12+ Vendors'
  },
  {
    id: 'bakery',
    name: 'Bakery & Sweets',
    description: 'Artisan bakeries, traditional mithai, cakes & snacks',
    icon: '🥐',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    link: '/shops?category=Bakery',
    count: '15+ Bakeries'
  },
  {
    id: 'jewelry',
    name: 'Jewelry & Ornaments',
    description: 'Gold, silver, traditional temple sets & fashion jewelry',
    icon: '💍',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    link: '/shops?category=Jewelry',
    count: '8+ Jewelers'
  },
  {
    id: 'home',
    name: 'Home & Living',
    description: 'Handcrafted decor, kitchen essentials & furnishings',
    icon: '🛋️',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    link: '/shops?category=Home',
    count: '14+ Boutiques'
  }
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    shops, 
    products, 
    offers, 
    reviews, 
    selectedLocation, 
    setSelectedLocation, 
    addToast 
  } = useStore();
  const { t } = useLanguage();

  const [searchInput, setSearchInput] = useState('');
  const [searchMode, setSearchMode] = useState<'products' | 'shops'>('products');
  const [activeArea, setActiveArea] = useState('All');

  // Filter approved shops
  const approvedShops = useMemo(() => {
    return shops.filter((s) => s.status === 'approved' || !s.status);
  }, [shops]);

  // Featured shops for display
  const featuredShops = useMemo(() => {
    return approvedShops.slice(0, 4);
  }, [approvedShops]);

  // Trending products
  const trendingProducts = useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  // Active offers
  const activeOffers = useMemo(() => {
    return offers.filter((o) => o.isActive !== false).slice(0, 3);
  }, [offers]);

  // Handle hero search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    if (searchMode === 'shops') {
      navigate(`/shops?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate(`/collections?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setSelectedLocation('BTM Layout, Bengaluru (Nearby)');
        addToast('Location updated to nearby local businesses in Bengaluru', 'success');
      },
      () => {
        setSelectedLocation('BTM Layout');
        addToast('Defaulted to BTM Layout, Bengaluru', 'info');
      }
    );
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0e1017] via-[#090a0f] to-[#07080c] px-4 pt-10 pb-16">
        {/* Subtle Decorative Ambient Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b1e2c] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-widest shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Empowering Local Vendors Through Digital Visibility</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold text-[#f8f5ee] tracking-tight leading-[1.15]">
              Local Business <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59d33]">
                Digital Marketplace
              </span>
            </h1>
            <p className="text-[#a49f91] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Discover verified neighbourhood shops, compare prices, check real-time stock, and connect directly with shop owners via WhatsApp or phone call.
            </p>
          </div>

          {/* Quick Search & Location Bar */}
          <div className="max-w-3xl mx-auto bg-[#141724]/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-[#2a2f45] shadow-2xl space-y-3">
            {/* Search Type Switcher */}
            <div className="flex items-center gap-2 border-b border-[#212538] pb-2 text-xs">
              <span className="text-[#8e8878] font-medium mr-1 hidden sm:inline">Search in:</span>
              <button
                type="button"
                onClick={() => setSearchMode('products')}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  searchMode === 'products'
                    ? 'bg-[#d4af37] text-black shadow-sm'
                    : 'text-[#a29b8c] hover:text-white bg-[#1a1d2c]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Products & Deals</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchMode('shops')}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  searchMode === 'shops'
                    ? 'bg-[#d4af37] text-black shadow-sm'
                    : 'text-[#a29b8c] hover:text-white bg-[#1a1d2c]'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Local Shops & Stores</span>
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
              {/* Keyword Search */}
              <div className="flex-1 relative flex items-center">
                <Search className="w-5 h-5 text-[#9a9486] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder={
                    searchMode === 'shops'
                      ? 'Search local stores, bakeries, jewelers, grocers...'
                      : 'Search products, apparel, daily essentials, gadgets...'
                  }
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-[#0d0f18] text-[#f5f2eb] placeholder-[#716c5f] text-sm pl-11 pr-4 py-3 rounded-xl border border-[#252a3d] focus:border-[#d4af37] focus:outline-none transition-colors"
                />
              </div>

              {/* Area selector */}
              <div className="flex items-center gap-2">
                <div className="relative min-w-[160px]">
                  <MapPin className="w-4 h-4 text-[#d4af37] absolute left-3 top-3.5 pointer-events-none" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full bg-[#0d0f18] text-[#f5f2eb] text-xs font-medium pl-9 pr-7 py-3 rounded-xl border border-[#252a3d] focus:border-[#d4af37] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="All Bengaluru">All Bengaluru</option>
                    <option value="BTM Layout">BTM Layout</option>
                    <option value="Indiranagar">Indiranagar</option>
                    <option value="Koramangala">Koramangala</option>
                    <option value="Jayanagar">Jayanagar</option>
                    <option value="HSR Layout">HSR Layout</option>
                    <option value="Whitefield">Whitefield</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  title="Detect my current location"
                  className="p-3 bg-[#1d2235] text-[#d4af37] border border-[#2e3550] rounded-xl hover:bg-[#252c44] transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                </button>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-semibold text-sm rounded-xl hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Find Deals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick popular tags */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#1e2335] text-xs text-[#9a9486]">
              <span className="text-[#bfb8aa] font-medium">Trending Searches:</span>
              {['Cuban Collar Shirts', 'Organic Honey', 'Silk Sarees', 'Smartphone Earbuds', 'Almond Croissants'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => navigate(`/collections?search=${encodeURIComponent(tag)}`)}
                  className="px-2.5 py-1 rounded-full bg-[#1b1f30] hover:bg-[#252b42] text-[#d4af37] border border-[#2b324b] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Value Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-xl bg-[#12141f]/80 border border-[#222638] text-left">
              <span className="text-xl">🛍️</span>
              <p className="text-xs font-semibold text-[#f5f2eb] mt-1">Verified Local Shops</p>
              <p className="text-[11px] text-[#8e897d]">100% genuine local stores</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#12141f]/80 border border-[#222638] text-left">
              <span className="text-xl">💬</span>
              <p className="text-xs font-semibold text-[#f5f2eb] mt-1">Direct WhatsApp</p>
              <p className="text-[11px] text-[#8e897d]">Instant stock & deal check</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#12141f]/80 border border-[#222638] text-left">
              <span className="text-xl">🏷️</span>
              <p className="text-xs font-semibold text-[#f5f2eb] mt-1">Zero Markup</p>
              <p className="text-[11px] text-[#8e897d]">No platform commission fee</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#12141f]/80 border border-[#222638] text-left">
              <span className="text-xl">⚡</span>
              <p className="text-xs font-semibold text-[#f5f2eb] mt-1">Same-Day Pickup</p>
              <p className="text-[11px] text-[#8e897d]">Direct walk-in or delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-widest">
              Neighbourhood Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#f8f5ee] mt-1">
              Browse by Business Category
            </h2>
          </div>
          <Link
            to="/shops"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4af37] hover:underline"
          >
            <span>View All Local Shops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MARKETPLACE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="group relative h-64 rounded-2xl overflow-hidden border border-[#222639] hover:border-[#d4af37] transition-all duration-300 shadow-xl"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.55]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c12] via-[#0a0c12]/40 to-transparent" />
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-[#d4af37]">
                {cat.count}
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-2xl mb-1 block">{cat.icon}</span>
                <h3 className="text-lg font-heading font-bold text-[#f8f5ee] group-hover:text-[#d4af37] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#b8b2a3] mt-1 line-clamp-1">
                  {cat.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#d4af37]">
                  <span>Explore Stores</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Active Marketplace Special Offers */}
      {activeOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171a28] via-[#121420] to-[#1c192b] border border-[#d4af37]/30 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
                  <BadgePercent className="w-3.5 h-3.5" />
                  Exclusive Community Deals
                </span>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#f8f5ee] mt-2">
                  Today's Top Neighbourhood Offers
                </h2>
              </div>
              <Link
                to="/collections"
                className="text-xs font-semibold text-[#d4af37] hover:underline flex items-center gap-1"
              >
                <span>Shop Discounted Items</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {activeOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-5 rounded-2xl bg-[#0c0e16] border border-[#262b3f] hover:border-[#d4af37]/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#9a9486] mb-2">
                      <span className="font-semibold text-[#d4af37]">{offer.shopName}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold text-[10px]">
                        {offer.discountValue}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#f8f5ee]">{offer.title}</h3>
                    <p className="text-xs text-[#a09a8c] mt-1.5 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1e2335] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#d4af37] bg-[#1a1e2f] px-2 py-1 rounded border border-[#2b334e]">
                      CODE: {offer.promoCode || 'WALK-IN'}
                    </span>
                    <Link
                      to={`/shop/${offer.shopId}`}
                      className="text-xs text-[#f5f2eb] hover:text-[#d4af37] font-semibold flex items-center gap-1"
                    >
                      <span>Visit Shop</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Local Shops Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-widest">
              Spotlight
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#f8f5ee] mt-1">
              Featured Verified Shops
            </h2>
            <p className="text-xs text-[#9a9486] mt-1">
              Inspected & verified businesses with active WhatsApp customer support
            </p>
          </div>
          <Link
            to="/shops"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181a28] border border-[#2e334a] hover:border-[#d4af37] text-xs font-semibold text-[#f5f2eb] transition-colors"
          >
            <span>Explore All {shops.length} Shops</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredShops.map((shop) => {
            const cleanPhone = (shop.phone || '').replace(/\D/g, '');
            const cleanWhatsApp = (shop.whatsappNumber || '919739841266').replace(/\D/g, '');
            const whatsappMsg = `Hello ${shop.shopName}, I found your storefront on the Local Business Digital Marketplace. I would like to inquire about your collections and availability.`;
            const waUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(whatsappMsg)}`;

            return (
              <div
                key={shop.shopId}
                className="rounded-2xl bg-[#12141f] border border-[#23273a] hover:border-[#d4af37]/60 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-[#1c1f2e]">
                    <img
                      src={shop.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80'}
                      alt={shop.shopName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-semibold text-[#d4af37] border border-[#d4af37]/30">
                      {shop.category || 'Retail Store'}
                    </div>
                    {shop.verified !== false && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 backdrop-blur-md text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-bold text-base text-[#f8f5ee] group-hover:text-[#d4af37] transition-colors line-clamp-1">
                        {shop.shopName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{shop.rating || '4.9'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#a29c8e] line-clamp-2 leading-relaxed">
                      {shop.description}
                    </p>

                    <div className="flex items-center gap-1 text-xs text-[#9a9486] pt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                      <span className="truncate">{shop.area || shop.city || 'BTM Layout, Bengaluru'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-[#1c1f2e] mt-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1d2235] text-[#f5f2eb] hover:bg-[#252c44] border border-[#2b334d] text-xs font-semibold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Call</span>
                    </a>
                  </div>

                  <Link
                    to={`/shop/${shop.shopId}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#171a27] hover:bg-[#202436] text-xs font-medium text-[#d4af37] border border-[#2a2f44] transition-colors"
                  >
                    <span>View Shop & Catalog</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-widest">
              Live Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#f8f5ee] mt-1">
              Trending Products from Local Stores
            </h2>
            <p className="text-xs text-[#9a9486] mt-1">
              Click any item to inspect details or message the seller directly on WhatsApp
            </p>
          </div>
          <Link
            to="/collections"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4af37] hover:underline"
          >
            <span>Explore All {products.length} Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>

      {/* How It Works - 4 Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-widest">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#f8f5ee]">
            How the Marketplace Works
          </h2>
          <p className="text-xs sm:text-sm text-[#9a9486]">
            Connect directly with verified neighbourhood shops with zero platform commissions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Discover Local Shops',
              desc: 'Search by category, city, area or pincode to locate verified neighbourhood merchants.',
              icon: Store,
            },
            {
              step: '02',
              title: 'Browse Real Inventory',
              desc: 'Check live product catalogues, pricing tiers, specifications and discount offers.',
              icon: Search,
            },
            {
              step: '03',
              title: 'Direct WhatsApp & Call',
              desc: 'Chat directly with shop owners. Ask about custom sizes, real-time availability, and store hours.',
              icon: MessageCircle,
            },
            {
              step: '04',
              title: 'Pick Up or Delivery',
              desc: 'Visit in person for immediate trial or arrange direct fast delivery with your local shop.',
              icon: Sparkles,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#12141f] border border-[#23273a] relative overflow-hidden group hover:border-[#d4af37]/60 transition-all"
            >
              <span className="text-3xl font-mono font-extrabold text-[#22273c] absolute top-4 right-4 group-hover:text-[#d4af37]/20 transition-colors">
                {item.step}
              </span>
              <div className="w-12 h-12 rounded-xl bg-[#1c2033] border border-[#2d3450] flex items-center justify-center text-[#d4af37] mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#f8f5ee] mb-2">{item.title}</h3>
              <p className="text-xs text-[#9a9486] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Local Businesses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#131624] via-[#0f111c] to-[#181a29] border border-[#252a3f] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-widest">
                Community-Driven Commerce
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-bold text-[#f8f5ee] leading-tight">
                Why Support Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f4e6b5]">
                  Local Businesses?
                </span>
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: 'Keep Your Hard-Earned Money in the Local Community',
                    desc: 'Every purchase fuels local livelihood, job creation, and entrepreneurship in your city.'
                  },
                  {
                    title: 'Touch, Feel & Immediate Availability',
                    desc: 'No waiting 5-7 days for shipping. Walk into the store, check fit and quality, or pick up immediately.'
                  },
                  {
                    title: 'Direct Personal Relationship with Shop Owners',
                    desc: 'Enjoy authentic advice, trusted guarantees, and custom tailoring or sizing tailored to your needs.'
                  },
                  {
                    title: 'Zero Hidden Markups or Third-Party Cut',
                    desc: 'Big e-commerce portals take 20-30% commissions. Our zero-commission model keeps prices honest.'
                  }
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-[#d4af37]" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[#f5f2eb]">{point.title}</h4>
                      <p className="text-[11px] sm:text-xs text-[#9a9486] mt-0.5">{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Callout */}
            <div className="relative rounded-2xl overflow-hidden border border-[#2e344e] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80"
                alt="Local Boutique Experience"
                className="w-full h-80 object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-xs font-bold text-amber-400">4.9/5 from 2,800+ locals</span>
                </div>
                <p className="text-xs text-[#dcd7cb] italic">
                  "Finding the right wedding outfits and boutique silks was so easy. I WhatsApped the store owner, they reserved my sizes, and I tried them on that evening!"
                </p>
                <p className="text-[11px] font-semibold text-[#d4af37]">— Priya R., Indiranagar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Feedback Carousel/Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-widest">
            Verified Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#f8f5ee]">
            What Customers Are Saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-2xl bg-[#12141f] border border-[#23273a] flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating ? 'fill-current' : 'text-[#353a50]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#868074]">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-[#dcd7cb] leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1e2335] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#f8f5ee]">{review.customerName}</p>
                  <p className="text-[10px] text-[#9a9486]">Reviewed: {review.shopName}</p>
                </div>
                {review.verifiedPurchase && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vendor Onboarding CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1f1a14] via-[#2c2211] to-[#1a1c29] border border-[#d4af37]/50 p-8 sm:p-12 shadow-2xl">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" />
              Vendor Registration Open
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#f8f5ee] leading-tight">
              Own a Local Shop in Bengaluru? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59d33]">
                Showcase Your Store for Free
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#c7c0b0] leading-relaxed">
              Join dozens of local boutiques, grocery stores, jewelers, and tech shops. Get direct customer WhatsApp leads, an online catalogue, and zero middleman fees.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/vendor/register"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg flex items-center gap-2"
              >
                <Store className="w-4 h-4" />
                <span>Register Your Shop Now</span>
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 rounded-full bg-[#1b1e2c] border border-[#2e344e] text-[#f5f2eb] hover:border-[#d4af37] font-semibold text-xs uppercase tracking-wider transition-colors"
              >
                <span>Vendor Login</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
