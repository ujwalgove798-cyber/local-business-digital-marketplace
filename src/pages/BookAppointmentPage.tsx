import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingCategory } from '../types';
import { getSlotsForDate, getDayKeyFromDate } from '../utils/bookingUtils';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Users, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ArrowLeft, 
  ShieldCheck,
  Check
} from 'lucide-react';

export const BookAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { settings, appointments, bookAppointment, addToast } = useStore();

  // Wizard Step (1 to 6)
  // Step 1: Date, Step 2: Time, Step 3: Shopping Preference, Step 4: Customer Details, Step 5: Summary & Confirm
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const initialCategoryParam = (searchParams.get('category') as ShoppingCategory) || "Men's Fashion";
  
  // Date default: today's or tomorrow's date YYYY-MM-DD
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [shoppingCategory, setShoppingCategory] = useState<ShoppingCategory>(initialCategoryParam);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [visitorCount, setVisitorCount] = useState<number>(1);
  const [additionalRequirements, setAdditionalRequirements] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculate slots dynamically for selected date
  const slotData = useMemo(() => {
    if (!selectedDate) return { slots: [], isBlockedDate: false, dailyLimitReached: false };
    return getSlotsForDate(selectedDate, settings, appointments);
  }, [selectedDate, settings, appointments]);

  // If selectedTime became unavailable (e.g. date changed), clear it
  useEffect(() => {
    if (selectedTime) {
      const match = slotData.slots.find((s) => s.timeStr === selectedTime && s.isAvailable);
      if (!match) {
        setSelectedTime('');
      }
    }
  }, [selectedDate, slotData.slots]);

  // Categories list
  const categoriesList: { title: ShoppingCategory; desc: string; icon: string }[] = [
    {
      title: "Men's Fashion",
      desc: "Suits, textured blazers, formal trousers, linen shirts & evening looks.",
      icon: "👔",
    },
    {
      title: "Kids' Fashion",
      desc: "Boys festive waistcoats, girls tiered dresses, imported outfits & partywear.",
      icon: "🧒",
    },
    {
      title: "Casual Wear",
      desc: "Cuban resort shirts, high-density cotton tees, chinos & casual denim.",
      icon: "👕",
    },
    {
      title: "Party Wear",
      desc: "Statement clubbing shirts, sleek tailored jackets, satin finishes & gala attire.",
      icon: "✨",
    },
    {
      title: "General Shopping Assistance",
      desc: "Full family styling walkthrough across all collections in the store.",
      icon: "🛍️",
    },
  ];

  // Helper date selector for next 14 days
  const upcomingDays = useMemo(() => {
    const list = [];
    const base = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const dateNum = d.getDate();
      const isBlocked = settings.blockedDates && settings.blockedDates.includes(ymd);
      list.push({ ymd, dayName, monthName, dateNum, isBlocked, isFriday: d.getDay() === 5 });
    }
    return list;
  }, [settings.blockedDates]);

  // Validation
  const validateStep4 = (): boolean => {
    setErrorMessage(null);
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage('Please enter your full name (minimum 3 characters).');
      return false;
    }
    
    // Indian phone regex: 10 digits, optionally prefixed with +91 or 0
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMessage('Please provide a valid 10-digit Indian mobile number (e.g. 9845012345).');
      return false;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please provide a valid email address or leave it blank.');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (!selectedDate) {
        setErrorMessage('Please pick an appointment date.');
        return;
      }
      if (slotData.isBlockedDate) {
        setErrorMessage(slotData.message || 'Store is closed on this date.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedTime) {
        setErrorMessage('Please select an available time slot.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!shoppingCategory) {
        setErrorMessage('Please pick your shopping preference.');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (validateStep4()) {
        setCurrentStep(5);
      }
    }
  };

  // Step 6 / Final Confirmation handler
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Format phone cleanly
      let formattedPhone = phone.trim();
      const cleanDigits = formattedPhone.replace(/\D/g, '');
      if (cleanDigits.length === 10) {
        formattedPhone = `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`;
      }

      const booked = await bookAppointment({
        customerName: fullName,
        phone: formattedPhone,
        email: email.trim() || undefined,
        visitorCount,
        shoppingCategory,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        additionalRequirements,
      });

      // Redirect immediately to Confirmation Page
      navigate(`/confirmation/${booked.bookingId}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to book slot. Please try another time.');
      setIsSubmitting(false);
    }
  };

  const dayOfWeek = getDayKeyFromDate(selectedDate);
  const isFriday = dayOfWeek === 'friday';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b1c28] border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>FashTag In-Store Consultation</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#fbf8f2]">
          Book Your Personalized Shopping Visit
        </h1>
        <p className="text-xs sm:text-sm text-[#aba394] max-w-xl mx-auto">
          Reserve private styling time at our BTM 1st Stage store. Completely free of charge. 
          We prepare collections in your size before you arrive.
        </p>
      </div>

      {/* Wizard Progress Steps Indicator */}
      <div className="bg-[#12141e] border border-[#232636] rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {[
            { num: 1, label: 'Date' },
            { num: 2, label: 'Time Slot' },
            { num: 3, label: 'Preference' },
            { num: 4, label: 'Details' },
            { num: 5, label: 'Summary' },
          ].map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 text-black shadow-md'
                      : isCurrent
                      ? 'bg-[#d4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-110'
                      : 'bg-[#1e202e] text-[#787163]'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                <span className={`mt-2 font-medium hidden sm:block ${isCurrent ? 'text-[#d4af37]' : isCompleted ? 'text-white' : 'text-[#706a5e]'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      {/* Main Step Body */}
      <div className="bg-[#11131c] border border-[#212433] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        
        {/* STEP 1: Select Date */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#1e2130] pb-4">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#f5f2eb]">
                  Step 1: Select Appointment Date
                </h2>
                <p className="text-xs text-[#9c9484] mt-1">
                  Choose a date within the next 2 weeks. Past dates are automatically blocked.
                </p>
              </div>
              <span className="text-xs text-[#d4af37] font-semibold">1 / 5</span>
            </div>

            {/* Quick Date Carousel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {upcomingDays.map((day) => {
                const isSelected = selectedDate === day.ymd;
                return (
                  <button
                    key={day.ymd}
                    type="button"
                    disabled={day.isBlocked}
                    onClick={() => {
                      setSelectedDate(day.ymd);
                      setErrorMessage(null);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      day.isBlocked
                        ? 'opacity-30 cursor-not-allowed bg-[#181a24] border-transparent text-[#615a4e]'
                        : isSelected
                        ? 'bg-gradient-to-b from-[#d4af37] to-[#ba942e] text-black border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)] font-bold scale-105'
                        : 'bg-[#151722] border-[#252838] text-[#c9c1b2] hover:border-[#d4af37]/50 hover:bg-[#1a1d2c]'
                    }`}
                  >
                    <span className="block text-[11px] uppercase tracking-wider font-semibold">
                      {day.dayName}
                    </span>
                    <span className="block text-xl font-bold my-1">
                      {day.dateNum}
                    </span>
                    <span className="block text-[10px] opacity-80">
                      {day.monthName}
                    </span>
                    {day.isFriday && (
                      <span className={`block text-[8px] uppercase mt-1 tracking-tighter ${isSelected ? 'text-black font-semibold' : 'text-[#d4af37]'}`}>
                        Fri Break
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Manual Date Picker Input */}
            <div className="pt-4 border-t border-[#1e2130] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-[#a19a8b]">Or pick a specific calendar date:</span>
              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[#181a26] border border-[#2e3246] rounded-xl px-4 py-2 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Friday Notice Banner */}
            {isFriday && (
              <div className="p-3.5 rounded-xl bg-[#231e13] border border-[#52441c] text-xs text-[#deb743] flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-[#d4af37]" />
                <span>
                  <strong>Friday Store Notice:</strong> The store has a prayer & rest break from 1:00 PM to 3:00 PM. 
                  Time slots during this interval are blocked.
                </span>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Select Time Slot */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#1e2130] pb-4">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#f5f2eb]">
                  Step 2: Select Available Time Slot
                </h2>
                <p className="text-xs text-[#9c9484] mt-1">
                  Selected date: <strong className="text-[#d4af37]">{selectedDate}</strong> ({dayOfWeek.toUpperCase()})
                </p>
              </div>
              <span className="text-xs text-[#d4af37] font-semibold">2 / 5</span>
            </div>

            {slotData.dailyLimitReached ? (
              <div className="py-12 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-[#d4af37] mx-auto" />
                <h4 className="font-heading text-lg text-white">Daily Limit Reached</h4>
                <p className="text-xs text-[#9c9484] max-w-sm mx-auto">
                  All available styling slots for {selectedDate} have been reserved. Please return to Step 1 and choose another date.
                </p>
              </div>
            ) : slotData.slots.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#9c9484]">
                No available time slots remaining for this date. Please choose a future date.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {slotData.slots.map((slot) => {
                  const isSelected = selectedTime === slot.timeStr;
                  return (
                    <button
                      key={slot.timeStr}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => {
                        setSelectedTime(slot.timeStr);
                        setErrorMessage(null);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        !slot.isAvailable
                          ? 'opacity-35 bg-[#141620] border-[#1e202c] cursor-not-allowed text-[#6c6557]'
                          : isSelected
                          ? 'bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black border-[#d4af37] shadow-lg shadow-[#d4af37]/25 font-bold scale-[1.03]'
                          : 'bg-[#151722] border-[#272b3c] text-[#ddd5c7] hover:border-[#d4af37]/60 hover:bg-[#1a1d2c]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-sm font-semibold tracking-wider">
                          {slot.timeStr}
                        </span>
                        <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-[#877f70]'}`} />
                      </div>
                      <div className="mt-1 text-[10px]">
                        {slot.isAvailable ? (
                          <span className={isSelected ? 'text-black/80 font-medium' : 'text-emerald-400'}>
                            Available
                          </span>
                        ) : (
                          <span className="text-rose-400 line-through">
                            {slot.reason || 'Booked'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="p-3 bg-[#151723] rounded-xl text-xs text-[#8a8374] flex items-center justify-between">
              <span>Appointment duration: <strong>{settings.appointmentDuration} minutes</strong></span>
              <span>Buffer between visitors: <strong>{settings.bufferTime} minutes</strong></span>
            </div>
          </div>
        )}

        {/* STEP 3: Select Shopping Preference */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#1e2130] pb-4">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#f5f2eb]">
                  Step 3: Select Shopping Preference
                </h2>
                <p className="text-xs text-[#9c9484] mt-1">
                  Tell us what you'd like to explore so our stylist can prepare curated outfits.
                </p>
              </div>
              <span className="text-xs text-[#d4af37] font-semibold">3 / 5</span>
            </div>

            <div className="space-y-3">
              {categoriesList.map((cat) => {
                const isSelected = shoppingCategory === cat.title;
                return (
                  <div
                    key={cat.title}
                    onClick={() => setShoppingCategory(cat.title)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1d1f2e] border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'bg-[#141622] border-[#222536] hover:border-[#d4af37]/40'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <h4 className="font-heading text-base font-bold text-[#f5f2eb]">
                          {cat.title}
                        </h4>
                        <p className="text-xs text-[#9a9282] mt-0.5 leading-relaxed">
                          {cat.desc}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ml-4 ${
                        isSelected
                          ? 'border-[#d4af37] bg-[#d4af37] text-black'
                          : 'border-[#3f4357]'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Customer Details Form */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#1e2130] pb-4">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#f5f2eb]">
                  Step 4: Customer Information
                </h2>
                <p className="text-xs text-[#9c9484] mt-1">
                  We will reserve your slot and send your booking confirmation code.
                </p>
              </div>
              <span className="text-xs text-[#d4af37] font-semibold">4 / 5</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#d5cebf] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vikramaditya Hegde"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#161824] border border-[#2b2f42] rounded-xl px-4 py-3 text-sm text-[#f5f2eb] placeholder-[#6d6659] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#d5cebf] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Mobile Number *</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-[#2b2f42] bg-[#1a1c29] text-xs text-[#a1998a] font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98450 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#161824] border border-[#2b2f42] rounded-r-xl px-4 py-3 text-sm text-[#f5f2eb] placeholder-[#6d6659] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <span className="text-[10px] text-[#7d7568]">Used for WhatsApp confirmation & visit reminder</span>
              </div>

              {/* Email (Optional) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#d5cebf] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Email Address (Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. vikram@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#161824] border border-[#2b2f42] rounded-xl px-4 py-3 text-sm text-[#f5f2eb] placeholder-[#6d6659] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Number of Visitors */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#d5cebf] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Number of Visitors (1–5)</span>
                </label>
                <select
                  value={visitorCount}
                  onChange={(e) => setVisitorCount(Number(e.target.value))}
                  className="w-full bg-[#161824] border border-[#2b2f42] rounded-xl px-4 py-3 text-sm text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
                >
                  <option value={1}>1 Person (Individual fitting)</option>
                  <option value={2}>2 Persons (Couple / Friends)</option>
                  <option value={3}>3 Persons (Family shopping)</option>
                  <option value={4}>4 Persons (Family / Wedding group)</option>
                  <option value={5}>5 Persons (Group shopping)</option>
                </select>
              </div>

              {/* Additional Requirements */}
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#d5cebf] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Additional Requirements or Style Notes (Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Need festive outfit for 8-year-old boy; looking for 40-size slim fit Italian linen shirts; wedding reception dress code."
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  className="w-full bg-[#161824] border border-[#2b2f42] rounded-xl p-4 text-xs text-[#f5f2eb] placeholder-[#6d6659] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Display Booking Summary & Final Confirmation */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#1e2130] pb-4">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#f5f2eb]">
                  Step 5: Review & Confirm Appointment
                </h2>
                <p className="text-xs text-[#9c9484] mt-1">
                  Please verify your visit details before reserving the slot.
                </p>
              </div>
              <span className="text-xs text-[#d4af37] font-semibold">5 / 5</span>
            </div>

            {/* Summary Card */}
            <div className="p-6 rounded-2xl bg-[#161824] border border-[#2d3144] space-y-5">
              <div className="flex items-center justify-between border-b border-[#25293d] pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] block">
                    FASHTAG STORE VISIT
                  </span>
                  <h3 className="font-heading text-lg font-bold text-[#f5f2eb]">
                    BTM 1st Stage Flagship Store
                  </h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-semibold">
                  Free Styling Visit
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#888173] block">Date:</span>
                  <span className="font-semibold text-[#f5f2eb] text-sm mt-0.5 block">
                    {selectedDate} ({dayOfWeek.toUpperCase()})
                  </span>
                </div>
                <div>
                  <span className="text-[#888173] block">Time Slot:</span>
                  <span className="font-semibold text-[#d4af37] text-sm mt-0.5 block">
                    {selectedTime}
                  </span>
                </div>
                <div>
                  <span className="text-[#888173] block">Shopping Preference:</span>
                  <span className="font-semibold text-[#f5f2eb] mt-0.5 block">
                    {shoppingCategory}
                  </span>
                </div>
                <div>
                  <span className="text-[#888173] block">Customer Name:</span>
                  <span className="font-semibold text-[#f5f2eb] mt-0.5 block">
                    {fullName}
                  </span>
                </div>
                <div>
                  <span className="text-[#888173] block">Contact Number:</span>
                  <span className="font-semibold text-[#f5f2eb] mt-0.5 block">
                    +91 {phone}
                  </span>
                </div>
                <div>
                  <span className="text-[#888173] block">Visitors:</span>
                  <span className="font-semibold text-[#f5f2eb] mt-0.5 block">
                    {visitorCount} Person{visitorCount > 1 ? 's' : ''}
                  </span>
                </div>
                {email && (
                  <div>
                    <span className="text-[#888173] block">Email:</span>
                    <span className="text-[#f5f2eb] mt-0.5 block">{email}</span>
                  </div>
                )}
                {additionalRequirements && (
                  <div className="sm:col-span-2">
                    <span className="text-[#888173] block">Requirements:</span>
                    <span className="text-[#cfc8ba] italic mt-0.5 block">
                      "{additionalRequirements}"
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#25293d] flex items-start gap-2.5 text-xs text-[#a39c8e]">
                <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <p>
                  By confirming, this slot will be atomically reserved in our database. 
                  You can reschedule or cancel at any time with no fees.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-6 border-t border-[#1e2130] flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setCurrentStep((prev) => prev - 1);
              }}
              className="px-5 py-2.5 rounded-full border border-white/20 text-[#d7cfbf] hover:text-white hover:border-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmBooking}
              className={`px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e6ca65] to-[#c59d33] text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:shadow-[0_0_35px_rgba(212,175,55,0.7)] transition-all flex items-center gap-2 ${
                isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]'
              }`}
            >
              {isSubmitting ? (
                <span>Reserving Slot...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Appointment</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
