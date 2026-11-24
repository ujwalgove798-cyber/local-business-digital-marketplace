export type ShoppingCategory = 
  | "Men's Fashion"
  | "Kids' Fashion"
  | "Casual Wear"
  | "Party Wear"
  | "General Shopping Assistance";

export type ProductCategory =
  | "Men's Fashion"
  | "Women's Fashion"
  | "Kids' Fashion"
  | "Accessories"
  | "Footwear"
  | "Shirts & Jeans"
  | "Casual Wear"
  | "Party Wear"
  | "Fashion Accessories";

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size';

export interface ProductColor {
  name: string;
  hex: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'rejected' | 'completed';

export interface Appointment {
  bookingId: string;
  customerName: string;
  phone: string;
  email?: string;
  visitorCount: number;
  shoppingCategory: ShoppingCategory;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // e.g. "11:30 AM"
  status: AppointmentStatus;
  additionalRequirements?: string;
  createdAt: string; // ISO date string
  notes?: string;
}

export interface Product {
  productId: string;
  productName: string;
  category: ProductCategory;
  description: string;
  imageUrl: string;
  images?: string[];
  price: number; // in INR
  originalPrice?: number; // MRP for discount badge
  discountPrice?: number;
  sizes: ProductSize[];
  colors: ProductColor[];
  stock: number;
  active: boolean;
  featured?: boolean;
  tags?: string[];
  fabric?: string;
  fit?: string;
  gender?: 'Men' | 'Women' | 'Kids' | 'All';
  subCategory?: string;
  rating?: number;
  reviewCount?: number;
  shopId?: string;
  shopName?: string;
  vendorId?: string;
  city?: string;
}

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  shopId?: string;
  createdAt: string;
}

export type ShopStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Shop {
  shopId: string;
  vendorId: string;
  shopName: string;
  slug: string;
  category: string;
  categories?: string[];
  description: string;
  logoUrl?: string;
  coverImageUrl?: string;
  bannerUrl?: string;
  address: string;
  area?: string;
  city: string;
  state?: string;
  pincode?: string;
  phone: string;
  email?: string;
  whatsappNumber?: string;
  whatsapp?: string;
  openingHours?: string;
  gstin?: string;
  panNumber?: string;
  rating: number;
  reviewCount: number;
  status: ShopStatus;
  featured?: boolean;
  verified?: boolean;
  createdAt: string;
}

export interface VendorApplication {
  applicationId: string;
  vendorId?: string;
  ownerName: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  whatsapp?: string;
  shopName: string;
  category?: string;
  categories?: string[];
  city: string;
  state?: string;
  pincode?: string;
  address: string;
  description?: string;
  businessDescription?: string;
  gstNumber?: string;
  panNumber?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  openingHours?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface Enquiry {
  enquiryId: string;
  shopId: string;
  shopName: string;
  productId?: string;
  productName?: string;
  productPrice?: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message: string;
  channel?: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item id: `${productId}-${size}-${color}`
  productId: string;
  productName: string;
  price: number;
  originalPrice?: number;
  category?: string;
  imageUrl: string;
  size: ProductSize;
  color: string;
  quantity: number;
  stock: number;
}

export interface CustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  houseNumber: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault?: boolean;
  deliveryInstructions?: string;
}

export type PaymentMethod = 'COD' | 'UPI' | 'CARD' | 'VOUCHER';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type OrderStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note: string;
  completed: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  imageUrl: string;
  size: ProductSize;
  color: string;
  quantity: number;
}

export interface Order {
  orderId: string; // e.g. FT-ORD-84920
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: CustomerAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  couponCode?: string;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  carrier?: string;
  timeline: OrderTimelineEvent[];
  notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // e.g. 10 for 10% or 500 for ₹500
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate: string; // YYYY-MM-DD
  active: boolean;
  description: string;
  isVoucher?: boolean;
  usageLimit?: number;
  usedCount?: number;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: CustomerAddress[];
  wishlist: string[]; // productIds
}

export interface GalleryItem {
  imageId: string;
  imageUrl: string;
  title: string;
  category: 'Store Interior' | "Men's Fashion" | "Kids' Fashion" | 'Accessories' | 'Collections';
  createdAt: string;
}

export interface DayHours {
  open: string;  // e.g. "10:30" (24h)
  close: string; // e.g. "22:30" (24h)
  isOpen: boolean;
  breakStart?: string; // e.g. "13:00" for Friday
  breakEnd?: string;   // e.g. "15:00" for Friday
}

export interface StoreSettings {
  businessName: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  googleMapsUrl: string;
  appointmentDuration: number; // minutes, default 45
  bufferTime: number; // minutes, default 15
  dailyBookingLimit: number; // max appointments per day, default 20
  freeShippingThreshold: number; // e.g. 1999
  standardShippingFee: number; // e.g. 99
  blockedDates: string[]; // YYYY-MM-DD list
  openingHours: {
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
    sunday: DayHours;
  };
}

export interface AdminUser {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
}

export interface ReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  verifiedVisit: boolean;
}

export interface MarketplaceReview {
  id: string;
  shopId: string;
  shopName: string;
  customerId?: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'flagged';
  verifiedPurchase?: boolean;
}

export interface MarketplaceOffer {
  id: string;
  shopId?: string;
  shopName?: string;
  title: string;
  description: string;
  discountText?: string;
  discountValue?: string;
  bannerUrl?: string;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  isActive?: boolean;
  code?: string;
  promoCode?: string;
}
