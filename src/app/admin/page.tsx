'use client';

import React, { useState, useEffect } from 'react';
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
  Globe
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
      fetchPlaces(); // Refresh list
    } catch (err: any) {
      showError(err.message);
      setShowEditConfirm(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlace) return;
    if (isCreateModalOpen) {
      handleCreate(e);
    } else {
      setShowEditConfirm(true);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlace) return; // We use editingPlace state for creation too
    
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
      setEditingPlace(null);
      fetchPlaces(); // Refresh list
    } catch (err: any) {
      showError(err.message);
    }
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
                  commune: 'Sainte-Anne',
                  description: '',
                  coords: [14.4372, -60.8805],
                  photos: ['/images/spots/salines.jpg'],
                  rating: 4.8,
                  reviewsCount: 1,
                  featured: false
                } as any);
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
                        setGoogleMapsInput('');
                        setCoordsDetected(false);
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
            
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto flex-1 space-y-8">
              {/* Informations Générales */}
              <div>
                <h3 className="text-sm font-bold text-[#087E8B] uppercase tracking-wider mb-4 border-b border-[#DCECEF] pb-2">Informations Générales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Nom du Lieu *</label>
                    <input 
                      type="text" required 
                      value={editingPlace.name} onChange={e => setEditingPlace({...editingPlace, name: e.target.value})}
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
                    <label className="text-xs font-bold text-[#073B4C]">Commune *</label>
                    <input 
                      type="text" required 
                      value={editingPlace.commune} onChange={e => setEditingPlace({...editingPlace, commune: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Description</label>
                    <textarea 
                      rows={3}
                      value={editingPlace.description} onChange={e => setEditingPlace({...editingPlace, description: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                  </div>
                </div>
              </div>

              {/* Localisation & Médias */}
              <div>
                <h3 className="text-sm font-bold text-[#087E8B] uppercase tracking-wider mb-4 border-b border-[#DCECEF] pb-2">Localisation & Médias</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Champ intelligent Google Maps */}
                  <div className="space-y-1.5 md:col-span-2 bg-[#F2FCFC]/40 p-4 rounded-2xl border border-[#DCECEF]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#073B4C] flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#087E8B]" />
                        Lien Google Maps (Détection automatique des coordonnées GPS)
                      </label>
                      {editingPlace.coords && editingPlace.coords[0] !== 0 && (
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${editingPlace.coords[0]},${editingPlace.coords[1]}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[11px] font-bold text-[#087E8B] hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> Tester sur Google Maps
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Collez ici un lien Google Maps ou des coordonnées (ex: https://maps.google.com/... ou 14.4325, -60.8492)"
                        value={googleMapsInput}
                        onChange={e => {
                          const val = e.target.value;
                          setGoogleMapsInput(val);
                          const coords = extractCoordsFromGoogleMaps(val);
                          if (coords) {
                            setEditingPlace({ ...editingPlace, coords });
                            setCoordsDetected(true);
                          } else {
                            setCoordsDetected(false);
                          }
                        }}
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-[#DCECEF] bg-white text-sm focus:outline-none focus:border-[#087E8B] focus:ring-1 focus:ring-[#087E8B]"
                      />
                      {coordsDetected && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> GPS détecté !
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6E858A]">
                      💡 Collez simplement l'URL Google Maps du lieu : la latitude et la longitude ci-dessous seront calculées automatiquement.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Latitude GPS</label>
                    <input 
                      type="number" step="any" required 
                      value={editingPlace.coords?.[0] || 0} 
                      onChange={e => setEditingPlace({...editingPlace, coords: [parseFloat(e.target.value), editingPlace.coords?.[1] || 0]})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Longitude GPS</label>
                    <input 
                      type="number" step="any" required 
                      value={editingPlace.coords?.[1] || 0} 
                      onChange={e => setEditingPlace({...editingPlace, coords: [editingPlace.coords?.[0] || 0, parseFloat(e.target.value)]})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-[#073B4C]">Photos (URLs séparées par des virgules)</span>
                      <Link 
                        href={`/admin/photos?spotId=${editingPlace.id}&search=${encodeURIComponent(editingPlace.name)}`} 
                        target="_blank" 
                        className="text-[#087E8B] hover:underline flex items-center gap-1.5 text-xs font-bold bg-[#BFEFF2]/40 hover:bg-[#BFEFF2]/70 px-2.5 py-1 rounded-lg transition-colors border border-[#087E8B]/20"
                      >
                        <ImageIcon className="w-3.5 h-3.5" /> Ouvrir le Studio Photos de ce lieu
                      </Link>
                    </div>
                    <textarea 
                      rows={2}
                      value={(editingPlace.photos || []).join(',\n')} 
                      onChange={e => setEditingPlace({...editingPlace, photos: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B]"
                      placeholder="/images/spots/photo1.jpg, https://example.com/photo2.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Infos Complémentaires */}
              <div>
                <h3 className="text-sm font-bold text-[#087E8B] uppercase tracking-wider mb-4 border-b border-[#DCECEF] pb-2">Infos Pratiques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Site Web</label>
                    <input 
                      type="url" 
                      value={editingPlace.website || ''} onChange={e => setEditingPlace({...editingPlace, website: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Téléphone</label>
                    <input 
                      type="text" 
                      value={editingPlace.phone || ''} onChange={e => setEditingPlace({...editingPlace, phone: e.target.value})}
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
                
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                type="submit" 
                onClick={handleFormSubmit}
                className="px-8 py-2.5 rounded-2xl bg-[#087E8B] hover:bg-[#087E8B]/90 text-white font-bold shadow-xs transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCreateModalOpen ? 'Créer le lieu' : 'Enregistrer les modifications'}
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

      {/* Double Vérification : Modal de Modification */}
      {showEditConfirm && editingPlace && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#073B4C]/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-4xl p-7 text-center border border-[#DCECEF] shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-[#BFEFF2]/50 text-[#087E8B] mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-[#073B4C]">Confirmer les modifications ?</h3>
              <p className="text-sm text-[#6E858A]">
                Voulez-vous enregistrer et publier ces modifications pour :
              </p>
              <div className="p-3 bg-[#F2FCFC] text-[#087E8B] font-bold rounded-2xl border border-[#DCECEF] text-base">
                {editingPlace.name} ({editingPlace.commune})
              </div>
              <p className="text-xs text-[#6E858A]">
                Les nouvelles données seront immédiatement synchronisées avec Supabase et visibles par tous les visiteurs du site.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setShowEditConfirm(false)}
                className="flex-1 py-3 rounded-2xl font-bold text-[#6E858A] bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
              >
                Revenir en arrière
              </button>
              <button 
                type="button"
                onClick={handleSaveEdit}
                className="flex-1 py-3 rounded-2xl font-bold text-white bg-[#087E8B] hover:bg-[#087E8B]/90 transition-all text-sm shadow-md shadow-[#087E8B]/20"
              >
                Oui, Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
