import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Store, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Mail, 
  Phone 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser, loginWithDemoRole, userProfile } = useStore();

  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please provide an email address.');
      return;
    }

    const res = loginUser(email, selectedRole);
    if (res.success && res.user) {
      if (res.user.role === 'admin') navigate('/admin');
      else if (res.user.role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/account');
    }
  };

  const handleDemoLogin = (role: UserRole, targetShopId?: string) => {
    loginWithDemoRole(role, targetShopId);
    if (role === 'admin') navigate('/admin');
    else if (role === 'vendor') navigate('/vendor/dashboard');
    else navigate('/account');
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f5f2eb] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1f2e] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FashTag Bengaluru Access</span>
        </div>

        <h1 className="font-heading text-3xl font-bold tracking-tight text-[#fdfbf7]">
          Sign In to Your Account
        </h1>
        <p className="mt-2 text-xs text-[#9a9486]">
          Access your orders, appointments, or manage your boutique storefront.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#121422] border border-[#23273c] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Role Selection Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#181a28] rounded-xl border border-[#292d40]">
            <button
              type="button"
              onClick={() => setSelectedRole('customer')}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === 'customer'
                  ? 'bg-[#d4af37] text-black font-bold shadow-md'
                  : 'text-[#a9a396] hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('vendor')}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === 'vendor'
                  ? 'bg-[#d4af37] text-black font-bold shadow-md'
                  : 'text-[#a9a396] hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Shop Owner</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === 'admin'
                  ? 'bg-[#d4af37] text-black font-bold shadow-md'
                  : 'text-[#a9a396] hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Quick Demo Login Preset Buttons */}
          <div className="p-3.5 rounded-2xl bg-[#171a28] border border-[#292d3f] space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] block">
              Instant 1-Click Demo Profiles:
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                className="w-full text-left px-3 py-2 rounded-xl bg-[#1f2234] hover:bg-[#282c44] border border-[#32364e] text-xs font-medium text-[#e3ded4] hover:text-[#d4af37] flex items-center justify-between transition-all"
              >
                <span>Demo Customer (Rahul Sharma)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('vendor', 'shop-fashtag-btm')}
                className="w-full text-left px-3 py-2 rounded-xl bg-[#1f2234] hover:bg-[#282c44] border border-[#32364e] text-xs font-medium text-[#e3ded4] hover:text-[#d4af37] flex items-center justify-between transition-all"
              >
                <span>Vendor: FashTag Flagship BTM</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('vendor', 'shop-silk-weaves')}
                className="w-full text-left px-3 py-2 rounded-xl bg-[#1f2234] hover:bg-[#282c44] border border-[#32364e] text-xs font-medium text-[#e3ded4] hover:text-[#d4af37] flex items-center justify-between transition-all"
              >
                <span>Vendor: Silk & Weaves Indiranagar</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="w-full text-left px-3 py-2 rounded-xl bg-[#1f2234] hover:bg-[#282c44] border border-[#32364e] text-xs font-medium text-[#e3ded4] hover:text-[#d4af37] flex items-center justify-between transition-all"
              >
                <span>Marketplace Super Admin Console</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#23273c]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#121422] text-[#807a6f]">Or sign in with email</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#cfc7b8] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8a8475] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'customer'
                      ? 'customer@example.com'
                      : selectedRole === 'vendor'
                      ? 'vendor@fashtag.com'
                      : 'admin@fashtag.com'
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] placeholder-[#7d776c] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#cfc7b8]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to registered email.')}
                  className="text-[11px] text-[#d4af37] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8a8475] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#171a28] border border-[#2b2f42] rounded-xl text-xs text-[#f5f2eb] placeholder-[#7d776c] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c567] to-[#ba932a] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg mt-2"
            >
              Sign In as {selectedRole.toUpperCase()}
            </button>
          </form>

          {/* Footers for Registration */}
          <div className="pt-4 border-t border-[#1f2233] space-y-2 text-center text-xs text-[#9a9486]">
            <div>
              Don't have a customer account?{' '}
              <Link to="/register" className="text-[#d4af37] font-semibold hover:underline">
                Register as Customer
              </Link>
            </div>
            <div>
              Own a boutique in Bengaluru?{' '}
              <Link to="/vendor/register" className="text-[#d4af37] font-semibold hover:underline">
                Apply as a Shop Owner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
