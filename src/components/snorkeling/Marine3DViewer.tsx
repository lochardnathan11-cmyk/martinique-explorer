'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RotateCw, Sparkles, Play, Pause, RotateCcw, Box, Eye } from 'lucide-react';

export interface MarineSpecies3D {
  id: string;
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
    desc: 'Reconnaissable à sa carapace ovale brun-ambré rayonnante, ses 4 plaques latérales et ses longues nageoires sombres bordées de jaune crème.',
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
    id: 'hawksbill_turtle',
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
    id: 'stingray',
    name: 'Raie Léopard & Pastenague',
    scientificName: 'Aetobatus narinari',
    creoleName: 'Rè',
    icon: '🪁',
    image3d: '/images/stingray-3d.png',
    size: '90 à 180 cm d’envergure',
    depth: '2m à 10m (Sable & bordures d’herbiers)',
    spots: 'Anse Noire, Grande Anse, Sainte-Luce',
    bestTime: 'Matin calme',
    diet: 'Mollusques, petits crabes & bivalves',
    status: 'Observation fréquente',
    desc: 'Plane avec une grâce hypnotique au-dessus du sable clair et des tombants. Ses ailes ponctuées d’ocelles blancs ondulent lentement dans le courant.',
    hotspots: [
      {
        label: 'Ailes pectorales',
        detail: 'Grand disque en losange parsemé de taches blanches qui ondule comme un oiseau sous-marin.',
        x: 42,
        y: 26,
      },
      {
        label: 'Tête & Spiracles',
        detail: 'Situés derrière les yeux pour respirer une eau propre même lorsqu’elle fouille le sable.',
        x: 61,
        y: 25,
      },
      {
        label: 'Queue effilée',
        detail: 'Très longue queue fine en fouet ; observez-la toujours à distance respectueuse.',
        x: 35,
        y: 55,
      },
    ],
  },
  {
    id: 'parrotfish',
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
    desc: 'Paré d’écailles vert émeraude, turquoise et corail, il broute la roche corallienne avec son bec puissant et rejette du sable blanc très fin.',
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<'diorama' | '360'>('diorama');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<number>(0);

  // Interactive 3D Tilt & Rotation State for Diorama Mode
  const [dioramaRot, setDioramaRot] = useState({ rotX: 4, rotY: -12, scale: 1 });
  const isDraggingDioramaRef = useRef(false);
  const lastDioramaPosRef = useRef({ x: 0, y: 0 });

  // Camera spherical coordinates for 360° Mesh Mode
  const rotationRef = useRef({ yaw: -0.55, pitch: 0.35, zoom: 1.0 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(autoRotate);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  const currentSpecies =
    MARINE_SPECIES_3D.find(s => s.id === selectedSpeciesId) || MARINE_SPECIES_3D[0];

  const handleResetCamera = () => {
    rotationRef.current = { yaw: -0.55, pitch: 0.35, zoom: 1.0 };
    setDioramaRot({ rotX: 4, rotY: 0, scale: 1 });
  };

  useEffect(() => {
    setActiveHotspot(0);
  }, [selectedSpeciesId]);

  // Smooth continuous 3D oscillation in Diorama mode when autoRotate is on
  useEffect(() => {
    if (viewMode !== 'diorama' || !autoRotate) return;
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
  }, [viewMode, autoRotate]);

  // 360° Procedural 3D Mesh Canvas Engine
  useEffect(() => {
    if (viewMode !== '360') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const startTime = performance.now();

    type Vec3 = [number, number, number];
    type Face = {
      pts: Vec3[];
      fill: string;
      stroke?: string;
      strokeWidth?: number;
      shininess?: number;
    };

    const rotatePoint = (p: Vec3, yaw: number, pitch: number): Vec3 => {
      const [x, y, z] = p;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const y2 = y * cosP - z1 * sinP;
      const z2 = y * sinP + z1 * cosP;
      return [x1, y2, z2];
    };

    const normalize = (v: Vec3): Vec3 => {
      const len = Math.hypot(v[0], v[1], v[2]) || 1;
      return [v[0] / len, v[1] / len, v[2] / len];
    };

    const cross = (a: Vec3, b: Vec3): Vec3 => [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];

    const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

    const shadeColor = (hex: string, lightFactor: number, specFactor = 0): string => {
      const clean = hex.replace('#', '');
      const num = parseInt(clean, 16);
      let r = (num >> 16) & 255;
      let g = (num >> 8) & 255;
      let b = num & 255;
      r = Math.min(255, Math.max(0, Math.round(r * lightFactor + specFactor * 230)));
      g = Math.min(255, Math.max(0, Math.round(g * lightFactor + specFactor * 245)));
      b = Math.min(255, Math.max(0, Math.round(b * lightFactor + specFactor * 255)));
      return `rgb(${r}, ${g}, ${b})`;
    };

    const buildTurtleFaces = (t: number, isHawksbill: boolean): Face[] => {
      const faces: Face[] = [];
      const rings = 14;
      const segs = 20;
      const length = isHawksbill ? 1.55 : 1.65;
      const width = isHawksbill ? 1.15 : 1.28;
      const domeHeight = isHawksbill ? 0.52 : 0.58;

      const shellVertex = (rIdx: number, sIdx: number, isTop: boolean): Vec3 => {
        const u = rIdx / rings;
        const theta = (sIdx / segs) * Math.PI * 2;
        const rad = Math.sin(u * (Math.PI / 2));
        const serration =
          isHawksbill && u > 0.85 && Math.cos(theta) < -0.2
            ? 1 + 0.06 * Math.sin(sIdx * Math.PI)
            : 1;
        const taper = 1 - 0.14 * Math.sin(theta);
        const x = Math.cos(theta) * length * rad * serration;
        const z = Math.sin(theta) * width * rad * taper * serration;
        const y = isTop
          ? Math.cos(u * (Math.PI / 2)) * domeHeight + (u > 0.88 ? 0.04 : 0)
          : -Math.cos(u * (Math.PI / 2)) * 0.24;
        return [x, y, z];
      };

      for (let r = 0; r < rings; r++) {
        for (let s = 0; s < segs; s++) {
          const sNext = (s + 1) % segs;
          const p1 = shellVertex(r, s, true);
          const p2 = shellVertex(r + 1, s, true);
          const p3 = shellVertex(r + 1, sNext, true);
          const p4 = shellVertex(r, sNext, true);

          let scuteColor = isHawksbill ? '#7C2D12' : '#854D27';
          if (r < 4) {
            scuteColor = isHawksbill ? '#9A3412' : '#93562B';
          } else if (r < 11) {
            const parity = (Math.floor(r / 3) + Math.floor(s / 3)) % 2;
            if (isHawksbill) {
              scuteColor = parity === 0 ? '#B45309' : '#57220E';
            } else {
              scuteColor = parity === 0 ? '#A66332' : '#78421E';
              if (s >= 3 && s <= 7 && r >= 4 && r <= 9) {
                scuteColor = '#C88A3B';
              }
            }
          } else {
            scuteColor = s % 2 === 0 ? '#693818' : '#8C5228';
          }

          faces.push({
            pts: [p1, p2, p3, p4],
            fill: scuteColor,
            stroke: '#E7CBA9',
            strokeWidth: r % 3 === 0 ? 1.1 : 0.45,
            shininess: 0.45,
          });

          const b1 = shellVertex(r, s, false);
          const b2 = shellVertex(r, sNext, false);
          const b3 = shellVertex(r + 1, sNext, false);
          const b4 = shellVertex(r + 1, s, false);
          faces.push({
            pts: [b1, b2, b3, b4],
            fill: r > 11 ? '#D6B882' : '#F2DEB3',
            stroke: '#D5B887',
            strokeWidth: 0.4,
            shininess: 0.15,
          });
        }
      }

      const headBob = Math.sin(t * 2.1) * 0.05;
      const headLen = isHawksbill ? 0.68 : 0.62;
      const headRings = 7;
      const headSegs = 12;
      for (let r = 0; r < headRings; r++) {
        const u0 = r / headRings;
        const u1 = (r + 1) / headRings;
        for (let s = 0; s < headSegs; s++) {
          const a0 = (s / headSegs) * Math.PI * 2;
          const a1 = ((s + 1) / headSegs) * Math.PI * 2;
          const makeHeadPt = (u: number, a: number): Vec3 => {
            const rad = Math.sin(u * Math.PI * 0.85 + 0.15) * (isHawksbill ? 0.25 * (1 - u * 0.35) : 0.28);
            const x = 1.48 + u * headLen;
            const y = 0.05 + headBob * u + Math.sin(a) * rad * 0.85 - (isHawksbill && u > 0.7 ? (u - 0.7) * 0.18 : 0);
            const z = Math.cos(a) * rad * 0.9;
            return [x, y, z];
          };

          const isEyeZone = r >= 3 && r <= 4 && (s === 1 || s === 2 || s === 9 || s === 10);
          faces.push({
            pts: [makeHeadPt(u0, a0), makeHeadPt(u1, a0), makeHeadPt(u1, a1), makeHeadPt(u0, a1)],
            fill: isEyeZone ? '#090D16' : (r + s) % 2 === 0 ? '#231B15' : '#3A281B',
            stroke: isEyeZone ? '#D6B882' : '#E7D1A7',
            strokeWidth: 1.15,
            shininess: isEyeZone ? 0.8 : 0.25,
          });
        }
      }

      const flapAngle = Math.sin(t * 2.4) * 0.38;
      const pitchTwist = Math.cos(t * 2.4) * 0.22;

      [-1, 1].forEach(side => {
        const segCount = 9;
        const widthSegs = 4;
        for (let i = 0; i < segCount; i++) {
          const u0 = i / segCount;
          const u1 = (i + 1) / segCount;
          for (let j = 0; j < widthSegs; j++) {
            const v0 = j / widthSegs - 0.5;
            const v1 = (j + 1) / widthSegs - 0.5;

            const makeFlipperPt = (u: number, v: number, topSurface: boolean): Vec3 => {
              const span = 1.45 * u;
              const chord = (1 - u * 0.55) * 0.42 * (1 + Math.sin(u * Math.PI) * 0.35);
              const lx = 0.85 - u * 0.65 + v * chord;
              let lz = side * (0.92 + span);
              let ly = -0.06 + Math.sin(u * Math.PI) * (topSurface ? 0.045 : -0.045);

              const dz = Math.abs(lz - side * 0.92);
              const flapY = Math.sin(flapAngle) * dz + v * Math.sin(pitchTwist) * 0.18;
              const flapZ = Math.cos(flapAngle) * dz;
              ly += flapY;
              lz = side * (0.92 + flapZ);
              return [lx, ly, lz];
            };

            faces.push({
              pts: [
                makeFlipperPt(u0, v0, true),
                makeFlipperPt(u1, v0, true),
                makeFlipperPt(u1, v1, true),
                makeFlipperPt(u0, v1, true),
              ],
              fill: (i + j) % 2 === 0 ? '#1C1613' : '#332318',
              stroke: '#EBD3A7',
              strokeWidth: 1.25,
              shininess: 0.35,
            });

            faces.push({
              pts: [
                makeFlipperPt(u0, v0, false),
                makeFlipperPt(u0, v1, false),
                makeFlipperPt(u1, v1, false),
                makeFlipperPt(u1, v0, false),
              ],
              fill: '#D8BE8E',
              stroke: '#4A3728',
              strokeWidth: 0.6,
              shininess: 0.15,
            });
          }
        }
      });

      [-1, 1].forEach(side => {
        const rearFlap = -Math.sin(t * 2.4 - 0.8) * 0.18;
        faces.push({
          pts: [
            [-1.25, -0.08, side * 0.55],
            [-1.78, -0.12 + rearFlap, side * 0.85],
            [-1.88, -0.12 + rearFlap, side * 0.58],
            [-1.38, -0.08, side * 0.35],
          ],
          fill: '#231A14',
          stroke: '#E5CCA0',
          strokeWidth: 1.1,
          shininess: 0.25,
        });
      });

      return faces;
    };

    const buildStingrayFaces = (t: number): Face[] => {
      const faces: Face[] = [];
      const gridU = 14;
      const gridV = 14;

      const rayPt = (iu: number, iv: number, isTop: boolean): Vec3 => {
        const u = (iu / gridU) * 2 - 1;
        const v = (iv / gridV) * 2 - 1;
        const maxSpan = 1 - Math.pow(Math.abs(u), 1.15);
        const z = v * maxSpan * 1.85;
        const x = u * 1.45 - Math.abs(v) * 0.25;
        const wave = Math.sin(t * 3.2 - u * 2.5) * Math.pow(Math.abs(v * maxSpan), 1.3) * 0.55;
        const thickness = (1 - Math.hypot(u * 0.7, v * maxSpan)) * (isTop ? 0.22 : -0.1);
        return [x, wave + Math.max(isTop ? 0 : -0.12, thickness), z];
      };

      for (let i = 0; i < gridU; i++) {
        for (let j = 0; j < gridV; j++) {
          const isSpot = (i * 3 + j * 5) % 7 === 0 && j > 2 && j < gridV - 2;
          faces.push({
            pts: [rayPt(i, j, true), rayPt(i + 1, j, true), rayPt(i + 1, j + 1, true), rayPt(i, j + 1, true)],
            fill: isSpot ? '#E0F2FE' : (i + j) % 2 === 0 ? '#1E293B' : '#334155',
            stroke: '#475569',
            strokeWidth: 0.4,
            shininess: 0.4,
          });
          faces.push({
            pts: [rayPt(i, j, false), rayPt(i, j + 1, false), rayPt(i + 1, j + 1, false), rayPt(i + 1, j, false)],
            fill: '#F1F5F9',
            shininess: 0.15,
          });
        }
      }

      for (let k = 0; k < 10; k++) {
        const x0 = -1.35 - k * 0.18;
        const x1 = -1.35 - (k + 1) * 0.18;
        const y0 = Math.sin(t * 3.2 + k * 0.35) * 0.06;
        const y1 = Math.sin(t * 3.2 + (k + 1) * 0.35) * 0.06;
        const w = 0.045 * (1 - k / 11);
        faces.push({
          pts: [
            [x0, y0, -w],
            [x1, y1, -w * 0.8],
            [x1, y1, w * 0.8],
            [x0, y0, w],
          ],
          fill: '#0F172A',
        });
      }

      return faces;
    };

    const buildParrotfishFaces = (t: number): Face[] => {
      const faces: Face[] = [];
      const rings = 14;
      const segs = 14;

      const fishPt = (ir: number, is: number): Vec3 => {
        const u = ir / rings;
        const a = (is / segs) * Math.PI * 2;
        const x = (u - 0.5) * 2.8;
        const profile = Math.sin(u * Math.PI);
        const sway = Math.sin(t * 4.5 - u * 4.0) * (1 - u) * 0.25;
        const y = Math.sin(a) * profile * 0.72;
        const z = Math.cos(a) * profile * 0.34 + sway;
        return [x, y, z];
      };

      for (let r = 0; r < rings; r++) {
        for (let s = 0; s < segs; s++) {
          const sNext = (s + 1) % segs;
          let color = '#0D9488';
          if (r >= 11) color = '#F43F5E';
          else if (r === 2) color = '#FACC15';
          else if ((r + s) % 3 === 0) color = '#06B6D4';

          faces.push({
            pts: [fishPt(r, s), fishPt(r + 1, s), fishPt(r + 1, sNext), fishPt(r, sNext)],
            fill: color,
            stroke: '#2DD4BF',
            strokeWidth: 0.65,
            shininess: 0.6,
          });
        }
      }

      const tailSway = Math.sin(t * 4.5) * 0.28;
      faces.push({
        pts: [
          [-1.35, 0.15, tailSway],
          [-1.95, 0.65, tailSway * 1.35],
          [-1.75, 0, tailSway * 1.2],
          [-1.95, -0.65, tailSway * 1.35],
          [-1.35, -0.15, tailSway],
        ],
        fill: '#0EA5E9',
        stroke: '#FACC15',
        strokeWidth: 1.5,
        shininess: 0.5,
      });

      faces.push({
        pts: [
          [-0.6, 0.62, 0],
          [-0.5, 0.92, 0],
          [0.45, 0.85, 0],
          [0.55, 0.58, 0],
        ],
        fill: '#FB7185',
        stroke: '#38BDF8',
        strokeWidth: 1,
      });

      return faces;
    };

    const buildReefFaces = (t: number): Face[] => {
      const faces: Face[] = [];
      const rockSegs = 16;
      for (let s = 0; s < rockSegs; s++) {
        const a0 = (s / rockSegs) * Math.PI * 2;
        const a1 = ((s + 1) / rockSegs) * Math.PI * 2;
        faces.push({
          pts: [
            [Math.cos(a0) * 1.4, -0.65, Math.sin(a0) * 1.4],
            [Math.cos(a1) * 1.4, -0.65, Math.sin(a1) * 1.4],
            [Math.cos(a1) * 1.1, -0.25, Math.sin(a1) * 1.1],
            [Math.cos(a0) * 1.1, -0.25, Math.sin(a0) * 1.1],
          ],
          fill: s % 2 === 0 ? '#334155' : '#1E293B',
          stroke: '#475569',
          strokeWidth: 0.5,
        });
      }

      const spongeRings = 7;
      const spongeSegs = 14;
      for (let r = 0; r < spongeRings; r++) {
        const u0 = r / spongeRings;
        const u1 = (r + 1) / spongeRings;
        const rad0 = 0.42 + Math.sin(u0 * Math.PI) * 0.22;
        const rad1 = 0.42 + Math.sin(u1 * Math.PI) * 0.22;
        const y0 = -0.3 + u0 * 1.15;
        const y1 = -0.3 + u1 * 1.15;
        for (let s = 0; s < spongeSegs; s++) {
          const a0 = (s / spongeSegs) * Math.PI * 2;
          const a1 = ((s + 1) / spongeSegs) * Math.PI * 2;
          const ridge0 = 1 + (s % 2 === 0 ? 0.06 : -0.04);
          const ridge1 = 1 + ((s + 1) % 2 === 0 ? 0.06 : -0.04);
          faces.push({
            pts: [
              [-0.3 + Math.cos(a0) * rad0 * ridge0, y0, Math.sin(a0) * rad0 * ridge0],
              [-0.3 + Math.cos(a1) * rad0 * ridge1, y0, Math.sin(a1) * rad0 * ridge1],
              [-0.3 + Math.cos(a1) * rad1 * ridge1, y1, Math.sin(a1) * rad1 * ridge1],
              [-0.3 + Math.cos(a0) * rad1 * ridge0, y1, Math.sin(a0) * rad1 * ridge0],
            ],
            fill: (r + s) % 2 === 0 ? '#BE185D' : '#9D174D',
            stroke: '#F472B6',
            strokeWidth: 0.5,
            shininess: 0.25,
          });
        }
      }

      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
          const u = (i / 6 - 0.5) * 1.1;
          const v = j / 5;
          const sway = Math.sin(t * 2.0 + v * 2.2) * v * 0.18;
          faces.push({
            pts: [
              [0.55 + u * (0.4 + v * 0.5), -0.2 + v * 1.25, 0.2 + sway],
              [0.55 + (u + 0.16) * (0.4 + v * 0.5), -0.2 + v * 1.25, 0.2 + sway],
              [0.55 + (u + 0.16) * (0.4 + (v + 0.18) * 0.5), -0.2 + (v + 0.18) * 1.25, 0.2 + sway * 1.2],
              [0.55 + u * (0.4 + (v + 0.18) * 0.5), -0.2 + (v + 0.18) * 1.25, 0.2 + sway * 1.2],
            ],
            fill: '#7E22CE',
            stroke: '#C084FC',
            strokeWidth: 0.8,
          });
        }
      }

      return faces;
    };

    const lightDir = normalize([0.45, 0.85, -0.35]);

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      if (autoRotateRef.current && !isDraggingRef.current) {
        rotationRef.current.yaw += 0.0065;
      }

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const W = rect.width;
      const H = rect.height;

      const bgGrad = ctx.createRadialGradient(W * 0.5, H * 0.2, 20, W * 0.5, H * 0.55, Math.max(W, H) * 0.75);
      bgGrad.addColorStop(0, '#0284C7');
      bgGrad.addColorStop(0.55, '#0369A1');
      bgGrad.addColorStop(1, '#073B4C');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      const { yaw, pitch, zoom } = rotationRef.current;
      const fov = Math.min(W, H) * 0.88 * zoom;
      const camDist = 4.6;

      const project = (pt: Vec3): [number, number, number] => {
        const [rx, ry, rz] = rotatePoint(pt, yaw, pitch);
        const zCam = rz + camDist;
        const scale = fov / Math.max(0.5, zCam);
        return [W / 2 + rx * scale, H / 2 - ry * scale, zCam];
      };

      ctx.save();
      ctx.beginPath();
      for (let a = 0; a <= 64; a++) {
        const ang = (a / 64) * Math.PI * 2;
        const [px, py] = project([Math.cos(ang) * 1.9, -0.82, Math.sin(ang) * 1.9]);
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.restore();

      let faces: Face[] = [];
      if (selectedSpeciesId === 'green_turtle') {
        faces = buildTurtleFaces(elapsed, false);
      } else if (selectedSpeciesId === 'hawksbill_turtle') {
        faces = buildTurtleFaces(elapsed, true);
      } else if (selectedSpeciesId === 'stingray') {
        faces = buildStingrayFaces(elapsed);
      } else if (selectedSpeciesId === 'parrotfish') {
        faces = buildParrotfishFaces(elapsed);
      } else {
        faces = buildReefFaces(elapsed);
      }

      const floatY = Math.sin(elapsed * 1.6) * 0.07;

      const projectedFaces = faces.map(f => {
        const worldPts = f.pts.map(p => rotatePoint([p[0], p[1] + floatY, p[2]], yaw, pitch));
        const screenPts = worldPts.map(([rx, ry, rz]) => {
          const zCam = rz + camDist;
          const scale = fov / Math.max(0.5, zCam);
          return [W / 2 + rx * scale, H / 2 - ry * scale, zCam] as [number, number, number];
        });
        const avgZ = screenPts.reduce((acc, p) => acc + p[2], 0) / screenPts.length;
        const v1 = sub(worldPts[1], worldPts[0]);
        const v2 = sub(worldPts[2], worldPts[0]);
        const n = normalize(cross(v1, v2));
        const diffuse = Math.max(0, n[0] * lightDir[0] + n[1] * lightDir[1] + n[2] * lightDir[2]);
        const lightFactor = 0.52 + diffuse * 0.58;
        const specFactor = f.shininess ? Math.pow(diffuse, 8) * f.shininess : 0;

        return {
          screenPts,
          avgZ,
          fill: shadeColor(f.fill, lightFactor, specFactor),
          stroke: f.stroke,
          strokeWidth: f.strokeWidth || 0.5,
        };
      });

      projectedFaces.sort((a, b) => b.avgZ - a.avgZ);

      for (const pf of projectedFaces) {
        ctx.beginPath();
        pf.screenPts.forEach(([x, y], idx) => {
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = pf.fill;
        ctx.fill();
        if (pf.stroke) {
          ctx.strokeStyle = pf.stroke;
          ctx.lineWidth = pf.strokeWidth;
          ctx.stroke();
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedSpeciesId, viewMode]);

  // Pointer drag handlers for 360 mesh mode
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    rotationRef.current.yaw += dx * 0.01;
    rotationRef.current.pitch = Math.max(-1.1, Math.min(1.1, rotationRef.current.pitch + dy * 0.01));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Pointer drag handlers for Photorealistic 3D Diorama Mode
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
      {/* Top Bar: Title & Species Selector Tabs */}
      <div className="p-6 sm:p-8 border-b border-lagon-border bg-gradient-to-r from-lagon-bg/60 via-white to-sand-light/40 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-action">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Observatoire Sous-Marin 3D Interactif</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-deep">
              Explorez les tortues et espèces marines en 3D rotative
            </h2>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-lagon-bg border border-lagon-border self-start">
            <button
              type="button"
              onClick={() => setViewMode('diorama')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'diorama' ? 'bg-deep text-white shadow-2xs' : 'text-ink-muted hover:text-deep'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Diorama 3D Photoréaliste</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('360')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === '360' ? 'bg-deep text-white shadow-2xs' : 'text-ink-muted hover:text-deep'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Maillage 3D 360°</span>
            </button>
          </div>
        </div>

        {/* 5 Species Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {MARINE_SPECIES_3D.map(sp => {
            const isSelected = sp.id === currentSpecies.id;
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => onSelectSpecies(sp.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-deep text-white border-deep shadow-soft scale-[1.01]'
                    : 'bg-white hover:bg-lagon-bg/60 border-lagon-border text-deep'
                }`}
              >
                <span className="text-2xl shrink-0">{sp.icon}</span>
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-deep'}`}>
                    {sp.name}
                  </div>
                  <div className={`text-[10px] italic truncate ${isSelected ? 'text-sky-200' : 'text-ink-muted'}`}>
                    {sp.creoleName}
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
        <div className="lg:col-span-7 relative min-h-[390px] sm:min-h-[450px] bg-[#042430] flex items-center justify-center overflow-hidden select-none">
          {viewMode === 'diorama' ? (
            <div
              onPointerDown={handleDioramaPointerDown}
              onPointerMove={handleDioramaPointerMove}
              onPointerUp={handleDioramaPointerUp}
              style={{ perspective: '1100px' }}
              className="relative w-full h-full min-h-[390px] sm:min-h-[450px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none p-6"
            >
              {/* Ambient glowing turquoise halo behind the 3D model */}
              <div
                className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-sky-400/20 blur-3xl pointer-events-none transition-transform duration-300"
                style={{
                  transform: `translate3d(${dioramaRot.rotY * -0.6}px, ${dioramaRot.rotX * 0.6}px, 0)`,
                }}
              />

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
                  <span>Glissez pour orienter en 3D • Cliquez sur les points ① ② ③</span>
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
          ) : (
            /* 360° PROCEDURAL 3D MESH VIEW */
            <>
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="w-full h-full min-h-[390px] sm:min-h-[450px] cursor-grab active:cursor-grabbing touch-none"
              />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="px-3.5 py-1.5 rounded-full bg-deep/75 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-2">
                  <RotateCw className="w-3.5 h-3.5 text-sky-300 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Rotation 360° libre (Dessus, Dessous, Profil)</span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAutoRotate(!autoRotate)}
                    className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{autoRotate ? 'Pause' : 'Rotation auto'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetCamera}
                    className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recentrer</span>
                  </button>
                </div>
              </div>
            </>
          )}
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
                <span className="text-[10px] uppercase tracking-wider text-ink-muted block">Spots en Martinique</span>
                <strong className="text-deep">{currentSpecies.spots}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-sand-light/70 border border-sand-border">
                <span className="text-[10px] uppercase tracking-wider text-ink-muted block">Meilleur horaire</span>
                <strong className="text-action">{currentSpecies.bestTime}</strong>
              </div>
            </div>

            {/* Interactive Anatomical Points */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-deep block">
                Points d&apos;observation sur le modèle 3D :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentSpecies.hotspots.map((h, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveHotspot(idx);
                      if (viewMode === 'diorama') {
                        const targetRotY = (50 - h.x) * 0.45;
                        const targetRotX = (h.y - 40) * 0.35;
                        setDioramaRot({ rotX: targetRotX, rotY: targetRotY, scale: 1.08 });
                      } else {
                        if (idx === 0) rotationRef.current = { yaw: -1.2, pitch: 0.2, zoom: 1.15 };
                        if (idx === 1) rotationRef.current = { yaw: -0.3, pitch: 0.75, zoom: 1.1 };
                        if (idx === 2) rotationRef.current = { yaw: -0.7, pitch: 0.15, zoom: 1.15 };
                      }
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
