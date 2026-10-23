'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Compass,
  Waves,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ShieldCheck,
  Heart,
  Award,
  Sun,
  Fish,
  Mountain,
  Utensils,
  Sailboat,
  Flame,
  Camera,
  MapPin,
  Loader2
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import LogoIcon from '@/components/ui/LogoIcon';
import { MARTINIQUE_COMMUNES } from '@/data/communes';

// Options de profil synchronisées avec le carnet / compte
const TRAVELER_PROFILES = [
  {
    id: 'Voyageur en séjour',
    label: 'Voyageur en séjour',
    icon: '🌴',
    tagline: 'Vacances & découverte des plages, cascades et criques sauvages.'
  },
  {
    id: 'Habitant de Martinique',
    label: 'Habitant de Martinique',
    icon: '🌺',
    tagline: 'Je vis ici et je partage mes conseils, météo et spots préservés.'
  },
  {
    id: 'Saisonnier / Expatrié',
    label: 'Saisonnier / Expatrié',
    icon: '⛵',
    tagline: 'En mission, télétravail ou séjour prolongé sur l’île aux fleurs.'
  },
  {
    id: 'Futur résident / Retraite',
    label: 'Futur résident / Retraite',
    icon: '🌅',
    tagline: 'Je prépare mon installation ou une transition vers la vie sous les tropiques.'
  }
];

const INTEREST_TILES = [
  { id: 'Plages de sable blanc', label: 'Plages de sable blanc', icon: Sun, color: 'text-amber-500 bg-amber-50' },
  { id: 'Snorkeling & tortues', label: 'Snorkeling & tortues', icon: Fish, color: 'text-teal-600 bg-teal-50' },
  { id: 'Randonnées & rivières', label: 'Randonnées & rivières', icon: Mountain, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'Tables de bord de mer', label: 'Tables de bord de mer', icon: Utensils, color: 'text-rose-500 bg-rose-50' },
  { id: 'Fonds blancs & îlets', label: 'Fonds blancs & îlets', icon: Sailboat, color: 'text-sky-600 bg-sky-50' },
  { id: 'Anses volcaniques du Nord', label: 'Anses volcaniques du Nord', icon: Flame, color: 'text-stone-700 bg-stone-100' },
  { id: 'Distilleries & rhums AOC', label: 'Distilleries & rhums AOC', icon: Award, color: 'text-amber-700 bg-amber-50' },
  { id: 'Couchers de soleil & points de vue', label: 'Couchers de soleil & belvédères', icon: Camera, color: 'text-orange-600 bg-orange-50' }
];

const POPULAR_COMMUNES = [
  'Les Trois-Îlets',
  'Sainte-Luce',
  'Sainte-Anne',
  'Le Diamant',
  'Les Anses-d’Arlet',
  'La Trinité (Tartane)',
  'Le Carbet',
  'Le François'
];

export default function InscriptionPage() {
  const router = useRouter();
  const { signup, login, addPoints, openModal } = useApp();

  // Navigation par étape (1: Découverte, 2: Identifiants, 3: Préférences)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Formulaire Identifiants
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Pré-remplissage du profil
  const [travelerType, setTravelerType] = useState('Voyageur en séjour');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Plages de sable blanc',
    'Snorkeling & tortues',
    'Tables de bord de mer'
  ]);
  const [baseCommune, setBaseCommune] = useState('Sainte-Luce');

  // États de validation
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      // 1. Création du compte dans Supabase / AppContext
      const cleanEmail = email.trim().toLowerCase();
      const res = await signup(name.trim(), cleanEmail, password);

      if (!res.success) {
        setErrorMessage(res.error || 'Erreur lors de la création du compte.');
        setIsLoading(false);
        setStep(2); // Ramène à l'étape des identifiants en cas d'erreur
        return;
      }

      // 2. Déterminer le secteur favori à partir de la commune choisie
      let sector: 'Sud Caraïbe' | 'Extrême Sud' | 'Nord Volcanique' | 'Côte Atlantique' = 'Sud Caraïbe';
      if (['Sainte-Anne', 'Sainte-Luce', 'Le Marin', 'Rivière-Pilote'].includes(baseCommune)) {
        sector = 'Extrême Sud';
      } else if (['Le Carbet', 'Saint-Pierre', 'Le Prêcheur', "Grand'Rivière", 'Macouba'].includes(baseCommune)) {
        sector = 'Nord Volcanique';
      } else if (['La Trinité', 'Le Robert', 'Le François', 'Le Vauclin', 'Sainte-Marie'].includes(baseCommune)) {
        sector = 'Côte Atlantique';
      }

      // 3. Sauvegarder immédiatement les préférences personnalisées dans localStorage
      const userPrefs = {
        travelerType,
        baseCommune,
        favoriteSector: sector,
        bio: `Explorateur en Martinique basé à ${baseCommune}. Passionné par : ${selectedInterests.slice(0, 2).join(', ')}.`,
        avatarPhoto: '',
        interests: selectedInterests.length > 0 ? selectedInterests : ['Plages de sable blanc', 'Snorkeling & tortues']
      };

      try {
        localStorage.setItem('mq_account_prefs_v2', JSON.stringify(userPrefs));
        localStorage.setItem('mq_profile_reward_claimed', '1');
      } catch (e) {
        // Ignore in private browsing
      }

      // 4. Bonus d'exploration de bienvenue (+30 XP pour la personnalisation du profil)
      addPoints(30);

      // 5. Redirection vers la page compte avec onglet profil pré-rempli
      setTimeout(() => {
        router.push('/compte?tab=settings&welcome=1');
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur inattendue est survenue.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* 1. Top Navbar Minimaliste & Élégante */}
      <header className="border-b border-stone-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <LogoIcon className="w-9 h-9" />
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 block leading-tight">
                Martinique Explorer
              </span>
              <span className="text-[10px] text-teal-800 font-semibold tracking-wider uppercase block">
                Carnet de Voyage Officiel
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">Déjà inscrit ?</span>
            <button
              type="button"
              onClick={() => openModal('auth')}
              className="px-3.5 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-slate-700 hover:text-teal-900 hover:border-teal-700 hover:bg-stone-50 transition-all cursor-pointer"
            >
              Se connecter
            </button>
          </div>
        </div>
      </header>

      {/* 2. Barre d'avancement des étapes */}
      <div className="bg-white/60 border-b border-stone-200/60 py-3">
        <div className="max-w-xl mx-auto px-4 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                step === 1 ? 'bg-teal-800 text-white' : 'bg-teal-100 text-teal-900'
              }`}
            >
              {step > 1 ? '✓' : '1'}
            </span>
            <span className={step === 1 ? 'text-slate-900 font-bold' : 'text-slate-500'}>
              Découverte
            </span>
          </div>

          <div className="h-0.5 flex-1 mx-3 bg-stone-200/80 max-w-[60px]" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                step === 2 ? 'bg-teal-800 text-white' : step > 2 ? 'bg-teal-100 text-teal-900' : 'bg-stone-200 text-slate-500'
              }`}
            >
              {step > 2 ? '✓' : '2'}
            </span>
            <span className={step === 2 ? 'text-slate-900 font-bold' : 'text-slate-500'}>
              Identifiants
            </span>
          </div>

          <div className="h-0.5 flex-1 mx-3 bg-stone-200/80 max-w-[60px]" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                step === 3 ? 'bg-teal-800 text-white' : 'bg-stone-200 text-slate-500'
              }`}
            >
              3
            </span>
            <span className={step === 3 ? 'text-slate-900 font-bold' : 'text-slate-500'}>
              Préférences
            </span>
          </div>
        </div>
      </div>

      {/* 3. Corps du formulaire avec transitions épurées */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {/* Bandeau d'erreur s'il existe */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-fadeIn shadow-2xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* ÉTAPE 1 : BIENVENUE & PRÉSENTATION DE MARTINIQUE EXPLORER  */}
        {/* ========================================================= */}
        {step === 1 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Chaleureux */}
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Bienvenue en Martinique · Madinina</span>
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Votre carnet d’exploration commence ici
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
                Martinique Explorer réunit les plus belles pépites secrètes, la météo des plages en direct et un carnet de voyage sur-mesure pour vivre l&apos;île comme un initié.
              </p>
            </div>

            {/* 3 Cartes piliers visuelles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2.5 hover:border-teal-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center text-xl">
                  🏖️
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  40+ Trésors de l&apos;île
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Des criques de sable blanc du Sud aux anses volcaniques du Nord, avec accès GPS et conseils authentiques.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2.5 hover:border-teal-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center text-xl">
                  🌊
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Météo des Plages & Sargasses
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Relevés météo et état de la mer en direct pour choisir la baignade idéale chaque matin sans mauvaise surprise.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2.5 hover:border-teal-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-xl">
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

            {/* Avantage immédiat & Bouton d'action */}
            <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-800 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  +30
                </div>
                <div>
                  <h4 className="text-xs font-bold text-teal-950">
                    Bonus de bienvenue : +30 points XP offerts
                  </h4>
                  <p className="text-[11px] text-teal-800">
                    Complétez votre profil en 1 minute pour activer votre carnet d&apos;explorateur.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Créer mon carnet d&apos;exploration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ÉTAPE 2 : IDENTIFIANTS DU COMPTE                          */}
        {/* ========================================================= */}
        {step === 2 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xl space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                Étape 2 sur 3
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Créez vos identifiants
              </h2>
              <p className="text-xs text-slate-500">
                Vos informations vous permettent de retrouver vos favoris et votre progression sur tous vos appareils.
              </p>
            </div>

            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Prénom & Nom
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex : Nathan Martin"
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:bg-white transition-all outline-none"
                    required
                    autoFocus
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:bg-white transition-all outline-none"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Mot de passe
                  </label>
                  <span className="text-[11px] text-slate-400">6 caractères minimum</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs sm:text-sm pl-10 pr-10 py-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:bg-white transition-all outline-none"
                    required
                    minLength={6}
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    aria-label="Afficher le mot de passe"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-slate-600 hover:bg-stone-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Continuer vers mes préférences</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* ÉTAPE 3 : PRÉ-REMPLISSAGE DU PROFIL                       */}
        {/* ========================================================= */}
        {step === 3 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xl space-y-7 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                Étape 3 sur 3 · Pré-remplissage du carnet
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Personnalisez vos préférences de voyage
              </h2>
              <p className="text-xs text-slate-500">
                Ces informations pré-remplissent votre profil et adaptent vos recommandations d&apos;adresses.
              </p>
            </div>

            {/* 1. Profil voyageur */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Votre profil d&apos;explorateur
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TRAVELER_PROFILES.map(p => {
                  const active = travelerType === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setTravelerType(p.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        active
                          ? 'bg-teal-50/70 border-teal-700 shadow-2xs ring-1 ring-teal-700/20'
                          : 'bg-[#FAF8F5] border-stone-200/80 hover:border-stone-300'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{p.icon}</span>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{p.label}</h4>
                          {active && <Check className="w-3.5 h-3.5 text-teal-800" />}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">{p.tagline}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Activités & centres d'intérêt favoris */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Vos envies prioritaires sur l&apos;île
                </label>
                <span className="text-[11px] text-slate-500">
                  {selectedInterests.length} sélectionnée(s)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {INTEREST_TILES.map(tile => {
                  const Icon = tile.icon;
                  const active = selectedInterests.includes(tile.id);
                  return (
                    <button
                      key={tile.id}
                      type="button"
                      onClick={() => toggleInterest(tile.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        active
                          ? 'bg-teal-50 border-teal-700 text-teal-950 font-semibold shadow-2xs'
                          : 'bg-stone-50 border-stone-200/80 text-slate-600 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${tile.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {active && <Check className="w-3.5 h-3.5 text-teal-800" />}
                      </div>
                      <span className="text-[11px] leading-tight font-medium">
                        {tile.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Camp de base / commune */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Votre camp de base (ou commune coup de cœur)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_COMMUNES.map(com => {
                  const active = baseCommune === com;
                  return (
                    <button
                      key={com}
                      type="button"
                      onClick={() => setBaseCommune(com)}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                        active
                          ? 'bg-teal-800 text-white font-semibold shadow-2xs'
                          : 'bg-stone-100 text-slate-700 hover:bg-stone-200 border border-stone-200/60'
                      }`}
                    >
                      {com}
                    </button>
                  );
                })}
              </div>

              {/* Sélection libre parmi toutes les communes */}
              <div className="pt-1.5 flex items-center gap-2">
                <span className="text-[11px] text-slate-500 shrink-0">Autre commune :</span>
                <select
                  value={baseCommune}
                  onChange={e => setBaseCommune(e.target.value)}
                  className="text-xs py-1.5 px-3 rounded-xl border border-stone-300 bg-white text-slate-800 outline-none focus:border-teal-700"
                >
                  {MARTINIQUE_COMMUNES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Récapitulatif du bonus & validation finale */}
            <div className="pt-2 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-slate-600 hover:bg-stone-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Modifier identifiants</span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleFinalSubmit}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Création & configuration en cours...</span>
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

      {/* 4. Footer minimaliste */}
      <footer className="py-6 border-t border-stone-200/70 text-center text-xs text-slate-500">
        <p>
          Martinique Explorer · Carnet de voyage éco-responsable & solidaire de Madinina
        </p>
      </footer>
    </div>
  );
}
