'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import InteractiveMartiniqueMap from '@/components/map/InteractiveMartiniqueMap';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { PlaceItem } from '@/types';
import { Compass, Sparkles, Navigation, Layers, ShieldCheck } from 'lucide-react';

export default function CartePageContainer() {
  const router = useRouter();
  const { places, alerts, selectedCategory } = useApp();

  const handleSelectPlace = (place: PlaceItem) => {
    router.push(`/lieux/${place.slug || place.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-lagon-bg text-ink">
      {/* 1. Header Navigation */}
      <Navbar
        activeSection="map"
        setActiveSection={(sec) => {
          if (sec === 'home') router.push('/');
          else if (sec === 'map') {
            // Already on map
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            router.push(`/#${sec}`);
          }
        }}
      />

      {/* 2. Main Map Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col">
        {/* Clean, Elegant Header */}
        <div className="mb-4 text-left">
          <h1 className="text-2xl sm:text-3xl font-semibold text-deep tracking-tight">
            Carte Interactive de la Martinique
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mt-1">
            Naviguez sur la carte à gauche et consultez les détails en temps réel sur le panneau de droite.
          </p>
        </div>

        {/* 3. Split-screen (Carte 3/5 à gauche, Infos 2/5 à droite) */}
        <div className="w-full flex-1">
          <InteractiveMartiniqueMap
            places={places}
            alerts={alerts}
            onSelectPlace={handleSelectPlace}
            selectedCategory={selectedCategory}
            fullscreenMode={true}
          />
        </div>
      </main>

      {/* 4. Footer */}
      <Footer
        onNavigate={(sec) => {
          if (sec === 'home') router.push('/');
          else if (sec === 'map') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            router.push(`/#${sec}`);
          }
        }}
      />
    </div>
  );
}
