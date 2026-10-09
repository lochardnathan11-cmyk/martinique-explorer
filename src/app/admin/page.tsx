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
  X
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PlaceItem } from '@/types';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

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
  
  // Modals state
  const [editingPlace, setEditingPlace] = useState<PlaceItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingPlaceId, setDeletingPlaceId] = useState<string | null>(null);

  // Security check
  useEffect(() => {
    if (!currentUser || userRole !== 'admin') {
      router.push('/');
    } else {
      fetchPlaces();
    }
  }, [currentUser, userRole, router]);

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
  
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setEditingPlace(null);
      fetchPlaces(); // Refresh list
    } catch (err: any) {
      showError(err.message);
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

  // ----- Filtering ----- //
  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          place.commune.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || place.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (!currentUser || userRole !== 'admin') {
    return <div className="min-h-screen bg-[#F2FCFC] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-rose-100">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-[#073B4C] mb-2">Accès Refusé</h1>
        <p className="text-[#6E858A] mb-6">Vous devez être administrateur pour accéder à cette page.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#087E8B] text-white rounded-2xl font-semibold hover:bg-[#087E8B]/90 transition-colors">
          Retour à l'accueil
        </Link>
      </div>
    </div>;
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
                  <span className="text-xs font-semibold text-[#6E858A]">Bienvenue, {currentUser.name}</span>
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
            
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="py-2.5 pl-4 pr-10 rounded-2xl bg-[#F2FCFC]/60 border border-[#DCECEF] text-sm text-[#073B4C] font-medium focus:outline-none focus:ring-2 focus:ring-[#087E8B] appearance-none"
            >
              <option value="all">Toutes les catégories</option>
              <option value="beach">Plages</option>
              <option value="activity">Activités</option>
              <option value="accommodation">Hôtels</option>
              <option value="restaurant">Restaurants</option>
            </select>
            
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
                      onClick={() => setEditingPlace({...place})}
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
            
            <form onSubmit={isCreateModalOpen ? handleCreate : handleSaveEdit} className="p-6 overflow-y-auto flex-1 space-y-8">
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
                    <select 
                      value={editingPlace.category} onChange={e => setEditingPlace({...editingPlace, category: e.target.value as any})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B]"
                    >
                      <option value="beach">Plage</option>
                      <option value="activity">Activité</option>
                      <option value="accommodation">Hébergement</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="viewpoint">Point de vue</option>
                      <option value="hidden_gem">Spot Secret</option>
                    </select>
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
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Latitude (ex: 14.4372)</label>
                    <input 
                      type="number" step="any" required 
                      value={editingPlace.coords?.[0] || 0} 
                      onChange={e => setEditingPlace({...editingPlace, coords: [parseFloat(e.target.value), editingPlace.coords?.[1] || 0]})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#073B4C]">Longitude (ex: -60.8805)</label>
                    <input 
                      type="number" step="any" required 
                      value={editingPlace.coords?.[1] || 0} 
                      onChange={e => setEditingPlace({...editingPlace, coords: [editingPlace.coords?.[0] || 0, parseFloat(e.target.value)]})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-[#073B4C] flex justify-between">
                      <span>Photos (URLs séparées par des virgules)</span>
                      <Link href="/admin/photos" target="_blank" className="text-[#087E8B] hover:underline flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> Ouvrir le Studio Photos
                      </Link>
                    </label>
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
                    <select 
                      value={editingPlace.priceRange || '€€'} onChange={e => setEditingPlace({...editingPlace, priceRange: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm focus:outline-none focus:border-[#087E8B]"
                    >
                      <option value="Gratuit">Gratuit</option>
                      <option value="€">Abordable (€)</option>
                      <option value="€€">Moyen (€€)</option>
                      <option value="€€€">Élevé (€€€)</option>
                    </select>
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
                onClick={isCreateModalOpen ? handleCreate : handleSaveEdit}
                className="px-8 py-2.5 rounded-2xl bg-[#087E8B] hover:bg-[#087E8B]/90 text-white font-bold shadow-xs transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCreateModalOpen ? 'Créer le lieu' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPlaceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 text-center border border-rose-100 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-rose-100 mx-auto flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-[#073B4C] mb-2">Supprimer le lieu ?</h3>
            <p className="text-sm text-[#6E858A] mb-6">Cette action supprimera définitivement le lieu de la base de données. Êtes-vous sûr ?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeletingPlaceId(null)}
                className="flex-1 py-3 rounded-2xl font-bold text-[#6E858A] bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={() => handleDelete(deletingPlaceId)}
                className="flex-1 py-3 rounded-2xl font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-soft"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
