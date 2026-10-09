'use client';

import React from 'react';
import { PlaceItem } from '@/types';
import { useApp } from '@/context/AppContext';
import { Heart } from 'lucide-react';

interface PlaceCardProps {
  place: PlaceItem;
  variant?: 'standard' | 'featured';
}

export default function PlaceCard({ place, variant = 'standard' }: PlaceCardProps) {
  const { favorites, toggleFavorite, openModal } = useApp();
  const isFav = favorites.includes(place.id);

  return (
    <article
      onClick={() => openModal('detail', place)}
      className="group bg-white rounded-3xl border border-lagon-border overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 flex flex-col cursor-pointer text-left"
    >
      {/* 1. Image with constant ratio & subtle zoom */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-lagon-bg">
        <img
          src={place.photos[0]}
          alt={`Photographie de ${place.name} en Martinique`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle Dark Gradient Overlay only at top for favorite contrast */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-deep/40 to-transparent pointer-events-none" />

        {/* Coral Accent Favorite Button */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleFavorite(place.id);
          }}
          aria-label={isFav ? `Retirer ${place.name} des favoris` : `Ajouter ${place.name} aux favoris`}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-ink flex items-center justify-center transition-all duration-200 shadow-soft backdrop-blur-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? 'fill-coral text-coral' : 'text-ink-muted hover:text-coral'
            }`}
          />
        </button>

        {/* Small discreet category or condition pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          {place.realTime && place.realTime.sargassum === 'none' ? (
            <span className="px-2.5 py-1 rounded-full bg-white/95 text-deep text-[11px] font-medium shadow-sm backdrop-blur-sm">
              Eau limpide
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-white/95 text-deep text-[11px] font-medium shadow-sm backdrop-blur-sm">
              {place.subCategory || place.category}
            </span>
          )}
        </div>
      </div>

      {/* Card Content with Clear Hierarchy */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* 2. Category & Commune */}
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <span className="font-medium tracking-wide uppercase text-[11px]">
              {place.commune}
            </span>
            <span className="font-semibold text-deep">
              ★ {place.rating.toFixed(1)}
            </span>
          </div>

          {/* 3. Title */}
          <h3 className="font-semibold text-deep text-lg leading-snug group-hover:text-action transition-colors">
            {place.name}
          </h3>

          {/* 4. Secondary Information (short, comfortable line height) */}
          <p className="text-sm text-ink-muted line-clamp-2 leading-relaxed pt-1">
            {place.description}
          </p>
        </div>

        {/* 5. Action */}
        <div className="pt-2 border-t border-lagon-border/60 flex items-center justify-between text-xs">
          <span className="text-ink-muted">
            {place.crowdLevel ? `Affluence ${place.crowdLevel.toLowerCase()}` : 'Accès libre'}
          </span>
          <span className="font-medium text-action group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
            Découvrir &rarr;
          </span>
        </div>
      </div>
    </article>
  );
}
