import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#d4af37] hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </Link>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1c1e2b] border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>FashTag Consumer Trust</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#fcf9f2]">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#8c8577]">
          Last Updated: October 2026 • FashTag Flagship Store, BTM 1st Stage, Bengaluru
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-xs sm:text-sm text-[#b8b0a1] leading-relaxed">
        <section className="p-6 rounded-2xl bg-[#12141e] border border-[#232637] space-y-3">
          <h2 className="font-heading text-lg font-bold text-[#f5f2eb]">
            1. Information We Collect
          </h2>
          <p>
            When you book a personalized shopping appointment at FashTag (BTM 1st Stage, Bengaluru), 
            we collect only the essential details required to prepare your styling visit:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#cfc7b7]">
            <li>Customer Full Name for in-store greeting and reservation indexing.</li>
            <li>10-Digit Mobile Number to send booking confirmation, WhatsApp reminders, and slot updates.</li>
            <li>Optional Email Address if you request digital summary copies.</li>
            <li>Shopping Preference (Men's, Kids', Casual, Party) and party size to allocate dedicated fitting room resources.</li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl bg-[#12141e] border border-[#232637] space-y-3">
          <h2 className="font-heading text-lg font-bold text-[#f5f2eb]">
            2. How We Use Your Data
          </h2>
          <p>
            Your information is used strictly by our on-site store team to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#cfc7b7]">
            <li>Reserve time slots and prevent double bookings in our scheduling engine.</li>
            <li>Send you one-touch WhatsApp or SMS appointment confirmations.</li>
            <li>Coordinate bespoke size trials and personal styling preparations.</li>
          </ul>
          <p className="font-semibold text-[#d4af37] pt-1">
            We never sell, rent, or distribute customer telephone numbers or email records to third-party telemarketers or advertisers.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#12141e] border border-[#232637] space-y-3">
          <h2 className="font-heading text-lg font-bold text-[#f5f2eb]">
            3. Data Retention & Deletion
          </h2>
          <p>
            Booking history is retained to provide you with consistent styling preferences on subsequent visits. 
            You may request complete removal of your phone number and appointment records at any time by contacting our 
            store manager at <span className="text-white font-mono">{settings.phone}</span> or visiting us in person.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#12141e] border border-[#232637] space-y-3">
          <h2 className="font-heading text-lg font-bold text-[#f5f2eb]">
            4. Store Location & Inquiries
          </h2>
          <p>
            For any privacy-related queries, please write to us at:
          </p>
          <p className="text-white font-medium">
            FashTag Flagship Store<br />
            {settings.address}<br />
            Phone: {settings.phone}
          </p>
        </section>
      </div>
    </div>
  );
};
