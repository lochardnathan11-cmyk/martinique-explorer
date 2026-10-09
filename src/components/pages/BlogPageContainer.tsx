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

  return (
    <div className="min-h-screen flex flex-col bg-lagon-bg text-ink">
      <Navbar
        activeSection="blog"
        setActiveSection={(sec) => {
          if (sec === 'home') router.push('/');
          else router.push(`/#${sec}`);
        }}
      />
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20 w-full">
        <BlogView
          onOpenArticle={handleOpenArticle}
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
