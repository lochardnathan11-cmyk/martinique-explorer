'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, 
  Database,
  MapPin, 
  Search,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  X,
  Globe,
  Sparkles,
  UploadCloud,
  Star,
  Eye
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PlaceItem } from '@/types';
import { isSupabaseConfigured } from '@/lib/supabaseClient';


// Composant Select personnalisé haut de gamme
interface AdminCustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string; icon?: string }[];
  placeholder?: string;
}

function AdminCustomSelect({ value, onChange, options, placeholder }: AdminCustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(o => o.value === value) || options[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 rounded-2xl border border-[#DCECEF] bg-[#F2FCFC]/60 hover:bg-white text-sm text-[#073B4C] font-semibold flex items-center justify-between transition-all focus:outline-none focus:border-[#087E8B] focus:ring-2 focus:ring-[#087E8B]/20 shadow-xs cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {selected?.icon && <span className="text-base">{selected.icon}</span>}
          <span>{selected?.label || placeholder || 'Sélectionner...'}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#6E858A] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#087E8B]' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[70]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#DCECEF] p-1.5 z-[80] animate-fadeIn space-y-1 max-h-60 overflow-y-auto">
            {options.map(opt => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-[#BFEFF2]/50 text-[#087E8B]'
                      : 'text-[#073B4C] hover:bg-[#F2FCFC]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {opt.icon && <span className="text-base">{opt.icon}</span>}
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#087E8B] shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

const MODAL_CATEGORY_OPTIONS = [
  { value: 'beach', label: 'Plage', icon: '🏖️' },
  { value: 'activity', label: 'Activité & Rando', icon: '🥾' },
  { value: 'accommodation', label: 'Hébergement & Hôtel', icon: '🏨' },
  { value: 'restaurant', label: 'Restaurant & Bar', icon: '🍽️' },
  { value: 'viewpoint', label: 'Point de vue', icon: '📸' },
  { value: 'hidden_gem', label: 'Spot Secret', icon: '💎' },
];

const MODAL_PRICE_OPTIONS = [
  { value: 'Gratuit', label: 'Gratuit', icon: '🟢' },
  { value: '€', label: 'Abordable (€)', icon: '💶' },
  { value: '€€', label: 'Moyen (€€)', icon: '💶' },
  { value: '€€€', label: 'Élevé (€€€)', icon: '💎' },
];



const normalizeSearchText = (str: string) => 
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const MARTINIQUE_COMMUNES = [
  "L'Ajoupa-Bouillon",
  "Les Anses-d'Arlet",
  "Basse-Pointe",
  "Bellefontaine",
  "Le Carbet",
  "Case-Pilote",
  "Le Diamant",
  "Ducos",
  "Fonds-Saint-Denis",
  "Fort-de-France",
  "Le François",
  "Grand'Rivière",
  "Gros-Morne",
  "Le Lamentin",
  "Le Lorrain",
  "Macouba",
  "Marigot",
  "Le Marin",
  "Le Morne-Rouge",
  "Le Morne-Vert",
  "Le Prêcheur",
  "Rivière-Pilote",
  "Rivière-Salée",
  "Le Robert",
  "Sainte-Anne",
  "Sainte-Luce",
  "Sainte-Marie",
  "Saint-Esprit",
  "Saint-Joseph",
  "Saint-Pierre",
  "Schœlcher",
  "La Trinité",
  "Les Trois-Îlets",
  "Le Vauclin"
];

function extractCoordsFromGoogleMaps(input: string): [number, number] | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Pattern direct "14.4325, -60.8492"
  const direct = trimmed.match(/(-?\d+\.\d+)[\s,]+(-?\d+\.\d+)/);
  if (direct && !trimmed.includes('http')) {
    const lat = parseFloat(direct[1]);
    const lng = parseFloat(direct[2]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }

  // Pattern Google Maps @14.4325,-60.8492
  const atMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }

  // Pattern ?q=lat,lng ou ?query=lat,lng
  const paramMatch = trimmed.match(/[?&](?:q|ll|query|daddr)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (paramMatch) {
    const lat = parseFloat(paramMatch[1]);
    const lng = parseFloat(paramMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }

  // Pattern place data !3dlat!4dlng
  const placeMatch = trimmed.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (placeMatch) {
    const lat = parseFloat(placeMatch[1]);
    const lng = parseFloat(placeMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }

  return null;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { currentUser, userRole, logout } = useApp();
  
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  
  // Modals state
  const [editingPlace, setEditingPlace] = useState<PlaceItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingPlaceId, setDeletingPlaceId] = useState<string | null>(null);
  const [googleMapsInput, setGoogleMapsInput] = useState('');
  const [coordsDetected, setCoordsDetected] = useState(false);
  const [showCommuneSuggestions, setShowCommuneSuggestions] = useState(false);
  const [isResolvingGmaps, setIsResolvingGmaps] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isDragOverPhoto, setIsDragOverPhoto] = useState(false);
  const [showManualUrlInput, setShowManualUrlInput] = useState(false);

  const [autoFillNotice, setAutoFillNotice] = useState<{
    type: 'success' | 'warning' | 'info';
    title: string;
    message: string;
  } | null>(null);
  const [deleteConfirmChecked, setDeleteConfirmChecked] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);

  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Security check with hydration grace period
  useEffect(() => {
    let localRole = null;
    let localEmail = null;
    try {
      const stored = localStorage.getItem('mq_current_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        localRole = parsed.role;
        localEmail = parsed.email;
      }
    } catch (e) {}

    const isCurrentAdmin = (currentUser && currentUser.role === 'admin') || 
                           userRole === 'admin' ||
                           (currentUser && currentUser.email?.toLowerCase() === 'nathan.test@gmail.com');
                           
    const isLocalAdmin = localRole === 'admin' || localEmail?.toLowerCase() === 'nathan.test@gmail.com';

    if (isCurrentAdmin || isLocalAdmin) {
      setIsAuthorized(true);
      setAuthLoading(false);
      fetchPlaces();
      return;
    }

    // Attendre que la session Supabase soit restaurée si rafraîchissement
    const timer = setTimeout(() => {
      setAuthLoading(false);
      if (!isCurrentAdmin && !isLocalAdmin) {
        router.push('/');
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [currentUser, userRole, router]);

  // Verrouiller le défilement de l'arrière-plan quand une modale admin est ouverte
  useEffect(() => {
    const isModalOpen = Boolean(editingPlace || deletingPlaceId || showEditConfirm);
    if (typeof document !== 'undefined') {
      if (isModalOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [editingPlace, deletingPlaceId, showEditConfirm]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/spots/list');
      const data = await res.json();
      if (res.ok) {
        setPlaces(data.places || []);
      } else {
        throw new Error(data.error || 'Erreur lors du chargement des lieux');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  const triggerAutoFillFromGmaps = async (rawUrl: string) => {
    const trimmed = rawUrl.trim();
    if (!trimmed) return;

    setIsResolvingGmaps(true);
    setAutoFillNotice(null);

    try {
      // Vérification locale rapide des coordonnées
      const localCoords = extractCoordsFromGoogleMaps(trimmed);

      const res = await fetch('/api/admin/resolve-gmaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed })
      });
      const data = await res.json();

      if (data.success) {
        const coords = data.coords || data.data?.coords || localCoords;
        const name = data.name || data.data?.name || '';
        const commune = data.commune || data.data?.commune || '';
        const category = data.category || data.data?.category || '';

        setEditingPlace(prev => {
          if (!prev) return null;
          return {
            ...prev,
            name: name || prev.name,
            commune: commune || prev.commune,
            category: (category && MODAL_CATEGORY_OPTIONS.some(o => o.value === category)) ? category : prev.category,
            coords: coords || prev.coords,
          };
        });

        if (coords && (coords[0] !== 0 || coords[1] !== 0)) {
          setCoordsDetected(true);
        }

        const filledDetails: string[] = [];
        if (name) filledDetails.push(`Nom ("${name}")`);
        if (commune) filledDetails.push(`Commune ("${commune}")`);
        if (category) {
          const catLabel = MODAL_CATEGORY_OPTIONS.find(c => c.value === category)?.label || category;
          filledDetails.push(`Catégorie (${catLabel})`);
        }
        if (coords) filledDetails.push(`GPS [${coords[0]}, ${coords[1]}]`);

        if (filledDetails.length > 0) {
          setAutoFillNotice({
            type: 'success',
            title: '✨ Détection Google Maps réussie !',
            message: `Données extraites : ${filledDetails.join(' • ')}. Veuillez vérifier et compléter les informations ci-dessous avant d'enregistrer.`
          });
        } else {
          setAutoFillNotice({
            type: 'warning',
            title: 'Lien analysé mais peu d\'informations extraites',
            message: 'Vous pouvez vérifier et compléter les informations ci-dessous à la main.'
          });
        }
      } else {
        if (localCoords) {
          setEditingPlace(prev => prev ? ({ ...prev, coords: localCoords }) : null);
          setCoordsDetected(true);
          setAutoFillNotice({
            type: 'info',
            title: 'Coordonnées GPS extraites',
            message: `GPS détecté : [${localCoords[0]}, ${localCoords[1]}]. Veuillez renseigner le nom et la commune.`
          });
        } else {
          setAutoFillNotice({
            type: 'warning',
            title: 'Impossible d\'extraire les données du lien',
            message: data.error || 'Vérifiez le lien Google Maps ou saisissez directement les informations ci-dessous.'
          });
        }
      }
    } catch (e: any) {
      setAutoFillNotice({
        type: 'warning',
        title: 'Erreur lors de l\'analyse',
        message: e.message || 'Impossible de joindre le serveur d\'analyse.'
      });
    } finally {
      setIsResolvingGmaps(false);
    }
  };

  const handleGoogleMapsChange = (url: string) => {
    setGoogleMapsInput(url);
    if (!url.trim()) {
      setCoordsDetected(false);
      setAutoFillNotice(null);
      return;
    }

    const trimmed = url.trim();
    // Auto-déclencher si c'est un lien complet Google Maps ou des coordonnées
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || /^-?\d+\.\d+[\s,]+-?\d+\.\d+$/.test(trimmed)) {
      triggerAutoFillFromGmaps(trimmed);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 4000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  // ----- CRUD Operations ----- //
  
  const handleSaveEdit = async () => {
    if (!editingPlace) return;
    try {
      const res = await fetch('/api/admin/spots/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ place: editingPlace })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      showSuccess(data.message);
      setShowEditConfirm(false);
      setEditingPlace(null);
      fetchPlaces();
    } catch (err: any) {
      showError(err.message);
      setShowEditConfirm(false);
    }
  };

  const handleCreate = async () => {
    if (!editingPlace) return;
    try {
      const res = await fetch('/api/admin/spots/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ place: editingPlace })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      showSuccess(data.message);
      setIsCreateModalOpen(false);
      setShowEditConfirm(false);
      setEditingPlace(null);
      fetchPlaces();
    } catch (err: any) {
      showError(err.message);
      setShowEditConfirm(false);
    }
  };

  const handlePhotoFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0 || !editingPlace) return;

    const fileList = Array.from(files);
    const imageFiles = fileList.filter(f => f.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif|heic)$/i.test(f.name));

    if (imageFiles.length === 0) {
      showError('Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP, AVIF).');
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('spotId', editingPlace.id || '');
        formData.append('spotName', editingPlace.name || 'lieu');

        const res = await fetch('/api/admin/spots/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();

        if (res.ok && data.photoUrl) {
          uploadedUrls.push(data.photoUrl);
        } else {
          throw new Error(data.error || 'Erreur lors de l\'envoi du fichier');
        }
      }

      if (uploadedUrls.length > 0) {
        setEditingPlace(prev => {
          if (!prev) return null;
          const currentPhotos = Array.isArray(prev.photos) ? prev.photos : [];
          return {
            ...prev,
            photos: [...uploadedUrls, ...currentPhotos]
          };
        });

        showSuccess(`${uploadedUrls.length} photo(s) déposée(s) et ajoutée(s) avec succès !`);
      }
    } catch (err: any) {
      showError(err.message || 'Erreur lors du téléversement de la photo');
    } finally {
      setIsUploadingPhoto(false);
      setIsDragOverPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSetPrimaryPhoto = (index: number) => {
    if (!editingPlace || !editingPlace.photos) return;
    const current = [...editingPlace.photos];
    const [selected] = current.splice(index, 1);
    setEditingPlace({
      ...editingPlace,
      photos: [selected, ...current]
    });
    showSuccess('Photo définie comme photo principale de couverture !');
  };

  const handleRemovePhoto = (index: number) => {
    if (!editingPlace || !editingPlace.photos) return;
    const updated = editingPlace.photos.filter((_, i) => i !== index);
    setEditingPlace({
      ...editingPlace,
      photos: updated
    });
  };

  const handleConfirmSave = async () => {
    if (!editingPlace) return;
    if (isCreateModalOpen) {
      await handleCreate();
    } else {
      await handleSaveEdit();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlace) return;
    if (!editingPlace.name.trim()) {
      showError('Veuillez renseigner un nom pour ce lieu.');
      return;
    }
    if (!editingPlace.commune.trim()) {
      showError('Veuillez renseigner une commune pour ce lieu.');
      return;
    }
    // Double vérification systématique pour la création et la modification
    setShowEditConfirm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/admin/spots/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      showSuccess(data.message);
      setDeletingPlaceId(null);
      fetchPlaces();
    } catch (err: any) {
      showError(err.message);
    }
  };

    const CATEGORY_OPTIONS = [
    { value: 'all', label: 'Toutes les catégories', icon: '🌴', count: places.length },
    { value: 'beach', label: 'Plages & Snorkeling', icon: '🏖️', count: places.filter(p => p.category === 'beach' || p.category === 'snorkeling').length },
    { value: 'activity', label: 'Activités & Randos', icon: '🥾', count: places.filter(p => p.category === 'activity' || p.category === 'hiking' || p.category === 'excursion').length },
    { value: 'accommodation', label: 'Hôtels & Lodges', icon: '🏨', count: places.filter(p => p.category === 'accommodation').length },
    { value: 'restaurant', label: 'Restaurants & Bars', icon: '🍽️', count: places.filter(p => p.category === 'restaurant' || p.category === 'bar').length },
    { value: 'viewpoint', label: 'Points de vue & Secrets', icon: '💎', count: places.filter(p => p.category === 'viewpoint' || p.category === 'hidden_gem' || p.category === 'photo').length },
  ];

  const currentCategoryOption = CATEGORY_OPTIONS.find(o => o.value === categoryFilter) || CATEGORY_OPTIONS[0];

  // ----- Filtering ----- //
  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          place.commune.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' 
      || place.category === categoryFilter
      || (categoryFilter === 'beach' && place.category === 'snorkeling')
      || (categoryFilter === 'activity' && (place.category === 'hiking' || place.category === 'excursion'))
      || (categoryFilter === 'restaurant' && place.category === 'bar')
      || (categoryFilter === 'viewpoint' && (place.category === 'hidden_gem' || place.category === 'photo'));
    return matchesSearch && matchesCategory;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F2FCFC] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#087E8B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-[#073B4C]">Vérification des droits d'accès...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F2FCFC] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-rose-100">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-[#073B4C] mb-2">Accès Refusé</h1>
          <p className="text-[#6E858A] mb-6">Vous devez être connecté avec un compte administrateur pour accéder à cette page.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#087E8B] text-white rounded-2xl font-semibold hover:bg-[#087E8B]/90 transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2FCFC] text-[#17343D] pb-20">
      {/* Toast Notifications */}
      {success && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl bg-emerald-600 text-white border border-emerald-500 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{success}</span>
        </div>
      )}
      {error && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl bg-rose-600 text-white border border-rose-500 flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{error}</span>
        </div>
      )}

      {/* Admin Header */}
      <header className="bg-white border-b border-[#DCECEF] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-coral/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-coral" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#073B4C]">Back-Office Martinique</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-semibold text-[#6E858A]">Bienvenue, {currentUser?.name || 'Administrateur'}</span>
                  <div className="w-1 h-1 rounded-full bg-[#DCECEF]"></div>
                  {isSupabaseConfigured ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <Database className="w-3 h-3" /> Supabase Actif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      <Database className="w-3 h-3" /> Mode Démo (Local)
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-[#073B4C] rounded-xl font-bold text-sm transition-colors border border-[#DCECEF]"
              >
                <Globe className="w-4 h-4 text-[#087E8B]" />
                <span className="hidden sm:inline">Voir le site</span>
              </Link>
              <Link
                href="/admin/photos"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold text-sm transition-colors border border-indigo-100"
              >
                <ImageIcon className="w-4 h-4" />
                Studio Photos
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#F2FCFC] text-[#6E858A] hover:bg-rose-50 hover:text-rose-600 rounded-xl font-bold text-sm transition-colors border border-[#DCECEF] hover:border-rose-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Quick Stats & Controls */}
        <div className="bg-white rounded-3xl border border-[#DCECEF] p-6 shadow-sm flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-[#F2FCFC] px-5 py-3 rounded-2xl border border-[#DCECEF]">
              <div className="text-[#6E858A] text-xs font-semibold mb-1">Total Lieux</div>
              <div className="text-2xl font-extrabold text-[#073B4C]">{places.length}</div>
            </div>
            <div className="bg-[#F2FCFC] px-5 py-3 rounded-2xl border border-[#DCECEF]">
              <div className="text-[#6E858A] text-xs font-semibold mb-1">Plages</div>
              <div className="text-2xl font-extrabold text-[#087E8B]">{places.filter(p => p.category === 'beach').length}</div>
            </div>
          </div>
          
          <div className="flex w-full lg:w-auto items-center gap-3 flex-wrap sm:flex-nowrap">
             <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E858A]" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F2FCFC]/60 border border-[#DCECEF] text-sm text-[#073B4C] focus:outline-none focus:ring-2 focus:ring-[#087E8B]"
              />
            </div>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="py-2.5 px-4 rounded-2xl bg-[#F2FCFC]/80 hover:bg-white border border-[#DCECEF] hover:border-[#087E8B] text-sm text-[#073B4C] font-semibold transition-all flex items-center gap-2.5 shadow-xs cursor-pointer"
              >
                <span className="text-base">{currentCategoryOption.icon}</span>
                <span>{currentCategoryOption.label}</span>
                <ChevronDown className={`w-4 h-4 text-[#6E858A] transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setCategoryDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-[#DCECEF] p-2 z-50 animate-fadeIn space-y-1">
                    {CATEGORY_OPTIONS.map(opt => {
                      const isSelected = categoryFilter === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setCategoryFilter(opt.value);
                            setCategoryDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                            isSelected
                              ? 'bg-[#BFEFF2]/50 text-[#087E8B]'
                              : 'text-[#073B4C] hover:bg-[#F2FCFC]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{opt.icon}</span>
                            <span>{opt.label}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isSelected ? 'bg-[#087E8B] text-white' : 'bg-slate-100 text-[#6E858A]'
                          }`}>
                            {opt.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            
            <button
              onClick={() => {
                setEditingPlace({
                  id: `lieu-${Date.now()}`,
                  name: '',
                  category: 'beach',
                  commune: '',
                  description: '',
                  coords: [0, 0],
                  photos: [],
                  website: '',
                  phone: '',
                  priceRange: '€€',
                  rating: 5.0,
                  reviewsCount: 0,
                  featured: false,
                  isHiddenGem: false
                } as any);
                setGoogleMapsInput('');
                setCoordsDetected(false);
                setAutoFillNotice(null);
                setShowCommuneSuggestions(false);
                setIsCreateModalOpen(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#087E8B] hover:bg-[#087E8B]/90 text-white rounded-2xl font-bold text-sm shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouveau Lieu
            </button>
          </div>
        </div>

        {/* Places Grid */}
        {loading ? (
          <div className="text-center py-20 text-[#6E858A] flex flex-col items-center">
             <div className="w-10 h-10 border-4 border-[#087E8B] border-t-transparent rounded-full animate-spin mb-4"></div>
             Chargement des données...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaces.map(place => (
              <div key={place.id} className="bg-white rounded-3xl border border-[#DCECEF] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                <div className="h-40 relative overflow-hidden bg-slate-100">
                  <img src={place.photos[0] || '/images/spots/salines.jpg'} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-[#073B4C] text-[10px] font-bold px-2 py-1 rounded-lg">
                      {place.category}
                    </span>
                    {place.featured && <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">⭐ Vedette</span>}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-[#073B4C] text-lg leading-tight mb-1">{place.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#6E858A] mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    {place.commune}
                  </div>
                  
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-4 border-t border-[#DCECEF]/60">
                    <button
                      onClick={() => {
                        setEditingPlace({...place});
                        setGoogleMapsInput(
                          place.coords && (place.coords[0] !== 0 || place.coords[1] !== 0)
                            ? `${place.coords[0]}, ${place.coords[1]}`
                            : ''
                        );
                        setCoordsDetected(Boolean(place.coords && (place.coords[0] !== 0 || place.coords[1] !== 0)));
                        setAutoFillNotice(null);
                        setShowCommuneSuggestions(false);
                        setIsCreateModalOpen(false);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#F2FCFC] hover:bg-[#087E8B] text-[#087E8B] hover:text-white text-xs font-bold transition-colors border border-[#DCECEF] hover:border-[#087E8B]"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Modifier
                    </button>
                    <button
                      onClick={() => setDeletingPlaceId(place.id)}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit / Create Modal */}
      {(editingPlace && (isCreateModalOpen || !isCreateModalOpen)) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#073B4C]/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#DCECEF] flex justify-between items-center bg-[#F2FCFC]">
              <h2 className="text-xl font-extrabold text-[#073B4C]">
                {isCreateModalOpen ? 'Ajouter un nouveau lieu' : `Modifier : ${editingPlace.name}`}
              </h2>
              <button 
                onClick={() => {
                  setEditingPlace(null);
                  setIsCreateModalOpen(false);
                }} 
                className="w-10 h-10 rounded-full bg-white border border-[#DCECEF] flex items-center justify-center text-[#6E858A] hover:text-rose-600 hover:border-rose-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto flex-1 space-y-7">
              {/* 📍 SECTION 1 : Auto-remplissage via Google Maps (En haut) */}
              <div className="bg-gradient-to-br from-[#087E8B]/10 via-[#BFEFF2]/30 to-[#F2FCFC] border-2 border-[#087E8B]/30 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#087E8B] text-white flex items-center justify-center shadow-md shrink-0">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#073B4C] flex items-center gap-2">
                        <span>1. Auto-Remplissage Google Maps</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#087E8B] text-white px-2.5 py-0.5 rounded-full">
                          Recommandé
                        </span>
                      </h3>
                      <p className="text-xs text-[#6E858A]">
                        Collez le lien Google Maps du lieu : le nom, la commune, la catégorie et les coordonnées GPS seront pré-remplis automatiquement.
                      </p>
                    </div>
                  </div>
                  {editingPlace.coords && (editingPlace.coords[0] !== 0 || editingPlace.coords[1] !== 0) && (
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${editingPlace.coords[0]},${editingPlace.coords[1]}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087E8B] hover:text-[#073B4C] bg-white px-3 py-1.5 rounded-xl border border-[#DCECEF] shadow-2xs transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Ouvrir sur Maps
                    </a>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <input 
                      type="text"
                      placeholder="Collez ici le lien Google Maps (ex: https://maps.app.goo.gl/... ou https://www.google.com/maps/place/...)"
                      value={googleMapsInput}
                      onChange={e => handleGoogleMapsChange(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          triggerAutoFillFromGmaps(googleMapsInput);
                        }
                      }}
                      className="w-full pl-4 pr-10 py-3 rounded-2xl border-2 border-[#DCECEF] focus:border-[#087E8B] bg-white text-sm font-medium text-[#073B4C] placeholder-[#6E858A]/60 shadow-xs focus:outline-none transition-all"
                    />
                    {googleMapsInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setGoogleMapsInput('');
                          setAutoFillNotice(null);
                          setCoordsDetected(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E858A] hover:text-[#073B4C] p-1 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!googleMapsInput.trim() || isResolvingGmaps}
                    onClick={() => triggerAutoFillFromGmaps(googleMapsInput)}
                    className="px-5 py-3 rounded-2xl bg-[#087E8B] hover:bg-[#087E8B]/90 disabled:bg-[#6E858A]/30 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
                  >
                    {isResolvingGmaps ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Analyse en cours...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Scanner & Pré-remplir</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Banner de statut d'auto-remplissage */}
                {autoFillNotice && (
                  <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-start gap-3 animate-fadeIn ${
                    autoFillNotice.type === 'success' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                      : autoFillNotice.type === 'info'
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    {autoFillNotice.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 space-y-1">
                      <p className="font-bold text-sm">{autoFillNotice.title}</p>
                      <p className="text-xs leading-relaxed opacity-90">{autoFillNotice.message}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 📝 SECTION 2 : Vérification et Informations Générales */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#DCECEF] pb-2">
                  <h3 className="text-sm font-bold text-[#087E8B] uppercase tracking-wider">
                    2. Informations Générales
                  </h3>
                  <span className="text-[11px] font-bold text-[#6E858A] bg-slate-100 px-2.5 py-0.5 rounded-full">
                    À vérifier
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Nom du Lieu *</label>
                    <input 
                      type="text" required 
                      placeholder="ex: Plage des Salines"
                      value={editingPlace.name} 
                      onChange={e => setEditingPlace({...editingPlace, name: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B] focus:ring-1 focus:ring-[#087E8B]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Catégorie *</label>
                    <AdminCustomSelect
                      value={editingPlace.category}
                      onChange={val => setEditingPlace({...editingPlace, category: val as any})}
                      options={MODAL_CATEGORY_OPTIONS}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Commune * (suggestions automatiques)</label>
                    <div className="relative">
                      <input 
                        type="text" required 
                        placeholder="Tapez le nom de la commune (ex: Sainte-Anne)..."
                        value={editingPlace.commune} 
                        onChange={e => {
                          setEditingPlace({...editingPlace, commune: e.target.value});
                          setShowCommuneSuggestions(true);
                        }}
                        onFocus={() => setShowCommuneSuggestions(true)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B] focus:ring-1 focus:ring-[#087E8B]"
                      />
                      {showCommuneSuggestions && editingPlace.commune.trim() && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowCommuneSuggestions(false)} />
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-[#DCECEF] p-1.5 z-50 max-h-48 overflow-y-auto space-y-1">
                            {MARTINIQUE_COMMUNES.filter(c => 
                              normalizeSearchText(c).includes(normalizeSearchText(editingPlace.commune))
                            ).slice(0, 8).map(c => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => {
                                  setEditingPlace({...editingPlace, commune: c});
                                  setShowCommuneSuggestions(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#073B4C] hover:bg-[#F2FCFC] hover:text-[#087E8B] text-left transition-colors cursor-pointer"
                              >
                                <MapPin className="w-3.5 h-3.5 text-[#087E8B]" />
                                <span>{c}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-[#073B4C]">Description</label>
                    <textarea 
                      rows={3}
                      placeholder="Décrivez les atouts majeurs, l'accès ou la spécificité du lieu..."
                      value={editingPlace.description} 
                      onChange={e => setEditingPlace({...editingPlace, description: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                  </div>
                </div>
              </div>

              {/* 🌍 SECTION 3 : Coordonnées GPS & Photos */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#DCECEF] pb-2">
                  <h3 className="text-sm font-bold text-[#087E8B] uppercase tracking-wider">
                    3. Coordonnées GPS & Photos
                  </h3>
                  {coordsDetected && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> GPS Validé
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Latitude GPS *</label>
                    <input 
                      type="number" step="any" required 
                      placeholder="ex: 14.40428"
                      value={editingPlace.coords && editingPlace.coords[0] !== 0 ? editingPlace.coords[0] : ''} 
                      onChange={e => setEditingPlace({
                        ...editingPlace, 
                        coords: [e.target.value === '' ? 0 : parseFloat(e.target.value), editingPlace.coords?.[1] || 0]
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Longitude GPS *</label>
                    <input 
                      type="number" step="any" required 
                      placeholder="ex: -60.87572"
                      value={editingPlace.coords && editingPlace.coords[1] !== 0 ? editingPlace.coords[1] : ''} 
                      onChange={e => setEditingPlace({
                        ...editingPlace, 
                        coords: [editingPlace.coords?.[0] || 0, e.target.value === '' ? 0 : parseFloat(e.target.value)]
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-[#073B4C] flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#087E8B]" />
                          Photos du Lieu & Couverture
                        </span>
                        <p className="text-[11px] text-[#6E858A]">
                          Déposez vos images ici. La première photo servira d'illustration principale sur le site et la base de données.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/admin/photos?spotId=${editingPlace.id}&search=${encodeURIComponent(editingPlace.name || '')}`} 
                          target="_blank" 
                          className="text-[#087E8B] hover:underline flex items-center gap-1.5 text-xs font-bold bg-[#BFEFF2]/40 hover:bg-[#BFEFF2]/70 px-2.5 py-1.5 rounded-xl transition-colors border border-[#087E8B]/20 shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Ouvrir le Studio Photos
                        </Link>
                        <button
                          type="button"
                          onClick={() => setShowManualUrlInput(!showManualUrlInput)}
                          className="text-xs font-bold text-[#6E858A] hover:text-[#073B4C] bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl transition-colors shrink-0 cursor-pointer"
                        >
                          {showManualUrlInput ? 'Masquer URLs' : 'URLs manuelles'}
                        </button>
                      </div>
                    </div>

                    {/* Zone de Dépôt / Drag & Drop */}
                    <div
                      onDragOver={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragOverPhoto(true);
                      }}
                      onDragEnter={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragOverPhoto(true);
                      }}
                      onDragLeave={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragOverPhoto(false);
                      }}
                      onDrop={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragOverPhoto(false);
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          handlePhotoFiles(e.dataTransfer.files);
                        }
                      }}
                      onClick={() => {
                        if (!isUploadingPhoto && fileInputRef.current) {
                          fileInputRef.current.click();
                        }
                      }}
                      className={`relative border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2.5 ${
                        isDragOverPhoto
                          ? 'border-[#087E8B] bg-[#BFEFF2]/40 scale-[1.01] ring-4 ring-[#087E8B]/20 shadow-md'
                          : 'border-[#DCECEF] hover:border-[#087E8B] bg-[#F2FCFC]/40 hover:bg-[#F2FCFC] shadow-2xs'
                      }`}
                    >
                      <input 
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        multiple
                        onChange={e => {
                          if (e.target.files) {
                            handlePhotoFiles(e.target.files);
                          }
                        }}
                        className="hidden"
                      />

                      {isUploadingPhoto ? (
                        <div className="py-4 flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-3 border-[#087E8B] border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs font-bold text-[#087E8B]">Téléversement de la photo en cours...</p>
                          <p className="text-[11px] text-[#6E858A]">La photo sera enregistrée sur le site et dans la base à la validation.</p>
                        </div>
                      ) : (
                        <>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                            isDragOverPhoto ? 'bg-[#087E8B] text-white scale-110' : 'bg-[#BFEFF2]/60 text-[#087E8B]'
                          }`}>
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-[#073B4C]">
                              <span className="text-[#087E8B] underline underline-offset-2">Cliquez pour parcourir</span> ou déposez vos photos ici
                            </p>
                            <p className="text-xs text-[#6E858A]">
                              JPG, PNG, WEBP, AVIF • Glissez directement vos fichiers depuis l'ordinateur
                            </p>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DCECEF] text-[11px] font-bold text-[#087E8B] shadow-2xs">
                            <Plus className="w-3.5 h-3.5" /> Déposer une photo
                          </div>
                        </>
                      )}
                    </div>

                    {/* Galerie des photos actuelles */}
                    {editingPlace.photos && editingPlace.photos.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs font-bold text-[#073B4C]">
                          <span>Photos associées ({editingPlace.photos.length}) :</span>
                          <span className="text-[11px] text-[#6E858A]">⭐ La première photo est la couverture du lieu</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {editingPlace.photos.map((photoUrl, idx) => (
                            <div 
                              key={`${photoUrl}-${idx}`}
                              className="group relative rounded-2xl overflow-hidden border-2 border-[#DCECEF] bg-slate-100 shadow-xs hover:border-[#087E8B] transition-all aspect-video sm:aspect-square"
                            >
                              <img 
                                src={photoUrl} 
                                alt={`Photo ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/spots/salines.jpg';
                                }}
                              />

                              {/* Badge Photo Principale */}
                              {idx === 0 ? (
                                <div className="absolute top-2 left-2 bg-[#087E8B] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> Principale
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSetPrimaryPhoto(idx);
                                  }}
                                  title="Définir comme photo principale"
                                  className="absolute top-2 left-2 bg-black/60 hover:bg-[#087E8B] text-white text-[10px] font-bold px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer"
                                >
                                  <Star className="w-3 h-3" /> Mettre en avant
                                </button>
                              )}

                              {/* Boutons d'action overlay */}
                              <div className="absolute top-2 right-2 flex items-center gap-1">
                                <a
                                  href={photoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  title="Voir l'image en grand"
                                  className="w-7 h-7 rounded-xl bg-black/60 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemovePhoto(idx);
                                  }}
                                  title="Supprimer cette photo"
                                  className="w-7 h-7 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                                <span className="text-[10px] text-white font-medium truncate block px-1">
                                  {photoUrl.split('/').pop()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Saisie textuelle avancée (URLs séparées par virgules) */}
                    {showManualUrlInput && (
                      <div className="pt-2 animate-fadeIn space-y-1.5">
                        <label className="text-xs font-bold text-[#6E858A]">
                          URLs manuelles (séparées par des virgules ou retours à la ligne) :
                        </label>
                        <textarea 
                          rows={2}
                          value={(editingPlace.photos || []).join(',\n')} 
                          onChange={e => setEditingPlace({...editingPlace, photos: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-xs focus:outline-none focus:border-[#087E8B]"
                          placeholder="/images/spots/photo1.jpg, https://example.com/photo2.jpg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 📋 SECTION 4 : Infos Pratiques */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#087E8B] uppercase tracking-wider border-b border-[#DCECEF] pb-2">
                  4. Infos Pratiques
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Site Web</label>
                    <input 
                      type="url" 
                      placeholder="https://..."
                      value={editingPlace.website || ''} 
                      onChange={e => setEditingPlace({...editingPlace, website: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Téléphone</label>
                    <input 
                      type="text" 
                      placeholder="+596 ..."
                      value={editingPlace.phone || ''} 
                      onChange={e => setEditingPlace({...editingPlace, phone: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Gamme de prix</label>
                    <AdminCustomSelect
                      value={editingPlace.priceRange || '€€'}
                      onChange={val => setEditingPlace({...editingPlace, priceRange: val})}
                      options={MODAL_PRICE_OPTIONS}
                    />
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/30 cursor-pointer hover:bg-[#F2FCFC] transition-colors">
                    <input 
                      type="checkbox" 
                      checked={editingPlace.featured || false} 
                      onChange={e => setEditingPlace({...editingPlace, featured: e.target.checked})}
                      className="w-4 h-4 text-[#087E8B] rounded"
                    />
                    <span className="text-sm font-semibold text-[#073B4C]">Mettre en Vedette ⭐</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/30 cursor-pointer hover:bg-[#F2FCFC] transition-colors">
                    <input 
                      type="checkbox" 
                      checked={editingPlace.isHiddenGem || false} 
                      onChange={e => setEditingPlace({...editingPlace, isHiddenGem: e.target.checked})}
                      className="w-4 h-4 text-[#087E8B] rounded"
                    />
                    <span className="text-sm font-semibold text-[#073B4C]">Pépite Secrète 💎</span>
                  </label>
                </div>
              </div>
            </form>
            <div className="p-6 border-t border-[#DCECEF] bg-slate-50 flex justify-end gap-3 rounded-b-4xl">
              <button 
                type="button" 
                onClick={() => {
                  setEditingPlace(null);
                  setIsCreateModalOpen(false);
                }}
                className="px-6 py-2.5 rounded-2xl font-bold text-[#6E858A] hover:bg-[#DCECEF] transition-colors"
              >
                Annuler
              </button>
              <button 
                type="button" 
                onClick={handleFormSubmit}
                className="px-8 py-2.5 rounded-2xl bg-[#087E8B] hover:bg-[#087E8B]/90 text-white font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCreateModalOpen ? 'Vérifier & Créer le lieu' : 'Vérifier & Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Double Vérification : Modal de Suppression */}
      {deletingPlaceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#073B4C]/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-4xl p-7 text-center border border-rose-200 shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center shadow-inner">
              <Trash2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-[#073B4C]">Double Vérification Requise</h3>
              <p className="text-sm text-[#6E858A]">
                Vous êtes sur le point de supprimer définitivement :
              </p>
              <div className="p-3 bg-rose-50 text-rose-900 font-bold rounded-2xl border border-rose-200 text-base">
                {places.find(p => p.id === deletingPlaceId)?.name || deletingPlaceId}
              </div>
              <p className="text-xs text-rose-600 font-medium">
                ⚠️ Cette action est irréversible et supprimera le lieu de la base de données Supabase.
              </p>
            </div>

            <label className="flex items-start gap-3 p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-[#DCECEF] cursor-pointer text-left transition-colors">
              <input
                type="checkbox"
                checked={deleteConfirmChecked}
                onChange={e => setDeleteConfirmChecked(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
              <span className="text-xs font-semibold text-[#073B4C] select-none leading-relaxed">
                Je confirme vouloir supprimer définitivement ce lieu et ses photos du site et de la base de données.
              </span>
            </label>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  setDeletingPlaceId(null);
                  setDeleteConfirmChecked(false);
                }}
                className="flex-1 py-3 rounded-2xl font-bold text-[#6E858A] bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
              >
                Annuler
              </button>
              <button 
                disabled={!deleteConfirmChecked}
                onClick={() => {
                  if (deleteConfirmChecked) {
                    handleDelete(deletingPlaceId);
                    setDeleteConfirmChecked(false);
                  }
                }}
                className={`flex-1 py-3 rounded-2xl font-bold text-white text-sm transition-all shadow-md ${
                  deleteConfirmChecked 
                    ? 'bg-rose-600 hover:bg-rose-700 cursor-pointer opacity-100 shadow-rose-200' 
                    : 'bg-rose-300 cursor-not-allowed opacity-50'
                }`}
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Double Vérification : Modal de Confirmation et Revue Finale */}
      {showEditConfirm && editingPlace && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-[#073B4C]/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-3xl p-5 sm:p-6 text-center border border-[#DCECEF] shadow-2xl space-y-3.5">
            {/* En-tête compact avec icône alignée */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#BFEFF2]/60 text-[#087E8B] flex items-center justify-center shadow-inner shrink-0">
                <CheckCircle2 className="w-6 h-6 text-[#087E8B]" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-extrabold text-[#073B4C] leading-tight">
                  {isCreateModalOpen ? 'Vérification avant Publication' : 'Vérification des Modifications'}
                </h3>
                <p className="text-[11px] text-[#6E858A]">
                  Vérifiez les données avant synchronisation Supabase
                </p>
              </div>
            </div>

            {/* Récapitulatif clair & compact */}
            <div className="bg-[#F2FCFC] border border-[#DCECEF] rounded-2xl p-3 sm:p-3.5 text-left space-y-2 text-xs text-[#073B4C]">
              <div className="flex justify-between items-center border-b border-[#DCECEF]/60 pb-1.5">
                <span className="font-semibold text-[#6E858A]">Nom :</span>
                <span className="font-extrabold text-xs text-[#073B4C] truncate max-w-[210px]">{editingPlace.name || '—'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#DCECEF]/60 pb-1.5">
                <span className="font-semibold text-[#6E858A]">Commune :</span>
                <span className="font-bold text-[#087E8B]">{editingPlace.commune || '—'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#DCECEF]/60 pb-1.5">
                <span className="font-semibold text-[#6E858A]">Catégorie :</span>
                <span className="font-bold">
                  {MODAL_CATEGORY_OPTIONS.find(c => c.value === editingPlace.category)?.label || editingPlace.category}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#DCECEF]/60 pb-1.5">
                <span className="font-semibold text-[#6E858A]">GPS :</span>
                {editingPlace.coords && (editingPlace.coords[0] !== 0 || editingPlace.coords[1] !== 0) ? (
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                    {editingPlace.coords[0]}, {editingPlace.coords[1]}
                  </span>
                ) : (
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                    ⚠️ Non définies (0, 0)
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center pt-0.5">
                <span className="font-semibold text-[#6E858A]">Photo principale :</span>
                {editingPlace.photos && editingPlace.photos.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <img 
                      src={editingPlace.photos[0]} 
                      alt="" 
                      className="w-8 h-8 object-cover rounded-lg border border-[#DCECEF] shadow-xs" 
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/spots/salines.jpg'; }}
                    />
                    <span className="font-bold text-[#087E8B] text-xs">{editingPlace.photos.length} photo(s)</span>
                  </div>
                ) : (
                  <span className="text-amber-700 font-bold text-xs">Aucune photo</span>
                )}
              </div>
            </div>

            <p className="text-[11px] text-[#6E858A] leading-snug">
              Une fois validé, ce lieu sera immédiatement accessible aux visiteurs dans l'explorateur.
            </p>

            {/* Boutons d'action toujours visibles sans défilement */}
            <div className="flex gap-2.5 pt-1">
              <button 
                type="button"
                onClick={() => setShowEditConfirm(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-[#6E858A] bg-slate-100 hover:bg-slate-200 transition-colors text-xs cursor-pointer"
              >
                Ajuster les infos
              </button>
              <button 
                type="button"
                onClick={handleConfirmSave}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-[#087E8B] hover:bg-[#087E8B]/90 transition-all text-xs shadow-md shadow-[#087E8B]/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCreateModalOpen ? 'Confirmer & Créer' : 'Confirmer & Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
