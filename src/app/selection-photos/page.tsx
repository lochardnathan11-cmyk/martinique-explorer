'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Shield, 
  Globe, 
  UploadCloud, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  MapPin, 
  Camera, 
  Check, 
  ExternalLink,
  Layers,
  Image as ImageIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { INITIAL_PLACES } from '@/data/mockData';
import { PlaceItem } from '@/types';

type CategoryFilter = 'all' | 'beach' | 'activity' | 'accommodation' | 'restaurant' | 'viewpoint';

export default function PhotoManagementStudioPage() {
  const [spots, setSpots] = useState<PlaceItem[]>(INITIAL_PLACES);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmPhotoChange, setConfirmPhotoChange] = useState<{ spotId: string; spotName: string; photoUrl: string } | null>(null);

  // Charger les lieux et gérer le ciblage direct depuis l'admin
  useEffect(() => {
    fetch('/api/admin/spots/list')
      .then(res => res.json())
      .then(data => {
        if (data && data.places && data.places.length > 0) {
          setSpots(data.places);
        }
      })
      .catch(e => console.error('Erreur chargement spots:', e));

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const search = params.get('search');
      const spotId = params.get('spotId');

      if (search) {
        setSearchQuery(decodeURIComponent(search));
      }

      if (spotId) {
        setTimeout(() => {
          const el = document.getElementById(`spot-${spotId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-4', 'ring-[#087E8B]', 'border-[#087E8B]');
            setTimeout(() => {
              el.classList.remove('ring-4', 'ring-[#087E8B]', 'border-[#087E8B]');
            }, 4500);
          }
        }, 600);
      }
    }
  }, []);

  // Verrouiller le défilement de l'arrière-plan quand la modale de confirmation photo est ouverte
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (confirmPhotoChange) {
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
  }, [confirmPhotoChange]);

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  
  // Upload state per spot: { [spotId]: { file, preview, isUploading, successMsg, errorMsg } }
  const [uploadState, setUploadState] = useState<Record<string, {
    file: File | null;
    preview: string | null;
    isUploading: boolean;
    successMsg?: string;
    errorMsg?: string;
  }>>({});

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Filter spots
  const filteredSpots = spots.filter(spot => {
    // Category filter
    if (activeCategory === 'beach' && spot.category !== 'beach' && spot.category !== 'snorkeling') return false;
    if (activeCategory === 'activity' && spot.category !== 'activity' && spot.category !== 'hiking' && spot.category !== 'excursion') return false;
    if (activeCategory === 'accommodation' && spot.category !== 'accommodation') return false;
    if (activeCategory === 'restaurant' && spot.category !== 'restaurant' && spot.category !== 'bar') return false;
    if (activeCategory === 'viewpoint' && spot.category !== 'viewpoint' && spot.category !== 'photo' && spot.category !== 'hidden_gem') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = spot.name.toLowerCase().includes(q);
      const matchCommune = spot.commune.toLowerCase().includes(q);
      const matchTags = spot.tags?.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchCommune && !matchTags) return false;
    }

    return true;
  });

  // Handle file drop or selection
  const handleFileSelect = (spotId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).', 'error');
      return;
    }

    const preview = URL.createObjectURL(file);
    setUploadState(prev => ({
      ...prev,
      [spotId]: {
        file,
        preview,
        isUploading: false
      }
    }));
  };

  // Upload and publish photo
  const handleUploadAndPublish = async (spotId: string) => {
    const state = uploadState[spotId];
    if (!state?.file) return;

    setUploadState(prev => ({
      ...prev,
      [spotId]: { ...prev[spotId], isUploading: true, errorMsg: undefined }
    }));

    try {
      const formData = new FormData();
      formData.append('file', state.file);
      formData.append('spotId', spotId);

      const res = await fetch('/api/spots/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors du téléversement');
      }

      // Update local state with new photo at index 0
      setSpots(prev => prev.map(s => {
        if (s.id === spotId) {
          const newPhotos = [data.photoUrl, ...s.photos.filter(p => p !== data.photoUrl)];
          return { ...s, photos: newPhotos };
        }
        return s;
      }));

      // Reset upload input for this spot
      setUploadState(prev => ({
        ...prev,
        [spotId]: {
          file: null,
          preview: null,
          isUploading: false,
          successMsg: '✓ Photo déposée et publiée en ligne !'
        }
      }));

      showToast(`Photo publiée avec succès pour ${spots.find(s => s.id === spotId)?.name} !`);
    } catch (err: any) {
      setUploadState(prev => ({
        ...prev,
        [spotId]: { ...prev[spotId], isUploading: false, errorMsg: err.message }
      }));
      showToast(err.message, 'error');
    }
  };

  // Set existing photo as active
  const handleSetActivePhoto = async (spotId: string, photoUrl: string) => {
    try {
      const res = await fetch('/api/spots/set-active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spotId, photoUrl })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors du changement de photo');
      }

      // Reorder locally
      setSpots(prev => prev.map(s => {
        if (s.id === spotId) {
          const updated = [photoUrl, ...s.photos.filter(p => p !== photoUrl)];
          return { ...s, photos: updated };
        }
        return s;
      }));

      showToast(`Photo principale mise à jour pour ${spots.find(s => s.id === spotId)?.name} !`);
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const getCategoryBadge = (cat: PlaceItem['category']) => {
    switch (cat) {
      case 'beach':
      case 'snorkeling':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold">🏖️ Plage</span>;
      case 'activity':
      case 'hiking':
      case 'excursion':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">🥾 Activité</span>;
      case 'accommodation':
        return <span className="bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full text-xs font-bold">🏨 Hôtel</span>;
      case 'restaurant':
        return <span className="bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full text-xs font-bold">🍽️ Restaurant</span>;
      case 'bar':
        return <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full text-xs font-bold">🍸 Bar</span>;
      case 'hidden_gem':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-xs font-bold">💎 Spot Secret</span>;
      case 'viewpoint':
      case 'photo':
        return <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full text-xs font-bold">📸 Belvédère</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Lieu</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2FCFC] text-[#17343D] p-3 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border transition-all ${
          toast.type === 'success' 
            ? 'bg-emerald-600 text-white border-emerald-500' 
            : 'bg-rose-600 text-white border-rose-500'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. Header Hero */}
        <div className="bg-white rounded-3xl border border-[#DCECEF] p-6 sm:p-8 shadow-sm flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BFEFF2]/50 text-[#087E8B] text-xs font-bold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5" />
              Studio de Gestion & Dépôt des Photos
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#073B4C] tracking-tight">
              Gestionnaire Photos des Lieux de Martinique
            </h1>
            <p className="text-sm text-[#6E858A] max-w-2xl">
              Consultez tous les lieux, déposez vos propres photos par glisser-déposer ou choisissez parmi les clichés existants pour publier instantanément la photo officielle sur le site et la carte.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#F2FCFC] hover:bg-[#DCECEF] text-[#073B4C] font-bold text-sm transition-colors border border-[#DCECEF]"
            >
              <Shield className="w-4 h-4 text-[#087E8B]" />
              Retour Gestion
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-[#073B4C] font-bold text-sm transition-colors border border-[#DCECEF]"
            >
              <Globe className="w-4 h-4 text-[#087E8B]" />
              Voir le Site
            </Link>
            <Link
              href="/carte"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#087E8B] hover:bg-[#087E8B]/90 text-white font-bold text-sm shadow-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Carte en direct
            </Link>
          </div>
        </div>

        {/* 2. Controls Bar: Search & Categories */}
        <div className="bg-white rounded-3xl border border-[#DCECEF] p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3 flex-wrap justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E858A]" />
              <input
                type="text"
                placeholder="Rechercher un lieu, une plage, une commune..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F2FCFC]/60 border border-[#DCECEF] text-sm text-[#073B4C] placeholder-[#6E858A] focus:outline-none focus:ring-2 focus:ring-[#087E8B]"
              />
            </div>

            {/* Total spots count */}
            <div className="text-xs font-bold text-[#6E858A] bg-[#F2FCFC] px-3.5 py-2 rounded-xl border border-[#DCECEF]">
              {filteredSpots.length} {filteredSpots.length > 1 ? 'lieux trouvés' : 'lieu trouvé'}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
            {[
              { id: 'all', label: '📍 Tous les lieux' },
              { id: 'beach', label: '🏖️ Plages' },
              { id: 'activity', label: '🥾 Activités & Randos' },
              { id: 'accommodation', label: '🏨 Hôtels' },
              { id: 'restaurant', label: '🍽️ Restaurants & Bars' },
              { id: 'viewpoint', label: '📸 Points de vue & Secrets' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as CategoryFilter)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-[#073B4C] text-white shadow-xs'
                    : 'bg-[#F2FCFC] text-[#6E858A] hover:text-[#073B4C] hover:bg-[#BFEFF2]/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Spots Grid with Photo Gallery & Drag-and-Drop Uploader */}
        <div className="space-y-6">
          {filteredSpots.map(spot => {
            const activePhoto = spot.photos?.[0] || '/images/spots/salines.jpg';
            const galleryPhotos = spot.photos || [];
            const upload = uploadState[spot.id];

            return (
              <div 
                key={spot.id}
                id={`spot-${spot.id}`}
                className="bg-white rounded-3xl border border-[#DCECEF] p-5 sm:p-6 shadow-sm space-y-5 transition-all hover:border-[#087E8B]/40 scroll-mt-24"
              >
                {/* Spot Header */}
                <div className="flex items-start justify-between flex-wrap gap-3 border-b border-[#DCECEF] pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-extrabold text-[#073B4C]">
                        {spot.name}
                      </h2>
                      {getCategoryBadge(spot.category)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#6E858A]">
                      <MapPin className="w-3.5 h-3.5 text-[#087E8B]" />
                      <span>{spot.commune}</span>
                      <span>•</span>
                      <span>{spot.subCategory || 'Lieu d\'intérêt'}</span>
                    </div>
                  </div>

                  <Link
                    href={`/carte`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F2FCFC] hover:bg-[#BFEFF2]/50 text-[#087E8B] text-xs font-bold border border-[#DCECEF] transition-colors"
                  >
                    <span>Voir sur la carte</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Content: Active Published Photo + Available Gallery + Drag & Drop Upload Zone */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column: Active Published Photo (4 cols) */}
                  <div className="lg:col-span-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#073B4C]">
                      <span>Photo actuelle publiée :</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                        <Check className="w-3 h-3" />
                        En ligne
                      </span>
                    </div>

                    <div className="relative aspect-4/3 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-sm bg-slate-100 group">
                      <img
                        src={activePhoto}
                        alt={spot.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                        <span className="text-white text-xs font-bold truncate">
                          Photo principale affichée sur le site
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Alternative Gallery (4 cols) */}
                  <div className="lg:col-span-4 space-y-2">
                    <div className="text-xs font-bold text-[#073B4C] flex items-center justify-between">
                      <span>Galerie disponible ({galleryPhotos.length}) :</span>
                      <span className="text-[11px] text-[#6E858A] font-normal">Cliquez pour publier</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto p-1">
                      {galleryPhotos.map((photoUrl, idx) => {
                        const isMain = photoUrl === activePhoto;
                        return (
                          <div
                            key={idx}
                            onClick={() => !isMain && setConfirmPhotoChange({ spotId: spot.id, spotName: spot.name, photoUrl })}
                            className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 cursor-pointer transition-all group ${
                              isMain 
                                ? 'border-emerald-500 ring-2 ring-emerald-200' 
                                : 'border-[#DCECEF] hover:border-[#087E8B] hover:shadow-xs'
                            }`}
                          >
                            <img
                              src={photoUrl}
                              alt={`${spot.name} ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {isMain ? (
                              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                                ✓
                              </div>
                            ) : (
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold text-center px-1">
                                Choisir comme principale
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Drag & Drop Upload Zone (4 cols) */}
                  <div className="lg:col-span-4 space-y-2">
                    <div className="text-xs font-bold text-[#073B4C]">
                      Déposer une nouvelle photo :
                    </div>

                    <div
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        e.preventDefault();
                        if (e.dataTransfer.files?.[0]) {
                          handleFileSelect(spot.id, e.dataTransfer.files[0]);
                        }
                      }}
                      className="border-2 border-dashed border-[#DCECEF] hover:border-[#087E8B] rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-colors bg-[#F2FCFC]/40 min-h-[160px] relative group"
                    >
                      {upload?.preview ? (
                        <div className="space-y-2 w-full">
                          <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden border border-[#DCECEF]">
                            <img src={upload.preview} alt="Aperçu" className="w-full h-full object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUploadAndPublish(spot.id)}
                            disabled={upload.isUploading}
                            className="w-full py-2 px-3 rounded-xl bg-[#087E8B] hover:bg-[#087E8B]/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {upload.isUploading ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Publication en cours...</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Publier cette photo sur le site</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center space-y-2 w-full h-full justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              if (e.target.files?.[0]) {
                                handleFileSelect(spot.id, e.target.files[0]);
                              }
                            }}
                          />
                          <div className="w-10 h-10 rounded-full bg-white border border-[#DCECEF] flex items-center justify-center text-[#087E8B] group-hover:scale-110 transition-transform shadow-2xs">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#073B4C] block group-hover:text-[#087E8B]">
                              Glissez une photo ici
                            </span>
                            <span className="text-[11px] text-[#6E858A]">
                              ou cliquez pour parcourir
                            </span>
                          </div>
                        </label>
                      )}
                    </div>

                    {upload?.successMsg && (
                      <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {upload.successMsg}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Double Vérification pour le changement de photo */}
      {confirmPhotoChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#073B4C]/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 border border-[#DCECEF] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#BFEFF2]/50 text-[#087E8B] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#073B4C]">Changer la photo principale ?</h3>
              <p className="text-xs text-[#6E858A]">
                Voulez-vous définir ce cliché comme la nouvelle photo officielle pour <strong className="text-[#073B4C]">{confirmPhotoChange.spotName}</strong> ?
              </p>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#DCECEF] bg-slate-100">
              <img 
                src={confirmPhotoChange.photoUrl} 
                alt="Aperçu" 
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="bg-[#F2FCFC] p-3 rounded-xl border border-[#DCECEF] text-xs text-[#087E8B] font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Cette photo sera immédiatement visible sur tout le site et la carte.</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmPhotoChange(null)}
                className="py-2.5 px-4 rounded-xl font-bold text-[#6E858A] bg-slate-100 hover:bg-slate-200 transition-colors text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  const { spotId, photoUrl } = confirmPhotoChange;
                  setConfirmPhotoChange(null);
                  handleSetActivePhoto(spotId, photoUrl);
                }}
                className="py-2.5 px-4 rounded-xl font-bold text-white bg-[#087E8B] hover:bg-[#087E8B]/90 transition-colors text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Confirmer & Publier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

