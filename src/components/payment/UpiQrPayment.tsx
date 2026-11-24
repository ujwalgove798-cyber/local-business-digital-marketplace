import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  Smartphone, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface UpiQrPaymentProps {
  amount: number;
  orderRef: string;
  upiId?: string;
  onUtrChange?: (utr: string) => void;
  onPaymentConfirmed?: () => void;
}

export const UpiQrPayment: React.FC<UpiQrPaymentProps> = ({
  amount,
  orderRef,
  upiId = '9739841266@upi',
  onUtrChange,
}) => {
  const { t } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [isUtrValid, setIsUtrValid] = useState(false);

  // Construct standard NPCI Indian UPI URI format
  const cleanAmount = amount.toFixed(2);
  const payeeName = 'FashTag Bengaluru';
  const transactionNote = `Order ${orderRef}`;
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${cleanAmount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  useEffect(() => {
    QRCode.toDataURL(upiUrl, {
      width: 320,
      margin: 1,
      color: {
        dark: '#0a0d17',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Error generating UPI QR code:', err);
      });
  }, [upiUrl]);

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `FashTag-UPI-QR-₹${amount}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleUtrInputChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 12);
    setUtrNumber(cleaned);
    const valid = cleaned.length === 12;
    setIsUtrValid(valid);
    if (onUtrChange) {
      onUtrChange(cleaned);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#0f111a] border border-[#2b3046] shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#212435] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-base">
              {t('checkout.upiScanTitle', 'Scan QR Code with any UPI App')}
            </h3>
            <p className="text-[11px] text-[#9a9486]">
              {t('checkout.upiScanSubtitle', 'Open Google Pay, PhonePe, Paytm, Cred, BHIM or any banking app')}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified UPI Merchant</span>
        </div>
      </div>

      {/* Main QR Display & Payment Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative p-3.5 rounded-2xl bg-white border-2 border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.25)] group">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`UPI QR Code for ₹${amount}`}
                className="w-56 h-56 rounded-lg object-contain"
              />
            ) : (
              <div className="w-56 h-56 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                Generating QR Code...
              </div>
            )}

            {/* Subtle center logo badge */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-black border-2 border-[#d4af37] flex items-center justify-center shadow-lg">
                <span className="font-heading text-xs font-extrabold text-[#d4af37]">FT</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadQr}
              className="inline-flex items-center gap-1.5 text-xs text-[#a8a192] hover:text-[#d4af37] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download QR</span>
            </button>
            <span className="text-[#323646]">|</span>
            <span className="text-xs text-[#8e8778]">Scan & Pay via camera / app</span>
          </div>
        </div>

        {/* UPI Details & Supported Apps */}
        <div className="space-y-4 text-xs">
          {/* Payable Amount Highlight */}
          <div className="p-3.5 rounded-2xl bg-[#161825] border border-[#272b3c] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8e8778] tracking-wider block">
                {t('cart.finalPayable', 'Amount Payable')}
              </span>
              <span className="font-heading text-2xl font-bold text-[#d4af37]">
                ₹{amount.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-900">
              No Additional Fees
            </span>
          </div>

          {/* Copyable UPI ID Box */}
          <div className="p-3.5 rounded-2xl bg-[#161825] border border-[#272b3c] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#8e8778] tracking-wider block">
              {t('checkout.upiIdLabel', 'FashTag Official UPI ID')}
            </span>
            <div className="flex items-center justify-between gap-2 bg-[#0c0e15] px-3 py-2 rounded-xl border border-[#212435]">
              <code className="text-sm font-mono text-[#f5f2eb] font-semibold tracking-wide">
                {upiId}
              </code>
              <button
                type="button"
                onClick={handleCopyUpiId}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37] hover:text-black'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t('checkout.copied', 'Copied!') : t('checkout.copyUpiId', 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Supported UPI Apps Badges */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#8e8778] tracking-wider block">
              Supported UPI Apps:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'CRED', 'Amazon Pay'].map((appName) => (
                <span
                  key={appName}
                  className="px-2.5 py-1 rounded-lg bg-[#141624] border border-[#272b3c] text-[#cfc7b8] text-[11px] font-medium"
                >
                  {appName}
                </span>
              ))}
            </div>
          </div>

          {/* Direct Mobile UPI Link Button */}
          <div className="pt-1">
            <a
              href={upiUrl}
              className="w-full py-2.5 px-4 rounded-xl bg-[#202436] hover:bg-[#2b3046] border border-[#353b52] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Smartphone className="w-4 h-4 text-[#d4af37]" />
              <span>Tap to Open Installed UPI App</span>
              <ExternalLink className="w-3 h-3 text-[#8e8778]" />
            </a>
          </div>
        </div>
      </div>

      {/* 12-Digit UTR / Transaction Reference Input */}
      <div className="border-t border-[#212435] pt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="text-[#cfc7b8] font-semibold flex items-center gap-1.5">
            <span>{t('checkout.utrLabel', 'UPI Transaction ID / 12-Digit UTR')}</span>
          </label>
          {isUtrValid && (
            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
              <Check className="w-3.5 h-3.5" />
              <span>{t('checkout.utrVerified', '12-digit UTR verified')}</span>
            </span>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            maxLength={12}
            value={utrNumber}
            onChange={(e) => handleUtrInputChange(e.target.value)}
            placeholder={t('checkout.utrPlaceholder', 'e.g. 412389104523 (from UPI app receipt)')}
            className={`w-full bg-[#141624] border rounded-xl px-4 py-2.5 text-white placeholder-[#6f6759] text-xs font-mono tracking-wider focus:outline-none transition-colors ${
              isUtrValid ? 'border-emerald-500' : 'border-[#2b2f42] focus:border-[#d4af37]'
            }`}
          />
        </div>
        <p className="text-[10px] text-[#7d7566]">
          After completing the UPI transfer, you can enter the 12-digit reference number found in your Google Pay, PhonePe, or Paytm receipt.
        </p>
      </div>
    </div>
  );
};
