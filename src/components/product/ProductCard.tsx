import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  MessageCircle, 
  Store, 
  Zap, 
  Check 
} from 'lucide-react';
import { Product, ProductSize } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, shops } = useStore();
  const inWishlist = isInWishlist(product.productId);

  // Match shop for vendor info
  const shop = shops.find((s) => s.shopId === product.shopId);
  const shopName = shop ? shop.shopName : (product.shopName || 'FashTag Flagship Store');
  const shopCity = shop ? shop.city : (product.city || 'BTM Layout, Bengaluru');
  const rawWhatsApp = shop ? (shop.whatsappNumber || shop.whatsapp || '919739841266') : '919739841266';
  const cleanWhatsApp = (rawWhatsApp || '919739841266').replace(/\D/g, '');

  const whatsappMessage = `Hello, I found your product on the Local Business Digital Marketplace.\n\nProduct: ${product.productName}\nShop: ${shopName}\nPrice: ₹${product.price.toLocaleString('en-IN')}\n\nIs this product currently available?`;
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(whatsappMessage)}`;

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0]?.name || 'Standard';
    addToCart(product, defaultSize, defaultColor, 1);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0]?.name || 'Standard';
    addToCart(product, defaultSize, defaultColor, 1);
    navigate('/checkout');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.productId);
  };

  return (
    <div className="group relative bg-[#131522] border border-[#23273c] hover:border-[#d4af37]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between">
      <div>
        {/* Product Image Area */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#181a28]">
          <Link to={`/product/${product.productId}`}>
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-[#131522] via-transparent to-black/20 pointer-events-none" />

          {/* Discount Badge */}
          {discountPercent && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[10px] font-bold tracking-wide shadow-md">
              {discountPercent}% OFF
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              inWishlist
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-black/60 text-[#c7bfb0] hover:text-white hover:bg-black/90'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Buy Now floating overlay button on hover */}
          <div className="absolute bottom-2.5 inset-x-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button
              onClick={handleQuickAdd}
              className="flex-1 py-2 px-2 rounded-xl bg-black/80 backdrop-blur-md border border-[#d4af37]/60 text-[#d4af37] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#d4af37] hover:text-black transition-all shadow-lg"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleQuickBuy}
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black text-xs font-bold flex items-center justify-center hover:opacity-95 transition-all shadow-lg"
              title="Instant Checkout"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4">
          {/* Vendor Attribution Badge */}
          {product.shopId && (
            <Link
              to={`/shops/${product.shopId}`}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#d4af37] hover:underline mb-1"
            >
              <Store className="w-3 h-3 text-[#d4af37]" />
              <span className="truncate max-w-[180px]">{shopName}</span>
            </Link>
          )}

          <Link to={`/product/${product.productId}`}>
            <h3 className="font-heading text-sm font-semibold text-[#f8f5ee] hover:text-[#d4af37] transition-colors line-clamp-1">
              {product.productName}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
            </div>
            <span className="text-[11px] font-bold text-[#e6ded2]">
              {(product.rating || 4.8).toFixed(1)}
            </span>
            <span className="text-[10px] text-[#807a6e]">
              ({product.reviewCount || 24})
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base font-bold text-[#fdfbf7] font-sans-body">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#7e786b] line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Available Sizes chips */}
          <div className="flex items-center gap-1 mt-2.5 flex-wrap">
            {product.sizes.slice(0, 5).map((size) => (
              <span
                key={size}
                className="px-1.5 py-0.5 rounded bg-[#1c1f2e] border border-[#2b2f42] text-[10px] text-[#bfb8aa]"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="text-[10px] text-[#807a6e]">+{product.sizes.length - 5}</span>
            )}
          </div>
        </div>
      </div>

      {/* Direct WhatsApp Contact Seller CTA */}
      <div className="p-4 pt-0">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-800 text-emerald-400 hover:text-white border border-emerald-700/40 text-xs font-semibold transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>Ask Seller on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
