'use client';

import React, { useState } from 'react';
import { PlaceItem } from '@/types';
import PlaceCard from '@/components/places/PlaceCard';
import { Compass, Sparkles, ShieldCheck, Search, Info } from 'lucide-react';

interface SnorkelingViewProps {
  places: PlaceItem[];
  onOpenMap: () => void;
}

export default function SnorkelingView({ places, onOpenMap }: SnorkelingViewProps) {
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFauna, setSelectedFauna] = useState<string | null>(null);

  const snorkelingPlaces = places.filter(
    p => p.category === 'snorkeling' || p.tags?.includes('Snorkeling') || p.tags?.includes('Tortues')
  );

  const marineFauna = [
    { name: 'Tortue Verte', icon: '🐢', desc: 'Broute les herbiers peu profonds à Anse Dufour dès 8h le matin.' },
    { name: 'Raie Pastenague', icon: '🪁', desc: 'Fréquente les fonds sableux calmes d\'Anse Noire et Grande Anse.' },
    { name: 'Poisson Perroquet', icon: '🐠', desc: 'Se nourrit d\'algues sur les coraux aux couleurs multicolores.' },
    { name: 'Chirurgien Bleu', icon: '🐟', desc: 'Évolue en petits bancs vifs autour des rochers côtiers.' },
    { name: 'Gorgones & Coraux', icon: '🪸', desc: 'Formations vivantes fragiles abritant une biodiversité foisonnante.' },
  ];

  const filtered = snorkelingPlaces.filter(p => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match = p.name.toLowerCase().includes(q) || p.commune.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (difficultyFilter === 'all') return true;
    if (difficultyFilter === 'beginner') return p.spotDifficulty === 'Débutant';
    if (difficultyFilter === 'intermediate') return p.spotDifficulty === 'Intermédiaire' || p.spotDifficulty === 'Confirmé';
    return true;
  });

  return (
    <div className="space-y-12 animate-fadeIn text-left">
      {/* Editorial Header */}
      <div className="bg-white rounded-3xl border border-lagon-border p-8 sm:p-12 shadow-soft space-y-8">
        <div className="space-y-3 max-w-3xl">
          <span className="text-xs font-semibold tracking-wider uppercase text-action">
            Sanctuaire marin de Madinina
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold text-deep tracking-tight">
            Spots de Snorkeling & Observation des Tortues
          </h1>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            Plongez avec un simple masque et tuba dans les eaux translucides de la Martinique pour nager aux côtés des tortues vertes, raies et poissons tropicaux dans leur habitat naturel préservé.
          </p>
        </div>

        {/* Essential Rules of Respect Banner */}
        <div className="p-6 rounded-3xl bg-sand-light border border-sand-border space-y-3 text-xs text-ink leading-relaxed">
          <div className="flex items-center gap-2 font-semibold text-deep text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-coral shrink-0" />
            <span>Charte du snorkeling éco-responsable (À lire avant de vous mettre à l&apos;eau)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-ink-muted">
            <div>
              <strong className="text-deep block mb-0.5">1. Garder 5 mètres de distance</strong>
              Ne jamais toucher les tortues ni tenter de les encercler. Laissez-leur toujours un couloir libre vers la surface pour respirer.
            </div>
            <div>
              <strong className="text-deep block mb-0.5">2. Arriver tôt le matin (7h30 - 9h30)</strong>
              La lumière est douce, l&apos;eau est parfaitement calme comme un miroir, et les tortues broutent tranquillement les herbiers.
            </div>
            <div>
              <strong className="text-deep block mb-0.5">3. Protection des coraux</strong>
              Portez un lycra à manches longues pour limiter l&apos;usage de crème solaire, ou utilisez exclusivement une crème minérale éco-certifiée.
            </div>
          </div>
        </div>

        {/* Marine Wildlife Interactive Strip */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-action block">
            Espèces marines observables en Martinique
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {marineFauna.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedFauna(selectedFauna === item.name ? null : item.name)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedFauna === item.name
                    ? 'bg-deep text-white border-deep shadow-soft'
                    : 'bg-lagon-bg/60 hover:bg-lagon-bg border-lagon-border text-ink'
                }`}
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <h4 className={`font-semibold text-xs ${selectedFauna === item.name ? 'text-white' : 'text-deep'}`}>
                  {item.name}
                </h4>
                <p className={`text-[11px] line-clamp-2 mt-0.5 leading-tight ${selectedFauna === item.name ? 'text-white/80' : 'text-ink-muted'}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-lagon-border/70">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher un spot (ex : Dufour, Noire, Salomon)..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Tous les spots' },
              { id: 'beginner', label: 'Débutants & enfants (Herbiers)' },
              { id: 'intermediate', label: 'Tombants coralliens' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setDifficultyFilter(f.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                  difficultyFilter === f.id
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

      {/* Grid of Snorkeling Spots */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filtered.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-lagon-border p-8 space-y-3">
          <p className="text-base text-deep font-semibold">Aucun spot ne correspond à votre recherche</p>
          <p className="text-xs text-ink-muted">Modifiez vos mots-clés ou sélectionnez tous les niveaux.</p>
        </div>
      )}

      {/* Spot Spotlight: Anse Dufour vs Anse Noire */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-lagon-border shadow-soft space-y-6">
        <h3 className="text-xl font-semibold text-deep">
          Le duo mythique : Anse Dufour & Anse Noire
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed">
          Séparées par un simple escalier creusé dans la roche, ces deux anses voisines sont mondialement célèbres pour leur contraste géologique saisissant.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="p-5 rounded-2xl bg-sand-light border border-sand-border space-y-2">
            <h4 className="font-semibold text-deep text-sm">🐢 Anse Dufour — Sable blond & Tortues vertes</h4>
            <p className="text-ink-muted">
              Le sanctuaire numéro un des tortues vertes en Martinique. L&apos;eau peu profonde et les herbiers permettent même aux jeunes enfants avec brassards d&apos;observer les tortues brouter à 10 mètres du bord.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-lagon-bg border border-lagon-border space-y-2">
            <h4 className="font-semibold text-deep text-sm">🌋 Anse Noire — Sable volcanique & Tombants coralliens</h4>
            <p className="text-ink-muted">
              L&apos;unique plage de sable noir du Sud. Son ponton emblématique et ses falaises sous-marines abritent des gorgones, des coraux cerveaux, des murènes et des bancs de poissons tropicaux d&apos;une diversité rare.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
