import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Store, 
  Package, 
  MessageCircle, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Search, 
  Filter, 
  X, 
  Save, 
  Upload, 
  Sparkles,
  User,
  ArrowRight,
  BadgePercent
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductSize, ProductCategory, Shop, MarketplaceOffer } from '../types';

const CATEGORIES: ProductCategory[] = [
  "Men's Fashion",
  "Women's Fashion",
  "Kids' Fashion",
  'Accessories',
  'Footwear',
  'Shirts & Jeans',
  'Casual Wear',
  'Party Wear',
];

const ALL_SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export const VendorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    userProfile, 
    currentVendorShop, 
    shops, 
    products, 
    enquiries, 
    vendorApplications,
    addVendorProduct, 
    updateVendorProduct, 
    deleteVendorProduct,
    updateShopDetails,
    updateEnquiryStatus,
    loginWithDemoRole,
    offers,
    addOffer,
    deleteOffer,
    toggleOfferActive
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'enquiries' | 'offers' | 'profile' | 'shop'>('products');
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [newOfferForm, setNewOfferForm] = useState({
    title: '',
    discountValue: '20% OFF',
    promoCode: '',
    description: '',
  });

  // Look up vendor's shop
  const vendorShop = useMemo(() => {
    if (currentVendorShop) return currentVendorShop;
    if (userProfile && userProfile.role === 'vendor') {
      return shops.find((s) => s.vendorId === userProfile.id || s.shopId === userProfile.shopId) || shops[0];
    }
    // Fallback default for demonstration
    return shops[0];
  }, [currentVendorShop, userProfile, shops]);

  // Vendor's products
  const vendorProducts = useMemo(() => {
    if (!vendorShop) return [];
    return products.filter((p) => p.shopId === vendorShop.shopId);
  }, [vendorShop, products]);

  // Vendor's customer enquiries
  const vendorEnquiries = useMemo(() => {
    if (!vendorShop) return [];
    return enquiries.filter((e) => e.shopId === vendorShop.shopId);
  }, [vendorShop, enquiries]);

  // Look up pending application if any
  const vendorApp = useMemo(() => {
    if (!userProfile) return null;
    return vendorApplications.find((a) => a.vendorId === userProfile.id || a.email === userProfile.email) || null;
  }, [userProfile, vendorApplications]);

  // Product Modal State (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<{
    productName: string;
    category: ProductCategory;
    description: string;
    price: number;
    originalPrice: number;
    stock: number;
    imageUrl: string;
    sizes: ProductSize[];
    fabric: string;
    fit: string;
  }>({
    productName: '',
    category: "Men's Fashion",
    description: '',
    price: 2499,
    originalPrice: 3499,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
    sizes: ['M', 'L', 'XL'],
    fabric: '100% Cotton Linen',
    fit: 'Tailored Fit',
  });

  // Shop Settings Form State
  const [shopSettingsForm, setShopSettingsForm] = useState({
    shopName: vendorShop?.shopName || '',
    category: vendorShop?.category || '',
    description: vendorShop?.description || '',
    address: vendorShop?.address || '',
    city: vendorShop?.city || '',
    phone: vendorShop?.phone || '',
    whatsappNumber: vendorShop?.whatsappNumber || '',
    openingHours: vendorShop?.openingHours || '',
    logoUrl: vendorShop?.logoUrl || '',
    coverImageUrl: vendorShop?.coverImageUrl || '',
  });

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      productName: '',
      category: "Men's Fashion",
      description: '',
      price: 2499,
      originalPrice: 3499,
      stock: 12,
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
      sizes: ['M', 'L', 'XL'],
      fabric: '100% Breathable Linen',
      fit: 'Modern Regular Fit',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      productName: prod.productName,
      category: prod.category,
      description: prod.description,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock,
      imageUrl: prod.imageUrl,
      sizes: prod.sizes,
      fabric: prod.fabric || '',
      fit: prod.fit || '',
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.productName.trim()) return;

    if (editingProduct) {
      await updateVendorProduct(editingProduct.productId, {
        productName: productForm.productName,
        category: productForm.category,
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        stock: Number(productForm.stock),
        imageUrl: productForm.imageUrl,
        sizes: productForm.sizes,
        fabric: productForm.fabric,
        fit: productForm.fit,
      });
    } else {
      await addVendorProduct({
        productName: productForm.productName,
        category: productForm.category,
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        stock: Number(productForm.stock),
        imageUrl: productForm.imageUrl,
        sizes: productForm.sizes,
        colors: [{ name: 'Default', hex: '#111111' }],
        active: true,
        fabric: productForm.fabric,
        fit: productForm.fit,
        shopId: vendorShop?.shopId,
        shopName: vendorShop?.shopName,
      });
    }

    setIsProductModalOpen(false);
  };

  const handleSaveShopSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorShop) return;
    await updateShopDetails(vendorShop.shopId, shopSettingsForm);
  };

  const isPendingApproval = vendorShop?.status === 'pending' || (vendorApp && vendorApp.status === 'pending');

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f5f2eb] pb-24">
      {/* Top Banner & Shop Header */}
      <div className="bg-[#121422] border-b border-[#212436] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border-2 border-[#d4af37] overflow-hidden bg-[#1c1f2e] shadow-lg shrink-0">
              <img
                src={vendorShop?.logoUrl}
                alt={vendorShop?.shopName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl font-bold text-[#fdfbf7]">
                  {vendorShop?.shopName || 'Boutique Storefront'}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  vendorShop?.status === 'approved'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {vendorShop?.status === 'approved' ? 'Verified & Active' : 'Pending Verification'}
                </span>
              </div>
              <p className="text-xs text-[#9a9486] mt-1">
                {vendorShop?.city} • {vendorShop?.category}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/shops/${vendorShop?.shopId}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1c1f30] hover:bg-[#252a42] text-xs font-semibold text-[#f5f2eb] hover:text-[#d4af37] border border-[#2d3248] transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Storefront</span>
            </Link>

            <button
              onClick={handleOpenAddProduct}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Pending Verification Banner */}
        {isPendingApproval && (
          <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-700/60 flex items-start gap-3.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-200">
                Application Under Administrator Review
              </h4>
              <p className="text-xs text-amber-300/80 leading-relaxed">
                Your shop application is currently being verified by the FashTag marketplace operations team. Once verified, your products will be visible to all public buyers across Bengaluru. You can add catalog products and configure your profile right now.
              </p>
            </div>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-[#141624] border border-[#23273a] shadow-lg space-y-1">
            <span className="text-[11px] font-bold text-[#9a9486] uppercase tracking-wider">
              Total Products
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#fdfbf7]">
              {vendorProducts.length}
            </div>
            <span className="text-[10px] text-emerald-400">
              {vendorProducts.filter(p => p.stock > 0).length} in stock
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#141624] border border-[#23273a] shadow-lg space-y-1">
            <span className="text-[11px] font-bold text-[#9a9486] uppercase tracking-wider">
              Customer Enquiries
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#d4af37]">
              {vendorEnquiries.length}
            </div>
            <span className="text-[10px] text-[#9a9486]">
              {vendorEnquiries.filter(e => e.status === 'new').length} unread leads
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#141624] border border-[#23273a] shadow-lg space-y-1">
            <span className="text-[11px] font-bold text-[#9a9486] uppercase tracking-wider">
              Shop Rating
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 flex items-center gap-1.5">
              <span>{vendorShop?.rating.toFixed(1) || '5.0'}</span>
              <Star className="w-5 h-5 fill-amber-300 inline" />
            </div>
            <span className="text-[10px] text-[#9a9486]">
              {vendorShop?.reviewCount || 0} customer reviews
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#141624] border border-[#23273a] shadow-lg space-y-1">
            <span className="text-[11px] font-bold text-[#9a9486] uppercase tracking-wider">
              WhatsApp Contact
            </span>
            <div className="text-sm font-semibold text-white truncate mt-1">
              +{vendorShop?.whatsappNumber || '919739841266'}
            </div>
            <span className="text-[10px] text-emerald-400">
              Ready to receive buyer leads
            </span>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#212436] pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
              activeTab === 'products'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#9a9486] hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Manage Products ({vendorProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
              activeTab === 'enquiries'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#9a9486] hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Buyer Enquiries ({vendorEnquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
              activeTab === 'shop'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#9a9486] hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Store Profile & Hours</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
              activeTab === 'offers'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#9a9486] hover:text-white'
            }`}
          >
            <BadgePercent className="w-4 h-4" />
            <span>Store Offers & Deals</span>
          </button>
        </div>

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#fdfbf7]">
                  Your Product Catalog
                </h3>
                <p className="text-xs text-[#9a9486]">
                  Add, edit, or manage sizes and pricing for your boutique's collection.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#e6c24d] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Outfit</span>
              </button>
            </div>

            {vendorProducts.length === 0 ? (
              <div className="text-center py-16 bg-[#131522] border border-[#23273c] rounded-2xl p-6">
                <Package className="w-12 h-12 text-[#9a9486] mx-auto mb-3 opacity-40" />
                <h4 className="text-sm font-semibold text-white">No products added yet</h4>
                <p className="text-xs text-[#9a9486] mt-1 max-w-sm mx-auto">
                  Click "New Outfit" above to list your first shirt, blazer, dress, or accessory.
                </p>
                <button
                  onClick={handleOpenAddProduct}
                  className="mt-4 px-5 py-2 rounded-full bg-[#d4af37] text-black text-xs font-bold"
                >
                  Create First Product
                </button>
              </div>
            ) : (
              <div className="bg-[#131522] border border-[#23273c] rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#181a28] text-[#d4af37] uppercase text-[10px] tracking-wider border-b border-[#24283c]">
                      <tr>
                        <th className="p-4">Product</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price / MRP</th>
                        <th className="p-4">Sizes</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#202334] text-[#cfc7b8]">
                      {vendorProducts.map((p) => (
                        <tr key={p.productId} className="hover:bg-[#181a28]/60 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt={p.productName}
                              className="w-12 h-14 object-cover rounded-lg bg-black shrink-0 border border-[#292d40]"
                            />
                            <div>
                              <strong className="text-white block font-semibold">{p.productName}</strong>
                              <span className="text-[10px] text-[#807a6f]">{p.fabric || 'Standard fabric'}</span>
                            </div>
                          </td>
                          <td className="p-4">{p.category}</td>
                          <td className="p-4">
                            <span className="font-bold text-white">₹{p.price.toLocaleString('en-IN')}</span>
                            {p.originalPrice && (
                              <span className="text-[10px] text-gray-500 line-through block">
                                ₹{p.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1 flex-wrap">
                              {p.sizes.map((s) => (
                                <span key={s} className="px-1.5 py-0.5 rounded bg-[#1c1f2e] text-[10px]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.stock > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                            }`}>
                              {p.stock > 0 ? `${p.stock} In Stock` : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 rounded-lg bg-[#1c1f30] text-[#cfc7b8] hover:text-[#d4af37] border border-[#2b2f42]"
                                title="Edit Product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Remove "${p.productName}" from your shop?`)) {
                                    deleteVendorProduct(p.productId);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-[#1c1f30] text-[#cfc7b8] hover:text-rose-400 border border-[#2b2f42]"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BUYER ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-[#fdfbf7]">
                Customer WhatsApp & In-Store Leads ({vendorEnquiries.length})
              </h3>
              <p className="text-xs text-[#9a9486]">
                Leads sent by shoppers viewing your boutique items. Click "Reply on WhatsApp" to message the customer directly.
              </p>
            </div>

            {vendorEnquiries.length === 0 ? (
              <div className="text-center py-16 bg-[#131522] border border-[#23273c] rounded-2xl p-6">
                <MessageCircle className="w-12 h-12 text-[#9a9486] mx-auto mb-3 opacity-40" />
                <h4 className="text-sm font-semibold text-white">No customer enquiries yet</h4>
                <p className="text-xs text-[#9a9486] mt-1">
                  Enquiries submitted through your store page or product cards will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendorEnquiries.map((enq) => {
                  const cleanPhone = enq.customerPhone.replace(/\D/g, '');
                  const replyText = `Hello ${enq.customerName}, this is ${vendorShop?.shopName}. Thank you for your inquiry regarding "${enq.productName || 'our collection'}". How can we assist you?`;
                  const replyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(replyText)}`;

                  return (
                    <div
                      key={enq.enquiryId}
                      className="p-5 rounded-2xl bg-[#131522] border border-[#23273c] space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#d4af37] font-semibold">
                            {enq.enquiryId}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            enq.status === 'new'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : enq.status === 'contacted'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {enq.status}
                          </span>
                        </div>

                        <div>
                          <strong className="text-sm font-bold text-white block">
                            {enq.customerName}
                          </strong>
                          <span className="text-xs text-[#9a9486] block">
                            Phone: {enq.customerPhone} {enq.customerEmail && `• ${enq.customerEmail}`}
                          </span>
                        </div>

                        {enq.productName && (
                          <div className="p-2.5 rounded-xl bg-[#191c2b] border border-[#282d42] text-xs text-[#d4af37]">
                            Inquired about: <strong>{enq.productName}</strong>
                            {enq.productPrice && ` (₹${enq.productPrice})`}
                          </div>
                        )}

                        <p className="text-xs text-[#c2baa9] bg-[#161826] p-3 rounded-xl border border-[#222538] leading-relaxed">
                          "{enq.message}"
                        </p>
                      </div>

                      {/* Reply and status update actions */}
                      <div className="pt-3 border-t border-[#1f2234] flex items-center justify-between gap-3">
                        <a
                          href={replyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => updateEnquiryStatus(enq.enquiryId, 'contacted')}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>Reply on WhatsApp</span>
                        </a>

                        <button
                          onClick={() => updateEnquiryStatus(enq.enquiryId, enq.status === 'resolved' ? 'new' : 'resolved')}
                          className="px-3 py-2 rounded-xl bg-[#1c1f30] hover:bg-[#252a42] text-xs font-semibold text-[#cfc7b8] border border-[#2b2f42]"
                        >
                          {enq.status === 'resolved' ? 'Mark New' : 'Mark Done'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SHOP PROFILE SETTINGS */}
        {activeTab === 'shop' && (
          <div className="bg-[#121422] border border-[#23273c] rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-[#fdfbf7]">
                Boutique Information & Contact Details
              </h3>
              <p className="text-xs text-[#9a9486]">
                These details are displayed on your public storefront and used for customer WhatsApp links.
              </p>
            </div>

            <form onSubmit={handleSaveShopSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Boutique Name
                  </label>
                  <input
                    type="text"
                    required
                    value={shopSettingsForm.shopName}
                    onChange={(e) => setShopSettingsForm({ ...shopSettingsForm, shopName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={shopSettingsForm.category}
                    onChange={(e) => setShopSettingsForm({ ...shopSettingsForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    WhatsApp Number (for customer messages)
                  </label>
                  <input
                    type="tel"
                    required
                    value={shopSettingsForm.whatsappNumber}
                    onChange={(e) => setShopSettingsForm({ ...shopSettingsForm, whatsappNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={shopSettingsForm.phone}
                    onChange={(e) => setShopSettingsForm({ ...shopSettingsForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Physical Store Address in Bengaluru
                  </label>
                  <input
                    type="text"
                    required
                    value={shopSettingsForm.address}
                    onChange={(e) => setShopSettingsForm({ ...shopSettingsForm, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Locality / City
                  </label>
                  <input
                    type="text"
                    required
                    value={shopSettingsForm.city}
                    onChange={(e) => setShopSettingsForm({ ...shopSettingsForm, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    required
                    value={shopSettingsForm.openingHours}
                    onChange={(e) => setShopSettingsForm({ ...shopSettingsForm, openingHours: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Store Description
                  </label>
                  <textarea
                    rows={3}
                    value={shopSettingsForm.description}
                    onChange={(e) => setShopSettingsForm({ ...shopSettingsForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37] resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md"
                >
                  Save Store Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: OFFERS & PROMOTIONS */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#121422] border border-[#23273c] rounded-3xl">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#fdfbf7] flex items-center gap-2">
                  <BadgePercent className="w-5 h-5 text-[#d4af37]" />
                  <span>Store Discount Offers & Deals</span>
                </h3>
                <p className="text-xs text-[#9a9486] mt-0.5">
                  Publish special discounts and promo codes visible on the marketplace home and your storefront.
                </p>
              </div>

              <button
                onClick={() => setIsAddingOffer(!isAddingOffer)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingOffer ? 'Cancel' : 'Create Special Offer'}</span>
              </button>
            </div>

            {/* Offer Creation Form */}
            {isAddingOffer && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newOfferForm.title.trim()) return;
                  await addOffer({
                    shopId: vendorShop.shopId,
                    shopName: vendorShop.shopName,
                    title: newOfferForm.title.trim(),
                    discountValue: newOfferForm.discountValue.trim(),
                    promoCode: newOfferForm.promoCode.trim().toUpperCase() || 'LOCALDEAL',
                    description: newOfferForm.description.trim() || 'Exclusive neighbourhood discount.',
                    isActive: true,
                  });
                  setNewOfferForm({ title: '', discountValue: '20% OFF', promoCode: '', description: '' });
                  setIsAddingOffer(false);
                }}
                className="p-6 bg-[#141626] border border-[#2d3248] rounded-3xl space-y-4 text-xs"
              >
                <h4 className="font-bold text-white text-sm">New Discount Deal Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#cfc7b8] mb-1 font-semibold">Offer Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Weekend Festive Bonanza"
                      value={newOfferForm.title}
                      onChange={(e) => setNewOfferForm({ ...newOfferForm, title: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#1b1e2e] border border-[#2b3044] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#cfc7b8] mb-1 font-semibold">Discount Badge *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 25% OFF or Flat ₹500 OFF"
                      value={newOfferForm.discountValue}
                      onChange={(e) => setNewOfferForm({ ...newOfferForm, discountValue: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#1b1e2e] border border-[#2b3044] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#cfc7b8] mb-1 font-semibold">Promo Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. FESTIVE25"
                      value={newOfferForm.promoCode}
                      onChange={(e) => setNewOfferForm({ ...newOfferForm, promoCode: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#1b1e2e] border border-[#2b3044] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#cfc7b8] mb-1 font-semibold">Terms / Description</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Valid on all in-store purchases and WhatsApp orders above ₹1,999 until Sunday."
                    value={newOfferForm.description}
                    onChange={(e) => setNewOfferForm({ ...newOfferForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1b1e2e] border border-[#2b3044] rounded-xl text-white focus:outline-none focus:border-[#d4af37] resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingOffer(false)}
                    className="px-4 py-2 text-[#9a9486] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold uppercase tracking-wider"
                  >
                    Publish Offer
                  </button>
                </div>
              </form>
            )}

            {/* List of Existing Offers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers
                .filter((o) => o.shopId === vendorShop.shopId || !o.shopId)
                .map((offer) => (
                  <div
                    key={offer.id}
                    className="p-5 rounded-2xl bg-[#121422] border border-[#23273c] flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                        {offer.discountValue}
                      </span>
                      <span className="font-mono text-[11px] text-[#d4af37] bg-[#1a1e2f] px-2 py-0.5 rounded border border-[#2b334d]">
                        {offer.promoCode || 'IN-STORE'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base">{offer.title}</h4>
                      <p className="text-xs text-[#9a9486] mt-1">{offer.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#1e2336] flex items-center justify-between text-xs">
                      <button
                        onClick={() => toggleOfferActive(offer.id)}
                        className={`font-semibold ${offer.isActive !== false ? 'text-emerald-400' : 'text-[#8a8475]'}`}
                      >
                        Status: {offer.isActive !== false ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => deleteOffer(offer.id)}
                        className="text-rose-400 hover:text-rose-300 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#131522] border border-[#2b2f42] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#212436] pb-4">
              <h3 className="font-heading text-lg font-bold text-[#fdfbf7]">
                {editingProduct ? 'Edit Product' : 'Add New Product to Shop'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.productName}
                    onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                    placeholder="e.g. Pure Linen Mandarin Collar Shirt"
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#171a28] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Selling Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Original Price / MRP (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Inventory Stock Count *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Fabric / Material
                  </label>
                  <input
                    type="text"
                    value={productForm.fabric}
                    onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                    placeholder="e.g. 100% French Flax Linen"
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SIZES.map((sz) => {
                      const selected = productForm.sizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            if (selected) {
                              setProductForm({
                                ...productForm,
                                sizes: productForm.sizes.filter((s) => s !== sz),
                              });
                            } else {
                              setProductForm({
                                ...productForm,
                                sizes: [...productForm.sizes, sz],
                              });
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            selected
                              ? 'bg-[#d4af37] text-black shadow-md'
                              : 'bg-[#181a28] text-[#9a9486] border border-[#272b3e] hover:text-white'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Detailed craftsmanship notes, weave type, wash care..."
                    className="w-full px-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37] resize-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#212436] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#9a9486] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
