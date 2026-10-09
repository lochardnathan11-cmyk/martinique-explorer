'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useRouter } from 'next/navigation';

export default function LegalPageLayout({ children, title }: { children: React.ReactNode, title: string }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-ink selection:bg-lagon-light selection:text-deep">
      <Navbar
        activeSection="home"
        setActiveSection={(sec) => {
          if (sec === 'home') router.push('/');
          else router.push(`/#${sec}`);
        }}
      />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 pt-36 pb-20 w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-deep mb-8">{title}</h1>
        <div className="space-y-6 text-sm md:text-base text-ink-muted leading-relaxed">
          {children}
        </div>
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
