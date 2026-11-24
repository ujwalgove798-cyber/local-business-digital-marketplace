import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  ShoppingBag,
  Truck,
  CreditCard,
  User
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';

export const Footer: React.FC = () => {
  const { settings } = useStore();
  const { t } = useLanguage();

  return (
    <footer className="bg-[#07080b] border-t border-[#1e202d] text-[#a8a192] relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-heading text-xl font-bold tracking-[0.14em] text-[#f8f5ee]">
                LOCALBIZ
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold mt-0.5">
                Digital Marketplace
              </span>
            </Link>
            
            <p className="text-sm leading-relaxed text-[#958e80]">
              Empowering neighbourhood retail businesses through digital visibility, live product showcases, and zero platform commission discovery.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`https://wa.me/${settings.whatsapp}?text=Hello%20LocalBiz%20Marketplace,%20I%20would%20like%20to%20know%20more`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14231b] border border-[#235838] text-emerald-400 text-xs font-semibold hover:bg-emerald-950/60 transition-colors w-fit"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Marketplace WhatsApp Support</span>
              </a>
              <span className="text-[11px] text-[#787163]">
                Zero commissions on local merchant orders and appointments.
              </span>
            </div>
          </div>

          {/* Quick Links & E-Commerce */}
          <div>
            <h4 className="font-heading text-sm text-[#f5f2eb] tracking-widest uppercase mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              Marketplace Hub
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shops" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 font-medium text-[#d4af37]">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Discover Local Shops</span>
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <span>Browse All Products</span>
                </Link>
              </li>
              <li>
                <Link to="/vendor/register" className="hover:text-[#d4af37] text-white transition-colors flex items-center gap-1.5 font-medium">
                  <span>List Your Shop (Free)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#d4af37]" />
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Track Your Order</span>
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Customer Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <span>Book In-Store VIP Slot</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-heading text-sm text-[#f5f2eb] tracking-widest uppercase mb-4 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
              Store Hours
            </h4>
            <div className="space-y-2 text-xs text-[#a39c8e]">
              <div className="flex justify-between border-b border-[#1b1c28] pb-1.5">
                <span>Mon – Thu</span>
                <span className="text-[#f5f2eb] font-medium">10:30 AM – 10:30 PM</span>
              </div>
              <div className="border-b border-[#1b1c28] pb-1.5 bg-[#17150e]/60 px-2 py-1 rounded border border-[#3b321a]">
                <div className="flex justify-between text-[#d4af37] font-semibold">
                  <span>Friday</span>
                  <span>10:30 AM – 10:30 PM</span>
                </div>
                <div className="text-[10px] text-[#aa9865] mt-0.5">
                  (Break: 1:00 PM – 3:00 PM)
                </div>
              </div>
              <div className="flex justify-between border-b border-[#1b1c28] pb-1.5">
                <span>Saturday</span>
                <span className="text-[#f5f2eb] font-medium">10:30 AM – 10:30 PM</span>
              </div>
              <div className="flex justify-between pb-1.5">
                <span>Sunday</span>
                <span className="text-[#f5f2eb] font-medium">10:30 AM – 10:30 PM</span>
              </div>
            </div>
          </div>

          {/* Visit & Connect */}
          <div>
            <h4 className="font-heading text-sm text-[#f5f2eb] tracking-widest uppercase mb-4 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              Store Location
            </h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <p className="text-[#b5ada0]">
                {settings.address}
              </p>
              
              <div className="pt-1">
                <a 
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-2 text-sm text-[#f5f2eb] hover:text-[#d4af37] font-medium transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#d4af37]" />
                  <span>{settings.phone}</span>
                </a>
              </div>

              <div className="pt-2">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11px] text-[#8e8778]">
                <CreditCard className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>UPI • Cards • COD Accepted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#171924] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#736c5f]">
          <p>© {new Date().getFullYear()} FASHTAG. All rights reserved. BTM 1st Stage, Bengaluru.</p>
          
          <div className="flex items-center gap-4 flex-wrap">
            <LanguageSelector variant="topbar" />
            <span>•</span>
            <Link to="/privacy" className="hover:text-[#d4af37] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-[#d4af37] transition-colors">
              Booking & Store Terms
            </Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-[#d4af37] flex items-center gap-1 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
