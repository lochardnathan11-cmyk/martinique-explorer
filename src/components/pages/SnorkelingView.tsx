'use client';

import React, { useState } from 'react';
import { PlaceItem } from '@/types';
import PlaceCard from '@/components/places/PlaceCard';
import Marine3DViewer from '@/components/snorkeling/Marine3DViewer';
import { Compass, ShieldCheck, Search, Eye, X } from 'lucide-react';

interface SnorkelingViewProps {
  places: PlaceItem[];
  onOpenMap: () => void;
}

export default function SnorkelingView({ places, onOpenMap }: SnorkelingViewProps) {
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>('green_turtle');

  const snorkelingPlaces = places.filter(
    p =>
      p.category === 'snorkeling' ||
      p.tags?.includes('Snorkeling') ||
      p.tags?.includes('Tortues') ||
      p.tags?.includes('Tortues marines') ||
      p.tags?.includes('Fonds marins')
  );

  const filtered = snorkelingPlaces.filter(p => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.commune.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (difficultyFilter === 'all') return true;
    if (difficultyFilter === 'beginner')
      return p.spotDifficulty === 'Débutant' || p.tags?.includes('Famille') || p.tags?.includes('Tortues');
    if (difficultyFilter === 'reef')
      return (
        p.spotDifficulty === 'Intermédiaire' ||
        p.spotDifficulty === 'Confirmé' ||
        p.tags?.includes('Fonds marins') ||
        p.tags?.includes('Spot Secret')
      );
    return true;
  });

  return (
    <div className="space-y-12 animate-fadeIn text-left">
      {/* 1. IMMERSIVE UNDERWATER HERO HEADER */}
      <div className="relative rounded-[32px] overflow-hidden border border-lagon-border shadow-soft bg-deep text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=2000&q=85"
            alt="Tortue marine dans les eaux cristallines de Martinique"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep/90 via-deep/70 to-deep/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-transparent to-deep/20" />
        </div>

        <div className="relative z-10 p-8 sm:p-12 lg:p-14 space-y-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-white">
              <span>🤿</span>
              <span>Sanctuaire Marin de Madinina</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/25 backdrop-blur-md border border-sky-300/30 text-xs font-medium text-sky-100">
              <Eye className="w-3.5 h-3.5 text-sky-300" />
              <span>Visibilité sous-marine : Excellente (20m+ Côte Caraïbe)</span>
            </span>
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-[1.12]">
              Snorkeling & Observation des Tortues.
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl">
              Accessible directement depuis la plage avec un simple masque et tuba : explorez les herbiers où broutent les tortues vertes et les tombants volcaniques tapissés de gorgones et d&apos;éponges multicolores.
            </p>
          </div>

          <div className="pt-2 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-t border-white/15">
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">0 à 5m</div>
                <div className="text-[11px] sm:text-xs text-white/70">Profondeur idéale depuis le bord</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-sky-300">7h30 – 9h30</div>
                <div className="text-[11px] sm:text-xs text-white/70">Meilleur créneau tortues</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-300">5 mètres</div>
                <div className="text-[11px] sm:text-xs text-white/70">Distance de respect réglementaire</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenMap}
              className="self-start lg:self-auto px-6 py-3.5 rounded-2xl bg-action hover:bg-action-hover text-white text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-soft transition-all cursor-pointer shrink-0"
            >
              <Compass className="w-4 h-4" />
              <span>Carte des spots de snorkeling</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE 3D ROTATABLE MARINE OBSERVATORY */}
      <Marine3DViewer
        selectedSpeciesId={selectedSpeciesId}
        onSelectSpecies={setSelectedSpeciesId}
      />

      {/* 3. ECO-RESPONSIBLE CHARTER + SEARCH & FILTERS */}
      <div className="bg-white rounded-3xl border border-lagon-border p-6 sm:p-8 shadow-soft space-y-6">
        {/* Eco Charter */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-sand-light via-sand-light/60 to-lagon-bg/40 border border-sand-border space-y-3">
          <div className="flex items-center gap-2 font-semibold text-deep text-sm">
            <ShieldCheck className="w-4 h-4 text-action shrink-0" />
            <span>Charte de protection des tortues marines & récifs coralliens</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-ink-muted leading-relaxed">
            <div className="bg-white/80 p-3.5 rounded-xl border border-sand-border/80">
              <strong className="text-deep block mb-1">1. Distance de 5 mètres minimum</strong>
              Ne touchez jamais une tortue, ne la poursuivez pas et laissez-lui toujours un accès dégagé vers la surface pour respirer.
            </div>
            <div className="bg-white/80 p-3.5 rounded-xl border border-sand-border/80">
              <strong className="text-deep block mb-1">2. Ne jamais poser le pied sur le récif</strong>
              Observez les tombants rocheux (côtés des anses) en flottant à l&apos;horizontale : le moindre coup de palme brise des années de croissance corallienne.
            </div>
            <div className="bg-white/80 p-3.5 rounded-xl border border-sand-border/80">
              <strong className="text-deep block mb-1">3. Lycra UV plutôt que crème solaire</strong>
              Les filtres chimiques blanchissent les coraux. Privilégiez un t-shirt anti-UV à manches longues pour nager longtemps sans coup de soleil.
            </div>
          </div>
        </div>

        {/* Search & Difficulty Chips */}
        <div className="flex flex-col md:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher un spot sous-marin (ex : Anse Dufour, Anse Noire, Pointe Borgnèse, Crique)..."
              className="w-full text-xs sm:text-sm pl-11 pr-9 py-3 rounded-2xl bg-lagon-bg/70 border border-lagon-border text-ink focus:border-action focus:bg-white focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-deep cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: '🤿 Tous les spots' },
              { id: 'beginner', label: '🐢 Herbiers & Débutants' },
              { id: 'reef', label: '🪸 Tombants & Grottes' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setDifficultyFilter(f.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-medium transition-colors cursor-pointer ${
                  difficultyFilter === f.id
                    ? 'bg-deep text-white font-semibold shadow-soft'
                    : 'bg-lagon-bg/70 text-ink border border-lagon-border hover:bg-lagon-light/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. GRID OF SNORKELING SPOTS */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filtered.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-lagon-border p-8 space-y-4">
          <p className="text-base text-deep font-semibold">Aucun spot ne correspond à votre filtre</p>
          <p className="text-xs text-ink-muted">Réinitialisez la recherche pour voir tous les spots.</p>
          <button
            type="button"
            onClick={() => {
              setDifficultyFilter('all');
              setSearchTerm('');
            }}
            className="px-5 py-2.5 rounded-2xl bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors cursor-pointer"
          >
            Afficher tous les spots
          </button>
        </div>
      )}

      {/* 5. SPOTLIGHT: ANSE DUFOUR VS ANSE NOIRE */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-lagon-border shadow-soft space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-action block">
            Zoom géologique & sous-marin
          </span>
          <h3 className="text-xl sm:text-2xl font-semibold text-deep">
            Le duo mythique : Anse Dufour & Anse Noire
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-3xl">
            Séparées par un simple cap rocheux de 150 mètres aux Anses-d&apos;Arlet, ces deux criques jumelles offrent deux écosystèmes sous-marins radicalement différents à explorer lors d&apos;une même matinée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="p-6 rounded-3xl bg-sand-light/80 border border-sand-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-white text-deep font-semibold text-[11px] border border-sand-border">
                Sable blond corallien
              </span>
              <span className="text-action font-bold">Profondeur : 1m à 4m</span>
            </div>
            <h4 className="font-semibold text-deep text-base">🐢 Anse Dufour — Le royaume des tortues vertes</h4>
            <p className="text-ink-muted">
              Son fond de sable clair reflète la lumière comme une piscine naturelle. Au centre de la baie, le grand herbier attire chaque jour les tortues vertes. Les falaises de droite et de gauche regorgent de poissons-coffres et de sergents-majors.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-lagon-bg/80 border border-lagon-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-deep text-white font-semibold text-[11px]">
                Sable noir volcanique
              </span>
              <span className="text-action font-bold">Profondeur : 2m à 12m</span>
            </div>
            <h4 className="font-semibold text-deep text-base">🌋 Anse Noire — Tombants rocheux & eaux profondes</h4>
            <p className="text-ink-muted">
              Accessible par 130 marches, cette crique sauvage est l&apos;unique plage de sable noir du Sud. En longeant la paroi rocheuse de gauche depuis le ponton, vous survolerez de superbes gorgones, des bancs de carangues et parfois des tortues imbriquées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
