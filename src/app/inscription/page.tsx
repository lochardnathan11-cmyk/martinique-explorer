'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Sun,
  Fish,
  Mountain,
  Utensils,
  Sailboat,
  Flame,
  Award,
  Camera,
  Loader2,
  Search,
  MapPin,
  X
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import LogoIcon from '@/components/ui/LogoIcon';
import { MARTINIQUE_COMMUNES, normalizeSearchText } from '@/data/communes';

const TRAVELER_PROFILES = [
  { id: 'Voyageur en séjour', label: 'Voyageur en séjour', icon: '🌴', subtitle: 'Vacances & découverte' },
  { id: 'Habitant de Martinique', label: 'Habitant de l’île', icon: '🌺', subtitle: 'Vie locale & bons plans' },
  { id: 'Saisonnier / Expatrié', label: 'Saisonnier / Expatrié', icon: '⛵', subtitle: 'Séjour prolongé' },
  { id: 'Futur résident / Retraite', label: 'Futur résident', icon: '🌅', subtitle: 'Installation au soleil' }
];

const INTEREST_TILES = [
  { id: 'Plages de sable blanc', label: 'Plages de sable blanc', icon: Sun, color: 'text-amber-500 bg-amber-50' },
  { id: 'Snorkeling & tortues', label: 'Snorkeling & tortues', icon: Fish, color: 'text-teal-600 bg-teal-50' },
  { id: 'Randonnées & rivières', label: 'Randonnées & cascades', icon: Mountain, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'Tables de bord de mer', label: 'Tables créoles & poissons', icon: Utensils, color: 'text-rose-500 bg-rose-50' },
  { id: 'Fonds blancs & îlets', label: 'Fonds blancs & îlets', icon: Sailboat, color: 'text-sky-600 bg-sky-50' },
  { id: 'Anses volcaniques du Nord', label: 'Anses volcaniques', icon: Flame, color: 'text-stone-700 bg-stone-100' },
  { id: 'Distilleries & rhums AOC', label: 'Distilleries & rhums', icon: Award, color: 'text-amber-700 bg-amber-50' },
  { id: 'Couchers de soleil & points de vue', label: 'Couchers de soleil', icon: Camera, color: 'text-orange-600 bg-orange-50' }
];

const POPULAR_COMMUNES = [
  'Sainte-Anne',
  'Les Trois-Îlets',
  'Le Diamant',
  'Sainte-Luce',
  'Les Anses-d’Arlet'
];

export default function InscriptionPage() {
  const router = useRouter();
  const { signup, addPoints, openModal } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Étape 2: Identifiants
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Étape 3: Préférences
  const [travelerType, setTravelerType] = useState('Voyageur en séjour');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Plages de sable blanc',
    'Snorkeling & tortues',
    'Tables de bord de mer'
  ]);
  const [baseCommune, setBaseCommune] = useState('Sainte-Anne');

  // Recherche dynamique de commune
  const [communeSearch, setCommuneSearch] = useState('Sainte-Anne');
  const [isCommuneDropdownOpen, setIsCommuneDropdownOpen] = useState(false);
  const communeDropdownRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filtrage intelligent des 34 communes de Martinique
  const filteredCommunes = useMemo(() => {
    if (!communeSearch.trim()) return MARTINIQUE_COMMUNES;
    const query = normalizeSearchText(communeSearch);
    return MARTINIQUE_COMMUNES.filter(c => normalizeSearchText(c).includes(query));
  }, [communeSearch]);

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (communeDropdownRef.current && !communeDropdownRef.current.contains(e.target as Node)) {
        setIsCommuneDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Veuillez renseigner votre prénom et nom.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Veuillez renseigner une adresse e-mail valide.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setStep(3);
  };

  const handleFinalSubmit = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await signup(name.trim(), cleanEmail, password);

      if (!res.success) {
        setErrorMessage(res.error || 'Erreur lors de la création du compte.');
        setIsLoading(false);
        setStep(2);
        return;
      }

      let sector: 'Sud Caraïbe' | 'Extrême Sud' | 'Nord Volcanique' | 'Côte Atlantique' = 'Sud Caraïbe';
      if (['Sainte-Anne', 'Sainte-Luce', 'Le Marin', 'Rivière-Pilote'].includes(baseCommune)) {
        sector = 'Extrême Sud';
      } else if (['Le Carbet', 'Saint-Pierre', 'Le Prêcheur', "Grand'Rivière", 'Macouba'].includes(baseCommune)) {
        sector = 'Nord Volcanique';
      } else if (['La Trinité', 'Le Robert', 'Le François', 'Le Vauclin', 'Sainte-Marie'].includes(baseCommune)) {
        sector = 'Côte Atlantique';
      }

      const userPrefs = {
        travelerType,
        baseCommune,
        favoriteSector: sector,
        bio: `Explorateur basé à ${baseCommune}. Passionné par : ${selectedInterests.slice(0, 2).join(', ')}.`,
        avatarPhoto: '',
        interests: selectedInterests.length > 0 ? selectedInterests : ['Plages de sable blanc', 'Snorkeling & tortues']
      };

      try {
        localStorage.setItem('mq_account_prefs_v2', JSON.stringify(userPrefs));
        localStorage.setItem('mq_profile_reward_claimed', '1');
      } catch (e) {}

      addPoints(30);

      setTimeout(() => {
        router.push('/compte?tab=settings&welcome=1');
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur inattendue est survenue.');
      setIsLoading(false);
    }
  };

  return (
    <div className="h-dvh max-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col justify-between overflow-hidden font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* 1. Header & Stepper unifié (h-14) */}
      <header className="border-b border-stone-200/80 bg-white/95 backdrop-blur-md shrink-0 h-14 sm:h-15 flex items-center px-4 sm:px-6">
        <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <LogoIcon className="w-8 h-8" />
            <span className="font-extrabold text-sm tracking-tight text-slate-900 hidden sm:inline">
              Martinique Explorer
            </span>
          </Link>

          {/* Stepper centré avec numéros clairs */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                  step === 1 ? 'bg-teal-800 text-white shadow-2xs' : 'bg-teal-100 text-teal-900'
                }`}
              >
                {step > 1 ? '✓' : '1'}
              </span>
              <span className={step === 1 ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                Découverte
              </span>
            </button>

            <div className="h-0.5 w-6 sm:w-12 bg-stone-200" />

            <button
              type="button"
              onClick={() => { if (step > 1) setStep(2); }}
              className={`flex items-center gap-1.5 ${step >= 2 ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                  step === 2
                    ? 'bg-teal-800 text-white shadow-2xs'
                    : step > 2
                    ? 'bg-teal-100 text-teal-900'
                    : 'bg-stone-200 text-slate-400'
                }`}
              >
                {step > 2 ? '✓' : '2'}
              </span>
              <span className={step === 2 ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                Identifiants
              </span>
            </button>

            <div className="h-0.5 w-6 sm:w-12 bg-stone-200" />

            <div className="flex items-center gap-1.5">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                  step === 3 ? 'bg-teal-800 text-white shadow-2xs' : 'bg-stone-200 text-slate-400'
                }`}
              >
                3
              </span>
              <span className={step === 3 ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                Préférences
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openModal('auth')}
            className="text-xs font-semibold text-slate-700 hover:text-teal-900 px-3 py-1.5 rounded-xl border border-stone-200/90 hover:border-teal-700 bg-white hover:bg-stone-50 transition-all cursor-pointer shrink-0"
          >
            Se connecter
          </button>
        </div>
      </header>

      {/* 2. Conteneur centré verticalement : 100% visible sans scroll */}
      <main className="flex-1 min-h-0 flex flex-col justify-center max-w-4xl w-full mx-auto px-4 sm:px-6 py-2">
        {errorMessage && (
          <div className="mb-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fadeIn shadow-2xs shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold leading-tight">{errorMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* ÉTAPE 1 : DÉCOUVERTE (Identique à la capture utilisateur) */}
        {/* ========================================================= */}
        {step === 1 && (
          <div className="space-y-4 sm:space-y-5 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Bienvenue en Martinique · Madinina</span>
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 tracking-tight leading-tight">
                Votre carnet d’exploration commence ici
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                Martinique Explorer réunit les plus belles pépites secrètes, la météo des plages en direct et un carnet de voyage sur-mesure pour vivre l&apos;île comme un initié.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center text-lg">
                  🏖️
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  40+ Trésors de l&apos;île
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Des criques de sable blanc du Sud aux anses volcaniques du Nord, avec accès GPS et conseils authentiques.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center text-lg">
                  🌊
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Météo des Plages & Sargasses
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Relevés météo et état de la mer en direct pour choisir la baignade idéale chaque matin sans mauvaise surprise.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-lg">
                  🧭
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Carnet & Sceaux de l&apos;île
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enregistrez vos favoris, gagnez des points d&apos;exploration (XP) et débloquez les 6 sceaux officiels de l&apos;île.
                </p>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-teal-50/90 border border-teal-200/80 flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-800 text-white flex items-center justify-center text-xs font-extrabold shrink-0">
                  +30
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-teal-950 truncate">
                    Bonus de bienvenue : +30 points XP offerts
                  </h4>
                  <p className="text-[11px] text-teal-800 truncate">
                    Complétez votre profil en 1 minute pour activer votre carnet d&apos;explorateur.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>Créer mon carnet d&apos;exploration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ÉTAPE 2 : IDENTIFIANTS                                    */}
        {/* ========================================================= */}
        {step === 2 && (
          <div className="max-w-md w-full mx-auto bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-xl space-y-3.5 animate-fadeIn">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                Étape 2 sur 3
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Créez vos identifiants
              </h2>
              <p className="text-xs text-slate-500">
                Pour retrouver vos favoris et votre progression sur tous vos appareils.
              </p>
            </div>

            <form onSubmit={handleStep2Submit} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Prénom & Nom
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex : Nathan Martin"
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:bg-white transition-all outline-none"
                    required
                    autoFocus
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:bg-white transition-all outline-none"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Mot de passe
                  </label>
                  <span className="text-[10px] text-slate-400">6 car. minimum</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs sm:text-sm pl-9 pr-9 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:bg-white transition-all outline-none"
                    required
                    minLength={6}
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    aria-label="Afficher le mot de passe"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-slate-600 hover:bg-stone-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Continuer vers mes préférences</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ÉTAPE 3 : PRÉFÉRENCES (Refonte 2 colonnes ultra-fluide & SANS DÉFILEMENT) */}
        {/* ========================================================= */}
        {step === 3 && (
          <div className="max-w-3xl w-full mx-auto bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-xl space-y-3.5 animate-fadeIn">
            {/* Header compact */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                Étape 3 sur 3 · Pré-remplissage du carnet
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Personnalisez vos préférences de voyage
              </h2>
              <p className="text-xs text-slate-500">
                Ces informations pré-remplissent votre profil pour adapter vos suggestions d&apos;adresses.
              </p>
            </div>

            {/* Grille 2 colonnes parfaitement équilibrée */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
              {/* Colonne gauche (5/12) : Profil + Recherche dynamique de commune */}
              <div className="md:col-span-5 space-y-3">
                {/* 1. Profil voyageur (chips 2x2) */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    1. Votre profil
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {TRAVELER_PROFILES.map(p => {
                      const active = travelerType === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setTravelerType(p.id)}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            active
                              ? 'bg-teal-50 border-teal-700 text-teal-950 font-bold shadow-2xs ring-1 ring-teal-700/20'
                              : 'bg-stone-50 border-stone-200/80 text-slate-600 hover:bg-stone-100'
                          }`}
                        >
                          <span className="text-base shrink-0">{p.icon}</span>
                          <span className="text-[11px] leading-tight font-semibold truncate">{p.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Recherche intuitive de commune (avec autocomplétion instantanée) */}
                <div className="space-y-1.5 relative" ref={communeDropdownRef}>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>2. Camp de base (commune)</span>
                    <span className="text-[10px] text-teal-800 font-semibold">{baseCommune}</span>
                  </label>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={communeSearch}
                      onFocus={() => {
                        setIsCommuneDropdownOpen(true);
                        if (communeSearch === baseCommune) setCommuneSearch('');
                      }}
                      onChange={e => {
                        setCommuneSearch(e.target.value);
                        setIsCommuneDropdownOpen(true);
                      }}
                      placeholder="Tapez le nom d'une ville (ex: Sainte-Anne...)"
                      className="w-full text-xs pl-8 pr-7 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:bg-white transition-all outline-none"
                    />
                    {communeSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setCommuneSearch('');
                          setIsCommuneDropdownOpen(true);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Liste déroulante des résultats de recherche */}
                  {isCommuneDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-36 overflow-y-auto rounded-xl bg-white border border-stone-200 shadow-xl z-50 p-1 divide-y divide-stone-100">
                      {filteredCommunes.length > 0 ? (
                        filteredCommunes.map(commune => {
                          const isSelected = baseCommune === commune;
                          return (
                            <button
                              key={commune}
                              type="button"
                              onClick={() => {
                                setBaseCommune(commune);
                                setCommuneSearch(commune);
                                setIsCommuneDropdownOpen(false);
                              }}
                              className={`w-full px-2.5 py-1.5 text-xs text-left rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-teal-800 text-white font-bold'
                                  : 'text-slate-700 hover:bg-teal-50 hover:text-teal-900'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 opacity-60" />
                                <span>{commune}</span>
                              </div>
                              {isSelected && <Check className="w-3 h-3" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-2 text-center text-xs text-slate-400">
                          Aucune commune pour « {communeSearch} »
                        </div>
                      )}
                    </div>
                  )}

                  {/* Accès rapide 1-clic aux communes phares */}
                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    {POPULAR_COMMUNES.map(com => (
                      <button
                        key={com}
                        type="button"
                        onClick={() => {
                          setBaseCommune(com);
                          setCommuneSearch(com);
                          setIsCommuneDropdownOpen(false);
                        }}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                          baseCommune === com
                            ? 'bg-teal-800 text-white font-semibold shadow-2xs'
                            : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                        }`}
                      >
                        {com}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colonne droite (7/12) : 8 Envies prioritaires en tuiles cliquables */}
              <div className="md:col-span-7 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    3. Vos envies prioritaires sur l&apos;île
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {selectedInterests.length} cochée(s)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {INTEREST_TILES.map(tile => {
                    const Icon = tile.icon;
                    const active = selectedInterests.includes(tile.id);
                    return (
                      <button
                        key={tile.id}
                        type="button"
                        onClick={() => toggleInterest(tile.id)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          active
                            ? 'bg-teal-50 border-teal-700 text-teal-950 font-bold shadow-2xs'
                            : 'bg-stone-50 border-stone-200/80 text-slate-600 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${tile.color}`}>
                            <Icon className="w-3 h-3" />
                          </div>
                          <span className="text-[11px] leading-tight truncate">
                            {tile.label}
                          </span>
                        </div>
                        {active && <Check className="w-3.5 h-3.5 text-teal-800 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Validation finale visible immédiatement sans scroll */}
            <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-slate-600 hover:bg-stone-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Identifiants</span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Création du carnet...</span>
                  </>
                ) : (
                  <>
                    <span>Valider & Ouvrir mon Carnet (+30 XP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 3. Footer minimaliste 1 ligne */}
      <footer className="py-2 text-center text-[11px] text-slate-400 shrink-0">
        Martinique Explorer · Carnet de voyage éco-responsable & solidaire de Madinina
      </footer>
    </div>
  );
}
