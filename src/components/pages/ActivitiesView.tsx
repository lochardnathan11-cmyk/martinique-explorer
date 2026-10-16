'use client';

import React, { useState } from 'react';
import { PlaceItem } from '@/types';
import PlaceCard from '@/components/places/PlaceCard';
import { Compass, Sparkles, Search, Clock, Mountain, Utensils, Anchor, X } from 'lucide-react';

interface ActivitiesViewProps {
  places: PlaceItem[];
  onOpenMap: () => void;
}

export default function ActivitiesView({ places, onOpenMap }: ActivitiesViewProps) {
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const activityPlaces = places.filter(
    p =>
      p.category === 'activity' ||
      p.category === 'restaurant' ||
      p.category === 'bar' ||
      p.category === 'event' ||
      p.category === 'hiking' ||
      p.category === 'viewpoint' ||
      p.category === 'excursion' ||
      p.category === 'accommodation'
  );

  const pillars = [
    {
      id: 'sea',
      icon: '⛵',
      badge: 'Incontournable',
      title: 'Excursions Mer & Fonds Blancs',
      desc: 'Catamaran au François, Baignoire de Joséphine, observation des dauphins au Carbet et kayak transparent.',
      accent: 'from-sky-500/15 to-cyan-500/5 border-sky-200',
    },
    {
      id: 'hike',
      icon: '🌋',
      badge: 'Nature & Volcan',
      title: 'Randonnées & Panoramas',
      desc: 'Ascension de la Montagne Pelée (1 397m), Réserve de la Caravelle, Canal des Esclaves et Trace des Jésuites.',
      accent: 'from-emerald-500/15 to-teal-500/5 border-emerald-200',
    },
    {
      id: 'canyon',
      icon: '🧗',
      badge: 'Sensations',
      title: 'Cascades, Canyoning & Surf',
      desc: 'Rappels sous les cascades tropicales, Gorges de la Falaise, surf à Tartane et plongée bouteille.',
      accent: 'from-amber-500/15 to-orange-500/5 border-amber-200',
    },
    {
      id: 'food',
      icon: '🦞',
      badge: 'Terroir AOC',
      title: 'Tables Créoles & Rhumeries',
      desc: 'Langoustes grillées les pieds dans le sable, distilleries historiques AOC et couchers de soleil animés.',
      accent: 'from-rose-500/15 to-orange-500/5 border-rose-200',
    },
  ];

  const curatedDays = [
    {
      title: 'L’Expédition du Nord Volcanique',
      tag: 'Volcan • Jungle • Histoire',
      steps: [
        { time: '07h00', text: 'Ascension matinale de la Montagne Pelée ou Gorges de la Falaise à Ajoupa-Bouillon.' },
        { time: '12h30', text: 'Déjeuner créole les pieds dans le sable noir au Carbet (Le Petibonum).' },
        { time: '15h30', text: 'Ruines de Saint-Pierre et baignade sauvage à l’Anse Couleuvre.' },
      ],
    },
    {
      title: 'Fonds Blancs & Presqu’île Atlantique',
      tag: 'Lagon • Randonnée • Rhum',
      steps: [
        { time: '08h00', text: 'Boucle du Phare de la Caravelle et traversée de la mangrove à Tartane.' },
        { time: '11h30', text: 'Sortie bateau vers la Baignoire de Joséphine et les îlets du François.' },
        { time: '16h30', text: 'Visite de l’Habitation Clément (jardin de sculptures & chais historiques).' },
      ],
    },
    {
      title: 'Douceur Caraïbe aux Anses-d’Arlet',
      tag: 'Tortues • Kayak • Sunset',
      steps: [
        { time: '08h00', text: 'Nage avec les tortues à Anse Dufour puis exploration en kayak vers les grottes marines.' },
        { time: '12h30', text: 'Accras de morue et poisson grillé face au ponton de Grande Anse (Ti Sable).' },
        { time: '17h30', text: 'Panorama au Mémorial Cap 110 puis coucher de soleil face au Rocher du Diamant.' },
      ],
    },
  ];

  const filtered = activityPlaces.filter(p => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.commune.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (activityFilter === 'all') return true;
    if (activityFilter === 'sea')
      return (
        p.category === 'excursion' ||
        p.subCategory?.toLowerCase().includes('bateau') ||
        p.tags?.some(t => ['Catamaran', 'Bateau', 'Fonds Blancs', 'Kayak', 'Dauphins'].includes(t))
      );
    if (activityFilter === 'hike')
      return (
        p.category === 'hiking' ||
        p.category === 'viewpoint' ||
        p.subCategory?.toLowerCase().includes('randonnée') ||
        p.tags?.includes('Volcan')
      );
    if (activityFilter === 'canyon')
      return (
        p.subCategory?.toLowerCase().includes('canyoning') ||
        p.category === 'activity' ||
        p.tags?.some(t => ['Canyoning', 'Cascade', 'Surf', 'Plongée'].includes(t))
      );
    if (activityFilter === 'food') return p.category === 'restaurant' || p.category === 'bar';
    if (activityFilter === 'stay') return p.category === 'accommodation';
    return true;
  });

  const hasActiveFilters = activityFilter !== 'all' || searchTerm.trim() !== '';

  return (
    <div className="space-y-12 animate-fadeIn text-left">
      {/* 1. IMMERSIVE ADVENTURE & LIFESTYLE HERO */}
      <div className="relative rounded-[32px] overflow-hidden border border-lagon-border shadow-soft bg-deep text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85"
            alt="Randonnée tropicale et reliefs volcaniques en Martinique"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep/90 via-deep/75 to-deep/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-transparent to-deep/20" />
        </div>

        <div className="relative z-10 p-8 sm:p-12 lg:p-14 space-y-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Aventure, Terroir & Douceur de Vivre</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-300/30 text-xs font-medium text-emerald-100">
              <span>🌋 UNESCO : Volcans et Forêts de la Montagne Pelée</span>
            </span>
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-[1.12]">
              Expériences, Randonnées & Tables Créoles.
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl">
              De l&apos;ascension matinale du dôme de la Montagne Pelée aux fonds blancs turquoise du François en catamaran, jusqu&apos;aux langoustes grillées face au coucher du soleil : vivez l&apos;île aux Fleurs dans toute sa richesse.
            </p>
          </div>

          <div className="pt-2 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-t border-white/15">
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">1 397 m</div>
                <div className="text-[11px] sm:text-xs text-white/70">Sommet de la Montagne Pelée</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-amber-300">AOC</div>
                <div className="text-[11px] sm:text-xs text-white/70">Unique Rhum Agricole AOC au monde</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-300">{activityPlaces.length}+</div>
                <div className="text-[11px] sm:text-xs text-white/70">Expériences & adresses testées</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenMap}
              className="self-start lg:self-auto px-6 py-3.5 rounded-2xl bg-action hover:bg-action-hover text-white text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-soft transition-all cursor-pointer shrink-0"
            >
              <Compass className="w-4 h-4" />
              <span>Explorer les activités sur la carte</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 THEMATIC PILLARS SHOWCASE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-action block">
              Choisir une thématique
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-deep">
              Les 4 grands piliers de l&apos;aventure martiniquaise
            </h2>
          </div>
          {activityFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setActivityFilter('all')}
              className="text-xs font-semibold text-action hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Voir toutes les catégories</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map(p => {
            const isSelected = activityFilter === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivityFilter(isSelected ? 'all' : p.id)}
                className={`text-left p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-deep text-white border-deep shadow-card scale-[1.01]'
                    : `bg-gradient-to-br ${p.accent} bg-white hover:border-action/50 hover:shadow-soft`
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{p.icon}</span>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-white/90 text-deep border border-lagon-border'
                      }`}
                    >
                      {p.badge}
                    </span>
                  </div>
                  <h3 className={`font-semibold text-base ${isSelected ? 'text-white' : 'text-deep'}`}>
                    {p.title}
                  </h3>
                </div>
                <p className={`text-xs leading-relaxed ${isSelected ? 'text-white/80' : 'text-ink-muted'}`}>
                  {p.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SEARCH & CATEGORY FILTER CHIPS */}
      <div className="bg-white rounded-3xl border border-lagon-border p-6 sm:p-8 shadow-soft space-y-5">
        <div className="relative">
          <Search className="w-4 h-4 text-ink-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Rechercher une activité, une randonnée, un restaurant ou une commune (ex : Catamaran, Pelée, Caravelle, Petibonum)..."
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

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-lagon-border/60">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: '✨ Tout explorer' },
              { id: 'sea', label: '⛵ Bateau & Excursions' },
              { id: 'hike', label: '🥾 Randos & Panoramas' },
              { id: 'canyon', label: '🧗 Canyoning & Activités' },
              { id: 'food', label: '🍽️ Restos & Bars de plage' },
              { id: 'stay', label: '🏨 Hôtels & Lodges' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActivityFilter(f.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-medium transition-colors cursor-pointer ${
                  activityFilter === f.id
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
              <strong className="text-deep">{filtered.length}</strong> expérience{filtered.length > 1 ? 's' : ''}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setActivityFilter('all');
                  setSearchTerm('');
                }}
                className="text-coral font-semibold hover:underline cursor-pointer"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. GRID OF EXPERIENCES */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filtered.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-lagon-border p-8 space-y-4">
          <p className="text-base text-deep font-semibold">Aucune activité ne correspond à vos critères</p>
          <p className="text-xs text-ink-muted">Modifiez vos mots-clés ou réinitialisez le filtre pour tout afficher.</p>
          <button
            type="button"
            onClick={() => {
              setActivityFilter('all');
              setSearchTerm('');
            }}
            className="px-5 py-2.5 rounded-2xl bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors cursor-pointer"
          >
            Afficher toutes les expériences
          </button>
        </div>
      )}

      {/* 5. CURATED DAY ITINERARIES */}
      <div className="space-y-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-action block">
            Inspiration voyage
          </span>
          <h3 className="text-xl sm:text-2xl font-semibold text-deep">
            3 idées de journées parfaites clés en main
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {curatedDays.map((day, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-lagon-border shadow-soft flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sand-light text-action border border-sand-border">
                    {day.tag}
                  </span>
                  <h4 className="font-semibold text-deep text-base sm:text-lg">{day.title}</h4>
                </div>

                <div className="space-y-3 pt-1">
                  {day.steps.map((s, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-3 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-lagon-bg text-deep font-bold shrink-0 border border-lagon-border">
                        {s.time}
                      </span>
                      <p className="text-ink-muted leading-relaxed">{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. HIKING PREPARATION GUIDE BOX */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-lagon-border shadow-soft space-y-5">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-action block">
            Sécurité & Haute Montagne Tropicale
          </span>
          <h3 className="text-lg sm:text-xl font-semibold text-deep">
            Bien préparer votre ascension de la Montagne Pelée (1 397 m)
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            Classée au Patrimoine Mondial de l&apos;UNESCO, la Pelée possède un microclimat d&apos;altitude exigeant. Voici les 3 règles d&apos;or pour réussir votre randonnée :
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-ink-muted leading-relaxed">
          <div className="p-5 rounded-2xl bg-lagon-bg/70 border border-lagon-border space-y-1.5">
            <strong className="text-deep text-sm block">⏱️ Départ à l&apos;aube (6h00 – 7h00)</strong>
            <p>
              Démarrez depuis le parking de l&apos;Aileron (Morne-Rouge) dès le lever du jour pour profiter d&apos;une vue dégagée à 360° avant l&apos;arrivée des alizés et des nuages.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-sand-light/70 border border-sand-border space-y-1.5">
            <strong className="text-deep text-sm block">🧥 Coupe-vent & 2L d&apos;eau</strong>
            <p>
              Au sommet de la caldeira, la température descend souvent à 14°C avec de fortes rafales humides. Prévoyez un vêtement sec et chaud dans votre sac.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-lagon-bg/70 border border-lagon-border space-y-1.5">
            <strong className="text-deep text-sm block">🥾 Chaussures crantées obligatoires</strong>
            <p>
              Les marches volcaniques et passages rocheux sont raides et glissants. Vérifiez toujours la météo la veille et n&apos;entamez pas la montée par temps d&apos;orage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
