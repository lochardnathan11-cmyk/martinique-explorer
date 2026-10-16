'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RealTimeConditionsBar from '@/components/weather/RealTimeConditionsBar';
import SmartSearchBar from '@/components/search/SmartSearchBar';
import InteractiveMartiniqueMap from '@/components/map/InteractiveMartiniqueMap';
import PlaceCard from '@/components/places/PlaceCard';
import ForumSection from '@/components/forum/ForumSection';
import BlogSection from '@/components/blog/BlogSection';
import AdBanner from '@/components/layout/AdBanner';
import AdminDashboard from '@/components/admin/AdminDashboard';
import BeachesView from '@/components/pages/BeachesView';
import SnorkelingView from '@/components/pages/SnorkelingView';
import ActivitiesView from '@/components/pages/ActivitiesView';
import CommunityView from '@/components/pages/CommunityView';
import PlaceDetailView from '@/components/pages/PlaceDetailView';
import ArticleDetailView from '@/components/pages/ArticleDetailView';
import BlogView from '@/components/pages/BlogView';
import { INITIAL_BLOG_POSTS, INITIAL_PLACES } from '@/data/mockData';
import { PlaceItem, BlogPost } from '@/types';
import { ArrowDown, Compass } from 'lucide-react';

interface HistoryNavState {
  section: string;
  placeId?: string | null;
  articleId?: string | null;
  fromInApp?: boolean;
}

export default function HomePage() {
  const {
    places,
    alerts,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    activeModal,
    closeModal,
  } = useApp();

  const [activeSection, setActiveSectionState] = useState<string>('home');
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [previousSection, setPreviousSection] = useState<string>('home');
  const inAppHistoryDepthRef = useRef<number>(0);
  const placesRef = useRef<PlaceItem[]>(places);

  useEffect(() => {
    placesRef.current = places;
  }, [places]);

  // Construire l'URL correspondant à la vue active
  const buildUrlForState = (state: HistoryNavState): string => {
    if (!state.section || state.section === 'home') {
      return '/';
    }
    if (state.section === 'place_detail' && state.placeId) {
      return `/?page=lieu&id=${encodeURIComponent(state.placeId)}`;
    }
    if (state.section === 'article_detail' && state.articleId) {
      return `/?page=article&id=${encodeURIComponent(state.articleId)}`;
    }
    return `/?page=${encodeURIComponent(state.section)}`;
  };

  // Appliquer un état de navigation sans repousser dans window.history (utilisé par popstate & init)
  const applyNavigationState = useCallback(
    (state: HistoryNavState) => {
      const sec = state.section || 'home';
      const currentPlaces = placesRef.current;
      const allKnownPlaces = currentPlaces.length > 0 ? currentPlaces : INITIAL_PLACES;

      if (sec === 'place_detail' && state.placeId) {
        const foundPlace =
          allKnownPlaces.find(
            p => p.id === state.placeId || p.slug === state.placeId
          ) || null;
        if (foundPlace) {
          setSelectedPlace(foundPlace);
          setActiveSectionState('place_detail');
          return;
        }
      }

      if (sec === 'article_detail' && state.articleId) {
        const foundArticle =
          INITIAL_BLOG_POSTS.find(
            a => a.id === state.articleId || a.slug === state.articleId
          ) || null;
        if (foundArticle) {
          setSelectedArticle(foundArticle);
          setActiveSectionState('article_detail');
          return;
        }
      }

      setActiveSectionState(sec);
      if (sec === 'home') setSelectedCategory(null);
      else if (sec === 'beaches') setSelectedCategory('beach');
      else if (sec === 'snorkeling') setSelectedCategory('snorkeling');
      else if (sec === 'activities') setSelectedCategory('activity');
    },
    [setSelectedCategory]
  );

  // Navigation vers une section principale avec enregistrement dans l'historique du navigateur
  const navigateToSection = useCallback(
    (sec: string) => {
      setPreviousSection(activeSection);
      setActiveSectionState(sec);

      if (sec === 'home') setSelectedCategory(null);
      else if (sec === 'beaches') setSelectedCategory('beach');
      else if (sec === 'snorkeling') setSelectedCategory('snorkeling');
      else if (sec === 'activities') setSelectedCategory('activity');

      if (typeof window !== 'undefined') {
        const navState: HistoryNavState = {
          section: sec,
          placeId: null,
          articleId: null,
          fromInApp: true,
        };
        const url = buildUrlForState(navState);
        window.history.pushState(navState, '', url);
        inAppHistoryDepthRef.current += 1;
      }
    },
    [activeSection, setSelectedCategory]
  );

  // Ouverture d'une fiche lieu avec enregistrement dans l'historique du navigateur
  const handleOpenPlace = useCallback(
    (place: PlaceItem) => {
      setPreviousSection(activeSection === 'place_detail' ? 'home' : activeSection);
      setSelectedPlace(place);
      setActiveSectionState('place_detail');

      if (typeof window !== 'undefined') {
        const navState: HistoryNavState = {
          section: 'place_detail',
          placeId: place.id,
          articleId: null,
          fromInApp: true,
        };
        const url = buildUrlForState(navState);
        window.history.pushState(navState, '', url);
        inAppHistoryDepthRef.current += 1;
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    },
    [activeSection]
  );

  // Ouverture d'un article avec enregistrement dans l'historique du navigateur
  const handleOpenArticle = useCallback(
    (post: BlogPost) => {
      setPreviousSection(activeSection === 'article_detail' ? 'home' : activeSection);
      setSelectedArticle(post);
      setActiveSectionState('article_detail');

      if (typeof window !== 'undefined') {
        const navState: HistoryNavState = {
          section: 'article_detail',
          placeId: null,
          articleId: post.id,
          fromInApp: true,
        };
        const url = buildUrlForState(navState);
        window.history.pushState(navState, '', url);
        inAppHistoryDepthRef.current += 1;
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    },
    [activeSection]
  );

  // Bouton "Retour" interne aux fiches : utilise l'historique navigateur si disponible
  const handleStepBack = useCallback(() => {
    if (typeof window !== 'undefined' && inAppHistoryDepthRef.current > 0) {
      window.history.back();
    } else {
      const target =
        previousSection &&
        previousSection !== 'place_detail' &&
        previousSection !== 'article_detail'
          ? previousSection
          : 'home';
      navigateToSection(target);
    }
  }, [previousSection, navigateToSection]);

  // Lecture de l'URL initiale (?page=... ou #...) et écoute du bouton Retour/Suivant du navigateur (popstate)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const parseCurrentLocation = (): HistoryNavState => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      const idParam = params.get('id');
      const hashParam = window.location.hash.replace('#', '').trim();

      if (pageParam === 'lieu' && idParam) {
        return { section: 'place_detail', placeId: idParam };
      }
      if (pageParam === 'article' && idParam) {
        return { section: 'article_detail', articleId: idParam };
      }
      if (pageParam) {
        return { section: pageParam };
      }
      if (
        hashParam &&
        ['beaches', 'snorkeling', 'activities', 'map', 'blog', 'community', 'admin', 'forum'].includes(
          hashParam
        )
      ) {
        return { section: hashParam };
      }
      return { section: 'home' };
    };

    const initialState = window.history.state?.section
      ? (window.history.state as HistoryNavState)
      : parseCurrentLocation();

    applyNavigationState(initialState);
    window.history.replaceState(initialState, '', buildUrlForState(initialState));

    const handlePopState = (event: PopStateEvent) => {
      if (inAppHistoryDepthRef.current > 0) {
        inAppHistoryDepthRef.current -= 1;
      }
      const nextState: HistoryNavState = event.state?.section
        ? (event.state as HistoryNavState)
        : parseCurrentLocation();
      applyNavigationState(nextState);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [applyNavigationState]);

  // Remonter en haut de page à chaque changement de section
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeSection, selectedPlace?.id, selectedArticle?.id]);

  // Intercepter les ouvertures de fiches depuis PlaceCard / Carte (openModal('detail', place))
  useEffect(() => {
    if (activeModal.type === 'detail' && activeModal.data) {
      handleOpenPlace(activeModal.data as PlaceItem);
      closeModal();
    }
  }, [activeModal, handleOpenPlace, closeModal]);

  // Filtrage des lieux pour la page d'accueil
  const filteredPlaces = places.filter(place => {
    if (selectedCategory) {
      if (selectedCategory === 'activity') {
        if (
          place.category !== 'activity' &&
          place.category !== 'hiking' &&
          place.category !== 'excursion'
        )
          return false;
      } else if (place.category !== selectedCategory) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = place.name.toLowerCase().includes(q);
      const matchDesc = place.description.toLowerCase().includes(q);
      const matchCommune = place.commune.toLowerCase().includes(q);
      const matchTags = place.tags?.some(tag => tag.toLowerCase().includes(q));
      const matchSubCat = place.subCategory?.toLowerCase().includes(q);
      const isTurtle =
        q.includes('tortue') &&
        (place.id === 'anse-dufour' ||
          place.observableFauna?.some(f => f.toLowerCase().includes('tortue')));
      const isCalm =
        q.includes('calme') &&
        (place.crowdLevel === 'Faible' || place.crowdLevel === 'Modérée');
      const isSargassum =
        q.includes('sargasse') && place.realTime?.sargassum === 'none';

      return (
        matchName ||
        matchDesc ||
        matchCommune ||
        matchTags ||
        matchSubCat ||
        isTurtle ||
        isCalm ||
        isSargassum
      );
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
      <Navbar activeSection={activeSection} setActiveSection={navigateToSection} />

      {/* Main Container */}
      <main className="flex-1">
        {/* DEDICATED SECTIONS */}
        {activeSection === 'beaches' ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <BeachesView places={places} onOpenMap={() => navigateToSection('map')} />
          </div>
        ) : activeSection === 'snorkeling' ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <SnorkelingView places={places} onOpenMap={() => navigateToSection('map')} />
          </div>
        ) : activeSection === 'activities' ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <ActivitiesView places={places} onOpenMap={() => navigateToSection('map')} />
          </div>
        ) : activeSection === 'admin' ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <AdminDashboard />
          </div>
        ) : activeSection === 'community' ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <CommunityView onNavigate={tab => navigateToSection(tab)} />
          </div>
        ) : activeSection === 'blog' ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <BlogView
              onOpenArticle={handleOpenArticle}
              onNavigateHome={() => navigateToSection('home')}
            />
          </div>
        ) : activeSection === 'place_detail' && selectedPlace ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <PlaceDetailView
              place={selectedPlace}
              places={places}
              onBack={handleStepBack}
              onSelectPlace={handleOpenPlace}
              onNavigateHome={() => navigateToSection('home')}
            />
          </div>
        ) : activeSection === 'article_detail' && selectedArticle ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <ArticleDetailView
              post={selectedArticle}
              places={places}
              onBack={handleStepBack}
              onOpenPlace={handleOpenPlace}
              onNavigateHome={() => navigateToSection('home')}
            />
          </div>
        ) : activeSection === 'forum' ? (
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <ForumSection />
          </div>
        ) : activeSection === 'map' ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
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
            {/* 1. HERO SECTION */}
            <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-start text-white overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
                  alt="Plage de sable blanc et eau turquoise en Martinique"
                  className="w-full h-full object-cover object-center scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-deep/80 via-deep/50 to-deep/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-deep/30" />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-20 w-full">
                <div className="max-w-2xl text-left space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs text-white tracking-wide font-normal">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral" />
                    <span>Guide & communauté de Madinina</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white leading-[1.15]">
                    Voyagez au rythme <br className="hidden sm:inline" />
                    de la Martinique.
                  </h1>

                  <p className="text-base sm:text-lg text-white/85 font-normal leading-relaxed max-w-xl">
                    Les anses calmes du Sud, les herbiers marins où nagent les tortues et les conseils d&apos;habitants partagés avec authenticité.
                  </p>

                  <div className="pt-2">
                    <SmartSearchBar onSearchSubmit={handleScrollToDirectory} />
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-5">
                    <button
                      type="button"
                      onClick={() => navigateToSection('map')}
                      className="px-7 py-3.5 rounded-2xl bg-action hover:bg-action-hover text-white text-sm font-medium transition-all duration-300 shadow-soft hover:shadow-card flex items-center gap-2"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Explorer la carte interactive</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleScrollToDirectory}
                aria-label="Faire défiler vers les lieux à découvrir"
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors p-2"
              >
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </button>
            </section>

            {/* 2. REAL-TIME RIBBON */}
            <div className="-mt-12 sm:-mt-16 relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="rounded-3xl overflow-hidden shadow-soft">
                <RealTimeConditionsBar />
              </div>
            </div>

            {/* 3. ASYMMETRIC EDITORIAL SPOTLIGHT */}
            <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
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
                    { id: 'hiking', label: 'Randonnées' },
                    { id: 'excursion', label: 'Sorties en Mer' },
                    { id: 'accommodation', label: 'Hébergements' },
                    { id: 'activity', label: 'Expériences' },
                    { id: 'restaurant', label: 'Gastronomie' },
                  ].map(cat => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id || 'all'}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id as any)}
                        className={`px-4 py-2 rounded-2xl text-xs font-medium transition-all duration-200 cursor-pointer ${
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

            {/* 5. INTERACTIVE MAP SECTION */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <Footer onNavigate={sec => navigateToSection(sec)} />
    </div>
  );
}
