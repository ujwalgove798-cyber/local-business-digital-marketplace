import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode } from '../../data/translations';

interface LanguageSelectorProps {
  variant?: 'topbar' | 'navbar' | 'mobile';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'navbar',
  className = '' 
}) => {
  const { language, setLanguage, languages, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'mobile') {
    return (
      <div className={`space-y-2 pt-2 border-t border-[#232738] ${className}`}>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#a8a192] uppercase tracking-wider px-1">
          <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Select Language / ಭಾಷೆ / भाषा</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#1e2233] border border-[#d4af37] text-[#d4af37]'
                    : 'bg-[#141622] border border-[#252838] text-[#cfc7b8] hover:text-white hover:border-[#d4af37]/40'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span>{lang.flag}</span>
                  <span className="font-medium truncate">{lang.nativeName}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'topbar') {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-xs text-[#bfb8aa] hover:text-[#d4af37] transition-colors py-0.5 px-2 rounded-md hover:bg-[#151722]"
          title="Change Website Language"
          aria-expanded={isOpen}
        >
          <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{currentLanguage.nativeName}</span>
          <ChevronDown className={`w-3 h-3 text-[#8f8879] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0f111a] border border-[#282d3f] shadow-2xl z-50 py-1.5 backdrop-blur-xl animate-in fade-in-50 zoom-in-95">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#8e8778] border-b border-[#212435]">
              Regional Languages
            </div>
            {languages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#1b1e2c] text-[#d4af37] font-semibold'
                      : 'text-[#cfc7b8] hover:bg-[#161824] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] text-[#736c5f]">({lang.name})</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Default navbar variant
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#151724] border border-[#272b3d] text-xs text-[#ded8cc] hover:border-[#d4af37] hover:text-white transition-all shadow-sm"
        title="Change Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
        <span className="font-medium text-[11px]">{currentLanguage.nativeName}</span>
        <ChevronDown className={`w-3 h-3 text-[#8f8879] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0f111a] border border-[#282d3f] shadow-2xl z-50 py-2 backdrop-blur-xl animate-in fade-in-50 zoom-in-95">
          <div className="px-3.5 py-1 text-[10px] uppercase font-bold tracking-wider text-[#8e8778] border-b border-[#212435] mb-1">
            Choose Language / ಭಾಷೆ
          </div>
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors ${
                  isSelected
                    ? 'bg-[#1b1e2c] text-[#d4af37] font-semibold'
                    : 'text-[#cfc7b8] hover:bg-[#161824] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">{lang.flag}</span>
                  <div className="text-left">
                    <p className="font-medium leading-none">{lang.nativeName}</p>
                    <p className="text-[10px] text-[#736c5f] mt-0.5">{lang.name}</p>
                  </div>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
