'use client';

import React, { useState } from 'react';
import { INITIAL_BLOG_POSTS } from '@/data/mockData';
import { BlogPost } from '@/types';
import { 
  Clock, 
  Calendar, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Bookmark,
  Share2
} from 'lucide-react';

interface BlogViewProps {
  onOpenArticle: (post: BlogPost) => void;
  onNavigateHome: () => void;
}

export default function BlogView({ onOpenArticle, onNavigateHome }: BlogViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Toutes les actualités' },
    { id: 'Actualités & Événements', label: '🎉 Actualités & Fêtes' },
    { id: 'Guide Plages', label: '🏖️ Plages & Baignade' },
    { id: 'Snorkeling & Faune', label: '🐢 Faune & Snorkeling' },
    { id: 'Faune & Écologie', label: '🌿 Écologie & Nature' },
    { id: 'Gastronomie & Patrimoine', label: '🍽️ Terroir & Rhums' },
    { id: 'Vivre en Martinique', label: '🏡 Vivre & Retraite' },
  ];

  const featuredPost = INITIAL_BLOG_POSTS[3] || INITIAL_BLOG_POSTS[0]; // Tour des Yoles or first

  const filteredPosts = INITIAL_BLOG_POSTS.filter(post => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchSumm = post.summary.toLowerCase().includes(q);
      const matchCat = post.category.toLowerCase().includes(q);
      return matchTitle || matchSumm || matchCat;
    }
    return true;
  });

  return (
    <div className="space-y-12 animate-fadeIn text-left">
      {/* 1. Editorial Magazine Header */}
      <section className="bg-white rounded-3xl border border-lagon-border p-8 sm:p-12 shadow-soft space-y-6">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lagon-light/60 text-action text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Magazine & Actualités de l&apos;Île aux Fleurs</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold text-deep tracking-tight">
            Actualités & Carnets de Martinique
          </h1>

          <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-normal">
            Dernières nouvelles de l&apos;île, météo du littoral, grands événements culturels, saisons de la faune marine et conseils d&apos;initiés pour savourer Madinina.
          </p>
        </div>

        {/* Search Bar & Stats */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-ink-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher une actualité, événement, yoles, tortues..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-lagon-bg border border-lagon-border text-xs sm:text-sm text-ink placeholder:text-ink-muted focus:border-action focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div className="text-xs text-ink-muted flex items-center gap-3">
            <span className="font-medium text-deep">{filteredPosts.length} articles publiés</span>
            <span>•</span>
            <span className="text-action font-semibold">⏱️ Temps de lecture précisé</span>
          </div>
        </div>
      </section>

      {/* 2. Headline Spotlight (À la Une) */}
      {!searchTerm && selectedCategory === 'all' && (
        <section
          onClick={() => onOpenArticle(featuredPost)}
          className="group relative rounded-4xl border border-lagon-border bg-white overflow-hidden shadow-soft hover:shadow-card transition-all duration-500 cursor-pointer grid grid-cols-1 lg:grid-cols-12"
        >
          <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto w-full overflow-hidden bg-lagon-bg">
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-deep text-white text-xs font-semibold shadow-soft">
                À la Une
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/95 text-deep text-xs font-bold backdrop-blur-sm shadow-soft flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-action" />
                <span>{featuredPost.readTime}</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-ink-muted">
                <span className="text-action font-semibold uppercase tracking-wider">{featuredPost.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {featuredPost.date}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-deep leading-tight group-hover:text-action transition-colors">
                {featuredPost.title}
              </h2>

              <p className="text-sm text-ink-muted leading-relaxed line-clamp-4">
                {featuredPost.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-lagon-border flex items-center justify-between text-xs font-semibold text-action">
              <span>Lire l&apos;actualité complète</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </div>
          </div>
        </section>
      )}

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-deep text-white border-deep shadow-sm scale-102'
                  : 'bg-white text-ink border-lagon-border hover:border-action hover:text-action'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 4. Article Grid with Prominent Reading Time Badge */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(post => (
          <article
            key={post.id}
            onClick={() => onOpenArticle(post)}
            className="group bg-white rounded-3xl border border-lagon-border overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 flex flex-col cursor-pointer text-left"
          >
            {/* Visual Cover */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-lagon-bg">
              <img
                src={post.image}
                alt={post.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Category Pill */}
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 text-deep text-xs font-semibold backdrop-blur-sm shadow-soft">
                {post.category}
              </span>

              {/* PROMINENT READING TIME BADGE */}
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-deep/90 text-white text-xs font-semibold backdrop-blur-sm shadow-card flex items-center gap-1.5 border border-white/20">
                <Clock className="w-3.5 h-3.5 text-lagon-light" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Article Details */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-ink-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 opacity-70" />
                    {post.date}
                  </span>
                  <span className="font-medium text-action truncate max-w-[120px]">
                    {post.author}
                  </span>
                </div>

                <h3 className="font-semibold text-deep text-lg leading-snug group-hover:text-action transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-sm text-ink-muted line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3 border-t border-lagon-border/70 flex items-center justify-between text-xs font-medium text-action">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-ink-muted" />
                  <span className="text-ink-muted font-normal">{post.readTime}</span>
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform font-semibold">
                  <span>Lire l&apos;article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* 5. Island News Bulletin / Alert banner */}
      <section className="p-8 sm:p-10 rounded-4xl bg-gradient-to-br from-deep via-[#0a4e63] to-action text-white space-y-4 shadow-card text-left">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-lagon-light">
            Alertes en direct & Météo de l&apos;Île
          </span>
          <h3 className="text-2xl sm:text-3xl font-semibold">
            Restez informés des conditions marines
          </h3>
          <p className="text-sm text-white/80 leading-relaxed font-normal">
            Consultez les mises à jour météo, les arrivages de sargasses et les observations de la communauté avant chaque sortie en mer.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateHome}
          className="px-6 py-3 rounded-2xl bg-white hover:bg-sand-light text-deep font-semibold text-xs transition-colors shadow-soft cursor-pointer inline-flex items-center gap-2"
        >
          <Compass className="w-4 h-4 text-action" />
          <span>Accéder aux conditions météo en direct sur la carte</span>
        </button>
      </section>
    </div>
  );
}
