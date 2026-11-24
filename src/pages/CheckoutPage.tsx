import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { CustomerAddress, PaymentMethod } from '../types';
import { initiateRazorpayPayment } from '../lib/razorpay';
import { UpiQrPayment } from '../components/payment/UpiQrPayment';
import { CardPaymentForm, CardDetails } from '../components/payment/CardPaymentForm';
import { BankOtpModal } from '../components/payment/BankOtpModal';
import { 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Truck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  Wallet, 
  Plus, 
  Lock,
  Phone,
  Mail,
  User,
  Home,
  Check
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartDeliveryFee, 
    cartTotal, 
    appliedCoupon,
    customerAddresses, 
    saveAddress,
    customerUser, 
    placeOrder, 
    addToast 
  } = useStore();

  // If cart is empty, redirect to cart page
  React.useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Temp order reference for UPI QR & Card
  const [orderRef] = useState(() => Math.floor(10000 + Math.random() * 90000).toString());

  // Address selection state
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    customerAddresses[0]?.id || 'new'
  );

  // Address Form fields
  const [fullName, setFullName] = useState(customerUser?.name || 'Vikramaditya Hegde');
  const [phone, setPhone] = useState(customerUser?.phone || '9739841266');
  const [email, setEmail] = useState(customerUser?.email || 'vikram.hegde@example.com');
  const [houseNumber, setHouseNumber] = useState('No. 14, 2nd Floor');
  const [street, setStreet] = useState('9th Main Road, 4th Cross, BTM 1st Stage');
  const [landmark, setLandmark] = useState('Near FashTag Flagship Store');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pinCode, setPinCode] = useState('560029');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [saveToAddresses, setSaveToAddresses] = useState(true);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // UPI UTR tracker
  const [upiUtr, setUpiUtr] = useState('');

  // Card details tracker
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
    cardType: 'generic',
    isValid: false,
  });

  // 3D Secure Bank OTP Modal state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  // Load existing selected address
  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    if (id !== 'new') {
      const match = customerAddresses.find((a) => a.id === id);
      if (match) {
        setFullName(match.fullName);
        setPhone(match.phone.replace(/\D/g, '').slice(-10));
        if (match.email) setEmail(match.email);
        setHouseNumber(match.houseNumber);
        setStreet(match.street);
        if (match.landmark) setLandmark(match.landmark);
        setCity(match.city);
        setState(match.state);
        setPinCode(match.pinCode);
        if (match.deliveryInstructions) setDeliveryInstructions(match.deliveryInstructions);
      }
    }
  };

  const validateForm = (): boolean => {
    setErrorMessage(null);
    if (!fullName.trim()) {
      setErrorMessage('Please provide your full name.');
      return false;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please provide a valid 10-digit mobile number.');
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please provide a valid email address for your order confirmation receipt.');
      return false;
    }
    if (!houseNumber.trim() || !street.trim()) {
      setErrorMessage('Please enter your complete street and building address.');
      return false;
    }
    if (!pinCode.trim() || pinCode.trim().length !== 6) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return false;
    }
    return true;
  };

  const getActiveAddress = (): CustomerAddress => {
    return {
      id: selectedAddressId === 'new' ? `addr-${Date.now().toString(36)}` : selectedAddressId,
      fullName: fullName.trim(),
      phone: `+91 ${phone.replace(/\D/g, '').slice(-10)}`,
      email: email.trim(),
      houseNumber: houseNumber.trim(),
      street: street.trim(),
      landmark: landmark.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      pinCode: pinCode.trim(),
      deliveryInstructions: deliveryInstructions.trim() || undefined,
    };
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const activeAddress = getActiveAddress();
    if (saveToAddresses && selectedAddressId === 'new') {
      saveAddress(activeAddress);
    }

    // If Card Payment is selected, validate card fields and prompt 3D Secure OTP
    if (paymentMethod === 'CARD') {
      if (!cardDetails.isValid) {
        setErrorMessage('Please enter valid credit/debit card details (16-digit card number, name, expiry MM/YY, and 3-digit CVV).');
        return;
      }
      // Open 3D Secure Bank Verification Modal
      setIsOtpModalOpen(true);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. If UPI Payment
      if (paymentMethod === 'UPI') {
        const orderIdTemp = `FT-ORD-${orderRef}`;

        // If user already entered UTR, confirm immediately
        const placed = await placeOrder({
          customerName: fullName,
          phone: `+91 ${phone.replace(/\D/g, '').slice(-10)}`,
          email,
          shippingAddress: activeAddress,
          paymentMethod: 'UPI',
          notes: upiUtr ? `Paid via UPI QR (UTR: ${upiUtr})` : `Paid via UPI QR Code`,
        });

        addToast('UPI Payment verified successfully!', 'success');
        navigate(`/order-confirmation/${placed.orderId}`);
        return;
      }

      // 2. Cash on Delivery (COD) / Voucher
      const placed = await placeOrder({
        customerName: fullName,
        phone: `+91 ${phone.replace(/\D/g, '').slice(-10)}`,
        email,
        shippingAddress: activeAddress,
        paymentMethod,
        notes: deliveryInstructions || undefined,
      });

      navigate(`/order-confirmation/${placed.orderId}`);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to place order. Please check your details.');
    }
  };

  // Called when 3D Secure OTP is confirmed
  const handleOtpSuccess = async (enteredOtp: string) => {
    setIsOtpModalOpen(false);
    setIsProcessing(true);

    const activeAddress = getActiveAddress();
    try {
      const placed = await placeOrder({
        customerName: fullName,
        phone: `+91 ${phone.replace(/\D/g, '').slice(-10)}`,
        email,
        shippingAddress: activeAddress,
        paymentMethod: 'CARD',
        notes: `Card ending in ${cardDetails.cardNumber.slice(-4) || '1266'} • 3DS OTP Verified: ${enteredOtp}`,
      });

      addToast('Card payment verified via 3D-Secure!', 'success');
      navigate(`/order-confirmation/${placed.orderId}`);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to finalize card payment.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back button */}
      <Link 
        to="/cart" 
        className="inline-flex items-center gap-1.5 text-xs text-[#8e8778] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{t('checkout.returnToCart', 'Return to Shopping Cart')}</span>
      </Link>

      <div className="border-b border-[#212435] pb-4">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#d4af37] block">
          {t('checkout.secureCheckout', 'Secure E-Commerce Checkout')}
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
          {t('checkout.title', 'Delivery Address & Payment')}
        </h1>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left 2 Cols: Address & Payment Selection */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Delivery Address */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#12141e] border border-[#232738] space-y-6">
            <div className="flex items-center justify-between border-b border-[#212435] pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#d4af37]" />
                <h2 className="font-heading text-lg font-bold text-white">
                  {t('checkout.shippingAddress', '1. Shipping Address')}
                </h2>
              </div>
              <span className="text-[11px] text-[#8e8778]">
                {t('checkout.panIndia', 'Pan-India & Bengaluru Express')}
              </span>
            </div>

            {/* Saved Addresses Selector */}
            {customerAddresses.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#a8a192] uppercase tracking-wider block">
                  {t('checkout.selectSavedAddress', 'Select a Saved Address:')}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customerAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all text-xs space-y-1.5 ${
                        selectedAddressId === addr.id
                          ? 'bg-[#1b1e2c] border-[#d4af37] shadow-lg shadow-[#d4af37]/20'
                          : 'bg-[#151722] border-[#252838] hover:border-[#d4af37]/40 text-[#a8a191]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-white">
                        <span>{addr.fullName}</span>
                        {selectedAddressId === addr.id && <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />}
                      </div>
                      <p className="line-clamp-2 text-[#cfc7b7]">{addr.houseNumber}, {addr.street}</p>
                      <p>{addr.city}, {addr.state} - {addr.pinCode}</p>
                      <p className="text-[10px] text-[#8e8778]">{addr.phone}</p>
                    </div>
                  ))}

                  <div
                    onClick={() => handleSelectAddress('new')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all text-xs flex flex-col items-center justify-center gap-1.5 ${
                      selectedAddressId === 'new'
                        ? 'bg-[#1b1e2c] border-[#d4af37]'
                        : 'bg-[#151722] border-dashed border-[#2b2f42] hover:border-[#d4af37]/50 text-[#8e8778]'
                    }`}
                  >
                    <Plus className="w-5 h-5 text-[#d4af37]" />
                    <span className="font-semibold text-white">
                      {t('checkout.deliverNewAddress', 'Deliver to a New Address')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Address Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="space-y-1.5">
                <label className="text-[#cfc7b7] uppercase font-semibold text-[11px] flex items-center gap-1">
                  <User className="w-3 h-3 text-[#d4af37]" />
                  <span>{t('checkout.fullName', 'Full Name *')}</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('checkout.fullNamePlaceholder', 'e.g. Vikramaditya Hegde')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#181a26] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white placeholder-[#6f6759] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#cfc7b7] uppercase font-semibold text-[11px] flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#d4af37]" />
                  <span>{t('checkout.mobileNumber', '10-Digit Mobile Number *')}</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl bg-[#202334] border border-r-0 border-[#2b2f42] text-[#8e8778] text-xs">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9739841266"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#181a26] border border-[#2b2f42] rounded-r-xl px-4 py-2.5 text-white placeholder-[#6f6759] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[#cfc7b7] uppercase font-semibold text-[11px] flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#d4af37]" />
                  <span>{t('checkout.email', 'Email Address *')} {t('checkout.emailHelper', '(For invoices & tracking)')}</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. vikram@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#181a26] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white placeholder-[#6f6759] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#cfc7b7] uppercase font-semibold text-[11px] flex items-center gap-1">
                  <Home className="w-3 h-3 text-[#d4af37]" />
                  <span>{t('checkout.houseNumber', 'House / Flat / Building No. *')}</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. No. 1136, Ground Floor"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  className="w-full bg-[#181a26] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white placeholder-[#6f6759] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#cfc7b7] uppercase font-semibold text-[11px]">
                  {t('checkout.streetArea', 'Street & Area *')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4th Cross, 9th Main Road, BTM 1st Stage"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-[#181a26] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white placeholder-[#6f6759] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#cfc7b7] uppercase font-semibold text-[11px]">
                  {t('checkout.landmark', 'Landmark (Optional)')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near BTM Water Tank"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full bg-[#181a26] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white placeholder-[#6f6759] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#cfc7b7] uppercase font-semibold text-[11px]">
                  {t('checkout.pincode', 'PIN Code *')}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="e.g. 560029"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#181a26] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white placeholder-[#6f6759] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#cfc7b7] uppercase font-semibold text-[11px]">
                  {t('checkout.city', 'City *')}
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#181a26] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#cfc7b7] uppercase font-semibold text-[11px]">
                  {t('checkout.state', 'State *')}
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#181a26] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[#cfc7b7] uppercase font-semibold text-[11px]">
                  {t('checkout.instructions', 'Special Delivery Instructions (Optional)')}
                </label>
                <input
                  type="text"
                  placeholder={t('checkout.instructionsPlaceholder', 'e.g. Call before delivery')}
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  className="w-full bg-[#181a26] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white placeholder-[#6f6759] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#12141e] border border-[#232738] space-y-6">
            <div className="flex items-center justify-between border-b border-[#212435] pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#d4af37]" />
                <h2 className="font-heading text-lg font-bold text-white">
                  {t('checkout.paymentMethod', '2. Select Payment Method')}
                </h2>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>{t('checkout.encrypted', '100% Encrypted & Secure')}</span>
              </span>
            </div>

            {/* Payment Options Selection */}
            <div className="space-y-4 text-xs">
              {/* Option 1: UPI with QR Code & Apps */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 ${
                  paymentMethod === 'UPI'
                    ? 'bg-[#181a29] border-[#d4af37] shadow-lg shadow-[#d4af37]/15'
                    : 'bg-[#151722] border-[#252838] hover:border-[#d4af37]/40 cursor-pointer'
                }`}
                onClick={() => paymentMethod !== 'UPI' && setPaymentMethod('UPI')}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="mt-1 text-[#d4af37] focus:ring-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-white text-sm flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-[#d4af37]" />
                        <span>{t('checkout.upi', 'Instant UPI Payment (QR Code & Apps)')}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#d4af37]/15 text-[#d4af37] text-[10px] font-bold">
                        {t('checkout.upiZeroSurcharge', 'Zero Surcharge')}
                      </span>
                    </div>
                    <p className="text-[#a49d8e] mt-0.5">
                      {t('checkout.upiDesc', 'Scan dynamic QR code or pay instantly using Google Pay, PhonePe, Paytm, or BHIM.')}
                    </p>
                  </div>
                </div>

                {/* Expanded Interactive UPI QR Component */}
                {paymentMethod === 'UPI' && (
                  <div className="pt-2 animate-in fade-in duration-200">
                    <UpiQrPayment
                      amount={cartTotal}
                      orderRef={orderRef}
                      upiId="9739841266@upi"
                      onUtrChange={(utr) => setUpiUtr(utr)}
                    />
                  </div>
                )}
              </div>

              {/* Option 2: Debit and Credit Card Process */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 ${
                  paymentMethod === 'CARD'
                    ? 'bg-[#181a29] border-[#d4af37] shadow-lg shadow-[#d4af37]/15'
                    : 'bg-[#151722] border-[#252838] hover:border-[#d4af37]/40 cursor-pointer'
                }`}
                onClick={() => paymentMethod !== 'CARD' && setPaymentMethod('CARD')}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                    className="mt-1 text-[#d4af37] focus:ring-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-white text-sm flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#d4af37]" />
                        <span>{t('checkout.card', 'Debit / Credit Card')}</span>
                      </span>
                      <span className="text-[10px] text-[#cfc7b7]">
                        Visa, Mastercard, RuPay
                      </span>
                    </div>
                    <p className="text-[#a49d8e] mt-0.5">
                      {t('checkout.cardDesc', 'Visa, Mastercard, RuPay, Amex. Secured with RBI tokenization.')}
                    </p>
                  </div>
                </div>

                {/* Expanded Debit & Credit Card Form with Live Preview */}
                {paymentMethod === 'CARD' && (
                  <div className="pt-2 animate-in fade-in duration-200">
                    <CardPaymentForm onCardChange={(details) => setCardDetails(details)} />
                  </div>
                )}
              </div>

              {/* Option 3: Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'COD'
                    ? 'bg-[#181a29] border-[#d4af37] shadow-lg shadow-[#d4af37]/15'
                    : 'bg-[#151722] border-[#252838] hover:border-[#d4af37]/40'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-[#d4af37] focus:ring-0"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-white text-sm">
                      {t('checkout.cod', 'Cash on Delivery (COD)')}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 text-[10px] font-bold">
                      {t('checkout.codBadge', 'Pay on Arrival')}
                    </span>
                  </div>
                  <p className="text-[#a49d8e]">
                    {t('checkout.codDesc', 'Pay cash or scan our delivery executive\'s UPI QR code when your luxury garments arrive.')}
                  </p>
                </div>
              </div>

              {/* Option 4: Gift Voucher / Store Credit */}
              <div
                onClick={() => setPaymentMethod('VOUCHER')}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'VOUCHER'
                    ? 'bg-[#181a29] border-[#d4af37] shadow-lg shadow-[#d4af37]/15'
                    : 'bg-[#151722] border-[#252838] hover:border-[#d4af37]/40'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'VOUCHER'}
                  onChange={() => setPaymentMethod('VOUCHER')}
                  className="mt-1 text-[#d4af37] focus:ring-0"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-white text-sm flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-[#d4af37]" />
                      <span>{t('checkout.voucher', 'FashTag Gift Voucher / Store Credit')}</span>
                    </span>
                  </div>
                  <p className="text-[#a49d8e]">
                    {t('checkout.voucherDesc', 'Redeem store gift voucher or customer credit.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Order Summary & Place Order */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#12141e] border border-[#26293a] shadow-2xl space-y-6">
          <h3 className="font-heading text-xl font-bold text-white border-b border-[#212435] pb-4">
            {t('checkout.orderReview', 'Order Review')} ({cart.reduce((s, i) => s + i.quantity, 0)} {t('common.quantity', 'Items')})
          </h3>

          {/* Mini Items Scroll List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-xs">
                <img src={item.imageUrl} alt={item.productName} className="w-12 h-14 rounded-lg object-cover bg-black shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{item.productName}</p>
                  <p className="text-[11px] text-[#938b7d]">
                    {t('common.size', 'Size')}: {item.size} • {t('common.quantity', 'Qty')}: {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-white">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2.5 text-xs border-t border-[#212435] pt-4 text-[#cfc7b7]">
            <div className="flex justify-between">
              <span>{t('cart.subtotal', 'Subtotal')}</span>
              <span className="text-white font-medium">₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>

            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>{t('cart.discount', 'Promotional Discount')} ({appliedCoupon?.code})</span>
                <span>- ₹{cartDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>{t('cart.deliveryFee', 'Delivery Fee')}</span>
              <span>
                {cartDeliveryFee === 0 ? (
                  <span className="text-emerald-400 font-bold uppercase text-[10px]">
                    {t('cart.free', 'FREE')}
                  </span>
                ) : (
                  `₹${cartDeliveryFee}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-[#262a3d]">
              <span className="font-heading">{t('cart.finalPayable', 'Final Payable')}</span>
              <span className="font-heading text-xl text-[#d4af37]">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            disabled={isProcessing}
            onClick={handlePlaceOrder}
            className={`w-full py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c567] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all flex items-center justify-center gap-2 ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
            }`}
          >
            {isProcessing ? (
              <span>{t('checkout.authorizing', 'Authorizing Order...')}</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {paymentMethod === 'COD'
                    ? `${t('checkout.confirmOrder', 'Confirm Order')} (COD)`
                    : `${t('checkout.payNow', 'Pay Now')} ₹${cartTotal.toLocaleString('en-IN')}`}
                </span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-[#736c5f]">
            {t('checkout.termsNote', 'By placing this order, you agree to FashTag\'s terms and 7-day doorstep return policy.')}
          </p>
        </div>
      </div>

      {/* 3D-Secure Bank OTP Modal for Card Payment */}
      <BankOtpModal
        isOpen={isOtpModalOpen}
        amount={cartTotal}
        last4={cardDetails.cardNumber.replace(/\D/g, '').slice(-4)}
        cardType={cardDetails.cardType.toUpperCase()}
        onSuccess={handleOtpSuccess}
        onCancel={() => setIsOtpModalOpen(false)}
      />
    </div>
  );
};
