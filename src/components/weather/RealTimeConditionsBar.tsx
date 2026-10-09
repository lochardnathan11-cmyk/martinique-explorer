'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Plus, 
  CheckCircle2
} from 'lucide-react';

interface WeatherCity {
  id: string;
  name: string;
  type: 'plage' | 'ville' | 'spot';
  weather: 'soleil' | 'eclaircies' | 'nuageux' | 'averse';
  weatherLabel: string;
  tempAir: number;
  tempWater: number;
  seaState: string;
  sargassum: 'none' | 'low' | 'moderate';
  wind: string;
}

const MARTINIQUE_WEATHER_DATA: WeatherCity[] = [
  {
    id: 'salines',
    name: 'Plage des Salines (Ste-Anne)',
    type: 'plage',
    weather: 'soleil',
    weatherLabel: 'Grand soleil',
    tempAir: 30,
    tempWater: 28,
    seaState: 'Mer calme',
    sargassum: 'none',
    wind: '12 km/h'
  },
  {
    id: 'anse-dufour',
    name: 'Anse Dufour (Anses d\'Arlet)',
    type: 'plage',
    weather: 'soleil',
    weatherLabel: 'Ensoleillé & Limpide',
    tempAir: 29,
    tempWater: 28,
    seaState: 'Eau cristalline',
    sargassum: 'none',
    wind: '10 km/h'
  },
  {
    id: 'diamant',
    name: 'Le Diamant (Rocher)',
    type: 'plage',
    weather: 'soleil',
    weatherLabel: 'Ciel bleu',
    tempAir: 29,
    tempWater: 27,
    seaState: 'Légers rouleaux',
    sargassum: 'none',
    wind: '16 km/h'
  },
  {
    id: 'trois-ilets',
    name: 'Pointe du Bout (Trois-Îlets)',
    type: 'ville',
    weather: 'soleil',
    weatherLabel: 'Grand soleil',
    tempAir: 30,
    tempWater: 29,
    seaState: 'Mer d\'huile',
    sargassum: 'none',
    wind: '11 km/h'
  },
  {
    id: 'anse-noire',
    name: 'Anse Noire (Sable volcanique)',
    type: 'spot',
    weather: 'eclaircies',
    weatherLabel: 'Éclaircies douces',
    tempAir: 28,
    tempWater: 28,
    seaState: 'Idéal snorkeling',
    sargassum: 'none',
    wind: '9 km/h'
  },
  {
    id: 'sainte-luce',
    name: 'Sainte-Luce (Gros Raisin)',
    type: 'plage',
    weather: 'soleil',
    weatherLabel: 'Ensoleillé',
    tempAir: 30,
    tempWater: 28,
    seaState: 'Baignade facile',
    sargassum: 'none',
    wind: '13 km/h'
  },
  {
    id: 'tartane',
    name: 'Tartane (Presqu\'île Caravelle)',
    type: 'plage',
    weather: 'eclaircies',
    weatherLabel: 'Belles éclaircies',
    tempAir: 28,
    tempWater: 27,
    seaState: 'Vagues de surf',
    sargassum: 'low',
    wind: '18 km/h'
  },
  {
    id: 'fdf',
    name: 'Fort-de-France (Baie des Flamands)',
    type: 'ville',
    weather: 'soleil',
    weatherLabel: 'Ensoleillé',
    tempAir: 29,
    tempWater: 28,
    seaState: 'Alizés réguliers',
    sargassum: 'none',
    wind: '14 km/h'
  },
  {
    id: 'pointe-faula',
    name: 'Pointe Faula (Le Vauclin)',
    type: 'plage',
    weather: 'soleil',
    weatherLabel: 'Grand soleil',
    tempAir: 29,
    tempWater: 29,
    seaState: 'Fonds blancs tièdes',
    sargassum: 'low',
    wind: '17 km/h'
  },
  {
    id: 'francois',
    name: 'Le François (Baignoire Joséphine)',
    type: 'spot',
    weather: 'soleil',
    weatherLabel: 'Soleil radieux',
    tempAir: 29,
    tempWater: 29,
    seaState: 'Lagons turquoise',
    sargassum: 'none',
    wind: '15 km/h'
  },
  {
    id: 'saint-pierre',
    name: 'Saint-Pierre (Pied de la Pelée)',
    type: 'ville',
    weather: 'eclaircies',
    weatherLabel: 'Sommet dégagé',
    tempAir: 27,
    tempWater: 27,
    seaState: 'Mer calme',
    sargassum: 'none',
    wind: '11 km/h'
  },
  {
    id: 'grand-riviere',
    name: 'Grand\'Rivière (Nord Sauvage)',
    type: 'ville',
    weather: 'averse',
    weatherLabel: 'Brume tropicale',
    tempAir: 26,
    tempWater: 26,
    seaState: 'Houle atlantique',
    sargassum: 'none',
    wind: '20 km/h'
  }
];

export default function RealTimeConditionsBar() {
  const { openModal } = useApp();

  const getWeatherIcon = (w: WeatherCity['weather']) => {
    switch (w) {
      case 'soleil':
        return <Sun className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'eclaircies':
        return <CloudSun className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'nuageux':
        return <Cloud className="w-4 h-4 text-slate-400 shrink-0" />;
      case 'averse':
        return <CloudRain className="w-4 h-4 text-action shrink-0" />;
    }
  };

  // Duplicate dataset to enable continuous seamless 360-degree marquee loop
  const marqueeItems = [...MARTINIQUE_WEATHER_DATA, ...MARTINIQUE_WEATHER_DATA];

  return (
    <div className="bg-white/95 backdrop-blur-md border border-lagon-border rounded-3xl p-4 sm:p-5 shadow-card text-left space-y-3.5 overflow-hidden">
      {/* 1. Header Bar: Title, Live Status Indicator & Quick CTA */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-bold tracking-wider uppercase shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            En direct
          </span>
          <h3 className="font-bold text-deep text-sm sm:text-base tracking-tight">
            Conditions de baignade & Météo des plages
          </h3>
        </div>

        {/* Citizen Report button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openModal('alert_report')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-action hover:bg-action-hover text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Signaler l&apos;état d&apos;une plage</span>
            <span className="sm:hidden">Signaler</span>
          </button>
        </div>
      </div>

      {/* 2. Seamless Infinite Continuous Marquee Track */}
      <div className="relative overflow-hidden w-full py-1">
        {/* Soft edge blur masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        <div className="animate-marquee-infinite flex items-center gap-3.5 pl-2">
          {marqueeItems.map((spot, index) => (
            <div
              key={`${spot.id}-${index}`}
              className="flex-shrink-0 w-64 sm:w-72 p-3.5 sm:p-4 rounded-2xl bg-lagon-bg/50 hover:bg-white border border-lagon-border hover:border-action/40 transition-all shadow-xs hover:shadow-card cursor-pointer group text-left space-y-2.5 select-none"
            >
              {/* Top row: City / Beach Name + Weather Icon */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-action uppercase tracking-wider block">
                    {spot.type === 'plage' ? 'Plage' : spot.type === 'spot' ? 'Spot marin' : 'Commune'}
                  </span>
                  <h4 className="font-semibold text-deep text-xs sm:text-sm truncate group-hover:text-action transition-colors">
                    {spot.name}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-lagon-border shadow-xs shrink-0">
                  {getWeatherIcon(spot.weather)}
                  <span className="text-xs font-bold text-deep">{spot.tempAir}°C</span>
                </div>
              </div>

              {/* Middle row: Weather Summary & Water Temp */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-ink-muted">
                  <Thermometer className="w-3.5 h-3.5 text-action shrink-0" />
                  <span>Eau : <strong className="text-deep font-semibold">{spot.tempWater}°C</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-ink-muted">
                  <Wind className="w-3.5 h-3.5 text-action shrink-0" />
                  <span className="truncate">{spot.wind}</span>
                </div>
              </div>

              {/* Bottom row: Sargassum status + Sea state */}
              <div className="pt-2 border-t border-lagon-border/70 flex items-center justify-between text-[11px]">
                <span className="text-ink-muted truncate max-w-[120px]">
                  {spot.seaState}
                </span>

                {spot.sargassum === 'none' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Zéro sargasse
                  </span>
                ) : spot.sargassum === 'low' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[10px]">
                    Faible présence
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold text-[10px]">
                    Cordon signalé
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
