'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Check,
  X,
  RotateCcw,
  ChevronRight,
  Waves,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CustomSelect from '@/components/ui/CustomSelect';
import { MARTINIQUE_COMMUNES } from '@/data/communes';

type AccountTab = 'favorites' | 'settings' | 'badges';

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
  favoriteSector: 'Extrême Sud',
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
  {
    x: number;
    y: number;
    lat: number;
    lon: number;
    sector: UserPreferences['favoriteSector'];
    image: string;
    headline: string;
    weatherNote: string;
  }
> = {
  "Grand'Rivière": {
    x: 71,
    y: 20,
    lat: 14.873,
    lon: -61.181,
    sector: 'Nord Volcanique',
    image: '/images/spots/anse-couleuvre.jpg',
    headline: "Grand'Rivière — Falaises sauvages & bout du monde",
    weatherNote: 'Eau 27°C · Brise du Nord'
  },
  'Macouba': {
    x: 83,
    y: 22,
    lat: 14.868,
    lon: -61.142,
    sector: 'Nord Volcanique',
    image: '/images/spots/habitation-clement.jpg',
    headline: 'Macouba — Falaises du Nord & plantations de canne',
    weatherNote: 'Air 26°C · Alizé frais'
  },
  'Basse-Pointe': {
    x: 93,
    y: 26,
    lat: 14.862,
    lon: -61.115,
    sector: 'Nord Volcanique',
    image: '/images/spots/cascades-didier.jpg',
    headline: 'Basse-Pointe — Côte Nord-Atlantique & vallées verdoyantes',
    weatherNote: 'Eau 27°C · Houle atlantique'
  },
  'Le Prêcheur': {
    x: 57,
    y: 36,
    lat: 14.801,
    lon: -61.224,
    sector: 'Nord Volcanique',
    image: '/images/spots/anse-ceron.jpg',
    headline: 'Le Prêcheur — Anse Céron, sable noir & Îlet la Perle',
    weatherNote: 'Eau 27°C · Côte volcanique'
  },
  "L'Ajoupa-Bouillon": {
    x: 89,
    y: 38,
    lat: 14.825,
    lon: -61.114,
    sector: 'Nord Volcanique',
    image: '/images/spots/gorges-falaise.jpg',
    headline: "L'Ajoupa-Bouillon — Gorges de la Falaise & forêt tropicale",
    weatherNote: 'Air 25°C · Fraîcheur des mornes'
  },
  'Le Lorrain': {
    x: 109,
    y: 38,
    lat: 14.833,
    lon: -61.056,
    sector: 'Côte Atlantique',
    image: '/images/spots/sentier-caravelle.jpg',
    headline: 'Le Lorrain — Grandes anses atlantiques & reliefs du Nord',
    weatherNote: 'Eau 27°C · Alizé régulier'
  },
  'Le Morne-Rouge': {
    x: 81,
    y: 48,
    lat: 14.776,
    lon: -61.135,
    sector: 'Nord Volcanique',
    image: '/images/spots/montagne-pelee.jpg',
    headline: 'Le Morne-Rouge — Versants de la Montagne Pelée',
    weatherNote: 'Air 24°C · Climat d’altitude'
  },
  'Saint-Pierre': {
    x: 67,
    y: 56,
    lat: 14.743,
    lon: -61.175,
    sector: 'Nord Volcanique',
    image: '/images/spots/montagne-pelee-vue.jpg',
    headline: 'Saint-Pierre — Baie historique au pied de la Montagne Pelée',
    weatherNote: 'Eau 28°C · Rade abritée'
  },
  'Marigot': {
    x: 123,
    y: 48,
    lat: 14.821,
    lon: -61.028,
    sector: 'Côte Atlantique',
    image: '/images/spots/sentier-caravelle-falaises.jpg',
    headline: 'Le Marigot — Pointe de Marigot & falaises atlantiques',
    weatherNote: 'Eau 27°C · Brise marine'
  },
  'Le Marigot': {
    x: 123,
    y: 48,
    lat: 14.821,
    lon: -61.028,
    sector: 'Côte Atlantique',
    image: '/images/spots/sentier-caravelle-falaises.jpg',
    headline: 'Le Marigot — Pointe de Marigot & falaises atlantiques',
    weatherNote: 'Eau 27°C · Brise marine'
  },
  'Fonds-Saint-Denis': {
    x: 83,
    y: 64,
    lat: 14.738,
    lon: -61.131,
    sector: 'Nord Volcanique',
    image: '/images/spots/canal-esclaves-vue.jpg',
    headline: 'Fonds-Saint-Denis — Canal de Beauregard & Pitons du Carbet',
    weatherNote: 'Air 25°C · Vallée tropicale'
  },
  'Sainte-Marie': {
    x: 137,
    y: 58,
    lat: 14.783,
    lon: -60.992,
    sector: 'Côte Atlantique',
    image: '/images/spots/sentier-caravelle.jpg',
    headline: 'Sainte-Marie — Tombolo, îlet & littoral atlantique',
    weatherNote: 'Eau 27°C · Alizé atlantique'
  },
  'Le Carbet': {
    x: 67,
    y: 74,
    lat: 14.712,
    lon: -61.182,
    sector: 'Nord Volcanique',
    image: '/images/spots/petibonum.jpg',
    headline: 'Le Carbet — Grande plage volcanique & couchers de soleil',
    weatherNote: 'Eau 28°C · Mer des Caraïbes'
  },
  'Le Morne-Vert': {
    x: 77,
    y: 76,
    lat: 14.706,
    lon: -61.144,
    sector: 'Nord Volcanique',
    image: '/images/spots/jardin-balata-allée.jpg',
    headline: 'Le Morne-Vert — Village niché au pied des Pitons du Carbet',
    weatherNote: 'Air 25°C · Fraîcheur verdoyante'
  },
  'Gros-Morne': {
    x: 121,
    y: 74,
    lat: 14.708,
    lon: -61.007,
    sector: 'Côte Atlantique',
    image: '/images/spots/habitation-clement-jardin.jpg',
    headline: 'Gros-Morne — Cœur verdoyant, vergers & rivières',
    weatherNote: 'Air 27°C · Brise des terres'
  },
  'La Trinité': {
    x: 153,
    y: 68,
    lat: 14.738,
    lon: -60.963,
    sector: 'Côte Atlantique',
    image: '/images/spots/tartane.jpg',
    headline: 'La Trinité — Village de Tartane & Presqu’île de la Caravelle',
    weatherNote: 'Eau 28°C · Baie de Tartane'
  },
  'Bellefontaine': {
    x: 73,
    y: 86,
    lat: 14.674,
    lon: -61.164,
    sector: 'Nord Volcanique',
    image: '/images/spots/grande-anse-sunset.jpg',
    headline: 'Bellefontaine — Côte Caraïbe & horizon au couchant',
    weatherNote: 'Eau 28°C · Mer calme'
  },
  'Case-Pilote': {
    x: 81,
    y: 96,
    lat: 14.643,
    lon: -61.138,
    sector: 'Nord Volcanique',
    image: '/images/spots/excursion-dauphins-nage.jpg',
    headline: 'Case-Pilote — Bourg marin & eaux bleues du Nord-Caraïbe',
    weatherNote: 'Eau 28°C · Mer paisible'
  },
  'Saint-Joseph': {
    x: 111,
    y: 94,
    lat: 14.671,
    lon: -61.038,
    sector: 'Sud Caraïbe',
    image: '/images/spots/jardin-balata.jpg',
    headline: 'Saint-Joseph — Cœur de l’île, Rivière Blanche & forêt',
    weatherNote: 'Air 26°C · Verdure tropicale'
  },
  'Le Robert': {
    x: 159,
    y: 92,
    lat: 14.678,
    lon: -60.938,
    sector: 'Côte Atlantique',
    image: '/images/spots/baignoire-josephine-baignade.jpg',
    headline: 'Le Robert — Baie aux dix îlets, Îlet Chancel & Îlet Madame',
    weatherNote: 'Eau 28°C · Fonds blancs'
  },
  'Schœlcher': {
    x: 93,
    y: 108,
    lat: 14.616,
    lon: -61.100,
    sector: 'Sud Caraïbe',
    image: '/images/spots/excursion-dauphins.jpg',
    headline: 'Schœlcher — Anse Madame, Anse Collat & côte Caraïbe',
    weatherNote: 'Eau 28°C · Mer calme'
  },
  'Fort-de-France': {
    x: 107,
    y: 116,
    lat: 14.604,
    lon: -61.073,
    sector: 'Sud Caraïbe',
    image: '/images/spots/hotel-bakoua.jpg',
    headline: 'Fort-de-France — Grande baie, front de mer & jardins de Balata',
    weatherNote: 'Eau 28°C · Baie abritée'
  },
  'Le Lamentin': {
    x: 129,
    y: 116,
    lat: 14.616,
    lon: -61.002,
    sector: 'Sud Caraïbe',
    image: '/images/spots/mangrove-trois-ilets-racines.jpg',
    headline: 'Le Lamentin — Baie de Génipa & grande mangrove centrale',
    weatherNote: 'Air 28°C · Baie intérieure'
  },
  'Le François': {
    x: 171,
    y: 114,
    lat: 14.615,
    lon: -60.903,
    sector: 'Côte Atlantique',
    image: '/images/spots/baignoire-josephine.jpg',
    headline: 'Le François — Fonds Blancs & Baignoire de Joséphine',
    weatherNote: 'Eau 28°C · Lagon turquoise'
  },
  'Ducos': {
    x: 139,
    y: 132,
    lat: 14.575,
    lon: -60.975,
    sector: 'Sud Caraïbe',
    image: '/images/spots/mangrove-trois-ilets.jpg',
    headline: 'Ducos — Baie de Génipa & plaine du Sud',
    weatherNote: 'Air 28°C · Climat doux'
  },
  'Saint-Esprit': {
    x: 157,
    y: 136,
    lat: 14.562,
    lon: -60.933,
    sector: 'Côte Atlantique',
    image: '/images/spots/morne-larcher-vue.jpg',
    headline: 'Saint-Esprit — Vallées et mornes verdoyants du Sud',
    weatherNote: 'Air 27°C · Alizé doux'
  },
  'Le Saint-Esprit': {
    x: 157,
    y: 136,
    lat: 14.562,
    lon: -60.933,
    sector: 'Côte Atlantique',
    image: '/images/spots/morne-larcher-vue.jpg',
    headline: 'Saint-Esprit — Vallées et mornes verdoyants du Sud',
    weatherNote: 'Air 27°C · Alizé doux'
  },
  'Rivière-Salée': {
    x: 137,
    y: 148,
    lat: 14.528,
    lon: -60.978,
    sector: 'Sud Caraïbe',
    image: '/images/spots/anse-noire-ponton.jpg',
    headline: 'Rivière-Salée — Carrefour des plages du Sud Caraïbe',
    weatherNote: 'Eau 28°C · Côte Sud'
  },
  'Les Trois-Îlets': {
    x: 113,
    y: 144,
    lat: 14.539,
    lon: -61.033,
    sector: 'Sud Caraïbe',
    image: '/images/spots/spot-plage-de-l-anse-a-l-ane-1791538929676.jpg',
    headline: 'Les Trois-Îlets — Anse à l’Âne, Anse Mitan & Pointe du Bout',
    weatherNote: 'Eau 28°C · Baie calme'
  },
  'Le Vauclin': {
    x: 189,
    y: 144,
    lat: 14.545,
    lon: -60.838,
    sector: 'Côte Atlantique',
    image: '/images/spots/pointe-faula.jpg',
    headline: 'Le Vauclin — Lagon de la Pointe Faula & barrière de corail',
    weatherNote: 'Eau 28°C · Fonds peu profonds'
  },
  "Les Anses-d'Arlet": {
    x: 101,
    y: 160,
    lat: 14.491,
    lon: -61.080,
    sector: 'Sud Caraïbe',
    image: '/images/spots/ponton-anses-arlet.jpg',
    headline: 'Les Anses-d’Arlet — Ponton du bourg, Anse Dufour & Grande Anse',
    weatherNote: 'Eau 28°C · Eaux cristallines'
  },
  'Le Diamant': {
    x: 123,
    y: 170,
    lat: 14.478,
    lon: -61.025,
    sector: 'Sud Caraïbe',
    image: '/images/spots/diamant.jpg',
    headline: 'Le Diamant — Grande plage face au Rocher du Diamant',
    weatherNote: 'Eau 28°C · Vue sur le Rocher'
  },
  'Rivière-Pilote': {
    x: 159,
    y: 160,
    lat: 14.487,
    lon: -60.903,
    sector: 'Extrême Sud',
    image: '/images/spots/anse-figuier-snorkeling.jpg',
    headline: 'Rivière-Pilote — Plage de l’Anse Figuier & lagon du Sud',
    weatherNote: 'Eau 28°C · Lagon limpide'
  },
  'Sainte-Luce': {
    x: 153,
    y: 174,
    lat: 14.468,
    lon: -60.921,
    sector: 'Extrême Sud',
    image: '/images/spots/anse-figuier.jpg',
    headline: 'Sainte-Luce — Plages de Gros Raisin, Corps de Garde & Anse Mabouya',
    weatherNote: 'Eau 28°C · Mer calme'
  },
  'Le Marin': {
    x: 179,
    y: 172,
    lat: 14.471,
    lon: -60.870,
    sector: 'Extrême Sud',
    image: '/images/spots/morne-gommier.jpg',
    headline: 'Le Marin — Panorama sur la baie, marina & plages du Cap Macré',
    weatherNote: 'Eau 28°C · Baie abritée'
  },
  'Sainte-Anne': {
    x: 183,
    y: 192,
    lat: 14.435,
    lon: -60.885,
    sector: 'Extrême Sud',
    image: '/images/spots/salines.jpg',
    headline: 'Sainte-Anne — Grande Anse des Salines & Pointe Marin',
    weatherNote: 'Eau 28°C · Lagon turquoise'
  }
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
    addPoints,
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

  // Profile preferences: saved state vs draft state (settings form)
  const [savedName, setSavedName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [savedPrefs, setSavedPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Unsaved changes & Logout confirmation modals
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  // Fluid Toast Notification state
  const [toast, setToast] = useState<{
    id: number;
    title: string;
    subtitle?: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastCleanupRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (toastCleanupRef.current) clearTimeout(toastCleanupRef.current);
    setToastVisible(false);
    toastCleanupRef.current = setTimeout(() => {
      setToast(null);
    }, 300);
  };

  const showToast = (
    title: string,
    type: 'success' | 'error' | 'info' = 'success',
    subtitle?: string
  ) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (toastCleanupRef.current) clearTimeout(toastCleanupRef.current);

    const id = Date.now();
    setToast({ id, title, subtitle, type });
    setToastVisible(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToastVisible(true);
      });
    });

    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
      toastCleanupRef.current = setTimeout(() => {
        setToast(null);
      }, 300);
    }, 3800);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (toastCleanupRef.current) clearTimeout(toastCleanupRef.current);
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      const initialName = currentUser.name || '';
      setSavedName(initialName);
      setNameInput(initialName);
    }
    try {
      const stored = localStorage.getItem('mq_account_prefs_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        const validInterests = Array.isArray(parsed.interests)
          ? parsed.interests.filter((i: string) => INTEREST_OPTIONS.includes(i))
          : DEFAULT_PREFS.interests;
        const loaded: UserPreferences = {
          ...DEFAULT_PREFS,
          ...parsed,
          interests: validInterests
        };
        setSavedPrefs(loaded);
        setPrefs(loaded);
      }
    } catch {
      // Ignore in SSR
    }
  }, [currentUser]);

  // Liste des champs modifiés mais non sauvegardés
  const changedFields = useMemo(() => {
    if (!currentUser) return [];
    const fields: string[] = [];
    if (nameInput.trim() !== savedName.trim()) fields.push('Prénom & Nom');
    if (prefs.avatarPhoto !== savedPrefs.avatarPhoto) fields.push('Photo de profil');
    if (prefs.bio.trim() !== savedPrefs.bio.trim()) fields.push('Présentation');
    if (prefs.travelerType !== savedPrefs.travelerType) fields.push('Votre profil');
    if (prefs.baseCommune !== savedPrefs.baseCommune) fields.push("Commune d'attache");
    if (prefs.favoriteSector !== savedPrefs.favoriteSector) fields.push('Secteur côtier');

    const cleanDraftInterests = prefs.interests.filter(i => INTEREST_OPTIONS.includes(i));
    const cleanSavedInterests = savedPrefs.interests.filter(i => INTEREST_OPTIONS.includes(i));
    const sameInterests =
      cleanDraftInterests.length === cleanSavedInterests.length &&
      cleanDraftInterests.every(i => cleanSavedInterests.includes(i));
    if (!sameInterests) fields.push('Activités favorites');

    return fields;
  }, [currentUser, nameInput, savedName, prefs, savedPrefs]);

  const hasUnsavedChanges = changedFields.length > 0;

  // Avertissement navigateur si l'utilisateur ferme l'onglet avec des modifications non enregistrées
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Intercepte toute navigation si des modifications sont en attente dans les paramètres
  const guardNavigation = (action: () => void) => {
    if (hasUnsavedChanges) {
      pendingActionRef.current = action;
      setUnsavedModalOpen(true);
    } else {
      action();
    }
  };

  // Sélection d'une commune dans le formulaire (brouillon uniquement, ne sauvegarde pas tant qu'on n'a pas cliqué sur Enregistrer)
  const handleSelectCommune = (communeName: string) => {
    const data = COMMUNE_MAP_DATA[communeName];
    setPrefs(prev => ({
      ...prev,
      baseCommune: communeName,
      favoriteSector: data ? data.sector : prev.favoriteSector
    }));
  };

  const handleLocateMe = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      showToast(
        'Géolocalisation indisponible',
        'error',
        'Votre navigateur ne permet pas la détection automatique.'
      );
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
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
          showToast(
            `Position détectée : ${closestCommune}`,
            'info',
            activeTab === 'settings'
              ? 'Pensez à enregistrer vos modifications en bas de page.'
              : 'Cliquez sur « Mes informations » pour enregistrer cette commune par défaut.'
          );
        } else {
          showToast(
            'Hors de Martinique',
            'info',
            'Cliquez directement sur une ville de la carte pour déplacer le point.'
          );
        }
      },
      () => {
        setIsLocating(false);
        showToast(
          'Localisation non activée',
          'info',
          'Cliquez directement sur une ville de la carte pour déplacer votre point.'
        );
      },
      { timeout: 6000 }
    );
  };

  const handleNavSection = (sec: string) => {
    guardNavigation(() => {
      if (sec === 'home') router.push('/');
      else router.push(`/?page=${encodeURIComponent(sec)}`);
    });
  };

  const handleBack = () => {
    guardNavigation(() => {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back();
      } else {
        router.push('/');
      }
    });
  };

  const handleTabChange = (nextTab: AccountTab) => {
    if (nextTab === activeTab) return;
    if (activeTab === 'settings' && hasUnsavedChanges) {
      guardNavigation(() => setActiveTab(nextTab));
    } else {
      setActiveTab(nextTab);
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
          showToast(
            'Bon retour parmi nous !',
            'success',
            'Vous êtes maintenant connecté à votre espace Martinique Explorer.'
          );
        } else {
          showToast('Connexion impossible', 'error', res.error || 'Identifiants incorrects.');
        }
      } else {
        const res = await signup(authName || 'Voyageur', authEmail, authPassword || undefined);
        if (res.success) {
          showToast(
            'Bienvenue sur Martinique Explorer !',
            'success',
            'Votre compte a été créé avec succès.'
          );
        } else {
          showToast('Création impossible', 'error', res.error || 'Erreur lors de la création.');
        }
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const performSaveProfile = async (): Promise<boolean> => {
    const cleanName = nameInput.trim() || savedName || 'Voyageur';
    setIsSaving(true);
    try {
      const cleanPrefs: UserPreferences = {
        ...prefs,
        interests: prefs.interests.filter(i => INTEREST_OPTIONS.includes(i))
      };
      const res = await updateUserProfile(cleanName);
      let firstTimeProfileBonus = false;
      try {
        const alreadyRewarded = localStorage.getItem('mq_profile_reward_claimed');
        localStorage.setItem('mq_account_prefs_v2', JSON.stringify(cleanPrefs));
        if (!alreadyRewarded) {
          localStorage.setItem('mq_profile_reward_claimed', '1');
          firstTimeProfileBonus = true;
        }
      } catch {
        // ignore
      }
      if (res.success) {
        if (firstTimeProfileBonus) {
          addPoints(30);
        }
        setSavedName(cleanName);
        setNameInput(cleanName);
        setSavedPrefs(cleanPrefs);
        setPrefs(cleanPrefs);
        showToast(
          'Modifications enregistrées',
          'success',
          firstTimeProfileBonus
            ? `Profil mis à jour (+30 pts d'exploration) · Ville : ${cleanPrefs.baseCommune}`
            : `Profil mis à jour · Ville d'attache : ${cleanPrefs.baseCommune}`
        );
        return true;
      } else {
        showToast('Erreur de sauvegarde', 'error', res.error || 'Veuillez réessayer.');
        return false;
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSaveProfile();
  };

  const handleDiscardChanges = () => {
    setNameInput(savedName);
    setPrefs(savedPrefs);
    showToast(
      'Modifications annulées',
      'info',
      'Vos dernières valeurs enregistrées ont été rétablies.'
    );
  };

  const handleConfirmSaveAndLeave = async () => {
    const ok = await performSaveProfile();
    setUnsavedModalOpen(false);
    if (ok && pendingActionRef.current) {
      const act = pendingActionRef.current;
      pendingActionRef.current = null;
      act();
    }
  };

  const handleConfirmDiscardAndLeave = () => {
    setNameInput(savedName);
    setPrefs(savedPrefs);
    setUnsavedModalOpen(false);
    showToast('Modifications ignorées', 'info', 'Vos changements non sauvegardés ont été annulés.');
    if (pendingActionRef.current) {
      const act = pendingActionRef.current;
      pendingActionRef.current = null;
      act();
    }
  };

  // Modifie uniquement le brouillon (ne sauvegarde PAS tant que l'utilisateur ne clique pas sur Enregistrer)
  const toggleInterest = (interest: string) => {
    setPrefs(prev => {
      const cleanCurrent = prev.interests.filter(i => INTEREST_OPTIONS.includes(i));
      const exists = cleanCurrent.includes(interest);
      const next = exists
        ? cleanCurrent.filter(i => i !== interest)
        : [...cleanCurrent, interest];
      return { ...prev, interests: next };
    });
  };

  const handleLogout = () => {
    guardNavigation(() => {
      setLogoutConfirmOpen(true);
    });
  };

  const handleConfirmLogout = async () => {
    setLogoutConfirmOpen(false);
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
  const nextBadge = badges.find(b => !b.unlocked && userPoints < b.requiredPoints) || null;
  const currentRankBadge =
    unlockedBadges.length > 0 ? unlockedBadges[unlockedBadges.length - 1] : null;
  const progressToNext = nextBadge
    ? Math.min(100, Math.round((userPoints / nextBadge.requiredPoints) * 100))
    : 100;

  const handleOpenBadgesSection = () => {
    handleTabChange('badges');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900">
      {/* Notification fluide et chaleureuse */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-20 right-4 sm:right-6 z-[1200] max-w-sm w-[calc(100vw-2rem)] sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xl overflow-hidden transition-all duration-300 ease-out ${
            toastVisible
              ? 'translate-y-0 opacity-100 scale-100'
              : '-translate-y-3 opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className="p-4 flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                toast.type === 'error'
                  ? 'bg-rose-50 border-rose-200/80 text-rose-700'
                  : toast.type === 'info'
                  ? 'bg-amber-50 border-amber-200/80 text-amber-800'
                  : 'bg-teal-50 border-teal-200/80 text-teal-800'
              }`}
            >
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : toast.type === 'info' ? (
                <Compass className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm font-bold text-slate-900 leading-snug">{toast.title}</p>
              {toast.subtitle && (
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.subtitle}</p>
              )}
            </div>

            <button
              type="button"
              onClick={dismissToast}
              aria-label="Fermer la notification"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Barre de progression fluide */}
          <div className="h-1 w-full bg-stone-100 overflow-hidden">
            <div
              key={toast.id}
              className={`h-full transition-all duration-[3800ms] ease-linear ${
                toastVisible ? 'w-0' : 'w-full'
              } ${
                toast.type === 'error'
                  ? 'bg-rose-500'
                  : toast.type === 'info'
                  ? 'bg-amber-500'
                  : 'bg-teal-700'
              }`}
            />
          </div>
        </div>
      )}

      {/* Modale de confirmation de déconnexion */}
      {logoutConfirmOpen && currentUser && (
        <div className="fixed inset-0 z-[1350] bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
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
                  className="py-2.5 px-4 rounded-xl bg-white hover:bg-stone-100 text-slate-700 border border-stone-200/90 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Annuler
                </button>

                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  className="py-2.5 px-4 rounded-xl bg-[#C84B31] hover:bg-[#B03E26] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2 shadow-2xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Me déconnecter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale de confirmation en cas de départ avec des modifications non sauvegardées */}
      {unsavedModalOpen && (
        <div className="fixed inset-0 z-[1300] bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xl max-w-md w-full overflow-hidden text-left">
            <div className="px-6 py-5 bg-[#FAF8F5] border-b border-stone-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Modifications non enregistrées
                  </h3>
                  <p className="text-xs text-slate-500">
                    Souhaitez-vous sauvegarder avant de quitter ?
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUnsavedModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Vous avez modifié vos paramètres sans cliquer sur <strong>Enregistrer</strong>. Si vous quittez maintenant sans sauvegarder, ces changements seront perdus :
              </p>

              {changedFields.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {changedFields.map(field => (
                    <span
                      key={field}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-stone-200/90 text-xs font-semibold text-slate-800"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleConfirmSaveAndLeave}
                  disabled={isSaving}
                  className="w-full py-3 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2 shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSaving ? 'Enregistrement...' : 'Enregistrer et continuer'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDiscardAndLeave}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-rose-50/70 text-rose-700 border border-stone-200 hover:border-rose-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Quitter sans enregistrer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUnsavedModalOpen(false)}
                  className="w-full py-2 px-4 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-medium transition-colors cursor-pointer text-center"
                >
                  Continuer mes modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vraie barre de navigation principale du site */}
      <Navbar activeSection="compte" setActiveSection={handleNavSection} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full space-y-6 text-left">
        {/* Fil d'Ariane + Actions rapides (Retour & Déconnexion) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200/80 text-xs">
          <nav className="flex items-center gap-2 text-slate-500">
            <button
              type="button"
              onClick={() => handleNavSection('home')}
              className="hover:text-teal-700 transition-colors font-medium cursor-pointer"
            >
              Accueil
            </button>
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
                            {pin.sector}
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

                          <button
                            type="button"
                            onClick={() => guardNavigation(() => router.push('/carte'))}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:text-teal-950 transition-colors cursor-pointer"
                          >
                            <span>Ouvrir la carte</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
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

                    {/* DEUX TIERS À DROITE (2/3) : Jolie photo de la ville saisie / sélectionnée */}
                    <div className="lg:col-span-2 relative h-44 lg:h-full bg-stone-200 overflow-hidden">
                      <img
                        key={pin.image}
                        src={pin.image}
                        alt={pin.headline}
                        className="w-full h-full object-cover transition-opacity duration-300"
                      />
                      {/* Léger dégradé uniquement en bas pour lire la légende */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                      <div className="absolute bottom-3.5 inset-x-5 flex flex-wrap items-end justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-medium text-white/85 block">
                            {prefs.baseCommune} · {pin.sector}
                          </span>
                          <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                            {pin.headline}
                          </h2>
                        </div>

                        <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs text-white text-xs font-medium">
                          {pin.weatherNote}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-800 text-white border-2 border-stone-200 shadow-xs flex items-center justify-center text-2xl sm:text-3xl font-bold overflow-hidden shrink-0">
                    {savedPrefs.avatarPhoto ? (
                      <img
                        src={savedPrefs.avatarPhoto}
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
                        {userRole === 'admin' ? 'Administrateur' : savedPrefs.travelerType}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500">
                      {currentUser.email} · Camp de base :{' '}
                      <span className="font-semibold text-slate-800">{savedPrefs.baseCommune}</span>
                    </p>
                    {savedPrefs.bio && (
                      <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                        {savedPrefs.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Cartes de synthèse à droite : Mes Favoris & Progression des Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto border-t lg:border-t-0 border-stone-200/80 pt-4 lg:pt-0 shrink-0 relative z-10">
                  {/* Carte 1 : Mes Favoris */}
                  <button
                    type="button"
                    onClick={() => handleTabChange('favorites')}
                    className="px-4 py-3.5 rounded-xl bg-[#FAF8F5] hover:bg-stone-100/90 border border-stone-200/90 hover:border-stone-300 text-left cursor-pointer group transition-all flex items-center gap-3.5 sm:min-w-[185px]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/80 text-[#C84B31] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Heart className="w-4 h-4 fill-[#C84B31]/15" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Mes Favoris
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-xl font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                          {favoritePlaces.length}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          lieu{favoritePlaces.length > 1 ? 'x' : ''} enregistré{favoritePlaces.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <span className="text-[11px] text-teal-800 font-medium inline-flex items-center gap-0.5 mt-0.5">
                        <span>Voir mon carnet</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>

                  {/* Carte 2 : Badges acquis & Progression long terme */}
                  <button
                    type="button"
                    onClick={handleOpenBadgesSection}
                    className="px-4 py-3.5 rounded-xl bg-[#FAF8F5] hover:bg-teal-50/50 border border-stone-200/90 hover:border-teal-200/90 text-left cursor-pointer group transition-all flex flex-col justify-between gap-2 sm:min-w-[255px]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                            Badges acquis
                          </span>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-xl font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                              {unlockedBadges.length}/{badges.length}
                            </span>
                            <span className="text-xs font-medium text-slate-500">
                              paliers
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-lg bg-teal-800/10 text-teal-900 border border-teal-200/60 text-xs font-bold shrink-0">
                        {userPoints} pts
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="h-1.5 w-full rounded-full bg-stone-200/90 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-teal-700 transition-all duration-500"
                          style={{ width: `${Math.max(8, progressToNext)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="text-slate-600 font-medium truncate">
                          {nextBadge
                            ? `Prochain : ${nextBadge.icon} ${nextBadge.name}`
                            : '👑 Tous les paliers acquis'}
                        </span>
                        <span className="text-teal-800 font-semibold shrink-0">
                          {nextBadge ? `${userPoints}/${nextBadge.requiredPoints} pts` : 'Complet'}
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </section>

            {/* 2. Barre d'onglets (3 onglets clairs : Favoris, Informations & Préférences, Badges) */}
            <div className="flex items-center gap-2 border-b border-stone-200/90 overflow-x-auto no-scrollbar">
              {[
                { id: 'favorites', label: `Mes Favoris (${favoritePlaces.length})`, icon: Heart },
                { id: 'settings', label: 'Mes informations & préférences', icon: Settings },
                { id: 'badges', label: `Mes Badges (${unlockedBadges.length}/${badges.length})`, icon: Award }
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id as AccountTab)}
                    className={`inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer -mb-px ${
                      active
                        ? 'border-teal-700 text-teal-800'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.id === 'settings' && hasUnsavedChanges && (
                      <span
                        className="w-2 h-2 rounded-full bg-amber-500 shrink-0"
                        title="Modifications non enregistrées"
                      />
                    )}
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
                ONGLET 2 : MES INFORMATIONS & PRÉFÉRENCES (UN SEUL BLOC AÉRÉ, LISIBLE ET BIEN AGENCÉ)
                ======================================================= */}
            {activeTab === 'settings' && (
              <section>
                <form
                  onSubmit={handleSaveProfile}
                  className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden"
                >
                  {/* En-tête principal aéré */}
                  <div className="px-6 sm:px-10 py-6 sm:py-7 border-b border-stone-200/80 bg-[#FAF8F5]/60 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        Mon profil & mes préférences
                      </h2>
                      <p className="text-sm text-slate-600 mt-1">
                        Personnalisez votre identité, votre ville d&apos;attache en Martinique et vos activités favorites.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-stone-200/90 text-xs sm:text-sm text-slate-600 shadow-2xs">
                      <MapPin className="w-4 h-4 text-[#C84B31] shrink-0" />
                      <span>
                        Ville actuelle : <strong className="text-slate-900">{prefs.baseCommune}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-10 space-y-10">
                    {/* 1. IDENTITÉ & PHOTO DE PROFIL */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/70 flex items-center justify-center text-teal-800">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900">
                            Identité & photo de profil
                          </h3>
                        </div>
                      </div>

                      {/* 6 vignettes sur 1 seule ligne de 6 colonnes (aucun élément orphelin) */}
                      <div className="space-y-2.5">
                        <label className="text-sm font-semibold text-slate-800 block">
                          Choisissez l&apos;image associée à votre profil
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                          {AVATAR_PRESETS.map(preset => {
                            const isSelected = prefs.avatarPhoto === preset.url;
                            return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => setPrefs(prev => ({ ...prev, avatarPhoto: preset.url }))}
                                className={`group p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                                  isSelected
                                    ? 'border-teal-700 bg-teal-50/60 ring-2 ring-teal-700/20 shadow-2xs'
                                    : 'border-stone-200/90 hover:border-stone-300 bg-white hover:bg-stone-50/50'
                                }`}
                              >
                                <div className="w-full h-20 sm:h-24 rounded-xl overflow-hidden bg-teal-800 text-white flex items-center justify-center font-bold text-2xl relative">
                                  {preset.url ? (
                                    <img
                                      src={preset.url}
                                      alt={preset.label}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  ) : (
                                    <span>{nameInput ? nameInput.charAt(0).toUpperCase() : 'M'}</span>
                                  )}
                                  {isSelected && (
                                    <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-teal-800 text-white flex items-center justify-center shadow-xs">
                                      <Check className="w-3 h-3" />
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={`text-xs sm:text-sm font-semibold ${
                                    isSelected ? 'text-teal-950' : 'text-slate-700'
                                  }`}
                                >
                                  {preset.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Nom, Email et Courte présentation bien lisibles */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-800 block">
                            Prénom & Nom (ou pseudo)
                          </label>
                          <input
                            type="text"
                            required
                            value={nameInput}
                            onChange={e => setNameInput(e.target.value)}
                            placeholder="Votre nom ou pseudo"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200/90 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-800 block">
                            Adresse email du compte
                          </label>
                          <input
                            type="email"
                            disabled
                            value={currentUser.email}
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-100/80 text-sm sm:text-base text-slate-500 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800 block">
                          Courte présentation
                        </label>
                        <textarea
                          rows={2}
                          value={prefs.bio}
                          onChange={e => setPrefs(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Ce que vous aimez découvrir en Martinique (plages, randonnées, plongée...)"
                          className="w-full px-4 py-3 rounded-xl border border-stone-200/90 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                        />
                      </div>
                    </div>

                    <hr className="border-stone-200/80" />

                    {/* 2. ANCRAGE EN MARTINIQUE & ACTIVITÉS FAVORITES */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/70 flex items-center justify-center text-teal-800">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900">
                            Ancrage en Martinique & centres d&apos;intérêt
                          </h3>
                        </div>
                      </div>

                      {/* 3 grands menus déroulants alignés sur 3 colonnes */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-800 block">
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

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-800 block">
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

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-800 block">
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

                      {/* 8 activités alignées proprement en grille de 4 colonnes x 2 lignes */}
                      <div className="space-y-3 pt-1">
                        {(() => {
                          const selectedCount = INTEREST_OPTIONS.filter(item =>
                            prefs.interests.includes(item)
                          ).length;
                          return (
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-semibold text-slate-800">
                                Vos activités favorites sur l&apos;île
                              </label>
                              <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                  selectedCount > 0
                                    ? 'text-teal-800 bg-teal-50'
                                    : 'text-slate-500 bg-stone-100'
                                }`}
                              >
                                {selectedCount === 0
                                  ? 'Aucune sélectionnée'
                                  : `${selectedCount} sélectionnée${selectedCount > 1 ? 's' : ''}`}
                              </span>
                            </div>
                          );
                        })()}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {INTEREST_OPTIONS.map(item => {
                            const active = prefs.interests.includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => toggleInterest(item)}
                                className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                  active
                                    ? 'bg-teal-800 text-white border-teal-800 shadow-2xs'
                                    : 'bg-[#FAF8F5]/70 text-slate-700 border-stone-200/90 hover:bg-stone-100/80 hover:border-stone-300'
                                }`}
                              >
                                <span>{item}</span>
                                <span
                                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                                    active
                                      ? 'bg-white/20 text-white'
                                      : 'border border-stone-300 bg-white text-transparent'
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Barre de validation en bas */}
                  <div className="px-6 sm:px-10 py-5 bg-[#FAF8F5] border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                      {hasUnsavedChanges ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                          <span className="font-semibold text-amber-900">
                            {changedFields.length} modification{changedFields.length > 1 ? 's' : ''} en attente — cliquez sur Enregistrer pour sauvegarder.
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                          <span className="text-slate-600">
                            Toutes vos informations et préférences sont enregistrées.
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {hasUnsavedChanges && (
                        <button
                          type="button"
                          onClick={handleDiscardChanges}
                          disabled={isSaving}
                          className="px-4 py-3 rounded-xl bg-white hover:bg-stone-100 text-slate-700 border border-stone-200/90 text-xs sm:text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Annuler</span>
                        </button>
                      )}

                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-7 py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isSaving ? 'Enregistrement...' : 'Enregistrer mes modifications'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </section>
            )}

            {/* =======================================================
                ONGLET 3 : MES BADGES & PROGRESSION LONG TERME (CARNET DE VOYAGE MADININA)
                ======================================================= */}
            {activeTab === 'badges' && (
              <div id="reperes-exploration" className="space-y-8">
                {/* 1. HERO PASSEPORT D'EXPLORATEUR */}
                <div className="bg-[#FAF7F2] rounded-3xl border border-stone-200/90 shadow-2xs p-6 sm:p-9 relative overflow-hidden">
                  {/* Filigrane décoratif subtil */}
                  <div className="absolute -right-8 -bottom-8 w-64 h-64 rounded-full bg-teal-900/[0.03] pointer-events-none select-none flex items-center justify-center">
                    <Compass className="w-48 h-48 text-teal-900/10" />
                  </div>

                  <div className="relative z-10 space-y-7">
                    {/* Ligne haute : Médaillon + Titre + Carte de points */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-center gap-4 sm:gap-5">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-2 border-amber-300/80 shadow-xs flex flex-col items-center justify-center shrink-0 relative group">
                          <span className="text-3xl sm:text-4xl drop-shadow-xs">
                            {currentRankBadge ? currentRankBadge.icon : '🧭'}
                          </span>
                          <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-extrabold uppercase tracking-widest shadow-2xs">
                            {currentRankBadge ? currentRankBadge.tier : 'Départ'}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-teal-900/70 block">
                            Passeport de l&apos;Explorateur · Madinina
                          </span>
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {currentRankBadge ? currentRankBadge.name : 'Initié de Madinina'}
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600">
                            {unlockedBadges.length} sur {badges.length} sceaux débloqués ·{' '}
                            <strong className="text-teal-900 font-semibold">{userPoints} points d&apos;exploration</strong>
                          </p>
                        </div>
                      </div>

                      {/* Carte métrique d'avancement vers le prochain jalon */}
                      <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-stone-200/90 p-4 sm:p-5 lg:min-w-[300px] space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600">
                            Prochain jalon de route
                          </span>
                          <span className="font-bold text-teal-900">
                            {userPoints} / {nextBadge ? nextBadge.requiredPoints : 1200} pts
                          </span>
                        </div>

                        <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-teal-800 to-teal-600 transition-all duration-700"
                            style={{ width: `${Math.max(6, progressToNext)}%` }}
                          />
                        </div>

                        <p className="text-xs text-slate-500 leading-snug">
                          {nextBadge ? (
                            <>
                              Encore{' '}
                              <strong className="text-teal-900 font-bold">
                                {Math.max(0, nextBadge.requiredPoints - userPoints)} pts
                              </strong>{' '}
                              pour décrocher le sceau « {nextBadge.name} » ({nextBadge.tier}).
                            </>
                          ) : (
                            <span className="text-teal-900 font-bold">
                              👑 Vous avez conquis l&apos;ensemble des distinctions de l&apos;île !
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Frise chronologique stylisée des 6 Sceaux de l'île */}
                    <div className="pt-2 border-t border-stone-200/70">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                        {badges.map((b, idx) => {
                          const reached = b.unlocked || userPoints >= b.requiredPoints;
                          const isCurrentTarget = nextBadge?.id === b.id;

                          return (
                            <div
                              key={b.id}
                              className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between gap-1.5 ${
                                reached
                                  ? 'bg-white border-teal-200 shadow-2xs text-slate-900'
                                  : isCurrentTarget
                                  ? 'bg-amber-50/70 border-amber-300 text-slate-900 ring-1 ring-amber-300/50'
                                  : 'bg-white/50 border-stone-200/70 text-slate-500 opacity-80'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-lg">{b.icon}</span>
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    reached
                                      ? 'bg-teal-50 text-teal-900'
                                      : isCurrentTarget
                                      ? 'bg-amber-100 text-amber-900'
                                      : 'bg-stone-100 text-slate-500'
                                  }`}
                                >
                                  {reached ? '✓ Sceau' : `${b.requiredPoints}p`}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                                  Étape {idx + 1}
                                </span>
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {b.name}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. LE GUIDE D'ACTION DU VOYAGEUR (LES 4 VOIES DE PROGRESSION) */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      Comment enrichir votre carnet d&apos;exploration ?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Chaque retour d&apos;expérience et lieu sauvegardé participe à la communauté.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Voie 1 : Dénicher & Sauvegarder */}
                    <div className="p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-rose-300 transition-all flex flex-col justify-between gap-4 group shadow-2xs">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/70 text-[#C84B31] flex items-center justify-center">
                            <Heart className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-[#C84B31] bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">
                            +10 à +30 pts
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#C84B31] transition-colors">
                          Dénicher & Sauvegarder
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Sauvegardez vos criques secrètes, anses volcaniques et bonnes tables. Compléter votre profil rapporte aussi <strong>+30 pts</strong>.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => guardNavigation(() => router.push('/carte'))}
                        className="text-xs font-semibold text-slate-700 hover:text-teal-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer pt-2 border-t border-stone-100"
                      >
                        <span>Parcourir la carte</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Voie 2 : Témoigner & Immortaliser */}
                    <div className="p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-teal-300 transition-all flex flex-col justify-between gap-4 group shadow-2xs">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/70 text-teal-800 flex items-center justify-center">
                            <Camera className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
                            +20 pts / post
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                          Témoigner & Immortaliser
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Racontez vos rencontres matinales avec les tortues, vos couchers de soleil et vos photos du jour dans le fil Communauté.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => guardNavigation(() => router.push('/?page=community'))}
                        className="text-xs font-semibold text-slate-700 hover:text-teal-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer pt-2 border-t border-stone-100"
                      >
                        <span>Ouvrir la communauté</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Voie 3 : Veiller sur le Littoral */}
                    <div className="p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-sky-300 transition-all flex flex-col justify-between gap-4 group shadow-2xs">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200/70 text-sky-800 flex items-center justify-center">
                            <Waves className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200/60">
                            +25 pts / relevé
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                          Veiller sur le Littoral
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Signalez en direct l&apos;état de la mer, la clarté de l&apos;eau ou l&apos;absence de sargasses pour guider les prochains baigneurs.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => guardNavigation(() => router.push('/meteo-plages'))}
                        className="text-xs font-semibold text-slate-700 hover:text-teal-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer pt-2 border-t border-stone-100"
                      >
                        <span>Météo des plages</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Voie 4 : Transmettre & Conseiller */}
                    <div className="p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-amber-300 transition-all flex flex-col justify-between gap-4 group shadow-2xs">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 flex items-center justify-center">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                            +15 à +30 pts
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                          Transmettre & Conseiller
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Partagez vos conseils avisés sur le forum d&apos;entraide ou référencez une adresse confidentielle hors des sentiers battus.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => guardNavigation(() => router.push('/?page=community'))}
                        className="text-xs font-semibold text-slate-700 hover:text-teal-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer pt-2 border-t border-stone-100"
                      >
                        <span>Rejoindre le forum</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. LA GALERIE DES 6 SCEAUX D'EXPLORATION (COLLECTIBLES) */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      Les 6 Sceaux de Madinina
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Distinctions permanentes conservées au fil de toutes vos visites.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {badges.map(badge => {
                      const isUnlocked = badge.unlocked || userPoints >= badge.requiredPoints;
                      const isNextTarget = nextBadge?.id === badge.id;
                      const currentPtsForBadge = Math.min(userPoints, badge.requiredPoints);
                      const pct = Math.min(
                        100,
                        Math.round((currentPtsForBadge / badge.requiredPoints) * 100)
                      );

                      return (
                        <div
                          key={badge.id}
                          className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between gap-5 transition-all ${
                            isUnlocked
                              ? 'bg-white border-teal-200 shadow-xs'
                              : isNextTarget
                              ? 'bg-white border-amber-300 ring-2 ring-amber-300/30 shadow-xs'
                              : 'bg-[#FAF8F5]/80 border-stone-200/80 text-slate-600'
                          }`}
                        >
                          <div className="space-y-4">
                            {/* En-tête de carte : Sceau stylisé + Statut */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3.5">
                                <div
                                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-transform ${
                                    isUnlocked
                                      ? 'bg-teal-50 border border-teal-200/80 shadow-2xs'
                                      : isNextTarget
                                      ? 'bg-amber-50 border border-amber-300'
                                      : 'bg-stone-100 border border-stone-200/80 opacity-70'
                                  }`}
                                >
                                  <span>{badge.icon}</span>
                                </div>

                                <div>
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                                    {badge.tier} · {badge.categoryLabel}
                                  </span>
                                  <h4 className="text-base font-extrabold text-slate-900 mt-0.5 leading-snug">
                                    {badge.name}
                                  </h4>
                                </div>
                              </div>

                              <span
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                                  isUnlocked
                                    ? 'bg-teal-800 text-white shadow-2xs'
                                    : isNextTarget
                                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                    : 'bg-stone-200/70 text-slate-500'
                                }`}
                              >
                                {isUnlocked
                                  ? '✓ Sceau acquis'
                                  : isNextTarget
                                  ? 'En cours'
                                  : `${badge.requiredPoints} pts`}
                              </span>
                            </div>

                            {/* Récit du badge */}
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {badge.description}
                            </p>

                            {/* Encadré parchemin : Condition de déblocage */}
                            {badge.howToEarn && (
                              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80 space-y-1">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-900">
                                  <Compass className="w-3 h-3" />
                                  <span>Condition d&apos;obtention</span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {badge.howToEarn}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Jauge de progression individuelle */}
                          <div className="space-y-1.5 pt-2 border-t border-stone-100">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-900">
                                {currentPtsForBadge} / {badge.requiredPoints} pts
                              </span>
                              <span
                                className={`font-semibold ${
                                  isUnlocked ? 'text-teal-800' : 'text-slate-500'
                                }`}
                              >
                                {isUnlocked
                                  ? 'Objectif atteint'
                                  : `Encore ${badge.requiredPoints - currentPtsForBadge} pts (${pct}%)`}
                              </span>
                            </div>

                            <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isUnlocked
                                    ? 'bg-teal-800'
                                    : isNextTarget
                                    ? 'bg-amber-500'
                                    : 'bg-stone-300'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer onNavigate={handleNavSection} />
    </div>
  );
}
