import type { Metadata } from 'next';
import CartePageContainer from '@/components/pages/CartePageContainer';

export const metadata: Metadata = {
  title: 'Carte Interactive de la Martinique — Plages, Hôtels, Restaurants & Spots Secrets | Martinique Explorer',
  description: 'Découvrez la Martinique sur notre carte interactive : plages de sable blanc, sentiers de randonnée, spots de snorkeling avec tortues, restaurants créoles et trésors cachés géolocalisés avec itinéraires Google Maps.',
  keywords: 'carte Martinique, carte interactive Martinique, plages Martinique carte, randonnées Martinique, restaurants Martinique, spots secrets Martinique, carte touristique Madinina',
  openGraph: {
    title: 'Carte Interactive Martinique Explorer — Explorez Madinina en plein écran',
    description: 'Explorez librement les 10 catégories de lieux de la Martinique avec filtres instantanés, géolocalisation GPS et itinéraires recommandés.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Carte interactive de la Martinique',
      },
    ],
    type: 'website',
  },
};

export default function CartePage() {
  return <CartePageContainer />;
}
