import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  ShoppingBag, 
  CreditCard,
  Truck,
  ExternalLink
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, settings } = useStore();

  const order = orderId ? getOrderById(orderId) : undefined;

  useEffect(() => {
    if (order) {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#e5c567', '#ffffff', '#2a9d8f'],
      });
    }
  }, [order]);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-heading text-2xl text-white">Order Record Not Found</h2>
        <p className="text-xs text-[#958e80]">We could not locate an order with ID: {orderId}.</p>
        <Link to="/collections" className="inline-block px-6 py-2.5 rounded-full bg-[#d4af37] text-black text-xs font-bold uppercase">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello FashTag! Here is my confirmed order:\n\n` +
    `• Order ID: ${order.orderId}\n` +
    `• Name: ${order.customerName}\n` +
    `• Total: ₹${order.totalAmount.toLocaleString('en-IN')}\n` +
    `• Payment: ${order.paymentMethod} (${order.paymentStatus.toUpperCase()})\n` +
    `• Items: ${order.items.map((i) => `${i.productName} (${i.size}) x${i.quantity}`).join(', ')}\n\n` +
    `Please notify me when my package is dispatched!`
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      {/* Top Success Banner */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-in zoom-in duration-300">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>
        
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#d4af37] block">
          Order Successfully Placed
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#fcf9f3]">
          Thank You for Shopping at FashTag!
        </h1>
        <p className="text-xs sm:text-sm text-[#aba394] max-w-lg mx-auto">
          Your order has been recorded in our store system. Our team at BTM 1st Stage is now preparing your luxury garments.
        </p>
      </div>

      {/* Main Order Receipt Card */}
      <div className="bg-[#11131c] border border-[#2b2e40] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Header with Order ID & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#212435]">
          <div>
            <span className="text-[11px] text-[#8e8779] uppercase tracking-wider block">
              Unique Order Identifier
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#d4af37] tracking-wider block mt-0.5">
              {order.orderId}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-800 text-emerald-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{order.orderStatus}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-[#1c1f2e] border border-white/10 text-xs text-[#cfc7b7] uppercase font-bold">
              {order.paymentMethod}
            </span>
          </div>
        </div>

        {/* Ordered Items Grid */}
        <div className="space-y-4">
          <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
            Items in This Order ({order.items.reduce((s, i) => s + i.quantity, 0)})
          </h3>

          <div className="divide-y divide-[#1e2233]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.productName} className="w-14 h-16 rounded-lg object-cover bg-black shrink-0 border border-white/5" />
                  <div>
                    <h4 className="font-bold text-white line-clamp-1">{item.productName}</h4>
                    <p className="text-[#968e80] text-[11px]">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</p>
                    <p className="font-semibold text-[#d4af37]">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <span className="font-heading font-bold text-white text-sm">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address & Financial Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-[#212435] text-xs">
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Delivery Address</span>
            </h4>
            <div className="text-[#cfc7b7] leading-relaxed">
              <p className="font-bold text-white">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.houseNumber}, {order.shippingAddress.street}</p>
              {order.shippingAddress.landmark && <p>Near: {order.shippingAddress.landmark}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
              <p className="text-[#8e8779] mt-1">Phone: {order.shippingAddress.phone}</p>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#d4af37]">
              <Truck className="w-3.5 h-3.5" />
              <span>Estimated Delivery: <strong>{order.estimatedDelivery}</strong></span>
            </div>
          </div>

          <div className="space-y-2.5 rounded-2xl bg-[#161825] p-5 border border-[#232738]">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider">
              Payment Summary
            </h4>
            <div className="flex justify-between text-[#b8b0a1]">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Coupon Discount</span>
                <span>- ₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-[#b8b0a1]">
              <span>Shipping Charge</span>
              <span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
              <span>Total Paid / Payable</span>
              <span className="font-heading text-[#d4af37] text-base">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="pt-1 text-[10px] text-[#8e8778]">
              Payment Status: <strong className={order.paymentStatus === 'completed' ? 'text-emerald-400' : 'text-amber-400'}>
                {order.paymentStatus.toUpperCase()}
              </strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-[#212435] flex flex-col sm:flex-row items-center gap-4">
          <Link
            to={`/track-order?id=${order.orderId}`}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Track Delivery</span>
          </Link>

          <a
            href={`https://wa.me/${settings.whatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#183a24] border border-[#2c6e43] text-emerald-300 font-semibold text-xs uppercase tracking-wider hover:bg-emerald-950 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Updates</span>
          </a>
        </div>
      </div>

      {/* Return Links */}
      <div className="flex items-center justify-between text-xs text-[#8f8879] pt-4">
        <Link to="/account" className="hover:text-white transition-colors">
          View All My Orders in Account →
        </Link>
        <Link to="/collections" className="hover:text-[#d4af37] font-semibold transition-colors flex items-center gap-1">
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
