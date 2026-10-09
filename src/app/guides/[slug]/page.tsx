import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { INITIAL_BLOG_POSTS, INITIAL_PLACES } from '@/data/mockData';
import GuideDetailContainer from '@/components/pages/GuideDetailContainer';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return INITIAL_BLOG_POSTS.map(post => ({
    slug: post.slug || post.id,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = INITIAL_BLOG_POSTS.find(p => p.slug === params.slug || p.id === params.slug);

  if (!post) {
    return {
      title: 'Guide introuvable — Martinique Explorer',
    };
  }

  return {
    title: `${post.title} | Martinique Explorer`,
    description: post.summary,
    keywords: `${post.category}, guide Martinique, voyage Martinique, conseils locaux, randonnée, snorkeling`,
    openGraph: {
      title: `${post.title} — Guide Martinique Explorer`,
      description: post.summary,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
    },
  };
}

export default function GuideServerPage({ params }: PageProps) {
  const post = INITIAL_BLOG_POSTS.find(p => p.slug === params.slug || p.id === params.slug);

  if (!post) {
    notFound();
  }

  return <GuideDetailContainer post={post} places={INITIAL_PLACES} />;
}
