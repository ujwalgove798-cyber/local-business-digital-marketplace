import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Appointment, 
  AppointmentStatus, 
  ShoppingCategory, 
  Order, 
  Product, 
  Coupon, 
  CustomerAddress,
  Shop,
  VendorApplication,
  Enquiry,
  UserProfile
} from '../types';

export const SUPABASE_PROJECT_ID = 'mvfylikwablsuizposva';

// Normalize URL in case user leaves out "co" or has trailing period
export function normalizeSupabaseUrl(rawUrl?: string): string {
  let url = (rawUrl || '').trim();
  if (!url) {
    return 'https://mvfylikwablsuizposva.supabase.co';
  }
  if (url.endsWith('.supabase.')) {
    url = url + 'co';
  } else if (url.endsWith('.supabase')) {
    url = url + '.co';
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url;
}

export const DEFAULT_SUPABASE_URL = normalizeSupabaseUrl(
  import.meta.env.VITE_SUPABASE_URL || 'https://mvfylikwablsuizposva.supabase.co'
);

export const DEFAULT_SUPABASE_KEY = (
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_LmW8rZkzyc5TwgsnkZu5qQ_QvWMESJh'
).trim();

// Get active config with localStorage override support
export function getActiveSupabaseConfig(): { url: string; key: string } {
  try {
    const savedUrl = localStorage.getItem('fashtag_supabase_url');
    const savedKey = localStorage.getItem('fashtag_supabase_key');
    return {
      url: normalizeSupabaseUrl(savedUrl || DEFAULT_SUPABASE_URL),
      key: (savedKey || DEFAULT_SUPABASE_KEY).trim(),
    };
  } catch {
    return {
      url: DEFAULT_SUPABASE_URL,
      key: DEFAULT_SUPABASE_KEY,
    };
  }
}

export function saveCustomSupabaseConfig(url: string, key: string) {
  const cleanUrl = normalizeSupabaseUrl(url);
  const cleanKey = key.trim();
  localStorage.setItem('fashtag_supabase_url', cleanUrl);
  localStorage.setItem('fashtag_supabase_key', cleanKey);
  reinitSupabaseClient(cleanUrl, cleanKey);
}

export let supabase: SupabaseClient = createClient(
  getActiveSupabaseConfig().url,
  getActiveSupabaseConfig().key
);

export function reinitSupabaseClient(url: string, key: string) {
  supabase = createClient(normalizeSupabaseUrl(url), key.trim());
}

export const SUPABASE_URL = getActiveSupabaseConfig().url;
export const SUPABASE_ANON_KEY = getActiveSupabaseConfig().key;

export const SUPABASE_SCHEMA_SQL = `-- ============================================================================
-- FASHTAG - BTM 1st Stage Bengaluru: Complete E-Commerce & Appointment Schema
-- Run this in your Supabase SQL Editor:
-- ============================================================================

-- 1. Appointments Table (Existing & Preserved)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    visitor_count INTEGER DEFAULT 1,
    shopping_category TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed',
    additional_requirements TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT UNIQUE NOT NULL,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    images JSONB DEFAULT '[]',
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    sizes JSONB DEFAULT '["M", "L"]',
    colors JSONB DEFAULT '[]',
    stock INTEGER DEFAULT 10,
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    tags JSONB DEFAULT '[]',
    fabric TEXT,
    fit TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    delivery_charge NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    order_status TEXT DEFAULT 'Order Placed',
    coupon_code TEXT,
    estimated_delivery DATE,
    tracking_number TEXT,
    carrier TEXT,
    timeline JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- 'percentage' or 'fixed'
    value NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) DEFAULT 0,
    max_discount NUMERIC(10, 2),
    expiry_date DATE NOT NULL,
    active BOOLEAN DEFAULT true,
    description TEXT,
    is_voucher BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Profiles Table (Customer, Vendor, Admin)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer', -- 'customer', 'vendor', 'admin'
    avatar_url TEXT,
    shop_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Shops Table (Marketplace Vendors)
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id TEXT UNIQUE NOT NULL,
    vendor_id TEXT NOT NULL,
    shop_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    logo_url TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    opening_hours TEXT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'suspended'
    featured BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Vendor Applications Table
CREATE TABLE IF NOT EXISTS public.vendor_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id TEXT UNIQUE NOT NULL,
    vendor_id TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    shop_name TEXT NOT NULL,
    category TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    opening_hours TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 8. Enquiries Table (Customer Leads & WhatsApp Inquiries)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id TEXT UNIQUE NOT NULL,
    shop_id TEXT NOT NULL,
    shop_name TEXT NOT NULL,
    product_id TEXT,
    product_name TEXT,
    product_price NUMERIC(10, 2),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'resolved'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- 10. Public Access Policies for Marketplace Storefront
CREATE POLICY "Allow public read appointments" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Allow public booking insert" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update appointments" ON public.appointments FOR UPDATE USING (true);

CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public upsert products" ON public.products FOR ALL USING (true);

CREATE POLICY "Allow public read coupons" ON public.coupons FOR SELECT USING (true);

CREATE POLICY "Allow public order insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public update orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Allow public read shops" ON public.shops FOR SELECT USING (true);
CREATE POLICY "Allow public upsert shops" ON public.shops FOR ALL USING (true);

CREATE POLICY "Allow public read vendor applications" ON public.vendor_applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert vendor applications" ON public.vendor_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update vendor applications" ON public.vendor_applications FOR UPDATE USING (true);

CREATE POLICY "Allow public read enquiries" ON public.enquiries FOR SELECT USING (true);
CREATE POLICY "Allow public insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update enquiries" ON public.enquiries FOR UPDATE USING (true);

CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public upsert profiles" ON public.profiles FOR ALL USING (true);
`;

// Helper: map Supabase row to Appointment
export function mapRowToAppointment(row: any): Appointment {
  return {
    bookingId: row.booking_id || row.bookingId || '',
    customerName: row.customer_name || row.customerName || '',
    phone: row.phone || '',
    email: row.email || undefined,
    visitorCount: Number(row.visitor_count || row.visitorCount || 1),
    shoppingCategory: (row.shopping_category || row.shoppingCategory || "Men's Fashion") as ShoppingCategory,
    appointmentDate: String(row.appointment_date || row.appointmentDate || ''),
    appointmentTime: row.appointment_time || row.appointmentTime || '',
    status: (row.status || 'confirmed') as AppointmentStatus,
    additionalRequirements: row.additional_requirements || row.additionalRequirements || undefined,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    notes: row.notes || undefined,
  };
}

// Fetch all appointments from Supabase
export async function fetchAppointmentsFromSupabase(): Promise<{ data: Appointment[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    const appointments = (data || []).map(mapRowToAppointment);
    return { data: appointments, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to connect to Supabase' };
  }
}

// Save an appointment to Supabase
export async function saveAppointmentToSupabase(appointment: Appointment): Promise<{ success: boolean; error: string | null }> {
  try {
    const payload = {
      booking_id: appointment.bookingId,
      customer_name: appointment.customerName,
      phone: appointment.phone,
      email: appointment.email || null,
      visitor_count: appointment.visitorCount,
      shopping_category: appointment.shoppingCategory,
      appointment_date: appointment.appointmentDate,
      appointment_time: appointment.appointmentTime,
      status: appointment.status,
      additional_requirements: appointment.additionalRequirements || null,
      notes: appointment.notes || null,
      created_at: appointment.createdAt,
    };

    const { error } = await supabase.from('appointments').insert([payload]);

    if (error) {
      console.error('Supabase insert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Supabase exception:', err);
    return { success: false, error: err.message || 'Unexpected Supabase error' };
  }
}

// Update appointment status in Supabase
export async function updateAppointmentInSupabase(
  bookingId: string,
  updates: Partial<Appointment>
): Promise<{ success: boolean; error: string | null }> {
  try {
    const payload: Record<string, any> = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.notes !== undefined) payload.notes = updates.notes;
    if (updates.appointmentDate !== undefined) payload.appointment_date = updates.appointmentDate;
    if (updates.appointmentTime !== undefined) payload.appointment_time = updates.appointmentTime;

    const { error } = await supabase
      .from('appointments')
      .update(payload)
      .eq('booking_id', bookingId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update in Supabase' };
  }
}

// Map Supabase row to Order
export function mapRowToOrder(row: any): Order {
  return {
    orderId: row.order_id || row.orderId,
    customerName: row.customer_name || row.customerName,
    phone: row.phone,
    email: row.email,
    shippingAddress: typeof row.shipping_address === 'string' ? JSON.parse(row.shipping_address) : (row.shipping_address || {}),
    items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []),
    subtotal: Number(row.subtotal || 0),
    discount: Number(row.discount || 0),
    deliveryCharge: Number(row.delivery_charge || 0),
    totalAmount: Number(row.total_amount || 0),
    paymentMethod: row.payment_method || 'COD',
    paymentStatus: row.payment_status || 'pending',
    orderStatus: row.order_status || 'Order Placed',
    couponCode: row.coupon_code || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    estimatedDelivery: row.estimated_delivery || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    trackingNumber: row.tracking_number || undefined,
    carrier: row.carrier || undefined,
    timeline: typeof row.timeline === 'string' ? JSON.parse(row.timeline) : (row.timeline || []),
    notes: row.notes || undefined,
  };
}

// Save Order to Supabase
export async function saveOrderToSupabase(order: Order): Promise<{ success: boolean; error: string | null }> {
  try {
    const payload = {
      order_id: order.orderId,
      customer_name: order.customerName,
      phone: order.phone,
      email: order.email,
      shipping_address: order.shippingAddress,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      delivery_charge: order.deliveryCharge,
      total_amount: order.totalAmount,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      order_status: order.orderStatus,
      coupon_code: order.couponCode || null,
      estimated_delivery: order.estimatedDelivery,
      tracking_number: order.trackingNumber || null,
      carrier: order.carrier || null,
      timeline: order.timeline,
      notes: order.notes || null,
      created_at: order.createdAt,
    };

    const { error } = await supabase.from('orders').insert([payload]);
    if (error) {
      console.warn('Supabase order insert note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save order to Supabase' };
  }
}

// Fetch all orders from Supabase
export async function fetchOrdersFromSupabase(): Promise<{ data: Order[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    const orders = (data || []).map(mapRowToOrder);
    return { data: orders, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to fetch orders' };
  }
}

// Update Order in Supabase
export async function updateOrderInSupabase(
  orderId: string,
  updates: Partial<Order>
): Promise<{ success: boolean; error: string | null }> {
  try {
    const payload: Record<string, any> = {};
    if (updates.orderStatus !== undefined) payload.order_status = updates.orderStatus;
    if (updates.paymentStatus !== undefined) payload.payment_status = updates.paymentStatus;
    if (updates.timeline !== undefined) payload.timeline = updates.timeline;
    if (updates.trackingNumber !== undefined) payload.tracking_number = updates.trackingNumber;
    if (updates.carrier !== undefined) payload.carrier = updates.carrier;
    if (updates.notes !== undefined) payload.notes = updates.notes;

    const { error } = await supabase.from('orders').update(payload).eq('order_id', orderId);
    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Check connectivity & whether tables exist
export async function checkSupabaseStatus(): Promise<{
  connected: boolean;
  appointmentsTableExists: boolean;
  ordersTableExists: boolean;
  shopsTableExists?: boolean;
  error?: string;
}> {
  try {
    const apptCheck = await supabase.from('appointments').select('id').limit(1);
    const orderCheck = await supabase.from('orders').select('id').limit(1);
    const shopCheck = await supabase.from('shops').select('id').limit(1);

    const connected = !apptCheck.error || (apptCheck.error.code !== 'PGRST301' && !apptCheck.error.message.includes('fetch'));
    const appointmentsTableExists = !apptCheck.error || !apptCheck.error.message.includes('does not exist');
    const ordersTableExists = !orderCheck.error || !orderCheck.error.message.includes('does not exist');
    const shopsTableExists = !shopCheck.error || !shopCheck.error.message.includes('does not exist');

    return {
      connected: true,
      appointmentsTableExists,
      ordersTableExists,
      shopsTableExists,
    };
  } catch (err: any) {
    return {
      connected: false,
      appointmentsTableExists: false,
      ordersTableExists: false,
      error: err.message,
    };
  }
}

// -------------------------------------------------------------
// MARKETPLACE: SHOPS HELPERS
// -------------------------------------------------------------
export function mapRowToShop(row: any): Shop {
  return {
    shopId: row.shop_id || row.shopId || '',
    vendorId: row.vendor_id || row.vendorId || '',
    shopName: row.shop_name || row.shopName || '',
    slug: row.slug || '',
    category: row.category || "Men's Fashion",
    description: row.description || '',
    logoUrl: row.logo_url || row.logoUrl || '',
    coverImageUrl: row.cover_image_url || row.coverImageUrl || '',
    address: row.address || '',
    city: row.city || 'Bengaluru',
    state: row.state || 'Karnataka',
    phone: row.phone || '',
    whatsappNumber: row.whatsapp_number || row.whatsappNumber || '',
    openingHours: row.opening_hours || row.openingHours || '10:30 AM – 10:30 PM',
    rating: Number(row.rating || 5.0),
    reviewCount: Number(row.review_count || 0),
    status: row.status || 'approved',
    featured: Boolean(row.featured),
    verified: Boolean(row.verified ?? true),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export async function fetchShopsFromSupabase(): Promise<{ data: Shop[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data: (data || []).map(mapRowToShop), error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function saveShopToSupabase(shop: Shop): Promise<{ success: boolean; error: string | null }> {
  try {
    const payload = {
      shop_id: shop.shopId,
      vendor_id: shop.vendorId,
      shop_name: shop.shopName,
      slug: shop.slug,
      category: shop.category,
      description: shop.description,
      logo_url: shop.logoUrl,
      cover_image_url: shop.coverImageUrl,
      address: shop.address,
      city: shop.city,
      state: shop.state,
      phone: shop.phone,
      whatsapp_number: shop.whatsappNumber,
      opening_hours: shop.openingHours,
      rating: shop.rating,
      review_count: shop.reviewCount,
      status: shop.status,
      featured: shop.featured,
      verified: shop.verified,
      created_at: shop.createdAt,
    };
    const { error } = await supabase.from('shops').upsert([payload], { onConflict: 'shop_id' });
    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateShopInSupabase(shopId: string, updates: Partial<Shop>): Promise<{ success: boolean; error: string | null }> {
  try {
    const payload: Record<string, any> = {};
    if (updates.shopName !== undefined) payload.shop_name = updates.shopName;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.logoUrl !== undefined) payload.logo_url = updates.logoUrl;
    if (updates.coverImageUrl !== undefined) payload.cover_image_url = updates.coverImageUrl;
    if (updates.address !== undefined) payload.address = updates.address;
    if (updates.city !== undefined) payload.city = updates.city;
    if (updates.state !== undefined) payload.state = updates.state;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.whatsappNumber !== undefined) payload.whatsapp_number = updates.whatsappNumber;
    if (updates.openingHours !== undefined) payload.opening_hours = updates.openingHours;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.featured !== undefined) payload.featured = updates.featured;

    const { error } = await supabase.from('shops').update(payload).eq('shop_id', shopId);
    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// -------------------------------------------------------------
// MARKETPLACE: VENDOR APPLICATIONS HELPERS
// -------------------------------------------------------------
export function mapRowToVendorApplication(row: any): VendorApplication {
  return {
    applicationId: row.application_id || row.applicationId || '',
    vendorId: row.vendor_id || row.vendorId || '',
    ownerName: row.owner_name || row.ownerName || '',
    email: row.email || '',
    phone: row.phone || '',
    whatsappNumber: row.whatsapp_number || row.whatsappNumber || '',
    shopName: row.shop_name || row.shopName || '',
    category: row.category || "Men's Fashion",
    city: row.city || 'Bengaluru',
    state: row.state || 'Karnataka',
    address: row.address || '',
    description: row.description || '',
    logoUrl: row.logo_url || row.logoUrl,
    coverImageUrl: row.cover_image_url || row.coverImageUrl,
    openingHours: row.opening_hours || row.openingHours,
    status: row.status || 'pending',
    rejectionReason: row.rejection_reason || row.rejectionReason,
    submittedAt: row.submitted_at || row.submittedAt || new Date().toISOString(),
    reviewedAt: row.reviewed_at || row.reviewedAt,
  };
}

export async function fetchVendorApplicationsFromSupabase(): Promise<{ data: VendorApplication[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('vendor_applications')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data: (data || []).map(mapRowToVendorApplication), error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function saveVendorApplicationToSupabase(app: VendorApplication): Promise<{ success: boolean; error: string | null }> {
  try {
    const payload = {
      application_id: app.applicationId,
      vendor_id: app.vendorId,
      owner_name: app.ownerName,
      email: app.email,
      phone: app.phone,
      whatsapp_number: app.whatsappNumber,
      shop_name: app.shopName,
      category: app.category,
      city: app.city,
      state: app.state,
      address: app.address,
      description: app.description,
      logo_url: app.logoUrl || null,
      cover_image_url: app.coverImageUrl || null,
      opening_hours: app.openingHours || null,
      status: app.status,
      rejection_reason: app.rejectionReason || null,
      submitted_at: app.submittedAt,
      reviewed_at: app.reviewedAt || null,
    };
    const { error } = await supabase.from('vendor_applications').upsert([payload], { onConflict: 'application_id' });
    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateVendorApplicationInSupabase(
  appId: string, 
  status: 'pending' | 'approved' | 'rejected', 
  rejectionReason?: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('vendor_applications')
      .update({
        status,
        rejection_reason: rejectionReason || null,
        reviewed_at: new Date().toISOString()
      })
      .eq('application_id', appId);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// -------------------------------------------------------------
// MARKETPLACE: ENQUIRIES HELPERS
// -------------------------------------------------------------
export function mapRowToEnquiry(row: any): Enquiry {
  return {
    enquiryId: row.enquiry_id || row.enquiryId || '',
    shopId: row.shop_id || row.shopId || '',
    shopName: row.shop_name || row.shopName || '',
    productId: row.product_id || row.productId || undefined,
    productName: row.product_name || row.productName || undefined,
    productPrice: row.product_price ? Number(row.product_price) : undefined,
    customerName: row.customer_name || row.customerName || '',
    customerPhone: row.customer_phone || row.customerPhone || '',
    customerEmail: row.customer_email || row.customerEmail || undefined,
    message: row.message || '',
    status: row.status || 'new',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

export async function fetchEnquiriesFromSupabase(): Promise<{ data: Enquiry[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data: (data || []).map(mapRowToEnquiry), error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function saveEnquiryToSupabase(enquiry: Enquiry): Promise<{ success: boolean; error: string | null }> {
  try {
    const payload = {
      enquiry_id: enquiry.enquiryId,
      shop_id: enquiry.shopId,
      shop_name: enquiry.shopName,
      product_id: enquiry.productId || null,
      product_name: enquiry.productName || null,
      product_price: enquiry.productPrice || null,
      customer_name: enquiry.customerName,
      customer_phone: enquiry.customerPhone,
      customer_email: enquiry.customerEmail || null,
      message: enquiry.message,
      status: enquiry.status,
      created_at: enquiry.createdAt,
    };
    const { error } = await supabase.from('enquiries').insert([payload]);
    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateEnquiryStatusInSupabase(
  enquiryId: string, 
  status: 'new' | 'contacted' | 'resolved'
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('enquiries')
      .update({ status })
      .eq('enquiry_id', enquiryId);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
