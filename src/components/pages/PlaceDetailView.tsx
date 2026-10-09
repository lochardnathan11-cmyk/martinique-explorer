'use client';

import React, { useState } from 'react';
import { PlaceItem } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  Share2,
  Check,
  MapPin,
  Compass,
  Star,
  Plus,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Waves,
  Thermometer,
  Wind,
  Sun,
  Eye,
  Car,
  Utensils,
  Accessibility,
  LifeBuoy,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface PlaceDetailViewProps {
  place: PlaceItem;
  places: PlaceItem[];
  onBack: () => void;
  onSelectPlace: (place: PlaceItem) => void;
  onNavigateHome: () => void;
}

export default function PlaceDetailView({
  place,
  places,
  onBack,
  onSelectPlace,
  onNavigateHome
}: PlaceDetailViewProps) {
  const { favorites, toggleFavorite, addToItinerary, itinerary } = useApp();
  const isFav = favorites.includes(place.id);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [addedItineraryDay, setAddedItineraryDay] = useState<number | null>(null);
  const [reviews, setReviews] = useState(place.reviews || []);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState('');

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newRev = {
      id: 'rev-' + Date.now(),
      author: newAuthor.trim() || 'Voyageur de passage',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: newRating,
      date: 'Aujourd\'hui',
      comment: newComment.trim(),
      userBadge: 'Avis vérifié'
    };

    setReviews(prev => [newRev, ...prev]);
    setNewComment('');
    setNewAuthor('');
  };

  // Nearby or similar spots
  const nearbyPlaces = places
    .filter(p => p.id !== place.id && (p.commune === place.commune || p.category === place.category))
    .slice(0, 3);

  return (
    <article className="space-y-12 animate-fadeIn pb-20 text-left">
      {/* 1. Breadcrumbs & Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-lagon-border/70 pb-4 text-xs">
        <nav className="flex items-center gap-2 text-ink-muted flex-wrap">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-action transition-colors cursor-pointer"
          >
            Accueil
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-lagon-border" />
          <button
            type="button"
            onClick={onBack}
            className="hover:text-action transition-colors cursor-pointer capitalize"
          >
            {place.category === 'beach' ? 'Plages' : place.category === 'snorkeling' ? 'Snorkeling' : 'Expériences'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-lagon-border" />
          <span className="text-deep font-semibold truncate max-w-[200px] sm:max-w-md">
            {place.name}
          </span>
        </nav>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-lagon-border text-deep hover:text-action hover:border-action transition-all shadow-xs cursor-pointer text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour aux explorations</span>
        </button>
      </div>

      {/* 2. Place Header & Primary Actions */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-lagon-light text-action text-xs font-semibold tracking-wide uppercase">
                {place.subCategory || place.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-ink-muted font-medium">
                <MapPin className="w-3.5 h-3.5 text-action" />
                {place.commune}, Martinique
              </span>
              {place.featured && (
                <span className="px-2.5 py-0.5 rounded-full bg-sand-light text-deep border border-sand-border text-[11px] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-coral" />
                  Incontournable
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-deep tracking-tight">
              {place.name}
            </h1>

            <div className="flex items-center gap-3 pt-1 text-xs text-ink-muted flex-wrap">
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{place.rating.toFixed(1)}</span>
                <span className="text-ink-muted font-normal">({reviews.length} avis voyageurs)</span>
              </div>
              <span>•</span>
              <span className="font-medium text-deep">
                Affluence habituelle : <strong className="font-semibold text-action">{place.crowdLevel}</strong>
              </span>
            </div>
          </div>

          {/* Quick Actions Header Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => toggleFavorite(place.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                isFav
                  ? 'bg-coral-soft border-coral text-coral'
                  : 'bg-white border-lagon-border text-deep hover:bg-lagon-bg'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-coral text-coral' : ''}`} />
              <span>{isFav ? 'Dans vos favoris' : 'Enregistrer'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-lagon-border text-deep hover:text-action hover:border-action transition-all shadow-xs text-xs font-semibold cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-action" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Lien copié' : 'Partager'}</span>
            </button>
          </div>
        </div>

        {/* 3. Photo Gallery with Thumbnails */}
        <div className="space-y-4">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-lagon-bg shadow-card border border-lagon-border">
            <img
              src={place.photos[activePhotoIdx] || place.photos[0]}
              alt={place.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 bg-deep/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              Photo {activePhotoIdx + 1} sur {place.photos.length}
            </div>
          </div>

          {place.photos.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {place.photos.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative w-24 h-16 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    activePhotoIdx === idx ? 'border-action scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 4. Live Conditions Ribbon */}
      {place.realTime && (
        <div className="p-6 rounded-3xl bg-white border border-lagon-border shadow-soft space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-semibold text-deep text-sm sm:text-base">
                Conditions marines & météo en direct
              </h3>
            </div>
            <span className="text-xs text-ink-muted">
              Mise à jour : {place.realTime.lastUpdate}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-lagon-bg/60 border border-lagon-border flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-action shrink-0" />
              <div>
                <span className="text-[11px] text-ink-muted block">Eau & Air</span>
                <strong className="text-sm text-deep">{place.realTime.tempWater}°C • {place.realTime.tempAir}°C</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-lagon-bg/60 border border-lagon-border flex items-center gap-3">
              <Waves className="w-5 h-5 text-action shrink-0" />
              <div>
                <span className="text-[11px] text-ink-muted block">Sargasses</span>
                <strong className="text-sm text-emerald-700">
                  {place.realTime.sargassum === 'none' ? 'Aucune sargasse' : 'Faible présence'}
                </strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-lagon-bg/60 border border-lagon-border flex items-center gap-3">
              <Wind className="w-5 h-5 text-action shrink-0" />
              <div>
                <span className="text-[11px] text-ink-muted block">Vent & Mer</span>
                <strong className="text-sm text-deep">{place.realTime.seaState} ({place.realTime.windSpeed} km/h)</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-lagon-bg/60 border border-lagon-border flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="text-[11px] text-ink-muted block">Indice UV</span>
                <strong className="text-sm text-deep">UV {place.realTime.uvIndex} ({place.realTime.weather})</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Main Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Full specs & Description */}
        <div className="lg:col-span-8 space-y-10">
          {/* Detailed Editorial Description */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-deep">
              À propos de {place.name}
            </h2>
            <p className="text-base text-ink-muted leading-relaxed">
              {place.description}
            </p>

            {/* Tags Pills */}
            {place.tags && (
              <div className="flex flex-wrap gap-2 pt-2">
                {place.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-lagon-bg text-action text-xs font-medium border border-lagon-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Snorkeling Specialist Card (if applicable) */}
          {place.observableFauna && (
            <section className="p-6 sm:p-8 rounded-3xl bg-sand-light border border-sand-border space-y-5">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-action" />
                <h3 className="font-semibold text-deep text-lg">
                  Fiche Snorkeling & Faune Observable
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-ink-muted block mb-1">Niveau d&apos;accès :</span>
                  <strong className="text-deep text-sm font-semibold">{place.spotDifficulty || 'Tous niveaux'}</strong>
                </div>
                <div>
                  <span className="text-ink-muted block mb-1">Profondeur d&apos;observation :</span>
                  <strong className="text-deep text-sm font-semibold">{place.depth || '1 à 5 mètres'}</strong>
                </div>
                <div>
                  <span className="text-ink-muted block mb-1">Conditions idéales :</span>
                  <strong className="text-deep text-sm font-semibold">{place.idealConditions || 'Matin calme'}</strong>
                </div>
                <div>
                  <span className="text-ink-muted block mb-1">Consigne de sécurité :</span>
                  <strong className="text-coral text-sm font-semibold">{place.safetyTips || 'Respecter les fonds'}</strong>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs font-semibold text-deep block mb-2">Espèces fréquemment observées :</span>
                <div className="flex flex-wrap gap-2">
                  {place.observableFauna.map((fauna, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-white text-deep text-xs font-medium border border-sand-border shadow-xs"
                    >
                      🐠 {fauna}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Practical Checklist Grid */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-deep">
              Informations pratiques & Accès
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-lagon-border space-y-1">
                <div className="flex items-center gap-2 text-deep font-semibold">
                  <Car className="w-4 h-4 text-action" />
                  <span>Parking</span>
                </div>
                <p className="text-ink-muted">{place.parking || 'Stationnement disponible'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-lagon-border space-y-1">
                <div className="flex items-center gap-2 text-deep font-semibold">
                  <LifeBuoy className="w-4 h-4 text-action" />
                  <span>Baignade</span>
                </div>
                <p className="text-ink-muted">
                  {place.isLifeguarded ? 'Surveillée en saison' : 'Non surveillée'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-lagon-border space-y-1">
                <div className="flex items-center gap-2 text-deep font-semibold">
                  <Utensils className="w-4 h-4 text-action" />
                  <span>Restauration</span>
                </div>
                <p className="text-ink-muted">
                  {place.restaurantsNearby ? 'Restaurants / snacks à proximité' : 'Prévoir son pique-nique'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-lagon-border space-y-1">
                <div className="flex items-center gap-2 text-deep font-semibold">
                  <Accessibility className="w-4 h-4 text-action" />
                  <span>Accessibilité PMR</span>
                </div>
                <p className="text-ink-muted">
                  {place.accessibilityPMR ? 'Accessible aux personnes à mobilité réduite' : 'Accès par sentier ou marches'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-lagon-border space-y-1">
                <div className="flex items-center gap-2 text-deep font-semibold">
                  {place.isDangerous ? (
                    <ShieldAlert className="w-4 h-4 text-coral" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  )}
                  <span>Sécurité</span>
                </div>
                <p className="text-ink-muted">
                  {place.isDangerous ? 'Courants ou rouleaux signalés' : 'Baignade calme et abritée'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-lagon-border space-y-1">
                <div className="flex items-center gap-2 text-deep font-semibold">
                  <MapPin className="w-4 h-4 text-action" />
                  <span>Coordonnées GPS</span>
                </div>
                <p className="text-ink-muted font-mono text-[11px]">
                  {place.coords[0].toFixed(4)}, {place.coords[1].toFixed(4)}
                </p>
              </div>
            </div>
          </section>

          {/* Reviews & Ratings Section */}
          <section className="space-y-6 pt-4 border-t border-lagon-border">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-semibold text-deep flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-action" />
                  Avis & Retours d&apos;expérience ({reviews.length})
                </h3>
                <p className="text-xs text-ink-muted">
                  Partagés par les membres de la communauté Martinique Explorer
                </p>
              </div>
            </div>

            {/* New Review Form */}
            <form onSubmit={handleAddReview} className="p-6 rounded-3xl bg-white border border-lagon-border space-y-4 shadow-soft">
              <h4 className="text-sm font-semibold text-deep">
                Vous avez visité {place.name} ? Laissez votre avis !
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newAuthor}
                  onChange={e => setNewAuthor(e.target.value)}
                  placeholder="Votre prénom ou pseudo (ex: Thomas B.)"
                  className="px-4 py-2.5 rounded-xl bg-lagon-bg border border-lagon-border text-xs focus:border-action focus:outline-none"
                />

                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink-muted">Note :</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Racontez votre expérience : clarté de l'eau, facilité de parking, faune croisée, ombre disponible..."
                rows={3}
                className="w-full p-4 rounded-xl bg-lagon-bg border border-lagon-border text-xs focus:border-action focus:outline-none resize-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-6 py-2.5 rounded-xl bg-action hover:bg-action-hover disabled:opacity-50 text-white text-xs font-semibold shadow-soft cursor-pointer transition-colors"
                >
                  Publier mon avis vérifié
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map(rev => (
                <div key={rev.id} className="p-5 rounded-3xl bg-white border border-lagon-border space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={rev.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-deep text-xs">{rev.author}</span>
                          {rev.userBadge && (
                            <span className="px-2 py-0.5 rounded-full bg-sand-light text-deep border border-sand-border text-[10px] font-medium">
                              {rev.userBadge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-ink-muted">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed pt-1">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Actions, GPS & Itinerary */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Enregistrer & Carte Interactive */}
          <div className="p-6 rounded-3xl bg-white border border-lagon-border shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-deep text-sm">
                Enregistrer ce lieu
              </h4>
              <button
                type="button"
                onClick={() => toggleFavorite(place.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-sand-light text-deep border border-sand-border hover:border-action transition-all cursor-pointer"
              >
                <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-coral text-coral' : 'text-ink-muted'}`} />
                <span>{isFav ? 'Favori sauvegardé' : 'Ajouter aux favoris'}</span>
              </button>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Retrouvez {place.name} à tout moment parmi vos coups de cœur et affichez-le directement sur la carte de l&apos;île.
            </p>
            <a
              href="/carte"
              className="w-full py-2.5 rounded-xl bg-lagon-bg hover:bg-lagon-light/60 border border-lagon-border text-deep text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-action" />
              <span>Localiser sur la carte interactive</span>
            </a>
          </div>

          {/* GPS Navigation Launcher */}
          <div className="p-6 rounded-3xl bg-white border border-lagon-border shadow-soft space-y-4">
            <h4 className="font-semibold text-deep text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-action" />
              S&apos;y rendre en voiture / GPS
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Ouvrez directement l&apos;itinéraire sur votre smartphone vers {place.name}.
            </p>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.coords[0]},${place.coords[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-action hover:bg-action-hover text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-soft cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ouvrir l&apos;itinéraire GPS</span>
            </a>
          </div>

          {/* Nearby spots */}
          {nearbyPlaces.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-lagon-border shadow-soft space-y-4">
              <h4 className="font-semibold text-deep text-sm">
                À découvrir à proximité
              </h4>
              <div className="space-y-3">
                {nearbyPlaces.map(np => (
                  <div
                    key={np.id}
                    onClick={() => {
                      onSelectPlace(np);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-3 rounded-2xl border border-lagon-border hover:border-action transition-all flex items-center gap-3 cursor-pointer group bg-lagon-bg/40 hover:bg-white"
                  >
                    <img src={np.photos[0]} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h5 className="text-xs font-semibold text-deep group-hover:text-action truncate transition-colors">
                        {np.name}
                      </h5>
                      <p className="text-[11px] text-ink-muted truncate">{np.commune}</p>
                      <span className="text-[10px] text-action font-medium">Voir la fiche →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
