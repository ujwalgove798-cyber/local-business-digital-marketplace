import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  X, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Building2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface BankOtpModalProps {
  isOpen: boolean;
  amount: number;
  last4: string;
  cardType: string;
  onSuccess: (otp: string) => void;
  onCancel: () => void;
}

export const BankOtpModal: React.FC<BankOtpModalProps> = ({
  isOpen,
  amount,
  last4,
  cardType,
  onSuccess,
  onCancel,
}) => {
  const { t } = useLanguage();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return;
    setTimer(30);
    setCanResend(false);
    setError(null);
    setOtp('');

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
    setError(null);
  };

  const handleAutoFill = () => {
    setOtp('739812');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setError('Please enter a valid 6-digit numeric OTP.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    setTimeout(() => {
      setIsVerifying(false);
      onSuccess(otp);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0f111a] border border-[#2d3248] shadow-2xl overflow-hidden">
        {/* Bank Portal Header */}
        <div className="bg-[#151826] border-b border-[#252a3d] p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-900/40 border border-blue-700/60 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-white text-sm">
                  Bank 3D-Secure
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                  RBI Verified
                </span>
              </div>
              <p className="text-[11px] text-[#8e8778]">
                Identity Verification Gateway
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            disabled={isVerifying}
            className="p-1.5 rounded-lg text-[#8e8778] hover:text-white hover:bg-[#1f2334] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Order Details Pill */}
          <div className="p-3.5 rounded-2xl bg-[#141624] border border-[#23273c] space-y-2">
            <div className="flex justify-between items-center text-[#cfc7b8]">
              <span>Merchant</span>
              <strong className="text-white">FashTag Flagship Store</strong>
            </div>
            <div className="flex justify-between items-center text-[#cfc7b8]">
              <span>Amount</span>
              <strong className="text-[#d4af37] font-heading text-sm">
                ₹{amount.toLocaleString('en-IN')}
              </strong>
            </div>
            <div className="flex justify-between items-center text-[#cfc7b8]">
              <span>Card</span>
              <strong className="text-white uppercase font-mono">
                {cardType} •••• {last4 || '1266'}
              </strong>
            </div>
          </div>

          <div className="space-y-1 text-center">
            <p className="text-white font-medium">
              Enter 6-Digit One-Time Password (OTP)
            </p>
            <p className="text-[11px] text-[#938b7d]">
              Sent to mobile number ending in <strong className="text-[#d4af37]">•••1266</strong>
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* OTP Input */}
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="• • • • • •"
                className="w-full bg-[#181a28] border border-[#2e344a] rounded-2xl py-3 px-4 text-center font-mono text-2xl tracking-[0.5em] text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Quick Demo Fill button */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <button
                type="button"
                onClick={handleAutoFill}
                className="text-[#d4af37] hover:underline flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-Fill Demo OTP</span>
              </button>

              <div className="text-[#8e8778]">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-white hover:text-[#d4af37] underline font-semibold"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Resend in {timer}s</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isVerifying || otp.length !== 6}
              className={`w-full py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c567] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all ${
                isVerifying || otp.length !== 6
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]'
              }`}
            >
              {isVerifying ? (
                <span>Authorizing with Bank...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit & Authorize Payment</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={isVerifying}
              className="w-full py-2.5 text-center text-xs text-[#8e8778] hover:text-white transition-colors"
            >
              Cancel Transaction
            </button>
          </div>

          <p className="text-[10px] text-center text-[#6e685c] flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            <span>256-bit SSL encrypted bank transaction</span>
          </p>
        </form>
      </div>
    </div>
  );
};
