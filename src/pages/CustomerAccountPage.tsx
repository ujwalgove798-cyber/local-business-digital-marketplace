import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CustomerAddress, Order } from '../types';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Calendar, 
  LogOut, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Truck, 
  XCircle, 
  Sparkles,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  Home
} from 'lucide-react';

export const CustomerAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    customerAddresses,
    wishlist,
    orders, 
    cancelOrder, 
    products, 
    addToCart, 
    removeFromWishlist, 
    saveCustomerAddress, 
    deleteCustomerAddress,
    appointments,
    settings,
    addToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'appointments'>('orders');
  
  // New address modal
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<CustomerAddress, 'id'>>({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    houseNumber: '',
    street: '',
    landmark: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560029',
    isDefault: false,
    deliveryInstructions: '',
  });

  // Filter orders for the user
  const userOrders = orders.filter(
    (o) => 
      o.phone === currentUser?.phone || 
      (currentUser?.email && o.email === currentUser.email) ||
      o.customerName === currentUser?.name
  );

  // Filter appointments for the user
  const userAppointments = appointments.filter(
    (a) => a.phone.includes(currentUser?.phone || 'none') || a.customerName.toLowerCase() === (currentUser?.name || '').toLowerCase()
  );

  // Wishlist products
  const wishlistProducts = products.filter((p) => wishlist?.includes(p.productId));

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.houseNumber || !newAddr.street || !newAddr.pinCode) {
      addToast('Please fill all mandatory address fields', 'error');
      return;
    }
    const created: CustomerAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`
    };
    saveCustomerAddress(created);
    setIsAddingAddress(false);
    setNewAddr({
      fullName: currentUser?.name || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      houseNumber: '',
      street: '',
      landmark: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560029',
      isDefault: false,
      deliveryInstructions: '',
    });
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm(`Are you sure you want to cancel order ${orderId}? Your payment/COD will be updated and reserved items restocked.`)) {
      cancelOrder(orderId, 'Cancelled by customer via Account Dashboard');
    }
  };

  const handleMoveWishlistToCart = (prod: typeof products[0]) => {
    addToCart(prod, prod.sizes[0] || 'M', prod.colors[0]?.name || 'Classic', 1);
    removeFromWishlist(prod.productId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Account Profile Header */}
      <div className="p-8 rounded-3xl bg-[#12141f] border border-[#232636] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37] to-[#ba932a] text-black flex items-center justify-center font-heading text-2xl font-bold shadow-lg shadow-[#d4af37]/20">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl font-bold text-[#f5f2eb]">
                {currentUser?.name || 'FashTag Patron'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-semibold uppercase tracking-wider">
                VIP Member
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#9c9586]">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{currentUser?.phone || '+91 97398 41266'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{currentUser?.email || 'patron@fashtag.in'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Link buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/collections"
            className="px-5 py-2.5 rounded-full bg-[#1b1e2c] border border-[#2e334a] text-xs font-semibold text-[#f5f2eb] hover:border-[#d4af37] transition-colors"
          >
            Explore Collections
          </Link>
          <Link
            to="/book"
            className="px-5 py-2.5 rounded-full bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#e2c159] transition-all"
          >
            Book In-Store Visit
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#232636] gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-[#d4af37] text-[#d4af37]'
              : 'border-transparent text-[#9c9586] hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'border-[#d4af37] text-[#d4af37]'
              : 'border-transparent text-[#9c9586] hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlistProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'addresses'
              ? 'border-[#d4af37] text-[#d4af37]'
              : 'border-transparent text-[#9c9586] hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({customerAddresses?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'appointments'
              ? 'border-[#d4af37] text-[#d4af37]'
              : 'border-transparent text-[#9c9586] hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Appointments ({userAppointments.length})</span>
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {userOrders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#12141e] border border-dashed border-[#272b3c] space-y-4">
              <ShoppingBag className="w-12 h-12 text-[#686052] mx-auto" />
              <h3 className="font-heading text-lg font-bold text-[#f5f2eb]">No Orders Yet</h3>
              <p className="text-xs text-[#9c9586] max-w-sm mx-auto">
                Discover our latest party wear, shirts, denim, and kidswear curations. Fast delivery straight from BTM 1st Stage.
              </p>
              <Link
                to="/collections"
                className="inline-block px-6 py-2.5 rounded-full bg-[#d4af37] text-black text-xs font-bold"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => {
                const canCancel = order.orderStatus === 'Order Placed' || order.orderStatus === 'Order Confirmed';
                const isCancelled = order.orderStatus === 'Cancelled';

                return (
                  <div
                    key={order.orderId}
                    className="p-6 rounded-2xl bg-[#12141f] border border-[#232636] hover:border-[#2f344a] transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f2231]">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-[#d4af37]">{order.orderId}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isCancelled
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : order.orderStatus === 'Delivered'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#827b6d] mt-1">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })} • Payment: {order.paymentMethod} ({order.paymentStatus})
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          to={`/track-order?id=${order.orderId}`}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1a1d2c] border border-[#2c3044] text-xs font-medium text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track Parcel</span>
                        </Link>

                        {canCancel && (
                          <button
                            onClick={() => handleCancelOrder(order.orderId)}
                            className="px-3 py-2 rounded-xl border border-rose-500/40 text-rose-400 text-xs hover:bg-rose-500/10 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#171926]">
                          <img src={it.imageUrl} alt={it.productName} className="w-12 h-14 object-cover rounded-lg" />
                          <div className="flex-1 min-w-0 text-xs">
                            <p className="font-medium text-[#f5f2eb] truncate">{it.productName}</p>
                            <p className="text-[11px] text-[#8c8577]">
                              Size: {it.size} • Color: {it.color} • Qty: {it.quantity}
                            </p>
                            <p className="font-semibold text-[#d4af37] mt-0.5">
                              ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#1f2231] text-xs text-[#9c9586]">
                      <span>
                        Delivery to: <strong className="text-[#f5f2eb]">{order.shippingAddress.fullName}</strong>, {order.shippingAddress.city} - {order.shippingAddress.pinCode}
                      </span>
                      <span className="font-heading text-sm text-[#f5f2eb]">
                        Total: <strong className="text-[#d4af37]">₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. WISHLIST TAB */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistProducts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#12141e] border border-dashed border-[#272b3c] space-y-4">
              <Heart className="w-12 h-12 text-[#686052] mx-auto" />
              <h3 className="font-heading text-lg font-bold text-[#f5f2eb]">Your Wishlist is Empty</h3>
              <p className="text-xs text-[#9c9586] max-w-sm mx-auto">
                Save your favorite styling pieces, casual shirts, and designer blazers to view anytime or move straight to cart.
              </p>
              <Link
                to="/collections"
                className="inline-block px-6 py-2.5 rounded-full bg-[#d4af37] text-black text-xs font-bold"
              >
                Browse Outfits
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((p) => (
                <div
                  key={p.productId}
                  className="rounded-2xl overflow-hidden bg-[#12141f] border border-[#232636] flex flex-col justify-between group"
                >
                  <div className="relative aspect-[4/5] bg-black">
                    <img src={p.imageUrl} alt={p.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button
                      onClick={() => removeFromWishlist(p.productId)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-rose-400 hover:bg-black/90 transition-colors"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-5 space-y-3">
                    <div>
                      <h4 className="font-heading text-base font-bold text-[#f5f2eb]">{p.productName}</h4>
                      <p className="text-xs text-[#9c9586]">{p.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-lg font-bold text-[#d4af37]">₹{p.price.toLocaleString('en-IN')}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-[#736c5f] line-through">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleMoveWishlistToCart(p)}
                        className="flex-1 py-2.5 rounded-xl bg-[#d4af37] text-black text-xs font-bold hover:bg-[#e0c262] transition-colors"
                      >
                        Add to Cart
                      </button>
                      <Link
                        to={`/product/${p.productId}`}
                        className="p-2.5 rounded-xl bg-[#1a1d2c] text-[#f5f2eb] hover:text-[#d4af37]"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. SAVED ADDRESSES TAB */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-lg font-semibold text-[#f5f2eb]">Manage Delivery Addresses</h3>
            <button
              onClick={() => setIsAddingAddress(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d4af37] text-black text-xs font-semibold hover:bg-[#dfbf5e] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Add Address Form Modal / Inline */}
          {isAddingAddress && (
            <form onSubmit={handleSaveNewAddress} className="p-6 rounded-2xl bg-[#141624] border border-[#d4af37]/40 space-y-4">
              <h4 className="font-heading text-sm font-bold text-[#d4af37] uppercase tracking-wider">
                New Address Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-[#9c9586] block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="w-full bg-[#1b1e2c] border border-[#2b3044] rounded-lg px-3 py-2 text-xs text-[#f5f2eb]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#9c9586] block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full bg-[#1b1e2c] border border-[#2b3044] rounded-lg px-3 py-2 text-xs text-[#f5f2eb]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#9c9586] block mb-1">Flat / House / Suite *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.houseNumber}
                    onChange={(e) => setNewAddr({ ...newAddr, houseNumber: e.target.value })}
                    className="w-full bg-[#1b1e2c] border border-[#2b3044] rounded-lg px-3 py-2 text-xs text-[#f5f2eb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#9c9586] block mb-1">Street & Area *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.street}
                    onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                    placeholder="e.g. 4th Cross, 9th Main, BTM 1st Stage"
                    className="w-full bg-[#1b1e2c] border border-[#2b3044] rounded-lg px-3 py-2 text-xs text-[#f5f2eb]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#9c9586] block mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={newAddr.landmark || ''}
                    onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                    placeholder="e.g. Near Udupi Garden / Gangothri Circle"
                    className="w-full bg-[#1b1e2c] border border-[#2b3044] rounded-lg px-3 py-2 text-xs text-[#f5f2eb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-[#9c9586] block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full bg-[#1b1e2c] border border-[#2b3044] rounded-lg px-3 py-2 text-xs text-[#f5f2eb]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#9c9586] block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full bg-[#1b1e2c] border border-[#2b3044] rounded-lg px-3 py-2 text-xs text-[#f5f2eb]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#9c9586] block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.pinCode}
                    onChange={(e) => setNewAddr({ ...newAddr, pinCode: e.target.value })}
                    className="w-full bg-[#1b1e2c] border border-[#2b3044] rounded-lg px-3 py-2 text-xs text-[#f5f2eb]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="px-4 py-2 rounded-lg bg-[#1a1c29] text-[#9c9586] text-xs hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#d4af37] text-black text-xs font-bold hover:bg-[#e0c262]"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(customerAddresses || []).map((addr: CustomerAddress) => (
              <div
                key={addr.id}
                className="p-5 rounded-2xl bg-[#12141f] border border-[#232636] relative flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#f5f2eb]">{addr.fullName}</span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-bold">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <p className="text-[#9c9586]">{addr.houseNumber}, {addr.street}</p>
                  {addr.landmark && <p className="text-[#847c6e]">Near {addr.landmark}</p>}
                  <p className="text-[#9c9586]">{addr.city}, {addr.state} - {addr.pinCode}</p>
                  <p className="text-[#d4af37] pt-1">Phone: {addr.phone}</p>
                </div>

                <div className="flex justify-end pt-2 border-t border-[#1f2231]">
                  <button
                    onClick={() => deleteCustomerAddress(addr.id)}
                    className="p-1.5 text-[#847c6e] hover:text-rose-400 text-xs flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. APPOINTMENTS TAB */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-lg font-semibold text-[#f5f2eb]">In-Store Styling Appointments</h3>
            <Link
              to="/book"
              className="px-4 py-2 rounded-xl bg-[#d4af37] text-black text-xs font-semibold hover:bg-[#e2c159] transition-colors"
            >
              Book New Slot
            </Link>
          </div>

          {userAppointments.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#12141e] border border-dashed border-[#272b3c] space-y-4">
              <Calendar className="w-12 h-12 text-[#686052] mx-auto" />
              <h3 className="font-heading text-lg font-bold text-[#f5f2eb]">No Styling Appointments Booked</h3>
              <p className="text-xs text-[#9c9586] max-w-sm mx-auto">
                Visit our boutique at BTM 1st Stage Bengaluru. Enjoy dedicated changing suites, custom fitting advice, and zero waiting.
              </p>
              <Link
                to="/book"
                className="inline-block px-6 py-2.5 rounded-full bg-[#d4af37] text-black text-xs font-bold"
              >
                Reserve Free Appointment
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userAppointments.map((app) => (
                <div
                  key={app.bookingId}
                  className="p-5 rounded-2xl bg-[#12141f] border border-[#232636] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#d4af37]">{app.bookingId}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        app.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : app.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#f5f2eb] font-medium">
                      {app.shoppingCategory} • {app.visitorCount} {app.visitorCount === 1 ? 'Guest' : 'Guests'}
                    </p>
                    <p className="text-[11px] text-[#8e8778]">
                      Date: {app.appointmentDate} at {app.appointmentTime} (BTM 1st Stage Store)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/confirmation/${app.bookingId}`}
                      className="px-4 py-2 rounded-xl bg-[#1a1d2c] border border-[#2a2f44] text-xs text-[#f5f2eb] hover:border-[#d4af37]"
                    >
                      View Slip
                    </Link>
                    <a
                      href={`https://wa.me/${settings.whatsapp}?text=Hi%20FashTag,%20regarding%20my%20appointment%20${app.bookingId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
