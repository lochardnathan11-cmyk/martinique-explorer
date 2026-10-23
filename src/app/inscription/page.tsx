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
import LanguageSelector from '@/components/layout/LanguageSelector';
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
  'Les Anses-d’Arlet',
  'Tartane',
  'Saint-Pierre',
  'Le François'
];

const AVATAR_PRESETS = [
  { id: 'salines', label: 'Les Salines', url: '/images/spots/salines.jpg' },
  { id: 'dufour', label: 'Anse Dufour', url: '/images/spots/anse-dufour.jpg' },
  { id: 'diamant', label: 'Le Diamant', url: '/images/spots/diamant.jpg' },
  { id: 'pelee', label: 'Montagne Pelée', url: '/images/spots/montagne-pelee-vue.jpg' },
  { id: 'arlet', label: 'Anses-d’Arlet', url: '/images/spots/ponton-anses-arlet.jpg' },
  { id: 'initials', label: 'Initiales', url: '' }
];

export default function InscriptionPage() {
  const router = useRouter();
  const { signup, addPoints, openModal, currentUser } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Étape 2: Identifiants
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Étape 3: Préférences (parcours progressif en 4 slides fluides)
  const [prefSubStep, setPrefSubStep] = useState<1 | 2 | 3 | 4>(1);
  const [maxPrefSubStep, setMaxPrefSubStep] = useState<number>(1);
  const [travelerType, setTravelerType] = useState('Voyageur en séjour');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Plages de sable blanc',
    'Snorkeling & tortues',
    'Tables de bord de mer'
  ]);
  const [baseCommune, setBaseCommune] = useState('Sainte-Anne');
  const [avatarPhoto, setAvatarPhoto] = useState<string>('/images/spots/salines.jpg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const goToPrefSubStep = (next: 1 | 2 | 3 | 4) => {
    setPrefSubStep(next);
    if (next > maxPrefSubStep) {
      setMaxPrefSubStep(next);
    }
  };

  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('La photo ne doit pas dépasser 5 Mo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      if (typeof ev.target?.result === 'string') {
        setAvatarPhoto(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

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
        avatarPhoto,
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
    <div className="relative h-dvh max-h-screen text-slate-800 flex flex-col justify-between overflow-hidden font-sans selection:bg-teal-500 selection:text-white">
      {/* Fond immersif caraïbéen identique à la page d'accueil */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
          alt="Plage de sable blanc et eau turquoise en Martinique"
          className="w-full h-full object-cover object-center scale-100"
        />
        {/* Voiles sombres et dégradés profonds pour sublimer la clarté et le contraste */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep/85 via-deep/60 to-deep/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-transparent to-deep/45" />
      </div>

      {/* 1. Header & Stepper unifié style page d'accueil (fond translucide, branding officiel et pilule de verre) */}
      <header className="relative z-30 border-b border-white/15 bg-slate-950/40 backdrop-blur-md shrink-0 h-16 sm:h-18 flex items-center px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo officiel Martinique Explorer identique à la page d'accueil */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none cursor-pointer"
          >
            <div className="transition-transform duration-300 group-hover:scale-105 shrink-0 shadow-sm rounded-[14px]">
              <LogoIcon className="w-9 h-9 sm:w-10 sm:h-10" />
            </div>
            <div>
              <span className="text-base sm:text-lg lg:text-xl font-semibold tracking-tight text-white block leading-tight">
                Martinique <span className="font-light text-action">Explorer</span>
              </span>
              <span className="hidden md:block text-[10px] tracking-widest uppercase text-white/70 -mt-0.5 font-medium">
                Madinina • Île aux Fleurs
              </span>
            </div>
          </Link>

          {/* Stepper capsule moderne en verre dépoli */}
          <div className="flex items-center gap-1.5 sm:gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 sm:px-4 py-1.5 shadow-soft">
            {/* Étape 1 */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              <span
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all ${
                  step === 1
                    ? 'bg-action text-white shadow-xs ring-2 ring-white/30'
                    : 'bg-white/20 text-white/90 group-hover:bg-white/30'
                }`}
              >
                {step > 1 ? '✓' : '1'}
              </span>
              <span
                className={`text-xs font-semibold hidden md:inline transition-colors ${
                  step === 1 ? 'text-white font-bold' : 'text-white/70 group-hover:text-white'
                }`}
              >
                Découverte
              </span>
            </button>

            <div className="h-0.5 w-3 sm:w-6 lg:w-8 bg-white/25 rounded-full" />

            {/* Étape 2 */}
            <button
              type="button"
              onClick={() => { if (step > 1) setStep(2); }}
              className={`flex items-center gap-1.5 ${step >= 2 ? 'cursor-pointer group' : 'cursor-default opacity-60'}`}
            >
              <span
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all ${
                  step === 2
                    ? 'bg-action text-white shadow-xs ring-2 ring-white/30'
                    : step > 2
                    ? 'bg-white/20 text-white/90 group-hover:bg-white/30'
                    : 'bg-white/15 text-white/50'
                }`}
              >
                {step > 2 ? '✓' : '2'}
              </span>
              <span
                className={`text-xs font-semibold hidden md:inline transition-colors ${
                  step === 2 ? 'text-white font-bold' : 'text-white/70 group-hover:text-white'
                }`}
              >
                Identifiants
              </span>
            </button>

            <div className="h-0.5 w-3 sm:w-6 lg:w-8 bg-white/25 rounded-full" />

            {/* Étape 3 */}
            <div className={`flex items-center gap-1.5 ${step === 3 ? '' : 'opacity-60'}`}>
              <span
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all ${
                  step === 3
                    ? 'bg-action text-white shadow-xs ring-2 ring-white/30'
                    : 'bg-white/15 text-white/50'
                }`}
              >
                3
              </span>
              <span
                className={`text-xs font-semibold hidden md:inline ${
                  step === 3 ? 'text-white font-bold' : 'text-white/70'
                }`}
              >
                Préférences
              </span>
            </div>
          </div>

          {/* Côté droit : Sélecteur de langue & Connexion style page d'accueil */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageSelector scrolled={false} isHome={true} />

            {currentUser ? (
              <Link
                href="/compte"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/25 text-white hover:bg-white/20 bg-white/10 text-xs font-semibold backdrop-blur-md transition-all shadow-xs"
              >
                <div className="w-5 h-5 rounded-md bg-teal-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openModal('auth')}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl border border-white/25 text-white hover:bg-white/20 bg-white/10 text-xs font-semibold backdrop-blur-md transition-all shadow-xs cursor-pointer"
                aria-label="Se connecter"
              >
                <User className="w-3.5 h-3.5 text-white/90" />
                <span className="hidden sm:inline">Se connecter</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Conteneur centré verticalement : 100% visible sans scroll */}
      <main className="flex-1 min-h-0 flex flex-col justify-center max-w-4xl w-full mx-auto px-4 sm:px-6 py-2 relative z-10">
        {errorMessage && (
          <div className="mb-2.5 p-2.5 rounded-xl bg-rose-50/95 backdrop-blur-md border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fadeIn shadow-lg shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold leading-tight">{errorMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* ÉTAPE 1 : DÉCOUVERTE                                      */}
        {/* ========================================================= */}
        {step === 1 && (
          <div className="space-y-4 sm:space-y-5 animate-fadeIn">
            <div className="text-center space-y-1.5 sm:space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Bienvenue en Martinique · Madinina</span>
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                Créez votre compte Martinique Explorer
              </h1>
              <p className="text-xs sm:text-sm text-white/90 max-w-xl mx-auto leading-relaxed drop-shadow-xs">
                Martinique Explorer réunit les plus belles pépites secrètes, la météo des plages en direct et un profil personnalisé pour vivre l&apos;île comme un initié.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 shadow-xl space-y-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center text-lg shadow-2xs">
                  🏖️
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  40+ Trésors de l&apos;île
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Des criques de sable blanc du Sud aux anses volcaniques du Nord, avec accès GPS et conseils authentiques.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 shadow-xl space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center text-lg shadow-2xs">
                  🌊
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Météo des Plages & Sargasses
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Relevés météo et état de la mer en direct pour choisir la baignade idéale chaque matin sans mauvaise surprise.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 shadow-xl space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-lg shadow-2xs">
                  🧭
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Badges & Sceaux de l&apos;île
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enregistrez vos favoris, gagnez des points d&apos;exploration (XP) et débloquez les 6 sceaux officiels de l&apos;île.
                </p>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 flex items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-800 text-white flex items-center justify-center text-xs font-extrabold shrink-0 shadow-xs">
                  +30
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    Bonus de bienvenue : +30 points XP offerts
                  </h4>
                  <p className="text-[11px] text-slate-600 truncate">
                    Complétez votre profil en 1 minute pour activer votre compte.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>Créer mon compte</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ÉTAPE 2 : IDENTIFIANTS                                    */}
        {/* ========================================================= */}
        {step === 2 && (
          <div className="max-w-md w-full mx-auto bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/50 shadow-2xl space-y-3.5 animate-fadeIn">
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
        {/* ÉTAPE 3 : PRÉFÉRENCES (Parcours interactif en 4 slides fluides & immersifs) */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="max-w-2xl sm:max-w-3xl w-full mx-auto bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/50 shadow-2xl space-y-3.5 animate-fadeIn">
            {/* Header avec indicateur de sous-étapes et barre de progression 4 crans */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Personnalisation du compte · Étape {prefSubStep} sur 4</span>
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {prefSubStep === 1 && '1. Votre profil'}
                  {prefSubStep === 2 && '2. Camp de base'}
                  {prefSubStep === 3 && '3. Vos envies'}
                  {prefSubStep === 4 && '4. Photo de profil'}
                </span>
              </div>

              {/* Barre de progression cliquable */}
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      if (num <= maxPrefSubStep) setPrefSubStep(num as 1 | 2 | 3 | 4);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      num <= prefSubStep
                        ? 'bg-teal-700 shadow-xs'
                        : num <= maxPrefSubStep
                        ? 'bg-teal-200 hover:bg-teal-300'
                        : 'bg-stone-200'
                    }`}
                    aria-label={`Étape ${num}`}
                  />
                ))}
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* SLIDE 1 : VOTRE PROFIL VOYAGEUR                               */}
            {/* ------------------------------------------------------------- */}
            {prefSubStep === 1 && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="space-y-0.5">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    Quel type d&apos;explorateur êtes-vous ?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pour adapter vos suggestions d&apos;itinéraires et de spots au fil de vos journées.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                  {TRAVELER_PROFILES.map(p => {
                    const active = travelerType === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setTravelerType(p.id)}
                        className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 group ${
                          active
                            ? 'bg-teal-50/80 border-teal-700 text-teal-950 shadow-sm ring-2 ring-teal-700/20'
                            : 'bg-stone-50/70 border-stone-200/90 text-slate-700 hover:bg-stone-100/70'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-white border border-stone-200/70 shadow-2xs flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                          {p.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                            {p.label}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {p.subtitle}
                          </p>
                        </div>
                        {active && (
                          <div className="w-5 h-5 rounded-full bg-teal-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

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
                    onClick={() => goToPrefSubStep(2)}
                    className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continuer vers ma commune</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* SLIDE 2 : VOTRE CAMP DE BASE (COMMUNE)                        */}
            {/* ------------------------------------------------------------- */}
            {prefSubStep === 2 && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="space-y-0.5">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    Où séjournez-vous en Martinique ?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Votre camp de base pour calculer les distances, vos plages proches et la météo locale.
                  </p>
                </div>

                <div className="space-y-2.5 pt-0.5">
                  {/* Barre de recherche avec autocomplétion */}
                  <div className="space-y-1 relative" ref={communeDropdownRef}>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                        placeholder="Rechercher parmi les 34 communes (ex : Sainte-Anne, Les Trois-Îlets...)"
                        className="w-full text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:bg-white transition-all outline-none"
                        autoFocus
                      />
                      {communeSearch && (
                        <button
                          type="button"
                          onClick={() => {
                            setCommuneSearch('');
                            setIsCommuneDropdownOpen(true);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Dropdown autocomplétion */}
                    {isCommuneDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-2xl bg-white border border-stone-200 shadow-2xl z-50 p-1 divide-y divide-stone-100">
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
                                className={`w-full px-3 py-2 text-xs text-left rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                                  isSelected
                                    ? 'bg-teal-800 text-white font-bold'
                                    : 'text-slate-700 hover:bg-teal-50 hover:text-teal-900'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-3.5 h-3.5 opacity-70" />
                                  <span>{commune}</span>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </button>
                            );
                          })
                        ) : (
                          <div className="p-3 text-center text-xs text-slate-400">
                            Aucune commune trouvée pour « {communeSearch} »
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pill sélectionnée en évidence */}
                  <div className="p-2.5 rounded-xl bg-teal-50/80 border border-teal-200/80 flex items-center justify-between text-xs text-teal-950 font-semibold">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-800 shrink-0" />
                      <span>Camp de base actif : <strong>{baseCommune}</strong></span>
                    </div>
                    <span className="text-[10px] text-teal-800 bg-white px-2 py-0.5 rounded-full border border-teal-200/60 font-bold">
                      Confirmé ✓
                    </span>
                  </div>

                  {/* Raccourcis communes phares */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Suggestions rapides :
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {POPULAR_COMMUNES.map(com => (
                        <button
                          key={com}
                          type="button"
                          onClick={() => {
                            setBaseCommune(com);
                            setCommuneSearch(com);
                            setIsCommuneDropdownOpen(false);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            baseCommune === com
                              ? 'bg-teal-800 text-white font-bold shadow-2xs'
                              : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                          }`}
                        >
                          {com}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => goToPrefSubStep(1)}
                    className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-slate-600 hover:bg-stone-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Profil</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => goToPrefSubStep(3)}
                    className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continuer vers mes envies</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* SLIDE 3 : VOS ENVIES PRIORITAIRES                            */}
            {/* ------------------------------------------------------------- */}
            {prefSubStep === 3 && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                      Vos envies prioritaires sur l&apos;île
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cochez tout ce que vous avez envie de vivre (au moins une).
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60 shrink-0">
                    {selectedInterests.length} sélectionnée(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                  {INTEREST_TILES.map(tile => {
                    const Icon = tile.icon;
                    const active = selectedInterests.includes(tile.id);
                    return (
                      <button
                        key={tile.id}
                        type="button"
                        onClick={() => toggleInterest(tile.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 group ${
                          active
                            ? 'bg-teal-50/80 border-teal-700 text-teal-950 font-bold shadow-2xs'
                            : 'bg-stone-50/70 border-stone-200/90 text-slate-700 hover:bg-stone-100/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${tile.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-semibold leading-tight truncate">
                            {tile.label}
                          </span>
                        </div>
                        {active ? (
                          <div className="w-5 h-5 rounded-full bg-teal-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-stone-300 group-hover:border-stone-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => goToPrefSubStep(2)}
                    className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-slate-600 hover:bg-stone-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Commune</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => goToPrefSubStep(4)}
                    className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continuer vers ma photo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* SLIDE 4 : PHOTO DE PROFIL & VALIDATION FINALE                 */}
            {/* ------------------------------------------------------------- */}
            {prefSubStep === 4 && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="space-y-0.5">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    Votre photo de profil
                  </h3>
                  <p className="text-xs text-slate-500">
                    Choisissez un spot emblématique de Madinina ou importez votre propre photo.
                  </p>
                </div>

                {/* Section interactive avatar avec dimensions strictement verrouillées */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center pt-1">
                  {/* Aperçu à gauche (4/12) - Hauteur strictement fixe et stable */}
                  <div className="sm:col-span-4 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col items-center text-center space-y-2">
                    {/* Cadre de prévisualisation : taille strictly locked à h-28 w-full */}
                    <div className="w-full h-28 rounded-2xl overflow-hidden bg-teal-800 text-white flex items-center justify-center shadow-md border-2 border-white ring-2 ring-teal-700/20 relative shrink-0">
                      {avatarPhoto ? (
                        <img
                          src={avatarPhoto}
                          alt="Avatar sélectionné"
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-teal-800 text-white">
                          <span className="text-3xl font-extrabold">{name ? name.charAt(0).toUpperCase() : 'N'}</span>
                          <span className="text-[10px] text-teal-200 uppercase font-semibold tracking-wider mt-0.5">Initiales</span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 w-full space-y-0.5">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {name || 'Explorateur'}
                      </p>
                      <p className="text-[11px] text-teal-800 font-semibold truncate">
                        {travelerType}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        📍 {baseCommune}
                      </p>
                    </div>

                    {/* Bouton pour importer une photo */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleCustomPhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-1.5 px-2 rounded-xl bg-white border border-stone-200/90 hover:border-teal-700 text-slate-700 hover:text-teal-900 text-[11px] font-semibold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Camera className="w-3.5 h-3.5 text-teal-700" />
                      <span>Importer ma photo</span>
                    </button>
                  </div>

                  {/* Choix des vignettes de spots (8/12) */}
                  <div className="sm:col-span-8 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-600 block">
                      Ou choisissez un spot officiel de l&apos;île :
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {AVATAR_PRESETS.map(preset => {
                        const isSelected = avatarPhoto === preset.url;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setAvatarPhoto(preset.url)}
                            className={`group p-1.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                              isSelected
                                ? 'border-teal-700 bg-teal-50 ring-2 ring-teal-700/20 shadow-2xs'
                                : 'border-stone-200/80 bg-white hover:border-stone-300 hover:bg-stone-50'
                            }`}
                          >
                            <div className="w-full h-12 rounded-lg overflow-hidden bg-teal-800 text-white flex items-center justify-center font-bold text-sm relative shrink-0">
                              {preset.url ? (
                                <img
                                  src={preset.url}
                                  alt={preset.label}
                                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <span className="text-base font-extrabold text-white">{name ? name.charAt(0).toUpperCase() : 'N'}</span>
                              )}
                              {isSelected && (
                                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-teal-800 text-white flex items-center justify-center shadow-xs">
                                  <Check className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>
                            <span className={`text-[11px] font-bold truncate leading-tight w-full text-center ${
                              isSelected ? 'text-teal-950' : 'text-slate-700'
                            }`}>
                              {preset.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Validation finale */}
                <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => goToPrefSubStep(3)}
                    className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-slate-600 hover:bg-stone-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Envies</span>
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
                        <span>Création du compte...</span>
                      </>
                    ) : (
                      <>
                        <span>Valider & Créer mon compte (+30 XP)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. Footer minimaliste 1 ligne */}
      <footer className="py-2.5 text-center text-[11px] text-white/70 shrink-0 relative z-10 drop-shadow-xs">
        Martinique Explorer · Plateforme éco-responsable & solidaire de Madinina
      </footer>
    </div>
  );
}
