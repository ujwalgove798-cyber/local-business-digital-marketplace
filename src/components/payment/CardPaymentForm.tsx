import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Wifi, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  cardType: 'visa' | 'mastercard' | 'rupay' | 'amex' | 'generic';
  isValid: boolean;
}

interface CardPaymentFormProps {
  onCardChange: (details: CardDetails) => void;
}

export const CardPaymentForm: React.FC<CardPaymentFormProps> = ({ onCardChange }) => {
  const { t } = useLanguage();

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  const [saveCard, setSaveCard] = useState(true);

  // Detect Card Brand from card number prefix
  const detectCardType = (num: string): 'visa' | 'mastercard' | 'rupay' | 'amex' | 'generic' => {
    const clean = num.replace(/\D/g, '');
    if (/^4/.test(clean)) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
    if (/^(60|65|81|82|508)/.test(clean)) return 'rupay';
    if (/^(34|37)/.test(clean)) return 'amex';
    return 'generic';
  };

  const cardType = detectCardType(cardNumber);

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
    notifyParent(formatted, cardHolder, expiry, cvv);
  };

  // Format Expiry Date (MM/YY)
  const handleExpiryChange = (val: string) => {
    let clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      clean = `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    setExpiry(clean);
    notifyParent(cardNumber, cardHolder, clean, cvv);
  };

  // Format CVV
  const handleCvvChange = (val: string) => {
    const maxLen = cardType === 'amex' ? 4 : 3;
    const clean = val.replace(/\D/g, '').slice(0, maxLen);
    setCvv(clean);
    notifyParent(cardNumber, cardHolder, expiry, clean);
  };

  const handleCardHolderChange = (val: string) => {
    const uppercase = val.toUpperCase();
    setCardHolder(uppercase);
    notifyParent(cardNumber, uppercase, expiry, cvv);
  };

  const notifyParent = (num: string, holder: string, exp: string, code: string) => {
    const cleanNum = num.replace(/\D/g, '');
    const cleanExp = exp.replace(/\D/g, '');
    const isNumValid = cleanNum.length >= 15;
    const isHolderValid = holder.trim().length >= 3;
    const isExpValid = cleanExp.length === 4;
    const isCvvValid = code.length >= 3;

    const isValid = isNumValid && isHolderValid && isExpValid && isCvvValid;

    onCardChange({
      cardNumber: num,
      cardHolder: holder,
      expiry: exp,
      cvv: code,
      cardType: detectCardType(num),
      isValid,
    });
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Interactive Luxury Metallic Card Mockup */}
      <div className="relative mx-auto w-full max-w-sm aspect-[1.586/1] rounded-3xl p-6 text-white shadow-2xl overflow-hidden border border-[#d4af37]/40 bg-gradient-to-tr from-[#0a0c14] via-[#151928] to-[#1c223a]">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent pointer-events-none" />

        <div className="relative h-full flex flex-col justify-between z-10">
          {/* Card Top Row: Chip, Contactless & Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* EMV Chip */}
              <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-[#d4af37] via-[#f3e5ab] to-[#aa8021] border border-[#f3e5ab] shadow-sm flex flex-col justify-around p-1">
                <div className="border-t border-[#876717]" />
                <div className="border-t border-[#876717]" />
              </div>
              <Wifi className="w-5 h-5 text-[#d4af37] rotate-90" />
            </div>

            {/* Brand Logo / Badge */}
            <div className="text-right">
              {cardType === 'visa' && (
                <span className="font-heading italic font-extrabold text-xl tracking-wider text-blue-400">
                  VISA
                </span>
              )}
              {cardType === 'mastercard' && (
                <div className="flex -space-x-3 items-center">
                  <div className="w-6 h-6 rounded-full bg-red-500/90" />
                  <div className="w-6 h-6 rounded-full bg-amber-400/90" />
                </div>
              )}
              {cardType === 'rupay' && (
                <span className="font-heading font-black text-sm tracking-wider text-emerald-400 border border-emerald-500 px-2 py-0.5 rounded">
                  RuPay
                </span>
              )}
              {cardType === 'amex' && (
                <span className="font-heading font-bold text-xs tracking-wider text-sky-400 border border-sky-400 px-1.5 py-0.5 rounded">
                  AMEX
                </span>
              )}
              {cardType === 'generic' && (
                <span className="font-heading text-xs tracking-widest text-[#d4af37] font-semibold">
                  DEBIT / CREDIT
                </span>
              )}
            </div>
          </div>

          {/* Card Number Group */}
          <div className="space-y-1">
            <div className="font-mono text-base sm:text-lg tracking-[0.2em] font-semibold text-[#f8f6f0] drop-shadow-md">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>
          </div>

          {/* Bottom Row: Holder & Expiry */}
          <div className="flex items-end justify-between text-xs">
            <div className="space-y-0.5 max-w-[65%]">
              <span className="text-[9px] uppercase tracking-wider text-[#9f9787] block font-mono">
                Cardholder Name
              </span>
              <p className="font-heading font-semibold text-white truncate tracking-wider">
                {cardHolder || 'NAME ON CARD'}
              </p>
            </div>

            <div className="space-y-0.5 text-right">
              <span className="text-[9px] uppercase tracking-wider text-[#9f9787] block font-mono">
                Expires
              </span>
              <p className="font-mono font-semibold text-white tracking-widest">
                {expiry || 'MM/YY'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Input Fields Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Card Number */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-[#cfc7b8] uppercase font-semibold text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{t('checkout.cardNumber', 'Card Number')} *</span>
            </span>
            <span className="text-[10px] text-[#938b7d]">RuPay • Visa • Mastercard</span>
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              required
              maxLength={19}
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              placeholder={t('checkout.cardNumberPlaceholder', '0000 0000 0000 0000')}
              className="w-full bg-[#181a26] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white font-mono tracking-wider placeholder-[#6f6759] focus:outline-none focus:border-[#d4af37]"
            />
            <div className="absolute right-3.5 top-2.5 text-xs">
              {cardType === 'visa' && <span className="text-blue-400 font-bold italic">VISA</span>}
              {cardType === 'mastercard' && <span className="text-amber-400 font-bold">MC</span>}
              {cardType === 'rupay' && <span className="text-emerald-400 font-bold">RuPay</span>}
            </div>
          </div>
        </div>

        {/* Cardholder Name */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-[#cfc7b8] uppercase font-semibold text-[11px]">
            {t('checkout.cardHolder', 'Cardholder Name')} *
          </label>
          <input
            type="text"
            required
            value={cardHolder}
            onChange={(e) => handleCardHolderChange(e.target.value)}
            placeholder={t('checkout.cardHolderPlaceholder', 'NAME AS PRINTED ON CARD')}
            className="w-full bg-[#181a26] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white placeholder-[#6f6759] focus:outline-none focus:border-[#d4af37] tracking-wider uppercase font-medium"
          />
        </div>

        {/* Expiry Date */}
        <div className="space-y-1.5">
          <label className="text-[#cfc7b8] uppercase font-semibold text-[11px]">
            {t('checkout.expiry', 'Expiry Date (MM/YY)')} *
          </label>
          <input
            type="text"
            inputMode="numeric"
            required
            maxLength={5}
            value={expiry}
            onChange={(e) => handleExpiryChange(e.target.value)}
            placeholder="MM/YY"
            className="w-full bg-[#181a26] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white font-mono placeholder-[#6f6759] focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* CVV / CVC */}
        <div className="space-y-1.5">
          <label className="text-[#cfc7b8] uppercase font-semibold text-[11px] flex items-center justify-between">
            <span>{t('checkout.cvv', 'CVV / CVC')} *</span>
            <span className="text-[10px] text-[#8e8778]">{t('checkout.cvvHelp', '3 digits on back')}</span>
          </label>
          <div className="relative">
            <input
              type={showCvv ? 'text' : 'password'}
              inputMode="numeric"
              required
              maxLength={4}
              value={cvv}
              onChange={(e) => handleCvvChange(e.target.value)}
              placeholder="•••"
              className="w-full bg-[#181a26] border border-[#2b2f42] rounded-xl px-4 py-2.5 text-white font-mono placeholder-[#6f6759] focus:outline-none focus:border-[#d4af37] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCvv(!showCvv)}
              className="absolute right-3 top-2.5 text-[#8e8778] hover:text-white"
            >
              {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* RBI Tokenization Compliance Checkbox */}
      <div className="flex items-start gap-2.5 text-xs text-[#a8a192]">
        <input
          type="checkbox"
          id="saveCardToken"
          checked={saveCard}
          onChange={(e) => setSaveCard(e.target.checked)}
          className="mt-0.5 rounded border-[#2b2f42] text-[#d4af37] focus:ring-0 bg-[#181a26]"
        />
        <label htmlFor="saveCardToken" className="cursor-pointer select-none">
          <span>{t('checkout.saveCard', 'Save card securely in compliance with RBI guidelines')}</span>
          <span className="block text-[10px] text-[#736c5f]">
            Card credentials are tokenized directly with your bank. Full card numbers are never stored on our servers.
          </span>
        </label>
      </div>
    </div>
  );
};
