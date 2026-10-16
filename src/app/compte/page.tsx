'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Heart,
  Award,
  MapPin,
  Shield,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  Compass,
  Star,
  Calendar,
  Plus,
  MessageSquare,
  Bell,
  Settings,
  Check,
  BookOpen,
  Waves,
  Lock,
  Mail,
  Sun,
  Printer,
  CheckSquare,
  ChevronUp,
  ChevronDown,
  Send
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import LogoIcon from '@/components/ui/LogoIcon';
import { MARTINIQUE_COMMUNES as COMMUNES_LIST } from '@/data/communes';

type AccountTab = 'favorites' | 'itinerary' | 'checklist' | 'activity' | 'settings';

interface UserPreferences {
  travelerType: 'Voyageur en séjour' | 'Habitant de Martinique' | 'Futur résident / Retraite';
  baseCommune: string;
  stayDuration: string;
  bio: string;
  avatarEmoji: string;
  notifications: {
    beachWeather: boolean;
    sargassumAlerts: boolean;
    turtleSeason: boolean;
    localEvents: boolean;
  };
}

interface ChecklistItem {
  id: string;
  category: 'Snorkeling & Plage' | 'Randonnée & Nord' | 'Vie pratique';
  label: string;
  tip: string;
  checked: boolean;
}

const DEFAULT_PREFS: UserPreferences = {
  travelerType: 'Voyageur en séjour',
  baseCommune: 'Sainte-Luce',
  stayDuration: '10 à 15 jours',
  bio: 'Passionné par les plages du Sud-Caraïbe, le snorkeling avec les tortues et la randonnée.',
  avatarEmoji: '🐢',
  notifications: {
    beachWeather: true,
    sargassumAlerts: true,
    turtleSeason: true,
    localEvents: false
  }
};

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: 'chk-1',
    category: 'Snorkeling & Plage',
    label: 'Masque et tuba personnels',
    tip: 'Indispensables dès le bord à Anse Dufour, Anse Noire et Anse Figuier.',
    checked: true
  },
  {
    id: 'chk-2',
    category: 'Snorkeling & Plage',
    label: 'T-shirt anti-UV à manches longues (Lyca)',
    tip: 'Protège du soleil intense aux Fonds Blancs sans polluer les récifs avec de la crème.',
    checked: true
  },
  {
    id: 'chk-3',
    category: 'Snorkeling & Plage',
    label: 'Pochette étanche pour téléphone / clés',
    tip: 'Très utile pour les sorties kayak au Robert ou bateau au François.',
    checked: false
  },
  {
    id: 'chk-4',
    category: 'Snorkeling & Plage',
    label: 'Chaussures d’eau légères',
    tip: 'Pratiques pour les galets volcaniques du Nord ou les fonds rocheux.',
    checked: false
  },
  {
    id: 'chk-5',
    category: 'Randonnée & Nord',
    label: 'Coupe-vent imperméable léger',
    tip: 'Au sommet de la Montagne Pelée (1 397 m), il fait souvent 15–16°C avec du vent.',
    checked: false
  },
  {
    id: 'chk-6',
    category: 'Randonnée & Nord',
    label: 'Chaussures de marche crantées',
    tip: 'Les sentiers de la Trace des Jésuites et de la Pelée peuvent être humides et glissants.',
    checked: true
  },
  {
    id: 'chk-7',
    category: 'Randonnée & Nord',
    label: 'Gourde isotherme (1,5 L minimum par personne)',
    tip: 'Indispensable sur la presqu’île de la Caravelle et la Trace des Caps.',
    checked: true
  },
  {
    id: 'chk-8',
    category: 'Randonnée & Nord',
    label: 'Répulsif moustiques zones tropicales',
    tip: 'Surtout utile en fin d’après-midi dès 17h30 et après les averses.',
    checked: false
  },
  {
    id: 'chk-9',
    category: 'Vie pratique',
    label: 'Permis de conduire original',
    tip: 'Obligatoire pour récupérer votre voiture de location à l’aéroport Aimé Césaire.',
    checked: true
  },
  {
    id: 'chk-10',
    category: 'Vie pratique',
    label: 'Un peu d’espèces (euros)',
    tip: 'Pratique pour les marchands de fruits, l’eau de coco au bord de la route et les petits lolos.',
    checked: false
  },
  {
    id: 'chk-11',
    category: 'Vie pratique',
    label: 'Sac isotherme souple',
    tip: 'Pour garder vos boissons fraîches et fruits du marché lors des journées plage.',
    checked: false
  }
];

const AVATAR_OPTIONS = ['🐢', '🌴', '⛵', '🌺', '🤿', '🦜', '☀️', '🧭'];

const CATEGORY_LABELS: Record<string, string> = {
  beach: 'Plage',
  snorkeling: 'Snorkeling',
  activity: 'Activité',
  hiking: 'Randonnée',
  excursion: 'Sortie en mer',
  restaurant: 'Restaurant',
  accommodation: 'Hébergement',
  bar: 'Bar & Lounge',
  event: 'Événement',
  photo: 'Point photo',
  viewpoint: 'Belvédère',
  hidden_gem: 'Crique secrète'
};

function getWeatherForCommune(commune: string) {
  const atlantic = ['Le François', 'Le Robert', 'Le Vauclin', 'La Trinité', 'Sainte-Marie', 'Macouba', 'Basse-Pointe', 'Le Lorrain', 'Marigot'];
  const north = ['Saint-Pierre', 'Le Carbet', 'Le Prêcheur', 'Le Morne-Rouge', "L'Ajoupa-Bouillon", 'Fonds-Saint-Denis', "Grand'Rivière", 'Bellefontaine'];
  if (atlantic.includes(commune)) {
    return {
      sector: 'Façade Atlantique',
      tempAir: '29°C',
      tempWater: '28°C',
      sea: 'Lagon abrité · Alizé 15 nds',
      advice: 'Idéal pour les Fonds Blancs, le kitesurf ou la Caravelle'
    };
  }
  if (north.includes(commune)) {
    return {
      sector: 'Nord Caraïbe & Pelée',
      tempAir: '28°C',
      tempWater: '27°C',
      sea: 'Mer très claire · Sommet dégagé tôt',
      advice: 'Parfait pour randonner à 7h puis se baigner à Anse Céron'
    };
  }
  return {
    sector: 'Côte Sud-Caraïbe',
    tempAir: '30°C',
    tempWater: '28°C',
    sea: 'Mer calme · Zéro sargasse',
    advice: 'Excellente visibilité ce matin pour la baignade et les tortues'
  };
}

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
    itinerary,
    addToItinerary,
    removeFromItinerary,
    posts,
    addPost,
    deletePost,
    alerts,
    forumTopics,
    userPoints,
    badges,
    language,
    setLanguage
  } = useApp();

  const [activeTab, setActiveTab] = useState<AccountTab>('favorites');
  const [favCategoryFilter, setFavCategoryFilter] = useState<string>('all');

  // Auth states when not logged in
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Profile & Preferences form states
  const [nameInput, setNameInput] = useState('');
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Itinerary custom state (extra days, custom titles, custom notes)
  const [extraDaysCount, setExtraDaysCount] = useState(0);
  const [dayTitles, setDayTitles] = useState<Record<number, string>>({});
  const [dayNotes, setDayNotes] = useState<Record<number, string>>({
    1: 'Arriver avant 9h30 aux Salines pour profiter de l’ombre sous les cocotiers.',
    2: 'Mise à l’eau dès 8h00 à Anse Dufour pour observer les tortues vertes au calme.',
    3: 'Sortie bateau vers la Baignoire de Joséphine et les îlets du François (prévoir t-shirt anti-UV).'
  });
  const [selectedDayForAdd, setSelectedDayForAdd] = useState<number>(1);
  const [selectedPlaceToAdd, setSelectedPlaceToAdd] = useState<string>('');

  // Checklist & Visited Places (Passport)
  const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
  const [newChecklistLabel, setNewChecklistLabel] = useState('');
  const [newChecklistCategory, setNewChecklistCategory] = useState<ChecklistItem['category']>('Snorkeling & Plage');
  const [visitedIds, setVisitedIds] = useState<string[]>(['salines', 'anse-dufour', 'spot-ponton-anses-arlet']);

  // Quick Post from Account
  const [quickPostText, setQuickPostText] = useState('');
  const [quickPostLocation, setQuickPostLocation] = useState('Les Anses-d\'Arlet');

  useEffect(() => {
    if (currentUser) {
      setNameInput(currentUser.name || '');
    }
    try {
      const savedPrefs = localStorage.getItem('mq_user_prefs');
      if (savedPrefs) {
        setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(savedPrefs) });
      }
      const savedNotes = localStorage.getItem('mq_itinerary_notes');
      if (savedNotes) {
        setDayNotes(prev => ({ ...prev, ...JSON.parse(savedNotes) }));
      }
      const savedTitles = localStorage.getItem('mq_itinerary_titles');
      if (savedTitles) {
        setDayTitles(JSON.parse(savedTitles));
      }
      const savedChecklist = localStorage.getItem('mq_user_checklist');
      if (savedChecklist) {
        setChecklist(JSON.parse(savedChecklist));
      }
      const savedVisited = localStorage.getItem('mq_visited_places');
      if (savedVisited) {
        setVisitedIds(JSON.parse(savedVisited));
      }
    } catch {
      // Ignore SSR/localStorage errors
    }
  }, [currentUser]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3200);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 3800);
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
          showSuccess('Connexion réussie. Bienvenue sur votre espace !');
        } else {
          showError(res.error || 'Identifiants incorrects.');
        }
      } else {
        const res = await signup(authName || 'Voyageur', authEmail, authPassword || undefined);
        if (res.success) {
          showSuccess('Votre compte a bien été créé !');
        } else {
          showError(res.error || 'Erreur lors de la création du compte.');
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
        localStorage.setItem('mq_user_prefs', JSON.stringify(prefs));
      } catch {
        // ignore
      }
      if (res.success) {
        showSuccess('Votre profil et vos préférences ont été enregistrés.');
      } else {
        showError(res.error || 'Erreur lors de la sauvegarde.');
      }
    } catch (err: any) {
      showError(err.message || 'Une erreur est survenue.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleNoteChange = (dayNum: number, val: string) => {
    const updated = { ...dayNotes, [dayNum]: val };
    setDayNotes(updated);
    try {
      localStorage.setItem('mq_itinerary_notes', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleTitleChange = (dayNum: number, val: string) => {
    const updated = { ...dayTitles, [dayNum]: val };
    setDayTitles(updated);
    try {
      localStorage.setItem('mq_itinerary_titles', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAddPlaceToDay = (dayNum: number, placeId: string) => {
    const found = places.find(p => p.id === placeId);
    if (!found) return;
    addToItinerary(dayNum, found);
    showSuccess(`« ${found.name} » a été ajouté au Jour ${dayNum}.`);
  };

  const handleApplyTemplate = (templateType: 'south' | 'complete' | 'family') => {
    const clearDay = (dayNum: number) => {
      const d = itinerary.find(item => item.dayNumber === dayNum);
      if (d) {
        d.places.forEach(p => removeFromItinerary(dayNum, p.id));
      }
    };
    [1, 2, 3].forEach(clearDay);

    if (templateType === 'south') {
      handleAddPlaceToDay(1, 'salines');
      handleAddPlaceToDay(1, 'pointe-marin');
      handleAddPlaceToDay(2, 'anse-dufour');
      handleAddPlaceToDay(2, 'anse-noire');
      handleAddPlaceToDay(2, 'ti-sable');
      handleAddPlaceToDay(3, 'diamant');
      handleAddPlaceToDay(3, 'spot-memorial-cap110');
      handleTitleChange(1, 'Jour 1 : Sainte-Anne & Grande Anse des Salines');
      handleTitleChange(2, 'Jour 2 : Tortues aux Anses-d’Arlet & Grande Anse');
      handleTitleChange(3, 'Jour 3 : Baie du Diamant & Cap 110');
      showSuccess('Modèle « Trésors du Sud-Caraïbe » appliqué à votre carnet.');
    } else if (templateType === 'complete') {
      handleAddPlaceToDay(1, 'salines');
      handleAddPlaceToDay(1, 'belvedere-morne-gommier');
      handleAddPlaceToDay(2, 'anse-dufour');
      handleAddPlaceToDay(2, 'spot-ponton-anses-arlet');
      handleAddPlaceToDay(3, 'montagne-pelee');
      handleAddPlaceToDay(3, 'anse-couleuvre');
      handleTitleChange(1, 'Jour 1 : Plages du Sud & Panorama Morne Gommier');
      handleTitleChange(2, 'Jour 2 : Snorkeling Tortues & Village des Anses-d’Arlet');
      handleTitleChange(3, 'Jour 3 : Montagne Pelée & Sable Noir au Prêcheur');
      showSuccess('Modèle « Grand Tour Sud & Nord Volcanique » appliqué.');
    } else {
      handleAddPlaceToDay(1, 'pointe-marin');
      handleAddPlaceToDay(1, 'anse-figuier');
      handleAddPlaceToDay(2, 'grande-anse-arlet');
      handleAddPlaceToDay(2, 'excursion-kayak-mangrove');
      handleAddPlaceToDay(3, 'baignoire-josephine');
      handleTitleChange(1, 'Jour 1 : Lagons sans vagues (Pointe Marin & Anse Figuier)');
      handleTitleChange(2, 'Jour 2 : Tortues à Grande Anse & Kayak en Mangrove');
      handleTitleChange(3, 'Jour 3 : Baignade aux Fonds Blancs du François');
      showSuccess('Modèle « Séjour Famille & Eaux Calmes » appliqué.');
    }
  };

  const toggleChecklistItem = (id: string) => {
    const updated = checklist.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updated);
    try {
      localStorage.setItem('mq_user_checklist', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistLabel.trim()) return;
    const newItem: ChecklistItem = {
      id: 'chk-' + Date.now(),
      category: newChecklistCategory,
      label: newChecklistLabel.trim(),
      tip: 'Ajouté à votre liste personnelle',
      checked: false
    };
    const updated = [...checklist, newItem];
    setChecklist(updated);
    setNewChecklistLabel('');
    try {
      localStorage.setItem('mq_user_checklist', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showSuccess('Élément ajouté à votre checklist de voyage.');
  };

  const handleDeleteChecklistItem = (id: string) => {
    const updated = checklist.filter(item => item.id !== id);
    setChecklist(updated);
    try {
      localStorage.setItem('mq_user_checklist', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const toggleVisitedPlace = (placeId: string) => {
    const updated = visitedIds.includes(placeId)
      ? visitedIds.filter(id => id !== placeId)
      : [...visitedIds, placeId];
    setVisitedIds(updated);
    try {
      localStorage.setItem('mq_visited_places', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleQuickPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPostText.trim()) return;
    addPost(quickPostText.trim(), quickPostLocation, '/images/spots/anse-dufour.jpg', '#DirectPlage');
    setQuickPostText('');
    showSuccess('Votre observation a été publiée dans la Communauté (+20 XP).');
  };

  // Données calculées
  const favoritePlaces = places.filter(place => favorites.includes(place.id));
  const filteredFavorites = favoritePlaces.filter(p => {
    if (favCategoryFilter === 'all') return true;
    if (favCategoryFilter === 'beach') return p.category === 'beach' || p.category === 'hidden_gem';
    if (favCategoryFilter === 'snorkeling') return p.category === 'snorkeling';
    if (favCategoryFilter === 'nature') return p.category === 'hiking' || p.category === 'activity' || p.category === 'excursion';
    if (favCategoryFilter === 'food') return p.category === 'restaurant' || p.category === 'bar' || p.category === 'accommodation';
    return true;
  });

  const suggestedPlaces = places
    .filter(p => !favorites.includes(p.id) && p.featured)
    .slice(0, 3);

  const totalItineraryPlaces = itinerary.reduce((sum, day) => sum + day.places.length, 0);
  const unlockedBadges = badges.filter(b => b.unlocked || userPoints >= b.requiredPoints);
  const checkedCount = checklist.filter(i => i.checked).length;
  const checklistPct = checklist.length > 0 ? Math.round((checkedCount / checklist.length) * 100) : 0;

  const communeWeather = getWeatherForCommune(prefs.baseCommune);

  // Contributions de l'utilisateur ou récentes
  const userPosts = posts.slice(0, 3);
  const userAlerts = alerts.slice(0, 3);
  const userQuestions = forumTopics.slice(0, 2);

  // Liste des journées
  const maxExistingDay = itinerary.reduce((m, d) => Math.max(m, d.dayNumber), 3);
  const totalDaysCount = maxExistingDay + extraDaysCount;
  const allDays = Array.from({ length: totalDaysCount }, (_, idx) => {
    const dayNumber = idx + 1;
    const existing = itinerary.find(d => d.dayNumber === dayNumber);
    return (
      existing || {
        dayNumber,
        title: `Jour ${dayNumber} : Étape à composer`,
        places: []
      }
    );
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      {/* Notifications Toast */}
      {successMsg && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg bg-teal-800 text-white flex items-center gap-2.5 text-xs sm:text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-200" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg bg-rose-700 text-white flex items-center gap-2.5 text-xs sm:text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-200" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Barre de navigation supérieure sobre et cohérente */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>

            <Link href="/" className="flex items-center gap-2.5">
              <LogoIcon className="w-8 h-8 rounded-lg" />
              <span className="font-semibold text-slate-900 text-base hidden sm:inline">
                Martinique <span className="font-normal text-teal-700">Explorer</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <Link href="/" className="hover:text-teal-700 transition-colors">
              Accueil
            </Link>
            <Link href="/?page=beaches" className="hover:text-teal-700 transition-colors">
              Plages
            </Link>
            <Link href="/?page=snorkeling" className="hover:text-teal-700 transition-colors">
              Snorkeling
            </Link>
            <Link href="/?page=map" className="hover:text-teal-700 transition-colors">
              Carte
            </Link>
            <Link href="/?page=blog" className="hover:text-teal-700 transition-colors">
              Actualités
            </Link>
            <Link href="/?page=community" className="hover:text-teal-700 transition-colors">
              Communauté
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            {userRole === 'admin' && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100 text-xs font-semibold transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Administration</span>
              </Link>
            )}
            {currentUser && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-medium transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 text-left">
        {/* CAS 1 : UTILISATEUR NON CONNECTÉ */}
        {!currentUser ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs my-8">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/60 text-teal-800 flex items-center justify-center mx-auto">
                <User className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Votre espace Martinique Explorer
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connectez-vous pour retrouver vos plages favorites, organiser votre carnet de séjour, préparer votre valise et suivre la météo de votre commune.
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
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`py-2 rounded-lg transition-colors cursor-pointer ${
                  authMode === 'signup' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Créer un compte
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Prénom ou pseudo
                  </label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    placeholder="Ex: Camille"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-700"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="vous@exemple.fr"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Mot de passe <span className="text-slate-400 font-normal">(optionnel en mode découverte)</span>
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
                className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {authLoading
                  ? 'Connexion...'
                  : authMode === 'login'
                  ? 'Accéder à mon compte'
                  : 'Créer mon compte gratuitement'}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => login('voyageur@martinique-explorer.fr')}
                className="text-xs text-teal-700 hover:text-teal-800 font-semibold underline cursor-pointer"
              >
                Continuer directement avec un profil visiteur de démonstration
              </button>
            </div>
          </div>
        ) : (
          /* CAS 2 : UTILISATEUR CONNECTÉ -> ESPACE COMPTE COMPLET & SIMPLE */
          <>
            {/* 1. EN-TÊTE DU PROFIL, MÉTÉO DE SA COMMUNE ET CHIFFRES CLÉS */}
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-800 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold shrink-0">
                      {prefs.avatarEmoji || (currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'M')}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        {currentUser.name}
                      </h1>
                      {userRole === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                          <Shield className="w-3 h-3 text-amber-700" />
                          Administrateur
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/70">
                          {prefs.travelerType}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        <MapPin className="w-3 h-3 text-teal-700" />
                        {prefs.baseCommune}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-500">
                      {currentUser.email} · Rythme : {prefs.stayDuration}
                    </p>

                    {prefs.bio && (
                      <p className="text-xs sm:text-sm text-slate-600 max-w-xl pt-0.5">
                        {prefs.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Encadré Météo en direct de sa commune de base */}
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/90 lg:max-w-xs w-full space-y-1.5 shrink-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-teal-800 inline-flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Météo à {prefs.baseCommune}
                    </span>
                    <span className="text-[11px] font-medium text-stone-500">
                      {communeWeather.sector}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-900">
                    <span>Air {communeWeather.tempAir}</span>
                    <span>·</span>
                    <span>Mer {communeWeather.tempWater}</span>
                    <span>·</span>
                    <span className="text-teal-800">{communeWeather.sea}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {communeWeather.advice}
                  </p>
                </div>
              </div>

              {/* 5 cartes de synthèse cliquables */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-slate-100 print:hidden">
                <button
                  type="button"
                  onClick={() => setActiveTab('favorites')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeTab === 'favorites'
                      ? 'bg-teal-50/70 border-teal-700/50'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Favoris</span>
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    {favoritePlaces.length} lieux
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Plages & adresses
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('itinerary')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeTab === 'itinerary'
                      ? 'bg-teal-50/70 border-teal-700/50'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Programme</span>
                    <Calendar className="w-3.5 h-3.5 text-teal-700" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    {allDays.length} jours
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {totalItineraryPlaces} étapes prévues
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('checklist')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeTab === 'checklist'
                      ? 'bg-teal-50/70 border-teal-700/50'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Valise & Lieux</span>
                    <CheckSquare className="w-3.5 h-3.5 text-teal-700" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    {checklistPct}% prêt
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {visitedIds.length} lieux déjà visités
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('activity')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeTab === 'activity'
                      ? 'bg-teal-50/70 border-teal-700/50'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Badges</span>
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    {unlockedBadges.length} / {badges.length}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {userPoints} points XP
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                    activeTab === 'settings'
                      ? 'bg-teal-50/70 border-teal-700/50'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Préférences</span>
                    <Bell className="w-3.5 h-3.5 text-teal-700" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    {Object.values(prefs.notifications).filter(Boolean).length} alertes
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Profil & commune
                  </p>
                </button>
              </div>
            </section>

            {/* 2. BARRE D'ONGLETS CLAIRE */}
            <div className="flex items-center gap-2 border-b border-slate-200/90 overflow-x-auto no-scrollbar print:hidden">
              {[
                { id: 'favorites', label: `Mes Favoris (${favoritePlaces.length})`, icon: Heart },
                { id: 'itinerary', label: `Carnet de Séjour (${allDays.length} j)`, icon: Calendar },
                { id: 'checklist', label: `Checklist & Lieux visités`, icon: CheckSquare },
                { id: 'activity', label: 'Contributions & Badges', icon: MessageSquare },
                { id: 'settings', label: 'Profil & Préférences', icon: Settings }
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as AccountTab)}
                    className={`inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer -mb-px ${
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

            {/* =========================================================
                ONGLET 1 : MES FAVORIS
                ========================================================= */}
            {activeTab === 'favorites' && (
              <section className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Vos lieux enregistrés en Martinique
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Retrouvez vos plages, spots de snorkeling et adresses coups de cœur ou ajoutez-les à votre programme.
                    </p>
                  </div>

                  {/* Filtres par catégorie */}
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
                        onClick={() => setFavCategoryFilter(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          favCategoryFilter === cat.id
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredFavorites.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-10 text-center max-w-lg mx-auto space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
                      <Heart className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900">
                        Aucun lieu dans cette catégorie
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Cliquez sur le cœur d&apos;une plage, d&apos;une randonnée ou d&apos;un restaurant pour le garder de côté ici.
                      </p>
                    </div>
                    <Link
                      href="/?page=map"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-xs transition-colors"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Explorer la carte de l&apos;île</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFavorites.map(place => {
                      const isVisited = visitedIds.includes(place.id);
                      return (
                        <div
                          key={place.id}
                          className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                        >
                          <div>
                            <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                              <img
                                src={place.photos[0] || '/images/spots/salines.jpg'}
                                alt={place.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                <span className="px-2.5 py-1 rounded-md bg-white/95 text-slate-800 text-[11px] font-semibold">
                                  {CATEGORY_LABELS[place.category] || place.category}
                                </span>
                                {place.rating && (
                                  <span className="px-2 py-1 rounded-md bg-slate-900/80 text-white text-[11px] font-semibold inline-flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    {place.rating}
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleFavorite(place.id)}
                                title="Retirer des favoris"
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-rose-500 flex items-center justify-center shadow-xs cursor-pointer"
                              >
                                <Heart className="w-4 h-4 fill-rose-500" />
                              </button>
                            </div>

                            <div className="p-5 space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1 text-xs text-teal-700 font-medium">
                                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                                  {place.commune}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleVisitedPlace(place.id)}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-colors cursor-pointer ${
                                    isVisited
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {isVisited ? '✓ Déjà visité' : 'Marquer visité'}
                                </button>
                              </div>
                              <h3 className="font-bold text-slate-900 text-base leading-snug">
                                {place.name}
                              </h3>
                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {place.description}
                              </p>
                            </div>
                          </div>

                          <div className="p-5 pt-0 space-y-2.5">
                            {/* Ajout rapide au carnet de séjour */}
                            <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100">
                              <span className="text-[11px] text-slate-500 mr-auto">
                                Programmer :
                              </span>
                              {[1, 2, 3].map(dayNum => (
                                <button
                                  key={dayNum}
                                  type="button"
                                  onClick={() => handleAddPlaceToDay(dayNum, place.id)}
                                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
                                >
                                  + Jour {dayNum}
                                </button>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
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
                                className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Retirer</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Suggestions rapides pour compléter ses favoris */}
                {suggestedPlaces.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Suggestions à ajouter à vos favoris
                        </h3>
                        <p className="text-xs text-slate-500">
                          Quelques incontournables appréciés des voyageurs en Martinique
                        </p>
                      </div>
                      <Link
                        href="/"
                        className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                      >
                        Tout parcourir →
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {suggestedPlaces.map(item => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl border border-slate-200/80 flex items-center gap-3 bg-slate-50/50"
                        >
                          <img
                            src={item.photos[0]}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate">
                              {item.commune}
                            </p>
                            <button
                              type="button"
                              onClick={() => toggleFavorite(item.id)}
                              className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Ajouter aux favoris</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* =========================================================
                ONGLET 2 : MON CARNET DE SÉJOUR (ITINÉRAIRE JOUR PAR JOUR)
                ========================================================= */}
            {activeTab === 'itinerary' && (
              <section className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-900">
                      Mon carnet de séjour jour par jour
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Regroupez vos visites par secteur (Sud Caraïbe, Anses-d&apos;Arlet, Nord Volcanique, Fonds Blancs) pour éviter les allers-retours.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 print:hidden">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimer / PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExtraDaysCount(prev => prev + 1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Ajouter Jour {allDays.length + 1}</span>
                    </button>
                  </div>
                </div>

                {/* Modèles d'itinéraires prêts à l'emploi en 1 clic */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 print:hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Inspirez-vous d&apos;un itinéraire type (remplit les Jours 1 à 3)
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleApplyTemplate('south')}
                      className="p-3.5 rounded-xl border border-slate-200/90 hover:border-teal-700/60 bg-slate-50/60 hover:bg-teal-50/30 text-left transition-all cursor-pointer space-y-1"
                    >
                      <span className="text-xs font-bold text-slate-900 block">
                        🏖️ Trésors du Sud-Caraïbe
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Salines, Pointe Marin, Tortues à Anse Dufour & Baie du Diamant
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyTemplate('complete')}
                      className="p-3.5 rounded-xl border border-slate-200/90 hover:border-teal-700/60 bg-slate-50/60 hover:bg-teal-50/30 text-left transition-all cursor-pointer space-y-1"
                    >
                      <span className="text-xs font-bold text-slate-900 block">
                        🌋 Grand Tour Sud & Nord Volcanique
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Salines, Anses-d&apos;Arlet, Montagne Pelée & Anse Couleuvre
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyTemplate('family')}
                      className="p-3.5 rounded-xl border border-slate-200/90 hover:border-teal-700/60 bg-slate-50/60 hover:bg-teal-50/30 text-left transition-all cursor-pointer space-y-1"
                    >
                      <span className="text-xs font-bold text-slate-900 block">
                        👨‍👩‍👧‍👦 Séjour Famille & Lagons Calmes
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Pointe Marin, Anse Figuier, Kayak Mangrove & Fonds Blancs
                      </span>
                    </button>
                  </div>
                </div>

                {/* Barre d'ajout rapide d'un lieu à une journée */}
                <div className="bg-[#F3EFEA] rounded-2xl border border-stone-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 print:hidden">
                  <span className="text-xs font-semibold text-stone-800 shrink-0">
                    Ajouter un lieu au programme :
                  </span>
                  <select
                    value={selectedDayForAdd}
                    onChange={e => setSelectedDayForAdd(Number(e.target.value))}
                    className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    {allDays.map(d => (
                      <option key={d.dayNumber} value={d.dayNumber}>
                        Jour {d.dayNumber}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedPlaceToAdd}
                    onChange={e => setSelectedPlaceToAdd(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="">Choisir une plage, randonnée ou adresse...</option>
                    {places.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.commune})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!selectedPlaceToAdd}
                    onClick={() => {
                      if (selectedPlaceToAdd) {
                        handleAddPlaceToDay(selectedDayForAdd, selectedPlaceToAdd);
                        setSelectedPlaceToAdd('');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    Ajouter à cette journée
                  </button>
                </div>

                {/* Liste des journées */}
                <div className="space-y-5">
                  {allDays.map(day => {
                    const customTitle = dayTitles[day.dayNumber] ?? day.title;
                    return (
                      <div
                        key={day.dayNumber}
                        className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                            <span className="px-3 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/60 text-xs font-bold shrink-0">
                              Jour {day.dayNumber}
                            </span>
                            <input
                              type="text"
                              value={customTitle}
                              onChange={e => handleTitleChange(day.dayNumber, e.target.value)}
                              className="font-bold text-slate-900 text-base bg-transparent border-b border-transparent hover:border-slate-200 focus:border-teal-700 focus:outline-none w-full py-0.5"
                            />
                          </div>
                          <span className="text-xs text-slate-500">
                            {day.places.length} {day.places.length > 1 ? 'étapes prévues' : 'étape prévue'}
                          </span>
                        </div>

                        {day.places.length === 0 ? (
                          <p className="text-xs text-slate-500 italic py-2">
                            Aucune étape enregistrée pour ce jour. Utilisez le sélecteur ci-dessus ou un modèle d&apos;itinéraire.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                            {day.places.map((place, idx) => (
                              <div
                                key={place.id}
                                className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-3 justify-between"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <img
                                    src={place.photos[0] || '/images/spots/salines.jpg'}
                                    alt={place.name}
                                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <Link
                                      href={`/?page=lieu&id=${place.id}`}
                                      className="text-xs font-bold text-slate-900 hover:text-teal-700 truncate block"
                                    >
                                      {place.name}
                                    </Link>
                                    <p className="text-[11px] text-slate-500 truncate">
                                      {place.commune}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeFromItinerary(day.dayNumber, place.id)}
                                  title="Retirer de cette journée"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0 print:hidden"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Notes personnelles pour la journée */}
                        <div className="pt-2">
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Notes & repères horaires du Jour {day.dayNumber}
                          </label>
                          <input
                            type="text"
                            value={dayNotes[day.dayNumber] ?? day.notes ?? ''}
                            onChange={e => handleNoteChange(day.dayNumber, e.target.value)}
                            placeholder="Ex: Arriver à 8h00 pour le stationnement, réserver le restaurant de plage..."
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 focus:bg-white focus:border-teal-700 focus:outline-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* =========================================================
                ONGLET 3 : MA VALISE & LIEUX VISITÉS (PASSEPORT MARTINIQUE)
                ========================================================= */}
            {activeTab === 'checklist' && (
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Colonne gauche : Checklist Valise & Sac de plage */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Ma checklist Martinique
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Les indispensables pour les plages, les Fonds Blancs et la forêt tropicale
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200/60 px-3 py-1 rounded-lg">
                        {checkedCount} / {checklist.length} prêts ({checklistPct}%)
                      </span>
                    </div>
                  </div>

                  {/* Barre de progression globale */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-700 rounded-full transition-all duration-300"
                      style={{ width: `${checklistPct}%` }}
                    />
                  </div>

                  {/* Ajout d'un élément personnalisé */}
                  <form onSubmit={handleAddChecklistItem} className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={newChecklistCategory}
                      onChange={e =>
                        setNewChecklistCategory(e.target.value as ChecklistItem['category'])
                      }
                      className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="Snorkeling & Plage">Snorkeling & Plage</option>
                      <option value="Randonnée & Nord">Randonnée & Nord</option>
                      <option value="Vie pratique">Vie pratique</option>
                    </select>
                    <input
                      type="text"
                      value={newChecklistLabel}
                      onChange={e => setNewChecklistLabel(e.target.value)}
                      placeholder="Ajouter un objet à ne pas oublier..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-700"
                    />
                    <button
                      type="submit"
                      disabled={!newChecklistLabel.trim()}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold cursor-pointer shrink-0"
                    >
                      + Ajouter
                    </button>
                  </form>

                  {/* Groupes de checklist */}
                  <div className="space-y-5">
                    {(['Snorkeling & Plage', 'Randonnée & Nord', 'Vie pratique'] as const).map(
                      group => {
                        const items = checklist.filter(i => i.category === group);
                        return (
                          <div key={group} className="space-y-2.5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                              {group}
                            </h3>
                            <div className="space-y-2">
                              {items.map(item => (
                                <div
                                  key={item.id}
                                  className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                                    item.checked
                                      ? 'bg-slate-50/70 border-slate-200/70'
                                      : 'bg-white border-slate-200'
                                  }`}
                                >
                                  <label className="flex items-start gap-3 cursor-pointer flex-1">
                                    <input
                                      type="checkbox"
                                      checked={item.checked}
                                      onChange={() => toggleChecklistItem(item.id)}
                                      className="mt-0.5 accent-teal-700 w-4 h-4 rounded"
                                    />
                                    <div className="text-xs">
                                      <span
                                        className={`font-semibold block ${
                                          item.checked
                                            ? 'line-through text-slate-400'
                                            : 'text-slate-900'
                                        }`}
                                      >
                                        {item.label}
                                      </span>
                                      <span className="text-[11px] text-slate-500">
                                        {item.tip}
                                      </span>
                                    </div>
                                  </label>
                                  {item.id.startsWith('chk-17') && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteChecklistItem(item.id)}
                                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Colonne droite : Mon Passeport de lieux visités en Martinique */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700">
                      Carnet d&apos;exploration
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                      Lieux déjà visités ({visitedIds.length}/{places.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Cochez les plages, sommets et îlets que vous avez déjà découverts en Martinique.
                    </p>
                  </div>

                  <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                    {places.slice(0, 16).map(place => {
                      const visited = visitedIds.includes(place.id);
                      return (
                        <div
                          key={place.id}
                          onClick={() => toggleVisitedPlace(place.id)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                            visited
                              ? 'bg-emerald-50/50 border-emerald-200/90'
                              : 'bg-slate-50/50 border-slate-200/70 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={place.photos[0] || '/images/spots/salines.jpg'}
                              alt={place.name}
                              className="w-10 h-10 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {place.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 truncate">
                                {place.commune}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 ${
                              visited
                                ? 'bg-emerald-700 text-white'
                                : 'bg-white border border-slate-200 text-slate-600'
                            }`}
                          >
                            {visited ? '✓ Visité' : 'À voir'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* =========================================================
                ONGLET 4 : MES CONTRIBUTIONS & BADGES
                ========================================================= */}
            {activeTab === 'activity' && (
              <section className="space-y-8">
                {/* Formulaire rapide pour partager une observation depuis son compte */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Partager une observation rapide du jour
                    </h3>
                    <p className="text-xs text-slate-500">
                      Informez les autres membres de l&apos;état d&apos;une plage, du stationnement ou d&apos;une bonne adresse (+20 XP).
                    </p>
                  </div>
                  <form onSubmit={handleQuickPostSubmit} className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={quickPostLocation}
                      onChange={e => setQuickPostLocation(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      {COMMUNES_LIST.map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={quickPostText}
                      onChange={e => setQuickPostText(e.target.value)}
                      placeholder="Ex: Mer très calme ce matin à Grande Anse, parking encore fluide..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                    />
                    <button
                      type="submit"
                      disabled={!quickPostText.trim()}
                      className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publier</span>
                    </button>
                  </form>
                </div>

                {/* 1. Mes partages & observations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Derniers retours & photos partagés
                        </h3>
                        <p className="text-xs text-slate-500">
                          Publications récentes sur le fil de la communauté
                        </p>
                      </div>
                      <Link
                        href="/?page=community"
                        className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                      >
                        Ouvrir la communauté →
                      </Link>
                    </div>

                    <div className="space-y-3">
                      {userPosts.map(post => (
                        <div
                          key={post.id}
                          className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-3"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            {post.photos && post.photos[0] && (
                              <img
                                src={post.photos[0]}
                                alt={post.location || 'Martinique'}
                                className="w-16 h-16 rounded-lg object-cover shrink-0"
                              />
                            )}
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <span className="font-semibold text-teal-800">
                                  {post.location}
                                </span>
                                <span>·</span>
                                <span>{post.timestamp}</span>
                              </div>
                              <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                                {post.content}
                              </p>
                            </div>
                          </div>
                          {post.id.startsWith('post-17') && (
                            <button
                              type="button"
                              onClick={() => deletePost(post.id)}
                              title="Supprimer cette publication"
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Signalements littoral & Questions */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Conditions en direct & Entraide
                        </h3>
                        <p className="text-xs text-slate-500">
                          Observations météo côtières et discussions suivies
                        </p>
                      </div>
                      <Link
                        href="/?page=community"
                        className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                      >
                        Voir tout →
                      </Link>
                    </div>

                    <div className="space-y-2.5">
                      {userAlerts.map(alert => (
                        <div
                          key={alert.id}
                          className="p-3 rounded-xl border border-slate-200/80 flex items-start gap-3"
                        >
                          <Waves className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {alert.title}
                              </h4>
                              <span className="text-[11px] text-slate-400 shrink-0">
                                {alert.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                              {alert.location} ({alert.commune})
                            </p>
                          </div>
                        </div>
                      ))}

                      {userQuestions.map(q => (
                        <div
                          key={q.id}
                          className="p-3 rounded-xl border border-slate-200/80 bg-[#FAF8F5] flex items-start gap-3"
                        >
                          <BookOpen className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                              {q.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Rubrique {q.category} · {q.repliesCount} réponses
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Badges d'explorateur */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Vos badges de contribution ({unlockedBadges.length}/{badges.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Débloqués au fil de vos enregistrements de favoris, retours photos et conseils partagés.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/70 text-xs font-bold self-start">
                      <Award className="w-4 h-4 text-amber-600" />
                      {userPoints} XP cumulés
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {badges.map(badge => {
                      const isUnlocked = badge.unlocked || userPoints >= badge.requiredPoints;
                      const pct = Math.min(100, Math.round((userPoints / badge.requiredPoints) * 100));
                      return (
                        <div
                          key={badge.id}
                          className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                            isUnlocked
                              ? 'bg-teal-50/40 border-teal-200'
                              : 'bg-slate-50/60 border-slate-200/80'
                          }`}
                        >
                          <div className="w-11 h-11 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-2xl shrink-0">
                            {badge.icon}
                          </div>
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xs font-bold text-slate-900">
                                {badge.name}
                              </h4>
                              {isUnlocked ? (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-teal-700 text-white text-[10px] font-semibold">
                                  <Check className="w-2.5 h-2.5" /> Acquis
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-slate-500">
                                  {userPoints}/{badge.requiredPoints} XP
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug">
                              {badge.description}
                            </p>
                            {!isUnlocked && (
                              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-teal-700 rounded-full"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* =========================================================
                ONGLET 5 : PROFIL & PRÉFÉRENCES
                ========================================================= */}
            {activeTab === 'settings' && (
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <form
                  onSubmit={handleSaveProfile}
                  className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6"
                >
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">
                      Informations personnelles & séjour
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Personnalisez votre profil pour adapter les recommandations de plages et la météo côtière.
                    </p>
                  </div>

                  {/* Choix de l'emblème / avatar */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Choisir votre emblème de profil
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {AVATAR_OPTIONS.map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setPrefs(prev => ({ ...prev, avatarEmoji: emoji }))}
                          className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition-all cursor-pointer ${
                            prefs.avatarEmoji === emoji
                              ? 'bg-teal-50 border-teal-700 ring-2 ring-teal-700/20'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Prénom & Nom (ou pseudo affiché)
                      </label>
                      <input
                        type="text"
                        required
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Adresse e-mail du compte
                      </label>
                      <input
                        type="email"
                        disabled
                        value={currentUser.email}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Votre profil
                      </label>
                      <select
                        value={prefs.travelerType}
                        onChange={e =>
                          setPrefs(prev => ({
                            ...prev,
                            travelerType: e.target.value as UserPreferences['travelerType']
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                      >
                        <option value="Voyageur en séjour">Voyageur en séjour</option>
                        <option value="Habitant de Martinique">Habitant de Martinique</option>
                        <option value="Futur résident / Retraite">Futur résident / Retraite</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Commune / Secteur de base
                      </label>
                      <select
                        value={prefs.baseCommune}
                        onChange={e =>
                          setPrefs(prev => ({ ...prev, baseCommune: e.target.value }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                      >
                        {COMMUNES_LIST.map(c => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Durée ou rythme sur place
                      </label>
                      <select
                        value={prefs.stayDuration}
                        onChange={e =>
                          setPrefs(prev => ({ ...prev, stayDuration: e.target.value }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                      >
                        <option value="Court séjour (1 semaine)">Court séjour (1 semaine)</option>
                        <option value="10 à 15 jours">10 à 15 jours</option>
                        <option value="Long séjour (1 à 6 mois)">Long séjour (1 à 6 mois)</option>
                        <option value="À l'année en Martinique">À l&apos;année en Martinique</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Quelques mots sur vos centres d&apos;intérêt
                    </label>
                    <textarea
                      rows={2}
                      value={prefs.bio}
                      onChange={e => setPrefs(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Plages calmes, randonnées dans le Nord, snorkeling..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-teal-700"
                    />
                  </div>

                  {/* Notifications littoral */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900">
                      Alertes littoral & centres d&apos;intérêt suivis
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          key: 'beachWeather',
                          title: 'Météo des plages & état de la mer',
                          desc: 'Houle, vent et visibilité sous-marine du matin'
                        },
                        {
                          key: 'sargassumAlerts',
                          title: 'Suivi des sargasses par secteur',
                          desc: 'Signalements citoyens sur la côte Atlantique et le Sud'
                        },
                        {
                          key: 'turtleSeason',
                          title: 'Faune marine & tortues',
                          desc: 'Observations aux Anses-d’Arlet et saison des pontes'
                        },
                        {
                          key: 'localEvents',
                          title: 'Agenda culturel & Tour des Yoles',
                          desc: 'Carnaval, régates de yoles rondes et marchés'
                        }
                      ].map(item => {
                        const checked =
                          prefs.notifications[
                            item.key as keyof UserPreferences['notifications']
                          ];
                        return (
                          <label
                            key={item.key}
                            className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                              checked
                                ? 'bg-teal-50/40 border-teal-600/40'
                                : 'bg-slate-50/60 border-slate-200/80'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={e =>
                                setPrefs(prev => ({
                                  ...prev,
                                  notifications: {
                                    ...prev.notifications,
                                    [item.key]: e.target.checked
                                  }
                                }))
                              }
                              className="mt-1 accent-teal-700"
                            />
                            <div className="text-xs">
                              <span className="font-semibold text-slate-900 block">
                                {item.title}
                              </span>
                              <span className="text-slate-500 text-[11px]">
                                {item.desc}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isSaving ? 'Enregistrement...' : 'Enregistrer mes préférences'}</span>
                    </button>
                  </div>
                </form>

                {/* Colonne latérale : Langue & Compte */}
                <aside className="lg:col-span-4 space-y-5">
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Langue de l&apos;interface
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLanguage('fr')}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          language === 'fr'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        🇫🇷 Français
                      </button>
                      <button
                        type="button"
                        onClick={() => setLanguage('en')}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          language === 'en'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        🇬🇧 English
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900">
                      Session & Sécurité
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Vos lieux favoris, votre checklist et votre carnet de séjour sont sauvegardés sur votre appareil.
                    </p>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Se déconnecter du compte</span>
                    </button>
                  </div>
                </aside>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
