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

  return (
    <div className="min-h-screen flex flex-col bg-lagon-bg text-ink">
      <Navbar
        activeSection="beaches"
        setActiveSection={(sec) => {
          if (sec === 'home') router.push('/');
          else router.push(`/#${sec}`);
        }}
      />
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20 w-full">
        <PlaceDetailView
          place={place}
          places={allPlaces}
          onBack={() => router.push('/')}
          onSelectPlace={(p) => router.push(`/lieux/${p.id}`)}
          onNavigateHome={() => router.push('/')}
        />
      </main>
      <Footer
        onNavigate={(sec) => {
          if (sec === 'home') router.push('/');
          else router.push(`/#${sec}`);
        }}
      />
    </div>
  );
}
