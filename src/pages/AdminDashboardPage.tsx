import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  Appointment, 
  Product, 
  GalleryItem, 
  StoreSettings, 
  Order, 
  OrderStatus, 
  PaymentStatus, 
  Coupon,
  ProductSize
} from '../types';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Plus, 
  LogOut, 
  Layers, 
  Settings as SettingsIcon, 
  Image as ImageIcon, 
  RefreshCw, 
  ChevronRight, 
  Eye, 
  Check, 
  X,
  Phone,
  MessageCircle,
  Sparkles,
  ExternalLink,
  Database,
  Copy,
  ShoppingBag,
  Tag,
  Truck,
  CreditCard,
  MapPin,
  Package,
  TrendingUp,
  Percent,
  Store,
  Star
} from 'lucide-react';
import { 
  SUPABASE_PROJECT_ID, 
  SUPABASE_URL, 
  SUPABASE_SCHEMA_SQL 
} from '../lib/supabase';

const ALL_ORDER_STATUSES: OrderStatus[] = [
  'Order Placed',
  'Order Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    adminUser, 
    logoutAdmin, 
    appointments, 
    updateAppointmentStatus, 
    rescheduleAppointment,
    settings, 
    updateSettings, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    toggleProductActive,
    updateProductStock,
    orders,
    updateOrderStatus,
    updateOrderPaymentStatus,
    coupons,
    createCoupon,
    toggleCouponActive,
    deleteCoupon,
    gallery, 
    addGalleryItem, 
    deleteGalleryItem,
    resetToDefaults,
    addToast,
    supabaseStatus,
    refreshFromSupabase,

    // Marketplace Multi-Vendor
    shops,
    vendorApplications,
    reviews,
    approveVendorApplication,
    rejectVendorApplication,
    toggleShopStatus,
    toggleShopFeatured,
    moderateReview
  } = useStore();

  // Route protection
  React.useEffect(() => {
    if (!adminUser) {
      navigate('/admin/login');
    }
  }, [adminUser, navigate]);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'vendorApplications' | 'shops' | 'reviews' | 'orders' | 'appointments' | 'products' | 'coupons' | 'store' | 'gallery' | 'database'
  >('overview');

  const [copiedSql, setCopiedSql] = useState(false);
  const [isRefreshingDb, setIsRefreshingDb] = useState(false);

  // Vendor Applications State
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorStatusFilter, setVendorStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [rejectModalAppId, setRejectModalAppId] = useState<string | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');

  // Shops State
  const [shopSearch, setShopSearch] = useState('');

  // Reviews State
  const [reviewSearch, setReviewSearch] = useState('');

  // Appointments Filtering
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState<string>('all');
  const [appointmentDateFilter, setAppointmentDateFilter] = useState<string>('');

  // Orders Filtering & Modal
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
  const [statusUpdateModal, setStatusUpdateModal] = useState<{
    order: Order;
    newStatus: OrderStatus;
    note: string;
    carrier: string;
    trackingNumber: string;
  } | null>(null);

  // Modals for Appointments
  const [selectedAppointmentForDetails, setSelectedAppointmentForDetails] = useState<Appointment | null>(null);
  const [rescheduleData, setRescheduleData] = useState<{ appointment: Appointment; newDate: string; newTime: string } | null>(null);

  // New Product Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState<Product['category']>("Men's Fashion");
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(2499);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number>(3499);
  const [newProdStock, setNewProdStock] = useState<number>(10);
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdFeatured, setNewProdFeatured] = useState(false);
  const [newProdFabric, setNewProdFabric] = useState('100% Egyptian Cotton');
  const [newProdFit, setNewProdFit] = useState('Tailored Fit');
  const [newProdSizes, setNewProdSizes] = useState<ProductSize[]>(['S', 'M', 'L', 'XL']);

  // New Coupon Form State
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState<number>(10);
  const [couponMinOrder, setCouponMinOrder] = useState<number>(1999);
  const [couponMaxDiscount, setCouponMaxDiscount] = useState<number>(1000);
  const [couponExpiry, setCouponExpiry] = useState('2026-12-31');
  const [couponDesc, setCouponDesc] = useState('');

  // New Gallery Form State
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [newGalTitle, setNewGalTitle] = useState('');
  const [newGalCat, setNewGalCat] = useState<GalleryItem['category']>('Store Interior');
  const [newGalUrl, setNewGalUrl] = useState('');

  // Editable Settings State
  const [storeForm, setStoreForm] = useState<StoreSettings>(settings);
  const [newBlockedDate, setNewBlockedDate] = useState('');

  React.useEffect(() => {
    setStoreForm(settings);
  }, [settings]);

  // Overview calculations
  const today = new Date();
  const todayYMD = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const stats = useMemo(() => {
    // Appointment stats
    const totalAppointments = appointments.length;
    const todayCount = appointments.filter((a) => a.appointmentDate === todayYMD).length;
    const upcoming = appointments.filter((a) => a.appointmentDate >= todayYMD && (a.status === 'confirmed' || a.status === 'pending')).length;
    const pendingApp = appointments.filter((a) => a.status === 'pending').length;
    const confirmedApp = appointments.filter((a) => a.status === 'confirmed').length;
    const cancelledApp = appointments.filter((a) => a.status === 'cancelled' || a.status === 'rejected').length;

    // Order stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.orderStatus === 'Order Placed' || o.orderStatus === 'Order Confirmed').length;
    const processingOrders = orders.filter((o) => o.orderStatus === 'Processing' || o.orderStatus === 'Packed').length;
    const shippedOrders = orders.filter((o) => o.orderStatus === 'Shipped' || o.orderStatus === 'Out for Delivery').length;
    const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
    const totalRevenue = orders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingCodRevenue = orders
      .filter((o) => o.paymentMethod === 'COD' && o.paymentStatus === 'pending' && o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return { 
      totalAppointments, 
      todayCount, 
      upcoming, 
      pendingApp, 
      confirmedApp, 
      cancelledApp,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenue,
      pendingCodRevenue
    };
  }, [appointments, orders, todayYMD]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchSearch =
        a.customerName.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
        a.phone.includes(appointmentSearch) ||
        a.bookingId.toLowerCase().includes(appointmentSearch.toLowerCase());
      const matchStatus = appointmentStatusFilter === 'all' || a.status === appointmentStatusFilter;
      const matchDate = !appointmentDateFilter || a.appointmentDate === appointmentDateFilter;
      return matchSearch && matchStatus && matchDate;
    });
  }, [appointments, appointmentSearch, appointmentStatusFilter, appointmentDateFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.phone.includes(orderSearch) ||
        o.shippingAddress.pinCode.includes(orderSearch);
      const matchStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Handlers
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(storeForm);
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate) return;
    if (storeForm.blockedDates.includes(newBlockedDate)) {
      addToast('Date already blocked', 'error');
      return;
    }
    const updatedDates = [...storeForm.blockedDates, newBlockedDate];
    setStoreForm((prev) => ({ ...prev, blockedDates: updatedDates }));
    updateSettings({ blockedDates: updatedDates });
    setNewBlockedDate('');
  };

  const handleRemoveBlockedDate = (d: string) => {
    const updatedDates = storeForm.blockedDates.filter((x) => x !== d);
    setStoreForm((prev) => ({ ...prev, blockedDates: updatedDates }));
    updateSettings({ blockedDates: updatedDates });
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdImage.trim()) {
      addToast('Name and Image URL are required', 'error');
      return;
    }
    addProduct({
      productName: newProdName.trim(),
      category: newProdCat,
      description: newProdDesc.trim() || 'Curated boutique collection piece from FashTag BTM.',
      price: newProdPrice,
      originalPrice: newProdOriginalPrice,
      stock: newProdStock,
      sizes: newProdSizes.length > 0 ? newProdSizes : ['M', 'L'],
      colors: [
        { name: 'Onyx Black', hex: '#111111' },
        { name: 'Warm Ivory', hex: '#fdfbf7' },
        { name: 'Champagne Gold', hex: '#d4af37' }
      ],
      fabric: newProdFabric,
      fit: newProdFit,
      imageUrl: newProdImage.trim(),
      active: true,
      featured: newProdFeatured,
      tags: [newProdCat, 'Curated', 'BTM Store'],
      rating: 4.8,
      reviewCount: 12
    });
    setNewProdName('');
    setNewProdDesc('');
    setNewProdImage('');
    setNewProdPrice(2499);
    setNewProdOriginalPrice(3499);
    setNewProdStock(10);
    setNewProdFeatured(false);
    setIsAddingProduct(false);
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      addToast('Coupon code is required', 'error');
      return;
    }
    createCoupon({
      code: couponCode.trim().toUpperCase(),
      type: couponType,
      value: couponValue,
      minOrderAmount: couponMinOrder,
      maxDiscount: couponType === 'percentage' ? couponMaxDiscount : undefined,
      expiryDate: couponExpiry,
      active: true,
      description: couponDesc || `${couponValue}${couponType === 'percentage' ? '%' : '₹'} off on orders above ₹${couponMinOrder}`,
      usedCount: 0,
      usageLimit: 500
    });
    setCouponCode('');
    setCouponDesc('');
    setIsAddingCoupon(false);
  };

  const handleCreateGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalTitle.trim() || !newGalUrl.trim()) {
      addToast('Title and Image URL are required', 'error');
      return;
    }
    addGalleryItem({
      title: newGalTitle.trim(),
      category: newGalCat,
      imageUrl: newGalUrl.trim(),
    });
    setNewGalTitle('');
    setNewGalUrl('');
    setIsAddingGallery(false);
  };

  const handleExecuteReschedule = async () => {
    if (!rescheduleData) return;
    const ok = await rescheduleAppointment(
      rescheduleData.appointment.bookingId,
      rescheduleData.newDate,
      rescheduleData.newTime
    );
    if (ok) {
      setRescheduleData(null);
    }
  };

  const handleExecuteOrderStatusUpdate = async () => {
    if (!statusUpdateModal) return;
    updateOrderStatus(
      statusUpdateModal.order.orderId,
      statusUpdateModal.newStatus,
      statusUpdateModal.note || `Status updated to ${statusUpdateModal.newStatus}`,
      statusUpdateModal.carrier,
      statusUpdateModal.trackingNumber
    );
    setStatusUpdateModal(null);
  };

  // Filtered vendor applications
  const filteredApplications = useMemo(() => {
    return vendorApplications.filter((app) => {
      const matchesSearch = 
        app.shopName.toLowerCase().includes(vendorSearch.toLowerCase()) ||
        app.ownerName.toLowerCase().includes(vendorSearch.toLowerCase()) ||
        app.phone.includes(vendorSearch) ||
        app.email.toLowerCase().includes(vendorSearch.toLowerCase());
      const matchesStatus = vendorStatusFilter === 'all' || app.status === vendorStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vendorApplications, vendorSearch, vendorStatusFilter]);

  // Filtered shops
  const filteredShopsList = useMemo(() => {
    return shops.filter((s) => {
      return (
        s.shopName.toLowerCase().includes(shopSearch.toLowerCase()) ||
        s.city.toLowerCase().includes(shopSearch.toLowerCase()) ||
        (s.area && s.area.toLowerCase().includes(shopSearch.toLowerCase())) ||
        (s.category && s.category.toLowerCase().includes(shopSearch.toLowerCase()))
      );
    });
  }, [shops, shopSearch]);

  // Filtered reviews
  const filteredReviewsList = useMemo(() => {
    return reviews.filter((r) => {
      return (
        r.customerName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.shopName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.comment.toLowerCase().includes(reviewSearch.toLowerCase())
      );
    });
  }, [reviews, reviewSearch]);

  if (!adminUser) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header & Session Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#12141f] border border-[#232738] shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#d4af37]">
              Store Administration
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#fcfaf4]">
            {settings.businessName} Retail & Logistics Console
          </h1>
          <p className="text-xs text-[#908878]">
            Logged in as <strong className="text-white">{adminUser.name}</strong> ({adminUser.email}) • BTM 1st Stage Bengaluru
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Reset store to default demo products and appointments?')) {
                resetToDefaults();
              }
            }}
            className="px-4 py-2 rounded-full border border-white/10 hover:border-white/30 text-xs text-[#b8b09f] hover:text-white transition-colors flex items-center gap-1.5"
            title="Reset to factory demo data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-5 py-2 rounded-full bg-[#201518] border border-rose-900/60 text-rose-300 hover:bg-rose-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#212433]">
        {[
          { key: 'overview', label: 'Overview', icon: Layers },
          { 
            key: 'vendorApplications', 
            label: `Vendor Onboarding (${vendorApplications.filter((v) => v.status === 'pending').length} Pending)`, 
            icon: Users 
          },
          { key: 'shops', label: `Local Shops (${shops.length})`, icon: Store },
          { key: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
          { key: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { key: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar },
          { key: 'products', label: `Products & Stock (${products.length})`, icon: Sparkles },
          { key: 'coupons', label: `Coupons (${coupons.length})`, icon: Percent },
          { key: 'store', label: 'Store & Slots Settings', icon: SettingsIcon },
          { key: 'gallery', label: `Gallery Media (${gallery.length})`, icon: ImageIcon },
          { key: 'database', label: 'Supabase & SQL', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-semibold tracking-wider transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#181a26] text-[#d4af37] border-t-2 border-[#d4af37] font-bold shadow-lg'
                  : 'text-[#9c9585] hover:text-white hover:bg-[#131520]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="p-5 rounded-2xl bg-[#12141e] border border-[#212536] space-y-2">
              <span className="text-[10px] text-[#8e8777] uppercase font-bold tracking-wider block">
                Total Orders
              </span>
              <span className="font-heading text-3xl font-extrabold text-[#d4af37] block">
                {stats.totalOrders}
              </span>
              <span className="text-[10px] text-emerald-400 block">{stats.deliveredOrders} delivered</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141e] border border-[#212536] space-y-2">
              <span className="text-[10px] text-[#8e8777] uppercase font-bold tracking-wider block">
                E-Comm Revenue
              </span>
              <span className="font-heading text-2xl font-extrabold text-white block">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-[#8e8777] block">From {orders.length} transactions</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141e] border border-[#212536] space-y-2">
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">
                Pending COD
              </span>
              <span className="font-heading text-2xl font-extrabold text-amber-400 block">
                ₹{stats.pendingCodRevenue.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-[#8e8777] block">To collect on delivery</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141e] border border-[#212536] space-y-2">
              <span className="text-[10px] text-[#8e8777] uppercase font-bold tracking-wider block">
                Active Bookings
              </span>
              <span className="font-heading text-3xl font-extrabold text-white block">
                {stats.totalAppointments}
              </span>
              <span className="text-[10px] text-[#d4af37] block">{stats.todayCount} scheduled today</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141e] border border-[#212536] space-y-2">
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">
                Active Outfits
              </span>
              <span className="font-heading text-3xl font-extrabold text-emerald-400 block">
                {products.filter(p => p.active).length}
              </span>
              <span className="text-[10px] text-[#8e8777] block">In BTM stock</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141e] border border-[#212536] space-y-2">
              <span className="text-[10px] text-[#8e8777] uppercase font-bold tracking-wider block">
                Live Coupons
              </span>
              <span className="font-heading text-3xl font-extrabold text-white block">
                {coupons.filter(c => c.active).length}
              </span>
              <span className="text-[10px] text-[#8e8777] block">Discount promos</span>
            </div>
          </div>

          {/* Quick Actions & Recent Activity Dual Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders Overview */}
            <div className="p-6 rounded-2xl bg-[#12141e] border border-[#212536] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                  <span>Recent Customer Orders</span>
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#d4af37] hover:underline"
                >
                  View All Orders
                </button>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 4).map((ord) => (
                  <div
                    key={ord.orderId}
                    className="p-3 rounded-xl bg-[#171926] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#d4af37]">{ord.orderId}</span>
                        <span className="text-[#8e8777]">• {ord.customerName}</span>
                      </div>
                      <p className="text-[11px] text-[#8e8777] mt-0.5">
                        {ord.items.length} items • ₹{ord.totalAmount.toLocaleString('en-IN')} ({ord.paymentMethod})
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] text-[10px] font-semibold">
                      {ord.orderStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Styling Appointments */}
            <div className="p-6 rounded-2xl bg-[#12141e] border border-[#212536] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                  <span>Upcoming In-Store Bookings</span>
                </h3>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="text-xs text-[#d4af37] hover:underline"
                >
                  View All Bookings
                </button>
              </div>

              <div className="space-y-3">
                {appointments.slice(0, 4).map((app) => (
                  <div
                    key={app.bookingId}
                    className="p-3 rounded-xl bg-[#171926] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#d4af37]">{app.bookingId}</span>
                        <span className="text-[#f5f2eb]">• {app.customerName}</span>
                      </div>
                      <p className="text-[11px] text-[#8e8777] mt-0.5">
                        {app.appointmentDate} at {app.appointmentTime} ({app.shoppingCategory})
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      app.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: VENDOR APPLICATIONS & ONBOARDING */}
      {activeTab === 'vendorApplications' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#12141e] border border-[#232738]">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7f786a]" />
              <input
                type="text"
                placeholder="Search by shop, owner, phone or email..."
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
                className="w-full bg-[#181a26] border border-[#2c3042] text-xs text-white placeholder-[#7f786a] pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setVendorStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                    vendorStatusFilter === st
                      ? 'bg-[#d4af37] text-black shadow-md'
                      : 'bg-[#181a26] text-[#908878] hover:text-white border border-[#232738]'
                  }`}
                >
                  {st} ({st === 'all' ? vendorApplications.length : vendorApplications.filter((v) => v.status === st).length})
                </button>
              ))}
            </div>
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#12141e] border border-[#232738]">
              <Users className="w-12 h-12 text-[#9a9486] mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold text-white">No vendor applications found</p>
              <p className="text-xs text-[#9a9486] mt-1">Vendors will appear here as soon as they submit registration.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <div
                  key={app.applicationId}
                  className="p-5 rounded-2xl bg-[#12141e] border border-[#232738] hover:border-[#2f354c] transition-all space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1c1f2e] pb-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-heading text-lg font-bold text-white">{app.shopName}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : app.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#a29b8c] mt-0.5">
                        Owner: <strong className="text-white">{app.ownerName}</strong> • Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-2">
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approveVendorApplication(app.applicationId)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Publish</span>
                          </button>
                          <button
                            onClick={() => {
                              setRejectModalAppId(app.applicationId);
                              setRejectReasonInput('');
                            }}
                            className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-semibold text-xs transition-colors flex items-center gap-1.5"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      {app.status === 'approved' && (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Active on Marketplace</span>
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="text-xs text-rose-400">
                          Reason: {app.rejectionReason || 'Requirements not met'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-[#171926] space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#8e8777] block">Contact Information</span>
                      <p className="text-white flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[#d4af37]" />
                        <span>{app.phone}</span>
                      </p>
                      <p className="text-[#a0998c]">Email: {app.email}</p>
                      {app.whatsapp && (
                        <p className="text-emerald-400">WhatsApp: {app.whatsapp}</p>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-[#171926] space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#8e8777] block">Store Location</span>
                      <p className="text-white flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#d4af37]" />
                        <span>{app.address}</span>
                      </p>
                      <p className="text-[#a0998c]">{app.city} {app.pincode ? `• PIN: ${app.pincode}` : ''}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#171926] space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#8e8777] block">Business Details</span>
                      <p className="text-white">Categories: {app.categories?.join(', ') || 'General'}</p>
                      {app.gstNumber && <p className="text-[#a0998c]">GSTIN: {app.gstNumber}</p>}
                      {app.panNumber && <p className="text-[#a0998c]">PAN: {app.panNumber}</p>}
                    </div>
                  </div>

                  {app.businessDescription && (
                    <div className="text-xs text-[#a29b8c] bg-[#151724] p-3 rounded-xl">
                      <strong className="text-white">Store Bio:</strong> {app.businessDescription}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: SHOPS DIRECTORY MODERATION */}
      {activeTab === 'shops' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#12141e] border border-[#232738]">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7f786a]" />
              <input
                type="text"
                placeholder="Search shops by name, category or area..."
                value={shopSearch}
                onChange={(e) => setShopSearch(e.target.value)}
                className="w-full bg-[#181a26] border border-[#2c3042] text-xs text-white placeholder-[#7f786a] pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div className="text-xs text-[#9a9486]">
              Total Verified Stores: <strong className="text-white">{shops.length}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredShopsList.map((shop) => (
              <div
                key={shop.shopId}
                className="p-5 rounded-2xl bg-[#12141e] border border-[#232738] hover:border-[#2f354c] transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] bg-[#1a1e2e] px-2.5 py-0.5 rounded-full border border-[#2a3048]">
                      {shop.category || 'Retail Store'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      shop.status === 'suspended'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {shop.status || 'Active'}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-white mt-2">{shop.shopName}</h3>
                  <p className="text-xs text-[#9a9486] line-clamp-2 mt-1">{shop.description}</p>

                  <div className="flex items-center gap-3 text-xs text-[#b8b09f] mt-3">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{shop.rating || '5.0'}</span>
                    </span>
                    <span>•</span>
                    <span>{shop.reviewCount || 0} Reviews</span>
                    <span>•</span>
                    <span className="text-white font-medium">{shop.area || shop.city}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1c1f2e] space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => toggleShopStatus(shop.shopId, shop.status === 'approved' ? 'suspended' : 'approved')}
                      className={`py-1.5 rounded-lg font-semibold transition-colors ${
                        shop.status === 'suspended'
                          ? 'bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/40'
                          : 'bg-rose-950/60 text-rose-300 hover:bg-rose-950'
                      }`}
                    >
                      {shop.status === 'suspended' ? 'Activate' : 'Suspend'}
                    </button>
                    <button
                      onClick={() => toggleShopFeatured(shop.shopId)}
                      className={`py-1.5 rounded-lg font-semibold border transition-colors ${
                        shop.featured
                          ? 'bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/40'
                          : 'bg-[#181a26] text-[#8e8777] border-[#2c3042] hover:text-white'
                      }`}
                    >
                      {shop.featured ? '★ Featured' : 'Feature'}
                    </button>
                  </div>

                  <a
                    href={`/shop/${shop.shopId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-[#cfc7b8] hover:text-white bg-[#171926] rounded-lg transition-colors"
                  >
                    <span>View Live Storefront</span>
                    <ExternalLink className="w-3 h-3 text-[#d4af37]" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#12141e] border border-[#232738]">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7f786a]" />
              <input
                type="text"
                placeholder="Search reviews by customer, shop or words..."
                value={reviewSearch}
                onChange={(e) => setReviewSearch(e.target.value)}
                className="w-full bg-[#181a26] border border-[#2c3042] text-xs text-white placeholder-[#7f786a] pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div className="text-xs text-[#9a9486]">
              Total Customer Reviews: <strong className="text-white">{reviews.length}</strong>
            </div>
          </div>

          <div className="space-y-3">
            {filteredReviewsList.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-[#12141e] border border-[#232738] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{rev.customerName}</span>
                    <span className="text-[#8e8777] text-xs">reviewed</span>
                    <span className="font-semibold text-[#d4af37] text-xs">{rev.shopName}</span>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#c7bfb0] italic">"{rev.comment}"</p>
                  <p className="text-[10px] text-[#716b5e]">{new Date(rev.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    rev.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : rev.status === 'flagged'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {rev.status}
                  </span>
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => moderateReview(rev.id, 'approved')}
                      className="px-3 py-1 bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 rounded-lg text-xs font-semibold"
                    >
                      Approve
                    </button>
                  )}
                  {rev.status !== 'flagged' && (
                    <button
                      onClick={() => moderateReview(rev.id, 'flagged')}
                      className="px-3 py-1 bg-rose-950/60 text-rose-300 hover:bg-rose-950 rounded-lg text-xs font-semibold"
                    >
                      Flag / Hide
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reject Application Modal */}
      {rejectModalAppId && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#12141e] border border-[#2f3348] rounded-2xl p-6 space-y-4">
            <h4 className="font-heading text-lg font-bold text-white">Reject Vendor Application</h4>
            <p className="text-xs text-[#9a9486]">
              Please provide a reason for rejection. The applicant will be notified.
            </p>
            <textarea
              rows={3}
              value={rejectReasonInput}
              onChange={(e) => setRejectReasonInput(e.target.value)}
              placeholder="e.g. Incomplete GST credentials or invalid address proof..."
              className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalAppId(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#9a9486] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await rejectVendorApplication(rejectModalAppId, rejectReasonInput);
                  setRejectModalAppId(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#12141e] border border-[#232738]">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7f786a]" />
              <input
                type="text"
                placeholder="Search Order ID, patron name, phone, PIN..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#686255] focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-xs text-[#8e8777] whitespace-nowrap">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-[#181a26] border border-[#2c3042] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="all">All ({orders.length})</option>
                {ALL_ORDER_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st} ({orders.filter((o) => o.orderStatus === st).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#12141e] border border-dashed border-[#232738] space-y-3">
              <ShoppingBag className="w-10 h-10 text-[#686052] mx-auto" />
              <h4 className="font-heading text-base font-bold text-white">No Orders Found</h4>
              <p className="text-xs text-[#8e8777]">Try adjusting your search query or status filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isCod = order.paymentMethod === 'COD';
                const isCodPending = isCod && order.paymentStatus === 'pending';

                return (
                  <div
                    key={order.orderId}
                    className="p-6 rounded-2xl bg-[#12141e] border border-[#232738] hover:border-[#2f334a] transition-all space-y-4"
                  >
                    {/* Top Row: Order ID, Patron, Status, Price */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1f2231]">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-base font-bold text-[#d4af37]">{order.orderId}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30'
                          }`}>
                            {order.orderStatus}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#1c1e2e] text-[10px] font-mono text-[#8e8777]">
                            {order.paymentMethod} • {order.paymentStatus.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#a0998c] mt-1.5">
                          <span>Patron: <strong className="text-white">{order.customerName}</strong></span>
                          <span>Phone: <a href={`tel:${order.phone}`} className="text-[#d4af37] hover:underline">{order.phone}</a></span>
                          <span>Placed: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      {/* Financial Total & Actions */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-[#8e8777] block">Order Total</span>
                          <span className="font-heading text-lg font-bold text-[#d4af37]">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Status Transition Button */}
                        <button
                          onClick={() => setStatusUpdateModal({
                            order,
                            newStatus: order.orderStatus,
                            note: '',
                            carrier: order.carrier || 'FashTag BTM Dispatch',
                            trackingNumber: order.trackingNumber || `FT-LOG-${order.orderId.slice(-4)}`
                          })}
                          className="px-4 py-2 rounded-xl bg-[#1b1e2c] border border-[#2e334a] text-xs font-semibold text-[#f5f2eb] hover:border-[#d4af37] hover:text-[#d4af37] transition-all flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>Update Stage</span>
                        </button>

                        {/* Details Modal Button */}
                        <button
                          onClick={() => setSelectedOrderForDetails(order)}
                          className="px-3 py-2 rounded-xl bg-[#1b1e2c] text-[#cfc7b8] hover:text-white transition-colors"
                          title="View Full Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Mark COD Paid Button if pending COD */}
                        {isCodPending && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Mark COD payment of ₹${order.totalAmount} as COLLECTED for ${order.orderId}?`)) {
                                updateOrderPaymentStatus(order.orderId, 'completed');
                              }
                            }}
                            className="px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold hover:bg-emerald-500 hover:text-black transition-all"
                          >
                            Mark COD Paid
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Middle: Items & Shipping address snippet */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-2">
                        <span className="text-[10px] text-[#8e8777] uppercase font-bold tracking-wider block">
                          Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-[#171926] border border-[#212433]">
                              <img src={it.imageUrl} alt={it.productName} className="w-8 h-10 object-cover rounded" />
                              <div className="text-[11px]">
                                <p className="text-white font-medium truncate max-w-[150px]">{it.productName}</p>
                                <p className="text-[#8e8777]">{it.size} • {it.color} (x{it.quantity})</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1 text-[#9c9586]">
                        <span className="text-[10px] text-[#8e8777] uppercase font-bold tracking-wider block">
                          Delivery Destination
                        </span>
                        <p className="text-white font-medium">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.houseNumber}, {order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
                        {order.shippingAddress.deliveryInstructions && (
                          <p className="text-[11px] text-[#d4af37] italic">Note: "{order.shippingAddress.deliveryInstructions}"</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: APPOINTMENT MANAGEMENT */}
      {activeTab === 'appointments' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#12141e] border border-[#232738]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7f786a]" />
              <input
                type="text"
                placeholder="Search name, phone, or FT-BTM ID..."
                value={appointmentSearch}
                onChange={(e) => setAppointmentSearch(e.target.value)}
                className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#686255] focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <select
                value={appointmentStatusFilter}
                onChange={(e) => setAppointmentStatusFilter(e.target.value)}
                className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="all">All Statuses ({appointments.length})</option>
                <option value="confirmed">Confirmed Only</option>
                <option value="pending">Pending Approval</option>
                <option value="cancelled">Cancelled / Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <input
                type="date"
                value={appointmentDateFilter}
                onChange={(e) => setAppointmentDateFilter(e.target.value)}
                className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Appointments Table */}
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#12141e] border border-dashed border-[#232738] space-y-3">
              <Calendar className="w-10 h-10 text-[#686052] mx-auto" />
              <h4 className="font-heading text-base font-bold text-white">No Appointments Found</h4>
              <p className="text-xs text-[#8e8777]">Try clearing your search query or date filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((app) => (
                <div
                  key={app.bookingId}
                  className="p-5 rounded-2xl bg-[#12141e] border border-[#232738] hover:border-[#2f334a] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#d4af37]">{app.bookingId}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        app.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : app.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {app.status}
                      </span>
                      <span className="text-xs text-[#9c9586]">({app.shoppingCategory})</span>
                    </div>

                    <h4 className="font-heading text-base font-bold text-white">
                      {app.customerName}
                    </h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#9c9586]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{app.appointmentDate} at {app.appointmentTime}</span>
                      </span>
                      <span>{app.visitorCount} Guest{app.visitorCount > 1 ? 's' : ''}</span>
                      <a href={`tel:${app.phone}`} className="text-[#d4af37] hover:underline">{app.phone}</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAppointmentForDetails(app)}
                      className="px-3.5 py-2 rounded-xl bg-[#1a1d2c] text-xs text-white hover:border-[#d4af37] border border-[#292e44]"
                    >
                      Details
                    </button>

                    {app.status !== 'confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(app.bookingId, 'confirmed')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400"
                      >
                        Confirm
                      </button>
                    )}

                    {app.status !== 'cancelled' && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Cancel booking ${app.bookingId}?`)) {
                            updateAppointmentStatus(app.bookingId, 'cancelled');
                          }
                        }}
                        className="px-3 py-2 rounded-xl border border-rose-500/40 text-rose-400 text-xs hover:bg-rose-500/10"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={() => setRescheduleData({ appointment: app, newDate: app.appointmentDate, newTime: app.appointmentTime })}
                      className="px-3 py-2 rounded-xl bg-[#1a1d2c] text-xs text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PRODUCTS & STOCK MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-xl font-bold text-white">
                Catalog & Inventory Management
              </h3>
              <p className="text-xs text-[#8f8879]">
                Adjust live stock counts, pricing, sizes, and visibility across all categories.
              </p>
            </div>

            <button
              onClick={() => setIsAddingProduct(!isAddingProduct)}
              className="px-5 py-2.5 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#e0c260] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingProduct ? 'Cancel' : 'Add New Outfit'}</span>
            </button>
          </div>

          {/* Add Product Form */}
          {isAddingProduct && (
            <form onSubmit={handleCreateProduct} className="p-6 rounded-2xl bg-[#141624] border border-[#2b3046] space-y-4 text-xs">
              <h4 className="font-heading text-base font-bold text-white">Add New Fashion Product</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#cfc7b7] mb-1 font-semibold">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Oxford Linen Blazer"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#cfc7b7] mb-1 font-semibold">Category *</label>
                  <select
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value as any)}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                  >
                    <option value="Men's Fashion">Men's Fashion</option>
                    <option value="Women's Fashion">Women's Fashion</option>
                    <option value="Kids' Fashion">Kids' Fashion</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Shirts & Jeans">Shirts & Jeans</option>
                    <option value="Casual Wear">Casual Wear</option>
                    <option value="Party Wear">Party Wear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#cfc7b7] mb-1 font-semibold">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#cfc7b7] mb-1 font-semibold">Original Price / MRP (₹)</label>
                  <input
                    type="number"
                    min="100"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#cfc7b7] mb-1 font-semibold">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#cfc7b7] mb-1 font-semibold">Fabric Type</label>
                  <input
                    type="text"
                    value={newProdFabric}
                    onChange={(e) => setNewProdFabric(e.target.value)}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#cfc7b7] mb-1 font-semibold">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#cfc7b7] mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-[#cfc7b7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdFeatured}
                    onChange={(e) => setNewProdFeatured(e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  <span>Mark as Featured Hero Pick</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 rounded-full border border-white/10 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#d4af37] text-black font-bold uppercase tracking-wider"
                >
                  Save Outfit
                </button>
              </div>
            </form>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.productId}
                className="rounded-2xl overflow-hidden bg-[#12141f] border border-[#232636] flex flex-col justify-between p-5 space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img src={p.imageUrl} alt={p.productName} className="w-20 h-24 object-cover rounded-xl bg-black" />
                  <div className="flex-1 min-w-0 space-y-1 text-xs">
                    <span className="px-2 py-0.5 rounded bg-black/60 text-[#d4af37] text-[10px] font-bold">
                      {p.category}
                    </span>
                    <h4 className="font-heading text-sm font-bold text-white truncate">{p.productName}</h4>
                    <p className="text-[#d4af37] font-bold">₹{p.price.toLocaleString('en-IN')}</p>
                    <p className="text-[11px] text-[#8e8777]">Sizes: {p.sizes.join(', ')}</p>
                  </div>
                </div>

                {/* Stock Controls */}
                <div className="p-3 rounded-xl bg-[#181a26] flex items-center justify-between text-xs">
                  <span className="text-[#8e8777]">Stock in BTM Store:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateProductStock(p.productId, Math.max(0, p.stock - 1))}
                      className="w-7 h-7 rounded bg-[#202436] text-white font-bold flex items-center justify-center hover:bg-[#2b3048]"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-white min-w-[24px] text-center">{p.stock}</span>
                    <button
                      onClick={() => updateProductStock(p.productId, p.stock + 1)}
                      className="w-7 h-7 rounded bg-[#202436] text-white font-bold flex items-center justify-center hover:bg-[#2b3048]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-[#1e2233] flex items-center justify-between text-xs">
                  <button
                    onClick={() => toggleProductActive(p.productId)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      p.active ? 'bg-emerald-950 text-emerald-400' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {p.active ? 'Active in Shop' : 'Hidden'}
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${p.productName}"?`)) {
                        deleteProduct(p.productId);
                      }
                    }}
                    className="text-rose-400 hover:text-rose-300 p-1"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: COUPONS & DISCOUNTS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-xl font-bold text-white">
                Promotional Coupons & Vouchers
              </h3>
              <p className="text-xs text-[#8f8879]">
                Create discount codes for retail campaigns, new patrons, or festive sales.
              </p>
            </div>

            <button
              onClick={() => setIsAddingCoupon(!isAddingCoupon)}
              className="px-5 py-2.5 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingCoupon ? 'Cancel' : 'Create Coupon'}</span>
            </button>
          </div>

          {/* Add Coupon Form */}
          {isAddingCoupon && (
            <form onSubmit={handleCreateCouponSubmit} className="p-6 rounded-2xl bg-[#141624] border border-[#2b3046] space-y-4 text-xs">
              <h4 className="font-heading text-base font-bold text-white">Create New Promotional Code</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#cfc7b7] mb-1 font-semibold">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FESTIVE20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[#cfc7b7] mb-1 font-semibold">Discount Type *</label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as any)}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹ INR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#cfc7b7] mb-1 font-semibold">Value * ({couponType === 'percentage' ? '%' : '₹'})</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={couponValue}
                    onChange={(e) => setCouponValue(Number(e.target.value))}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#cfc7b7] mb-1 font-semibold">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={couponMinOrder}
                    onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#cfc7b7] mb-1 font-semibold">Max Cap / Ceiling (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={couponMaxDiscount}
                    onChange={(e) => setCouponMaxDiscount(Number(e.target.value))}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#cfc7b7] mb-1 font-semibold">Expiry Date</label>
                  <input
                    type="date"
                    value={couponExpiry}
                    onChange={(e) => setCouponExpiry(e.target.value)}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#cfc7b7] mb-1 font-semibold">Description / Label</label>
                <input
                  type="text"
                  placeholder="e.g. 10% Off on orders above ₹1,999"
                  value={couponDesc}
                  onChange={(e) => setCouponDesc(e.target.value)}
                  className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCoupon(false)}
                  className="px-4 py-2 rounded-full border border-white/10 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#d4af37] text-black font-bold uppercase"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          )}

          {/* Coupons List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-[#12141f] border border-[#232636] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-[#d4af37] px-2 py-0.5 rounded bg-black/60 border border-[#d4af37]/40">
                      {c.code}
                    </span>
                    <button
                      onClick={() => toggleCouponActive(c.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {c.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <p className="text-xs text-white font-medium mt-2">{c.description}</p>
                  <p className="text-[11px] text-[#8e8777] mt-1">
                    Min Cart: ₹{c.minOrderAmount} • Expiry: {c.expiryDate}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1e2233] text-xs">
                  <span className="text-[10px] text-[#8e8777]">Used: {c.usedCount || 0} times</span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete coupon ${c.code}?`)) {
                        deleteCoupon(c.id);
                      }
                    }}
                    className="text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: STORE SETTINGS */}
      {activeTab === 'store' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-2xl bg-[#12141e] border border-[#212433] space-y-6">
            <h3 className="font-heading text-lg font-bold text-white">General Retail Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#cfc7b7] mb-1 font-semibold">Store Brand Name</label>
                <input
                  type="text"
                  value={storeForm.businessName}
                  onChange={(e) => setStoreForm({ ...storeForm, businessName: e.target.value })}
                  className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#cfc7b7] mb-1 font-semibold">Primary Phone</label>
                <input
                  type="text"
                  value={storeForm.phone}
                  onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                  className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#cfc7b7] mb-1 font-semibold">Free Delivery Order Threshold (₹)</label>
                <input
                  type="number"
                  value={storeForm.freeShippingThreshold}
                  onChange={(e) => setStoreForm({ ...storeForm, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#cfc7b7] mb-1 font-semibold">Standard Shipping Fee (₹)</label>
                <input
                  type="number"
                  value={storeForm.standardShippingFee}
                  onChange={(e) => setStoreForm({ ...storeForm, standardShippingFee: Number(e.target.value) })}
                  className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl px-4 py-2.5 text-white"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-[#cfc7b7] mb-1 font-semibold">Store Physical Address</label>
              <input
                type="text"
                value={storeForm.address}
                onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl px-4 py-2.5 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider"
            >
              Save Configuration
            </button>
          </div>
        </form>
      )}

      {/* TAB 7: GALLERY MANAGEMENT */}
      {activeTab === 'gallery' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl font-bold text-white">Gallery Media</h3>
            <button
              onClick={() => setIsAddingGallery(!isAddingGallery)}
              className="px-5 py-2.5 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase"
            >
              {isAddingGallery ? 'Cancel' : 'Add Photo'}
            </button>
          </div>

          {isAddingGallery && (
            <form onSubmit={handleCreateGalleryItem} className="p-6 rounded-2xl bg-[#141624] border border-[#2b3046] space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Photo Title"
                  value={newGalTitle}
                  onChange={(e) => setNewGalTitle(e.target.value)}
                  className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2 text-white"
                />
                <input
                  type="url"
                  required
                  placeholder="Image URL"
                  value={newGalUrl}
                  onChange={(e) => setNewGalUrl(e.target.value)}
                  className="w-full bg-[#1b1e2c] border border-[#2b2f42] rounded-xl px-4 py-2 text-white"
                />
              </div>
              <button type="submit" className="px-5 py-2 rounded-full bg-[#d4af37] text-black font-bold">
                Save Photo
              </button>
            </form>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((g) => (
              <div key={g.imageId} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => deleteGalleryItem(g.imageId)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: DATABASE / SUPABASE */}
      {activeTab === 'database' && (
        <div className="p-6 rounded-2xl bg-[#12141e] border border-[#232738] space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-[#d4af37]" />
                <span>Supabase PostgreSQL Marketplace Architecture</span>
              </h3>
              <p className="text-xs text-[#9a9486] mt-0.5">
                Tables: <code className="text-[#d4af37]">profiles</code>, <code className="text-[#d4af37]">categories</code>, <code className="text-[#d4af37]">shops</code>, <code className="text-[#d4af37]">products</code>, <code className="text-[#d4af37]">offers</code>, <code className="text-[#d4af37]">reviews</code>, <code className="text-[#d4af37]">enquiries</code>, <code className="text-[#d4af37]">appointments</code>, <code className="text-[#d4af37]">orders</code>
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[11px] self-start sm:self-auto">
              Project: {SUPABASE_PROJECT_ID}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#171926] space-y-2">
            <p className="text-[#a0998c]">
              API Endpoint: <code className="text-[#d4af37] font-mono">{SUPABASE_URL}</code>
            </p>
            <p className="text-[#8e8777]">
              All marketplace vendor registrations, product catalogues, customer enquiries, reviews, and appointments are stored locally with offline resiliency and synchronized with your connected Supabase database.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-semibold text-white">Full Marketplace SQL Migration (DDL, Indexes, RLS Policies & Seed Data):</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202436] text-[#d4af37] hover:text-white border border-[#2d3246]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Migration'}</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-[#0d0e14] border border-[#202436] font-mono text-[11px] text-[#cfc7b7] overflow-x-auto max-h-80 leading-relaxed">
              {SUPABASE_SCHEMA_SQL}
            </pre>
            <p className="text-[11px] text-[#8e8777]">
              To execute: Open your Supabase Dashboard &gt; SQL Editor &gt; paste this script &gt; click Run. A copy is also saved to <code className="text-[#d4af37]">supabase-marketplace-migration.sql</code> in the project root.
            </p>
          </div>
        </div>
      )}

      {/* Order Status Update Modal */}
      {statusUpdateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#12141e] border border-[#2f3348] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#25283a] pb-3">
              <div>
                <span className="text-[10px] text-[#d4af37] font-mono font-bold uppercase">
                  Update Logistics • {statusUpdateModal.order.orderId}
                </span>
                <h4 className="font-heading text-lg font-bold text-white">
                  {statusUpdateModal.order.customerName}
                </h4>
              </div>
              <button onClick={() => setStatusUpdateModal(null)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#cfc7b7] mb-1 font-semibold">New Order Stage</label>
                <select
                  value={statusUpdateModal.newStatus}
                  onChange={(e) => setStatusUpdateModal({ ...statusUpdateModal, newStatus: e.target.value as OrderStatus })}
                  className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl px-4 py-2.5 text-white"
                >
                  {ALL_ORDER_STATUSES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#cfc7b7] mb-1 font-semibold">Courier / Dispatch Partner</label>
                <input
                  type="text"
                  value={statusUpdateModal.carrier}
                  onChange={(e) => setStatusUpdateModal({ ...statusUpdateModal, carrier: e.target.value })}
                  placeholder="e.g. FashTag BTM Express / BlueDart"
                  className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#cfc7b7] mb-1 font-semibold">Tracking Number</label>
                <input
                  type="text"
                  value={statusUpdateModal.trackingNumber}
                  onChange={(e) => setStatusUpdateModal({ ...statusUpdateModal, trackingNumber: e.target.value })}
                  placeholder="e.g. FT-EXP-9841266"
                  className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl px-4 py-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[#cfc7b7] mb-1 font-semibold">Status Update Note for Customer</label>
                <input
                  type="text"
                  value={statusUpdateModal.note}
                  onChange={(e) => setStatusUpdateModal({ ...statusUpdateModal, note: e.target.value })}
                  placeholder="e.g. Dispatched from BTM 1st Stage store hub"
                  className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl px-4 py-2.5 text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#25283a] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setStatusUpdateModal(null)}
                className="px-4 py-2 rounded-full border border-white/10 text-xs text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteOrderStatusUpdate}
                className="px-5 py-2 rounded-full bg-[#d4af37] text-black font-bold text-xs"
              >
                Apply Stage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrderForDetails && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-[#12141e] border border-[#2f3348] rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#25283a] pb-3">
              <div>
                <span className="text-[10px] text-[#d4af37] font-mono font-bold uppercase">
                  Order Invoice & Parcel Breakdown
                </span>
                <h4 className="font-heading text-lg font-bold text-white">
                  {selectedOrderForDetails.orderId}
                </h4>
              </div>
              <button onClick={() => setSelectedOrderForDetails(null)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#171926] space-y-1">
                <p><strong className="text-white">Patron:</strong> {selectedOrderForDetails.customerName}</p>
                <p><strong className="text-white">Phone:</strong> {selectedOrderForDetails.phone}</p>
                <p><strong className="text-white">Email:</strong> {selectedOrderForDetails.email}</p>
                <p><strong className="text-white">Delivery Address:</strong> {selectedOrderForDetails.shippingAddress.houseNumber}, {selectedOrderForDetails.shippingAddress.street}, {selectedOrderForDetails.shippingAddress.city} - {selectedOrderForDetails.shippingAddress.pinCode}</p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-white block">Items:</span>
                {selectedOrderForDetails.items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#171926]">
                    <span>{it.productName} ({it.size}, {it.color}) x {it.quantity}</span>
                    <span className="font-mono text-[#d4af37]">₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#25283a] space-y-1 text-right">
                <p className="text-[#8e8777]">Subtotal: ₹{selectedOrderForDetails.subtotal.toLocaleString('en-IN')}</p>
                {selectedOrderForDetails.discount > 0 && (
                  <p className="text-rose-400">Discount: -₹{selectedOrderForDetails.discount.toLocaleString('en-IN')}</p>
                )}
                <p className="text-[#8e8777]">Delivery: {selectedOrderForDetails.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrderForDetails.deliveryCharge}`}</p>
                <p className="text-base font-bold text-[#d4af37]">Total: ₹{selectedOrderForDetails.totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#25283a] flex justify-end">
              <button
                onClick={() => setSelectedOrderForDetails(null)}
                className="px-5 py-2 rounded-full bg-[#1b1e2c] text-xs text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointmentForDetails && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#12141e] border border-[#2f3348] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#25283a] pb-3">
              <div>
                <span className="text-[10px] text-[#d4af37] font-mono font-bold uppercase">
                  Booking Slip • {selectedAppointmentForDetails.bookingId}
                </span>
                <h4 className="font-heading text-lg font-bold text-white">
                  {selectedAppointmentForDetails.customerName}
                </h4>
              </div>
              <button onClick={() => setSelectedAppointmentForDetails(null)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#a0998c]">
              <p><strong className="text-white">Date & Time:</strong> {selectedAppointmentForDetails.appointmentDate} at {selectedAppointmentForDetails.appointmentTime}</p>
              <p><strong className="text-white">Category:</strong> {selectedAppointmentForDetails.shoppingCategory}</p>
              <p><strong className="text-white">Party Size:</strong> {selectedAppointmentForDetails.visitorCount} Person(s)</p>
              <p><strong className="text-white">Contact Phone:</strong> {selectedAppointmentForDetails.phone}</p>
              {selectedAppointmentForDetails.additionalRequirements && (
                <p><strong className="text-white">Notes:</strong> "{selectedAppointmentForDetails.additionalRequirements}"</p>
              )}
            </div>

            <div className="pt-3 border-t border-[#25283a] flex justify-end">
              <button
                onClick={() => setSelectedAppointmentForDetails(null)}
                className="px-5 py-2 rounded-full bg-[#1b1e2c] text-xs text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleData && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#12141e] border border-[#2f3348] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#25283a] pb-3">
              <div>
                <span className="text-[10px] text-[#d4af37] font-mono font-bold uppercase">
                  Reschedule {rescheduleData.appointment.bookingId}
                </span>
                <h4 className="font-heading text-lg font-bold text-white">
                  {rescheduleData.appointment.customerName}
                </h4>
              </div>
              <button onClick={() => setRescheduleData(null)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#cfc7b7] mb-1 font-semibold">New Appointment Date</label>
                <input
                  type="date"
                  min={todayYMD}
                  value={rescheduleData.newDate}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, newDate: e.target.value })}
                  className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#cfc7b7] mb-1 font-semibold">New Appointment Time</label>
                <select
                  value={rescheduleData.newTime}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, newTime: e.target.value })}
                  className="w-full bg-[#181a26] border border-[#2c3042] rounded-xl px-4 py-2.5 text-white"
                >
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="12:30 PM">12:30 PM (Sat/Sun/Mon-Thu)</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="07:00 PM">07:00 PM</option>
                  <option value="08:00 PM">08:00 PM</option>
                  <option value="09:00 PM">09:00 PM</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[#25283a] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setRescheduleData(null)}
                className="px-4 py-2 rounded-full border border-white/10 text-xs text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReschedule}
                className="px-5 py-2 rounded-full bg-[#d4af37] text-black font-bold text-xs"
              >
                Save New Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
