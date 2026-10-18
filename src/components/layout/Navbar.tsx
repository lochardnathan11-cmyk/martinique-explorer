'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Menu, X, Shield, User, LogOut, Loader2, ChevronDown, Compass, Heart } from 'lucide-react';
import LogoIcon from '@/components/ui/LogoIcon';
import LanguageSelector from '@/components/layout/LanguageSelector';
import { TRANSLATIONS } from '@/data/translations';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const { language, openModal, setSelectedCategory, currentUser, logout, favorites } = useApp();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [discoverDropdownOpen, setDiscoverDropdownOpen] = useState(false);
  const [mobileDiscoverOpen, setMobileDiscoverOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const discoverDropdownRef = useRef<HTMLDivElement>(null);

  const requestLogout = () => {
    setUserDropdownOpen(false);
    setMobileOpen(false);
    setLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    await new Promise(r => setTimeout(r, 400));
    await logout();
    setLogoutConfirmOpen(false);
    setIsLoggingOut(false);
    router.push('/');
  };

  // Fermer les menus si on clique à côté
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (discoverDropdownRef.current && !discoverDropdownRef.current.contains(e.target as Node)) {
        setDiscoverDropdownOpen(false);
      }
    };

    if (userDropdownOpen || discoverDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [userDropdownOpen, discoverDropdownOpen]);
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

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setMobileOpen(false);
    setUserDropdownOpen(false);
    setDiscoverDropdownOpen(false);
  };

  const discoverSubLinks = [
    {
      id: 'beaches',
      label: 'Plages',
      desc: 'Anses de sable blanc & volcanique',
      icon: '🏖️',
    },
    {
      id: 'snorkeling',
      label: 'Snorkeling',
      desc: 'Tortues, récifs & fonds marins',
      icon: '🤿',
    },
    {
      id: 'activities',
      label: 'Expériences',
      desc: 'Randos, excursions & nautisme',
      icon: '🏄',
    },
  ];

  const isDiscoverActive = discoverSubLinks.some(sub => sub.id === activeSection);
  const activeDiscoverItem = discoverSubLinks.find(sub => sub.id === activeSection);

  const navLinks = [
    { id: 'home', label: 'Explorer' },
    { id: 'discover_group', label: 'Découvrir', isDropdown: true },
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
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 mx-4">
          {navLinks.map(link => {
            if (link.isDropdown) {
              return (
                <div
                  key={link.id}
                  ref={discoverDropdownRef}
                  className="relative"
                  onMouseEnter={() => setDiscoverDropdownOpen(true)}
                  onMouseLeave={() => setDiscoverDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setDiscoverDropdownOpen(prev => !prev)}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors relative py-1.5 whitespace-nowrap cursor-pointer ${
                      scrolled || activeSection !== 'home'
                        ? isDiscoverActive
                          ? 'text-action font-semibold'
                          : 'text-ink-muted hover:text-deep'
                        : isDiscoverActive
                        ? 'text-white font-semibold'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <span>{activeDiscoverItem ? activeDiscoverItem.label : link.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        discoverDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                    {isDiscoverActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-action rounded-full" />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {discoverDropdownOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2.5 w-72 z-50 animate-fadeIn">
                      <div className="bg-white rounded-2xl shadow-modal border border-lagon-border p-2 space-y-1">
                        {discoverSubLinks.map(sub => {
                          const isSubActive = activeSection === sub.id;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleNavClick(sub.id)}
                              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                isSubActive
                                  ? 'bg-lagon-bg text-action'
                                  : 'hover:bg-lagon-bg/60 text-deep'
                              }`}
                            >
                              <span className="w-9 h-9 rounded-xl bg-lagon-bg border border-lagon-border/60 flex items-center justify-center text-base shrink-0">
                                {sub.icon}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className={`text-xs font-semibold ${isSubActive ? 'text-action' : 'text-deep'}`}>
                                  {sub.label}
                                </div>
                                <div className="text-[11px] text-ink-muted truncate">
                                  {sub.desc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

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
                  className={`h-9 flex items-center gap-2 pl-2 pr-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    scrolled || activeSection !== 'home'
                      ? userDropdownOpen
                        ? 'bg-white border-teal-700 text-deep ring-2 ring-teal-700/15'
                        : 'bg-white border-stone-200/90 text-deep hover:border-stone-300 shadow-2xs'
                      : 'bg-white/15 border-white/25 text-white hover:bg-white/25'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-teal-800 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[110px] truncate">{currentUser.name}</span>
                  {currentUser.role === 'admin' && (
                    <span className="w-2 h-2 rounded-full bg-coral shrink-0" title="Administrateur" />
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Logged in User Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200/90 overflow-hidden z-50 text-left animate-fadeIn">
                    {/* En-tête utilisateur soigné */}
                    <div className="px-4 py-3.5 bg-[#FAF8F5] border-b border-stone-200/80 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 truncate leading-tight">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>

                    {/* Liens de navigation alignés avec icônes */}
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        href="/compte"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-3 py-2.5 text-xs font-semibold text-slate-800 hover:text-teal-900 hover:bg-stone-100/80 rounded-xl transition-colors flex items-center gap-2.5"
                      >
                        <User className="w-4 h-4 text-teal-800 shrink-0" />
                        <span>Mon profil & favoris</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleNavClick('map')}
                        className="w-full text-left px-3 py-2.5 text-xs font-semibold text-slate-800 hover:text-teal-900 hover:bg-stone-100/80 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <Compass className="w-4 h-4 text-teal-800 shrink-0" />
                        <span>Carte interactive de l&apos;île</span>
                      </button>

                      {currentUser.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full text-left px-3 py-2.5 text-xs font-semibold text-slate-800 hover:text-teal-900 hover:bg-stone-100/80 rounded-xl transition-colors flex items-center gap-2.5"
                        >
                          <Shield className="w-4 h-4 text-coral shrink-0" />
                          <span>Administration</span>
                        </Link>
                      )}
                    </div>

                    {/* Pied de menu séparé par un trait droit net (sans bordure courbe parasite) */}
                    <div className="p-1.5 border-t border-stone-200/80 bg-[#FAF8F5]/50">
                      <button
                        type="button"
                        onClick={requestLogout}
                        disabled={isLoggingOut}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-[#C84B31] hover:bg-red-50/80 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openModal('auth')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  scrolled || activeSection !== 'home'
                    ? 'border-stone-200/90 text-slate-800 hover:text-teal-900 hover:border-stone-300 bg-white shadow-2xs'
                    : 'border-white/25 text-white hover:bg-white/20 bg-white/10'
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
          <nav className="flex flex-col gap-1.5">
            {navLinks.map(link => {
              if (link.isDropdown) {
                return (
                  <div key={link.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setMobileDiscoverOpen(prev => !prev)}
                      className={`w-full flex items-center justify-between text-left py-2.5 text-base font-medium rounded-xl px-3 transition-colors ${
                        isDiscoverActive
                          ? 'bg-lagon-bg text-action font-semibold'
                          : 'text-ink hover:text-action'
                      }`}
                    >
                      <span>{activeDiscoverItem ? `${link.label} (${activeDiscoverItem.label})` : link.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          mobileDiscoverOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {mobileDiscoverOpen && (
                      <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-lagon-border ml-3">
                        {discoverSubLinks.map(sub => {
                          const isSubActive = activeSection === sub.id;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleNavClick(sub.id)}
                              className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                                isSubActive
                                  ? 'bg-lagon-bg text-action font-semibold'
                                  : 'text-ink-muted hover:text-deep hover:bg-lagon-bg/50'
                              }`}
                            >
                              <span>{sub.icon}</span>
                              <span>{sub.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
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
              );
            })}
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
                    type="button"
                    onClick={requestLogout}
                    disabled={isLoggingOut}
                    className="text-coral hover:underline flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Déconnexion</span>
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

      {/* Modale de confirmation de déconnexion */}
      {logoutConfirmOpen && currentUser && (
        <div className="fixed inset-0 z-[1400] bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xl max-w-sm w-full overflow-hidden text-left">
            <div className="px-6 py-5 bg-[#FAF8F5] border-b border-stone-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200/80 text-[#C84B31] flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Se déconnecter ?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Compte : {currentUser.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLogoutConfirmOpen(false)}
                disabled={isLoggingOut}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-sm text-slate-600 leading-relaxed">
                Êtes-vous sûr de vouloir vous déconnecter ? Vos lieux favoris et vos préférences resteront sauvegardés pour votre prochaine visite.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLogoutConfirmOpen(false)}
                  disabled={isLoggingOut}
                  className="py-2.5 px-4 rounded-xl bg-white hover:bg-stone-100 text-slate-700 border border-stone-200/90 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Annuler
                </button>

                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  disabled={isLoggingOut}
                  className="py-2.5 px-4 rounded-xl bg-[#C84B31] hover:bg-[#B03E26] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2 shadow-2xs disabled:opacity-60"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Déconnexion...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      <span>Me déconnecter</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
