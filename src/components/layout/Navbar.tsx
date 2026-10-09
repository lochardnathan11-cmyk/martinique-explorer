'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Menu, X, Shield, User, LogOut } from 'lucide-react';
import LogoIcon from '@/components/ui/LogoIcon';
import LanguageSelector from '@/components/layout/LanguageSelector';
import { TRANSLATIONS } from '@/data/translations';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const { language, openModal, setSelectedCategory, currentUser, logout } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique à côté
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [userDropdownOpen]);
  const t = TRANSLATIONS[language] || TRANSLATIONS.fr;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    if (id === 'home') setSelectedCategory(null);
    else if (id === 'beaches') setSelectedCategory('beach');
    else if (id === 'snorkeling') setSelectedCategory('snorkeling');
    else if (id === 'activities') setSelectedCategory('activity');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileOpen(false);
    setUserDropdownOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Explorer' },
    { id: 'beaches', label: 'Plages' },
    { id: 'snorkeling', label: 'Snorkeling' },
    { id: 'activities', label: 'Expériences' },
    { id: 'map', label: 'Carte', shortLabel: 'Carte' },
    { id: 'blog', label: 'Actualités', shortLabel: 'Actus' },
    { id: 'community', label: 'Communauté' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] pointer-events-auto transition-all duration-300 ${
        scrolled || activeSection !== 'home'
          ? 'bg-white/95 backdrop-blur-md border-b border-lagon-border shadow-soft py-3'
          : 'bg-gradient-to-b from-deep/60 via-deep/25 to-transparent text-white py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        {/* Brand Logo with Custom Illustration Icon */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0 cursor-pointer"
        >
          <div className="transition-transform duration-300 group-hover:scale-105 shrink-0 shadow-sm rounded-[14px]">
            <LogoIcon className="w-10 h-10" />
          </div>
          <div>
            <span
              className={`text-lg sm:text-xl font-semibold tracking-tight transition-colors ${
                scrolled || activeSection !== 'home' ? 'text-deep' : 'text-white'
              }`}
            >
              Martinique <span className="font-light text-action">Explorer</span>
            </span>
            <span
              className={`hidden md:block text-[10px] tracking-widest uppercase transition-colors -mt-1 font-medium ${
                scrolled || activeSection !== 'home' ? 'text-ink-muted' : 'text-white/70'
              }`}
            >
              Madinina • Île aux Fleurs
            </span>
          </div>
        </button>

        {/* Desktop Navigation with Comfortable Spacing */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-7 mx-4">
          {navLinks.map(link => {
            const isActive = activeSection === link.id;
            return (
              <button
                type="button"
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm font-medium transition-colors relative py-1.5 whitespace-nowrap cursor-pointer ${
                  scrolled || activeSection !== 'home'
                    ? isActive
                      ? 'text-action font-semibold'
                      : 'text-ink-muted hover:text-deep'
                    : isActive
                    ? 'text-white font-semibold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.shortLabel ? (
                  <>
                    <span className="hidden xl:inline">{link.label}</span>
                    <span className="xl:hidden">{link.shortLabel}</span>
                  </>
                ) : (
                  link.label
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-action rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA & Utilities */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Custom Elegant Language Selector with Flag Dropdown */}
          <LanguageSelector scrolled={scrolled} isHome={activeSection === 'home'} />

          {/* User Account Button with Dropdown positioned strictly below */}
          <div className="relative" ref={userDropdownRef}>
            {currentUser ? (
              <div>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-medium transition-all ${
                    scrolled || activeSection !== 'home'
                      ? 'bg-lagon-bg border-lagon-border text-deep hover:border-action'
                      : 'bg-white/15 border-white/20 text-white hover:bg-white/25'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-action text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                  {currentUser.role === 'admin' && (
                    <span className="w-2 h-2 rounded-full bg-coral shrink-0" title="Administrateur" />
                  )}
                </button>

                {/* Logged in User Menu */}
                {userDropdownOpen && (
                  <>
                    
                    <div className="absolute right-0 top-full mt-2.5 w-60 bg-white rounded-2xl shadow-modal border border-lagon-border p-2.5 z-50 text-left animate-fadeIn">
                      <div className="px-3 py-2 border-b border-lagon-border/70">
                        <p className="text-xs font-semibold text-deep truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-ink-muted truncate">{currentUser.email}</p>
                      </div>

                      <Link
                        href="/compte"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-deep hover:bg-lagon-bg rounded-xl transition-colors flex items-center gap-2 my-1"
                      >
                        <User className="w-3.5 h-3.5 text-action shrink-0" />
                        <span>Mon Profil & Favoris</span>
                      </Link>

                      {currentUser.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-deep hover:bg-sand-light rounded-xl transition-colors flex items-center gap-2 my-1"
                        >
                          <Shield className="w-3.5 h-3.5 text-coral shrink-0" />
                          <span>Page Administration (Admin)</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => handleNavClick('map')}
                        className="w-full text-left px-3 py-2 text-xs text-ink hover:bg-lagon-bg rounded-xl transition-colors"
                      >
                        Carte Interactive de l&apos;Île
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-coral hover:bg-coral-soft rounded-xl transition-colors flex items-center gap-2 mt-1 border-t border-lagon-border/70"
                      >
                        <LogOut className="w-3.5 h-3.5 shrink-0" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openModal('auth')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-medium transition-all ${
                  scrolled || activeSection !== 'home'
                    ? 'border-lagon-border text-ink hover:text-action hover:border-action bg-white'
                    : 'border-white/20 text-white hover:bg-white/20 bg-white/10'
                }`}
                aria-label="Se connecter ou créer un compte"
              >
                <User className="w-3.5 h-3.5" />
                <span>Compte</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden p-2 rounded-xl transition ${
            scrolled || activeSection !== 'home' ? 'text-deep' : 'text-white'
          }`}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-lagon-border px-6 py-6 shadow-modal space-y-4 animate-fadeIn">
          <nav className="flex flex-col gap-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left py-2.5 text-base font-medium rounded-xl px-3 transition-colors ${
                  activeSection === link.id
                    ? 'bg-lagon-bg text-action font-semibold'
                    : 'text-ink hover:text-action'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-lagon-border flex flex-col gap-3">
            {/* Mobile Language Selector */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-ink-muted">Langue :</span>
              <LanguageSelector scrolled={true} isHome={false} />
            </div>

            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-lagon-bg text-xs">
                  <Link href="/compte" onClick={() => setMobileOpen(false)} className="font-semibold text-action hover:underline flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Mon Compte ({currentUser.name})</span>
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="text-coral hover:underline"
                  >
                    Déconnexion
                  </button>
                </div>
                {currentUser.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-sand-light text-deep text-xs font-semibold border border-sand-border flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-coral" />
                    <span>Page Administration (Admin)</span>
                  </Link>
                )}
              </div>
            ) : (
              <button
                onClick={() => { openModal('auth'); setMobileOpen(false); }}
                className="w-full py-2.5 rounded-xl border border-lagon-border text-deep text-xs font-medium flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-action" />
                <span>Se connecter / Créer un compte</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
