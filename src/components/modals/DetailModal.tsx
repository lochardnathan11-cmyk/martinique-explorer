'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { PlaceItem } from '@/types';
import { X, Heart, Plus, ExternalLink } from 'lucide-react';

export default function DetailModal({ place }: { place: PlaceItem }) {
  const { closeModal, favorites, toggleFavorite, addToItinerary } = useApp();
  const isFav = favorites.includes(place.id);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-deep/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-4xl border border-lagon-border shadow-modal overflow-hidden flex flex-col max-h-[90vh]">
        {/* Visual Header */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-lagon-bg shrink-0">
          <img
            src={place.photos[0]}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/75 via-transparent to-transparent pointer-events-none" />

          {/* Close Action */}
          <button
            type="button"
            onClick={closeModal}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-ink flex items-center justify-center transition-colors shadow-soft"
            aria-label="Fermer la vue détaillée"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Favorite Action */}
          <button
            type="button"
            onClick={() => toggleFavorite(place.id)}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-ink flex items-center justify-center transition-colors shadow-soft"
            aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-coral text-coral' : 'text-ink-muted'}`} />
          </button>

          {/* Title & Badge Over Image */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium">
                {place.subCategory || place.category}
              </span>
              <span className="text-white/80">
                {place.commune}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold leading-tight text-white">
              {place.name}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-8 sm:p-10 overflow-y-auto space-y-8 flex-1">
          {/* Live Conditions Ribbon if present */}
          {place.realTime && (
            <div className="p-5 rounded-2xl bg-lagon-bg border border-lagon-border text-xs text-ink space-y-2">
              <div className="flex items-center justify-between font-semibold text-deep">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-action" />
                  Conditions marines actuelles
                </span>
                <span className="text-action">
                  {place.realTime.sargassum === 'none' ? 'Eau cristalline sans sargasses' : 'Quelques sargasses signalées'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-ink-muted">
                <div>
                  <span className="block text-[11px]">Météo</span>
                  <strong className="text-ink">{place.realTime.weather}</strong>
                </div>
                <div>
                  <span className="block text-[11px]">Température de l&apos;eau</span>
                  <strong className="text-ink">{place.realTime.tempWater}°C</strong>
                </div>
                <div>
                  <span className="block text-[11px]">État de la mer</span>
                  <strong className="text-ink">{place.realTime.seaState}</strong>
                </div>
                <div>
                  <span className="block text-[11px]">Vent & UV</span>
                  <strong className="text-ink">{place.realTime.windSpeed} km/h (UV {place.realTime.uvIndex})</strong>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-action">
              À propos de ce lieu
            </h3>
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              {place.description}
            </p>
          </div>

          {/* Snorkeling Guide if relevant */}
          {place.category === 'snorkeling' && (
            <div className="p-6 rounded-2xl bg-sand-light border border-sand-border space-y-3 text-xs text-ink leading-relaxed">
              <h4 className="font-semibold text-deep text-sm">
                Conseils d&apos;observation snorkeling
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-ink-muted block text-[11px]">Niveau requis</span>
                  <strong>{place.spotDifficulty}</strong>
                </div>
                <div>
                  <span className="text-ink-muted block text-[11px]">Profondeur</span>
                  <strong>{place.depth}</strong>
                </div>
                <div>
                  <span className="text-ink-muted block text-[11px]">Période idéale</span>
                  <strong>{place.idealConditions}</strong>
                </div>
              </div>
              {place.observableFauna && (
                <div className="pt-2">
                  <span className="text-ink-muted block text-[11px] mb-1">Espèces observables :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {place.observableFauna.map((fauna, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-white text-deep text-xs font-medium border border-sand-border">
                        {fauna}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Amenities & Practical Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {place.parking && (
              <div className="p-4 rounded-2xl bg-lagon-bg border border-lagon-border">
                <span className="text-ink-muted block text-[11px]">Stationnement</span>
                <strong className="text-deep font-semibold">{place.parking}</strong>
              </div>
            )}
            {place.crowdLevel && (
              <div className="p-4 rounded-2xl bg-lagon-bg border border-lagon-border">
                <span className="text-ink-muted block text-[11px]">Affluence</span>
                <strong className="text-deep font-semibold">{place.crowdLevel}</strong>
              </div>
            )}
            {place.priceRange && (
              <div className="p-4 rounded-2xl bg-lagon-bg border border-lagon-border">
                <span className="text-ink-muted block text-[11px]">Tarif moyen</span>
                <strong className="text-deep font-semibold">{place.priceRange}</strong>
              </div>
            )}
            {place.toilets !== undefined && (
              <div className="p-4 rounded-2xl bg-lagon-bg border border-lagon-border">
                <span className="text-ink-muted block text-[11px]">Sanitaires</span>
                <strong className="text-deep font-semibold">{place.toilets ? 'Aménagés' : 'Non équipés'}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Sticky Bar */}
        <div className="p-6 bg-lagon-bg border-t border-lagon-border flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              toggleFavorite(place.id);
            }}
            className="px-6 py-3 rounded-2xl bg-action hover:bg-action-hover text-white text-xs sm:text-sm font-medium transition-colors shadow-soft flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
          </button>

          <button
            type="button"
            onClick={closeModal}
            className="px-5 py-3 rounded-2xl text-xs font-medium text-ink-muted hover:text-deep transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
