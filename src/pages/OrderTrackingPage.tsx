import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Calendar
} from 'lucide-react';

const STAGES: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'Order Placed', label: 'Order Placed', desc: 'Order received and logged in system' },
  { status: 'Order Confirmed', label: 'Confirmed', desc: 'Verified and queued for fulfillment' },
  { status: 'Processing', label: 'Processing', desc: 'Outfits selected from BTM inventory' },
  { status: 'Packed', label: 'Quality Checked & Packed', desc: 'Steamed, ironed, and sealed in luxury garment packaging' },
  { status: 'Shipped', label: 'Dispatched', desc: 'Handed to courier partner' },
  { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Courier executive en route to your address' },
  { status: 'Delivered', label: 'Delivered', desc: 'Delivered to recipient with signature' },
];

export const OrderTrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders, settings } = useStore();
  const [searchId, setSearchId] = useState(searchParams.get('id') || '');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      setSearchId(idParam);
      const found = orders.find(
        (o) => o.orderId.toLowerCase() === idParam.trim().toLowerCase()
      );
      setMatchedOrder(found || null);
      setHasSearched(true);
    }
  }, [searchParams, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setSearchParams({ id: searchId.trim() });
    const found = orders.find(
      (o) => o.orderId.toLowerCase() === searchId.trim().toLowerCase()
    );
    setMatchedOrder(found || null);
    setHasSearched(true);
  };

  const getStageIndex = (status: OrderStatus) => {
    return STAGES.findIndex((s) => s.status === status);
  };

  const currentStageIndex = matchedOrder ? getStageIndex(matchedOrder.orderStatus) : -1;
  const isCancelled = matchedOrder?.orderStatus === 'Cancelled';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161824] border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold tracking-wider uppercase">
          <Truck className="w-3.5 h-3.5" />
          <span>Real-Time Logistics Tracker</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#f5f2eb]">
          Track Your Order
        </h1>
        <p className="text-sm text-[#a0998c]">
          Enter your FashTag Order ID (e.g. FT-ORD-84920) to view current fulfillment status, courier dispatch updates, and delivery schedule.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#7e7668]" />
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Order ID (e.g. FT-ORD-84920)"
            className="w-full bg-[#12141e] border border-[#26293a] rounded-xl pl-12 pr-4 py-3.5 text-sm text-[#f5f2eb] placeholder-[#6e675b] focus:outline-none focus:border-[#d4af37] transition-all uppercase tracking-wider"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-opacity"
        >
          Track Order
        </button>
      </form>

      {/* Results */}
      {hasSearched && !matchedOrder && (
        <div className="max-w-xl mx-auto p-8 rounded-2xl bg-[#12141e] border border-[#26293a] text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-[#ba932a] mx-auto" />
          <h3 className="font-heading text-xl text-[#f5f2eb]">Order Not Found</h3>
          <p className="text-xs text-[#a0998c]">
            We could not find an order matching <span className="font-mono text-[#d4af37]">{searchId}</span>. Please verify your confirmation email or SMS, or contact our BTM store support.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <a
              href={`https://wa.me/${settings.whatsapp}?text=Hi%20FashTag,%20I%20am%20trying%20to%20track%20my%20order%20${encodeURIComponent(searchId)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#1a1d2b] border border-[#2c3046] text-emerald-400 text-xs font-medium hover:border-emerald-500/50"
            >
              WhatsApp Support
            </a>
            <Link
              to="/account"
              className="px-4 py-2 rounded-lg bg-[#d4af37] text-black text-xs font-semibold"
            >
              Check My Account
            </Link>
          </div>
        </div>
      )}

      {matchedOrder && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Status summary banner */}
          <div className="p-6 rounded-2xl bg-[#12141e] border border-[#26293a] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-bold text-[#d4af37]">
                  {matchedOrder.orderId}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isCancelled 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : matchedOrder.orderStatus === 'Delivered'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30'
                }`}>
                  {matchedOrder.orderStatus}
                </span>
              </div>
              <p className="text-xs text-[#8c8577] mt-1">
                Placed on {new Date(matchedOrder.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#a0998c]">
              <div>
                <span className="block text-[#6f6759]">Estimated Delivery</span>
                <span className="font-medium text-[#f5f2eb]">
                  {new Date(matchedOrder.estimatedDelivery).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              </div>
              <div>
                <span className="block text-[#6f6759]">Carrier & Tracking</span>
                <span className="font-medium text-[#f5f2eb]">
                  {matchedOrder.carrier || 'FashTag Express Dispatch'} • {matchedOrder.trackingNumber || 'FT-EXP-LOCAL'}
                </span>
              </div>
              <div>
                <span className="block text-[#6f6759]">Total Paid</span>
                <span className="font-bold text-[#d4af37]">₹{matchedOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Alert if cancelled */}
          {isCancelled && (
            <div className="p-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              <div>
                <p className="font-semibold text-sm">This order was cancelled.</p>
                <p className="text-rose-200/80 mt-0.5">
                  If payment was deducted via UPI or Card, a full refund of ₹{matchedOrder.totalAmount.toLocaleString('en-IN')} is processed to your original payment method in 3–5 business days.
                </p>
              </div>
            </div>
          )}

          {/* Visual 8-Step Timeline */}
          {!isCancelled && (
            <div className="p-8 rounded-2xl bg-[#12141e] border border-[#26293a] space-y-6">
              <h2 className="font-heading text-lg font-bold text-[#f5f2eb] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#d4af37]" />
                <span>Shipment Journey</span>
              </h2>

              <div className="relative">
                {/* Horizontal progress line on desktop */}
                <div className="hidden lg:block absolute top-5 left-8 right-8 h-1 bg-[#1e2130] z-0">
                  <div
                    className="h-full bg-gradient-to-r from-[#d4af37] to-[#ba932a] transition-all duration-500"
                    style={{
                      width: `${Math.max(0, (currentStageIndex / (STAGES.length - 1)) * 100)}%`
                    }}
                  />
                </div>

                {/* Stages List */}
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 relative z-10">
                  {STAGES.map((stage, idx) => {
                    const isDone = currentStageIndex >= idx;
                    const isCurrent = currentStageIndex === idx;

                    return (
                      <div key={stage.status} className="flex lg:flex-col items-start lg:items-center text-left lg:text-center gap-4 lg:gap-3">
                        {/* Stage Icon Pin */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isDone
                              ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/30 ring-4 ring-[#d4af37]/20'
                              : 'bg-[#1b1e2c] border border-[#2e3247] text-[#6d6659]'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>

                        {/* Stage Info */}
                        <div className="space-y-1">
                          <p className={`text-xs font-semibold ${
                            isCurrent ? 'text-[#d4af37]' : isDone ? 'text-[#f5f2eb]' : 'text-[#6d6659]'
                          }`}>
                            {stage.label}
                          </p>
                          <p className="text-[10px] text-[#8c8577] line-clamp-2">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Timeline Log */}
              <div className="pt-6 border-t border-[#1e2130] space-y-3">
                <span className="text-xs font-semibold text-[#c7bfb0] uppercase tracking-wider block">
                  Detailed Milestones
                </span>
                <div className="space-y-2">
                  {matchedOrder.timeline.map((evt, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs p-3 rounded-lg bg-[#161826] border border-[#222538]">
                      <span className={`w-2 h-2 rounded-full ${evt.completed ? 'bg-emerald-400' : 'bg-[#6d6659]'}`} />
                      <span className="font-semibold text-[#f5f2eb] min-w-[130px]">{evt.status}</span>
                      <span className="text-[#a0998c] flex-1">{evt.note}</span>
                      <span className="text-[11px] text-[#6f6759] whitespace-nowrap">
                        {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Delivery Details & Order Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Address & Contact */}
            <div className="p-6 rounded-2xl bg-[#12141e] border border-[#26293a] space-y-4">
              <h3 className="font-heading text-base font-semibold text-[#f5f2eb] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
                <span>Shipping Address</span>
              </h3>
              <div className="text-xs text-[#a0998c] space-y-1 leading-relaxed">
                <p className="font-semibold text-[#f5f2eb]">{matchedOrder.shippingAddress.fullName}</p>
                <p>{matchedOrder.shippingAddress.houseNumber}, {matchedOrder.shippingAddress.street}</p>
                {matchedOrder.shippingAddress.landmark && <p>Near: {matchedOrder.shippingAddress.landmark}</p>}
                <p>{matchedOrder.shippingAddress.city}, {matchedOrder.shippingAddress.state} - {matchedOrder.shippingAddress.pinCode}</p>
                <p className="pt-2 flex items-center gap-2 text-[#d4af37]">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{matchedOrder.shippingAddress.phone}</span>
                </p>
                {matchedOrder.shippingAddress.deliveryInstructions && (
                  <p className="pt-2 text-[11px] text-[#80796c] italic">
                    Note: "{matchedOrder.shippingAddress.deliveryInstructions}"
                  </p>
                )}
              </div>
            </div>

            {/* Order Items & Summary */}
            <div className="p-6 rounded-2xl bg-[#12141e] border border-[#26293a] space-y-4">
              <h3 className="font-heading text-base font-semibold text-[#f5f2eb] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                <span>Items in Parcel ({matchedOrder.items.reduce((s, it) => s + it.quantity, 0)})</span>
              </h3>
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {matchedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-[#171926]">
                    <img src={it.imageUrl} alt={it.productName} className="w-12 h-14 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-medium text-[#f5f2eb] truncate">{it.productName}</p>
                      <p className="text-[11px] text-[#80796c]">
                        Size: {it.size} • Color: {it.color} • Qty: {it.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-xs text-[#d4af37]">
                      ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Need Assistance */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171926] to-[#11131c] border border-[#242738] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-heading text-sm font-semibold text-[#f5f2eb]">Questions about your shipment?</h4>
              <p className="text-xs text-[#9c9484]">
                Our BTM 1st Stage store team is available daily 10:30 AM – 10:30 PM.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="px-4 py-2 rounded-xl bg-[#1d2030] text-[#cfc7b8] text-xs font-semibold hover:text-white"
              >
                Call Store
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp}?text=Hi%20FashTag,%20I%20have%20an%20enquiry%20regarding%20my%20Order%20${encodeURIComponent(matchedOrder.orderId)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400"
              >
                WhatsApp Updates
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
