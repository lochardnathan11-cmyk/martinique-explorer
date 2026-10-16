'use client';

import React from 'react';
import { PlaceItem } from '@/types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PlaceDetailView from '@/components/pages/PlaceDetailView';
import { useRouter } from 'next/navigation';

interface PlaceDetailContainerProps {
  place: PlaceItem;
  allPlaces: PlaceItem[];
}

export default function PlaceDetailContainer({ place, allPlaces }: PlaceDetailContainerProps) {
  const router = useRouter();

  const handleNav = (sec: string) => {
    if (sec === 'home') router.push('/');
    else router.push(`/?page=${encodeURIComponent(sec)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-lagon-bg text-ink">
      <Navbar activeSection="beaches" setActiveSection={handleNav} />
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20 w-full">
        <PlaceDetailView
          place={place}
          places={allPlaces}
          onBack={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) {
              router.back();
            } else {
              router.push('/');
            }
          }}
          onSelectPlace={(p) => router.push(`/lieux/${p.id}`)}
          onNavigateHome={() => router.push('/')}
        />
      </main>
      <Footer onNavigate={handleNav} />
    </div>
  );
}
