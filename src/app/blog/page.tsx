import type { Metadata } from 'next';
import BlogPageContainer from '@/components/pages/BlogPageContainer';

export const metadata: Metadata = {
  title: 'Actualités & Blog Martinique — Guides, Fêtes et Météo en direct | Martinique Explorer',
  description: 'Retrouvez toutes les actualités de la Martinique : Tour des Yoles 2026, saison des tortues marines, bilan sargasses, carnaval et guides de voyage avec temps de lecture estimé.',
  keywords: 'actualités Martinique, blog Martinique, Tour des Yoles 2026, sargasses direct, carnaval Martinique, tortues marines, guides voyage',
  openGraph: {
    title: 'Actualités & Carnets de Martinique | Martinique Explorer',
    description: 'Toutes les actualités locales, saisons marines, fêtes et guides détaillés avec temps de lecture.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Actualités Martinique Explorer',
      },
    ],
    type: 'website',
  },
};

export default function BlogServerPage() {
  return <BlogPageContainer />;
}
