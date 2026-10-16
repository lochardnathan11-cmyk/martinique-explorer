'use client';

import React, { useState, useRef } from 'react';
import { INITIAL_BLOG_POSTS } from '@/data/mockData';
import { BlogPost } from '@/types';
import {
  Clock,
  Search,
  ArrowRight,
  Compass,
  Calendar,
  MapPin,
  X,
  BookOpen,
  Sun,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface BlogViewProps {
  onOpenArticle: (post: BlogPost) => void;
  onNavigateHome: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Tous les dossiers (10)' },
  { id: 'Actualités & Événements', label: 'Actualités & Événements' },
  { id: 'Météo & Littoral', label: 'Météo & Littoral' },
  { id: 'Guide Plages', label: 'Plages & Fonds Blancs' },
  { id: 'Snorkeling & Faune', label: 'Tortues & Snorkeling' },
  { id: 'Faune & Écologie', label: 'Nature & Randonnées' },
  { id: 'Gastronomie & Patrimoine', label: 'Terroir & Rhums AOC' },
  { id: 'Vivre en Martinique', label: 'S’installer & Vivre' }
];

const ISLAND_SEASONS_CALENDAR = [
  {
    period: 'Décembre – Avril',
    title: 'Saison sèche (Carême) & Carnaval',
    badge: 'Haute saison soleil',
    description:
      'Ensoleillement maximal, alizés doux et mer calme. En février/mars, Fort-de-France vit au rythme des quatre Jours Gras du Carnaval et les distilleries AOC lancent la récolte de la canne.',
    relatedId: 'blog-7'
  },
  {
    period: 'Mars – Juillet',
    title: 'Ponte des tortues luths & Nord sauvage',
    badge: 'Nature & Faune',
    description:
      'Les tortues luths géantes viennent pondre la nuit sur les plages de sable volcanique. Période idéale pour gravir la Montagne Pelée tôt le matin et explorer les Fonds Blancs.',
    relatedId: 'blog-5'
  },
  {
    period: 'Juillet – Août',
    title: 'Tour de la Martinique des Yoles Rondes',
    badge: 'Patrimoine UNESCO',
    description:
      'Une semaine de régates spectaculaires autour de l’île sur des embarcations traditionnelles sans quille ni gouvernail, suivies par des milliers de passionnés sur chaque plage.',
    relatedId: 'blog-4'
  },
  {
    period: 'Septembre – Novembre',
    title: 'Mer d’huile & Chanté Nwel',
    badge: 'Douceur & Traditions',
    description:
      'Les vents tombent, offrant une visibilité sous-marine remarquable sur les récifs de la côte Caraïbe. Dès novembre résonnent les premiers cantiques créoles des Chanté Nwel.',
    relatedId: 'blog-2'
  }
];

export default function BlogView({ onOpenArticle, onNavigateHome }: BlogViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollCategories = (direction: 'left' | 'right') => {
    if (!categoryScrollRef.current) return;
    const scrollAmount = direction === 'left' ? -260 : 260;
    categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const featuredPost =
    INITIAL_BLOG_POSTS.find(p => p.id === 'blog-4') || INITIAL_BLOG_POSTS[0];

  const sideBriefs = INITIAL_BLOG_POSTS.filter(p =>
    ['blog-6', 'blog-5', 'blog-9', 'blog-7'].includes(p.id)
  );

  const isFiltering = searchTerm.trim() !== '' || selectedCategory !== 'all';

  const filteredPosts = INITIAL_BLOG_POSTS.filter(post => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchSumm = post.summary.toLowerCase().includes(q);
      const matchCat = post.category.toLowerCase().includes(q);
      const matchAuthor = (post.author || '').toLowerCase().includes(q);
      return matchTitle || matchSumm || matchCat || matchAuthor;
    }
    return true;
  });

  const gridPosts = isFiltering
    ? filteredPosts
    : filteredPosts.filter(p => p.id !== featuredPost.id);

  return (
    <div className="space-y-12 text-left">
      {/* 1. BANDEAU ÉDITORIAL DU JOURNAL DE L'ÎLE */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white border border-slate-200/80 shadow-xs">
        <div className="absolute inset-0">
          <img
            src="/images/spots/morne-gommier.jpg"
            alt="Panorama côtier de la Martinique"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-900/45" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
                Le Journal de l&apos;Île · Guides & Dossiers
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Actualités, saisons & carnets de Martinique
              </h1>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Grands événements locaux, bulletins météo du littoral, saisons de la faune marine et itinéraires détaillés rédigés par nos contributeurs sur place.
              </p>
            </div>

            {/* Barre de recherche */}
            <div className="relative w-full lg:w-80 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Rechercher un sujet (yoles, rhum, pelée...)"
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none shadow-xs"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Rubriques du journal avec flèches gauche / droite (sans barre de défilement) */}
          <div className="pt-4 border-t border-white/15 flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScrollCategories('left')}
              aria-label="Faire défiler les rubriques vers la gauche"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={categoryScrollRef}
              className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth"
            >
              {CATEGORIES.map(cat => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                      active
                        ? 'bg-white text-slate-900 font-semibold'
                        : 'bg-white/10 text-white/85 hover:bg-white/20 border border-white/15'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleScrollCategories('right')}
              aria-label="Faire défiler les rubriques vers la droite"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. À LA UNE + LES DOSSIERS DU MOMENT (Affiché hors filtre) */}
      {!isFiltering && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Grand dossier à la Une (7 colonnes) */}
          <article
            onClick={() => onOpenArticle(featuredPost)}
            className="lg:col-span-7 group bg-white rounded-2xl border border-slate-200/90 overflow-hidden cursor-pointer flex flex-col justify-between transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-slate-900/90 text-white text-[11px] font-semibold tracking-wide uppercase backdrop-blur-xs">
                  Grand dossier à la Une
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/95 text-slate-800 text-[11px] font-semibold">
                  {featuredPost.category}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3.5">
                <div className="flex items-center gap-2.5 text-xs text-slate-500 flex-wrap">
                  <span>{featuredPost.date}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {featuredPost.readTime}
                  </span>
                  <span>·</span>
                  <span>Par {featuredPost.author}</span>
                </div>

                <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
                  {featuredPost.title}
                </h2>

                <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">
                  {featuredPost.summary}
                </p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5 text-xs text-slate-600">
                  <div className="font-bold text-slate-900">
                    Ce que vous trouverez dans ce dossier :
                  </div>
                  <p>
                    Fonctionnement d&apos;une yole ronde sur ses « bois dressés », étapes côtières entre Le François, Sainte-Anne et Saint-Pierre, et conseils pour suivre la course depuis la plage ou en bateau.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                  <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                  Dossier complet illustré
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-teal-700 group-hover:translate-x-1 transition-transform">
                  Lire l&apos;article complet
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </article>

          {/* Colonne "En bref sur l'île" (5 colonnes) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Points d&apos;actualité & littoral
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Les 4 sujets essentiels du moment en Martinique
                  </p>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                  En direct
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {sideBriefs.map(brief => (
                  <div
                    key={brief.id}
                    onClick={() => onOpenArticle(brief)}
                    className="py-3.5 first:pt-0 last:pb-0 group cursor-pointer flex gap-3.5 items-start"
                  >
                    <img
                      src={brief.image}
                      alt={brief.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-teal-700">
                          {brief.category}
                        </span>
                        <span>·</span>
                        <span>{brief.readTime}</span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors line-clamp-2">
                        {brief.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {brief.summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-teal-700" />
                  Météo des plages en temps réel
                </div>
                <p className="text-[11px] text-stone-600">
                  Consultez la carte des vents, de la houle et de l&apos;état des anses.
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 cursor-pointer"
              >
                Voir la carte
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. CALENDRIER DES SAISONS & GRANDS RENDEZ-VOUS DE L'ÎLE */}
      {!isFiltering && (
        <section className="bg-[#FAF8F5] rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-800">
                Repères annuels
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Le calendrier des saisons et temps forts en Martinique
              </h2>
            </div>
            <span className="text-xs text-stone-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-700" />
              Cliquez sur une saison pour lire le dossier associé
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ISLAND_SEASONS_CALENDAR.map(season => {
              const targetPost = INITIAL_BLOG_POSTS.find(
                p => p.id === season.relatedId
              );
              return (
                <div
                  key={season.period}
                  onClick={() => targetPost && onOpenArticle(targetPost)}
                  className="bg-white rounded-xl border border-stone-200/90 p-5 flex flex-col justify-between space-y-4 hover:border-teal-700/50 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-teal-800">
                        {season.period}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {season.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {season.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {season.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-teal-700 inline-flex items-center gap-1">
                    <span>Lire le dossier</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. GRILLE COMPLÈTE DES GUIDES & CARNETS PRATIQUES */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isFiltering
                ? `Articles correspondants (${gridPosts.length})`
                : 'Tous nos dossiers & guides de terrain'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sélectionnez un article pour lire le guide complet et les conseils pratiques
            </p>
          </div>
          {isFiltering && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {gridPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-3">
            <p className="text-sm text-slate-600">
              Aucun article ne correspond à votre recherche « {searchTerm} ».
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
            >
              Afficher tous les dossiers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map(post => (
              <article
                key={post.id}
                onClick={() => onOpenArticle(post)}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between cursor-pointer transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/95 text-slate-800 text-[11px] font-semibold shadow-2xs">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 sm:px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 truncate max-w-[180px]">
                    Par {post.author}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform">
                    Lire le dossier
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 5. RENVOI VERS LA CARTE INTERACTIVE */}
      <section className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700">
            <MapPin className="w-3.5 h-3.5" />
            Préparer vos étapes sur l&apos;île
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Retrouvez tous les lieux cités dans nos articles sur la carte
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Visualisez les plages, les distilleries AOC, les départs de randonnée et l&apos;état de la mer par commune.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateHome}
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors inline-flex items-center gap-2 self-start md:self-auto shrink-0 cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          Ouvrir l&apos;explorateur & la carte
        </button>
      </section>
    </div>
  );
}
