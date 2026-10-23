'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Heart, X, Sparkles, ArrowRight, User, MapPin } from 'lucide-react';

export default function FavoriteAuthPromptModal() {
  const { activeModal, places, closeModal, openModal } = useApp();
  const router = useRouter();

  // Identifier le lieu concerné si l'utilisateur a cliqué sur un spot spécifique
  const place = places?.find(p => p.id === activeModal.data?.placeId);

  const placePhoto =
    place?.photos?.[0] ||
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';

  const placeCategory =
    place?.subCategory ||
    (place?.category === 'beach'
      ? 'Plage des Caraïbes'
      : place?.category === 'snorkeling'
      ? 'Spot Snorkeling & Tortues'
      : place?.category === 'hiking'
      ? 'Randonnée & Forêt'
      : 'Spot Coup de Cœur');

  const handleOpenLogin = () => {
    closeModal();
    openModal('auth');
  };

  const handleOpenSignup = () => {
    closeModal();
    router.push('/inscription');
  };

  return (
    <div className="fixed inset-0 z-[2500] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      {/* Fermeture au clic extérieur */}
      <div className="absolute inset-0" onClick={closeModal} />

      <div className="relative bg-white w-full max-w-[410px] rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden animate-slideUp text-center z-10">
        {/* 1. Header Photo immersif du spot ou de la Martinique */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
          <img
            src={placePhoto}
            alt={place?.name || 'Spot Martinique Explorer'}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-700 hover:scale-110"
          />

          {/* Dégradés cinématiques pour contraste parfait */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

          {/* Bouton fermer translucide */}
          <button
            type="button"
            onClick={closeModal}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer z-10"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Pill de commune */}
          {place?.commune && (
            <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>{place.commune}</span>
            </div>
          )}

          {/* Titre & catégorie sur la photo */}
          <div className="absolute bottom-3.5 left-4 right-4 text-left text-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block mb-0.5">
              {placeCategory}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm truncate">
              {place ? place.name : 'Vos spots coups de cœur'}
            </h3>
          </div>
        </div>

        {/* Médaillon Cœur battant flottant */}
        <div className="relative -mt-6 flex justify-center z-20">
          <div className="w-13 h-13 rounded-2xl bg-white shadow-xl border border-rose-100 flex items-center justify-center ring-4 ring-white text-rose-500">
            <Heart className="w-7 h-7 fill-rose-500 text-rose-500 animate-pulse" />
          </div>
        </div>

        {/* 2. Contenu textuel & avantages */}
        <div className="px-6 pt-2.5 pb-6 sm:px-7 sm:pb-7 space-y-4">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
              {place ? `Ajoutez ${place.name} à vos favoris` : 'Sauvegardez vos coups de cœur'}
            </h4>
            <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed max-w-xs mx-auto">
              Rejoignez Martinique Explorer pour enregistrer vos plages secrètes, les retrouver sur tous vos appareils et gagner des points d&apos;exploration.
            </p>
          </div>

          {/* 3 micro-cartes d'avantages modernes */}
          <div className="grid grid-cols-3 gap-2 pt-0.5">
            <div className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1">
              <div className="text-sm">⭐</div>
              <div className="text-[11px] font-bold text-slate-900 leading-tight">+15 XP</div>
              <div className="text-[10px] text-slate-500">par favori</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1">
              <div className="text-sm">📱</div>
              <div className="text-[11px] font-bold text-slate-900 leading-tight">Cloud Sync</div>
              <div className="text-[10px] text-slate-500">PC & Mobile</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1">
              <div className="text-sm">🧭</div>
              <div className="text-[11px] font-bold text-slate-900 leading-tight">Badges & XP</div>
              <div className="text-[10px] text-slate-500">8 Niveaux</div>
            </div>
          </div>

          {/* Boutons d'action avec finitions premium */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleOpenSignup}
              className="w-full py-3 px-4 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>Créer un compte gratuit (+30 XP)</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </button>

            <button
              type="button"
              onClick={handleOpenLogin}
              className="w-full py-2.5 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>J&apos;ai déjà un compte · Se connecter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
