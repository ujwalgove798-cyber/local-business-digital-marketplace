import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Store, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Image as ImageIcon,
  MessageCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const SHOP_CATEGORIES = [
  "Men's Fashion & Western",
  "Women's Fashion & Occasion Wear",
  "Shirts & Jeans",
  "Kids' & Teens Fashion",
  "Luxury Fashion Accessories",
  "Bespoke Tailoring & Suiting",
  "Casual Wear & Streetwear",
  "Ethnic & Contemporary Fusion",
];

const PRESET_LOGOS = [
  { label: 'Classic Monogram', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80' },
  { label: 'Silk Atelier', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80' },
  { label: 'Urban Denim', url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Youth Boutique', url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=400&q=80' },
];

const PRESET_COVERS = [
  { label: 'Flagship Storefront', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Modern Studio Floor', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Denim & Street Workshop', url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Accessories Display', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80' },
];

export const VendorRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerVendorApplication } = useStore();

  const [ownerName, setOwnerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [category, setCategory] = useState(SHOP_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [openingHours, setOpeningHours] = useState('10:30 AM – 10:30 PM (All 7 Days)');
  const [logoUrl, setLogoUrl] = useState(PRESET_LOGOS[0].url);
  const [coverImageUrl, setCoverImageUrl] = useState(PRESET_COVERS[0].url);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ownerName.trim() || !shopName.trim() || !email.trim() || !phone.trim() || !whatsappNumber.trim() || !address.trim() || !description.trim()) {
      setError('Please fill in all required shop registration fields.');
      return;
    }

    setIsSubmitting(true);
    const res = await registerVendorApplication({
      ownerName: ownerName.trim(),
      shopName: shopName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      category,
      description: description.trim(),
      openingHours: openingHours.trim(),
      logoUrl,
      coverImageUrl,
    });
    setIsSubmitting(false);

    if (res.success) {
      setSubmittedAppId(res.applicationId);
    } else {
      setError(res.message);
    }
  };

  if (submittedAppId) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-[#f5f2eb] flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-[#121422] border border-[#d4af37]/50 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center mx-auto text-[#d4af37]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-bold uppercase tracking-wider">
            Application Status: Pending Admin Verification
          </span>

          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#fdfbf7]">
            Application Submitted Successfully!
          </h2>

          <div className="p-4 rounded-2xl bg-[#171a28] border border-[#2b2f42] text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#9a9486]">Application ID:</span>
              <strong className="text-[#d4af37] font-mono">{submittedAppId}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9a9486]">Boutique Name:</span>
              <span className="text-white font-semibold">{shopName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9a9486]">Category:</span>
              <span className="text-[#cfc7b8]">{category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9a9486]">Location:</span>
              <span className="text-[#cfc7b8]">{city}, {state}</span>
            </div>
          </div>

          <p className="text-xs text-[#bfb8aa] leading-relaxed">
            The marketplace administrator will review your application. Once approved, your boutique storefront will go live on FashTag and you can publish fashion products and manage customer WhatsApp enquiries from your dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/vendor/dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg"
            >
              Go to Vendor Dashboard
            </button>
            <Link
              to="/shops"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1b1e30] hover:bg-[#252a42] text-[#cfc7b8] text-xs font-semibold tracking-wider transition-all"
            >
              Explore Existing Shops
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f5f2eb] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1f2e] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold tracking-widest uppercase">
            <Store className="w-3.5 h-3.5" />
            <span>Marketplace Vendor Onboarding</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#fdfbf7]">
            Register Your Fashion Boutique
          </h1>

          <p className="text-sm text-[#bfb8aa] max-w-xl mx-auto leading-relaxed">
            Join Bengaluru's premier multi-vendor fashion destination. Showcase your bespoke suits, linen, western wear, or kids collections to thousands of local customers.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#121422] border border-[#23273c] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Owner Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#212436] pb-2">
                <User className="w-4 h-4 text-[#d4af37]" />
                <h2 className="font-heading text-base font-bold text-[#fdfbf7]">
                  1. Boutique Owner & Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Owner Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Anita Deshmukh"
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. anita@silkweaves.com"
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Primary Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98860 33445"
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Customer WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="e.g. 919886033445"
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                  <span className="text-[10px] text-[#807a6e] mt-1 block">
                    Direct inquiries from buyers will be routed to this WhatsApp number.
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Shop Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#212436] pb-2">
                <Store className="w-4 h-4 text-[#d4af37]" />
                <h2 className="font-heading text-base font-bold text-[#fdfbf7]">
                  2. Shop Location & Categories
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Shop / Boutique Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Silk & Weaves Designer Studio"
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Primary Shop Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  >
                    {SHOP_CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#171a28] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Opening Hours *
                  </label>
                  <input
                    type="text"
                    required
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    placeholder="e.g. 10:30 AM – 10:30 PM (All 7 Days)"
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Physical Store Address in Bengaluru *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. No. 428, 100 Feet Road, HAL 2nd Stage, Indiranagar"
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Indiranagar, Bengaluru"
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Shop Story & Editorial Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell buyers about your craftsmanship, fabrics, design heritage, and specializations..."
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Branding Photos */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#212436] pb-2">
                <ImageIcon className="w-4 h-4 text-[#d4af37]" />
                <h2 className="font-heading text-base font-bold text-[#fdfbf7]">
                  3. Storefront Imagery & Logo
                </h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cfc7b8] mb-2">
                  Select Preset Boutique Logo or Enter Custom Image URL
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {PRESET_LOGOS.map((item) => (
                    <button
                      key={item.url}
                      type="button"
                      onClick={() => setLogoUrl(item.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-1 bg-[#1a1c2a] ${
                        logoUrl === item.url ? 'border-[#d4af37] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={item.url} alt="" className="w-full h-full object-cover rounded-lg" />
                      <span className="absolute bottom-1 inset-x-1 text-[9px] text-center bg-black/80 rounded py-0.5 text-[#d4af37] font-semibold">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="Or paste custom logo URL..."
                  className="w-full px-4 py-2 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#cfc7b8] mb-2">
                  Select Preset Boutique Cover Banner or Enter Custom Image URL
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {PRESET_COVERS.map((item) => (
                    <button
                      key={item.url}
                      type="button"
                      onClick={() => setCoverImageUrl(item.url)}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all p-1 bg-[#1a1c2a] ${
                        coverImageUrl === item.url ? 'border-[#d4af37] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={item.url} alt="" className="w-full h-full object-cover rounded-lg" />
                      <span className="absolute bottom-1 inset-x-1 text-[9px] text-center bg-black/80 rounded py-0.5 text-[#d4af37] font-semibold">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="Or paste custom cover banner image URL..."
                  className="w-full px-4 py-2 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* Approval Notice */}
            <div className="p-4 rounded-2xl bg-[#171928] border border-[#2b2f42] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
              <div className="text-xs text-[#c2baa9] leading-relaxed">
                <strong className="text-white block font-bold mb-0.5">Verification & Compliance Policy:</strong>
                Submitting this form creates a pending vendor application. The FashTag marketplace team will review your business credentials within 24 hours. Once verified, you will be authorized to publish products and connect with customers.
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c567] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 disabled:opacity-50 transition-all shadow-xl"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Vendor Application for Verification'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
