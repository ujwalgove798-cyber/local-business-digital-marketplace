import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Award, 
  Calendar,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings } = useStore();

  const values = [
    {
      icon: Award,
      title: "Curation Over Clutter",
      desc: "We don't stock endless racks of generic fast fashion. Each piece on our floor is chosen for its cut, fabric hand-feel, and longevity."
    },
    {
      icon: Heart,
      title: "Family & Individual Styling",
      desc: "From toddlers to gentlemen, we make shopping seamless by offering coordinated options across men's and children's collections under one roof."
    },
    {
      icon: ShieldCheck,
      title: "Honest Bengaluru Hospitality",
      desc: "No aggressive upselling or fabricated markdowns. Our store attendants are genuine style consultants who focus on how you look and feel."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Editorial Story Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b1c28] border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Journey & Ethos</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-[#fbf8f2] leading-tight">
            Redefining Neighborhood Luxury in <br />
            <span className="gold-text-gradient">BTM 1st Stage.</span>
          </h1>

          <p className="text-base text-[#bfb7a7] leading-relaxed">
            Welcome to <strong className="text-[#f5f2eb]">FashTag</strong>, Bengaluru's premier boutique destination 
            for contemporary men's apparel, trendy children's fashion, bespoke-fitting shirts, 
            premium selvedge denims, and imported accessories.
          </p>

          <p className="text-sm text-[#9c9484] leading-relaxed">
            Founded with a singular mission—to liberate fashion enthusiasts from impersonal mall queues 
            and ill-fitting mass clothing—FashTag combines the intimate feel of an Italian tailor's salon 
            with the vibrant energy of Bengaluru’s fashion-forward crowd.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/book"
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b89128] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Store Visit</span>
            </Link>

            <Link
              to="/collections"
              className="px-6 py-3.5 rounded-full border border-white/20 text-[#e0d9cc] hover:border-[#d4af37] hover:text-[#d4af37] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Explore Collections
            </Link>
          </div>
        </div>

        {/* Visual Showcase Collage */}
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] border border-[#2b2e40] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1000&q=80"
              alt="FashTag Store Interior in BTM Layout"
              className="w-full h-full object-cover brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0e1017]/90 backdrop-blur-md border border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#d4af37] block">
                Flagship Boutique
              </span>
              <p className="text-xs text-[#cfc7b7] mt-0.5">
                No. 1136, Ground Floor, 4th Cross, 9th Main Road, BTM 1st Stage, Bengaluru.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars of Brand Values */}
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#d4af37] uppercase block">
            Our Guiding Philosophy
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#f8f5ee]">
            The Pillars of FashTag
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-2xl bg-[#12141f] border border-[#222536] space-y-4 hover:border-[#d4af37]/40 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1d2030] text-[#d4af37] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#f5f2eb]">
                  {v.title}
                </h3>
                <p className="text-xs text-[#9d9585] leading-relaxed">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Store Location & Hours Breakdown */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0f1118] border border-[#212435] grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#d4af37] uppercase block">
            Convenient Access
          </span>
          <h3 className="font-heading text-2xl font-bold text-[#f8f5ee]">
            Visit Us in South Bengaluru
          </h3>
          <p className="text-xs sm:text-sm text-[#aba392] leading-relaxed">
            Conveniently positioned on 9th Main Road in BTM 1st Stage with close proximity 
            to Bannerghatta Road, JP Nagar, and Silk Board. Easy roadside two-wheeler and 
            car parking available right near the store premises.
          </p>
          <div className="space-y-2 pt-2 text-xs text-[#dcd5c7]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>Ground floor entrance with effortless access.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>Spacious fitting rooms with triple-angle mirrors.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>Expert alteration advice on-site.</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#161824] border border-[#282c3f] space-y-4 text-xs">
          <h4 className="font-heading text-sm text-[#f5f2eb] tracking-wider uppercase border-b border-[#2b2f42] pb-3">
            Hours of Operation
          </h4>
          <div className="space-y-2.5 text-[#b0a99c]">
            <div className="flex justify-between">
              <span>Monday – Thursday</span>
              <span className="text-[#f5f2eb] font-semibold">10:30 AM – 10:30 PM</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#211e13] border border-[#4d3f1a] text-[#d4af37]">
              <div className="flex justify-between font-bold">
                <span>Friday</span>
                <span>10:30 AM – 10:30 PM</span>
              </div>
              <div className="text-[11px] text-[#bca877] mt-0.5">
                Note: Prayer & Lunch Break from 1:00 PM to 3:00 PM
              </div>
            </div>
            <div className="flex justify-between">
              <span>Saturday & Sunday</span>
              <span className="text-[#f5f2eb] font-semibold">10:30 AM – 10:30 PM</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#25293d] flex items-center justify-between">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="text-[#d4af37] font-semibold flex items-center gap-1.5 hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.phone}</span>
            </a>
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#968e80] hover:text-white flex items-center gap-1"
            >
              <span>Get Directions</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
