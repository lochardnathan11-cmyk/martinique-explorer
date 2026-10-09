'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RealTimeConditionsBar from '@/components/weather/RealTimeConditionsBar';
import SmartSearchBar from '@/components/search/SmartSearchBar';
import InteractiveMartiniqueMap from '@/components/map/InteractiveMartiniqueMap';
import PlaceCard from '@/components/places/PlaceCard';
import SocialFeed from '@/components/social/SocialFeed';
import ForumSection from '@/components/forum/ForumSection';
import BlogSection from '@/components/blog/BlogSection';
import AdBanner from '@/components/layout/AdBanner';
import AdminDashboard from '@/components/admin/AdminDashboard';
import DetailModal from '@/components/modals/DetailModal';
import AlertReportModal from '@/components/modals/AlertReportModal';
import AIAssistantModal from '@/components/ai/AIAssistantModal';
import GamificationModal from '@/components/badges/GamificationModal';
import AuthModal from '@/components/modals/AuthModal';
import BeachesView from '@/components/pages/BeachesView';
import SnorkelingView from '@/components/pages/SnorkelingView';
import ActivitiesView from '@/components/pages/ActivitiesView';
import CommunityView from '@/components/pages/CommunityView';
import PlaceDetailView from '@/components/pages/PlaceDetailView';
import ArticleDetailView from '@/components/pages/ArticleDetailView';
import BlogView from '@/components/pages/BlogView';
import { PlaceItem, BlogPost } from '@/types';
import { ArrowDown, Compass } from 'lucide-react';

export default function HomePage() {
  const {
    places,
    alerts,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    activeModal,
    openModal,
    closeModal,
  } = useApp();

  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [previousSection, setPreviousSection] = useState<string>('home');

  // Seamless full-page navigation replacing modals
  const handleOpenPlace = (place: PlaceItem) => {
    setPreviousSection(activeSection === 'place_detail' ? 'home' : activeSection);
    setSelectedPlace(place);
    setActiveSection('place_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenArticle = (post: BlogPost) => {
    setPreviousSection(activeSection === 'article_detail' ? 'home' : activeSection);
    setSelectedArticle(post);
    setActiveSection('article_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Intercept any detail modal calls from elsewhere and divert to full page
  React.useEffect(() => {
    if (activeModal.type === 'detail' && activeModal.data) {
      handleOpenPlace(activeModal.data as PlaceItem);
      closeModal();
    }
  }, [activeModal]);

  // Filtered places for homepage
  const filteredPlaces = places.filter(place => {
    if (selectedCategory && place.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = place.name.toLowerCase().includes(q);
      const matchDesc = place.description.toLowerCase().includes(q);
      const matchCommune = place.commune.toLowerCase().includes(q);
      const matchTags = place.tags?.some(tag => tag.toLowerCase().includes(q));
      const matchSubCat = place.subCategory?.toLowerCase().includes(q);
      const isTurtle = q.includes('tortue') && (place.id === 'anse-dufour' || place.observableFauna?.some(f => f.toLowerCase().includes('tortue')));
      const isCalm = q.includes('calme') && (place.crowdLevel === 'Faible' || place.crowdLevel === 'Modérée');
      const isSargassum = q.includes('sargasse') && (place.realTime?.sargassum === 'none');

      return matchName || matchDesc || matchCommune || matchTags || matchSubCat || isTurtle || isCalm || isSargassum;
    }
    return true;
  });

  const featuredSpot = places.find(p => p.id === 'anse-dufour') || places[0];

  const handleScrollToDirectory = () => {
    const el = document.getElementById('decouverte');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-lagon-bg text-ink selection:bg-lagon-light selection:text-deep">
      {/* 1. Primary Navigation */}
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Container */}
      <main className="flex-1">
        {/* DEDICATED SECTIONS */}
        {activeSection === 'beaches' ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <BeachesView places={places} onOpenMap={() => setActiveSection('map')} />
          </div>
        ) : activeSection === 'snorkeling' ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <SnorkelingView places={places} onOpenMap={() => setActiveSection('map')} />
          </div>
        ) : activeSection === 'activities' ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <ActivitiesView places={places} onOpenMap={() => setActiveSection('map')} />
          </div>
        ) : activeSection === 'admin' ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <AdminDashboard />
          </div>

        ) : activeSection === 'community' ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <CommunityView />
          </div>
        ) : activeSection === 'blog' ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <BlogView
              onOpenArticle={handleOpenArticle}
              onNavigateHome={() => {
                setActiveSection('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        ) : activeSection === 'place_detail' && selectedPlace ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <PlaceDetailView
              place={selectedPlace}
              places={places}
              onBack={() => {
                setActiveSection(previousSection);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectPlace={handleOpenPlace}
              onNavigateHome={() => {
                setActiveSection('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        ) : activeSection === 'article_detail' && selectedArticle ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <ArticleDetailView
              post={selectedArticle}
              places={places}
              onBack={() => {
                setActiveSection(previousSection);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenPlace={handleOpenPlace}
              onNavigateHome={() => {
                setActiveSection('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        ) : activeSection === 'forum' ? (
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <ForumSection />
          </div>
        ) : activeSection === 'map' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
            <InteractiveMartiniqueMap
              places={places}
              alerts={alerts}
              onSelectPlace={handleOpenPlace}
              selectedCategory={selectedCategory}
            />
          </div>
        ) : (
          /* ========================================================
             HOME EXPERIENCE: IMMERSIVE, WARM, AIRY, PREMIUM
             ======================================================== */
          <div className="space-y-24 sm:space-y-32">
            {/* 1. HERO SECTION (Left-aligned, immersive, generous desktop height) */}
            <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-start text-white overflow-hidden">
              {/* Background Photography with Calm Dark Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
                  alt="Plage de sable blanc et eau turquoise en Martinique"
                  className="w-full h-full object-cover object-center scale-100"
                />
                {/* Subtle dark overlay ensuring strict contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-deep/80 via-deep/50 to-deep/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-deep/30" />
              </div>

              {/* Hero Left-aligned Content */}
              <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-20 w-full">
                <div className="max-w-2xl text-left space-y-6">
                  {/* Subtle Tag */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs text-white tracking-wide font-normal">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral" />
                    <span>Guide & communauté de Madinina</span>
                  </div>

                  {/* Expressive Title */}
                  <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white leading-[1.15]">
                    Voyagez au rythme <br className="hidden sm:inline" />
                    de la Martinique.
                  </h1>

                  {/* Evocative Subtitle with Generous Line Height */}
                  <p className="text-base sm:text-lg text-white/85 font-normal leading-relaxed max-w-xl">
                    Les anses calmes du Sud, les herbiers marins où nagent les tortues et les conseils d&apos;habitants partagés avec authenticité.
                  </p>

                  {/* Clean Search Input */}
                  <div className="pt-2">
                    <SmartSearchBar onSearchSubmit={handleScrollToDirectory} />
                  </div>

                  {/* Single Primary Action */}
                  <div className="pt-4 flex flex-wrap items-center gap-5">
                    <button
                      type="button"
                      onClick={() => setActiveSection('map')}
                      className="px-7 py-3.5 rounded-2xl bg-action hover:bg-action-hover text-white text-sm font-medium transition-all duration-300 shadow-soft hover:shadow-card flex items-center gap-2"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Explorer la carte interactive</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Discreet Bottom Scroll Cue */}
              <button
                type="button"
                onClick={handleScrollToDirectory}
                aria-label="Faire défiler vers les lieux à découvrir"
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors p-2"
              >
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </button>
            </section>

            {/* 2. REAL-TIME RIBBON (Serene, non-cluttered) */}
            <div className="-mt-12 sm:-mt-16 relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="rounded-3xl overflow-hidden shadow-soft">
                <RealTimeConditionsBar />
              </div>
            </div>

            {/* 3. ASYMMETRIC EDITORIAL SPOTLIGHT */}
            <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                {/* Left: Editorial Statement */}
                <div className="lg:col-span-5 space-y-6 text-left">
                  <span className="text-xs font-semibold tracking-wider uppercase text-action">
                    L&apos;esprit du voyage
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-semibold text-deep tracking-tight leading-tight">
                    Une île préservée, entre mer des Caraïbes et forêt tropicale.
                  </h2>
                  <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                    Loin des circuits standardisés, Martinique Explorer vous invite à découvrir des anses sauvages au lever du jour, à goûter aux langoustes grillées les pieds dans le sable et à observer la faune marine avec respect.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenPlace(featuredSpot)}
                      className="text-sm font-medium text-action hover:text-action-hover inline-flex items-center gap-1.5 transition-colors group cursor-pointer"
                    >
                      <span>Découvrir l&apos;anse emblématique des tortues</span>
                      <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                    </button>
                  </div>
                </div>

                {/* Right: Asymmetric Large Featured Card */}
                <div className="lg:col-span-7">
                  <div
                    onClick={() => handleOpenPlace(featuredSpot)}
                    className="group relative rounded-4xl overflow-hidden border border-lagon-border bg-white shadow-soft hover:shadow-card transition-all duration-500 cursor-pointer"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <img
                        src={featuredSpot.photos[0]}
                        alt={featuredSpot.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep/75 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 text-left">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
                          Spot incontournable • {featuredSpot.commune}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-semibold text-white">
                          {featuredSpot.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/80 line-clamp-2 max-w-lg">
                          {featuredSpot.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. CURATED PLACES DIRECTORY */}
            <section id="decouverte" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2 text-left max-w-xl">
                  <span className="text-xs font-semibold tracking-wider uppercase text-action">
                    Sélection d&apos;adresses
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-semibold text-deep tracking-tight">
                    Explorer par envie
                  </h2>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    Des plages abritées aux tables gourmandes en bord de mer, chaque lieu est sélectionné avec soin.
                  </p>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: null, label: 'Tous les lieux' },
                    { id: 'beach', label: 'Plages' },
                    { id: 'snorkeling', label: 'Snorkeling' },
                    { id: 'activity', label: 'Expériences' },
                    { id: 'restaurant', label: 'Gastronomie' },
                    { id: 'accommodation', label: 'Hébergements' },
                  ].map(cat => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id || 'all'}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id as any)}
                        className={`px-4 py-2 rounded-2xl text-xs font-medium transition-all duration-200 ${
                          isSelected
                            ? 'bg-deep text-white font-semibold shadow-soft'
                            : 'bg-white text-ink border border-lagon-border hover:bg-lagon-bg'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid of Places */}
              {filteredPlaces.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                  {filteredPlaces.map(place => (
                    <PlaceCard key={place.id} place={place} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-white rounded-4xl border border-lagon-border p-8 space-y-3">
                  <p className="text-base text-deep font-semibold">Aucun lieu ne correspond à ces critères</p>
                  <p className="text-xs text-ink-muted max-w-md mx-auto">
                    Essayez de réinitialiser la recherche ou de sélectionner une autre catégorie.
                  </p>
                </div>
              )}
            </section>

            {/* 5. INTERACTIVE MAP SECTION (Split-Screen: Carte 3/5, Infos 2/5) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <InteractiveMartiniqueMap
                places={places}
                alerts={alerts}
                onSelectPlace={handleOpenPlace}
                selectedCategory={selectedCategory}
              />
            </div>

            {/* 7. EDITORIAL BLOG / GUIDES */}
            <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <BlogSection onOpenArticle={handleOpenArticle} />
            </section>

            {/* 8. PARTNER SERVICES */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <AdBanner />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={sec => {
        setActiveSection(sec);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Modals Container (DetailModal removed in favor of dedicated full page PlaceDetailView) */}
      {activeModal.type === 'alert_report' && (
        <AlertReportModal />
      )}
      {activeModal.type === 'ai_assistant' && (
        <AIAssistantModal initialQuery={activeModal.data?.query} />
      )}
      {activeModal.type === 'badges' && (
        <GamificationModal />
      )}
      {activeModal.type === 'auth' && (
        <AuthModal onAdminNavigate={() => setActiveSection('admin')} />
      )}
    </div>
  );
}
