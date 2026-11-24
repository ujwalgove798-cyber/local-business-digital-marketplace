import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Product, ProductSize } from '../types';
import { 
  Sparkles, 
  Calendar, 
  Search, 
  Filter, 
  ArrowRight, 
  Check, 
  ShoppingBag, 
  Heart, 
  SlidersHorizontal, 
  X, 
  Star, 
  Zap,
  RotateCcw,
  IndianRupee,
  Layers,
  CheckCircle2,
  Tag,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export type PrimaryCategory = 'All' | 'Men' | 'Women' | 'Kids';

interface PriceTier {
  id: string;
  label: string;
  shortLabel: string;
  min: number;
  max: number;
  badge?: string;
}

const PRICE_TIERS: PriceTier[] = [
  { id: 'all', label: 'All Budgets', shortLabel: 'All', min: 0, max: 100000 },
  { id: '199-999', label: '₹199 - ₹999 (Everyday Essentials)', shortLabel: '₹199 - ₹999', min: 199, max: 999, badge: 'Essentials' },
  { id: '1k-3k', label: '₹1,000 - ₹2,999 (Streetwear & Casuals)', shortLabel: '₹1k - ₹3k', min: 1000, max: 2999, badge: 'Streetwear' },
  { id: '3k-6k', label: '₹3,000 - ₹5,999 (Contemporary & Partywear)', shortLabel: '₹3k - ₹6k', min: 3000, max: 5999, badge: 'Partywear' },
  { id: '6k-10k', label: '₹6,000 - ₹9,999 (Designer & Festive)', shortLabel: '₹6k - ₹10k', min: 6000, max: 9999, badge: 'Designer' },
  { id: '10k-plus', label: '₹10,000 & Above (Luxury / Premium Tier)', shortLabel: '₹10k+', min: 10000, max: 100000, badge: 'Luxury Tier' },
];

const SUB_CATEGORIES_MAP: Record<PrimaryCategory, string[]> = {
  All: [
    'All Categories',
    'Casual Wear',
    'Formal Wear',
    'Ethnic Wear',
    'Streetwear',
    'Party Wear',
    'Activewear',
    'Footwear',
    'Accessories'
  ],
  Men: [
    'All Men',
    'Casual Wear',
    'Formal Wear',
    'Ethnic Wear',
    'Streetwear',
    'Party Wear',
    'Shirts & Jeans',
    'Footwear',
    'Accessories'
  ],
  Women: [
    'All Women',
    'Ethnic Wear',
    'Western Wear',
    'Dresses & Gowns',
    'Party Wear',
    'Activewear',
    'Accessories'
  ],
  Kids: [
    'All Kids',
    'Festive Sets',
    'Casual Wear',
    'Boys Wear',
    'Girls Dresses',
    'Infants & Rompers'
  ],
};

const ALL_SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export const CollectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { products, addToCart, toggleWishlist, isInWishlist, addToast } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const catQuery = searchParams.get('cat');
  const searchQueryParam = searchParams.get('search') || searchParams.get('q') || '';

  // 1. Primary Category State ([All] | [Men] | [Women] | [Kids])
  const [primaryCategory, setPrimaryCategory] = useState<PrimaryCategory>(() => {
    if (catQuery === "Men's Fashion" || catQuery === 'Men') return 'Men';
    if (catQuery === "Women's Fashion" || catQuery === 'Women') return 'Women';
    if (catQuery === "Kids' Fashion" || catQuery === 'Kids') return 'Kids';
    return 'All';
  });

  // 2. Secondary Sub-Category State
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All Categories');

  // 3. Search Term State
  const [searchTerm, setSearchTerm] = useState(searchQueryParam);

  // 4. Multi-Select Size State Matrix ([XS], [S], [M], [L], [XL], [XXL], [Free Size])
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);

  // 5. Price Range State (Sequential Tiers + Custom Slider)
  const [selectedPriceTierId, setSelectedPriceTierId] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(25000);

  // 6. Sorting & View Controls
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Per-card quick size selection memory: { [productId]: ProductSize }
  const [cardSelectedSizes, setCardSelectedSizes] = useState<Record<string, ProductSize>>({});

  // Sync URL search param
  useEffect(() => {
    if (searchQueryParam) {
      setSearchTerm(searchQueryParam);
    }
  }, [searchQueryParam]);

  // When primary category changes, update URL and reset subcategory
  const handlePrimaryCategoryChange = (cat: PrimaryCategory) => {
    setPrimaryCategory(cat);
    const defaultSub = cat === 'All' ? 'All Categories' : `All ${cat}`;
    setSelectedSubCategory(defaultSub);

    if (cat === 'All') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', cat);
    }
    setSearchParams(searchParams);
  };

  // Toggle size in multi-select matrix
  const handleToggleSize = (size: ProductSize) => {
    setSelectedSizes((prev) => 
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Handle Price Tier Selection
  const handleSelectPriceTier = (tier: PriceTier) => {
    setSelectedPriceTierId(tier.id);
    setMinPrice(tier.min);
    setMaxPrice(tier.max);
  };

  // Handle custom slider adjustments
  const handleCustomPriceChange = (newMax: number) => {
    setMaxPrice(newMax);
    // Check if it matches an existing tier, else set to custom
    const match = PRICE_TIERS.find((t) => t.id !== 'all' && t.max === newMax && t.min === minPrice);
    setSelectedPriceTierId(match ? match.id : 'custom');
  };

  // Clear all filters shortcut
  const handleResetFilters = () => {
    setPrimaryCategory('All');
    setSelectedSubCategory('All Categories');
    setSelectedSizes([]);
    setSelectedPriceTierId('all');
    setMinPrice(0);
    setMaxPrice(25000);
    setSearchTerm('');
    searchParams.delete('cat');
    searchParams.delete('q');
    setSearchParams(searchParams);
    addToast('All filters have been reset', 'info');
  };

  // Helper to strictly infer product demographic
  const getProductGender = (p: Product): PrimaryCategory => {
    if (p.gender) {
      const g = p.gender.trim().toLowerCase();
      if (g === 'men') return 'Men';
      if (g === 'women') return 'Women';
      if (g === 'kids') return 'Kids';
    }
    const cat = p.category.toLowerCase();
    if (cat.includes('men') && !cat.includes('women')) return 'Men';
    if (cat.includes('women')) return 'Women';
    if (cat.includes('kid')) return 'Kids';
    if (p.tags?.some(t => {
      const tl = t.toLowerCase();
      return tl === 'women' || tl === "women's" || tl === 'dress' || tl === 'saree' || tl === 'corset' || tl === 'skirt';
    })) return 'Women';
    if (p.tags?.some(t => {
      const tl = t.toLowerCase();
      return tl === 'men' || tl === "men's" || tl === 'blazer' || tl === 'suit' || tl === 'sherwani' || tl === 'cufflinks';
    })) return 'Men';
    if (p.tags?.some(t => {
      const tl = t.toLowerCase();
      return tl === 'kids' || tl === "kids'" || tl === 'baby';
    })) return 'Kids';
    return 'All';
  };

  // Live demographic inventory count
  const demographicCounts = useMemo(() => {
    const counts = { All: 0, Men: 0, Women: 0, Kids: 0 };
    products.forEach((p) => {
      if (!p.active) return;
      counts.All++;
      const g = getProductGender(p);
      if (g === 'Men') counts.Men++;
      else if (g === 'Women') counts.Women++;
      else if (g === 'Kids') counts.Kids++;
    });
    return counts;
  }, [products]);

  // Filter & Sort Logic - STRICT DEMOGRAPHIC ISOLATION (Zero Leakage)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.active) return false;

      // 1. Strict Primary Demographic Filter:
      // ZERO cross-category leaks. When user selects "Women", only items with getProductGender(p) === 'Women' pass.
      // Men's suits, Cuban shirts, Cargo pants, Hoodies are 100% prevented from appearing in Women's section.
      if (primaryCategory !== 'All') {
        const pGender = getProductGender(p);
        if (pGender !== primaryCategory) {
          return false;
        }
      }

      // 2. Sub-Category Filter (Applied within strictly isolated demographic)
      if (
        selectedSubCategory !== 'All Categories' && 
        selectedSubCategory !== 'All Men' && 
        selectedSubCategory !== 'All Women' && 
        selectedSubCategory !== 'All Kids'
      ) {
        const subLower = selectedSubCategory.toLowerCase();
        const matchesSub = 
          (p.subCategory && p.subCategory.toLowerCase().includes(subLower)) ||
          p.category.toLowerCase().includes(subLower) ||
          p.tags?.some((t) => t.toLowerCase().includes(subLower));

        if (!matchesSub) return false;
      }

      // 3. Size Matrix Filter (Multi-Select: item matches if it has ANY of the selected sizes)
      if (selectedSizes.length > 0) {
        const hasMatchingSize = selectedSizes.some((s) => p.sizes.includes(s));
        if (!hasMatchingSize) return false;
      }

      // 4. Price Tier / Slider Filter (Applied strictly after demographic isolation)
      if (p.price < minPrice || p.price > maxPrice) {
        return false;
      }

      // 5. Search Filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          p.productName.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          (p.fabric && p.fabric.toLowerCase().includes(term)) ||
          p.tags?.some((t) => t.toLowerCase().includes(term));

        if (!matchesSearch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return b.productId.localeCompare(a.productId);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, primaryCategory, selectedSubCategory, selectedSizes, minPrice, maxPrice, searchTerm, sortBy]);

  // Card Quick Actions
  const handleSelectCardSize = (productId: string, size: ProductSize) => {
    setCardSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleQuickAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const size = cardSelectedSizes[product.productId] || product.sizes[0] || 'M';
    const color = product.colors[0]?.name || 'Standard';
    addToCart(product, size, color, 1);
  };

  const handleQuickBuyNow = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const size = cardSelectedSizes[product.productId] || product.sizes[0] || 'M';
    const color = product.colors[0]?.name || 'Standard';
    addToCart(product, size, color, 1);
    navigate('/checkout');
  };

  // Count active filters
  const activeFiltersCount = 
    (primaryCategory !== 'All' ? 1 : 0) +
    (!selectedSubCategory.startsWith('All') ? 1 : 0) +
    selectedSizes.length +
    (selectedPriceTierId !== 'all' || maxPrice < 25000 || minPrice > 0 ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Editorial Store Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-[#12141f] via-[#161828] to-[#0d0e15] border border-[#262a3d] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e2236] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fashtag Premium Fashion Store</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-wide text-white leading-tight">
            Curated Trendy Outfits
          </h1>
          <p className="text-xs sm:text-sm text-[#d4af37] font-serif-luxury tracking-widest uppercase font-semibold">
            Curated Trendy Outfits for Men, Women & Kids
          </p>
          <p className="text-xs sm:text-sm text-[#b2a999] leading-relaxed max-w-2xl">
            A sequential, friction-free buyer journey. Filter by audience, target your exact price tier from ₹199 to luxury couture, and select your fit effortlessly.
          </p>
        </div>
      </div>

      {/* Step 1 (Primary Audience Switcher): [All Collections] | [Men's Trends] | [Women's Edit] | [Kids' Styles] */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d4af37] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Step 1: Primary Audience Switcher</span>
          </span>
          <span className="text-xs text-[#8e8778]">
            Showing {filteredProducts.length} of {products.length} outfits
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'All', title: 'All Collections', count: demographicCounts.All, sub: 'Full Trendy Inventory' },
            { id: 'Men', title: "Men's Trends", count: demographicCounts.Men, sub: 'Hoodies, Cargos, Blazers' },
            { id: 'Women', title: "Women's Edit", count: demographicCounts.Women, sub: 'Corset Dresses, Co-ords, Silks' },
            { id: 'Kids', title: "Kids' Styles", count: demographicCounts.Kids, sub: 'Playwear Overalls, Kurta Sets' },
          ].map((item) => {
            const isSelected = primaryCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handlePrimaryCategoryChange(item.id as PrimaryCategory)}
                className={`group relative p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#222538] to-[#151724] border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.25)] text-white'
                    : 'bg-[#12141e] border-[#222536] text-[#b5ada0] hover:border-[#d4af37]/50 hover:text-white hover:bg-[#181a28]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-base sm:text-lg tracking-wider">
                    {item.title}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-[#d4af37] text-black' : 'bg-[#1e2130] text-[#a19989]'
                  }`}>
                    {item.count}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]" />
                  )}
                </div>
                <span className="text-[10px] tracking-wider uppercase font-medium text-[#8e8778]">
                  {item.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Hierarchical Dynamic Sub-Filters */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#10121c] border border-[#202334] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#d4af37] flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            <span>2. Sub-Category for {primaryCategory === 'All' ? 'All Collections' : primaryCategory}:</span>
          </span>
          <span className="text-[11px] text-[#8e8778]">
            {SUB_CATEGORIES_MAP[primaryCategory].length} Styles Available
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SUB_CATEGORIES_MAP[primaryCategory].map((sub) => {
            const isSelected = selectedSubCategory === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#d4af37] via-[#e5c567] to-[#ba932a] text-black shadow-md shadow-[#d4af37]/25 font-bold scale-[1.03]'
                    : 'bg-[#161826] text-[#cfc7b8] hover:text-white hover:bg-[#202336] border border-[#262a3d]'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sequential Steps 2 & 3: Price Tier Filter & Granular Size Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start" id="price-tiers">
        {/* Step 2: Price Tier Filter (Sequenced from Budget to Luxury) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#12141f] border border-[#232738] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#d4af37] block">
                Step 2: Price Tier Filter (Budget to Luxury)
              </span>
              <p className="text-xs text-[#9a9284]">
                Target your exact price bracket
              </p>
            </div>

            <span className="font-heading font-bold text-sm text-[#d4af37]">
              ₹{minPrice.toLocaleString('en-IN')} – ₹{maxPrice >= 100000 ? '1,00,000+' : maxPrice.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Sequential Tier Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {PRICE_TIERS.map((tier) => {
              const isSelected = selectedPriceTierId === tier.id;
              return (
                <button
                  key={tier.id}
                  onClick={() => handleSelectPriceTier(tier)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1f2438] border-2 border-[#d4af37] text-[#d4af37] shadow-md shadow-[#d4af37]/20 font-bold'
                      : 'bg-[#181a28] border border-[#2b2f42] text-[#cfc7b8] hover:border-[#d4af37]/40 hover:text-white'
                  }`}
                >
                  <span>{tier.label}</span>
                  {tier.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#d4af37]/20 text-[#d4af37] font-bold uppercase">
                      {tier.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Real-time Interactive Slider */}
          <div className="space-y-2 pt-1 border-t border-[#202334]">
            <div className="flex items-center justify-between text-[11px] text-[#8e8778]">
              <span>Real-Time Interactive Price Slider:</span>
              <span className="font-bold text-white">Up to ₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={999}
              max={25000}
              step={500}
              value={Math.min(25000, maxPrice)}
              onChange={(e) => handleCustomPriceChange(Number(e.target.value))}
              className="w-full accent-[#d4af37] h-2 bg-[#222638] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#736c5f]">
              <span>₹199</span>
              <span>₹3,000</span>
              <span>₹6,000</span>
              <span>₹10,000</span>
              <span>₹25,000+</span>
            </div>
          </div>
        </div>

        {/* Step 3: Granular Size Selector */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#12141f] border border-[#232738] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#d4af37] block">
                Step 3: Granular Size Selector
              </span>
              <p className="text-xs text-[#9a9284]">
                Multi-select pills: XS, S, M, L, XL, XXL
              </p>
            </div>

            {selectedSizes.length > 0 && (
              <button
                onClick={() => setSelectedSizes([])}
                className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Clear Sizes ({selectedSizes.length})</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {ALL_SIZES.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => handleToggleSize(size)}
                  className={`min-w-[48px] h-11 px-3.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/30 border-2 border-[#d4af37] scale-105'
                      : 'bg-[#181a28] border border-[#2c3044] text-[#cfc7b8] hover:border-[#d4af37]/50 hover:text-white'
                  }`}
                >
                  <span>{size}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              );
            })}
          </div>

          <p className="text-[10px] text-[#7d7566]">
            {selectedSizes.length === 0
              ? 'Showing garments across all sizes.'
              : `Active Size Multi-Select: ${selectedSizes.join(', ')}`}
          </p>
        </div>
      </div>


      {/* SECTION 5: Controls Bar (Search + Sort + Active Filter Pills) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#12141f] border border-[#232738] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Interactive Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e8778]" />
            <input
              type="text"
              placeholder={t('common.search', 'Search fashion, shirts, kurtas, suits, sarees...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#181a28] border border-[#2c3044] rounded-full pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#6f6759] focus:outline-none focus:border-[#d4af37] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8e8778] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Controls & Counter */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs text-[#8e8778] hidden sm:inline">
              <strong>{filteredProducts.length}</strong> items found
            </span>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#8e8778]">{t('common.sortBy', 'Sort')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#181a28] border border-[#2c3044] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Badges Row */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#202334] text-xs">
            <span className="text-[10px] uppercase font-bold text-[#8e8778]">Active Filters:</span>

            {primaryCategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1e2236] border border-[#d4af37]/50 text-[#d4af37] text-[11px] font-semibold">
                <span>Gender: {primaryCategory}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => handlePrimaryCategoryChange('All')} />
              </span>
            )}

            {!selectedSubCategory.startsWith('All') && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1e2236] border border-[#d4af37]/50 text-[#d4af37] text-[11px] font-semibold">
                <span>Sub: {selectedSubCategory}</span>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-white" 
                  onClick={() => setSelectedSubCategory(primaryCategory === 'All' ? 'All Categories' : `All ${primaryCategory}`)} 
                />
              </span>
            )}

            {selectedSizes.map((size) => (
              <span key={size} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#222538] border border-[#32374e] text-white text-[11px]">
                <span>Size: {size}</span>
                <X className="w-3 h-3 cursor-pointer text-[#8e8778] hover:text-white" onClick={() => handleToggleSize(size)} />
              </span>
            ))}

            {(selectedPriceTierId !== 'all' || maxPrice < 25000 || minPrice > 0) && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1e2236] border border-[#d4af37]/50 text-[#d4af37] text-[11px] font-semibold">
                <span>Price: ₹{minPrice} - ₹{maxPrice >= 100000 ? '1L+' : maxPrice}</span>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-white" 
                  onClick={() => {
                    setSelectedPriceTierId('all');
                    setMinPrice(0);
                    setMaxPrice(25000);
                  }} 
                />
              </span>
            )}

            {searchTerm.trim() && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1e2236] border border-[#d4af37]/50 text-[#d4af37] text-[11px] font-semibold">
                <span>Query: "{searchTerm}"</span>
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSearchTerm('')} />
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="ml-auto text-xs text-rose-400 hover:underline font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION 6: Interactive Product Grid & High-Fashion Cards */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[#12141f] border border-[#232738] p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#1b1e2c] border border-[#2f354a] text-[#d4af37] flex items-center justify-center mx-auto shadow-xl">
            <Search className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-white">
            No matching garments found
          </h3>
          <p className="text-xs sm:text-sm text-[#9e9686] max-w-md mx-auto">
            Try loosening your price tier, unchecking specific size filters, or clearing your search term to see more curations.
          </p>
          <div className="pt-2">
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e5c567] transition-all shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isWishlisted = isInWishlist(product.productId);
            const isOutOfStock = product.stock <= 0;
            const currentSelectedSize = cardSelectedSizes[product.productId] || product.sizes[0] || 'M';
            const discountPercent = product.originalPrice 
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : null;
            const isLuxury = product.price >= 10000;

            return (
              <div
                key={product.productId}
                className="group rounded-3xl bg-[#11131e] border border-[#222538] hover:border-[#d4af37]/60 shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Product Image Stage */}
                <div className="relative aspect-[4/5] bg-black overflow-hidden">
                  <Link to={`/product/${product.productId}`}>
                    <img
                      src={product.imageUrl}
                      alt={product.productName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>

                  {/* Gradient bottom shadow */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#11131e] to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                    {discountPercent && (
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-700/80 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider shadow-lg">
                        {discountPercent}% OFF
                      </span>
                    )}
                    {isLuxury && (
                      <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black text-[10px] font-black uppercase tracking-wider shadow-lg">
                        Luxury Tier
                      </span>
                    )}
                    {product.featured && !isLuxury && (
                      <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-[#d4af37]/50 text-[#d4af37] text-[10px] font-bold">
                        BTM Curated
                      </span>
                    )}
                  </div>

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.productId);
                    }}
                    className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
                      isWishlisted
                        ? 'bg-rose-500 text-white shadow-lg'
                        : 'bg-black/60 text-[#cfc7b8] hover:text-white hover:bg-black/90'
                    }`}
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>

                  {/* Stock Status Notice */}
                  {isOutOfStock ? (
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center pointer-events-none z-10">
                      <span className="px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider">
                        Out of Stock
                      </span>
                    </div>
                  ) : product.stock <= 4 ? (
                    <div className="absolute bottom-3 left-3 bg-amber-500/90 text-black px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider z-10">
                      Only {product.stock} Left in BTM Store
                    </div>
                  ) : null}
                </div>

                {/* Card Content & Metadata */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="uppercase font-bold tracking-wider text-[#d4af37] truncate max-w-[70%]">
                        {product.subCategory || product.category}
                      </span>
                      {product.rating && (
                        <div className="flex items-center gap-1 text-[#d4af37] font-semibold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{product.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Product Name */}
                    <Link to={`/product/${product.productId}`}>
                      <h3 className="font-heading font-bold text-white text-base hover:text-[#d4af37] transition-colors line-clamp-1 leading-snug">
                        {product.productName}
                      </h3>
                    </Link>

                    {/* Short Description */}
                    <p className="text-xs text-[#9d9585] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Interactive Size Selection Matrix Pill on Card */}
                    <div className="pt-1 space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#8e8778] block">
                        Select Size: <strong className="text-white">{currentSelectedSize}</strong>
                      </span>
                      <div className="flex flex-wrap items-center gap-1">
                        {product.sizes.map((sz) => {
                          const isCardSizeSelected = currentSelectedSize === sz;
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSelectCardSize(product.productId, sz);
                              }}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                                isCardSizeSelected
                                  ? 'bg-[#d4af37] text-black shadow-sm'
                                  : 'bg-[#181a28] border border-[#282c3e] text-[#cfc7b8] hover:border-[#d4af37]/40 hover:text-white'
                              }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Call to Actions */}
                  <div className="space-y-3 pt-2 border-t border-[#1d2030]">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-xl font-black text-white">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-[#787163] line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        In Stock
                      </span>
                    </div>

                    {/* Action Buttons: Add to Cart & Buy Now */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => handleQuickAddToCart(e, product)}
                        disabled={isOutOfStock}
                        className="py-2.5 px-3 rounded-xl bg-[#1a1d2c] border border-[#2e344a] text-white text-xs font-semibold hover:border-[#d4af37] hover:text-[#d4af37] transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                        title="Add to shopping cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        onClick={(e) => handleQuickBuyNow(e, product)}
                        disabled={isOutOfStock}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c567] to-[#ba932a] text-black text-xs font-bold hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-1 disabled:opacity-40"
                        title="Instant Buy Now with selected size"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Buy Now</span>
                      </button>
                    </div>

                    {/* Try in BTM Flagship Store / Book Appointment Option */}
                    <div className="text-center pt-0.5">
                      <Link
                        to={`/book?category=${encodeURIComponent(product.category)}`}
                        className="text-[10px] text-[#8e8778] hover:text-[#d4af37] inline-flex items-center gap-1 transition-colors"
                      >
                        <Calendar className="w-3 h-3 text-[#d4af37]" />
                        <span>Try in Store? Book Consultation</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Trust & Guarantee Banner */}
      <div className="rounded-3xl p-8 bg-[#11131e] border border-[#222538] grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-white text-sm">Authentic Designer Silks</h4>
            <p className="text-xs text-[#8e8778]">Handloom certified Bangalore silks & imported linen fabrics.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-white text-sm">Safe & Secure Indian Payments</h4>
            <p className="text-xs text-[#8e8778]">UPI QR Codes, RuPay, Visa, Mastercard & COD supported.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-white text-sm">In-Store VIP Trial Available</h4>
            <p className="text-xs text-[#8e8778]">Book a fitting session at our BTM 1st Stage flagship store.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
