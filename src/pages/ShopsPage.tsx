import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Store, 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  MessageCircle, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const CATEGORIES = [
  'All Categories',
  'Fashion & Apparel',
  'Groceries & Daily Essentials',
  'Electronics & Gadgets',
  'Bakery & Sweets',
  'Jewelry & Ornaments',
  'Home & Living',
  "Men's Fashion",
  "Women's Fashion",
  "Kids' Fashion",
];

const LOCATIONS = [
  'All Bengaluru',
  'BTM Layout',
  'Indiranagar',
  'Koramangala',
  'Jayanagar',
  'MG Road',
  'HSR Layout',
];

export const ShopsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { shops, products, selectedLocation: storeLocation } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      const match = CATEGORIES.find(c => c.toLowerCase().includes(catParam.toLowerCase()));
      return match || 'All Categories';
    }
    return 'All Categories';
  });
  const [selectedLocation, setSelectedLocation] = useState(storeLocation || 'All Bengaluru');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');

  useEffect(() => {
    if (storeLocation) {
      setSelectedLocation(storeLocation);
    }
  }, [storeLocation]);

  // Filter approved shops only for public marketplace
  const filteredShops = useMemo(() => {
    return shops
      .filter((shop) => shop.status === 'approved')
      .filter((shop) => {
        const matchesSearch = 
          shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shop.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = 
          selectedCategory === 'All Categories' || 
          shop.category.toLowerCase().includes(selectedCategory.toLowerCase());

        const matchesLocation = 
          selectedLocation === 'All Bengaluru' || 
          shop.city.toLowerCase().includes(selectedLocation.toLowerCase());

        return matchesSearch && matchesCategory && matchesLocation;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
        return a.shopName.localeCompare(b.shopName);
      });
  }, [shops, searchQuery, selectedCategory, selectedLocation, sortBy]);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f5f2eb] pb-24">
      {/* Editorial Header Banner */}
      <section className="relative py-16 md:py-24 border-b border-[#1f2230] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#161825] via-[#0d0e15] to-[#0b0c10] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#d4af37]/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1f2e] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FashTag Multi-Vendor Directory</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#fdfbf7] max-w-3xl mx-auto">
            Verified Fashion Boutiques & Studios in Bengaluru
          </h1>

          <p className="mt-4 text-[#bfb8aa] max-w-2xl mx-auto text-sm sm:text-base font-sans-body">
            Explore curated physical fashion stores, bespoke tailors, western clothing boutiques, and artisan ateliers across Bengaluru. Connect directly via WhatsApp or book in-store fitting visits.
          </p>

          {/* Quick search bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-[#9a9486] absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shops by name, category, or Bengaluru locality (e.g. BTM, Indiranagar, Denim)..."
                className="w-full pl-12 pr-4 py-3.5 bg-[#141622] border border-[#2b2f42] rounded-full text-sm text-[#f5f2eb] placeholder-[#807a6f] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all shadow-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs text-[#9a9486] hover:text-[#d4af37]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Control Toolbar */}
      <section className="sticky top-[72px] z-30 bg-[#0d0f17]/95 backdrop-blur-md border-b border-[#212434] py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-semibold shadow-md'
                      : 'bg-[#151724] text-[#cfc7b8] border border-[#262a3c] hover:border-[#d4af37]/50 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Location & Sort Dropdowns */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[#151724] border border-[#262a3c] rounded-lg px-3 py-1.5 text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent text-[#e3ded4] focus:outline-none cursor-pointer"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-[#151724] text-white">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-[#151724] border border-[#262a3c] rounded-lg px-3 py-1.5 text-xs">
                <Filter className="w-3.5 h-3.5 text-[#d4af37]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-[#e3ded4] focus:outline-none cursor-pointer"
                >
                  <option value="rating" className="bg-[#151724] text-white">Top Rated</option>
                  <option value="reviews" className="bg-[#151724] text-white">Most Reviews</option>
                  <option value="name" className="bg-[#151724] text-white">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shops Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-heading font-semibold text-[#f8f5ee]">
              {selectedCategory === 'All Categories' ? 'All Verified Boutiques' : selectedCategory}
            </h2>
            <p className="text-xs text-[#9a9486] mt-0.5">
              Showing {filteredShops.length} approved {filteredShops.length === 1 ? 'store' : 'stores'} in {selectedLocation}
            </p>
          </div>

          <Link
            to="/vendor/register"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1c29] border border-[#d4af37]/50 text-xs font-semibold text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all"
          >
            <Store className="w-4 h-4" />
            <span>List Your Shop Here</span>
          </Link>
        </div>

        {filteredShops.length === 0 ? (
          <div className="text-center py-20 px-4 bg-[#121420] border border-[#202336] rounded-2xl">
            <Store className="w-12 h-12 text-[#9a9486] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-[#f8f5ee]">No fashion shops match your criteria</h3>
            <p className="text-sm text-[#9a9486] mt-2 max-w-md mx-auto">
              Try clearing your search query or choosing "All Bengaluru" to explore all verified fashion stores.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
                setSelectedLocation('All Bengaluru');
              }}
              className="mt-5 px-5 py-2.5 rounded-full bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#e6c24d] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShops.map((shop) => {
              const shopProducts = products.filter((p) => p.shopId === shop.shopId);
              const cleanWhatsApp = (shop.whatsappNumber || shop.whatsapp || shop.phone || '919739841266').replace(/\D/g, '');
              const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                `Hello ${shop.shopName}, I found your storefront on the Local Business Digital Marketplace. I would like to inquire about your products and store availability.`
              )}`;

              return (
                <div
                  key={shop.shopId}
                  className="group relative bg-[#131522] border border-[#23273a] hover:border-[#d4af37]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col"
                >
                  {/* Shop Cover Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#1a1c2b]">
                    <img
                      src={shop.coverImageUrl}
                      alt={shop.shopName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131522] via-black/40 to-transparent" />

                    {/* Category pill */}
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-semibold text-[#d4af37] border border-[#d4af37]/30">
                      {shop.category}
                    </span>

                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-xs font-bold text-amber-300 border border-amber-400/30">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      <span>{shop.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-gray-400">({shop.reviewCount})</span>
                    </div>

                    {/* Shop Logo Avatar overlapping bottom */}
                    <div className="absolute -bottom-5 left-5 w-14 h-14 rounded-xl border-2 border-[#d4af37] overflow-hidden bg-[#1c1f2e] shadow-lg">
                      <img
                        src={shop.logoUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Shop Body Info */}
                  <div className="pt-8 p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/shops/${shop.shopId}`}
                          className="font-heading text-lg font-bold text-[#f8f5ee] group-hover:text-[#d4af37] transition-colors"
                        >
                          {shop.shopName}
                        </Link>
                        {shop.verified && (
                          <span title="Verified Fashion House" className="inline-flex items-center">
                            <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#9a9486] mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{shop.city}</span>
                      </div>

                      <p className="mt-3 text-xs text-[#bfb8aa] line-clamp-2 leading-relaxed">
                        {shop.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-[#1f2233] space-y-1.5 text-[11px] text-[#9a9486]">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>{shop.openingHours}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>{shopProducts.length} Exclusive Collection Items Listed</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: View Store & WhatsApp Seller */}
                    <div className="mt-6 pt-4 border-t border-[#1f2233] grid grid-cols-2 gap-3">
                      <Link
                        to={`/shops/${shop.shopId}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#1c1f30] hover:bg-[#252a42] text-xs font-semibold text-[#f5f2eb] hover:text-[#d4af37] border border-[#2d3248] transition-all"
                      >
                        <span>View Store</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Become a Vendor Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#171926] via-[#1b1e30] to-[#121422] border border-[#d4af37]/40 p-8 sm:p-12 shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#d4af37]/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-xs font-bold tracking-wider uppercase mb-3">
              Marketplace Seller Program
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#fdfbf7]">
              Own a Fashion Store or Boutique in Bengaluru?
            </h2>
            <p className="mt-3 text-sm text-[#c7bfb0] leading-relaxed">
              Showcase your menswear, western collections, bespoke tailoring, or kidswear to thousands of local shoppers. Receive direct WhatsApp enquiries and physical store appointment bookings with zero listing friction.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                to="/vendor/register"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c567] to-[#ba932a] text-black text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-xl transition-all"
              >
                Apply as a Verified Shop Owner
              </Link>
              <Link
                to="/contact"
                className="px-5 py-3 rounded-full bg-[#1e2133] hover:bg-[#282c44] text-[#cfc7b8] hover:text-white text-xs font-semibold tracking-wider transition-all"
              >
                Learn How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
