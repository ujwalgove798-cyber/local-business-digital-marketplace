import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Share2, 
  Download, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

export const ConfirmationPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { getAppointmentById, settings } = useStore();

  const appointment = bookingId ? getAppointmentById(bookingId) : undefined;

  useEffect(() => {
    // Fire celebratory confetti on mounting confirmation
    if (appointment) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#e6ca65', '#ffffff', '#2a9d8f'],
      });
    }
  }, [appointment]);

  if (!appointment) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-[#d4af37] mx-auto" />
        <h2 className="font-heading text-2xl text-white">Booking Record Not Found</h2>
        <p className="text-xs text-[#958e80]">
          We could not locate an appointment with ID: {bookingId}. Please check the code or contact our store.
        </p>
        <div className="pt-4">
          <Link
            to="/book"
            className="px-6 py-2.5 rounded-full bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider"
          >
            Book New Appointment
          </Link>
        </div>
      </div>
    );
  }

  // Pre-formatted WhatsApp text
  const whatsappMessage = encodeURIComponent(
    `Hello FashTag BTM Store! Here is my confirmed appointment:\n\n` +
    `• Booking ID: ${appointment.bookingId}\n` +
    `• Name: ${appointment.customerName}\n` +
    `• Date: ${appointment.appointmentDate}\n` +
    `• Time: ${appointment.appointmentTime}\n` +
    `• Preference: ${appointment.shoppingCategory}\n` +
    `• Visitors: ${appointment.visitorCount}\n\n` +
    `Looking forward to visiting your store!`
  );

  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${whatsappMessage}`;

  // Google Calendar Link generator
  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`FashTag Personalized Shopping Visit - ${appointment.bookingId}`);
    const details = encodeURIComponent(
      `Personalized in-store consultation at FashTag.\n` +
      `Booking ID: ${appointment.bookingId}\n` +
      `Category: ${appointment.shoppingCategory}\n` +
      `Phone: ${settings.phone}\n` +
      `Address: ${settings.address}`
    );
    const location = encodeURIComponent(settings.address);
    // Rough date format for Google Calendar YYYYMMDDTHHMMSSZ
    const cleanDate = appointment.appointmentDate.replace(/-/g, '');
    const dates = `${cleanDate}T110000Z/${cleanDate}T120000Z`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Top Banner */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-in zoom-in duration-300">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>
        
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#d4af37] block">
          Appointment Confirmed
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#fcf9f3]">
          We Can't Wait to Style You!
        </h1>
        <p className="text-xs sm:text-sm text-[#aba394] max-w-lg mx-auto">
          Your in-store shopping slot has been successfully reserved in our store schedule. 
          A dedicated style coordinator will be ready for you.
        </p>
      </div>

      {/* Main Confirmation Card */}
      <div className="bg-[#11131c] border border-[#2b2e40] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#d4af37]/20 to-transparent pointer-events-none" />

        {/* Booking ID Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#212435]">
          <div>
            <span className="text-[11px] text-[#8e8779] uppercase tracking-wider block">
              Unique Booking Identifier
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#d4af37] tracking-wider block mt-0.5">
              {appointment.bookingId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-800 text-emerald-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Confirmed</span>
            </span>
          </div>
        </div>

        {/* Appointment Grid Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#191c2a] text-[#d4af37] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#8c8577] block">Visit Date</span>
              <span className="font-bold text-[#f5f2eb] mt-0.5 block">
                {appointment.appointmentDate}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#191c2a] text-[#d4af37] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#8c8577] block">Time Slot</span>
              <span className="font-bold text-[#d4af37] mt-0.5 block">
                {appointment.appointmentTime}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#191c2a] text-[#d4af37] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#8c8577] block">Shopping Preference</span>
              <span className="font-bold text-[#f5f2eb] mt-0.5 block">
                {appointment.shoppingCategory}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#191c2a] text-[#d4af37] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#8c8577] block">Store Address</span>
              <span className="font-medium text-[#f5f2eb] mt-0.5 block text-xs leading-relaxed">
                {settings.address}
              </span>
            </div>
          </div>
        </div>

        {/* Additional info badge */}
        <div className="p-4 rounded-xl bg-[#171a26] border border-[#25283a] text-xs text-[#9d9586] space-y-1">
          <div className="flex items-center justify-between">
            <span>Customer: <strong className="text-white">{appointment.customerName}</strong></span>
            <span>Phone: <strong className="text-white">{appointment.phone}</strong></span>
          </div>
          {appointment.additionalRequirements && (
            <p className="pt-2 border-t border-white/5 text-[#c8c1b2] italic">
              Notes: "{appointment.additionalRequirements}"
            </p>
          )}
        </div>

        {/* Action Buttons: WhatsApp & Calendar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#1e462c] border border-[#2e7d4d] text-emerald-300 font-semibold text-xs uppercase tracking-wider hover:bg-emerald-900/60 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Send Details to WhatsApp</span>
          </a>

          <a
            href={createGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#161824] border border-white/20 text-[#eae3d5] font-semibold text-xs uppercase tracking-wider hover:border-[#d4af37] hover:text-[#d4af37] transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#d4af37]" />
            <span>Add to Google Calendar</span>
          </a>
        </div>
      </div>

      {/* Helpful arrival tips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-[#0f1118] border border-[#1f2231] space-y-2">
          <h4 className="font-heading font-bold text-[#f5f2eb] text-sm flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#d4af37]" />
            Need to Reschedule?
          </h4>
          <p className="text-[#8e8779] leading-relaxed">
            Plans change! Call or WhatsApp us at{' '}
            <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-[#d4af37] underline">
              {settings.phone}
            </a>{' '}
            and mention ID {appointment.bookingId} to shift your slot anytime.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1118] border border-[#1f2231] space-y-2">
          <h4 className="font-heading font-bold text-[#f5f2eb] text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            How to Reach Us
          </h4>
          <p className="text-[#8e8779] leading-relaxed">
            We are on the ground floor, 4th Cross, 9th Main Road in BTM 1st Stage. Dedicated 
            frontage parking is available.
          </p>
          <a
            href={settings.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#d4af37] font-semibold flex items-center gap-1 hover:underline pt-1"
          >
            <span>Open Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Return Actions */}
      <div className="text-center pt-4">
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9f9788] hover:text-white transition-colors"
        >
          <span>Browse our collections while you wait</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
