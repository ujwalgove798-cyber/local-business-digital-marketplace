import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductSize } from '../types';
import { 
  ShoppingBag, 
  Heart, 
  Calendar, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Star, 
  ArrowLeft, 
  Check, 
  Ruler, 
  X, 
  Share2, 
  Sparkles,
  MessageCircle,
  Store,
  Send
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { products, shops, addToCart, toggleWishlist, isInWishlist, addToast, submitEnquiry } = useStore();

  const product = products.find((p) => p.productId === productId);

  // Fallback to first available if not found
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-heading text-2xl text-white">Outfit Not Found</h2>
        <p className="text-xs text-[#9c9484]">The fashion item you are looking for may have been retired or moved.</p>
        <Link to="/collections" className="inline-block px-6 py-2.5 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase">
          Browse Collections
        </Link>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState<string>(product.imageUrl);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Multi-vendor seller details & enquiry modal
  const shop = shops.find((s) => s.shopId === product.shopId) || shops[0];
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);

  const cleanWhatsApp = (shop?.whatsappNumber || '919739841266').replace(/\D/g, '');
  const sellerShopName = shop?.shopName || 'Local Business Marketplace Partner';
  const sellerWhatsAppUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    `Hello, I found your product on the Local Business Digital Marketplace.\n\nProduct: ${product.productName}\nShop: ${sellerShopName}\nPrice: ₹${product.price.toLocaleString('en-IN')}\n\nIs this product currently available?`
  )}`;

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const inWishlist = isInWishlist(product.productId);

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    const success = addToCart(product, selectedSize, selectedColor, quantity);
    if (success) {
      navigate('/checkout');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    addToast('Product link copied to clipboard!', 'info');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name.trim() || !enquiryForm.phone.trim() || !enquiryForm.message.trim()) return;
    setIsSubmittingEnquiry(true);
    await submitEnquiry({
      shopId: shop.shopId,
      shopName: shop.shopName,
      productId: product.productId,
      productName: product.productName,
      productPrice: product.price,
      customerName: enquiryForm.name.trim(),
      customerPhone: enquiryForm.phone.trim(),
      customerEmail: enquiryForm.email.trim() || undefined,
      message: `[Size: ${selectedSize}, Color: ${selectedColor}] ${enquiryForm.message.trim()}`,
    });
    setIsSubmittingEnquiry(false);
    setIsEnquiryModalOpen(false);
    setEnquiryForm({ name: '', phone: '', email: '', message: '' });
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.productId !== product.productId)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-[#8f8879]">
        <Link to="/collections" className="inline-flex items-center gap-1.5 hover:text-[#d4af37] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Collections</span>
        </Link>

        <button 
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#12141e] border border-[#232738] shadow-2xl">
            <img
              src={selectedImage}
              alt={product.productName}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
            {product.featured && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#d4af37] text-black text-[10px] font-bold uppercase tracking-wider">
                Signature Piece
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.productId)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                inWishlist ? 'bg-rose-950/80 text-rose-400 border border-rose-800' : 'bg-black/60 text-white hover:text-rose-400'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-400' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-[#d4af37] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="space-y-7">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#1b1c28] border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider">
                {product.category}
              </span>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-[10px] font-bold">
                  Only {product.stock} left in stock!
                </span>
              )}
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#fcf9f3] tracking-wide leading-tight">
              {product.productName}
            </h1>

            {/* Ratings preview */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex text-[#d4af37] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37]" />
                ))}
              </div>
              <span className="text-xs text-[#a39b8c]">
                {product.rating || 4.9} ({product.reviewCount || 28} verified reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-[#141622] border border-[#212536] flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-extrabold text-[#f5f2eb]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm line-through text-[#7f7767]">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#8e8677]">Inclusive of all GST</span>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a59d8e] uppercase font-bold tracking-wider">
                  Color: <strong className="text-white">{selectedColor}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`group relative p-1 rounded-full border-2 transition-all ${
                      selectedColor === c.name ? 'border-[#d4af37] scale-110' : 'border-transparent'
                    }`}
                    title={c.name}
                  >
                    <span
                      className="block w-6 h-6 rounded-full border border-black/30 shadow-inner"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#a59d8e] uppercase font-bold tracking-wider">
                Select Size: <strong className="text-white">{selectedSize}</strong>
              </span>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-[#d4af37] hover:underline flex items-center gap-1 font-semibold"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all ${
                    selectedSize === s
                      ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 scale-105'
                      : 'bg-[#161826] border border-[#272b3c] text-[#cfc7b7] hover:border-[#d4af37]/50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#a59d8e] uppercase font-bold tracking-wider">Quantity:</span>
            <div className="flex items-center border border-[#2b2f42] rounded-xl bg-[#141624]">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1.5 text-base text-[#cfc7b7] hover:text-white"
              >
                -
              </button>
              <span className="px-3 font-bold text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-1.5 text-base text-[#cfc7b7] hover:text-white"
              >
                +
              </button>
            </div>
            <span className="text-[11px] text-[#7d7566]">
              {product.stock > 0 ? `${product.stock} ${t('common.inStock', 'pieces in stock')}` : t('common.outOfStock', 'Out of stock')}
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
              className={`py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all flex items-center justify-center gap-2 ${
                product.stock <= 0 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.02]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('common.addToCart', 'Add to Cart')}</span>
            </button>

            <button
              disabled={product.stock <= 0}
              onClick={handleBuyNow}
              className={`py-3.5 px-6 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-2 ${
                product.stock <= 0 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.02]'
              }`}
            >
              <span>{t('common.buyNow', 'Buy Now')}</span>
            </button>
          </div>

          {/* WhatsApp Direct Seller Inquiry */}
          <a
            href={sellerWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{t('common.chatWhatsApp', 'Chat with Seller on WhatsApp')}</span>
          </a>

          {/* Verified Boutique Seller Information Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#141624] border border-[#23273a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl border border-[#d4af37]/60 overflow-hidden bg-[#1c1f2e] shrink-0 shadow-md">
                <img src={shop.logoUrl} alt={shop.shopName} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-[10px] text-[#9a9486] uppercase font-bold tracking-wider block">Sold & Fulfilled By</span>
                <Link to={`/shops/${shop.shopId}`} className="font-heading text-sm font-bold text-[#f5f2eb] hover:text-[#d4af37] transition-colors">
                  {shop.shopName}
                </Link>
                <div className="flex items-center gap-2 text-xs text-[#9a9486] mt-0.5">
                  <span>{shop.city}</span>
                  <span>•</span>
                  <span className="text-amber-300 font-semibold">★ {shop.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsEnquiryModalOpen(true)}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#1c1f30] hover:bg-[#252a42] text-xs font-semibold text-[#f5f2eb] border border-[#2d3248] hover:text-[#d4af37] transition-all"
              >
                Send Enquiry
              </button>
              <Link
                to={`/shops/${shop.shopId}`}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#1c1f30] hover:bg-[#252a42] text-xs font-semibold text-[#d4af37] border border-[#2d3248] transition-all text-center"
              >
                View Boutique
              </Link>
            </div>
          </div>

          {/* In-Store Trial Appointment Bridge */}
          <div className="p-4 rounded-2xl bg-[#171926] border border-[#2b2f42] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider block">
                BTM Flagship Store Trial
              </span>
              <p className="text-xs text-[#cfc7b7]">
                Prefer to try this piece on in person at our BTM 1st Stage store?
              </p>
            </div>
            <Link
              to={`/book?category=${encodeURIComponent(
                product.category === 'Kids\' Fashion' ? "Kids' Fashion" : "Men's Fashion"
              )}`}
              className="px-4 py-2 rounded-full bg-[#1e2233] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold hover:bg-[#d4af37] hover:text-black transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Trial</span>
            </Link>
          </div>

          {/* Guarantees & Shipping Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#1e2233] text-center text-[11px] text-[#938b7d]">
            <div className="p-3 rounded-xl bg-[#12141e] border border-white/5 space-y-1">
              <Truck className="w-4 h-4 text-[#d4af37] mx-auto" />
              <span className="block font-semibold text-white">Express Delivery</span>
              <span className="text-[10px] block opacity-80">Free over ₹1,999</span>
            </div>
            <div className="p-3 rounded-xl bg-[#12141e] border border-white/5 space-y-1">
              <RotateCcw className="w-4 h-4 text-[#d4af37] mx-auto" />
              <span className="block font-semibold text-white">7-Day Exchange</span>
              <span className="text-[10px] block opacity-80">Doorstep pickup</span>
            </div>
            <div className="p-3 rounded-xl bg-[#12141e] border border-white/5 space-y-1">
              <ShieldCheck className="w-4 h-4 text-[#d4af37] mx-auto" />
              <span className="block font-semibold text-white">100% Authentic</span>
              <span className="text-[10px] block opacity-80">Bengaluru Boutique</span>
            </div>
          </div>

          {/* Description & Fabric Details */}
          <div className="space-y-4 pt-2 text-xs leading-relaxed text-[#b5ada0]">
            <div>
              <h3 className="font-heading text-sm font-bold text-white mb-1">Garment Details</h3>
              <p>{product.description}</p>
            </div>

            {product.fabric && (
              <div className="flex items-center gap-2">
                <strong className="text-white">Fabric:</strong>
                <span>{product.fabric}</span>
              </div>
            )}
            {product.fit && (
              <div className="flex items-center gap-2">
                <strong className="text-white">Fit:</strong>
                <span>{product.fit}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#12141e] border border-[#2b3046] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#232738] pb-4">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#d4af37]" />
                <h3 className="font-heading text-lg font-bold text-white">FashTag Sizing Chart</h3>
              </div>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="p-1 rounded-full text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#958e80]">
              Measurements are in inches. For a custom bespoke fit, book a complimentary trial at our BTM 1st Stage store.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#171a26] text-[#d4af37] uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Size</th>
                    <th className="p-3">Chest</th>
                    <th className="p-3">Waist</th>
                    <th className="p-3">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222536] text-[#cfc7b7]">
                  <tr>
                    <td className="p-3 font-bold text-white">XS</td>
                    <td className="p-3">36"</td>
                    <td className="p-3">30"</td>
                    <td className="p-3">27"</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">S</td>
                    <td className="p-3">38"</td>
                    <td className="p-3">32"</td>
                    <td className="p-3">28"</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">M</td>
                    <td className="p-3">40"</td>
                    <td className="p-3">34"</td>
                    <td className="p-3">29"</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">L</td>
                    <td className="p-3">42"</td>
                    <td className="p-3">36"</td>
                    <td className="p-3">30"</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">XL</td>
                    <td className="p-3">44"</td>
                    <td className="p-3">38"</td>
                    <td className="p-3">31"</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">XXL</td>
                    <td className="p-3">46"</td>
                    <td className="p-3">40"</td>
                    <td className="p-3">31.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-full py-2.5 rounded-full bg-[#1c1f2e] text-xs font-semibold text-white hover:bg-white hover:text-black transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

      {/* In-Store Enquiry Modal */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141624] border border-[#2f344a] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#222538] pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#fdfbf7]">
                  Enquire About {product.productName}
                </h3>
                <span className="text-xs text-[#d4af37] block mt-0.5">
                  Direct inquiry to: {shop.shopName}
                </span>
              </div>
              <button
                onClick={() => setIsEnquiryModalOpen(false)}
                className="p-1 rounded-full text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnquirySubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={enquiryForm.name}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
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
                  value={enquiryForm.phone}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                  placeholder="e.g. +91 98450 12345"
                  className="w-full px-4 py-2.5 bg-[#1b1e30] border border-[#2d3248] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-4 py-2.5 bg-[#1b1e30] border border-[#2d3248] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                  Selected Specification
                </label>
                <div className="px-3 py-2 rounded-xl bg-[#181a28] border border-[#292d3f] text-xs text-[#d4af37] flex items-center justify-between">
                  <span>Size: {selectedSize}</span>
                  <span>Color: {selectedColor}</span>
                  <span>Price: ₹{product.price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                  Your Message or Question *
                </label>
                <textarea
                  rows={3}
                  required
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                  placeholder="e.g. Can I visit this evening to try this on, or do you have matching accessories?"
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
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold text-xs tracking-wider uppercase hover:opacity-95 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingEnquiry ? 'Sending...' : 'Send to Shop'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#1e2130] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-2xl font-bold text-white">
              Complete the Look
            </h3>
            <Link to="/collections" className="text-xs text-[#d4af37] font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.productId}
                to={`/product/${rel.productId}`}
                className="group p-4 rounded-2xl bg-[#131520] border border-[#212433] hover:border-[#d4af37]/60 transition-all flex flex-col justify-between"
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-black mb-3">
                  <img src={rel.imageUrl} alt={rel.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#d4af37]">{rel.category}</span>
                  <h4 className="font-heading text-sm font-bold text-white line-clamp-1">{rel.productName}</h4>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-bold text-white text-sm">₹{rel.price.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-[#d4af37]">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
