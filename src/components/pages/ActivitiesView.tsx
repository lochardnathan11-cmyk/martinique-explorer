'use client';

import React, { useState } from 'react';
import { PlaceItem } from '@/types';
import PlaceCard from '@/components/places/PlaceCard';
import { Compass, Sparkles, Search, MapPin, Clock, DollarSign } from 'lucide-react';

interface ActivitiesViewProps {
  places: PlaceItem[];
  onOpenMap: () => void;
}

export default function ActivitiesView({ places, onOpenMap }: ActivitiesViewProps) {
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const activityPlaces = places.filter(
    p => p.category === 'activity' || p.category === 'restaurant' || p.category === 'event' || p.category === 'hiking' || p.category === 'excursion'
  );

  const filtered = activityPlaces.filter(p => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match = p.name.toLowerCase().includes(q) || p.commune.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (activityFilter === 'all') return true;
    if (activityFilter === 'sea') return p.category === 'excursion' || p.subCategory?.includes('bateau') || p.tags?.includes('Catamaran') || p.tags?.includes('Bateau') || p.tags?.includes('Fonds Blancs');
    if (activityFilter === 'hike') return p.category === 'hiking' || p.subCategory?.includes('Randonnée') || p.tags?.includes('Volcan');
    if (activityFilter === 'canyon') return p.subCategory?.includes('Canyoning');
    if (activityFilter === 'food') return p.category === 'restaurant';
    if (activityFilter === 'event') return p.category === 'event';
    return true;
  });

  return (
    <div className="space-y-12 animate-fadeIn text-left">
      {/* Editorial Header */}
      <div className="bg-white rounded-3xl border border-lagon-border p-8 sm:p-12 shadow-soft space-y-8">
        <div className="space-y-3 max-w-3xl">
          <span className="text-xs font-semibold tracking-wider uppercase text-action">
            Aventure & Douceur de vivre
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold text-deep tracking-tight">
            Expériences, Randonnées & Sorties en Mer
          </h1>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            De l&apos;ascension du dôme de la Montagne Pelée aux fonds blancs du François en catamaran, en passant par les saveurs des langoustes grillées les pieds dans le sable : vivez la Martinique intensément.
          </p>
        </div>

        {/* 4 Thematic Pillars Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActivityFilter('sea')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activityFilter === 'sea' ? 'bg-deep text-white border-deep shadow-soft' : 'bg-lagon-bg border-lagon-border text-ink hover:bg-lagon-light/40'
            }`}
          >
            <div className="text-2xl mb-1">⛵</div>
            <h3 className={`font-semibold text-sm ${activityFilter === 'sea' ? 'text-white' : 'text-deep'}`}>
              Sorties Bateau & Catamaran
            </h3>
            <p className={`text-xs mt-1 leading-relaxed ${activityFilter === 'sea' ? 'text-white/80' : 'text-ink-muted'}`}>
              Baignoire de Joséphine, fonds blancs, dauphins au Nord et baptême du rhum.
            </p>
          </div>

          <div
            onClick={() => setActivityFilter('hike')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activityFilter === 'hike' ? 'bg-deep text-white border-deep shadow-soft' : 'bg-sand-light border-sand-border text-ink hover:bg-sand-border/50'
            }`}
          >
            <div className="text-2xl mb-1">🌋</div>
            <h3 className={`font-semibold text-sm ${activityFilter === 'hike' ? 'text-white' : 'text-deep'}`}>
              Randonnées & Volcans
            </h3>
            <p className={`text-xs mt-1 leading-relaxed ${activityFilter === 'hike' ? 'text-white/80' : 'text-ink-muted'}`}>
              Montagne Pelée (1 397m), Réserve de la Caravelle, Trace des Jésuites.
            </p>
          </div>

          <div
            onClick={() => setActivityFilter('canyon')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activityFilter === 'canyon' ? 'bg-deep text-white border-deep shadow-soft' : 'bg-lagon-bg border-lagon-border text-ink hover:bg-lagon-light/40'
            }`}
          >
            <div className="text-2xl mb-1">🧗</div>
            <h3 className={`font-semibold text-sm ${activityFilter === 'canyon' ? 'text-white' : 'text-deep'}`}>
              Canyoning & Cascades
            </h3>
            <p className={`text-xs mt-1 leading-relaxed ${activityFilter === 'canyon' ? 'text-white/80' : 'text-ink-muted'}`}>
              Rappels sous cascades et sauts dans les vasques au cœur de la jungle pluviale.
            </p>
          </div>

          <div
            onClick={() => setActivityFilter('food')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activityFilter === 'food' ? 'bg-deep text-white border-deep shadow-soft' : 'bg-sand-light border-sand-border text-ink hover:bg-sand-border/50'
            }`}
          >
            <div className="text-2xl mb-1">🦞</div>
            <h3 className={`font-semibold text-sm ${activityFilter === 'food' ? 'text-white' : 'text-deep'}`}>
              Gastronomie & Rhumeries
            </h3>
            <p className={`text-xs mt-1 leading-relaxed ${activityFilter === 'food' ? 'text-white/80' : 'text-ink-muted'}`}>
              Langoustes fraîches, bokits, acras et dégustations dans les habitations historiques.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Chips */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-lagon-border/70">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher une activité (ex : Catamaran, Pelée, Zandoli)..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Toutes les expériences' },
              { id: 'sea', label: 'Bateau & Catamaran' },
              { id: 'hike', label: 'Randonnées' },
              { id: 'canyon', label: 'Canyoning' },
              { id: 'food', label: 'Restaurants' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActivityFilter(f.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                  activityFilter === f.id
                    ? 'bg-deep text-white font-semibold shadow-soft'
                    : 'bg-lagon-bg text-ink border border-lagon-border hover:bg-lagon-light/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Experiences */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filtered.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-lagon-border p-8 space-y-3">
          <p className="text-base text-deep font-semibold">Aucune activité ne correspond à vos critères</p>
          <p className="text-xs text-ink-muted">Modifiez vos mots-clés ou réinitialisez le filtre.</p>
        </div>
      )}

      {/* Hiking Preparation Guide Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-lagon-border shadow-soft space-y-4">
        <h3 className="text-lg font-semibold text-deep">
          Bien préparer votre randonnée à la Montagne Pelée
        </h3>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          Le sommet de la Martinique culmine à 1 397 mètres. Pour maximiser vos chances d&apos;avoir un panorama dégagé sur toute la baie de Saint-Pierre et l&apos;arc antillais :
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-ink-muted pt-1 leading-relaxed">
          <div className="p-4 rounded-2xl bg-lagon-bg border border-lagon-border">
            <strong className="text-deep block mb-1">⏱️ Départ matinal impératif</strong>
            Commencez l&apos;ascension depuis le parking du Morne-Rouge entre 6h00 et 7h30 avant que les nuages ne s&apos;accrochent au sommet.
          </div>
          <div className="p-4 rounded-2xl bg-sand-light border border-sand-border">
            <strong className="text-deep block mb-1">💧 Eau & protection thermique</strong>
            Prévoyez au moins 1,5L d&apos;eau par personne et un coupe-vent léger : au sommet, la température peut chuter à 15°C avec du vent.
          </div>
          <div className="p-4 rounded-2xl bg-lagon-bg border border-lagon-border">
            <strong className="text-deep block mb-1">🥾 Chaussures de marche</strong>
            Les marches volcaniques et les rochers peuvent être glissants après les averses tropicales.
          </div>
        </div>
      </div>
    </div>
  );
}
