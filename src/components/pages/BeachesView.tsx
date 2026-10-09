'use client';

import React, { useState } from 'react';
import { PlaceItem } from '@/types';
import PlaceCard from '@/components/places/PlaceCard';
import { Compass, Sparkles, Sun, Waves, Search, ShieldCheck } from 'lucide-react';

interface BeachesViewProps {
  places: PlaceItem[];
  onOpenMap: () => void;
}

export default function BeachesView({ places, onOpenMap }: BeachesViewProps) {
  const [beachFilter, setBeachFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyCleanWater, setOnlyCleanWater] = useState(false);

  const beachPlaces = places.filter(p => p.category === 'beach');

  const filteredBeaches = beachPlaces.filter(p => {
    // Sargassum filter
    if (onlyCleanWater && p.realTime?.sargassum !== 'none') return false;

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match = p.name.toLowerCase().includes(q) || p.commune.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Category chip filter
    if (beachFilter === 'all') return true;
    if (beachFilter === 'calm') return p.crowdLevel === 'Faible' || p.tags?.includes('Famille') || p.tags?.includes('Baignade');
    if (beachFilter === 'sunset') return p.tags?.includes('Coucher de soleil');
    if (beachFilter === 'volcanic') return p.tags?.includes('Sable noir') || p.tags?.includes('Sauvage');
    if (beachFilter === 'snorkeling') return p.tags?.includes('Snorkeling');
    return true;
  });

  return (
    <div className="space-y-12 animate-fadeIn text-left">
      {/* Editorial Header */}
      <div className="bg-white rounded-3xl border border-lagon-border p-8 sm:p-12 shadow-soft space-y-8">
        <div className="space-y-3 max-w-3xl">
          <span className="text-xs font-semibold tracking-wider uppercase text-action">
            Guide du littoral de Madinina
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold text-deep tracking-tight">
            Les plages d&apos;exception de Martinique
          </h1>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            Des 2 kilomètres de sable doré bordé de cocotiers des Salines aux anses sauvages de sable noir volcanique du Prêcheur, explorez les plus beaux rivages de l&apos;île avec suivi des conditions en temps réel.
          </p>
        </div>

        {/* Real-time Coastal Status Banner */}
        <div className="p-5 rounded-2xl bg-lagon-bg border border-lagon-border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-action animate-pulse shrink-0" />
            <div>
              <span className="font-semibold text-deep block sm:inline">Bulletin côtier en direct : </span>
              <span className="text-ink-muted">Côte Caraïbe calme (28°C) • Zéro sargasse aux Salines, Anses d&apos;Arlet et Sainte-Luce.</span>
            </div>
          </div>
          <button
            onClick={onOpenMap}
            className="text-action hover:text-action-hover font-medium flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Compass className="w-4 h-4" />
            <span>Localiser sur la carte</span>
          </button>
        </div>

        {/* Two Coastal Contrasts (Editorial Spotlight) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-sand-light border border-sand-border space-y-1.5">
            <h3 className="font-semibold text-deep text-sm flex items-center gap-2">
              <span>🏝️ Le Sud Caraïbe (Sable blanc & lagon)</span>
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Les Salines, Sainte-Luce, Grande Anse : des eaux tièdes, translucides et peu profondes, idéales pour les familles, les couchers de soleil et la baignade sereine.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-lagon-bg border border-lagon-border space-y-1.5">
            <h3 className="font-semibold text-deep text-sm flex items-center gap-2">
              <span>🌋 Le Nord Sauvage (Sable noir volcanique)</span>
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Anse Couleuvre, Anse Ceron : nichées au pied de la Montagne Pelée, ces criques sauvages bordées d&apos;une jungle luxuriante offrent un dépaysement tropical absolu.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 pt-4 border-t border-lagon-border/70">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Rechercher une plage par nom ou commune (ex: Salines, Diamant, Anse Noire)..."
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setOnlyCleanWater(!onlyCleanWater)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-medium border transition-colors flex items-center gap-2 ${
                onlyCleanWater
                  ? 'bg-deep text-white border-deep font-semibold shadow-soft'
                  : 'bg-white text-ink border-lagon-border hover:bg-lagon-bg'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${onlyCleanWater ? 'bg-lagon-light' : 'bg-action'}`} />
              <span>Uniquement sans sargasses</span>
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Toutes les plages' },
              { id: 'calm', label: 'Eaux calmes & familles' },
              { id: 'sunset', label: 'Couchers de soleil' },
              { id: 'volcanic', label: 'Sable noir volcanique' },
              { id: 'snorkeling', label: 'Avec récifs coralliens' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setBeachFilter(f.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-medium transition-colors ${
                  beachFilter === f.id
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

      {/* Grid of Beaches */}
      {filteredBeaches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredBeaches.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-lagon-border p-8 space-y-3">
          <p className="text-base text-deep font-semibold">Aucune plage ne correspond à vos filtres</p>
          <p className="text-xs text-ink-muted">
            Essayez de désactiver le filtre &ldquo;Uniquement sans sargasses&rdquo; ou de modifier vos mots-clés.
          </p>
        </div>
      )}

      {/* Local Beach Etiquette Advice Box */}
      <div className="p-8 rounded-3xl bg-white border border-lagon-border space-y-3 shadow-soft">
        <h3 className="font-semibold text-deep text-base">
          Conseils locaux pour profiter pleinement des plages
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-ink-muted leading-relaxed">
          <div>
            <strong className="text-deep block mb-1">🥥 Les douceurs sous les raisiniers</strong>
            Ne manquez pas les vendeuses traditionnelles de sorbets coco à la manivelle et de beignets de bananes au bord des Salines et de Sainte-Luce.
          </div>
          <div>
            <strong className="text-deep block mb-1">🕒 Le bon créneau horaire</strong>
            Pour éviter l&apos;affluence et trouver une place de stationnement ombragée, arrivez avant 10h00 le matin ou après 16h00 pour la lumière dorée.
          </div>
          <div>
            <strong className="text-deep block mb-1">🌳 Attention aux mancenilliers</strong>
            Sur certaines plages sauvages, les arbres marqués d&apos;un trait rouge sont toxiques : ne vous abritez jamais dessous en cas de pluie.
          </div>
        </div>
      </div>
    </div>
  );
}
