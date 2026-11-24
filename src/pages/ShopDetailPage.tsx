import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Store, 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  MessageCircle, 
  Search, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Send,
  BadgePercent,
  MessageSquarePlus,
  ThumbsUp
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';

export const ShopDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getShopById, products, submitEnquiry, offers, reviews, addReview, userProfile } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // In-store enquiry modal state
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    message: '',
  });
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);

  // Review submission state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    customerName: userProfile?.fullName || userProfile?.name || '',
    comment: '',
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const shop = useMemo(() => {
    return getShopById(id || '');
  }, [id, getShopById]);

  // Shop's specific products
  const shopProducts = useMemo(() => {
    if (!shop) return [];
    return products.filter((p) => p.shopId === shop.shopId);
  }, [shop, products]);

  // Filtered products within this shop
  const filteredProducts = useMemo(() => {
    return shopProducts.filter((product) => {
      const matchesSearch = 
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tags && product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCat = 
        selectedCategory === 'All' || 
        product.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [shopProducts, searchQuery, selectedCategory]);

  const shopCategories = useMemo(() => {
    const set = new Set<string>();
    shopProducts.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [shopProducts]);

  // Shop specific offers
  const shopOffers = useMemo(() => {
    if (!shop) return [];
    return offers.filter((o) => (o.shopId === shop.shopId || !o.shopId) && o.isActive !== false);
  }, [shop, offers]);

  // Shop specific reviews
  const shopReviews = useMemo(() => {
    if (!shop) return [];
    return reviews.filter((r) => r.shopId === shop.shopId && r.status === 'approved');
  }, [shop, reviews]);

  if (!shop) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-[#0b0c10] text-[#f5f2eb]">
        <Store className="w-16 h-16 text-[#9a9486] mb-4 opacity-50" />
        <h2 className="text-2xl font-heading font-bold text-[#f8f5ee]">Shop Not Found</h2>
        <p className="text-sm text-[#9a9486] mt-2 max-w-md text-center">
          The requested store could not be found or may currently be pending admin verification.
        </p>
        <Link
          to="/shops"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#d4af37] text-black font-semibold text-xs tracking-wider uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace Shops</span>
        </Link>
      </div>
    );
  }

  const cleanWhatsApp = (shop.whatsappNumber || '919739841266').replace(/\D/g, '');
  const generalWhatsAppUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    `Hello ${shop.shopName}, I found your storefront on the Local Business Digital Marketplace. I would like to inquire about your products and store availability.`
  )}`;

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.customerName.trim() || !enquiryForm.customerPhone.trim() || !enquiryForm.message.trim()) {
      return;
    }
    setIsSubmittingEnquiry(true);
    await submitEnquiry({
      shopId: shop.shopId,
      shopName: shop.shopName,
      customerName: enquiryForm.customerName.trim(),
      customerPhone: enquiryForm.customerPhone.trim(),
      customerEmail: enquiryForm.customerEmail.trim(),
      message: enquiryForm.message.trim(),
      channel: 'website_form',
    });
    setIsSubmittingEnquiry(false);
    setIsEnquiryModalOpen(false);
    setEnquiryForm({ customerName: '', customerPhone: '', customerEmail: '', message: '' });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.customerName.trim() || !reviewForm.comment.trim()) {
      return;
    }
    setIsSubmittingReview(true);
    await addReview({
      shopId: shop.shopId,
      shopName: shop.shopName,
      customerName: reviewForm.customerName.trim(),
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
      verifiedPurchase: true,
    });
    setIsSubmittingReview(false);
    setIsReviewModalOpen(false);
    setReviewForm({ rating: 5, customerName: userProfile?.fullName || userProfile?.name || '', comment: '' });
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f5f2eb] pb-24">
      {/* Top Breadcrumb & Back button */}
      <div className="bg-[#10121d] border-b border-[#212436] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/shops"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#cfc7b8] hover:text-[#d4af37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Local Shops</span>
          </Link>
          <span className="text-xs text-[#8a8475] hidden sm:inline">
            Verified Partner • Zero Platform Fees
          </span>
        </div>
      </div>

      {/* Hero Storefront Banner */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-[#161825]">
        <img
          src={shop.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80'}
          alt={shop.shopName}
          className="w-full h-full object-cover filter brightness-[0.6] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-black/40" />
      </div>

      {/* Shop Identity Header Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-[#131522]/95 backdrop-blur-md border border-[#2b3046] rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Logo / Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#d4af37] shrink-0 bg-[#1e2236] shadow-xl">
                <img
                  src={shop.logoUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80'}
                  alt={shop.shopName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#fdfbf7]">
                    {shop.shopName}
                  </h1>
                  {shop.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Shop</span>
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1e2236] text-[11px] text-[#9a9486] border border-[#2d3248]">
                    {shop.category || 'Local Retail'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#9a9486] mt-2">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{shop.address}, {shop.city} {shop.pincode ? `(${shop.pincode})` : ''}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <span>{shop.rating.toFixed(1)}</span>
                    <span className="text-gray-400 font-normal">({shop.reviewCount} customer ratings)</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#b8b1a3] mt-2">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Hours: {shop.openingHours || '10:00 AM – 9:30 PM'}</span>
                </div>
              </div>
            </div>

            {/* Contact CTAs */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wider uppercase shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1c1f30] hover:bg-[#252a42] text-[#f5f2eb] hover:text-[#d4af37] border border-[#2e334a] font-semibold text-xs tracking-wider transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send Enquiry</span>
              </button>

              <a
                href={`tel:${shop.phone.replace(/\s+/g, '')}`}
                className="p-3 rounded-xl bg-[#1c1f30] hover:bg-[#252a42] text-[#d4af37] border border-[#2e334a] transition-all"
                title={`Call ${shop.shopName}`}
              >
                <Phone className="w-4 h-4" />
              </a>

              {shop.shopId === 'shop-fashtag-btm' && (
                <Link
                  to="/book"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold text-xs tracking-wider uppercase transition-all shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book In-Store Slot</span>
                </Link>
              )}
            </div>
          </div>

          {/* Shop Story / Bio */}
          <div className="mt-6 pt-6 border-t border-[#1e2236] text-sm text-[#c7bfb0] leading-relaxed max-w-4xl">
            {shop.description}
          </div>
        </div>
      </div>

      {/* Active Shop Offers Banner */}
      {shopOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1d1f30] to-[#161825] border border-[#d4af37]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shrink-0">
                <BadgePercent className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37]">Active Special Offer</span>
                <h4 className="text-sm font-bold text-[#f8f5ee]">{shopOffers[0].title} — {shopOffers[0].discountValue}</h4>
                <p className="text-xs text-[#a29b8c]">{shopOffers[0].description}</p>
              </div>
            </div>
            <div className="text-xs font-mono text-[#d4af37] bg-[#0f111c] px-3 py-1.5 rounded-lg border border-[#2d3248]">
              CODE: {shopOffers[0].promoCode || 'IN-STORE'}
            </div>
          </div>
        </section>
      )}

      {/* Shop Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#212436] pb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-[#fdfbf7] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <span>Available Products ({filteredProducts.length})</span>
            </h2>
            <p className="text-xs text-[#9a9486] mt-1">
              Browse products, check stock availability, or chat with {shop.shopName} on WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search inside shop */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#8a8475] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products in this shop..."
                className="bg-[#131522] border border-[#2b2f44] text-xs text-[#f5f2eb] placeholder-[#8a8475] pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-[#d4af37] w-64"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {shopCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#d4af37] text-black font-semibold'
                      : 'bg-[#151726] text-[#b8b0a1] hover:bg-[#1f2235]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Cards */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#121420] rounded-3xl border border-[#212436] mt-8">
            <ShoppingBag className="w-12 h-12 text-[#9a9486] mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-semibold text-[#f8f5ee]">No items found matching your filter</h3>
            <p className="text-xs text-[#9a9486] mt-1">
              Clear your search or contact the shop owner directly via WhatsApp for custom requirements.
            </p>
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Ask Shop Owner on WhatsApp</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Customer Reviews & Feedback Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-10 border-t border-[#1e2336]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-heading font-bold text-[#f8f5ee] flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-current" />
              <span>Customer Reviews & Ratings ({shopReviews.length})</span>
            </h3>
            <p className="text-xs text-[#9a9486] mt-1">
              Real feedback from neighbourhood shoppers who purchased from {shop.shopName}.
            </p>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c1f30] hover:bg-[#252b42] text-[#d4af37] border border-[#2e3550] text-xs font-semibold transition-colors"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {shopReviews.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#121420] border border-[#212436] text-center">
            <p className="text-xs text-[#9a9486]">No reviews posted for this store yet. Be the first to review!</p>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="mt-3 text-xs text-[#d4af37] font-semibold underline"
            >
              Share your shopping experience
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {shopReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-[#121420] border border-[#212436] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-[#353a50]'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#787265]">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-[#cfc8ba] italic leading-relaxed">
                  "{rev.comment}"
                </p>
                <div className="pt-2 border-t border-[#1d2133] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#f8f5ee]">{rev.customerName}</span>
                  {rev.verifiedPurchase && (
                    <span className="text-[10px] text-emerald-400 font-medium">Verified Customer</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Write Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141624] border border-[#2f344a] rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="font-heading text-lg font-bold text-[#fdfbf7]">
              Review {shop.shopName}
            </h3>
            <p className="text-xs text-[#9a9486] mt-1">
              Your rating helps other customers discover verified local businesses.
            </p>

            <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                  Overall Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewForm.rating
                            ? 'text-amber-400 fill-current'
                            : 'text-[#3a3f55]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-400 ml-2">
                    {reviewForm.rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={reviewForm.customerName}
                  onChange={(e) => setReviewForm({ ...reviewForm, customerName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 bg-[#1b1e30] border border-[#2d3248] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                  Your Review / Experience *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Tell us about product quality, pricing, store cleanliness, or staff service..."
                  className="w-full px-4 py-2.5 bg-[#1b1e30] border border-[#2d3248] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#9a9486] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold text-xs tracking-wider uppercase hover:opacity-95 disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-Store Enquiry Modal */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141624] border border-[#2f344a] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <h3 className="font-heading text-xl font-bold text-[#fdfbf7]">
              Send Enquiry to {shop.shopName}
            </h3>
            <p className="text-xs text-[#9a9486] mt-1">
              The shop owner will receive your enquiry directly on their dashboard and contact you via phone or WhatsApp.
            </p>

            <form onSubmit={handleEnquirySubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={enquiryForm.customerName}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, customerName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 bg-[#1b1e30] border border-[#2d3248] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={enquiryForm.customerPhone}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, customerPhone: e.target.value })}
                  placeholder="e.g. +91 98450 12345"
                  className="w-full px-4 py-2.5 bg-[#1b1e30] border border-[#2d3248] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={enquiryForm.customerEmail}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, customerEmail: e.target.value })}
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-4 py-2.5 bg-[#1b1e30] border border-[#2d3248] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                  Your Message or Requirements *
                </label>
                <textarea
                  rows={3}
                  required
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                  placeholder="e.g. I want to inquire about availability and custom fitting..."
                  className="w-full px-4 py-2.5 bg-[#1b1e30] border border-[#2d3248] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEnquiryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#9a9486] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEnquiry}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold text-xs tracking-wider uppercase hover:opacity-95 disabled:opacity-50"
                >
                  {isSubmittingEnquiry ? 'Sending...' : 'Submit Enquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
