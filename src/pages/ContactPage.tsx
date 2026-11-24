import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  MapPin, 
  Phone, 
  Clock, 
  MessageCircle, 
  Mail, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, addToast } = useStore();
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubject, setFormSubject] = useState('Product Enquiry');
  const [formMessage, setFormMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      addToast('Please enter your name and phone number', 'error');
      return;
    }

    setSubmitted(true);
    addToast('Enquiry received! Our store team will contact you shortly.', 'success');

    // Also offer WhatsApp direct launch
    const text = encodeURIComponent(
      `Hello FashTag! My name is ${formName} (${formPhone}).\nSubject: ${formSubject}\nMessage: ${formMessage}`
    );
    window.open(`https://wa.me/${settings.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b1c28] border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Get in Touch</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-[#fbf8f2]">
          Visit & Contact FashTag
        </h1>
        <p className="text-sm sm:text-base text-[#a8a191] leading-relaxed">
          Have an enquiry about our latest imported collections, kids' festive sets, or store appointments? 
          Reach out directly or walk in during business hours.
        </p>
      </div>

      {/* Grid: Details & Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          {/* Address Card */}
          <div className="p-8 rounded-2xl bg-[#12141e] border border-[#222536] space-y-3">
            <div className="flex items-center gap-3 text-[#d4af37]">
              <MapPin className="w-6 h-6 shrink-0" />
              <h3 className="font-heading text-lg font-bold text-[#f5f2eb]">Store Location</h3>
            </div>
            <p className="text-sm text-[#c8c0b1] leading-relaxed pl-9">
              {settings.address}
            </p>
            <div className="pl-9 pt-2">
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold hover:underline"
              >
                <span>Navigate on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Phone & WhatsApp Card */}
          <div className="p-8 rounded-2xl bg-[#12141e] border border-[#222536] space-y-4">
            <div className="flex items-center gap-3 text-[#d4af37]">
              <Phone className="w-6 h-6 shrink-0" />
              <h3 className="font-heading text-lg font-bold text-[#f5f2eb]">Direct Phone & Chat</h3>
            </div>
            
            <div className="pl-9 space-y-3">
              <div>
                <span className="text-xs text-[#8c8577] block">Customer Service Desk:</span>
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="text-lg font-bold text-[#f5f2eb] hover:text-[#d4af37] transition-colors block mt-0.5"
                >
                  {settings.phone}
                </a>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=Hello%20FashTag,%20I%20have%20an%20enquiry%20regarding%20your%20store`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#163a23] border border-[#2a6b3f] text-emerald-400 text-xs font-semibold hover:bg-emerald-950 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp (+91 97398 41266)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="p-8 rounded-2xl bg-[#12141e] border border-[#222536] space-y-3">
            <div className="flex items-center gap-3 text-[#d4af37]">
              <Clock className="w-6 h-6 shrink-0" />
              <h3 className="font-heading text-lg font-bold text-[#f5f2eb]">Store Hours</h3>
            </div>
            
            <div className="pl-9 space-y-2 text-xs text-[#b3ac9f]">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Monday – Thursday</span>
                <span className="text-white font-medium">10:30 AM – 10:30 PM</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#211e13] border border-[#483d1c] text-[#d4af37]">
                <div className="flex justify-between font-bold">
                  <span>Friday</span>
                  <span>10:30 AM – 10:30 PM</span>
                </div>
                <div className="text-[11px] text-[#bca776] mt-0.5">
                  Break: 1:00 PM – 3:00 PM (Store closed for prayers/lunch)
                </div>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Saturday – Sunday</span>
                <span className="text-white font-medium">10:30 AM – 10:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#11131c] border border-[#232636] shadow-2xl flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#d4af37] block">
                Direct Message
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#f5f2eb] mt-1">
                Send a Message to Our Styling Desk
              </h3>
              <p className="text-xs text-[#958e80] mt-1">
                Our managers respond promptly during operating hours.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-3 bg-[#161a24] rounded-2xl p-6 border border-[#2c3246]">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-heading text-xl text-white">Thank You for Connecting!</h4>
                <p className="text-xs text-[#aba393] max-w-sm mx-auto">
                  Your enquiry has been noted and our team will get in touch with you right away.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 rounded-full border border-white/20 text-xs text-white hover:border-[#d4af37]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold uppercase tracking-wider text-[#d2cbbe] block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh V"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#171926] border border-[#2b2f42] rounded-xl px-4 py-3 text-sm text-[#f5f2eb] placeholder-[#6d665a] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="font-semibold uppercase tracking-wider text-[#d2cbbe] block mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 97398 41266"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-[#171926] border border-[#2b2f42] rounded-xl px-4 py-3 text-sm text-[#f5f2eb] placeholder-[#6d665a] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="font-semibold uppercase tracking-wider text-[#d2cbbe] block mb-1">
                    Enquiry Subject
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full bg-[#171926] border border-[#2b2f42] rounded-xl px-4 py-3 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Product Enquiry">Product / Collection Availability</option>
                    <option value="Wedding Styling">Wedding / Bulk Outfit Styling</option>
                    <option value="Kids Apparel">Kids' Festive Wear Sizing</option>
                    <option value="Store Visit">Special Store Visit Request</option>
                    <option value="Other">Other Information</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold uppercase tracking-wider text-[#d2cbbe] block mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us what you are looking for..."
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full bg-[#171926] border border-[#2b2f42] rounded-xl p-4 text-xs text-[#f5f2eb] placeholder-[#6d665a] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message & Chat</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Google Map */}
      <div className="rounded-3xl overflow-hidden border border-[#26293a] bg-[#0c0d12]">
        <div className="p-4 bg-[#141622] border-b border-[#26293a] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#d4af37]">
            <MapPin className="w-4 h-4" />
            <span className="font-semibold text-white">FashTag Flagship Store Map Guide</span>
          </div>
          <span className="text-[#8e8778]">BTM 1st Stage • Bengaluru</span>
        </div>
        <div className="h-[420px] w-full">
          <iframe
            title="FashTag Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.8286230626354!2d77.6083049!3d12.9187317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae151cdb12579b%3A0x7d391fecf62c64f7!2sBTM%201st%20Stage%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};
