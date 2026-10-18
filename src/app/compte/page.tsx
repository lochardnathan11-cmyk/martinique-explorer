'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Heart,
  Settings,
  MapPin,
  Star,
  ExternalLink,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Shield,
  LogOut,
  Compass,
  Mail,
  Lock,
  Award,
  Globe,
  Camera,
  Sparkles,
  Check
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CustomSelect from '@/components/ui/CustomSelect';
import { MARTINIQUE_COMMUNES } from '@/data/communes';
import { ChevronRight } from 'lucide-react';

type AccountTab = 'favorites' | 'settings';

interface UserPreferences {
  travelerType: 'Voyageur en séjour' | 'Habitant de Martinique' | 'Saisonnier / Expatrié' | 'Futur résident / Retraite';
  baseCommune: string;
  favoriteSector: 'Sud Caraïbe' | 'Extrême Sud' | 'Nord Volcanique' | 'Côte Atlantique';
  bio: string;
  avatarPhoto: string;
  interests: string[];
}

const AVATAR_PRESETS = [
  { id: 'initials', label: 'Initiales', url: '' },
  { id: 'salines', label: 'Les Salines', url: '/images/spots/salines.jpg' },
  { id: 'dufour', label: 'Anse Dufour', url: '/images/spots/anse-dufour.jpg' },
  { id: 'diamant', label: 'Le Diamant', url: '/images/spots/diamant.jpg' },
  { id: 'pelee', label: 'Montagne Pelée', url: '/images/spots/montagne-pelee-vue.jpg' },
  { id: 'arlet', label: 'Anses-d’Arlet', url: '/images/spots/ponton-anses-arlet.jpg' }
];

const INTEREST_OPTIONS = [
  '🏖️ Plages de sable blanc',
  '🐢 Snorkeling & Tortues',
  '🥾 Randonnées & Cascades',
  '🍽️ Restaurants de plage',
  '⛵ Fonds Blancs & Îlets',
  '🌋 Plages de sable noir',
  '🥃 Distilleries & Rhums AOC',
  '📸 Panoramas & Couchers de soleil'
];

const DEFAULT_PREFS: UserPreferences = {
  travelerType: 'Voyageur en séjour',
  baseCommune: 'Sainte-Luce',
  favoriteSector: 'Sud Caraïbe',
  bio: 'Amateur de belles anses calmes, de snorkeling matinal aux Anses-d’Arlet et de cuisine créole.',
  avatarPhoto: '',
  interests: ['🏖️ Plages de sable blanc', '🐢 Snorkeling & Tortues', '🍽️ Restaurants de plage']
};

const CATEGORY_NAMES: Record<string, string> = {
  beach: 'Plage',
  snorkeling: 'Snorkeling',
  activity: 'Activité',
  hiking: 'Randonnée',
  excursion: 'Sortie en mer',
  restaurant: 'Restaurant',
  accommodation: 'Hébergement',
  bar: 'Bar & Lounge',
  hidden_gem: 'Crique secrète'
};

export default function UserAccountPage() {
  const router = useRouter();
  const {
    currentUser,
    userRole,
    login,
    signup,
    updateUserProfile,
    logout,
    favorites,
    toggleFavorite,
    places,
    userPoints,
    badges,
    language,
    setLanguage
  } = useApp();

  const [activeTab, setActiveTab] = useState<AccountTab>('favorites');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Auth form states (when visitor is not logged in)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Profile preferences
  const [nameInput, setNameInput] = useState('');
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (currentUser) {
      setNameInput(currentUser.name || '');
    }
    try {
      const savedPrefs = localStorage.getItem('mq_account_prefs_v2');
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        setPrefs({
          ...DEFAULT_PREFS,
          ...parsed,
          interests: Array.isArray(parsed.interests) ? parsed.interests : DEFAULT_PREFS.interests
        });
      }
    } catch {
      // Ignore in SSR
    }
  }, [currentUser]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleNavSection = (sec: string) => {
    if (sec === 'home') router.push('/');
    else router.push(`/?page=${encodeURIComponent(sec)}`);
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const res = await login(authEmail, authPassword || undefined);
        if (res.success) {
          showToast('Connexion réussie.');
        } else {
          showToast(res.error || 'Identifiants incorrects.', 'error');
        }
      } else {
        const res = await signup(authName || 'Voyageur', authEmail, authPassword || undefined);
        if (res.success) {
          showToast('Compte créé avec succès.');
        } else {
          showToast(res.error || 'Erreur lors de la création.', 'error');
        }
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setIsSaving(true);
    try {
      const res = await updateUserProfile(nameInput.trim());
      try {
        localStorage.setItem('mq_account_prefs_v2', JSON.stringify(prefs));
      } catch {
        // ignore
      }
      if (res.success) {
        showToast('Vos informations et préférences ont bien été enregistrées.');
      } else {
        showToast(res.error || 'Erreur lors de la sauvegarde.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setPrefs(prev => {
      const exists = prev.interests.includes(interest);
      const next = exists
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: next };
    });
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Lieux favoris filtrés
  const favoritePlaces = places.filter(p => favorites.includes(p.id));
  const filteredFavorites = favoritePlaces.filter(p => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'beach') return p.category === 'beach' || p.category === 'hidden_gem';
    if (categoryFilter === 'snorkeling') return p.category === 'snorkeling';
    if (categoryFilter === 'nature') return p.category === 'hiking' || p.category === 'activity' || p.category === 'excursion';
    if (categoryFilter === 'food') return p.category === 'restaurant' || p.category === 'bar' || p.category === 'accommodation';
    return true;
  });

  const unlockedBadges = badges.filter(b => b.unlocked || userPoints >= b.requiredPoints);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900">
      {/* Toast de notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-5 z-[1100] px-4 py-3 rounded-xl shadow-lg text-white text-xs sm:text-sm font-medium flex items-center gap-2.5 transition-all ${
            toastMessage.type === 'error' ? 'bg-rose-700' : 'bg-teal-800'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-200" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-200" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Vraie barre de navigation principale du site */}
      <Navbar activeSection="compte" setActiveSection={handleNavSection} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full space-y-6 text-left">
        {/* Fil d'Ariane + Actions rapides (Retour & Déconnexion) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200/80 text-xs">
          <nav className="flex items-center gap-2 text-slate-500">
            <Link href="/" className="hover:text-teal-700 transition-colors font-medium">
              Accueil
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-900 font-semibold">Mon Compte</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Page précédente</span>
            </button>

            {userRole === 'admin' && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-semibold hover:bg-amber-100 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>Administration</span>
              </Link>
            )}

            {currentUser && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 font-medium transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            )}
          </div>
        </div>
        {/* NON CONNECTÉ : Formulaire direct et simple */}
        {!currentUser ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-xs my-8">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mx-auto border border-teal-200/60">
                <User className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                Mon Espace Membre
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connectez-vous pour retrouver vos plages et adresses favorites en Martinique.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`py-2 rounded-lg transition-colors cursor-pointer ${
                  authMode === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`py-2 rounded-lg transition-colors cursor-pointer ${
                  authMode === 'signup' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Nouveau compte
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Prénom & Nom</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    placeholder="Ex: Sophie Martin"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-700"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Adresse email
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-700"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {authLoading ? 'Chargement...' : authMode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => login('voyageur@martinique-explorer.com')}
                className="text-xs text-teal-800 hover:text-teal-900 font-semibold underline cursor-pointer"
              >
                Continuer sans mot de passe (mode visiteur)
              </button>
            </div>
          </div>
        ) : (
          /* CONNECTÉ : Interface large, élégante et complète */
          <>
            {/* 1. Bandeau de profil découpé en 2 : 1/3 Carte à gauche + 2/3 Panorama & Secteur à droite */}
            <section className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs relative">
              {(() => {
                // Coordonnées de la commune sur la carte SVG (viewBox 0 0 210 220)
                const communeCoords: Record<string, { x: number; y: number }> = {
                  "Grand'Rivière": { x: 46, y: 20 },
                  'Macouba': { x: 58, y: 22 },
                  'Basse-Pointe': { x: 68, y: 26 },
                  'Le Prêcheur': { x: 32, y: 36 },
                  "L'Ajoupa-Bouillon": { x: 64, y: 38 },
                  'Le Lorrain': { x: 84, y: 38 },
                  'Le Morne-Rouge': { x: 56, y: 48 },
                  'Saint-Pierre': { x: 42, y: 56 },
                  'Le Marigot': { x: 98, y: 48 },
                  'Fonds-Saint-Denis': { x: 58, y: 64 },
                  'Sainte-Marie': { x: 112, y: 58 },
                  'Le Carbet': { x: 42, y: 74 },
                  'Le Morne-Vert': { x: 52, y: 76 },
                  'Gros-Morne': { x: 96, y: 74 },
                  'La Trinité': { x: 128, y: 70 },
                  'Bellefontaine': { x: 48, y: 86 },
                  'Case-Pilote': { x: 56, y: 96 },
                  'Saint-Joseph': { x: 86, y: 94 },
                  'Le Robert': { x: 134, y: 92 },
                  'Schœlcher': { x: 68, y: 108 },
                  'Fort-de-France': { x: 82, y: 116 },
                  'Le Lamentin': { x: 104, y: 116 },
                  'Le François': { x: 146, y: 114 },
                  'Ducos': { x: 114, y: 132 },
                  'Le Saint-Esprit': { x: 132, y: 136 },
                  'Rivière-Salée': { x: 112, y: 148 },
                  'Les Trois-Îlets': { x: 88, y: 144 },
                  'Le Vauclin': { x: 164, y: 144 },
                  "Les Anses-d'Arlet": { x: 76, y: 160 },
                  'Le Diamant': { x: 98, y: 170 },
                  'Rivière-Pilote': { x: 134, y: 160 },
                  'Sainte-Luce': { x: 128, y: 174 },
                  'Le Marin': { x: 154, y: 172 },
                  'Sainte-Anne': { x: 158, y: 192 }
                };
                const pin = communeCoords[prefs.baseCommune] || { x: 128, y: 174 };

                const sectorShowcases: Record<
                  UserPreferences['favoriteSector'],
                  {
                    image: string;
                    headline: string;
                    subtitle: string;
                    waterTemp: string;
                    seaState: string;
                    highlight: string;
                  }
                > = {
                  'Sud Caraïbe': {
                    image: '/images/spots/anse-dufour.jpg',
                    headline: 'Anses-d’Arlet, Anse Dufour & Rocher du Diamant',
                    subtitle:
                      'Anses abritées aux eaux limpides, herbiers fréquentés par les tortues vertes et couchers de soleil face au Diamant.',
                    waterTemp: '28°C',
                    seaState: 'Mer calme · Visibilité 18 m',
                    highlight: 'Snorkeling & anses de sable clair'
                  },
                  'Extrême Sud': {
                    image: '/images/spots/salines.jpg',
                    headline: 'Grande Anse des Salines & Lagon de Sainte-Anne',
                    subtitle:
                      'Grands rubans de sable blanc bordés de cocotiers, eaux turquoise peu profondes et sentier côtier de la Savane des Pétrifications.',
                    waterTemp: '28°C',
                    seaState: 'Lagon paisible · Alizé doux',
                    highlight: 'Grandes plages & lagon turquoise'
                  },
                  'Nord Volcanique': {
                    image: '/images/spots/montagne-pelee-vue.jpg',
                    headline: 'Montagne Pelée, Saint-Pierre & Anse Couleuvre',
                    subtitle:
                      'Reliefs classés à l’UNESCO, criques sauvages de sable noir volcanique, cascades en forêt tropicale et récifs coralliens.',
                    waterTemp: '27°C',
                    seaState: 'Eau claire · Brise de montagne',
                    highlight: 'Randonnées & plages volcaniques'
                  },
                  'Côte Atlantique': {
                    image: '/images/spots/baignoire-josephine.jpg',
                    headline: 'Presqu’île de la Caravelle & Fonds Blancs du François',
                    subtitle:
                      'Hauts-fonds de sable blanc en pleine mer protégés par la barrière de corail, îlets sauvages et réserve naturelle de la Caravelle.',
                    waterTemp: '28°C',
                    seaState: 'Barrière récifale · Alizé régulier',
                    highlight: 'Fonds blancs, îlets & kayak'
                  }
                };

                const currentShowcase =
                  sectorShowcases[prefs.favoriteSector] || sectorShowcases['Sud Caraïbe'];

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[176px] sm:min-h-[192px]">
                    {/* PREMIER TIERS À GAUCHE (1/3) : Carte de la Martinique */}
                    <div className="lg:col-span-1 relative bg-[#062E3B] lg:border-r border-b lg:border-b-0 border-white/15 px-5 py-4 flex items-center justify-between gap-3 overflow-hidden">
                      {/* Grille nautique en fond du 1/3 gauche */}
                      <svg
                        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <pattern id="mq-grid-left" width="36" height="36" patternUnits="userSpaceOnUse">
                            <path
                              d="M 36 0 L 0 0 0 36"
                              fill="none"
                              stroke="#BFEFF2"
                              strokeWidth="0.6"
                              strokeDasharray="2 3"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#mq-grid-left)" />
                      </svg>

                      {/* Légende & repère commune à gauche de la carte */}
                      <div className="relative z-10 flex flex-col justify-between h-full space-y-3 py-0.5">
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-teal-300">
                            <Compass className="w-3.5 h-3.5" />
                            <span>Carte de l&apos;île</span>
                          </div>
                          <p className="text-[11px] font-mono text-teal-100/60">
                            14°38&apos;N · 61°01&apos;W
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-teal-200/70 font-semibold block">
                            Votre point d&apos;ancrage
                          </span>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                            <span className="truncate">{prefs.baseCommune}</span>
                          </div>
                          <span className="text-[11px] text-teal-200/80 block">
                            {prefs.favoriteSector}
                          </span>
                        </div>
                      </div>

                      {/* Silhouette complète de la Martinique (non coupée) */}
                      <div className="relative z-10 shrink-0 flex items-center justify-center pr-1">
                        <svg
                          viewBox="0 0 215 220"
                          className="w-36 h-36 sm:w-40 sm:h-40 drop-shadow-[0_6px_16px_rgba(0,0,0,0.4)]"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Halo du lagon */}
                          <path
                            d="M42 15 L64 17 L88 30 L114 50 L128 64 L158 55 L173 57 L166 65 L144 69 L138 88 L156 108 L168 122 L178 145 L181 175 L178 194 L164 206 L156 192 L160 176 L136 175 L102 172 L74 160 L78 144 L92 140 L112 136 L110 124 L82 120 L60 104 L42 78 L40 60 L25 36 L29 20 Z"
                            stroke="#5EEAD4"
                            strokeOpacity="0.22"
                            strokeWidth="8"
                            strokeLinejoin="round"
                          />

                          {/* Tracé de l'île */}
                          <path
                            d="M42 15 L64 17 L88 30 L114 50 L128 64 L158 55 L173 57 L166 65 L144 69 L138 88 L156 108 L168 122 L178 145 L181 175 L178 194 L164 206 L156 192 L160 176 L136 175 L102 172 L74 160 L78 144 L92 140 L112 136 L110 124 L82 120 L60 104 L42 78 L40 60 L25 36 L29 20 Z"
                            fill="#0D9488"
                            fillOpacity="0.55"
                            stroke="#99F6E4"
                            strokeWidth="1.8"
                            strokeLinejoin="round"
                          />

                          {/* Reliefs intérieurs */}
                          <circle cx="52" cy="38" r="10" stroke="#CCFBF1" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 2" />
                          <circle cx="72" cy="82" r="13" stroke="#CCFBF1" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 2" />

                          {/* Rocher du Diamant & Îlets */}
                          <circle cx="98" cy="182" r="2.2" fill="#99F6E4" />
                          <circle cx="158" cy="98" r="1.8" fill="#99F6E4" />

                          {/* Repères géographiques */}
                          <g className="text-[7.5px] fill-teal-100/85 font-medium">
                            <circle cx="52" cy="38" r="1.6" fill="#CCFBF1" />
                            <text x="60" y="40">Pelée</text>

                            <circle cx="166" cy="59" r="1.6" fill="#CCFBF1" />
                            <text x="148" y="49">Caravelle</text>

                            <circle cx="82" cy="116" r="1.8" fill="#CCFBF1" />
                            <text x="44" y="119">FdF</text>

                            <circle cx="162" cy="200" r="1.6" fill="#CCFBF1" />
                            <text x="118" y="213">Salines</text>
                          </g>

                          {/* Marqueur actif sur la commune de l'utilisateur */}
                          <circle cx={pin.x} cy={pin.y} r="10" fill="#F59E0B" fillOpacity="0.32" />
                          <circle
                            cx={pin.x}
                            cy={pin.y}
                            r="4.8"
                            fill="#FBBF24"
                            stroke="#FFFFFF"
                            strokeWidth="1.6"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* DEUX TIERS À DROITE (2/3) : Panorama côtier & Aperçu du secteur */}
                    <div className="lg:col-span-2 relative bg-slate-900 px-6 py-5 flex flex-col justify-between overflow-hidden">
                      <img
                        src={currentShowcase.image}
                        alt={currentShowcase.headline}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/55 to-slate-950/65" />

                      <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1.5 max-w-xl">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-500/25 border border-teal-300/30 text-teal-200 text-[10px] font-bold uppercase tracking-wider">
                            <MapPin className="w-3 h-3" />
                            Secteur préféré · {prefs.favoriteSector}
                          </span>
                          <h2 className="text-base sm:text-xl font-bold text-white leading-snug">
                            {currentShowcase.headline}
                          </h2>
                          <p className="text-xs text-white/85 leading-relaxed line-clamp-2">
                            {currentShowcase.subtitle}
                          </p>
                        </div>

                        {/* Encadré météo / mer du secteur */}
                        <div className="shrink-0 px-3.5 py-2.5 rounded-xl bg-slate-950/55 backdrop-blur-md border border-white/15 text-white space-y-1">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-300 block">
                            Conditions côtières
                          </span>
                          <div className="text-sm font-bold text-white">
                            Eau {currentShowcase.waterTemp}
                          </div>
                          <div className="text-[11px] text-white/80">
                            {currentShowcase.seaState}
                          </div>
                        </div>
                      </div>

                      {/* Barre de bas des 2/3 : centres d'intérêt actifs */}
                      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3 mt-2 border-t border-white/15">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {prefs.interests.slice(0, 3).map(interest => (
                            <span
                              key={interest}
                              className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/15 text-white text-[11px] font-medium"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                        <span className="text-[11px] text-teal-200 font-medium">
                          ✦ {currentShowcase.highlight}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-800 text-white border-2 border-stone-200 shadow-xs flex items-center justify-center text-2xl sm:text-3xl font-bold overflow-hidden shrink-0">
                    {prefs.avatarPhoto ? (
                      <img
                        src={prefs.avatarPhoto}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'M'}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        {currentUser.name}
                      </h1>
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/70">
                        {userRole === 'admin' ? 'Administrateur' : prefs.travelerType}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500">
                      {currentUser.email} · Camp de base :{' '}
                      <span className="font-semibold text-slate-800">{prefs.baseCommune}</span>
                    </p>
                    {prefs.bio && (
                      <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                        {prefs.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Statistiques rapides à droite */}
                <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-stone-200/80 pt-4 md:pt-0 md:pl-8 shrink-0 relative z-10">
                  <button
                    type="button"
                    onClick={() => setActiveTab('favorites')}
                    className="text-left cursor-pointer group"
                  >
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Mes Favoris
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-2xl font-bold text-slate-900 group-hover:text-teal-700">
                        {favoritePlaces.length}
                      </span>
                      <span className="text-xs text-slate-500">lieux</span>
                    </div>
                  </button>

                  <div className="w-px h-9 bg-stone-200" />

                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="text-left cursor-pointer group"
                  >
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Badges acquis
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-2xl font-bold text-slate-900 group-hover:text-teal-700">
                        {unlockedBadges.length}/{badges.length}
                      </span>
                      <span className="text-xs text-teal-700 font-semibold">
                        ({userPoints} XP)
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </section>

            {/* 2. Barre d'onglets (2 onglets clairs) */}
            <div className="flex items-center gap-2 border-b border-stone-200/90 overflow-x-auto no-scrollbar">
              {[
                { id: 'favorites', label: `Mes Favoris (${favoritePlaces.length})`, icon: Heart },
                { id: 'settings', label: 'Mes informations & préférences', icon: Settings }
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as AccountTab)}
                    className={`inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer -mb-px ${
                      active
                        ? 'border-teal-700 text-teal-800'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* =======================================================
                ONGLET 1 : MES FAVORIS
                ======================================================= */}
            {activeTab === 'favorites' && (
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Mes lieux favoris en Martinique
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Retrouvez vos plages, spots de snorkeling et adresses enregistrées.
                    </p>
                  </div>

                  {/* Filtres par type */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: 'Tous' },
                      { id: 'beach', label: 'Plages' },
                      { id: 'snorkeling', label: 'Snorkeling' },
                      { id: 'nature', label: 'Randos & Mer' },
                      { id: 'food', label: 'Tables & Hôtels' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryFilter(cat.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          categoryFilter === cat.id
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-stone-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredFavorites.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-stone-200/90 p-10 text-center max-w-md mx-auto space-y-3">
                    <Heart className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-900">
                      Aucun lieu dans cette catégorie
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Cliquez sur le petit cœur d’une plage ou d’une expérience pour la retrouver ici.
                    </p>
                    <Link
                      href="/?page=beaches"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-800 text-white text-xs font-semibold rounded-xl hover:bg-teal-900 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Découvrir les plages</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFavorites.map(place => (
                      <div
                        key={place.id}
                        className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                      >
                        <div>
                          <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                            <img
                              src={place.photos[0] || '/images/spots/salines.jpg'}
                              alt={place.name}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/95 text-slate-800 text-[11px] font-bold">
                              {CATEGORY_NAMES[place.category] || place.category}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleFavorite(place.id)}
                              title="Retirer des favoris"
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-rose-500 flex items-center justify-center cursor-pointer shadow-xs"
                            >
                              <Heart className="w-4 h-4 fill-rose-500" />
                            </button>
                          </div>

                          <div className="p-5 space-y-2">
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span className="inline-flex items-center gap-1 text-teal-700 font-semibold">
                                <MapPin className="w-3.5 h-3.5" />
                                {place.commune}
                              </span>
                              {place.rating && (
                                <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  {place.rating}
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">
                              {place.name}
                            </h3>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {place.description}
                            </p>
                          </div>
                        </div>

                        <div className="p-5 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2.5">
                          <Link
                            href={`/?page=lieu&id=${place.id}`}
                            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center inline-flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Voir la fiche</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleFavorite(place.id)}
                            className="py-2 px-3 rounded-xl border border-stone-200 text-slate-600 hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Retirer</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* =======================================================
                ONGLET 2 : MES INFORMATIONS & PRÉFÉRENCES (PLEINE LARGEUR)
                ======================================================= */}
            {activeTab === 'settings' && (
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Colonne principale (8 colonnes sur 12) */}
                <form
                  onSubmit={handleSaveProfile}
                  className="lg:col-span-8 space-y-6"
                >
                  {/* Bloc 1 : Identité & Photo de profil */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-6">
                    <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          Mes informations personnelles
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                          Personnalisez votre identité publique et l&apos;image associée à votre profil.
                        </p>
                      </div>
                      <User className="w-5 h-5 text-teal-700 shrink-0" />
                    </div>

                    {/* Choix d'une vignette photo de Martinique comme avatar */}
                    <div className="space-y-2.5">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-teal-700" />
                        Photo d&apos;illustration du profil
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                        {AVATAR_PRESETS.map(preset => {
                          const isSelected = prefs.avatarPhoto === preset.url;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setPrefs(prev => ({ ...prev, avatarPhoto: preset.url }))}
                              className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                                isSelected
                                  ? 'border-teal-700 bg-teal-50/50 ring-2 ring-teal-700/20'
                                  : 'border-stone-200 hover:border-stone-300 bg-white'
                              }`}
                            >
                              <div className="w-full aspect-square rounded-lg overflow-hidden bg-teal-800 text-white flex items-center justify-center font-bold text-base">
                                {preset.url ? (
                                  <img
                                    src={preset.url}
                                    alt={preset.label}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span>{nameInput ? nameInput.charAt(0).toUpperCase() : 'M'}</span>
                                )}
                              </div>
                              <span className="text-[11px] font-medium text-slate-700 truncate w-full">
                                {preset.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Nom & Email sur 2 colonnes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Prénom & Nom (ou pseudo)
                        </label>
                        <input
                          type="text"
                          required
                          value={nameInput}
                          onChange={e => setNameInput(e.target.value)}
                          placeholder="Votre nom ou pseudo"
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Adresse email
                        </label>
                        <input
                          type="email"
                          disabled
                          value={currentUser.email}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-slate-100 text-sm text-slate-500 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Bio courte */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Courte présentation
                      </label>
                      <textarea
                        rows={2}
                        value={prefs.bio}
                        onChange={e => setPrefs(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Ce que vous aimez découvrir en Martinique (plages, randonnées, plongée...)"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                      />
                    </div>
                  </div>

                  {/* Bloc 2 : Ancrage en Martinique & Centres d'intérêt */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-6">
                    <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Mon profil en Martinique & centres d&apos;intérêt
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                          Ces repères adaptent les suggestions de spots et les bulletins côtiers.
                        </p>
                      </div>
                      <Compass className="w-5 h-5 text-teal-700 shrink-0" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Votre profil
                        </label>
                        <CustomSelect
                          value={prefs.travelerType}
                          onChange={val =>
                            setPrefs(prev => ({
                              ...prev,
                              travelerType: val as UserPreferences['travelerType']
                            }))
                          }
                          options={[
                            {
                              value: 'Voyageur en séjour',
                              label: 'Voyageur en séjour',
                              sublabel: 'Vacances & découverte de l’île'
                            },
                            {
                              value: 'Habitant de Martinique',
                              label: 'Habitant de Martinique',
                              sublabel: 'Résident sur l’île'
                            },
                            {
                              value: 'Saisonnier / Expatrié',
                              label: 'Saisonnier / Expatrié',
                              sublabel: 'Séjour longue durée ou mission'
                            },
                            {
                              value: 'Futur résident / Retraite',
                              label: 'Futur résident / Retraite',
                              sublabel: 'Projet d’installation en Martinique'
                            }
                          ]}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Commune d&apos;attache
                        </label>
                        <CustomSelect
                          value={prefs.baseCommune}
                          onChange={val =>
                            setPrefs(prev => ({ ...prev, baseCommune: val }))
                          }
                          searchable
                          searchPlaceholder="Rechercher une commune..."
                          options={MARTINIQUE_COMMUNES.map(c => ({
                            value: c,
                            label: c
                          }))}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Secteur côtier préféré
                        </label>
                        <CustomSelect
                          value={prefs.favoriteSector}
                          onChange={val =>
                            setPrefs(prev => ({
                              ...prev,
                              favoriteSector: val as UserPreferences['favoriteSector']
                            }))
                          }
                          options={[
                            {
                              value: 'Sud Caraïbe',
                              label: 'Sud Caraïbe',
                              sublabel: 'Anses-d’Arlet, Diamant, Trois-Îlets'
                            },
                            {
                              value: 'Extrême Sud',
                              label: 'Extrême Sud',
                              sublabel: 'Sainte-Anne, Les Salines, Sainte-Luce'
                            },
                            {
                              value: 'Nord Volcanique',
                              label: 'Nord Volcanique',
                              sublabel: 'Le Carbet, Saint-Pierre, Le Prêcheur'
                            },
                            {
                              value: 'Côte Atlantique',
                              label: 'Côte Atlantique',
                              sublabel: 'Presqu’île de la Caravelle, Le François'
                            }
                          ]}
                        />
                      </div>
                    </div>

                    {/* Puces des centres d'intérêt */}
                    <div className="space-y-2.5">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Vos activités favorites sur l&apos;île
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {INTEREST_OPTIONS.map(item => {
                          const active = prefs.interests.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => toggleInterest(item)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                                active
                                  ? 'bg-teal-800 text-white border-teal-800'
                                  : 'bg-slate-50 text-slate-700 border-stone-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>{item}</span>
                              {active && <Check className="w-3.5 h-3.5 text-teal-200" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <span className="text-xs text-slate-500">
                        Vos informations sont sauvegardées instantanément sur votre compte.
                      </span>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isSaving ? 'Enregistrement...' : 'Enregistrer mes modifications'}</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Colonne latérale droite (4 colonnes sur 12) : Aperçu carte membre, Badges & Session */}
                <aside className="lg:col-span-4 space-y-6">
                  {/* 1. Aperçu en direct de la carte membre */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                        Aperçu public
                      </span>
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/80 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-teal-800 text-white font-bold text-lg flex items-center justify-center overflow-hidden shrink-0">
                          {prefs.avatarPhoto ? (
                            <img
                              src={prefs.avatarPhoto}
                              alt={nameInput}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{nameInput ? nameInput.charAt(0).toUpperCase() : 'M'}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {nameInput || currentUser.name}
                          </h4>
                          <p className="text-[11px] text-teal-800 font-semibold">
                            {prefs.travelerType} · {prefs.baseCommune}
                          </p>
                        </div>
                      </div>

                      {prefs.bio && (
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          « {prefs.bio} »
                        </p>
                      )}

                      {prefs.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {prefs.interests.slice(0, 4).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[10px] font-medium text-slate-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. Badges de membre */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Mes badges ({unlockedBadges.length}/{badges.length})
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          {userPoints} points d&apos;exploration
                        </p>
                      </div>
                      <Award className="w-5 h-5 text-amber-500" />
                    </div>

                    <div className="space-y-2.5">
                      {badges.map(badge => {
                        const isUnlocked = badge.unlocked || userPoints >= badge.requiredPoints;
                        return (
                          <div
                            key={badge.id}
                            className={`p-3 rounded-xl border flex items-center gap-3 ${
                              isUnlocked
                                ? 'bg-teal-50/40 border-teal-200'
                                : 'bg-slate-50/60 border-stone-200/70 opacity-75'
                            }`}
                          >
                            <span className="text-xl shrink-0">{badge.icon}</span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-xs font-bold text-slate-900 truncate">
                                  {badge.name}
                                </h4>
                                <span className="text-[10px] font-semibold text-teal-800 shrink-0">
                                  {isUnlocked ? '✓ Acquis' : `${badge.requiredPoints} XP`}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate">
                                {badge.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </aside>
              </section>
            )}
          </>
        )}
      </main>

      <Footer onNavigate={handleNavSection} />
    </div>
  );
}
