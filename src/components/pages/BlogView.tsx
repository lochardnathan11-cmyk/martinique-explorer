'use client';

import React, { useState } from 'react';
import { INITIAL_BLOG_POSTS } from '@/data/mockData';
import { BlogPost } from '@/types';
import {
  Clock,
  Search,
  ArrowRight,
  Compass,
  Calendar,
  MapPin,
  X
} from 'lucide-react';

interface BlogViewProps {
  onOpenArticle: (post: BlogPost) => void;
  onNavigateHome: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Tous les sujets' },
  { id: 'Actualités & Événements', label: 'Actualités & Événements' },
  { id: 'Météo & Littoral', label: 'Météo & Littoral' },
  { id: 'Guide Plages', label: 'Plages & Anses' },
  { id: 'Snorkeling & Faune', label: 'Fonds marins & Tortues' },
  { id: 'Faune & Écologie', label: 'Nature & Écologie' },
  { id: 'Gastronomie & Patrimoine', label: 'Terroir & Rhums AOC' },
  { id: 'Vivre en Martinique', label: 'S’installer & Vivre' }
];

export default function BlogView({ onOpenArticle, onNavigateHome }: BlogViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Article principal à la une : Tour des Yoles Rondes
  const featuredPost =
    INITIAL_BLOG_POSTS.find(p => p.id === 'blog-4') || INITIAL_BLOG_POSTS[0];

  // Les 3 brèves d'actualité locale (météo sargasses, ponte tortues luths, carnaval)
  const sideBriefs = INITIAL_BLOG_POSTS.filter(p =>
    ['blog-6', 'blog-5', 'blog-7'].includes(p.id)
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

  // Quand on n'est pas en recherche/filtre, on évite de dupliquer l'article de Une dans la grille du bas
  const gridPosts = isFiltering
    ? filteredPosts
    : filteredPosts.filter(p => p.id !== featuredPost.id);

  return (
    <div className="space-y-10 text-left">
      {/* 1. En-tête éditorial sobre (style journal local & carnet de voyage) */}
      <header className="border-b border-slate-200/90 pb-7">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
              Le Journal de l&apos;Île
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Actualités, saisons & carnets de route
            </h1>
            <p className="text-slate-600 text-base leading-relaxed">
              Suivez les temps forts de la Martinique, les bulletins du littoral, les saisons d&apos;observation de la faune marine et les dossiers rédigés par nos contributeurs sur place.
            </p>
          </div>

          {/* Barre de recherche discrète */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher un sujet (yoles, tortues, rhum...)"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-slate-200/90 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation par rubriques (sans emojis) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-6">
          {CATEGORIES.map(cat => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200/90 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* 2. Section "À la Une" + "Points de saison en bref" (affichée hors recherche) */}
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
              <span className="absolute top-4 left-4 px-3 py-1 rounded-md bg-slate-900/85 text-white text-[11px] font-semibold tracking-wide uppercase backdrop-blur-xs">
                Grand dossier
              </span>
            </div>

            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-slate-500 flex-wrap">
                  <span className="font-semibold text-teal-700">
                    {featuredPost.category}
                  </span>
                  <span>·</span>
                  <span>{featuredPost.date}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-[26px] font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
                  {featuredPost.title}
                </h2>

                <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">
                  {featuredPost.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Par <strong className="font-medium text-slate-800">{featuredPost.author}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-teal-700 group-hover:translate-x-1 transition-transform">
                  Lire le dossier
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </article>

          {/* Colonne "Le point sur l'île" (5 colonnes) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    En bref sur l&apos;île
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Météo côtière, faune marine et calendrier local
                  </p>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                  Mis à jour
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {sideBriefs.map(brief => (
                  <div
                    key={brief.id}
                    onClick={() => onOpenArticle(brief)}
                    className="py-4 first:pt-0 last:pb-0 group cursor-pointer flex gap-4 items-start"
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
                      <h3 className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors line-clamp-2">
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

            {/* Repère saisonnier utile */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                <Calendar className="w-3.5 h-3.5 text-teal-700" />
                Repères de saison en Martinique
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-600 pt-1">
                <div>
                  <strong className="text-stone-800">Déc. – Mai (Carême) :</strong> saison sèche, mer calme, alizés réguliers.
                </div>
                <div>
                  <strong className="text-stone-800">Mars – Juillet :</strong> ponte nocturne des tortues luths au Nord.
                </div>
                <div>
                  <strong className="text-stone-800">Fév. – Mars :</strong> Carnaval de Fort-de-France et jours gras.
                </div>
                <div>
                  <strong className="text-stone-800">Fin Juillet – Août :</strong> Tour de la Martinique des Yoles Rondes.
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Grille des articles et dossiers pratiques */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <h2 className="text-lg font-bold text-slate-900">
            {isFiltering
              ? `Résultats (${gridPosts.length})`
              : 'Tous nos guides & carnets pratiques'}
          </h2>
          {isFiltering && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
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
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
            >
              Afficher tous les articles
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
                    {post.author}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform">
                    Lire
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 4. Bandeau bas sobre de renvoi vers la carte météo en direct */}
      <section className="rounded-2xl bg-[#F3EFEA] border border-stone-200/90 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800">
            <MapPin className="w-3.5 h-3.5" />
            Avant de partir à la plage
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Vérifiez l&apos;état de la mer et la fréquentation des anses sur la carte
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Houle du jour, présence éventuelle de sargasses sur la côte Atlantique et visibilité de l&apos;eau sur la côte Caraïbe.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateHome}
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors inline-flex items-center gap-2 self-start md:self-auto shrink-0 cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          Consulter l&apos;explorateur & la carte
        </button>
      </section>
    </div>
  );
}
