'use client';

import React from 'react';
import { BlogPost, PlaceItem } from '@/types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ArticleDetailView from '@/components/pages/ArticleDetailView';
import { useRouter } from 'next/navigation';

interface GuideDetailContainerProps {
  post: BlogPost;
  places: PlaceItem[];
}

export default function GuideDetailContainer({ post, places }: GuideDetailContainerProps) {
  const router = useRouter();

  const handleNav = (sec: string) => {
    if (sec === 'home') router.push('/');
    else router.push(`/?page=${encodeURIComponent(sec)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-lagon-bg text-ink">
      <Navbar activeSection="blog" setActiveSection={handleNav} />
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20 w-full">
        <ArticleDetailView
          post={post}
          places={places}
          onBack={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) {
              router.back();
            } else {
              router.push('/?page=blog');
            }
          }}
          onOpenPlace={(p) => router.push(`/lieux/${p.id}`)}
          onNavigateHome={() => router.push('/')}
        />
      </main>
      <Footer onNavigate={handleNav} />
    </div>
  );
}
