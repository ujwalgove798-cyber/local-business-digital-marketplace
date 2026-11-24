import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  StoreSettings, 
  Product, 
  GalleryItem, 
  Appointment, 
  AdminUser, 
  ShoppingCategory, 
  AppointmentStatus,
  CartItem,
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Coupon,
  CustomerAddress,
  CustomerUser,
  ProductSize,
  Shop,
  VendorApplication,
  Enquiry,
  UserProfile,
  UserRole,
  MarketplaceReview,
  MarketplaceOffer
} from '../types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_PRODUCTS, 
  INITIAL_GALLERY, 
  INITIAL_APPOINTMENTS,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_SHOPS,
  INITIAL_VENDOR_APPLICATIONS,
  INITIAL_ENQUIRIES,
  INITIAL_USER_PROFILES,
  INITIAL_OFFERS,
  INITIAL_MARKETPLACE_REVIEWS
} from '../data/initialData';
import { generateBookingId } from '../utils/bookingUtils';
import { 
  fetchAppointmentsFromSupabase, 
  saveAppointmentToSupabase, 
  updateAppointmentInSupabase,
  fetchOrdersFromSupabase,
  saveOrderToSupabase,
  updateOrderInSupabase,
  fetchShopsFromSupabase,
  saveShopToSupabase,
  updateShopInSupabase,
  fetchVendorApplicationsFromSupabase,
  saveVendorApplicationToSupabase,
  updateVendorApplicationInSupabase,
  fetchEnquiriesFromSupabase,
  saveEnquiryToSupabase,
  updateEnquiryStatusInSupabase,
  checkSupabaseStatus 
} from '../lib/supabase';

interface BookAppointmentPayload {
  customerName: string;
  phone: string;
  email?: string;
  visitorCount: number;
  shoppingCategory: ShoppingCategory;
  appointmentDate: string;
  appointmentTime: string;
  additionalRequirements?: string;
}

interface PlaceOrderPayload {
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: CustomerAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  settings: StoreSettings;
  products: Product[];
  gallery: GalleryItem[];
  appointments: Appointment[];
  orders: Order[];
  coupons: Coupon[];
  cart: CartItem[];
  wishlist: string[];
  customerAddresses: CustomerAddress[];
  customerUser: CustomerUser | null;
  currentUser: CustomerUser | null;
  adminUser: AdminUser | null;
  toasts: ToastMessage[];
  appliedCoupon: Coupon | null;
  supabaseStatus: {
    connected: boolean;
    appointmentsTableExists: boolean;
    ordersTableExists: boolean;
    error?: string;
  };

  // Cart actions
  addToCart: (product: Product, size: ProductSize, colorName: string, quantity?: number) => boolean;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTotal: number;

  // Coupon actions
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  createCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  toggleCouponActive: (couponId: string) => void;
  deleteCoupon: (couponId: string) => void;

  // Order actions
  placeOrder: (payload: PlaceOrderPayload) => Promise<Order>;
  updateOrderStatus: (
    orderId: string, 
    status: OrderStatus, 
    note?: string, 
    carrier?: string, 
    trackingNumber?: string
  ) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  updateOrderPaymentStatus: (orderId: string, status: PaymentStatus) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Wishlist actions
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Address actions
  saveAddress: (address: Omit<CustomerAddress, 'id'>) => void;
  saveCustomerAddress: (address: CustomerAddress) => void;
  deleteAddress: (id: string) => void;
  deleteCustomerAddress: (id: string) => void;

  // Customer account actions
  loginCustomer: (name: string, phone: string, email: string) => void;
  logoutCustomer: () => void;

  // Toast notifications
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Existing Appointment actions (Preserved)
  bookAppointment: (payload: BookAppointmentPayload) => Promise<Appointment>;
  updateAppointmentStatus: (bookingId: string, status: AppointmentStatus, notes?: string) => void;
  rescheduleAppointment: (bookingId: string, newDate: string, newTime: string) => Promise<boolean>;
  getAppointmentById: (bookingId: string) => Appointment | undefined;

  // Admin & Store settings
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  addProduct: (product: Omit<Product, 'productId'>) => void;
  updateProduct: (product: Product) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  deleteProduct: (productId: string) => void;
  toggleProductActive: (productId: string) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'imageId' | 'createdAt'>) => void;
  deleteGalleryItem: (imageId: string) => void;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  resetToDefaults: () => void;
  refreshFromSupabase: () => Promise<void>;

  // Marketplace Multi-Vendor State
  shops: Shop[];
  vendorApplications: VendorApplication[];
  enquiries: Enquiry[];
  userProfile: UserProfile | null;
  currentVendorShop: Shop | null;

  // Marketplace Auth & Profiles
  loginUser: (email: string, role?: UserRole) => { success: boolean; user?: UserProfile; message?: string };
  loginWithDemoRole: (role: UserRole, targetShopId?: string) => void;
  logoutUser: () => void;
  registerCustomer: (data: { fullName: string; email: string; phone: string; password?: string }) => Promise<{ success: boolean; message: string }>;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Vendor Application & Onboarding
  registerVendorApplication: (data: Omit<VendorApplication, 'applicationId' | 'status' | 'submittedAt'>) => Promise<{ success: boolean; applicationId: string; message: string }>;
  approveVendorApplication: (applicationId: string) => Promise<{ success: boolean; message: string }>;
  rejectVendorApplication: (applicationId: string, reason?: string) => Promise<{ success: boolean; message: string }>;

  // Shop Management
  updateShopDetails: (shopId: string, updates: Partial<Shop>) => Promise<{ success: boolean; message: string }>;
  toggleShopStatus: (shopId: string, status: 'approved' | 'suspended') => Promise<void>;
  toggleShopFeatured: (shopId: string) => Promise<void>;
  getShopById: (shopId: string) => Shop | undefined;
  getProductsByShop: (shopId: string) => Product[];

  // Vendor Product Management
  addVendorProduct: (productData: Omit<Product, 'productId'>) => Promise<{ success: boolean; product: Product }>;
  updateVendorProduct: (productId: string, updates: Partial<Product>) => Promise<{ success: boolean }>;
  deleteVendorProduct: (productId: string) => Promise<{ success: boolean }>;

  // Customer Enquiries & WhatsApp Leads
  submitEnquiry: (data: Omit<Enquiry, 'enquiryId' | 'status' | 'createdAt'>) => Promise<{ success: boolean; message: string }>;
  updateEnquiryStatus: (enquiryId: string, status: 'new' | 'contacted' | 'resolved') => Promise<void>;

  // Marketplace Offers & Promotions
  offers: MarketplaceOffer[];
  addOffer: (offer: Omit<MarketplaceOffer, 'id'>) => Promise<{ success: boolean; offer: MarketplaceOffer }>;
  deleteOffer: (offerId: string) => Promise<{ success: boolean }>;
  toggleOfferActive: (offerId: string) => Promise<void>;

  // Marketplace Customer Reviews & Ratings
  reviews: MarketplaceReview[];
  addReview: (review: Omit<MarketplaceReview, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; message: string }>;
  moderateReview: (reviewId: string, status: 'approved' | 'pending' | 'flagged') => Promise<void>;

  // Location-Based Services
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'fashtag_store_settings_v2',
  PRODUCTS: 'fashtag_products_v3',
  GALLERY: 'fashtag_gallery_v2',
  APPOINTMENTS: 'fashtag_appointments_v2',
  ORDERS: 'fashtag_orders_v2',
  COUPONS: 'fashtag_coupons_v2',
  CART: 'fashtag_cart_v2',
  WISHLIST: 'fashtag_wishlist_v2',
  ADDRESSES: 'fashtag_addresses_v2',
  CUSTOMER_USER: 'fashtag_customer_user_v2',
  ADMIN_SESSION: 'fashtag_admin_auth_v2',
  SHOPS: 'fashtag_shops_v2',
  VENDOR_APPLICATIONS: 'fashtag_vendor_applications_v2',
  ENQUIRIES: 'fashtag_enquiries_v2',
  USER_PROFILE: 'fashtag_user_profile_v2',
  USER_PROFILES_LIST: 'fashtag_user_profiles_list_v2',
  OFFERS: 'marketplace_offers_v1',
  REVIEWS: 'marketplace_reviews_v1',
  SELECTED_LOCATION: 'marketplace_selected_location_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.phone && parsed.phone.includes('91647')) {
          parsed.phone = '+91 97398 41266';
          parsed.whatsapp = '919739841266';
        }
        return { ...INITIAL_SETTINGS, ...parsed };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // 2. Products - Strict demographic synchronization
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        const parsed: Product[] = JSON.parse(stored);
        const initialMap = new Map(INITIAL_PRODUCTS.map((p) => [p.productId, p]));
        const synced = parsed.map((p) => {
          const init = initialMap.get(p.productId);
          if (init) {
            return {
              ...p,
              gender: init.gender,
              category: init.category,
              subCategory: init.subCategory,
            };
          }
          return p;
        });
        const existingIds = new Set(synced.map((p) => p.productId));
        const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.productId));
        const merged = [...synced, ...missing];
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(merged));
        return merged;
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 3. Gallery
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GALLERY);
      return stored ? JSON.parse(stored) : INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  // 4. Appointments (Existing)
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return stored ? JSON.parse(stored) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  // 5. Orders (New)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return stored ? JSON.parse(stored) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // 6. Coupons (New)
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COUPONS);
      return stored ? JSON.parse(stored) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  // 7. Cart (New)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 8. Wishlist (New)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 9. Customer Addresses (New)
  const [customerAddresses, setCustomerAddresses] = useState<CustomerAddress[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
      return stored ? JSON.parse(stored) : [
        {
          id: 'addr-default',
          fullName: 'Vikramaditya Hegde',
          phone: '+91 97398 41266',
          houseNumber: 'Villa 12, Sobha Morzaria',
          street: 'Bannerghatta Main Road, Near BTM 1st Stage',
          city: 'Bengaluru',
          state: 'Karnataka',
          pinCode: '560029',
          isDefault: true,
          deliveryInstructions: 'Leave with concierge if unavailable.',
        }
      ];
    } catch {
      return [];
    }
  });

  // 10. Customer User (New)
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMER_USER);
      return stored ? JSON.parse(stored) : {
        id: 'cust-demo-1',
        name: 'Vikramaditya Hegde',
        email: 'vikram.hegde@example.com',
        phone: '+91 97398 41266',
        addresses: [],
        wishlist: [],
      };
    } catch {
      return null;
    }
  });

  // 11. Admin User
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // 12. Active Applied Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // 13. Supabase Status
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    appointmentsTableExists: boolean;
    ordersTableExists: boolean;
    error?: string;
  }>({
    connected: false,
    appointmentsTableExists: false,
    ordersTableExists: false,
  });

  // 14. Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 15. Marketplace: Shops
  const [shops, setShops] = useState<Shop[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SHOPS);
      return stored ? JSON.parse(stored) : INITIAL_SHOPS;
    } catch {
      return INITIAL_SHOPS;
    }
  });

  // 16. Marketplace: Vendor Applications
  const [vendorApplications, setVendorApplications] = useState<VendorApplication[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VENDOR_APPLICATIONS);
      return stored ? JSON.parse(stored) : INITIAL_VENDOR_APPLICATIONS;
    } catch {
      return INITIAL_VENDOR_APPLICATIONS;
    }
  });

  // 17. Marketplace: Enquiries
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return stored ? JSON.parse(stored) : INITIAL_ENQUIRIES;
    } catch {
      return INITIAL_ENQUIRIES;
    }
  });

  // 18. Marketplace: User Profiles (Demo registry)
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILES_LIST);
      return stored ? JSON.parse(stored) : INITIAL_USER_PROFILES;
    } catch {
      return INITIAL_USER_PROFILES;
    }
  });

  // 19. Marketplace: Current Logged-in User
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (stored) return JSON.parse(stored);
      // Default to customer Rahul Sharma
      return INITIAL_USER_PROFILES[0];
    } catch {
      return INITIAL_USER_PROFILES[0];
    }
  });

  // Derived current vendor shop
  const currentVendorShop = useMemo(() => {
    if (!userProfile) return null;
    if (userProfile.role === 'vendor') {
      return shops.find(
        (s) => s.vendorId === userProfile.id || s.shopId === userProfile.shopId
      ) || null;
    }
    return null;
  }, [userProfile, shops]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 5500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 20. Marketplace: Offers & Promotions
  const [offers, setOffers] = useState<MarketplaceOffer[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.OFFERS);
      return stored ? JSON.parse(stored) : INITIAL_OFFERS;
    } catch {
      return INITIAL_OFFERS;
    }
  });

  // 21. Marketplace: Reviews & Ratings
  const [reviews, setReviews] = useState<MarketplaceReview[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return stored ? JSON.parse(stored) : INITIAL_MARKETPLACE_REVIEWS;
    } catch {
      return INITIAL_MARKETPLACE_REVIEWS;
    }
  });

  // 22. Location Filtering
  const [selectedLocation, setSelectedLocation] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_LOCATION);
      return stored || 'All Locations';
    } catch {
      return 'All Locations';
    }
  });

  // Synchronize state with LocalStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery)); }, [gallery]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(customerAddresses)); }, [customerAddresses]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(shops)); }, [shops]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.VENDOR_APPLICATIONS, JSON.stringify(vendorApplications)); }, [vendorApplications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries)); }, [enquiries]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers)); }, [offers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SELECTED_LOCATION, selectedLocation); }, [selectedLocation]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USER_PROFILES_LIST, JSON.stringify(userProfiles)); }, [userProfiles]);
  useEffect(() => {
    if (userProfile) localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
    else localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  }, [userProfile]);
  useEffect(() => {
    if (customerUser) localStorage.setItem(STORAGE_KEYS.CUSTOMER_USER, JSON.stringify(customerUser));
    else localStorage.removeItem(STORAGE_KEYS.CUSTOMER_USER);
  }, [customerUser]);
  useEffect(() => {
    if (adminUser) localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(adminUser));
    else localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }, [adminUser]);

  // Load Cloud Data from Supabase
  const refreshFromSupabase = useCallback(async () => {
    const status = await checkSupabaseStatus();
    setSupabaseStatus(status);

    if (status.connected) {
      if (status.appointmentsTableExists) {
        const { data } = await fetchAppointmentsFromSupabase();
        if (data && data.length > 0) {
          setAppointments((prevLocal) => {
            const map = new Map<string, Appointment>();
            prevLocal.forEach((a) => map.set(a.bookingId.toLowerCase(), a));
            data.forEach((a) => map.set(a.bookingId.toLowerCase(), a));
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        }
      }

      if (status.ordersTableExists) {
        const { data } = await fetchOrdersFromSupabase();
        if (data && data.length > 0) {
          setOrders((prevLocal) => {
            const map = new Map<string, Order>();
            prevLocal.forEach((o) => map.set(o.orderId.toLowerCase(), o));
            data.forEach((o) => map.set(o.orderId.toLowerCase(), o));
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    refreshFromSupabase();
  }, [refreshFromSupabase]);

  // ==========================================
  // CART COMPUTATIONS & ACTIONS
  // ==========================================
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    if (!appliedCoupon || cartSubtotal < appliedCoupon.minOrderAmount) return 0;
    if (appliedCoupon.type === 'percentage') {
      const calc = Math.round((cartSubtotal * appliedCoupon.value) / 100);
      return appliedCoupon.maxDiscount ? Math.min(calc, appliedCoupon.maxDiscount) : calc;
    }
    return Math.min(appliedCoupon.value, cartSubtotal);
  }, [cartSubtotal, appliedCoupon]);

  const cartDeliveryFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal >= (settings.freeShippingThreshold || 1999) ? 0 : (settings.standardShippingFee || 99);
  }, [cartSubtotal, settings]);

  const cartTotal = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee);
  }, [cartSubtotal, cartDiscount, cartDeliveryFee]);

  const addToCart = (product: Product, size: ProductSize, colorName: string, quantity = 1): boolean => {
    if (product.stock <= 0) {
      addToast(`"${product.productName}" is currently out of stock.`, 'error');
      return false;
    }

    const cartItemId = `${product.productId}-${size}-${colorName}`.toLowerCase().replace(/\s+/g, '-');
    const existing = cart.find((i) => i.id === cartItemId);
    const currentQty = existing ? existing.quantity : 0;
    const requestedTotal = currentQty + quantity;

    if (requestedTotal > product.stock) {
      addToast(`Cannot add more. Available stock for this size & color is ${product.stock}.`, 'error');
      return false;
    }

    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: requestedTotal } : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.productId,
        productName: product.productName,
        price: product.price,
        originalPrice: product.originalPrice,
        imageUrl: product.imageUrl,
        size,
        color: colorName,
        quantity,
        stock: product.stock,
      };
      setCart((prev) => [newItem, ...prev]);
    }

    addToast(`Added "${product.productName}" (${size}, ${colorName}) to cart`, 'success');
    return true;
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const item = cart.find((i) => i.id === itemId);
    if (!item) return;

    if (quantity > item.stock) {
      addToast(`Only ${item.stock} item(s) available in stock.`, 'error');
      return;
    }

    setCart((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = (itemId: string) => {
    const item = cart.find((i) => i.id === itemId);
    setCart((prev) => prev.filter((i) => i.id !== itemId));
    if (item) {
      addToast(`Removed "${item.productName}" from cart`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // ==========================================
  // COUPON ACTIONS
  // ==========================================
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === cleanCode && c.active);

    if (!found) {
      addToast(`Invalid coupon code: "${code}"`, 'error');
      return { success: false, message: 'Invalid or inactive promotional code.' };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (found.expiryDate < todayStr) {
      addToast(`Coupon "${code}" has expired on ${found.expiryDate}.`, 'error');
      return { success: false, message: 'This coupon code has expired.' };
    }

    if (cartSubtotal < found.minOrderAmount) {
      const needed = found.minOrderAmount - cartSubtotal;
      addToast(`Minimum cart total of ₹${found.minOrderAmount.toLocaleString()} required. Add ₹${needed.toLocaleString()} more.`, 'error');
      return { success: false, message: `Minimum order of ₹${found.minOrderAmount} required.` };
    }

    setAppliedCoupon(found);
    addToast(`Coupon "${found.code}" applied! You save on this order.`, 'success');
    return { success: true, message: `Coupon applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  const addCoupon = (newCoupon: Omit<Coupon, 'id'>) => {
    const coupon: Coupon = {
      ...newCoupon,
      id: `coup-${Date.now().toString(36)}`,
      code: newCoupon.code.toUpperCase().trim(),
    };
    setCoupons((prev) => [coupon, ...prev]);
    addToast(`Coupon "${coupon.code}" created successfully`, 'success');
  };

  const toggleCouponActive = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, active: !c.active } : c))
    );
  };

  const deleteCoupon = (couponId: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    addToast('Coupon deleted', 'info');
  };

  // ==========================================
  // ORDER ACTIONS & INVENTORY UPDATES
  // ==========================================
  const placeOrder = async (payload: PlaceOrderPayload): Promise<Order> => {
    if (cart.length === 0) {
      throw new Error('Your cart is empty.');
    }

    // Verify stock availability
    for (const item of cart) {
      const prod = products.find((p) => p.productId === item.productId);
      if (!prod || prod.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${item.productName}". Available: ${prod ? prod.stock : 0}`);
      }
    }

    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const orderId = `FT-ORD-${orderNumber}`;
    const now = new Date();

    // Estimated delivery: 3 days for standard
    const deliveryDate = new Date(now.getTime() + 3 * 86400000);
    const estimatedDeliveryStr = deliveryDate.toISOString().split('T')[0];

    const newOrder: Order = {
      orderId,
      customerName: payload.customerName.trim(),
      phone: payload.phone.trim(),
      email: payload.email.trim(),
      shippingAddress: payload.shippingAddress,
      items: cart.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        price: i.price,
        imageUrl: i.imageUrl,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryCharge: cartDeliveryFee,
      totalAmount: cartTotal,
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentMethod === 'COD' ? 'pending' : 'completed',
      orderStatus: 'Order Placed',
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      createdAt: now.toISOString(),
      estimatedDelivery: estimatedDeliveryStr,
      trackingNumber: `BLR-FT-${orderNumber}`,
      carrier: 'BlueDart Express Delivery',
      notes: payload.notes?.trim() || undefined,
      timeline: [
        {
          status: 'Order Placed',
          timestamp: now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          note: payload.paymentMethod === 'COD' 
            ? 'Order placed with Cash on Delivery (COD)' 
            : `Payment received & verified via ${payload.paymentMethod}`,
          completed: true,
        },
        {
          status: 'Order Confirmed',
          timestamp: 'Pending',
          note: 'Store inventory allocated and confirmed',
          completed: false,
        },
        {
          status: 'Processing',
          timestamp: 'Pending',
          note: 'Handcrafted packing and quality check at BTM 1st Stage flagship store',
          completed: false,
        },
        {
          status: 'Packed',
          timestamp: 'Pending',
          note: 'Packaged in FashTag luxury dust cover',
          completed: false,
        },
        {
          status: 'Shipped',
          timestamp: 'Pending',
          note: 'Handed over to delivery courier',
          completed: false,
        },
        {
          status: 'Out for Delivery',
          timestamp: 'Pending',
          note: 'Delivery executive en route to your address',
          completed: false,
        },
        {
          status: 'Delivered',
          timestamp: 'Pending',
          note: 'Delivered safely to customer',
          completed: false,
        },
      ],
    };

    // Deduct stock from products inventory
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((i) => i.productId === p.productId);
        if (cartItem) {
          const newStock = Math.max(0, p.stock - cartItem.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    // Save order locally
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));

    // Clear cart
    clearCart();

    // Sync to Supabase
    saveOrderToSupabase(newOrder).then(({ success, error }) => {
      if (success) {
        addToast(`Order ${newOrder.orderId} synced to Supabase database!`, 'success');
      } else {
        console.warn('Supabase order sync note:', error);
      }
    });

    addToast(`Order placed successfully! ID: ${newOrder.orderId}`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string, 
    status: OrderStatus, 
    note?: string,
    carrier?: string,
    trackingNumber?: string
  ) => {
    const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    setOrders((prev) =>
      prev.map((order) => {
        if (order.orderId !== orderId) return order;

        const updatedTimeline = order.timeline.map((event) => {
          if (event.status === status) {
            return {
              ...event,
              timestamp: now,
              note: note || event.note,
              completed: true,
            };
          }
          return event;
        });

        const updatedOrder: Order = {
          ...order,
          orderStatus: status,
          carrier: carrier || order.carrier,
          trackingNumber: trackingNumber || order.trackingNumber,
          timeline: updatedTimeline,
        };

        // Sync to Supabase
        updateOrderInSupabase(orderId, { 
          orderStatus: status, 
          carrier: updatedOrder.carrier,
          trackingNumber: updatedOrder.trackingNumber,
          timeline: updatedTimeline 
        });
        return updatedOrder;
      })
    );
    addToast(`Order ${orderId} status updated to ${status}`, 'info');
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.orderId !== orderId) return order;
        const updated = { ...order, paymentStatus: status };
        updateOrderInSupabase(orderId, { paymentStatus: status });
        return updated;
      })
    );
    addToast(`Order ${orderId} payment marked as ${status}`, 'info');
  };

  const updateOrderPaymentStatus = updatePaymentStatus;
  const createCoupon = addCoupon;

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => {
      const updated = prev.filter((id) => id !== productId);
      addToast('Removed from Wishlist', 'info');
      return updated;
    });
  };

  const saveCustomerAddress = (addr: CustomerAddress) => {
    setCustomerAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== addr.id);
      return [addr, ...filtered];
    });
    addToast('Address saved', 'success');
  };

  const deleteCustomerAddress = (id: string) => {
    setCustomerAddresses((prev) => prev.filter((a) => a.id !== id));
    addToast('Address removed', 'info');
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    const order = orders.find((o) => o.orderId === orderId);
    if (!order) return;

    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
      addToast(`Cannot cancel order once it has been shipped or delivered.`, 'error');
      return;
    }

    // Restore inventory stock
    setProducts((prev) =>
      prev.map((p) => {
        const item = order.items.find((i) => i.productId === p.productId);
        if (item) {
          return { ...p, stock: p.stock + item.quantity };
        }
        return p;
      })
    );

    const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const updatedTimeline = [
      ...order.timeline,
      {
        status: 'Cancelled' as OrderStatus,
        timestamp: now,
        note: reason || 'Cancelled upon customer request',
        completed: true,
      },
    ];

    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? { ...o, orderStatus: 'Cancelled', timeline: updatedTimeline }
          : o
      )
    );

    updateOrderInSupabase(orderId, { orderStatus: 'Cancelled', timeline: updatedTimeline });
    addToast(`Order ${orderId} has been cancelled`, 'info');
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.orderId.toLowerCase() === orderId.toLowerCase());
  };

  // ==========================================
  // WISHLIST ACTIONS
  // ==========================================
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      addToast(exists ? 'Removed from Wishlist' : 'Added to Wishlist', exists ? 'info' : 'success');
      return updated;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  // ==========================================
  // ADDRESS ACTIONS
  // ==========================================
  const saveAddress = (addr: Omit<CustomerAddress, 'id'>) => {
    const newAddress: CustomerAddress = {
      ...addr,
      id: `addr-${Date.now().toString(36)}`,
    };
    setCustomerAddresses((prev) => [newAddress, ...prev]);
    addToast('Delivery address saved', 'success');
  };

  const deleteAddress = (id: string) => {
    setCustomerAddresses((prev) => prev.filter((a) => a.id !== id));
    addToast('Address removed', 'info');
  };

  // ==========================================
  // CUSTOMER ACCOUNT ACTIONS
  // ==========================================
  const loginCustomer = (name: string, phone: string, email: string) => {
    const user: CustomerUser = {
      id: `cust-${Date.now().toString(36)}`,
      name,
      phone,
      email,
      addresses: customerAddresses,
      wishlist,
    };
    setCustomerUser(user);
    addToast(`Welcome back, ${name}!`, 'success');
  };

  const logoutCustomer = () => {
    setCustomerUser(null);
    addToast('Logged out of your customer account', 'info');
  };

  // ==========================================
  // APPOINTMENT ACTIONS (PRESERVED VERBATIM)
  // ==========================================
  const bookAppointment = async (payload: BookAppointmentPayload): Promise<Appointment> => {
    const currentList: Appointment[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]');
    
    const existingSlot = currentList.find(
      (app) =>
        app.appointmentDate === payload.appointmentDate &&
        app.appointmentTime === payload.appointmentTime &&
        (app.status === 'confirmed' || app.status === 'pending')
    );

    if (existingSlot) {
      throw new Error(`The slot on ${payload.appointmentDate} at ${payload.appointmentTime} was just booked by another visitor. Please choose another slot.`);
    }

    const dayBookings = currentList.filter(
      (app) => app.appointmentDate === payload.appointmentDate && (app.status === 'confirmed' || app.status === 'pending')
    );
    if (dayBookings.length >= (settings.dailyBookingLimit || 20)) {
      throw new Error(`Daily appointment limit of ${settings.dailyBookingLimit} has been reached for this date.`);
    }

    const newAppointment: Appointment = {
      bookingId: generateBookingId(),
      customerName: payload.customerName.trim(),
      phone: payload.phone.trim(),
      email: payload.email?.trim() || undefined,
      visitorCount: Number(payload.visitorCount) || 1,
      shoppingCategory: payload.shoppingCategory,
      appointmentDate: payload.appointmentDate,
      appointmentTime: payload.appointmentTime,
      status: 'confirmed',
      additionalRequirements: payload.additionalRequirements?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const updatedList = [newAppointment, ...currentList];
    setAppointments(updatedList);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updatedList));

    saveAppointmentToSupabase(newAppointment).then(({ success }) => {
      if (success) {
        addToast(`Appointment saved to Supabase (ID: ${newAppointment.bookingId})`, 'success');
      }
    });

    addToast(`Appointment booked successfully! Booking ID: ${newAppointment.bookingId}`, 'success');
    return newAppointment;
  };

  const updateAppointmentStatus = (bookingId: string, status: AppointmentStatus, notes?: string) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.bookingId === bookingId
          ? { ...app, status, notes: notes !== undefined ? notes : app.notes }
          : app
      )
    );
    updateAppointmentInSupabase(bookingId, { status, notes });
    addToast(`Appointment ${bookingId} status updated to ${status}`, 'info');
  };

  const rescheduleAppointment = async (bookingId: string, newDate: string, newTime: string): Promise<boolean> => {
    const conflict = appointments.find(
      (app) =>
        app.bookingId !== bookingId &&
        app.appointmentDate === newDate &&
        app.appointmentTime === newTime &&
        (app.status === 'confirmed' || app.status === 'pending')
    );

    if (conflict) {
      addToast(`Slot on ${newDate} at ${newTime} is unavailable.`, 'error');
      return false;
    }

    setAppointments((prev) =>
      prev.map((app) =>
        app.bookingId === bookingId
          ? { ...app, appointmentDate: newDate, appointmentTime: newTime, status: 'confirmed' }
          : app
      )
    );

    updateAppointmentInSupabase(bookingId, {
      appointmentDate: newDate,
      appointmentTime: newTime,
      status: 'confirmed',
    });

    addToast(`Appointment ${bookingId} rescheduled to ${newDate} at ${newTime}`, 'success');
    return true;
  };

  const getAppointmentById = (bookingId: string): Appointment | undefined => {
    return appointments.find((app) => app.bookingId.toLowerCase() === bookingId.toLowerCase());
  };

  // ==========================================
  // STORE / ADMIN SETTINGS & MANAGEMENT
  // ==========================================
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Store settings updated successfully', 'success');
  };

  const addProduct = (prod: Omit<Product, 'productId'>) => {
    const newProduct: Product = {
      ...prod,
      productId: `ft-prod-${Date.now().toString(36)}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast(`Product "${prod.productName}" added to catalog`, 'success');
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.productId === updated.productId ? updated : p)));
    addToast(`Product updated`, 'info');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.productId !== productId));
    addToast('Product removed', 'info');
  };

  const toggleProductActive = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, active: !p.active } : p))
    );
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'imageId' | 'createdAt'>) => {
    const newItem: GalleryItem = {
      ...item,
      imageId: `gal-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setGallery((prev) => [newItem, ...prev]);
    addToast('Gallery image added', 'success');
  };

  const deleteGalleryItem = (imageId: string) => {
    setGallery((prev) => prev.filter((g) => g.imageId !== imageId));
    addToast('Gallery item removed', 'info');
  };

  const loginAdmin = (email: string, pass: string): boolean => {
    const validEmail = 'admin@fashtag.in';
    const validPass = 'fashtag2026!';

    if (email.toLowerCase().trim() === validEmail && pass === validPass) {
      const user: AdminUser = {
        userId: 'admin-01',
        email: 'admin@fashtag.in',
        name: 'FashTag Store Manager',
        role: 'admin',
      };
      setAdminUser(user);
      addToast('Welcome back, Store Manager!', 'success');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    addToast('Logged out of admin console', 'info');
  };

  const resetToDefaults = () => {
    setSettings(INITIAL_SETTINGS);
    setProducts(INITIAL_PRODUCTS);
    setGallery(INITIAL_GALLERY);
    setAppointments(INITIAL_APPOINTMENTS);
    setOrders(INITIAL_ORDERS);
    setCoupons(INITIAL_COUPONS);
    setShops(INITIAL_SHOPS);
    setVendorApplications(INITIAL_VENDOR_APPLICATIONS);
    setEnquiries(INITIAL_ENQUIRIES);
    setUserProfiles(INITIAL_USER_PROFILES);
    setUserProfile(INITIAL_USER_PROFILES[0]);
    setCart([]);
    addToast('Store reset to factory default demonstration data', 'info');
  };

  // ==========================================
  // MARKETPLACE: AUTH & USER PROFILES
  // ==========================================
  const loginUser = (email: string, role?: UserRole): { success: boolean; user?: UserProfile; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    let found = userProfiles.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      // Auto-provision if demo login or simple registration
      found = {
        id: `user-${Date.now().toString(36)}`,
        email: cleanEmail,
        fullName: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        phone: '+91 98450 00000',
        role: role || 'customer',
        createdAt: new Date().toISOString(),
      };
      setUserProfiles((prev) => [...prev, found!]);
    } else if (role && found.role !== role) {
      found = { ...found, role };
      setUserProfiles((prev) => prev.map((u) => (u.id === found!.id ? found! : u)));
    }

    setUserProfile(found);

    if (found.role === 'admin') {
      setAdminUser({
        userId: found.id,
        email: found.email,
        name: found.fullName,
        role: 'admin',
      });
    }

    if (found.role === 'customer') {
      setCustomerUser({
        id: found.id,
        name: found.fullName,
        email: found.email,
        phone: found.phone,
        addresses: customerAddresses,
        wishlist,
      });
    }

    addToast(`Logged in successfully as ${found.fullName} (${found.role.toUpperCase()})`, 'success');
    return { success: true, user: found };
  };

  const loginWithDemoRole = (role: UserRole, targetShopId?: string) => {
    let demoUser: UserProfile | undefined;

    if (role === 'customer') {
      demoUser = userProfiles.find((u) => u.role === 'customer') || INITIAL_USER_PROFILES[0];
    } else if (role === 'vendor') {
      if (targetShopId) {
        demoUser = userProfiles.find((u) => u.shopId === targetShopId);
      }
      if (!demoUser) {
        demoUser = userProfiles.find((u) => u.role === 'vendor') || INITIAL_USER_PROFILES[1];
      }
    } else if (role === 'admin') {
      demoUser = userProfiles.find((u) => u.role === 'admin') || INITIAL_USER_PROFILES[3];
      setAdminUser({
        userId: demoUser.id,
        email: demoUser.email,
        name: demoUser.fullName,
        role: 'admin',
      });
    }

    if (demoUser) {
      setUserProfile(demoUser);
      addToast(`Switched active view to demo ${role.toUpperCase()}: ${demoUser.fullName}`, 'info');
    }
  };

  const logoutUser = () => {
    setUserProfile(null);
    setAdminUser(null);
    addToast('Logged out of your account', 'info');
  };

  const registerCustomer = async (data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = userProfiles.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, message: 'An account with this email address already exists. Please log in.' };
    }

    const newProfile: UserProfile = {
      id: `cust-${Date.now().toString(36)}`,
      email: cleanEmail,
      fullName: data.fullName.trim(),
      phone: data.phone.trim(),
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    setUserProfiles((prev) => [...prev, newProfile]);
    setUserProfile(newProfile);
    setCustomerUser({
      id: newProfile.id,
      name: newProfile.fullName,
      email: newProfile.email,
      phone: newProfile.phone,
      addresses: [],
      wishlist: [],
    });

    addToast(`Account created! Welcome to FashTag, ${newProfile.fullName}!`, 'success');
    return { success: true, message: 'Account registered successfully.' };
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = { ...userProfile, ...updates };
    setUserProfile(updated);
    setUserProfiles((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

    if (updated.role === 'customer') {
      setCustomerUser((prev) =>
        prev
          ? { ...prev, name: updated.fullName, email: updated.email, phone: updated.phone }
          : null
      );
    }
    addToast('Profile details updated', 'success');
  };

  // ==========================================
  // MARKETPLACE: VENDOR ONBOARDING & SHOPS
  // ==========================================
  const registerVendorApplication = async (
    data: Omit<VendorApplication, 'applicationId' | 'status' | 'submittedAt'>
  ): Promise<{ success: boolean; applicationId: string; message: string }> => {
    const applicationId = `VND-APP-${Math.floor(100 + Math.random() * 900)}`;
    const vendorId = `vendor-${Date.now().toString(36)}`;
    const shopSlug = data.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const shopId = `shop-${shopSlug}-${Math.floor(10 + Math.random() * 90)}`;

    const newApp: VendorApplication = {
      ...data,
      applicationId,
      vendorId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    // Create pending shop record
    const pendingShop: Shop = {
      shopId,
      vendorId,
      shopName: data.shopName,
      slug: shopSlug,
      category: data.category || (data.categories && data.categories[0]) || 'Fashion',
      description: data.description || data.businessDescription || `${data.shopName} - Quality local store`,
      logoUrl: data.logoUrl || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80',
      coverImageUrl: data.coverImageUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      address: data.address,
      city: data.city,
      state: data.state,
      phone: data.phone,
      whatsappNumber: (data.whatsappNumber || data.whatsapp || data.phone).replace(/\D/g, ''),
      openingHours: data.openingHours || '10:30 AM – 10:30 PM',
      rating: 5.0,
      reviewCount: 0,
      status: 'pending',
      featured: false,
      verified: false,
      createdAt: new Date().toISOString(),
    };

    // Register vendor user account
    const newVendorProfile: UserProfile = {
      id: vendorId,
      email: data.email.toLowerCase().trim(),
      fullName: data.ownerName.trim(),
      phone: data.phone.trim(),
      role: 'vendor',
      shopId,
      createdAt: new Date().toISOString(),
    };

    setVendorApplications((prev) => [newApp, ...prev]);
    setShops((prev) => [...prev, pendingShop]);
    setUserProfiles((prev) => [...prev, newVendorProfile]);
    setUserProfile(newVendorProfile);

    // Sync to Supabase
    saveVendorApplicationToSupabase(newApp).catch(console.warn);
    saveShopToSupabase(pendingShop).catch(console.warn);

    addToast(`Application for "${data.shopName}" submitted! Admin approval is pending.`, 'success');
    return {
      success: true,
      applicationId,
      message: 'Your vendor application has been submitted successfully for verification.',
    };
  };

  const approveVendorApplication = async (
    applicationId: string
  ): Promise<{ success: boolean; message: string }> => {
    const app = vendorApplications.find((a) => a.applicationId === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    setVendorApplications((prev) =>
      prev.map((a) =>
        a.applicationId === applicationId
          ? { ...a, status: 'approved', reviewedAt: new Date().toISOString() }
          : a
      )
    );

    setShops((prev) => {
      const exists = prev.some((s) => s.vendorId === app.vendorId || s.shopName.toLowerCase() === app.shopName.toLowerCase());
      if (exists) {
        return prev.map((s) =>
          s.vendorId === app.vendorId || s.shopName.toLowerCase() === app.shopName.toLowerCase()
            ? { ...s, status: 'approved', verified: true }
            : s
        );
      }
      const newShop: Shop = {
        shopId: `shop-${Date.now()}`,
        vendorId: app.vendorId || `vendor-${Date.now()}`,
        shopName: app.shopName,
        slug: app.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: app.businessDescription || `${app.shopName} - Quality local products and direct service.`,
        category: (app.categories && app.categories[0]) || 'Fashion',
        categories: app.categories || ['Fashion'],
        phone: app.phone,
        whatsapp: app.whatsapp || app.phone,
        email: app.email,
        address: app.address,
        area: app.city || 'Bangalore',
        city: app.city || 'Bangalore',
        pincode: app.pincode,
        gstin: app.gstNumber,
        panNumber: app.panNumber,
        status: 'approved',
        verified: true,
        rating: 5.0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
      };
      return [...prev, newShop];
    });

    setUserProfiles((prev) =>
      prev.map((u) => (u.id === app.vendorId ? { ...u, role: 'vendor' } : u))
    );

    // Sync Supabase
    updateVendorApplicationInSupabase(applicationId, 'approved').catch(console.warn);
    const shopToUpdate = shops.find((s) => s.vendorId === app.vendorId || s.shopName.toLowerCase() === app.shopName.toLowerCase());
    if (shopToUpdate) {
      updateShopInSupabase(shopToUpdate.shopId, { status: 'approved', verified: true }).catch(console.warn);
    }

    addToast(`Vendor application for "${app.shopName}" approved! Shop is now live on marketplace.`, 'success');
    return { success: true, message: `Shop "${app.shopName}" approved.` };
  };

  const rejectVendorApplication = async (
    applicationId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    const app = vendorApplications.find((a) => a.applicationId === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    setVendorApplications((prev) =>
      prev.map((a) =>
        a.applicationId === applicationId
          ? { ...a, status: 'rejected', rejectionReason: reason || 'Requirements not met', reviewedAt: new Date().toISOString() }
          : a
      )
    );

    setShops((prev) =>
      prev.map((s) =>
        s.vendorId === app.vendorId ? { ...s, status: 'rejected' } : s
      )
    );

    updateVendorApplicationInSupabase(applicationId, 'rejected', reason).catch(console.warn);
    addToast(`Vendor application for "${app.shopName}" rejected`, 'info');
    return { success: true, message: 'Application rejected.' };
  };

  const updateShopDetails = async (
    shopId: string,
    updates: Partial<Shop>
  ): Promise<{ success: boolean; message: string }> => {
    setShops((prev) => prev.map((s) => (s.shopId === shopId ? { ...s, ...updates } : s)));
    updateShopInSupabase(shopId, updates).catch(console.warn);
    addToast('Shop details updated successfully', 'success');
    return { success: true, message: 'Shop details saved.' };
  };

  const toggleShopStatus = async (shopId: string, status: 'approved' | 'suspended') => {
    setShops((prev) => prev.map((s) => (s.shopId === shopId ? { ...s, status } : s)));
    updateShopInSupabase(shopId, { status }).catch(console.warn);
    addToast(`Shop status updated to ${status.toUpperCase()}`, 'info');
  };

  const toggleShopFeatured = async (shopId: string) => {
    const shop = shops.find((s) => s.shopId === shopId);
    if (!shop) return;
    const nextFeatured = !shop.featured;
    setShops((prev) => prev.map((s) => (s.shopId === shopId ? { ...s, featured: nextFeatured } : s)));
    updateShopInSupabase(shopId, { featured: nextFeatured }).catch(console.warn);
    addToast(`Shop "${shop.shopName}" featured status toggled`, 'info');
  };

  const getShopById = (shopId: string): Shop | undefined => {
    return shops.find((s) => s.shopId === shopId || s.slug === shopId);
  };

  const getProductsByShop = (shopId: string): Product[] => {
    return products.filter((p) => p.shopId === shopId);
  };

  // ==========================================
  // MARKETPLACE: VENDOR PRODUCT MANAGEMENT
  // ==========================================
  const addVendorProduct = async (
    productData: Omit<Product, 'productId'>
  ): Promise<{ success: boolean; product: Product }> => {
    const shop = currentVendorShop || shops.find((s) => s.shopId === productData.shopId) || shops[0];
    const newProduct: Product = {
      ...productData,
      productId: `ft-prod-${Date.now().toString(36)}`,
      shopId: shop.shopId,
      shopName: shop.shopName,
      vendorId: shop.vendorId,
      city: shop.city,
    };

    setProducts((prev) => [newProduct, ...prev]);
    addToast(`Product "${newProduct.productName}" added to ${shop.shopName}!`, 'success');
    return { success: true, product: newProduct };
  };

  const updateVendorProduct = async (
    productId: string,
    updates: Partial<Product>
  ): Promise<{ success: boolean }> => {
    setProducts((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, ...updates } : p))
    );
    addToast('Product updated successfully', 'success');
    return { success: true };
  };

  const deleteVendorProduct = async (productId: string): Promise<{ success: boolean }> => {
    setProducts((prev) => prev.filter((p) => p.productId !== productId));
    addToast('Product removed from catalog', 'info');
    return { success: true };
  };

  // ==========================================
  // MARKETPLACE: CUSTOMER ENQUIRIES & LEADS
  // ==========================================
  const submitEnquiry = async (
    data: Omit<Enquiry, 'enquiryId' | 'status' | 'createdAt'>
  ): Promise<{ success: boolean; message: string }> => {
    const enquiryId = `ENQ-${Math.floor(100 + Math.random() * 900)}`;
    const newEnquiry: Enquiry = {
      ...data,
      enquiryId,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    setEnquiries((prev) => [newEnquiry, ...prev]);
    saveEnquiryToSupabase(newEnquiry).catch(console.warn);

    addToast(`Your enquiry for "${data.shopName}" has been sent!`, 'success');
    return { success: true, message: 'Enquiry submitted. The vendor has been notified.' };
  };

  const updateEnquiryStatus = async (
    enquiryId: string,
    status: 'new' | 'contacted' | 'resolved'
  ) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.enquiryId === enquiryId ? { ...e, status } : e))
    );
    updateEnquiryStatusInSupabase(enquiryId, status).catch(console.warn);
    addToast(`Enquiry marked as ${status.toUpperCase()}`, 'info');
  };

  // ==========================================
  // MARKETPLACE: OFFERS & PROMOTIONS
  // ==========================================
  const addOffer = async (
    offerData: Omit<MarketplaceOffer, 'id'>
  ): Promise<{ success: boolean; offer: MarketplaceOffer }> => {
    const newOffer: MarketplaceOffer = {
      ...offerData,
      id: `offer-${Date.now()}`,
    };
    setOffers((prev) => [newOffer, ...prev]);
    addToast(`Special Offer "${offerData.title}" created successfully!`, 'success');
    return { success: true, offer: newOffer };
  };

  const deleteOffer = async (offerId: string): Promise<{ success: boolean }> => {
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
    addToast('Offer removed successfully', 'info');
    return { success: true };
  };

  const toggleOfferActive = async (offerId: string): Promise<void> => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, isActive: !o.isActive } : o))
    );
  };

  // ==========================================
  // MARKETPLACE: CUSTOMER REVIEWS & RATINGS
  // ==========================================
  const addReview = async (
    reviewData: Omit<MarketplaceReview, 'id' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean; message: string }> => {
    const newReview: MarketplaceReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      status: 'approved',
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate shop rating & review count
    setShops((prev) =>
      prev.map((s) => {
        if (s.shopId === reviewData.shopId) {
          const shopReviews = [
            ...reviews.filter((r) => r.shopId === reviewData.shopId && r.status === 'approved'),
            newReview,
          ];
          const avg = Number(
            (shopReviews.reduce((sum, r) => sum + r.rating, 0) / shopReviews.length).toFixed(1)
          );
          return {
            ...s,
            rating: avg,
            reviewCount: shopReviews.length,
          };
        }
        return s;
      })
    );

    addToast('Thank you! Your review has been posted.', 'success');
    return { success: true, message: 'Review submitted successfully.' };
  };

  const moderateReview = async (
    reviewId: string,
    status: 'approved' | 'pending' | 'flagged'
  ): Promise<void> => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    );
    addToast(`Review marked as ${status.toUpperCase()}`, 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        products,
        gallery,
        appointments,
        orders,
        coupons,
        cart,
        wishlist,
        customerAddresses,
        customerUser,
        currentUser: customerUser,
        adminUser,
        toasts,
        appliedCoupon,
        supabaseStatus,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartDeliveryFee,
        cartTotal,
        applyCoupon,
        removeCoupon,
        addCoupon,
        createCoupon,
        toggleCouponActive,
        deleteCoupon,
        placeOrder,
        updateOrderStatus,
        updatePaymentStatus,
        updateOrderPaymentStatus,
        cancelOrder,
        getOrderById,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        saveAddress,
        saveCustomerAddress,
        deleteAddress,
        deleteCustomerAddress,
        loginCustomer,
        logoutCustomer,
        addToast,
        removeToast,
        bookAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        getAppointmentById,
        updateSettings,
        addProduct,
        updateProduct,
        updateProductStock,
        deleteProduct,
        toggleProductActive,
        addGalleryItem,
        deleteGalleryItem,
        loginAdmin,
        logoutAdmin,
        resetToDefaults,
        refreshFromSupabase,

        // Marketplace Multi-Vendor
        shops,
        vendorApplications,
        enquiries,
        userProfile,
        currentVendorShop,
        loginUser,
        loginWithDemoRole,
        logoutUser,
        registerCustomer,
        updateUserProfile,
        registerVendorApplication,
        approveVendorApplication,
        rejectVendorApplication,
        updateShopDetails,
        toggleShopStatus,
        toggleShopFeatured,
        getShopById,
        getProductsByShop,
        addVendorProduct,
        updateVendorProduct,
        deleteVendorProduct,
        submitEnquiry,
        updateEnquiryStatus,

        // Offers, Reviews & Location
        offers,
        addOffer,
        deleteOffer,
        toggleOfferActive,
        reviews,
        addReview,
        moderateReview,
        selectedLocation,
        setSelectedLocation,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
