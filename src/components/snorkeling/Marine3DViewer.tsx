'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  RotateCw,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Ruler,
  Waves,
} from 'lucide-react';

export interface MarineSpecies3D {
  id: string;
  category: 'turtles' | 'rays' | 'fish';
  name: string;
  shortName: string;
  scientificName: string;
  creoleName: string;
  icon: string;
  image3d: string;
  size: string;
  depth: string;
  spots: string;
  bestTime: string;
  diet: string;
  status: string;
  desc: string;
  hotspots: { label: string; detail: string; x: number; y: number }[];
}

export const MARINE_SPECIES_3D: MarineSpecies3D[] = [
  {
    id: 'green_turtle',
    category: 'turtles',
    name: 'Tortue Verte',
    shortName: 'Tortue Verte',
    scientificName: 'Chelonia mydas',
    creoleName: 'Tòti lanmè',
    icon: '🐢',
    image3d: '/images/turtle-3d.png',
    size: '80 à 120 cm • Jusqu’à 150 kg',
    depth: '1,5m à 5m (Herbiers côtiers)',
    spots: 'Anse Dufour, Grande Anse d’Arlet',
    bestTime: '7h30 – 9h30 & 16h30',
    diet: 'Herbivore (Herbes à tortues Thalassia)',
    status: 'Espèce protégée',
    desc: 'La plus fréquente dans les anses calmes du Sud : reconnaissable à sa carapace ovale brun-ambré rayonnante, ses 4 plaques latérales et ses longues nageoires sombres bordées de jaune crème.',
    hotspots: [
      {
        label: 'Tête & Écailles frontales',
        detail: 'Une seule paire d’écailles préfrontales entre les yeux et un museau court et arrondi caractéristique.',
        x: 82,
        y: 28,
      },
      {
        label: 'Carapace (Dossière)',
        detail: '4 grandes écailles costales de chaque côté, sans chevauchement, aux teintes brunes et dorées rayonnantes.',
        x: 42,
        y: 32,
      },
      {
        label: 'Nageoires antérieures',
        detail: 'Puissantes palettes natatoires aux écailles noires serties d’un liseré clair permettant de voler sous l’eau.',
        x: 56,
        y: 58,
      },
    ],
  },
  {
    id: 'leatherback_turtle',
    category: 'turtles',
    name: 'Tortue Luth Géante',
    shortName: 'Tortue Luth',
    scientificName: 'Dermochelys coriacea',
    creoleName: 'Tòti Batiman',
    icon: '🌌',
    image3d: '/images/leatherback-3d.png',
    size: '1,60 à 2,20 m • 300 à 600 kg',
    depth: 'Pleine eau & plages de ponte',
    spots: 'Anse Mitan, Les Salines, Diamant, Le Prêcheur',
    bestTime: 'Mars à Juillet (Saison de ponte & baie)',
    diet: 'Méduses & organismes gélatineux',
    status: 'Géante des océans (Vulnérable)',
    desc: 'La plus grande tortue marine du monde ! Dépourvue d’écailles dures, sa carapace souple comme du cuir bleu-nuit est parcourue de 7 crêtes longitudinales et constellée de taches blanches et rosées.',
    hotspots: [
      {
        label: 'Carapace cuirassée à 7 carènes',
        detail: 'Unique chez les tortues : pas d’écailles de kératine mais une peau épaisse hydrodynamique à 7 crêtes.',
        x: 52,
        y: 26,
      },
      {
        label: 'Tête étoilée & bec en W',
        detail: 'Mâchoire supérieure munie de deux pointes permettant de saisir les méduses glissantes.',
        x: 24,
        y: 46,
      },
      {
        label: 'Immenses nageoires sans griffes',
        detail: 'Leur envergure peut dépasser 2,50 mètres pour traverser l’Atlantique jusqu’aux plages de Martinique.',
        x: 70,
        y: 54,
      },
    ],
  },
  {
    id: 'hawksbill_turtle',
    category: 'turtles',
    name: 'Tortue Imbriquée (Caret)',
    shortName: 'Tortue Imbriquée',
    scientificName: 'Eretmochelys imbricata',
    creoleName: 'Tòti Karèt',
    icon: '🐚',
    image3d: '/images/hawksbill-3d.png',
    size: '60 à 90 cm • 45 à 75 kg',
    depth: '2m à 15m (Tombants coralliens)',
    spots: 'Anse Noire, Rocher du Diamant, Sainte-Luce',
    bestTime: 'Toute la matinée',
    diet: 'Spongivore (Éponges marines & coraux mous)',
    status: 'En danger critique',
    desc: 'Ses écailles jaspées se chevauchent comme les tuiles d’un toit, l’arrière de sa carapace est dentelé et son bec crochu rappelle celui d’un faucon.',
    hotspots: [
      {
        label: 'Bec de faucon',
        detail: 'Bec étroit et pointu permettant d’extraire les éponges dans les crevasses du récif corallien.',
        x: 18,
        y: 35,
      },
      {
        label: 'Écailles imbriquées',
        detail: 'Magnifiques motifs ambrés flammés qui se superposent vers l’arrière comme des tuiles.',
        x: 50,
        y: 31,
      },
      {
        label: 'Bordure dentelée',
        detail: 'La marge arrière de la carapace forme des dents bien marquées qui la distinguent de la tortue verte.',
        x: 76,
        y: 40,
      },
    ],
  },
  {
    id: 'southern_stingray',
    category: 'rays',
    name: 'Raie Pastenague Américaine',
    shortName: 'Raie Pastenague',
    scientificName: 'Hypanus americanus',
    creoleName: 'Rè',
    icon: '🏖️',
    image3d: '/images/southern-stingray-3d.png',
    size: '80 à 150 cm d’envergure',
    depth: '1,5m à 8m (Fonds de sable blanc)',
    spots: 'Anse Noire, Grande Anse, Anse Mitan, Sainte-Luce',
    bestTime: 'Matin calme (8h00 – 11h00)',
    diet: 'Mollusques, lambis juvéniles & petits crabes',
    status: 'Emblème des fonds sableux',
    desc: 'De couleur brun-sable doré, elle se confond avec le fond sableux où elle chasse les coquillages. En nageant doucement en surface, vous la verrez onduler gracieusement au ras du sable.',
    hotspots: [
      {
        label: 'Yeux périscopiques & Spiracles',
        detail: 'Placés sur le dessus du crâne pour surveiller les alentours et respirer tout en restant enfouie dans le sable.',
        x: 38,
        y: 44,
      },
      {
        label: 'Disque losangique couleur sable',
        detail: 'Ses ailes pectorales soulèvent délicatement le sable pour débusquer les petits crustacés.',
        x: 52,
        y: 34,
      },
      {
        label: 'Queue fine à aiguillon défensif',
        detail: 'Situé sur la queue uniquement pour se défendre : ne marchez jamais brusquement sur les zones sableuses.',
        x: 78,
        y: 24,
      },
    ],
  },
  {
    id: 'eagle_ray',
    category: 'rays',
    name: 'Raie Léopard (Raie Aigle)',
    shortName: 'Raie Léopard',
    scientificName: 'Aetobatus narinari',
    creoleName: 'Rè Léopa',
    icon: '🪁',
    image3d: '/images/stingray-3d.png',
    size: '1,20 à 2,30 m d’envergure',
    depth: '3m à 18m (Tombants & passes)',
    spots: 'Cap Salomon, Anse Noire, Diamant, Sainte-Anne',
    bestTime: 'Matinée & fin d’après-midi',
    diet: 'Bivalves, strombes & crustacés',
    status: 'Rencontre majestueuse',
    desc: 'Plus rare et spectaculaire que la pastenague, la raie léopard vole littéralement en pleine eau avec ses longues ailes pointues bleu-nuit entièrement parsemées d’anneaux et de points blancs.',
    hotspots: [
      {
        label: 'Robe étoilée d’ocelles blancs',
        detail: 'Son motif tacheté unique sert de camouflage sous les reflets du soleil à travers les vagues.',
        x: 42,
        y: 26,
      },
      {
        label: 'Museau profilé',
        detail: 'Museau plat évoquant le bec d’un oiseau, conçu pour fouiller le sable corallien.',
        x: 61,
        y: 25,
      },
      {
        label: 'Longue queue en ruban',
        detail: 'Peut mesurer deux à trois fois la longueur de son corps lorsqu’elle plane au-dessus du tombant.',
        x: 35,
        y: 52,
      },
    ],
  },
  {
    id: 'queen_angelfish',
    category: 'fish',
    name: 'Poisson-Ange Royal',
    shortName: 'Poisson-Ange',
    scientificName: 'Holacanthus ciliaris',
    creoleName: 'Demwazèl Woyal',
    icon: '👑',
    image3d: '/images/angelfish-3d.png',
    size: '30 à 45 cm',
    depth: '2m à 15m (Jardins coralliens)',
    spots: 'Pointe Borgnèse, Cap Salomon, Sainte-Luce',
    bestTime: '10h00 – 15h00',
    diet: 'Éponges vives & tuniciers',
    status: 'Joyau rare du récif',
    desc: 'Considéré comme le plus beau poisson des Caraïbes : sa robe jaune d’or et bleu électrique est surmontée d’une véritable couronne bleu saphir sur le front.',
    hotspots: [
      {
        label: 'Couronne royale frontale',
        detail: 'Tache noire cerclée de bleu cobalt brillant sur le front qui lui vaut son nom de « Queen Angelfish ».',
        x: 32,
        y: 31,
      },
      {
        label: 'Nageoires effilées bleu électrique',
        detail: 'Ses nageoires dorsale et anale se prolongent en longs filaments jaunes et bleus.',
        x: 63,
        y: 22,
      },
      {
        label: 'Queue jaune soleil',
        detail: 'Contrairement aux autres poissons-anges, sa nageoire caudale est entièrement jaune vif.',
        x: 72,
        y: 36,
      },
    ],
  },
  {
    id: 'lionfish',
    category: 'fish',
    name: 'Poisson-Lion (Rascasse Volante)',
    shortName: 'Poisson-Lion',
    scientificName: 'Pterois volitans',
    creoleName: 'Pwason Lyon',
    icon: '🦁',
    image3d: '/images/lionfish-3d.png',
    size: '25 à 40 cm',
    depth: '3m à 25m (Surplombs rocheux & épaves)',
    spots: 'Le Carbet, Saint-Pierre, Anse Noire, Rocher du Diamant',
    bestTime: 'Toute la journée (Zones ombragées)',
    diet: 'Carnivore (Petits poissons de récif)',
    status: 'Épines venimeuses • Ne pas toucher',
    desc: 'Flottant immobile sous les surplombs volcaniques, il déploie ses grandes nageoires pectorales en éventail zébrées de bordeaux et d’ivoire. Admirez-le uniquement des yeux !',
    hotspots: [
      {
        label: 'Rayons dorsaux venimeux',
        detail: 'Ses 13 longues épines dorsales sont défensives : gardez toujours vos distances en l’observant.',
        x: 50,
        y: 18,
      },
      {
        label: 'Nageoires pectorales en éventail',
        detail: 'Immenses voiles striées qu’il ouvre pour rabattre ses proies contre la paroi rocheuse.',
        x: 72,
        y: 38,
      },
      {
        label: 'Tentacules supra-oculaires',
        detail: 'Petits plumets au-dessus des yeux imitant des algues pour un camouflage parfait.',
        x: 38,
        y: 35,
      },
    ],
  },
  {
    id: 'parrotfish',
    category: 'fish',
    name: 'Poisson-Perroquet Royal',
    shortName: 'Poisson-Perroquet',
    scientificName: 'Sparisoma viride',
    creoleName: 'Chatouyè / Péwoké',
    icon: '🐠',
    image3d: '/images/parrotfish-3d.png',
    size: '30 à 55 cm',
    depth: '1m à 12m (Récifs rocheux)',
    spots: 'Pointe Borgnèse, Anse Figuier, Anses-d’Arlet',
    bestTime: '10h00 – 15h00 (Plein soleil)',
    diet: 'Algues calcaires sur les rochers',
    status: 'Architecte du sable blanc',
    desc: 'Paré d’écailles vert émeraude, turquoise et corail, il broute la roche corallienne avec son bec puissant et produit à lui seul des centaines de kilos de sable blanc par an.',
    hotspots: [
      {
        label: 'Bec de perroquet',
        detail: 'Dents soudées en bec robuste capable de racler les algues directement sur le calcaire.',
        x: 24,
        y: 43,
      },
      {
        label: 'Livrée émeraude',
        detail: 'Grandes écailles turquoise et roses qui brillent sous les rayons du soleil zénithal.',
        x: 52,
        y: 36,
      },
      {
        label: 'Nageoire caudale en croissant',
        detail: 'Puissante queue échancrée permettant des accélérations rapides autour du récif.',
        x: 79,
        y: 38,
      },
    ],
  },
  {
    id: 'reef',
    category: 'fish',
    name: 'Gorgones & Éponges Barriques',
    shortName: 'Coraux & Éponges',
    scientificName: 'Xestospongia & Gorgonia',
    creoleName: 'Koway',
    icon: '🪸',
    image3d: '/images/reef-3d.png',
    size: 'Jusqu’à 1,80m de haut',
    depth: '2m à 15m (Parois volcaniques)',
    spots: 'Anse Noire, Crique Cachée, Le Prêcheur',
    bestTime: 'Mer calme et ensoleillée',
    diet: 'Filtreurs de plancton',
    status: 'Écosystème fragile',
    desc: 'Véritables forêts sous-marines : les éventails violets des gorgones ondulent avec la houle tandis que les éponges barriques abritent chirurgiens bleus et étoiles de mer.',
    hotspots: [
      {
        label: 'Éponge barrique géante',
        detail: 'Surnommée le séquoia du récif, elle peut vivre plus de 100 ans et filtre l’eau en continu.',
        x: 50,
        y: 28,
      },
      {
        label: 'Gorgone éventail violette',
        detail: 'Colonie souple orientée perpendiculairement au courant pour capter le plancton.',
        x: 78,
        y: 36,
      },
      {
        label: 'Chirurgien Bleu & Étoile coussin',
        detail: 'Habitants emblématiques des tombants rocheux et herbiers de Martinique.',
        x: 34,
        y: 48,
      },
    ],
  },
];

interface Marine3DViewerProps {
  selectedSpeciesId: string;
  onSelectSpecies: (id: string) => void;
}

export default function Marine3DViewer({ selectedSpeciesId, onSelectSpecies }: Marine3DViewerProps) {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'turtles' | 'rays' | 'fish'>('all');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<number>(0);

  // Interactive 3D Tilt & Rotation State
  const [dioramaRot, setDioramaRot] = useState({ rotX: 3, rotY: -10, scale: 1 });
  const isDraggingDioramaRef = useRef(false);
  const lastDioramaPosRef = useRef({ x: 0, y: 0 });

  const visibleSpecies =
    categoryFilter === 'all'
      ? MARINE_SPECIES_3D
      : MARINE_SPECIES_3D.filter(s => s.category === categoryFilter);

  const currentSpecies =
    MARINE_SPECIES_3D.find(s => s.id === selectedSpeciesId) || visibleSpecies[0] || MARINE_SPECIES_3D[0];

  const handleResetCamera = () => {
    setDioramaRot({ rotX: 3, rotY: 0, scale: 1 });
  };

  const handlePrevNext = (dir: -1 | 1) => {
    const idx = visibleSpecies.findIndex(s => s.id === currentSpecies.id);
    const nextIdx = (idx + dir + visibleSpecies.length) % visibleSpecies.length;
    onSelectSpecies(visibleSpecies[nextIdx].id);
  };

  useEffect(() => {
    setActiveHotspot(0);
  }, [selectedSpeciesId]);

  // Smooth continuous 3D oscillation when autoRotate is on
  useEffect(() => {
    if (!autoRotate) return;
    let rafId: number;
    const start = performance.now();
    const tick = (now: number) => {
      if (!isDraggingDioramaRef.current) {
        const t = (now - start) / 1000;
        setDioramaRot(prev => ({
          ...prev,
          rotY: Math.sin(t * 0.85) * 18,
          rotX: 3 + Math.cos(t * 0.65) * 6,
        }));
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [autoRotate]);

  const handleDioramaPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingDioramaRef.current = true;
    lastDioramaPosRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleDioramaPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingDioramaRef.current) return;
    const dx = e.clientX - lastDioramaPosRef.current.x;
    const dy = e.clientY - lastDioramaPosRef.current.y;
    lastDioramaPosRef.current = { x: e.clientX, y: e.clientY };
    setDioramaRot(prev => ({
      ...prev,
      rotY: Math.max(-38, Math.min(38, prev.rotY + dx * 0.35)),
      rotX: Math.max(-22, Math.min(24, prev.rotX - dy * 0.25)),
    }));
  };

  const handleDioramaPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingDioramaRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="bg-white rounded-[32px] border border-lagon-border shadow-soft overflow-hidden">
      {/* 1. COMPACT, SYMMETRICAL HEADER & 9-SPECIES GALLERY BAR */}
      <div className="p-6 sm:p-8 border-b border-lagon-border bg-gradient-to-b from-lagon-bg/40 to-white space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-action">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Observatoire Sous-Marin 3D Interactif</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-deep">
              Tortues, Raies & Poissons Rares de Martinique en 3D
            </h2>
          </div>

          {/* Family Filter Pills */}
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-2xl bg-lagon-bg border border-lagon-border self-start">
            {[
              { id: 'all', label: 'Toutes (9)' },
              { id: 'turtles', label: '🐢 Tortues (3)' },
              { id: 'rays', label: '🪁 Raies (2)' },
              { id: 'fish', label: '🐠 Poissons & Coraux (4)' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  const cat = tab.id as 'all' | 'turtles' | 'rays' | 'fish';
                  setCategoryFilter(cat);
                  const firstInCat =
                    cat === 'all'
                      ? MARINE_SPECIES_3D[0]
                      : MARINE_SPECIES_3D.find(s => s.category === cat);
                  if (firstInCat) onSelectSpecies(firstInCat.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  categoryFilter === tab.id
                    ? 'bg-deep text-white shadow-2xs'
                    : 'text-ink-muted hover:text-deep'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Perfectly Balanced Species Selector Strip (All 9 fit in a single row on desktop!) */}
        <div
          className={`grid gap-2.5 ${
            categoryFilter === 'all'
              ? 'grid-cols-3 sm:grid-cols-5 lg:grid-cols-9'
              : 'grid-cols-2 sm:grid-cols-4'
          }`}
        >
          {visibleSpecies.map(sp => {
            const isSelected = sp.id === currentSpecies.id;
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => onSelectSpecies(sp.id)}
                className={`group p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'bg-deep text-white border-deep shadow-soft scale-[1.02]'
                    : 'bg-white hover:bg-lagon-bg/60 border-lagon-border text-deep hover:border-action/40'
                }`}
              >
                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-[#042430] shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                    isSelected ? 'ring-2 ring-sky-300' : 'border border-lagon-border/60'
                  }`}
                >
                  <img
                    src={sp.image3d}
                    alt={sp.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 w-full space-y-0.5">
                  <div
                    className={`text-[11px] font-semibold leading-tight line-clamp-1 ${
                      isSelected ? 'text-white' : 'text-deep'
                    }`}
                  >
                    {sp.shortName}
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      isSelected ? 'text-sky-200' : 'text-ink-muted'
                    }`}
                  >
                    {sp.spots.split(',')[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN SPLIT VIEW: SEAMLESS 3D STAGE (LEFT) + STRUCTURED FIELD GUIDE (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* LEFT: SEAMLESS 3D INTERACTIVE VIEWPORT */}
        <div
          className="lg:col-span-7 relative min-h-[420px] sm:min-h-[490px] flex items-center justify-center overflow-hidden select-none"
          style={{
            background: 'radial-gradient(circle at 50% 45%, #073B4C 0%, #042430 65%, #02161E 100%)',
          }}
        >
          <div
            onPointerDown={handleDioramaPointerDown}
            onPointerMove={handleDioramaPointerMove}
            onPointerUp={handleDioramaPointerUp}
            style={{ perspective: '1200px' }}
            className="relative w-full h-full min-h-[420px] sm:min-h-[490px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none px-8 py-14"
          >
            {/* Left / Right Navigation Arrows */}
            <button
              type="button"
              onPointerDown={e => e.stopPropagation()}
              onClick={() => handlePrevNext(-1)}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Espèce précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onPointerDown={e => e.stopPropagation()}
              onClick={() => handlePrevNext(1)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Espèce suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* 3D Rotatable Container with Seamless Radial Vignette Mask (NO visible square border!) */}
            <div
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${dioramaRot.rotX}deg) rotateY(${dioramaRot.rotY}deg) scale(${dioramaRot.scale})`,
                transition: isDraggingDioramaRef.current ? 'none' : 'transform 0.12s ease-out',
              }}
              className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-square flex items-center justify-center"
            >
              {/* High-Definition 3D Diorama with Soft Radial Edge Feathering */}
              <img
                src={currentSpecies.image3d}
                alt={currentSpecies.name}
                draggable={false}
                style={{
                  transform: 'translateZ(25px)',
                  WebkitMaskImage:
                    'radial-gradient(circle at 50% 50%, black 56%, rgba(0,0,0,0.85) 68%, transparent 82%)',
                  maskImage:
                    'radial-gradient(circle at 50% 50%, black 56%, rgba(0,0,0,0.85) 68%, transparent 82%)',
                }}
                className="w-full h-full object-contain pointer-events-none select-none"
              />

              {/* Sleek, Non-Intrusive 3D Anatomical Hotspots */}
              {currentSpecies.hotspots.map((h, idx) => {
                const isActive = activeHotspot === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onPointerDown={e => e.stopPropagation()}
                    onClick={() => setActiveHotspot(idx)}
                    style={{
                      left: `${h.x}%`,
                      top: `${h.y}%`,
                      transform: 'translate(-50%, -50%) translateZ(65px)',
                    }}
                    className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-sky-400 text-deep ring-2 ring-white shadow-[0_0_16px_rgba(56,189,248,0.95)] scale-115'
                        : 'bg-deep/85 text-white border border-sky-300/70 hover:bg-sky-400 hover:text-deep'
                    }`}
                    title={h.label}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Top Floating Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-medium flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 text-sky-300 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Glissez pour tourner en 3D</span>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-300/30 text-emerald-200 text-[11px] font-semibold">
                {currentSpecies.status}
              </span>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onPointerDown={e => e.stopPropagation()}
                  onClick={() => setAutoRotate(!autoRotate)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {autoRotate ? <Pause className="w-3.5 h-3.5 text-sky-300" /> : <Play className="w-3.5 h-3.5 text-sky-300" />}
                  <span>{autoRotate ? 'Pause' : 'Rotation auto'}</span>
                </button>
                <button
                  type="button"
                  onPointerDown={e => e.stopPropagation()}
                  onClick={handleResetCamera}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Recentrer</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onPointerDown={e => e.stopPropagation()}
                  onClick={() =>
                    setDioramaRot(prev => ({ ...prev, scale: Math.min(1.25, prev.scale + 0.1) }))
                  }
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-sm font-bold cursor-pointer"
                  title="Zoom +"
                >
                  +
                </button>
                <button
                  type="button"
                  onPointerDown={e => e.stopPropagation()}
                  onClick={() =>
                    setDioramaRot(prev => ({ ...prev, scale: Math.max(0.85, prev.scale - 0.1) }))
                  }
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-sm font-bold cursor-pointer"
                  title="Zoom -"
                >
                  −
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: SPECIES FICHE & ANATOMICAL HOTSPOTS */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6 bg-white border-t lg:border-t-0 lg:border-l border-lagon-border">
          <div className="space-y-5">
            {/* Species Title & Scientific Badge */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-lagon-bg text-action border border-lagon-border">
                  {currentSpecies.scientificName}
                </span>
                <span className="text-[11px] font-medium text-ink-muted">
                  Créole : <strong className="text-deep">{currentSpecies.creoleName}</strong>
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-semibold text-deep flex items-center gap-2.5 pt-1">
                <span>{currentSpecies.icon}</span>
                <span>{currentSpecies.name}</span>
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {currentSpecies.desc}
            </p>

            {/* Key Specs Grid with Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-lagon-bg/50 border border-lagon-border space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  <Ruler className="w-3.5 h-3.5 text-action" />
                  <span>Taille & Envergure</span>
                </div>
                <div className="font-semibold text-deep">{currentSpecies.size}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-lagon-bg/50 border border-lagon-border space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  <Waves className="w-3.5 h-3.5 text-action" />
                  <span>Profondeur</span>
                </div>
                <div className="font-semibold text-deep">{currentSpecies.depth}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sand-light/70 border border-sand-border space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  <MapPin className="w-3.5 h-3.5 text-action" />
                  <span>Où l&apos;observer ?</span>
                </div>
                <div className="font-semibold text-deep">{currentSpecies.spots}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sand-light/70 border border-sand-border space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  <Clock className="w-3.5 h-3.5 text-action" />
                  <span>Meilleur créneau</span>
                </div>
                <div className="font-semibold text-action">{currentSpecies.bestTime}</div>
              </div>
            </div>

            {/* Interactive Anatomical Points */}
            <div className="space-y-3 pt-2 border-t border-lagon-border/70">
              <span className="text-[11px] font-bold uppercase tracking-wider text-deep block">
                Zoom anatomique sur le modèle 3D :
              </span>

              <div className="grid grid-cols-1 gap-2">
                {currentSpecies.hotspots.map((h, idx) => {
                  const isActive = activeHotspot === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveHotspot(idx);
                        const targetRotY = (50 - h.x) * 0.4;
                        const targetRotX = (h.y - 40) * 0.3;
                        setDioramaRot({ rotX: targetRotX, rotY: targetRotY, scale: 1.06 });
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isActive
                          ? 'bg-lagon-bg border-action shadow-2xs'
                          : 'bg-white hover:bg-lagon-bg/40 border-lagon-border'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isActive ? 'bg-action text-white' : 'bg-lagon-bg text-deep'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className={`text-xs font-semibold ${isActive ? 'text-action' : 'text-deep'}`}>
                          {h.label}
                        </div>
                        {isActive && (
                          <p className="text-xs text-ink-muted leading-relaxed mt-1">
                            {h.detail}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
