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
  'Plages de sable blanc',
  'Snorkeling & tortues',
  'Randonnées & rivières',
  'Tables de bord de mer',
  'Fonds blancs & îlets',
  'Anses volcaniques du Nord',
  'Distilleries & rhums AOC',
  'Couchers de soleil & points de vue'
];

const DEFAULT_PREFS: UserPreferences = {
  travelerType: 'Voyageur en séjour',
  baseCommune: 'Sainte-Luce',
  favoriteSector: 'Sud Caraïbe',
  bio: 'Amateur de belles anses calmes, de snorkeling matinal aux Anses-d’Arlet et de cuisine créole.',
  avatarPhoto: '',
  interests: ['Plages de sable blanc', 'Snorkeling & tortues', 'Tables de bord de mer']
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

const COMMUNE_MAP_DATA: Record<
  string,
  { x: number; y: number; lat: number; lon: number; sector: UserPreferences['favoriteSector'] }
> = {
  "Grand'Rivière": { x: 71, y: 20, lat: 14.873, lon: -61.181, sector: 'Nord Volcanique' },
  'Macouba': { x: 83, y: 22, lat: 14.868, lon: -61.142, sector: 'Nord Volcanique' },
  'Basse-Pointe': { x: 93, y: 26, lat: 14.862, lon: -61.115, sector: 'Nord Volcanique' },
  'Le Prêcheur': { x: 57, y: 36, lat: 14.801, lon: -61.224, sector: 'Nord Volcanique' },
  "L'Ajoupa-Bouillon": { x: 89, y: 38, lat: 14.825, lon: -61.114, sector: 'Nord Volcanique' },
  'Le Lorrain': { x: 109, y: 38, lat: 14.833, lon: -61.056, sector: 'Côte Atlantique' },
  'Le Morne-Rouge': { x: 81, y: 48, lat: 14.776, lon: -61.135, sector: 'Nord Volcanique' },
  'Saint-Pierre': { x: 67, y: 56, lat: 14.743, lon: -61.175, sector: 'Nord Volcanique' },
  'Marigot': { x: 123, y: 48, lat: 14.821, lon: -61.028, sector: 'Côte Atlantique' },
  'Le Marigot': { x: 123, y: 48, lat: 14.821, lon: -61.028, sector: 'Côte Atlantique' },
  'Fonds-Saint-Denis': { x: 83, y: 64, lat: 14.738, lon: -61.131, sector: 'Nord Volcanique' },
  'Sainte-Marie': { x: 137, y: 58, lat: 14.783, lon: -60.992, sector: 'Côte Atlantique' },
  'Le Carbet': { x: 67, y: 74, lat: 14.712, lon: -61.182, sector: 'Nord Volcanique' },
  'Le Morne-Vert': { x: 77, y: 76, lat: 14.706, lon: -61.144, sector: 'Nord Volcanique' },
  'Gros-Morne': { x: 121, y: 74, lat: 14.708, lon: -61.007, sector: 'Côte Atlantique' },
  'La Trinité': { x: 153, y: 68, lat: 14.738, lon: -60.963, sector: 'Côte Atlantique' },
  'Bellefontaine': { x: 73, y: 86, lat: 14.674, lon: -61.164, sector: 'Nord Volcanique' },
  'Case-Pilote': { x: 81, y: 96, lat: 14.643, lon: -61.138, sector: 'Nord Volcanique' },
  'Saint-Joseph': { x: 111, y: 94, lat: 14.671, lon: -61.038, sector: 'Sud Caraïbe' },
  'Le Robert': { x: 159, y: 92, lat: 14.678, lon: -60.938, sector: 'Côte Atlantique' },
  'Schœlcher': { x: 93, y: 108, lat: 14.616, lon: -61.100, sector: 'Sud Caraïbe' },
  'Fort-de-France': { x: 107, y: 116, lat: 14.604, lon: -61.073, sector: 'Sud Caraïbe' },
  'Le Lamentin': { x: 129, y: 116, lat: 14.616, lon: -61.002, sector: 'Sud Caraïbe' },
  'Le François': { x: 171, y: 114, lat: 14.615, lon: -60.903, sector: 'Côte Atlantique' },
  'Ducos': { x: 139, y: 132, lat: 14.575, lon: -60.975, sector: 'Sud Caraïbe' },
  'Saint-Esprit': { x: 157, y: 136, lat: 14.562, lon: -60.933, sector: 'Côte Atlantique' },
  'Le Saint-Esprit': { x: 157, y: 136, lat: 14.562, lon: -60.933, sector: 'Côte Atlantique' },
  'Rivière-Salée': { x: 137, y: 148, lat: 14.528, lon: -60.978, sector: 'Sud Caraïbe' },
  'Les Trois-Îlets': { x: 113, y: 144, lat: 14.539, lon: -61.033, sector: 'Sud Caraïbe' },
  'Le Vauclin': { x: 189, y: 144, lat: 14.545, lon: -60.838, sector: 'Côte Atlantique' },
  "Les Anses-d'Arlet": { x: 101, y: 160, lat: 14.491, lon: -61.080, sector: 'Sud Caraïbe' },
  'Le Diamant': { x: 123, y: 170, lat: 14.478, lon: -61.025, sector: 'Sud Caraïbe' },
  'Rivière-Pilote': { x: 159, y: 160, lat: 14.487, lon: -60.903, sector: 'Extrême Sud' },
  'Sainte-Luce': { x: 153, y: 174, lat: 14.468, lon: -60.921, sector: 'Extrême Sud' },
  'Le Marin': { x: 179, y: 172, lat: 14.471, lon: -60.870, sector: 'Extrême Sud' },
  'Sainte-Anne': { x: 183, y: 192, lat: 14.435, lon: -60.885, sector: 'Extrême Sud' }
};

// Villes affichées sur la carte avec leur étiquette (cliquables)
const MAP_FEATURED_TOWNS: {
  commune: string;
  shortLabel: string;
  labelX: number;
  labelY: number;
  anchor?: 'start' | 'middle' | 'end';
}[] = [
  { commune: "Grand'Rivière", shortLabel: "Grand'Rivière", labelX: 78, labelY: 13, anchor: 'start' },
  { commune: 'Saint-Pierre', shortLabel: 'Saint-Pierre', labelX: 60, labelY: 58, anchor: 'end' },
  { commune: 'La Trinité', shortLabel: 'La Trinité', labelX: 158, labelY: 61, anchor: 'start' },
  { commune: 'Fort-de-France', shortLabel: 'Fort-de-France', labelX: 99, labelY: 118, anchor: 'end' },
  { commune: 'Le François', shortLabel: 'Le François', labelX: 178, labelY: 116, anchor: 'start' },
  { commune: "Les Anses-d'Arlet", shortLabel: "Anses-d'Arlet", labelX: 93, labelY: 162, anchor: 'end' },
  { commune: 'Le Diamant', shortLabel: 'Le Diamant', labelX: 118, labelY: 185, anchor: 'end' },
  { commune: 'Sainte-Luce', shortLabel: 'Sainte-Luce', labelX: 153, labelY: 188, anchor: 'middle' },
  { commune: 'Sainte-Anne', shortLabel: 'Sainte-Anne', labelX: 191, labelY: 196, anchor: 'start' }
];

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
  const [isLocating, setIsLocating] = useState(false);
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

  const handleSelectCommune = (communeName: string) => {
    const data = COMMUNE_MAP_DATA[communeName];
    setPrefs(prev => {
      const next: UserPreferences = {
        ...prev,
        baseCommune: communeName,
        favoriteSector: data ? data.sector : prev.favoriteSector
      };
      try {
        localStorage.setItem('mq_account_prefs_v2', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleLocateMe = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      showToast('La géolocalisation n’est pas disponible sur ce navigateur.', 'error');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        // Vérifier si l'utilisateur se trouve en Martinique (ou proche)
        const inMartinique =
          latitude >= 14.32 && latitude <= 14.95 && longitude >= -61.3 && longitude <= -60.75;

        if (inMartinique) {
          let closestCommune = 'Fort-de-France';
          let minDist = Infinity;
          for (const [name, info] of Object.entries(COMMUNE_MAP_DATA)) {
            const d = Math.hypot(latitude - info.lat, longitude - info.lon);
            if (d < minDist) {
              minDist = d;
              closestCommune = name;
            }
          }
          handleSelectCommune(closestCommune);
          showToast(`Position détectée : ${closestCommune}`);
        } else {
          showToast(
            'Vous êtes hors de Martinique — cliquez directement sur une ville de la carte pour déplacer le point.'
          );
        }
      },
      () => {
        setIsLocating(false);
        showToast('Cliquez directement sur une ville de la carte pour déplacer votre point.');
      },
      { timeout: 6000 }
    );
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
            {/* 1. Bandeau de profil : 1/3 Carte de la Martinique à gauche + 2/3 Photo du littoral à droite */}
            <section className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs">
              {(() => {
                const pin = COMMUNE_MAP_DATA[prefs.baseCommune] || COMMUNE_MAP_DATA['Sainte-Luce'];
                const isFeaturedTown = MAP_FEATURED_TOWNS.some(t => t.commune === prefs.baseCommune);

                const sectorShowcases: Record<
                  UserPreferences['favoriteSector'],
                  {
                    image: string;
                    headline: string;
                    weatherNote: string;
                  }
                > = {
                  'Sud Caraïbe': {
                    image: '/images/spots/anse-dufour.jpg',
                    headline: 'Anse Dufour & Les Anses-d’Arlet',
                    weatherNote: 'Eau 28°C · Mer calme'
                  },
                  'Extrême Sud': {
                    image: '/images/spots/salines.jpg',
                    headline: 'Grande Anse des Salines & Sainte-Anne',
                    weatherNote: 'Eau 28°C · Lagon paisible'
                  },
                  'Nord Volcanique': {
                    image: '/images/spots/montagne-pelee-vue.jpg',
                    headline: 'Montagne Pelée & Baie de Saint-Pierre',
                    weatherNote: 'Eau 27°C · Côte volcanique'
                  },
                  'Côte Atlantique': {
                    image: '/images/spots/baignoire-josephine.jpg',
                    headline: 'Fonds Blancs du François & La Caravelle',
                    weatherNote: 'Eau 28°C · Alizé régulier'
                  }
                };

                const currentShowcase =
                  sectorShowcases[prefs.favoriteSector] || sectorShowcases['Sud Caraïbe'];

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 h-auto lg:h-52 border-b border-stone-200/80">
                    {/* PREMIER TIERS À GAUCHE (1/3) : Carte interactive de la Martinique avec villes */}
                    <div className="lg:col-span-1 bg-[#E6F2F5] lg:border-r border-b lg:border-b-0 border-stone-200/90 px-5 py-4 flex items-center justify-between gap-2 relative overflow-hidden">
                      <div className="flex flex-col justify-between h-full py-0.5 z-10 min-w-[125px]">
                        <div>
                          <span className="text-[11px] font-medium text-slate-500 block">
                            Carte de la Martinique
                          </span>
                          <p className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                            {prefs.baseCommune}
                          </p>
                          <span className="text-xs text-teal-800 font-medium block">
                            {prefs.favoriteSector}
                          </span>
                          <p className="text-[10px] text-slate-500 mt-1">
                            Cliquez sur une ville pour déplacer le point
                          </p>
                        </div>

                        <div className="flex flex-col items-start gap-1.5 mt-2">
                          <button
                            type="button"
                            onClick={handleLocateMe}
                            disabled={isLocating}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/85 hover:bg-white border border-stone-200/90 text-[11px] font-semibold text-slate-700 hover:text-teal-900 transition-colors cursor-pointer shadow-2xs"
                          >
                            <MapPin className="w-3 h-3 text-[#C84B31]" />
                            <span>{isLocating ? 'Localisation...' : 'Ma position'}</span>
                          </button>

                          <Link
                            href="/carte"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:text-teal-950 transition-colors"
                          >
                            <span>Ouvrir la carte</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* Carte de la Martinique avec les villes et point mobile animé */}
                      <div className="shrink-0 flex items-center justify-center z-10">
                        <svg
                          viewBox="0 0 260 220"
                          className="w-48 h-44 sm:w-52 sm:h-44 select-none"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Halo côtier d'eau peu profonde */}
                          <path
                            d="M 67 15 C 77 13, 85 15, 93 19 C 103 24, 111 29, 123 39 C 133 47, 143 56, 153 63 C 163 61, 177 54, 190 54 C 198 54, 201 58, 195 63 C 187 67, 175 68, 168 72 C 161 77, 162 86, 169 95 C 177 105, 187 114, 195 126 C 203 139, 206 156, 206 174 C 206 186, 202 198, 192 206 C 186 209, 181 202, 181 193 C 182 183, 184 177, 173 175 C 160 174, 143 174, 127 171 C 113 169, 99 164, 99 156 C 99 148, 107 142, 119 140 C 129 138, 137 136, 136 128 C 135 121, 119 121, 107 118 C 93 114, 81 104, 71 88 C 63 75, 63 62, 57 48 C 50 34, 49 23, 57 17 C 60 15, 64 15, 67 15 Z"
                            stroke="#CDE5EB"
                            strokeWidth="9"
                            strokeLinejoin="round"
                          />

                          {/* Terre de l'île */}
                          <path
                            d="M 67 15 C 77 13, 85 15, 93 19 C 103 24, 111 29, 123 39 C 133 47, 143 56, 153 63 C 163 61, 177 54, 190 54 C 198 54, 201 58, 195 63 C 187 67, 175 68, 168 72 C 161 77, 162 86, 169 95 C 177 105, 187 114, 195 126 C 203 139, 206 156, 206 174 C 206 186, 202 198, 192 206 C 186 209, 181 202, 181 193 C 182 183, 184 177, 173 175 C 160 174, 143 174, 127 171 C 113 169, 99 164, 99 156 C 99 148, 107 142, 119 140 C 129 138, 137 136, 136 128 C 135 121, 119 121, 107 118 C 93 114, 81 104, 71 88 C 63 75, 63 62, 57 48 C 50 34, 49 23, 57 17 C 60 15, 64 15, 67 15 Z"
                            fill="#D4E6D3"
                            stroke="#688F6E"
                            strokeWidth="1.4"
                            strokeLinejoin="round"
                          />

                          {/* Relief doux intérieur (Pelée & Pitons du Carbet) */}
                          <ellipse cx="79" cy="40" rx="13" ry="11" fill="#BDD6BC" opacity="0.7" />
                          <ellipse cx="97" cy="82" rx="15" ry="18" fill="#BDD6BC" opacity="0.6" />

                          {/* Rocher du Diamant & Îlets du François */}
                          <circle cx="123" cy="181" r="1.8" fill="#688F6E" />
                          <circle cx="181" cy="98" r="1.5" fill="#688F6E" />

                          {/* Villes principales cliquables sur la carte */}
                          {MAP_FEATURED_TOWNS.map(town => {
                            const coords = COMMUNE_MAP_DATA[town.commune];
                            if (!coords) return null;
                            const isSelected = prefs.baseCommune === town.commune;
                            return (
                              <g
                                key={town.commune}
                                onClick={() => handleSelectCommune(town.commune)}
                                className="cursor-pointer group"
                              >
                                {/* Zone de clic confortable */}
                                <circle cx={coords.x} cy={coords.y} r="9" fill="transparent" />
                                <circle
                                  cx={coords.x}
                                  cy={coords.y}
                                  r={isSelected ? 3 : 2.2}
                                  fill={isSelected ? '#C84B31' : '#476950'}
                                  className="transition-all group-hover:fill-[#C84B31]"
                                />
                                <text
                                  x={town.labelX}
                                  y={town.labelY}
                                  textAnchor={town.anchor || 'start'}
                                  className={`text-[7.5px] transition-colors ${
                                    isSelected
                                      ? 'fill-[#9E331E] font-bold'
                                      : 'fill-slate-700 font-medium group-hover:fill-slate-950'
                                  }`}
                                >
                                  {town.shortLabel}
                                </text>
                              </g>
                            );
                          })}

                          {/* Si l'utilisateur a choisi une commune qui n'est pas dans les 9 étiquettes fixes, on affiche son nom à côté du point */}
                          {!isFeaturedTown && (
                            <text
                              x={pin.x > 130 ? pin.x + 8 : pin.x - 8}
                              y={pin.y + 3}
                              textAnchor={pin.x > 130 ? 'start' : 'end'}
                              className="text-[8px] fill-[#9E331E] font-bold"
                            >
                              {prefs.baseCommune}
                            </text>
                          )}

                          {/* Point mobile animé qui se déplace vers la commune où l'on est */}
                          <g
                            style={{
                              transform: `translate(${pin.x}px, ${pin.y}px)`,
                              transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)'
                            }}
                          >
                            <circle
                              cx={0}
                              cy={0}
                              r="9"
                              fill="#C84B31"
                              fillOpacity="0.28"
                              className="animate-ping"
                            />
                            <circle
                              cx={0}
                              cy={0}
                              r="8"
                              fill="#C84B31"
                              fillOpacity="0.2"
                            />
                            <circle
                              cx={0}
                              cy={0}
                              r="4.8"
                              fill="#C84B31"
                              stroke="#FFFFFF"
                              strokeWidth="1.8"
                            />
                          </g>
                        </svg>
                      </div>
                    </div>

                    {/* DEUX TIERS À DROITE (2/3) : Vraie photo lumineuse sans surcharge */}
                    <div className="lg:col-span-2 relative h-44 lg:h-full bg-stone-200 overflow-hidden">
                      <img
                        src={currentShowcase.image}
                        alt={currentShowcase.headline}
                        className="w-full h-full object-cover"
                      />
                      {/* Léger dégradé uniquement en bas pour lire la légende */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      <div className="absolute bottom-3.5 inset-x-5 flex flex-wrap items-end justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-medium text-white/85 block">
                            {prefs.favoriteSector}
                          </span>
                          <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                            {currentShowcase.headline}
                          </h2>
                        </div>

                        <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs text-white text-xs font-medium">
                          {currentShowcase.weatherNote}
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
                      <span className="text-xs text-slate-500">
                        étapes
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
                          onChange={val => handleSelectCommune(val)}
                          searchable
                          searchPlaceholder="Rechercher une commune..."
                          options={MARTINIQUE_COMMUNES.map(c => ({
                            value: c,
                            label: c,
                            sublabel: COMMUNE_MAP_DATA[c]?.sector
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
                      <span className="text-xs font-bold text-slate-900">
                        Aperçu de votre profil public
                      </span>
                      <span className="text-[11px] text-slate-400">Communauté</span>
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
                          Repères d&apos;exploration ({unlockedBadges.length}/{badges.length})
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Débloqués au fil de vos visites et partages
                        </p>
                      </div>
                      <Award className="w-4 h-4 text-teal-700" />
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
                            <span className="text-lg shrink-0">{badge.icon}</span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-xs font-bold text-slate-900 truncate">
                                  {badge.name}
                                </h4>
                                <span className="text-[10px] font-medium text-slate-500 shrink-0">
                                  {isUnlocked ? 'Acquis' : 'À découvrir'}
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
