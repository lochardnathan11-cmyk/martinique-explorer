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
} from 'lucide-react';

export interface MarineSpecies3D {
  id: string;
  category: 'turtles' | 'rays' | 'fish';
  name: string;
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
        x: 79,
        y: 34,
      },
      {
        label: 'Carapace (Dossière)',
        detail: '4 grandes écailles costales de chaque côté, sans chevauchement, aux teintes brunes et dorées rayonnantes.',
        x: 45,
        y: 36,
      },
      {
        label: 'Nageoires antérieures',
        detail: 'Puissantes palettes natatoires aux écailles noires serties d’un liseré clair permettant de voler sous l’eau.',
        x: 58,
        y: 57,
      },
    ],
  },
  {
    id: 'leatherback_turtle',
    category: 'turtles',
    name: 'Tortue Luth Géante',
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
        y: 30,
      },
      {
        label: 'Tête étoilée & bec en W',
        detail: 'Mâchoire supérieure munie de deux pointes permettant de saisir les méduses glissantes.',
        x: 28,
        y: 47,
      },
      {
        label: 'Immenses nageoires sans griffes',
        detail: 'Leur envergure peut dépasser 2,50 mètres pour traverser l’Atlantique jusqu’aux plages de Martinique.',
        x: 68,
        y: 54,
      },
    ],
  },
  {
    id: 'hawksbill_turtle',
    category: 'turtles',
    name: 'Tortue Imbriquée',
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
        x: 20,
        y: 36,
      },
      {
        label: 'Écailles imbriquées',
        detail: 'Magnifiques motifs ambrés flammés qui se superposent vers l’arrière comme des tuiles.',
        x: 50,
        y: 34,
      },
      {
        label: 'Bordure dentelée',
        detail: 'La marge arrière de la carapace forme des dents bien marquées qui la distinguent de la tortue verte.',
        x: 75,
        y: 41,
      },
    ],
  },
  {
    id: 'southern_stingray',
    category: 'rays',
    name: 'Raie Pastenague Américaine',
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
        y: 36,
      },
      {
        label: 'Queue fine à aiguillon défensif',
        detail: 'Situé sur la queue uniquement pour se défendre : ne marchez jamais brusquement sur les zones sableuses.',
        x: 78,
        y: 26,
      },
    ],
  },
  {
    id: 'eagle_ray',
    category: 'rays',
    name: 'Raie Léopard (Raie Aigle)',
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
        y: 55,
      },
    ],
  },
  {
    id: 'queen_angelfish',
    category: 'fish',
    name: 'Poisson-Ange Royal',
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
    scientificName: 'Pterois volitans',
    creoleName: 'Pwason Lyon',
    icon: '🦁',
    image3d: '/images/lionfish-3d.png',
    size: '25 à 40 cm',
    depth: '3m à 25m (Surplombs rocheux & épaves)',
    spots: 'Le Carbet, Saint-Pierre, Anse Noire, Rocher du Diamant',
    bestTime: 'Toute la journée (Zones ombragées)',
    diet: 'Carnivore (Petits poissons de récif)',
    status: 'Fascinant • Épines venimeuses (Ne pas toucher)',
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
        x: 40,
        y: 35,
      },
    ],
  },
  {
    id: 'parrotfish',
    category: 'fish',
    name: 'Poisson-Perroquet Royal',
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
        x: 25,
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
        y: 30,
      },
      {
        label: 'Gorgone éventail violette',
        detail: 'Colonie souple orientée perpendiculairement au courant pour capter le plancton.',
        x: 79,
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
  const [dioramaRot, setDioramaRot] = useState({ rotX: 4, rotY: -12, scale: 1 });
  const isDraggingDioramaRef = useRef(false);
  const lastDioramaPosRef = useRef({ x: 0, y: 0 });

  const visibleSpecies =
    categoryFilter === 'all'
      ? MARINE_SPECIES_3D
      : MARINE_SPECIES_3D.filter(s => s.category === categoryFilter);

  const currentSpecies =
    MARINE_SPECIES_3D.find(s => s.id === selectedSpeciesId) || visibleSpecies[0] || MARINE_SPECIES_3D[0];

  const handleResetCamera = () => {
    setDioramaRot({ rotX: 4, rotY: 0, scale: 1 });
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
          rotY: Math.sin(t * 0.9) * 24,
          rotX: 4 + Math.cos(t * 0.7) * 8,
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
      rotY: Math.max(-45, Math.min(45, prev.rotY + dx * 0.35)),
      rotX: Math.max(-25, Math.min(28, prev.rotX - dy * 0.25)),
    }));
  };

  const handleDioramaPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingDioramaRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="bg-white rounded-[32px] border border-lagon-border shadow-soft overflow-hidden">
      {/* Top Bar: Title & Family Filter Tabs */}
      <div className="p-6 sm:p-8 border-b border-lagon-border bg-gradient-to-r from-lagon-bg/60 via-white to-sand-light/40 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-action">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Observatoire Sous-Marin 3D Interactif • 9 Espèces</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-deep">
              Tortues, Raies & Poissons Rares de Martinique en 3D
            </h2>
          </div>

          {/* Family Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-lagon-bg border border-lagon-border self-start">
            {[
              { id: 'all', label: 'Toutes (9)' },
              { id: 'turtles', label: '🐢 Tortues (3)' },
              { id: 'rays', label: '🪁 Raies (2)' },
              { id: 'fish', label: '🐠 Poissons rares & Coraux (4)' },
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
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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

        {/* Species Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {visibleSpecies.map(sp => {
            const isSelected = sp.id === currentSpecies.id;
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => onSelectSpecies(sp.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-deep text-white border-deep shadow-soft scale-[1.01]'
                    : 'bg-white hover:bg-lagon-bg/60 border-lagon-border text-deep'
                }`}
              >
                <img
                  src={sp.image3d}
                  alt={sp.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/20 bg-[#042430]"
                />
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-deep'}`}>
                    {sp.name}
                  </div>
                  <div className={`text-[10px] truncate ${isSelected ? 'text-sky-200' : 'text-ink-muted'}`}>
                    {sp.spots.split(',')[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split View: 3D Stage (Left) + Anatomical & Field Guide (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT: 3D INTERACTIVE VIEWPORT */}
        <div className="lg:col-span-7 relative min-h-[390px] sm:min-h-[460px] bg-[#042430] flex items-center justify-center overflow-hidden select-none">
          <div
            onPointerDown={handleDioramaPointerDown}
            onPointerMove={handleDioramaPointerMove}
            onPointerUp={handleDioramaPointerUp}
            style={{ perspective: '1100px' }}
            className="relative w-full h-full min-h-[390px] sm:min-h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none p-6"
          >
            {/* Ambient glowing turquoise halo behind the 3D model */}
            <div
              className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-sky-400/20 blur-3xl pointer-events-none transition-transform duration-300"
              style={{
                transform: `translate3d(${dioramaRot.rotY * -0.6}px, ${dioramaRot.rotX * 0.6}px, 0)`,
              }}
            />

            {/* Left / Right Quick Species Navigation Arrows */}
            <button
              type="button"
              onPointerDown={e => e.stopPropagation()}
              onClick={() => handlePrevNext(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Espèce précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onPointerDown={e => e.stopPropagation()}
              onClick={() => handlePrevNext(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Espèce suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* 3D Rotatable Stage Container */}
            <div
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${dioramaRot.rotX}deg) rotateY(${dioramaRot.rotY}deg) scale(${dioramaRot.scale})`,
                transition: isDraggingDioramaRef.current ? 'none' : 'transform 0.12s ease-out',
              }}
              className="relative w-full max-w-[390px] aspect-square flex items-center justify-center"
            >
              {/* 3D Orbit Floor Ring */}
              <div
                style={{
                  transform: 'rotateX(76deg) translateZ(-120px)',
                }}
                className="absolute w-72 h-72 rounded-full border-2 border-dashed border-sky-300/30 shadow-[0_0_50px_rgba(56,189,248,0.25)] pointer-events-none"
              />

              {/* High-Definition 3D Diorama Render */}
              <img
                src={currentSpecies.image3d}
                alt={currentSpecies.name}
                draggable={false}
                style={{
                  transform: 'translateZ(35px)',
                  filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.65))',
                }}
                className="w-full h-full object-contain rounded-3xl pointer-events-none select-none"
              />

              {/* Interactive 3D Floating Anatomical Pins */}
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
                      transform: 'translate(-50%, -50%) translateZ(75px)',
                    }}
                    className={`absolute w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-sky-400 text-deep ring-4 ring-white shadow-[0_0_20px_rgba(56,189,248,0.9)] scale-125'
                        : 'bg-deep/90 text-white border-2 border-white/80 hover:scale-110'
                    }`}
                    title={h.label}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Top Overlay Badge */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="px-3.5 py-1.5 rounded-full bg-deep/80 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 text-sky-300 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Glissez pour orienter en 3D • Points ① ② ③</span>
              </div>

              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500/25 backdrop-blur-md border border-emerald-300/30 text-emerald-100 text-[11px] font-semibold">
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
                  className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{autoRotate ? 'Pause rotation' : 'Rotation 3D auto'}</span>
                </button>
                <button
                  type="button"
                  onPointerDown={e => e.stopPropagation()}
                  onClick={handleResetCamera}
                  className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
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
                    setDioramaRot(prev => ({ ...prev, scale: Math.min(1.3, prev.scale + 0.1) }))
                  }
                  className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-sm font-bold cursor-pointer"
                  title="Zoom +"
                >
                  +
                </button>
                <button
                  type="button"
                  onPointerDown={e => e.stopPropagation()}
                  onClick={() =>
                    setDioramaRot(prev => ({ ...prev, scale: Math.max(0.8, prev.scale - 0.1) }))
                  }
                  className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-sm font-bold cursor-pointer"
                  title="Zoom -"
                >
                  −
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: SPECIES FICHE & ANATOMICAL HOTSPOTS */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-action">
                  {currentSpecies.scientificName} • Créole : {currentSpecies.creoleName}
                </span>
                <h3 className="text-2xl font-semibold text-deep mt-0.5">
                  {currentSpecies.icon} {currentSpecies.name}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {currentSpecies.desc}
            </p>

            {/* Key Specs Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-lagon-bg/60 border border-lagon-border">
                <span className="text-[10px] uppercase tracking-wider text-ink-muted block">Taille & Envergure</span>
                <strong className="text-deep">{currentSpecies.size}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-lagon-bg/60 border border-lagon-border">
                <span className="text-[10px] uppercase tracking-wider text-ink-muted block">Profondeur</span>
                <strong className="text-deep">{currentSpecies.depth}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-sand-light/70 border border-sand-border">
                <span className="text-[10px] uppercase tracking-wider text-ink-muted block">Où l&apos;observer ?</span>
                <strong className="text-deep">{currentSpecies.spots}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-sand-light/70 border border-sand-border">
                <span className="text-[10px] uppercase tracking-wider text-ink-muted block">Meilleur créneau</span>
                <strong className="text-action">{currentSpecies.bestTime}</strong>
              </div>
            </div>

            {/* Interactive Anatomical Points */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-deep block">
                Détails à observer sur le modèle 3D :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentSpecies.hotspots.map((h, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveHotspot(idx);
                      const targetRotY = (50 - h.x) * 0.45;
                      const targetRotX = (h.y - 40) * 0.35;
                      setDioramaRot({ rotX: targetRotX, rotY: targetRotY, scale: 1.08 });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      activeHotspot === idx
                        ? 'bg-action text-white font-semibold shadow-2xs'
                        : 'bg-lagon-bg text-deep hover:bg-lagon-light/60'
                    }`}
                  >
                    {idx + 1}. {h.label}
                  </button>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-lagon-bg/60 border border-lagon-border text-xs text-ink leading-relaxed">
                <strong className="text-deep block mb-0.5">
                  Point {activeHotspot + 1} — {currentSpecies.hotspots[activeHotspot]?.label}
                </strong>
                {currentSpecies.hotspots[activeHotspot]?.detail}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
