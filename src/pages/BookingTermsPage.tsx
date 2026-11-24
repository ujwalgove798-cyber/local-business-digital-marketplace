import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, Clock, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const BookingTermsPage: React.FC = () => {
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
          <FileCheck className="w-3.5 h-3.5" />
          <span>Store Visit Guidelines</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#fcf9f2]">
          Appointment Booking Terms & Conditions
        </h1>
        <p className="text-xs text-[#8c8577]">
          Applicable to all appointments scheduled at FashTag (BTM 1st Stage, Bengaluru)
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-[#b8b0a1] leading-relaxed">
        <div className="p-6 rounded-2xl bg-[#12141e] border border-[#232637] space-y-3">
          <h2 className="font-heading text-lg font-bold text-[#f5f2eb] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            1. Free In-Store Consultation
          </h2>
          <p>
            All appointment bookings at FashTag are completely free of charge. We do not charge 
            styling fees, entrance charges, or mandatory purchasing quotas. Appointments exist to 
            guarantee you a dedicated stylist slot, fitting room priority, and personalized outfit preparations.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#12141e] border border-[#232637] space-y-3">
          <h2 className="font-heading text-lg font-bold text-[#f5f2eb] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#d4af37]" />
            2. Punctuality & Slot Duration
          </h2>
          <p>
            Each reserved session is allocated for {settings.appointmentDuration} minutes with a {settings.bufferTime}-minute 
            courtesy buffer. We kindly request guests to arrive within 10 minutes of their scheduled time. 
            If you are running late, a quick message or phone call to {settings.phone} helps us hold your stylist.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#12141e] border border-[#232637] space-y-3">
          <h2 className="font-heading text-lg font-bold text-[#f5f2eb] flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            3. Friday Prayer & Rest Break
          </h2>
          <p>
            Please note that our store observes a Friday midday closure between 1:00 PM and 3:00 PM. 
            Online booking slots during this window are restricted. Normal operations resume promptly at 3:00 PM on Fridays.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#12141e] border border-[#232637] space-y-3">
          <h2 className="font-heading text-lg font-bold text-[#f5f2eb] flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#d4af37]" />
            4. Rescheduling & Cancellations
          </h2>
          <p>
            You can reschedule or cancel an appointment at any time without penalty. 
            Simply inform us over WhatsApp (+91 {settings.whatsapp}) or call {settings.phone} with your 
            unique booking ID (e.g. FT-BTM-XXXX).
          </p>
        </div>
      </div>
    </div>
  );
};
