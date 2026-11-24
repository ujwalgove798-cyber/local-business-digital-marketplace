import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CustomerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerCustomer } = useStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const res = await registerCustomer({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
    });
    setIsSubmitting(false);

    if (res.success) {
      navigate('/account');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f5f2eb] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1f2e] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FashTag Customer Account</span>
        </div>

        <h1 className="font-heading text-3xl font-bold tracking-tight text-[#fdfbf7]">
          Create Customer Profile
        </h1>
        <p className="mt-2 text-xs text-[#9a9486]">
          Track your orders, schedule boutique fitting appointments, and save your favourite styles.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#121422] border border-[#23273c] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8a8475] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] placeholder-[#7d776c] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8a8475] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] placeholder-[#7d776c] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8a8475] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98450 12345"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] placeholder-[#7d776c] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8a8475] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] placeholder-[#7d776c] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8a8475] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] placeholder-[#7d776c] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c567] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 disabled:opacity-50 transition-all shadow-lg mt-2"
            >
              {isSubmitting ? 'Creating Profile...' : 'Complete Customer Registration'}
            </button>
          </form>

          {/* Login Link */}
          <div className="pt-4 border-t border-[#1f2233] text-center text-xs text-[#9a9486]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#d4af37] font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
