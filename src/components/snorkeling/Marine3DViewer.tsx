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
  X,
  MousePointerClick,
  Compass,
  Maximize2,
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
  // Aquarium swimming configuration (% of tank width/height)
  swimConfig: {
    baseX: number;
    baseY: number;
    ampX: number;
    ampY: number;
    speed: number;
    phase: number;
    scale: number;
    zoneLabel: string;
  };
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
    swimConfig: {
      baseX: 46,
      baseY: 52,
      ampX: 22,
      ampY: 14,
      speed: 0.42,
      phase: 0,
      scale: 1.08,
      zoneLabel: 'Herbier d’Anse Dufour',
    },
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
    swimConfig: {
      baseX: 35,
      baseY: 22,
      ampX: 25,
      ampY: 7,
      speed: 0.3,
      phase: 1.8,
      scale: 1.18,
      zoneLabel: 'Large d’Anse Mitan & Grand Bleu',
    },
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
    swimConfig: {
      baseX: 72,
      baseY: 40,
      ampX: 16,
      ampY: 11,
      speed: 0.48,
      phase: 3.1,
      scale: 0.98,
      zoneLabel: 'Tombant corallien d’Anse Noire',
    },
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
    swimConfig: {
      baseX: 48,
      baseY: 79,
      ampX: 24,
      ampY: 5,
      speed: 0.36,
      phase: 0.9,
      scale: 0.96,
      zoneLabel: 'Fond sableux de Grande Anse',
    },
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
    swimConfig: {
      baseX: 66,
      baseY: 25,
      ampX: 20,
      ampY: 10,
      speed: 0.52,
      phase: 4.2,
      scale: 1.05,
      zoneLabel: 'Passe du Cap Salomon',
    },
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
    swimConfig: {
      baseX: 80,
      baseY: 60,
      ampX: 11,
      ampY: 9,
      speed: 0.62,
      phase: 2.4,
      scale: 0.9,
      zoneLabel: 'Jardin corallien de Sainte-Luce',
    },
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
    swimConfig: {
      baseX: 18,
      baseY: 50,
      ampX: 8,
      ampY: 8,
      speed: 0.28,
      phase: 5.1,
      scale: 0.92,
      zoneLabel: 'Surplomb volcanique du Carbet',
    },
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
    swimConfig: {
      baseX: 62,
      baseY: 64,
      ampX: 17,
      ampY: 9,
      speed: 0.56,
      phase: 1.2,
      scale: 0.92,
      zoneLabel: 'Récif de la Pointe Borgnèse',
    },
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
    swimConfig: {
      baseX: 20,
      baseY: 77,
      ampX: 2,
      ampY: 2,
      speed: 0.2,
      phase: 0,
      scale: 0.95,
      zoneLabel: 'Récif volcanique d’Anse Noire',
    },
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
  const [focusedSpecies, setFocusedSpecies] = useState<MarineSpecies3D | null>(null);
  const [tankPaused, setTankPaused] = useState<boolean>(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [simTime, setSimTime] = useState<number>(0);

  // 3D Inspection Modal State
  const [autoRotate3D, setAutoRotate3D] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<number>(0);
  const [dioramaRot, setDioramaRot] = useState({ rotX: 4, rotY: -12, scale: 1 });
  const isDraggingDioramaRef = useRef(false);
  const lastDioramaPosRef = useRef({ x: 0, y: 0 });

  const visibleSpecies =
    categoryFilter === 'all'
      ? MARINE_SPECIES_3D
      : MARINE_SPECIES_3D.filter(s => s.category === categoryFilter);

  // Animate the Giant Aquarium swimming loop
  useEffect(() => {
    if (tankPaused || focusedSpecies) return;
    let rafId: number;
    let last = performance.now();
    const animate = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setSimTime(prev => prev + dt);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [tankPaused, focusedSpecies]);

  // Smooth continuous 3D oscillation when inspecting a specific animal
  useEffect(() => {
    if (!focusedSpecies || !autoRotate3D) return;
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
  }, [focusedSpecies, autoRotate3D]);

  const handleOpenAnimal3D = (sp: MarineSpecies3D) => {
    onSelectSpecies(sp.id);
    setFocusedSpecies(sp);
    setActiveHotspot(0);
    setDioramaRot({ rotX: 4, rotY: 0, scale: 1 });
  };

  const handlePrevNextFocused = (dir: -1 | 1) => {
    if (!focusedSpecies) return;
    const idx = visibleSpecies.findIndex(s => s.id === focusedSpecies.id);
    const nextIdx = (idx + dir + visibleSpecies.length) % visibleSpecies.length;
    handleOpenAnimal3D(visibleSpecies[nextIdx]);
  };

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
      {/* 1. HEADER & AQUARIUM CONTROLS */}
      <div className="p-6 sm:p-8 border-b border-lagon-border bg-gradient-to-r from-lagon-bg/60 via-white to-sand-light/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-action">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aquarium Géant Interactif • Fonds Marins de Martinique</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-deep">
            Cliquez sur un animal en mouvement pour l&apos;observer en 3D
          </h2>
        </div>

        {/* Family Filters + Pause Tank Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-2xl bg-lagon-bg border border-lagon-border">
            {[
              { id: 'all', label: 'Tout le lagon (9)' },
              { id: 'turtles', label: '🐢 Tortues (3)' },
              { id: 'rays', label: '🪁 Raies (2)' },
              { id: 'fish', label: '🐠 Poissons & Coraux (4)' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryFilter(tab.id as 'all' | 'turtles' | 'rays' | 'fish')}
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

          <button
            type="button"
            onClick={() => setTankPaused(!tankPaused)}
            className="px-3.5 py-2 rounded-2xl bg-white hover:bg-lagon-bg border border-lagon-border text-deep text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title={tankPaused ? 'Relancer la nage' : 'Figer les animaux'}
          >
            {tankPaused ? <Play className="w-3.5 h-3.5 text-action" /> : <Pause className="w-3.5 h-3.5 text-action" />}
            <span>{tankPaused ? 'Relancer' : 'Pause'}</span>
          </button>
        </div>
      </div>

      {/* 2. GIANT INTERACTIVE AQUARIUM VIEWPORT */}
      <div className="relative w-full h-[540px] sm:h-[620px] bg-gradient-to-b from-[#0284C7] via-[#03537B] to-[#041E2B] overflow-hidden select-none">
        {/* A. Animated Surface Waves & Sunbeams (God Rays) */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sky-300/35 to-transparent pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-35"
          style={{
            backgroundImage:
              'repeating-linear-gradient(108deg, rgba(186,230,253,0.18) 0%, rgba(186,230,253,0.02) 8%, transparent 16%)',
          }}
        />

        {/* B. Ecological Zone Labels inside the Tank */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none text-[11px]">
          <div className="px-3.5 py-1.5 rounded-full bg-deep/70 backdrop-blur-md border border-white/20 text-white font-medium flex items-center gap-2">
            <MousePointerClick className="w-3.5 h-3.5 text-sky-300 animate-bounce" />
            <span>Cliquez sur n&apos;importe quelle espèce qui nage pour ouvrir son modèle 3D</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sky-100">
              🌋 Gauche : Tombant volcanique (Anse Noire / Carbet)
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-emerald-100">
              🌱 Centre : Herbier & Sable (Anse Dufour / Mitan)
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-amber-100">
              🪸 Droite : Récif corallien (Sainte-Luce)
            </span>
          </div>
        </div>

        {/* C. Background Ambient School of Small Reef Fish */}
        {[0, 1, 2, 3, 4, 5].map(idx => {
          const fishX = ((simTime * (3 + idx * 0.5) + idx * 19) % 110) - 5;
          const fishY = 18 + (idx * 11) % 55 + Math.sin(simTime * 1.5 + idx) * 3;
          return (
            <div
              key={idx}
              style={{ left: `${fishX}%`, top: `${fishY}%` }}
              className="absolute pointer-events-none opacity-30 text-xs select-none"
            >
              🐟
            </div>
          );
        })}

        {/* D. Rising Underwater Micro-Bubbles */}
        {[12, 28, 45, 64, 82, 91].map((leftPos, idx) => {
          const bubbleY = 100 - ((simTime * (7 + idx * 1.8) + idx * 23) % 100);
          return (
            <div
              key={idx}
              style={{
                left: `${leftPos + Math.sin(simTime * 2 + idx) * 1.5}%`,
                top: `${bubbleY}%`,
              }}
              className="absolute w-2 h-2 rounded-full bg-sky-200/35 border border-white/40 pointer-events-none"
            />
          );
        })}

        {/* E. Seabed Scenery (Volcanic Reef Left + White Sand & Seagrass Center + Coral Garden Right) */}
        <svg
          viewBox="0 0 1440 240"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-36 sm:h-44 pointer-events-none z-0"
        >
          {/* Distant Reef Silhouette */}
          <path
            d="M0,140 Q220,60 460,150 T980,130 T1440,100 L1440,240 L0,240 Z"
            fill="#062C3E"
            opacity="0.7"
          />
          {/* Left Volcanic Slope (Anse Noire) */}
          <path
            d="M0,90 Q180,110 340,185 L0,240 Z"
            fill="#0F172A"
            opacity="0.85"
          />
          {/* Center Sandy Lagoon & Seagrass Bed (Anse Dufour / Anse Mitan) */}
          <path
            d="M0,190 Q420,150 760,175 T1440,165 L1440,240 L0,240 Z"
            fill="#0E4A60"
          />
          <path
            d="M180,205 Q540,165 890,190 T1320,195 L1440,240 L0,240 Z"
            fill="#16697A"
            opacity="0.65"
          />
        </svg>

        {/* F. SWIMMING 3D ANIMALS IN THE GIANT AQUARIUM */}
        {visibleSpecies.map(sp => {
          const { baseX, baseY, ampX, ampY, speed, phase, scale, zoneLabel } = sp.swimConfig;
          const angle = simTime * speed + phase;
          const x = baseX + Math.sin(angle) * ampX;
          const y = baseY + Math.cos(angle * 1.3) * ampY;
          // Direction of horizontal movement (+1 moving right, -1 moving left)
          const movingRight = Math.cos(angle) >= 0;
          const tiltDeg = Math.sin(angle * 1.3) * 6;
          const isHovered = hoveredId === sp.id;

          return (
            <button
              key={sp.id}
              type="button"
              onMouseEnter={() => setHoveredId(sp.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleOpenAnimal3D(sp)}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) scale(${isHovered ? scale * 1.16 : scale})`,
                zIndex: isHovered ? 40 : Math.round(y),
              }}
              className="group absolute flex flex-col items-center focus:outline-none cursor-pointer transition-transform duration-300"
            >
              {/* Animated Swimming 3D Medallion */}
              <div
                style={{
                  transform: `rotate(${tiltDeg}deg)`,
                }}
                className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isHovered
                    ? 'ring-4 ring-sky-300 shadow-[0_0_40px_rgba(56,189,248,0.85)]'
                    : 'ring-2 ring-white/30 shadow-[0_12px_30px_rgba(0,0,0,0.55)]'
                }`}
              >
                {/* Pulsing Sonar Ring */}
                <span
                  className={`absolute inset-0 rounded-full border-2 border-sky-300/60 ${
                    isHovered ? 'animate-ping opacity-75' : 'opacity-0'
                  }`}
                />

                {/* Circular 3D Bubble Window with direction flip */}
                <div className="w-full h-full rounded-full overflow-hidden bg-[#042430] relative flex items-center justify-center">
                  <img
                    src={sp.image3d}
                    alt={sp.name}
                    draggable={false}
                    style={{
                      transform: `scaleX(${movingRight ? 1 : -1}) scale(1.18)`,
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 select-none"
                  />
                  {/* Subtle glass bubble reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/25 pointer-events-none rounded-full" />
                </div>

                {/* Small Icon Badge */}
                <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-deep border-2 border-white text-xs flex items-center justify-center shadow-md">
                  {sp.icon}
                </span>
              </div>

              {/* Floating Name Tag below the Swimming Animal */}
              <div
                className={`mt-1.5 px-3 py-1 rounded-full backdrop-blur-md border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isHovered
                    ? 'bg-sky-400 text-deep border-white font-bold shadow-lg scale-105'
                    : 'bg-deep/80 text-white border-white/25 font-semibold text-[11px]'
                }`}
              >
                <span>{sp.name}</span>
                <span className={`text-[10px] ${isHovered ? 'text-deep/80' : 'text-sky-300'}`}>
                  • Voir en 3D
                </span>
              </div>

              {/* Extra Hover Tooltip with Martinique Spot */}
              {isHovered && (
                <div className="mt-1 px-2.5 py-0.5 rounded-full bg-deep/90 text-sky-200 text-[10px] font-medium border border-sky-400/30 whitespace-nowrap animate-fadeIn">
                  📍 {zoneLabel} ({sp.depth.split(' ')[0]})
                </div>
              )}
            </button>
          );
        })}

        {/* 3. FULL-TANK 3D ANIMAL INSPECTOR OVERLAY (WHEN AN ANIMAL IS CLICKED) */}
        {focusedSpecies && (
          <div className="absolute inset-0 z-50 bg-deep/95 backdrop-blur-xl animate-fadeIn flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
            {/* LEFT: INTERACTIVE 3D ROTATABLE STAGE */}
            <div
              onPointerDown={handleDioramaPointerDown}
              onPointerMove={handleDioramaPointerMove}
              onPointerUp={handleDioramaPointerUp}
              style={{ perspective: '1100px' }}
              className="relative lg:w-7/12 min-h-[340px] sm:min-h-[420px] lg:h-full bg-[#042430] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none p-6 shrink-0"
            >
              {/* Back to Giant Aquarium Button */}
              <button
                type="button"
                onPointerDown={e => e.stopPropagation()}
                onClick={() => setFocusedSpecies(null)}
                className="absolute top-4 left-4 z-40 px-4 py-2 rounded-2xl bg-white hover:bg-sky-50 text-deep text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-action" />
                <span>Retour à l&apos;Aquarium Géant</span>
              </button>

              {/* Top Right Instruction */}
              <div className="hidden sm:flex absolute top-4 right-4 z-30 px-3.5 py-1.5 rounded-full bg-deep/80 backdrop-blur-md border border-white/20 text-white text-xs font-medium items-center gap-2 pointer-events-none">
                <RotateCw className="w-3.5 h-3.5 text-sky-300 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Glissez pour tourner en 3D • Points ① ② ③</span>
              </div>

              {/* Prev / Next Species Arrows */}
              <button
                type="button"
                onPointerDown={e => e.stopPropagation()}
                onClick={() => handlePrevNextFocused(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Animal précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onPointerDown={e => e.stopPropagation()}
                onClick={() => handlePrevNextFocused(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Animal suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* 3D Rotatable Stage */}
              <div
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${dioramaRot.rotX}deg) rotateY(${dioramaRot.rotY}deg) scale(${dioramaRot.scale})`,
                  transition: isDraggingDioramaRef.current ? 'none' : 'transform 0.12s ease-out',
                }}
                className="relative w-full max-w-[380px] aspect-square flex items-center justify-center"
              >
                <div
                  style={{ transform: 'rotateX(76deg) translateZ(-120px)' }}
                  className="absolute w-72 h-72 rounded-full border-2 border-dashed border-sky-300/30 shadow-[0_0_50px_rgba(56,189,248,0.25)] pointer-events-none"
                />

                <img
                  src={focusedSpecies.image3d}
                  alt={focusedSpecies.name}
                  draggable={false}
                  style={{
                    transform: 'translateZ(35px)',
                    filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.65))',
                  }}
                  className="w-full h-full object-contain rounded-3xl pointer-events-none select-none"
                />

                {focusedSpecies.hotspots.map((h, idx) => {
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

              {/* Bottom 3D Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onPointerDown={e => e.stopPropagation()}
                    onClick={() => setAutoRotate3D(!autoRotate3D)}
                    className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {autoRotate3D ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{autoRotate3D ? 'Pause rotation' : 'Rotation 3D auto'}</span>
                  </button>
                  <button
                    type="button"
                    onPointerDown={e => e.stopPropagation()}
                    onClick={() => setDioramaRot({ rotX: 4, rotY: 0, scale: 1 })}
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
                  >
                    −
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: DETAILED SPECIES FICHE */}
            <div className="lg:w-5/12 p-6 sm:p-8 bg-white text-ink flex flex-col justify-between space-y-5 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-action">
                      {focusedSpecies.scientificName} • Créole : {focusedSpecies.creoleName}
                    </span>
                    <h3 className="text-2xl font-semibold text-deep mt-0.5">
                      {focusedSpecies.icon} {focusedSpecies.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFocusedSpecies(null)}
                    className="p-2 rounded-full bg-lagon-bg hover:bg-lagon-light/60 text-deep transition-colors cursor-pointer shrink-0"
                    title="Fermer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  {focusedSpecies.desc}
                </p>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-lagon-bg/60 border border-lagon-border">
                    <span className="text-[10px] uppercase tracking-wider text-ink-muted block">Taille & Envergure</span>
                    <strong className="text-deep">{focusedSpecies.size}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-lagon-bg/60 border border-lagon-border">
                    <span className="text-[10px] uppercase tracking-wider text-ink-muted block">Profondeur</span>
                    <strong className="text-deep">{focusedSpecies.depth}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-sand-light/70 border border-sand-border">
                    <span className="text-[10px] uppercase tracking-wider text-ink-muted block">Où l&apos;observer ?</span>
                    <strong className="text-deep">{focusedSpecies.spots}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-sand-light/70 border border-sand-border">
                    <span className="text-[10px] uppercase tracking-wider text-ink-muted block">Meilleur créneau</span>
                    <strong className="text-action">{focusedSpecies.bestTime}</strong>
                  </div>
                </div>

                {/* Anatomical Hotspots */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-deep block">
                    Détails anatomiques en 3D :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {focusedSpecies.hotspots.map((h, idx) => (
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
                      Point {activeHotspot + 1} — {focusedSpecies.hotspots[activeHotspot]?.label}
                    </strong>
                    {focusedSpecies.hotspots[activeHotspot]?.detail}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFocusedSpecies(null)}
                className="w-full py-3 rounded-2xl bg-deep hover:bg-action text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Retourner observer l&apos;Aquarium Géant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM QUICK-ACCESS DOCK OF ALL SPECIES IN THE AQUARIUM */}
      <div className="p-4 sm:p-5 bg-lagon-bg/40 border-t border-lagon-border">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-deep">
            Accès direct aux espèces de l&apos;aquarium ({visibleSpecies.length}) :
          </span>
          <span className="text-[11px] text-ink-muted hidden sm:inline">
            Cliquez sur une vignette ou directement sur l&apos;animal dans le bassin
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {MARINE_SPECIES_3D.map(sp => {
            const isFocused = focusedSpecies?.id === sp.id;
            return (
              <button
                key={sp.id}
                type="button"
                onMouseEnter={() => setHoveredId(sp.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleOpenAnimal3D(sp)}
                className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex items-center lg:flex-col lg:text-center gap-2 ${
                  isFocused || hoveredId === sp.id
                    ? 'bg-deep text-white border-deep shadow-soft scale-[1.02]'
                    : 'bg-white hover:bg-lagon-bg border-lagon-border text-deep'
                }`}
              >
                <img
                  src={sp.image3d}
                  alt={sp.name}
                  className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl object-cover shrink-0 border border-white/20 bg-[#042430]"
                />
                <div className="min-w-0 w-full">
                  <div className={`text-[11px] font-semibold truncate ${isFocused || hoveredId === sp.id ? 'text-white' : 'text-deep'}`}>
                    {sp.name}
                  </div>
                  <div className={`text-[9px] truncate ${isFocused || hoveredId === sp.id ? 'text-sky-200' : 'text-ink-muted'}`}>
                    {sp.spots.split(',')[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
