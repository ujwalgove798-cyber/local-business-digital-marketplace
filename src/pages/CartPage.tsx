import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  X,
  Check
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    cartSubtotal, 
    cartDiscount, 
    cartDeliveryFee, 
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    settings 
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  const freeDeliveryThreshold = settings.freeShippingThreshold || 1999;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryProgress = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#161825] border border-[#2b3044] text-[#d4af37] flex items-center justify-center mx-auto shadow-2xl">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-white">
          {t('cart.emptyTitle', 'Your Fashion Cart is Empty')}
        </h1>
        <p className="text-xs sm:text-sm text-[#9c9484] max-w-md mx-auto leading-relaxed">
          {t('cart.emptySubtitle', 'Looks like you haven\'t added any designer shirts, festive waistcoats, or luxury denims yet.')}
        </p>
        <div className="pt-2">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
          >
            <span>{t('common.exploreCollections', 'Explore Collections')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e2130] pb-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#d4af37] block">
            {t('cart.reviewSelection', 'Review Your Selection')}
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
            {t('cart.title', 'Shopping Cart')} ({cart.reduce((s, i) => s + i.quantity, 0)} {t('common.quantity', 'Items')})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-[#8e8778] hover:text-rose-400 transition-colors flex items-center gap-1.5 self-start"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('common.clearCart', 'Clear Cart')}</span>
        </button>
      </div>

      {/* Main Grid: Items & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Free Shipping Progress Bar */}
          <div className="p-4 rounded-2xl bg-[#141624] border border-[#212538] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#ded8cc]">
                <Truck className="w-4 h-4 text-[#d4af37]" />
                {amountNeededForFreeDelivery === 0 ? (
                  <strong className="text-emerald-400 font-bold">
                    {t('common.freeDelivery', 'Free Doorstep Delivery unlocked!')}
                  </strong>
                ) : (
                  <span>
                    Add <strong className="text-[#d4af37]">₹{amountNeededForFreeDelivery.toLocaleString('en-IN')}</strong> more for FREE Express Delivery
                  </span>
                )}
              </span>
              <span className="text-[10px] text-[#8e8778]">Threshold: ₹{freeDeliveryThreshold}</span>
            </div>
            <div className="w-full h-1.5 bg-[#202334] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#d4af37] to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#12141f] border border-[#222538] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-[#d4af37]/40"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-20 h-24 rounded-xl object-cover bg-black shrink-0 border border-[#25283b]"
                  />
                  <div className="space-y-1">
                    {item.category && (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] block">
                        {item.category}
                      </span>
                    )}
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-heading font-bold text-white hover:text-[#d4af37] text-sm line-clamp-1 transition-colors"
                    >
                      {item.productName}
                    </Link>
                    <div className="text-xs text-[#9d9585] flex items-center gap-3">
                      <span>{t('common.size', 'Size')}: <strong className="text-white">{item.size}</strong></span>
                      <span>•</span>
                      <span>{t('common.color', 'Color')}: <strong className="text-white">{item.color}</strong></span>
                    </div>
                    <div className="text-sm font-bold text-[#f5f2eb] pt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                      {item.originalPrice && (
                        <span className="text-xs line-through text-[#797262] ml-2">
                          ₹{item.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#1c1f2e]">
                  <div className="flex items-center border border-[#2a2e40] rounded-xl bg-[#161826]">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-[#aaa293] hover:text-white"
                      title="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-[#aaa293] hover:text-white"
                      title="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-heading font-bold text-sm text-[#d4af37]">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#12141e] border border-[#26293a] shadow-2xl space-y-6">
          <h3 className="font-heading text-xl font-bold text-white border-b border-[#212435] pb-4">
            {t('cart.orderSummary', 'Order Summary')}
          </h3>

          {/* Coupon Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Promotional Voucher / Coupon</span>
            </label>

            {appliedCoupon ? (
              <div className="p-3 rounded-xl bg-[#18231c] border border-[#2d5e3c] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-400 block">{appliedCoupon.code}</span>
                  <span className="text-[10px] text-[#9fc4aa]">{appliedCoupon.description}</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-rose-400 hover:underline p-1"
                >
                  {t('common.remove', 'Remove')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. FASHTAG10, FIRST500"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="w-full bg-[#171926] border border-[#2b2f42] rounded-xl px-3.5 py-2 text-xs text-white uppercase placeholder-[#6f6759] focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1e2130] text-[#d4af37] border border-[#d4af37]/40 text-xs font-semibold hover:bg-[#d4af37] hover:text-black transition-colors shrink-0"
                >
                  {t('common.apply', 'Apply')}
                </button>
              </form>
            )}
            <div className="text-[10px] text-[#7d7566] flex flex-wrap gap-2 pt-1">
              <span>Try: <code className="text-[#d4af37] cursor-pointer" onClick={() => applyCoupon('FASHTAG10')}>FASHTAG10</code></span>
              <span>•</span>
              <span><code className="text-[#d4af37] cursor-pointer" onClick={() => applyCoupon('FIRST500')}>FIRST500</code></span>
              <span>•</span>
              <span><code className="text-[#d4af37] cursor-pointer" onClick={() => applyCoupon('BTMSTYLE')}>BTMSTYLE</code></span>
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="space-y-3 text-xs border-t border-[#212435] pt-4 text-[#cfc7b8]">
            <div className="flex justify-between">
              <span>{t('cart.subtotal', 'Subtotal')}</span>
              <span className="font-medium text-white">₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>

            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>{t('cart.discount', 'Discount')} ({appliedCoupon?.code})</span>
                <span>- ₹{cartDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>{t('cart.deliveryFee', 'Delivery Fee')}</span>
              <span>
                {cartDeliveryFee === 0 ? (
                  <span className="text-emerald-400 font-semibold uppercase text-[10px]">
                    {t('cart.free', 'FREE')}
                  </span>
                ) : (
                  `₹${cartDeliveryFee}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-[#262a3d]">
              <span className="font-heading">{t('cart.finalPayable', 'Final Payable')}</span>
              <span className="font-heading text-lg text-[#d4af37]">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="pt-2">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c567] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <span>{t('cart.proceedToCheckout', 'Proceed to Checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Security Guarantee Note */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-[#7d7566]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>256-bit Encrypted Checkout • COD, UPI & Card Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};
