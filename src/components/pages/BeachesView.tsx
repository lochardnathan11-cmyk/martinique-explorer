'use client';

import React, { useState } from 'react';
import { PlaceItem } from '@/types';
import PlaceCard from '@/components/places/PlaceCard';
import {
  Compass,
  Sparkles,
  Sun,
  Waves,
  Search,
  ShieldCheck,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  ThermometerSun,
  Wind,
} from 'lucide-react';

interface BeachesViewProps {
  places: PlaceItem[];
  onOpenMap: () => void;
}

export default function BeachesView({ places, onOpenMap }: BeachesViewProps) {
  const [beachFilter, setBeachFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyCleanWater, setOnlyCleanWater] = useState(false);

  const beachPlaces = places.filter(p => p.category === 'beach' || p.category === 'snorkeling');

  const coastalRegions = [
    {
      id: 'sud',
      title: 'Grand Sud & Salines',
      subtitle: 'Sainte-Anne • Sainte-Luce • Diamant',
      desc: 'Lagons cristallins, rubans de cocotiers et sable blanc immaculé.',
      icon: '🏝️',
      communes: ['Sainte-Anne', 'Sainte-Luce', 'Le Diamant'],
      accent: 'from-sky-500/15 to-cyan-500/5 border-sky-200',
    },
    {
      id: 'arlet',
      title: 'Anses-d’Arlet & Caraïbe',
      subtitle: 'Grande Anse • Dufour • Anse Noire',
      desc: 'Eaux calmes comme un miroir, tortues marines et couchers de soleil.',
      icon: '🐢',
      communes: ["Les Anses-d'Arlet", 'Les Trois-Îlets'],
      accent: 'from-teal-500/15 to-emerald-500/5 border-teal-200',
    },
    {
      id: 'nord',
      title: 'Nord Sauvage & Volcan',
      subtitle: 'Le Prêcheur • Carbet • Saint-Pierre',
      desc: 'Criques de sable noir volcanique nichées au pied de la jungle.',
      icon: '🌋',
      communes: ['Le Prêcheur', 'Le Carbet', 'Saint-Pierre'],
      accent: 'from-amber-500/15 to-orange-500/5 border-amber-200',
    },
    {
      id: 'atlantique',
      title: 'Côte Atlantique & Caravelle',
      subtitle: 'La Trinité • Tartane • Vauclin',
      desc: 'Anses ventilées, spots de surf, fonds blancs et nature préservée.',
      icon: '🌊',
      communes: ['La Trinité', 'Le Vauclin', 'Le François', 'Sainte-Marie'],
      accent: 'from-blue-500/15 to-indigo-500/5 border-blue-200',
    },
  ];

  const filteredBeaches = beachPlaces.filter(p => {
    // Sargassum filter
    if (onlyCleanWater && p.realTime?.sargassum && p.realTime.sargassum !== 'none') return false;

    // Region filter
    if (regionFilter !== 'all') {
      const reg = coastalRegions.find(r => r.id === regionFilter);
      if (reg && !reg.communes.some(c => p.commune.toLowerCase().includes(c.toLowerCase()))) {
        return false;
      }
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.commune.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category chip filter
    if (beachFilter === 'all') return true;
    if (beachFilter === 'calm')
      return p.crowdLevel === 'Faible' || p.tags?.includes('Famille') || p.tags?.includes('Baignade') || p.realTime?.seaState === 'Calme';
    if (beachFilter === 'sunset') return p.tags?.includes('Coucher de soleil');
    if (beachFilter === 'volcanic') return p.tags?.includes('Sable noir') || p.tags?.includes('Sauvage');
    if (beachFilter === 'snorkeling') return p.category === 'snorkeling' || p.tags?.includes('Snorkeling') || p.tags?.includes('Tortues');
    if (beachFilter === 'secret') return p.isHiddenGem || p.tags?.includes('Spot Secret');
    return true;
  });

  const hasActiveFilters = beachFilter !== 'all' || regionFilter !== 'all' || searchTerm.trim() !== '' || onlyCleanWater;

  const resetFilters = () => {
    setBeachFilter('all');
    setRegionFilter('all');
    setSearchTerm('');
    setOnlyCleanWater(false);
  };

  return (
    <div className="space-y-12 animate-fadeIn text-left">
      {/* 1. IMMERSIVE HERO HEADER */}
      <div className="relative rounded-[32px] overflow-hidden border border-lagon-border shadow-soft bg-deep text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=85"
            alt="Plage paradisiaque en Martinique"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep/90 via-deep/70 to-deep/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-transparent to-deep/20" />
        </div>

        <div className="relative z-10 p-8 sm:p-12 lg:p-14 space-y-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-white">
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span>Guide Officiel du Littoral</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-300/30 text-xs font-medium text-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Météo des plages : Eau à 28°C • Mer calme</span>
            </span>
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-[1.12]">
              Les plus belles plages de Martinique.
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl">
              Des 2 kilomètres de sable blond bordés de cocotiers des Salines aux criques volcaniques sauvages du Prêcheur, trouvez l&apos;anse idéale selon la météo, l&apos;affluence et vos envies du moment.
            </p>
          </div>

          {/* Key Metrics & Map CTA */}
          <div className="pt-2 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-t border-white/15">
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">{beachPlaces.length}+</div>
                <div className="text-[11px] sm:text-xs text-white/70">Plages & criques répertoriées</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-amber-300">28°C</div>
                <div className="text-[11px] sm:text-xs text-white/70">Température moyenne de l&apos;eau</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-300">100%</div>
                <div className="text-[11px] sm:text-xs text-white/70">Suivi sargasses en direct</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenMap}
              className="self-start lg:self-auto px-6 py-3.5 rounded-2xl bg-action hover:bg-action-hover text-white text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-soft transition-all cursor-pointer shrink-0"
            >
              <Compass className="w-4 h-4" />
              <span>Voir toutes les plages sur la carte</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE COASTAL REGIONS SELECTOR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-action block">
              Explorer par côte
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-deep">
              Quatre ambiances littorales uniques
            </h2>
          </div>
          {regionFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setRegionFilter('all')}
              className="text-xs font-semibold text-action hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Afficher toute l&apos;île</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coastalRegions.map(reg => {
            const isSelected = regionFilter === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => setRegionFilter(isSelected ? 'all' : reg.id)}
                className={`text-left p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-deep text-white border-deep shadow-card scale-[1.01]'
                    : `bg-gradient-to-br ${reg.accent} bg-white hover:border-action/50 hover:shadow-soft`
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{reg.icon}</span>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-white/90 text-deep border border-lagon-border'
                      }`}
                    >
                      {isSelected ? 'Filtre actif' : 'Filtrer'}
                    </span>
                  </div>
                  <h3 className={`font-semibold text-base ${isSelected ? 'text-white' : 'text-deep'}`}>
                    {reg.title}
                  </h3>
                  <p className={`text-[11px] font-medium ${isSelected ? 'text-amber-300' : 'text-action'}`}>
                    {reg.subtitle}
                  </p>
                </div>
                <p className={`text-xs leading-relaxed ${isSelected ? 'text-white/80' : 'text-ink-muted'}`}>
                  {reg.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SMART SEARCH & FILTER BAR */}
      <div className="bg-white rounded-3xl border border-lagon-border p-6 sm:p-8 shadow-soft space-y-5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher une plage par nom, commune ou ambiance (ex: Salines, Diamant, Tortues, Ombragée)..."
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

          <button
            type="button"
            onClick={() => setOnlyCleanWater(!onlyCleanWater)}
            className={`px-5 py-3 rounded-2xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
              onlyCleanWater
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-soft'
                : 'bg-white text-deep border-lagon-border hover:border-action hover:bg-lagon-bg/50'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${onlyCleanWater ? 'text-white' : 'text-emerald-600'}`} />
            <span>Garanti zéro sargasse</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-lagon-border/60">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: '🏖️ Toutes les plages' },
              { id: 'calm', label: '👶 Eaux calmes & familles' },
              { id: 'sunset', label: '🌅 Couchers de soleil' },
              { id: 'volcanic', label: '🌋 Sable noir volcanique' },
              { id: 'snorkeling', label: '🤿 Fonds marins & tortues' },
              { id: 'secret', label: '💎 Criques secrètes' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setBeachFilter(f.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                  beachFilter === f.id
                    ? 'bg-deep text-white font-semibold shadow-soft'
                    : 'bg-lagon-bg/70 text-ink border border-lagon-border hover:bg-lagon-light/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-ink-muted">
            <span>
              <strong className="text-deep">{filteredBeaches.length}</strong> plage{filteredBeaches.length > 1 ? 's' : ''} affichée{filteredBeaches.length > 1 ? 's' : ''}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-coral font-semibold hover:underline cursor-pointer"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. GRID OF BEACHES */}
      {filteredBeaches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredBeaches.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-lagon-border p-8 space-y-4">
          <p className="text-base text-deep font-semibold">Aucune plage ne correspond à vos filtres actuels</p>
          <p className="text-xs text-ink-muted max-w-md mx-auto">
            Essayez de réinitialiser le filtre de région ou vos mots-clés pour découvrir toutes les anses disponibles.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-2xl bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors cursor-pointer"
          >
            Voir toutes les plages
          </button>
        </div>
      )}

      {/* 5. LOCAL BEACH GUIDE & ETIQUETTE */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-lagon-border space-y-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-action block">
              Carnet pratique
            </span>
            <h3 className="font-semibold text-deep text-xl sm:text-2xl">
              Les secrets des habitués pour une journée plage parfaite
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs text-ink-muted leading-relaxed">
          <div className="p-5 rounded-2xl bg-sand-light/70 border border-sand-border space-y-2">
            <div className="text-xl">🥥</div>
            <strong className="text-deep text-sm block">Douceurs sous les raisiniers</strong>
            <p>
              Goûtez au véritable sorbet coco préparé à la manivelle et aux beignets de bananes vendus l&apos;après-midi aux Salines, à Sainte-Luce et à Grande Anse.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-lagon-bg/70 border border-lagon-border space-y-2">
            <div className="text-xl">🕒</div>
            <strong className="text-deep text-sm block">Le bon créneau horaire</strong>
            <p>
              Le week-end, arrivez avant 9h30 pour vous garer à l&apos;ombre. En fin de journée dès 16h30, la lumière dorée embrase toute la côte Caraïbe.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-coral-soft/50 border border-coral/20 space-y-2">
            <div className="text-xl">🌳</div>
            <strong className="text-deep text-sm block">Attention aux mancenilliers</strong>
            <p>
              Ces arbres côtiers sont signalés par un anneau de peinture rouge sur le tronc : leur sève et leurs petites pommes vertes sont corrosives, surtout sous la pluie.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-lagon-bg/70 border border-lagon-border space-y-2">
            <div className="text-xl">🌊</div>
            <strong className="text-deep text-sm block">Rouleaux du Diamant</strong>
            <p>
              La plage du Diamant est magnifique mais ses courants de fond sont puissants : baignez-vous là où vous avez pied et privilégiez le bodyboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
