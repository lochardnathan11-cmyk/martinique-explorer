import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { INITIAL_PLACES } from '@/data/mockData';
import PlaceDetailContainer from '@/components/pages/PlaceDetailContainer';

interface PageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  const ids: { id: string }[] = [];
  INITIAL_PLACES.forEach(place => {
    ids.push({ id: place.id });
    if (place.slug && place.slug !== place.id) {
      ids.push({ id: place.slug });
    }
  });
  return ids;
}

export function generateMetadata({ params }: PageProps): Metadata {
  const place = INITIAL_PLACES.find(p => p.id === params.id || p.slug === params.id);

  if (!place) {
    return {
      title: 'Lieu introuvable — Martinique Explorer',
    };
  }

  const categoryLabel = place.category === 'beach'
    ? 'Plage'
    : place.category === 'snorkeling'
    ? 'Spot Snorkeling'
    : place.category === 'restaurant'
    ? 'Restaurant créole'
    : place.category === 'hiking'
    ? 'Randonnée'
    : place.category === 'hidden_gem'
    ? 'Spot Secret'
    : 'Activité';

  return {
    title: `${place.name} (${place.commune}) — ${categoryLabel} en Martinique | Martinique Explorer`,
    description: `${place.description} Retrouvez la météo en direct, présence de sargasses, avis voyageurs et itinéraire GPS.`,
    keywords: `${place.name}, ${place.commune}, plage Martinique, snorkeling Martinique, sargasses direct, guide voyage Martinique`,
    openGraph: {
      title: `${place.name} — ${categoryLabel} | Martinique Explorer`,
      description: place.description,
      images: [
        {
          url: place.photos[0],
          width: 1200,
          height: 630,
          alt: place.name,
        },
      ],
      type: 'article',
    },
  };
}

export default function PlaceServerPage({ params }: PageProps) {
  const place = INITIAL_PLACES.find(p => p.id === params.id || p.slug === params.id);

  if (!place) {
    notFound();
  }

  return <PlaceDetailContainer place={place} allPlaces={INITIAL_PLACES} />;
}
