import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Home, Calendar } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#1b1d2b] border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center mx-auto shadow-2xl">
          <Sparkles className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#d4af37] block">
          404 • Page Not Found
        </span>

        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#fcf9f2]">
          A Couture Detour
        </h1>

        <p className="text-xs sm:text-sm text-[#9c9484] leading-relaxed">
          The style or page you are looking for has been moved or does not exist. 
          Return to explore our collections or book a personalized visit.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>

          <Link
            to="/book"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1c1f2e] border border-[#d4af37]/40 text-[#d4af37] font-semibold text-xs uppercase tracking-wider hover:bg-[#d4af37] hover:text-black transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Visit</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
