'use client';

import React, { useState } from 'react';
import { PlaceItem } from '@/types';
import PlaceCard from '@/components/places/PlaceCard';
import {
  Compass,
  Search,
  MapPin,
  Clock,
  Waves,
  X,
  CheckCircle2,
  Info
} from 'lucide-react';

interface SnorkelingViewProps {
  places: PlaceItem[];
  onOpenMap: () => void;
}

interface MarineGuideSpecies {
  id: string;
  group: 'turtles' | 'rays' | 'reef';
  name: string;
  creoleName: string;
  scientificName: string;
  photo: string;
  frequency: string;
  depth: string;
  whereToSpot: string;
  description: string;
  recognitionTip: string;
}

const MARINE_SPECIES_GUIDE: MarineGuideSpecies[] = [
  {
    id: 'tortue-verte',
    group: 'turtles',
    name: 'Tortue verte',
    creoleName: 'Tòti lanmè',
    scientificName: 'Chelonia mydas',
    photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',
    frequency: 'Très fréquente toute l’année',
    depth: '1,5 m à 5 m (herbiers sableux)',
    whereToSpot: 'Anse Dufour, Grande Anse d’Arlet, Anse Noire',
    description:
      'Herbivore paisible, elle passe ses matinées à brouter « l’herbe à tortue » au centre des baies calmes du Sud Caraïbe avant de remonter respirer en surface toutes les 4 à 5 minutes.',
    recognitionTip: 'Museau court et arrondi, écailles lisses qui ne se chevauchent pas.'
  },
  {
    id: 'tortue-imbriquee',
    group: 'turtles',
    name: 'Tortue imbriquée (Caret)',
    creoleName: 'Tòti Karèt',
    scientificName: 'Eretmochelys imbricata',
    photo: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=900&q=80',
    frequency: 'Régulière sur les récifs',
    depth: '2 m à 12 m (parois rocheuses)',
    whereToSpot: 'Anse Noire, Pointe Borgnèse, Sainte-Luce',
    description:
      'Contrairement à la tortue verte qui reste sur le sable, la tortue imbriquée longe les tombants rocheux et les patates de corail où elle se nourrit d’éponges marines.',
    recognitionTip: 'Bec pointu comme celui d’un faucon et bord arrière de la carapace dentelé.'
  },
  {
    id: 'tortue-luth',
    group: 'turtles',
    name: 'Tortue luth',
    creoleName: 'Tòti Batiman',
    scientificName: 'Dermochelys coriacea',
    photo: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80',
    frequency: 'Saisonnière (mars à juillet)',
    depth: 'Pleine eau & plages de ponte la nuit',
    whereToSpot: 'Plages du Nord (Prêcheur, Carbet), Salines, Anse Mitan',
    description:
      'La plus grande tortue marine au monde (jusqu’à 1,80 m). Elle vit au large mais s’approche des côtes martiniquaises au printemps pour la saison de ponte nocturne.',
    recognitionTip: 'Carapace sombre d’aspect cuir parcourue de 7 crêtes longitudinales.'
  },
  {
    id: 'raie-pastenague',
    group: 'rays',
    name: 'Raie pastenague américaine',
    creoleName: 'Rè',
    scientificName: 'Hypanus americanus',
    photo: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=900&q=80',
    frequency: 'Régulière par mer calme',
    depth: '2 m à 8 m (fonds de sable clair)',
    whereToSpot: 'Grande Anse d’Arlet, Anse Mitan, Sainte-Luce',
    description:
      'Souvent posée sur le sable à la lisière des herbiers, elle se confond avec le fond grâce à sa teinte beige doré et plane au ras du sol lorsqu’elle se déplace.',
    recognitionTip: 'Forme en losange couleur sable ; toujours l’observer depuis la surface.'
  },
  {
    id: 'raie-leopard',
    group: 'rays',
    name: 'Raie léopard (Raie aigle)',
    creoleName: 'Rè Léopa',
    scientificName: 'Aetobatus narinari',
    photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    frequency: 'Plus rare, en eau libre',
    depth: '3 m à 15 m (caps rocheux & passes)',
    whereToSpot: 'Cap Salomon, Anse Noire, Le Diamant',
    description:
      'Très reconnaissable à son vol lent et ample en pleine eau le long des tombants rocheux, où elle cherche des coquillages sur les zones sableuses profondes.',
    recognitionTip: 'Grandes ailes pointues bleu sombre ponctuées d’anneaux blancs.'
  },
  {
    id: 'poisson-perroquet',
    group: 'reef',
    name: 'Poisson-perroquet & faune de récif',
    creoleName: 'Péwoké / Chatouyè',
    scientificName: 'Sparisoma viride',
    photo: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=900&q=80',
    frequency: 'Omniprésent sur les rochers',
    depth: '1 m à 8 m',
    whereToSpot: 'Pointe Borgnèse, Anse Figuier, Anses-d’Arlet',
    description:
      'En longeant les rochers, on entend souvent le bruit sec de son bec qui racle les algues sur le calcaire corallien, contribuant naturellement à la formation du sable blanc.',
    recognitionTip: 'Écailles turquoise, vert émeraude et touches orangées près des ouïes.'
  },
  {
    id: 'poisson-lion',
    group: 'reef',
    name: 'Rascasse volante (Poisson-lion)',
    creoleName: 'Pwason Lyon',
    scientificName: 'Pterois volitans',
    photo: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=900&q=80',
    frequency: 'Fréquent sous les surplombs',
    depth: '3 m à 20 m (ombres rocheuses)',
    whereToSpot: 'Anse Noire, Le Carbet, Saint-Pierre',
    description:
      'Espèce invasive dans les Antilles, elle reste souvent immobile à l’ombre des cavités rocheuses. Ses rayons dorsaux sont venimeux : il suffit de garder ses distances.',
    recognitionTip: 'Corps zébré de brun-rouge et de blanc avec de longues nageoires en éventail.'
  },
  {
    id: 'gorgones-eponges',
    group: 'reef',
    name: 'Gorgones, éponges & poissons-coffres',
    creoleName: 'Koway & Kòf',
    scientificName: 'Gorgonia & Xestospongia',
    photo: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80',
    frequency: 'Sur toutes les pointes rocheuses',
    depth: '1 m à 10 m',
    whereToSpot: 'Cap Salomon, Anse Noire, Anse Couleuvre',
    description:
      'Les falaises volcaniques immergées de la côte Caraïbe sont tapissées d’éponges barriques orangées et d’éventails de mer violets où s’abritent sergents-majors, poissons-trompettes et poissons-coffres.',
    recognitionTip: 'Toujours nager le long des parois rocheuses de gauche ou de droite des anses.'
  }
];

export default function SnorkelingView({ places, onOpenMap }: SnorkelingViewProps) {
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesGroup, setSpeciesGroup] = useState<'all' | 'turtles' | 'rays' | 'reef'>('all');

  const snorkelingPlaces = places.filter(
    p =>
      p.category === 'snorkeling' ||
      p.tags?.includes('Snorkeling') ||
      p.tags?.includes('Tortues') ||
      p.tags?.includes('Tortues marines') ||
      p.tags?.includes('Fonds marins')
  );

  const filteredPlaces = snorkelingPlaces.filter(p => {
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
    if (difficultyFilter === 'herbiers') {
      return (
        p.spotDifficulty === 'Débutant' ||
        p.tags?.includes('Famille') ||
        p.tags?.includes('Tortues') ||
        p.tags?.includes('Tortues marines')
      );
    }
    if (difficultyFilter === 'recifs') {
      return (
        p.spotDifficulty === 'Intermédiaire' ||
        p.spotDifficulty === 'Confirmé' ||
        p.tags?.includes('Fonds marins') ||
        p.tags?.includes('Spot Secret')
      );
    }
    return true;
  });

  const visibleSpecies =
    speciesGroup === 'all'
      ? MARINE_SPECIES_GUIDE
      : MARINE_SPECIES_GUIDE.filter(s => s.group === speciesGroup);

  return (
    <div className="space-y-12 text-left">
      {/* 1. EN-TÊTE ÉDITORIAL SOBRE & REPÈRES CONCRETS */}
      <header className="border-b border-slate-200/90 pb-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
              Masque & Tuba depuis le bord
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Snorkeling & observation des tortues
            </h1>
            <p className="text-slate-600 text-base leading-relaxed">
              En Martinique, les plus beaux fonds marins s&apos;explorent directement à la nage depuis la plage. Herbiers à tortues au centre des anses et tombants rocheux le long des falaises offrent deux paysages complémentaires.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenMap}
            className="self-start lg:self-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <Compass className="w-4 h-4" />
            <span>Voir les spots sur la carte</span>
          </button>
        </div>

        {/* 3 repères pratiques simples et humains */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 flex items-start gap-3.5">
            <Clock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h2 className="text-xs font-bold text-slate-900">
                Privilégier le créneau 7h30 – 9h30
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Le matin tôt, la mer est lisse, le soleil éclaire les fonds et les tortues broutent au calme avant l&apos;affluence.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 flex items-start gap-3.5">
            <Waves className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h2 className="text-xs font-bold text-slate-900">
                Centre de l&apos;anse vs pointes rocheuses
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cherchez les tortues vertes sur l&apos;herbier au milieu de la baie, et les coraux et poissons tropicaux le long des falaises.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 flex items-start gap-3.5">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h2 className="text-xs font-bold text-slate-900">
                3 à 5 mètres de distance
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Flottez calmement sur le côté sans jamais toucher ni surplomber une tortue lorsqu&apos;elle remonte respirer.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. LES SPOTS DE SNORKELING (Accès direct dès le haut de page) */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Les meilleurs spots accessibles du rivage
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {filteredPlaces.length} sites sélectionnés pour la clarté de l&apos;eau et la richesse de la faune
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Filtrer un spot ou une commune..."
                className="w-full text-xs pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-800 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/70 self-start">
              {[
                { id: 'all', label: 'Tous les spots' },
                { id: 'herbiers', label: 'Herbiers & Tortues' },
                { id: 'recifs', label: 'Tombants & Coraux' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setDifficultyFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    difficultyFilter === f.id
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredPlaces.map(place => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="py-14 text-center bg-white rounded-2xl border border-slate-200/80 p-8 space-y-3">
            <p className="text-sm text-slate-700 font-medium">
              Aucun spot ne correspond à votre recherche.
            </p>
            <button
              type="button"
              onClick={() => {
                setDifficultyFilter('all');
                setSearchTerm('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
            >
              Afficher tous les spots
            </button>
          </div>
        )}
      </section>

      {/* 3. REPÈRE TERRAIN : COMPRENDRE LA DIFFÉRENCE ANSE DUFOUR / ANSE NOIRE */}
      <section className="bg-[#FAF8F5] rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-5">
        <div className="max-w-2xl space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            Repère pratique aux Anses-d&apos;Arlet
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Anse Dufour et Anse Noire : deux criques voisines, deux ambiances sous l&apos;eau
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Séparées par un simple cap rocheux de 150 mètres, ces deux anses se visitent facilement au cours de la même matinée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs leading-relaxed">
          <div className="p-5 rounded-xl bg-white border border-stone-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Anse Dufour</span>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60 text-[11px] font-medium">
                Sable blond · 1 m à 4 m
              </span>
            </div>
            <p className="text-slate-600">
              Son fond de sable clair offre une luminosité idéale pour débuter. Le grand herbier situé au centre de la crique est le lieu privilégié où les tortues vertes viennent se nourrir.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-stone-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Anse Noire</span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-medium">
                Sable volcanique · 2 m à 12 m
              </span>
            </div>
            <p className="text-slate-600">
              Accessible par un escalier de 130 marches, c&apos;est la seule plage de sable noir du Sud. En longeant la falaise de gauche depuis le ponton en bois, le tombant rocheux dévoile gorgones, éponges, bancs de poissons et tortues imbriquées.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CARNET D'IDENTIFICATION DE LA FAUNE SOUS-MARINE (Simple, photographique, sans fausse 3D) */}
      <section className="space-y-6 pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="space-y-1 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
              Guide d&apos;identification
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Quelles espèces croise-t-on avec un masque et un tuba ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Les espèces les plus souvent observées près du bord, leurs habitudes et les plages où les chercher.
            </p>
          </div>

          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/70 self-start">
            {[
              { id: 'all', label: 'Toutes (8)' },
              { id: 'turtles', label: 'Tortues (3)' },
              { id: 'rays', label: 'Raies (2)' },
              { id: 'reef', label: 'Poissons & Coraux (3)' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSpeciesGroup(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  speciesGroup === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleSpecies.map(sp => (
            <article
              key={sp.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col sm:flex-row transition-shadow hover:shadow-xs"
            >
              <div className="sm:w-44 md:w-48 shrink-0 bg-slate-100 relative aspect-[16/10] sm:aspect-auto">
                <img
                  src={sp.photo}
                  alt={sp.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      {sp.frequency}
                    </span>
                    <span className="text-[11px] text-slate-400 italic">
                      {sp.scientificName}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 flex-wrap pt-0.5">
                    <h3 className="text-base font-bold text-slate-900">{sp.name}</h3>
                    <span className="text-xs text-slate-500">
                      ({sp.creoleName})
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sp.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                  <div className="flex items-start gap-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold">Où la voir :</strong> {sp.whereToSpot} ({sp.depth})
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-600">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold text-slate-700">À reconnaître :</strong> {sp.recognitionTip}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
