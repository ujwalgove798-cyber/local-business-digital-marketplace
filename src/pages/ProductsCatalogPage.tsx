import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  ShoppingBag, 
  Store, 
  MapPin,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { ProductSize } from '../types';

const CATEGORIES = [
  'All Categories',
  "Men's Fashion",
  "Women's Fashion",
  "Kids' Fashion",
  'Accessories',
  'Footwear',
  'Shirts & Jeans',
  'Casual Wear',
  'Party Wear',
];

const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export const ProductsCatalogPage: React.FC = () => {
  const { products, shops } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [selectedShop, setSelectedShop] = useState(searchParams.get('shop') || 'All Shops');
  const [selectedSize, setSelectedSize] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Approved shops list
  const approvedShops = useMemo(() => {
    return shops.filter((s) => s.status === 'approved');
  }, [shops]);

  // Filtered products across marketplace
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.active) return false;

      // Category filter
      const matchesCategory = 
        selectedCategory === 'All Categories' || 
        p.category === selectedCategory;

      // Shop / Boutique filter
      const matchesShop = 
        selectedShop === 'All Shops' || 
        p.shopId === selectedShop;

      // Search term
      const matchesSearch = 
        !searchTerm.trim() ||
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.shopName && p.shopName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.city && p.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

      // Size filter
      const matchesSize = 
        selectedSize === 'All' || 
        p.sizes.includes(selectedSize as ProductSize);

      // Price filter
      const matchesPrice = p.price <= maxPrice;

      return matchesCategory && matchesShop && matchesSearch && matchesSize && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedShop, searchTerm, selectedSize, maxPrice, sortBy]);

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedShop('All Shops');
    setSelectedSize('All');
    setMaxPrice(12000);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f5f2eb] pb-24">
      {/* Editorial Header */}
      <section className="relative py-12 md:py-16 border-b border-[#1f2232] bg-gradient-to-b from-[#141624] to-[#0b0c10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1f2e] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bengaluru Multi-Vendor Catalog</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#fdfbf7]">
            Designer Apparel & Accessories
          </h1>
          <p className="mt-3 text-sm text-[#bfb8aa] max-w-2xl mx-auto">
            Shop directly from Bengaluru's leading fashion boutiques in BTM Layout, Indiranagar, Koramangala, and Jayanagar. Enjoy doorstep delivery or WhatsApp seller consultation.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-xl mx-auto relative">
            <Search className="w-4 h-4 text-[#8a8475] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, styles, or boutique names..."
              className="w-full pl-11 pr-4 py-3 bg-[#151726] border border-[#2d3248] rounded-full text-xs sm:text-sm text-[#f5f2eb] placeholder-[#807a6f] focus:outline-none focus:border-[#d4af37] transition-all shadow-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#9a9486] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area: Sidebar Filters + Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Mobile Filter Toggle & Sort Toolbar */}
        <div className="flex items-center justify-between pb-6 border-b border-[#1f2233] mb-8">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171a28] border border-[#2b2f42] text-xs font-semibold text-[#f5f2eb]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Filters & Categories</span>
          </button>

          <p className="text-xs text-[#9a9486] hidden sm:block">
            Showing <span className="text-[#f5f2eb] font-semibold">{filteredProducts.length}</span> luxury items across <span className="text-[#d4af37] font-semibold">{approvedShops.length}</span> boutiques
          </p>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9a9486] hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#e3ded4] focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-[#121422] border border-[#23273c] rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#212436] pb-4">
                <h3 className="font-heading text-sm font-bold text-[#fdfbf7] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#d4af37]" />
                  <span>Filter Collections</span>
                </h3>
                <button
                  onClick={resetAllFilters}
                  className="text-[11px] text-[#d4af37] hover:underline"
                >
                  Reset All
                </button>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold text-[#cfc7b8] uppercase tracking-wider mb-2.5">
                  Category
                </label>
                <div className="space-y-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold border border-[#d4af37]/40'
                          : 'text-[#bfb8aa] hover:bg-[#1a1c2b] hover:text-white'
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter by Boutique / Shop */}
              <div className="pt-4 border-t border-[#1f2233]">
                <label className="block text-xs font-bold text-[#cfc7b8] uppercase tracking-wider mb-2.5">
                  Fashion House / Boutique
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedShop('All Shops')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedShop === 'All Shops'
                        ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold border border-[#d4af37]/40'
                        : 'text-[#bfb8aa] hover:bg-[#1a1c2b] hover:text-white'
                    }`}
                  >
                    <span>All Bengaluru Shops</span>
                    {selectedShop === 'All Shops' && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                  </button>
                  {approvedShops.map((shop) => (
                    <button
                      key={shop.shopId}
                      onClick={() => setSelectedShop(shop.shopId)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        selectedShop === shop.shopId
                          ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold border border-[#d4af37]/40'
                          : 'text-[#bfb8aa] hover:bg-[#1a1c2b] hover:text-white'
                      }`}
                    >
                      <span className="truncate pr-2">{shop.shopName}</span>
                      {selectedShop === shop.shopId && <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="pt-4 border-t border-[#1f2233]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#cfc7b8] uppercase tracking-wider">
                    Max Price
                  </label>
                  <span className="text-xs font-bold text-[#d4af37]">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="12000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#d4af37] bg-[#1f2233] rounded-lg cursor-pointer h-1.5"
                />
                <div className="flex justify-between text-[10px] text-[#807a6f] mt-1">
                  <span>₹500</span>
                  <span>₹12,000</span>
                </div>
              </div>

              {/* Sizes */}
              <div className="pt-4 border-t border-[#1f2233]">
                <label className="block text-xs font-bold text-[#cfc7b8] uppercase tracking-wider mb-2.5">
                  Size
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedSize('All')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      selectedSize === 'All'
                        ? 'bg-[#d4af37] text-black font-bold'
                        : 'bg-[#1a1c2c] text-[#bfb8aa] border border-[#2b2f44] hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        selectedSize === size
                          ? 'bg-[#d4af37] text-black font-bold'
                          : 'bg-[#1a1c2c] text-[#bfb8aa] border border-[#2b2f44] hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#121422] border border-[#202336] rounded-2xl p-6">
                <ShoppingBag className="w-14 h-14 text-[#9a9486] mx-auto mb-4 opacity-40" />
                <h3 className="font-heading text-lg font-semibold text-[#f8f5ee]">
                  No products found
                </h3>
                <p className="text-xs text-[#9a9486] mt-1.5 max-w-md mx-auto">
                  We couldn't find any products matching your filters. Try clearing your search or expanding the price range.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#d4af37] text-black text-xs font-bold tracking-wider uppercase hover:bg-[#e6c24d] transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="bg-[#121422] w-full max-w-sm h-full overflow-y-auto p-6 space-y-6 border-l border-[#25283c]">
            <div className="flex items-center justify-between border-b border-[#212436] pb-4">
              <h3 className="font-heading text-base font-bold text-[#fdfbf7] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#d4af37]" />
                <span>Filters</span>
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-[#9a9486] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold text-[#cfc7b8] uppercase tracking-wider mb-2">
                Category
              </label>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                      selectedCategory === cat
                        ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold border border-[#d4af37]/40'
                        : 'text-[#bfb8aa]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Boutiques */}
            <div className="pt-4 border-t border-[#1f2233]">
              <label className="block text-xs font-bold text-[#cfc7b8] uppercase tracking-wider mb-2">
                Boutique / Shop
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedShop('All Shops')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                    selectedShop === 'All Shops'
                      ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold border border-[#d4af37]/40'
                      : 'text-[#bfb8aa]'
                  }`}
                >
                  All Bengaluru Shops
                </button>
                {approvedShops.map((s) => (
                  <button
                    key={s.shopId}
                    onClick={() => setSelectedShop(s.shopId)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                      selectedShop === s.shopId
                        ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold border border-[#d4af37]/40'
                        : 'text-[#bfb8aa]'
                    }`}
                  >
                    {s.shopName}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#1f2233] flex gap-3">
              <button
                onClick={resetAllFilters}
                className="flex-1 py-2.5 rounded-xl bg-[#1b1e30] text-xs font-semibold text-[#9a9486]"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
