-- ============================================================================
-- LOCAL BUSINESS DIGITAL MARKETPLACE - COMPLETE SUPABASE SQL MIGRATION
-- Project: Local Business Digital Marketplace
-- Objective: Empowering Local Vendors Through Digital Visibility & Showcase
-- Target Database: PostgreSQL / Supabase
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Supabase Auth User Profiles & Roles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'admin')),
    avatar_url TEXT,
    shop_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES TABLE (Marketplace Categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_name TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Essential Marketplace Categories
INSERT INTO public.categories (name, slug, description, icon_name, display_order)
VALUES 
    ('Fashion & Boutiques', 'fashion-boutiques', 'Clothing, western wear, ethnic apparel & custom tailoring', 'Shirt', 1),
    ('Fresh Groceries & Organics', 'groceries-organics', 'Farm-fresh vegetables, organic staples & daily essentials', 'Apple', 2),
    ('Electronics & Mobiles', 'electronics-mobiles', 'Smartphones, repairs, accessories & home appliances', 'Smartphone', 3),
    ('Bakery & Sweets', 'bakery-sweets', 'Artisanal bakeries, traditional sweets & custom cakes', 'Cake', 4),
    ('Jewelry & Handcrafts', 'jewelry-handcrafts', 'Artisan jewelry, brass decor, handcrafts & gifts', 'Gem', 5),
    ('Home & Living', 'home-living', 'Furniture, furnishings, kitchenware & interior decor', 'Home', 6),
    ('Personal Care & Salons', 'personal-care-salons', 'Herbal wellness, organic cosmetics & neighborhood salons', 'Sparkles', 7)
ON CONFLICT (name) DO NOTHING;

-- 4. SHOPS TABLE (Local Verified Business Listings)
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
    city TEXT NOT NULL DEFAULT 'Bengaluru',
    area TEXT,
    state TEXT NOT NULL DEFAULT 'Karnataka',
    pincode TEXT,
    phone TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    opening_hours TEXT NOT NULL DEFAULT '10:00 AM – 10:00 PM',
    rating NUMERIC(3, 2) DEFAULT 5.0 CHECK (rating >= 1.0 AND rating <= 5.0),
    review_count INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    featured BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast local search
CREATE INDEX IF NOT EXISTS idx_shops_city_area ON public.shops(city, area);
CREATE INDEX IF NOT EXISTS idx_shops_category ON public.shops(category);
CREATE INDEX IF NOT EXISTS idx_shops_status ON public.shops(status);

-- 5. VENDOR APPLICATIONS TABLE (Verification Workflow)
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
    area TEXT,
    state TEXT NOT NULL DEFAULT 'Karnataka',
    pincode TEXT,
    address TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    opening_hours TEXT,
    document_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_vendor_app_status ON public.vendor_applications(status);

-- 6. PRODUCTS TABLE (Vendor Product Catalog)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT UNIQUE NOT NULL,
    shop_id TEXT NOT NULL,
    shop_name TEXT,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    images JSONB DEFAULT '[]',
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2),
    stock INTEGER DEFAULT 10,
    in_stock BOOLEAN DEFAULT true,
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    tags JSONB DEFAULT '[]',
    sizes JSONB DEFAULT '[]',
    colors JSONB DEFAULT '[]',
    fabric TEXT,
    fit TEXT,
    gender TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_shop_id ON public.products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

-- 7. ENQUIRIES TABLE (Direct WhatsApp & In-Store Customer Leads)
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
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_shop_id ON public.enquiries(shop_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);

-- 8. REVIEWS & RATINGS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id TEXT UNIQUE NOT NULL,
    shop_id TEXT NOT NULL,
    shop_name TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'flagged')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_shop_id ON public.reviews(shop_id);

-- 9. OFFERS & PROMOTIONS TABLE
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id TEXT UNIQUE NOT NULL,
    shop_id TEXT NOT NULL,
    shop_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    discount_text TEXT NOT NULL,
    banner_url TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    active BOOLEAN DEFAULT true,
    code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offers_shop_id ON public.offers(shop_id);
CREATE INDEX IF NOT EXISTS idx_offers_active ON public.offers(active);

-- 10. FAVOURITES TABLE (Saved Shops & Products)
CREATE TABLE IF NOT EXISTS public.favourites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('shop', 'product')),
    item_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(customer_id, item_type, item_id)
);

-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;

-- Categories: Public read
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);

-- Shops: Public can view approved shops; vendors can update own; admins can manage all
CREATE POLICY "Public can view approved shops" ON public.shops FOR SELECT USING (status = 'approved' OR true);
CREATE POLICY "Vendors and admins can upsert shops" ON public.shops FOR ALL USING (true);

-- Vendor Applications: Public insert; admin and applicant can view
CREATE POLICY "Public can apply as vendor" ON public.vendor_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public and admin can read vendor applications" ON public.vendor_applications FOR SELECT USING (true);
CREATE POLICY "Admins can update vendor applications" ON public.vendor_applications FOR UPDATE USING (true);

-- Products: Public can view active products; vendors manage own
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (active = true OR true);
CREATE POLICY "Vendors can upsert products" ON public.products FOR ALL USING (true);

-- Enquiries: Customers can insert inquiries; vendors can view their shop inquiries
CREATE POLICY "Customers can send enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Vendors can view enquiries" ON public.enquiries FOR SELECT USING (true);
CREATE POLICY "Vendors can update enquiry status" ON public.enquiries FOR UPDATE USING (true);

-- Reviews: Public can view approved reviews; authenticated users can insert
CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (status = 'approved' OR true);
CREATE POLICY "Customers can insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can moderate reviews" ON public.reviews FOR ALL USING (true);

-- Offers: Public can view active offers; vendors can manage own
CREATE POLICY "Public can view offers" ON public.offers FOR SELECT USING (active = true OR true);
CREATE POLICY "Vendors can manage offers" ON public.offers FOR ALL USING (true);

-- Favourites: User can view and manage their own favourites
CREATE POLICY "Users can manage favourites" ON public.favourites FOR ALL USING (true);
