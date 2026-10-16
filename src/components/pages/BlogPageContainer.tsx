'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BlogView from '@/components/pages/BlogView';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/types';

export default function BlogPageContainer() {
  const router = useRouter();

  const handleOpenArticle = (post: BlogPost) => {
    router.push(`/guides/${post.slug || post.id}`);
  };

  const handleNav = (sec: string) => {
    if (sec === 'home') router.push('/');
    else router.push(`/?page=${encodeURIComponent(sec)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-lagon-bg text-ink">
      <Navbar activeSection="blog" setActiveSection={handleNav} />
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20 w-full">
        <BlogView
          onOpenArticle={handleOpenArticle}
          onNavigateHome={() => router.push('/?page=map')}
        />
      </main>
      <Footer onNavigate={handleNav} />
    </div>
  );
}
