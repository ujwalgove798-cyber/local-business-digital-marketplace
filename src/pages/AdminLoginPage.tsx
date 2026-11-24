import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin, adminUser } = useStore();

  const [email, setEmail] = useState('admin@fashtag.in');
  const [password, setPassword] = useState('fashtag2026!');
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to /admin
  React.useEffect(() => {
    if (adminUser) {
      navigate('/admin');
    }
  }, [adminUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = loginAdmin(email, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid admin credentials. Use admin@fashtag.in / fashtag2026!');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@fashtag.in');
    setPassword('fashtag2026!');
    setError(null);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#11131c] border border-[#26293a] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#1c1f2e] border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(212,175,55,0.25)]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#d4af37] block">
            Store Management
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#fcf9f2]">
            FashTag Admin Portal
          </h1>
          <p className="text-xs text-[#958e80]">
            Sign in to manage appointments, store operating hours, collection products and gallery images.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-[#d2cbbe] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#171926] border border-[#2b2f42] rounded-xl px-4 py-3 text-sm text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-[#d2cbbe] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#171926] border border-[#2b2f42] rounded-xl px-4 py-3 text-sm text-[#f5f2eb] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <span>Log In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Helper Pill */}
        <div className="p-4 rounded-xl bg-[#171a26] border border-[#2a2e42] text-[11px] text-[#9a9282] space-y-2">
          <div className="flex items-center justify-between text-[#d4af37] font-semibold">
            <span className="flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Demo Admin Credentials</span>
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[10px] text-white hover:underline"
            >
              Auto-fill
            </button>
          </div>
          <div>User: <strong className="text-white font-mono">admin@fashtag.in</strong></div>
          <div>Pass: <strong className="text-white font-mono">fashtag2026!</strong></div>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#8e8778] hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
