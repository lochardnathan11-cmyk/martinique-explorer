'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ChevronDown, Check } from 'lucide-react';
import { AppLanguage } from '@/types';

interface LanguageSelectorProps {
  scrolled: boolean;
  isHome: boolean;
}

// Crisp Vector SVG Flags ensuring perfect display on Windows, Mac and Mobile
function FlagIcon({ code }: { code: AppLanguage }) {
  switch (code) {
    case 'fr':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[3px] shadow-xs shrink-0 border border-black/10 overflow-hidden">
          <g fillRule="evenodd" strokeWidth="1pt">
            <path fill="#fff" d="M0 0h640v480H0z" />
            <path fill="#00267f" d="M0 0h213.3v480H0z" />
            <path fill="#f31830" d="M426.7 0H640v480H426.7z" />
          </g>
        </svg>
      );
    case 'en':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[3px] shadow-xs shrink-0 border border-black/10 overflow-hidden">
          <path fill="#012169" d="M0 0h640v480H0z" />
          <path fill="#FFF" d="m75 0 245 184L565 0h75v56L436 240l204 184v56h-75L320 296 75 480H0v-56l204-184L0 56V0h75z" />
          <path fill="#C8102E" d="m424 281 216 163v36h-48L376 317zm-208-82L0 36V0h48l216 163zm168-163 256 192v36L384 72V36zm-208 408L0 281v-36l256 192v36z" />
          <path fill="#FFF" d="M256 0h128v480H256zM0 176h640v128H0z" />
          <path fill="#C8102E" d="M280 0h80v480h-80zM0 200h640v80H0z" />
        </svg>
      );
    case 'de':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[3px] shadow-xs shrink-0 border border-black/10 overflow-hidden">
          <path fill="#ffce00" d="M0 320h640v160H0z" />
          <path fill="#000" d="M0 0h640v160H0z" />
          <path fill="#d00" d="M0 160h640v160H0z" />
        </svg>
      );
    case 'es':
      return (
        <svg viewBox="0 0 640 480" className="w-5 h-3.5 rounded-[3px] shadow-xs shrink-0 border border-black/10 overflow-hidden">
          <path fill="#aa151b" d="M0 0h640v480H0z" />
          <path fill="#f1bf00" d="M0 120h640v240H0z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function LanguageSelector({ scrolled, isHome }: LanguageSelectorProps) {
  const { language, setLanguage } = useApp();
  const [open, setOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [open]);

  const languages: { code: AppLanguage; label: string }[] = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'es', label: 'Español' },
  ];

  const current = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Sleek Trigger Button with Live SVG Flag */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border cursor-pointer ${
          scrolled || !isHome
            ? 'bg-lagon-bg/60 border-lagon-border text-deep hover:bg-lagon-bg hover:border-action'
            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
        }`}
        aria-label="Sélectionner la langue"
      >
        <FlagIcon code={current.code} />
        <span className="font-semibold">{current.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 opacity-70 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Elegant Custom Dropdown with Crisp Visual Flags */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-modal border border-lagon-border p-2 z-50 text-left animate-fadeIn">
            <div className="px-2.5 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-ink-muted border-b border-lagon-border/60 mb-1">
              Langue / Language
            </div>
            <div className="space-y-1">
              {languages.map(lang => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-lagon-bg text-action font-semibold'
                        : 'text-ink hover:bg-lagon-bg/60'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <FlagIcon code={lang.code} />
                      <span className="text-deep font-medium">{lang.label}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-action shrink-0" />}
                  </button>
                );
              })}
            </div>
        </div>
      )}
    </div>
  );
}
