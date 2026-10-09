'use client';

import React, { useState } from 'react';
import { BlogPost, PlaceItem } from '@/types';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Check, 
  MapPin, 
  Compass, 
  Bookmark, 
  MessageSquare, 
  ThumbsUp,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface ArticleDetailViewProps {
  post: BlogPost;
  places: PlaceItem[];
  onBack: () => void;
  onOpenPlace: (place: PlaceItem) => void;
  onNavigateHome: () => void;
}

export default function ArticleDetailView({
  post,
  places,
  onBack,
  onOpenPlace,
  onNavigateHome
}: ArticleDetailViewProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(48);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{ id: string; author: string; date: string; text: string }[]>([
    {
      id: 'c1',
      author: 'Stéphane B.',
      date: 'Il y a 2 jours',
      text: 'Nous avons suivi votre recommandation pour Anse Dufour à 7h45 : c\'était magique, nous étions seuls dans l\'eau avec deux tortues vertes à moins de 2 mètres ! Merci pour ce guide précis.'
    },
    {
      id: 'c2',
      author: 'Chloé & Thomas',
      date: 'Hier',
      text: 'Super article très complet et éco-responsable. On apprécie particulièrement le rappel de ne pas toucher les tortues.'
    }
  ]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount(prev => prev + 1);
    } else {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [
      {
        id: 'c-' + Date.now(),
        author: 'Vous (Voyageur)',
        date: 'À l\'instant',
        text: newComment.trim()
      },
      ...prev
    ]);
    setNewComment('');
  };

  // Find places mentioned in this article
  const relatedPlaces = places.filter(p => {
    if (post.id === 'blog-2') {
      return p.id === 'anse-dufour' || p.id === 'anse-noire' || p.category === 'snorkeling';
    }
    if (post.id === 'blog-1') {
      return p.category === 'beach';
    }
    return p.featured;
  }).slice(0, 3);

  return (
    <article className="space-y-12 animate-fadeIn pb-16">
      {/* 1. Breadcrumbs & Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-lagon-border/70 pb-4 text-xs">
        <nav className="flex items-center gap-2 text-ink-muted flex-wrap">
          <button 
            type="button"
            onClick={onNavigateHome}
            className="hover:text-action transition-colors cursor-pointer"
          >
            Accueil
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-lagon-border" />
          <button 
            type="button"
            onClick={onBack}
            className="hover:text-action transition-colors cursor-pointer"
          >
            Guides & Récits
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-lagon-border" />
          <span className="text-deep font-medium truncate max-w-[200px] sm:max-w-md">
            {post.title}
          </span>
        </nav>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-lagon-border text-deep hover:text-action hover:border-action transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="font-medium">Retour aux récits</span>
        </button>
      </div>

      {/* 2. Editorial Hero Header */}
      <header className="space-y-6 max-w-4xl mx-auto text-left">
        <div className="space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-lagon-light/60 text-action text-xs font-semibold tracking-wide uppercase">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-deep tracking-tight leading-tight">
            {post.title}
          </h1>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-normal">
            {post.summary}
          </p>
        </div>

        {/* Metadata Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-lagon-border/80 text-xs text-ink-muted">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-action/10 text-action flex items-center justify-center font-bold text-xs">
                {post.author ? post.author.charAt(0) : 'M'}
              </div>
              <span className="font-medium text-deep">{post.author}</span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 opacity-70" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 opacity-70" />
              {post.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                liked
                  ? 'bg-coral-soft border-coral text-coral'
                  : 'bg-white border-lagon-border text-deep hover:bg-lagon-bg'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-coral' : ''}`} />
              <span>{likeCount}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-lagon-border text-deep hover:text-action hover:border-action transition-all text-xs font-medium cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-action" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Lien copié !' : 'Partager'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Visual (Full-width high quality photo) */}
      <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-card border border-lagon-border aspect-[16/9] bg-lagon-bg relative">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-deep/80 backdrop-blur-sm text-white/90 text-[11px] px-3 py-1 rounded-full">
          Photo Martinique Explorer • Faune & Paysages
        </div>
      </div>

      {/* 4. Article Core Content & Side Column */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
        {/* Main Editorial Column */}
        <div className="lg:col-span-8 space-y-8 text-ink text-base leading-relaxed">
          {/* Executive Summary Card */}
          <div className="p-6 rounded-3xl bg-sand-light border border-sand-border space-y-3">
            <h3 className="text-sm font-semibold text-deep uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-coral" />
              L&apos;essentiel en un coup d&apos;œil
            </h3>
            <ul className="space-y-2 text-sm text-ink-muted list-disc list-inside">
              <li><strong>Meilleur horaire :</strong> Dès 7h30 - 8h30 le matin pour une eau transparente et un calme total.</li>
              <li><strong>Règles d&apos;or :</strong> Rester à au moins 3 mètres, ne jamais toucher la carapace et ne pas bloquer la respiration.</li>
              <li><strong>Équipement conseillé :</strong> Masque et tuba simples, palmes courtes, lycra anti-UV (éviter les crèmes chimiques toxiques).</li>
            </ul>
          </div>

          {/* Full rich article prose */}
          <div className="prose prose-slate max-w-none space-y-6 text-ink/90 leading-relaxed">
            <p className="text-lg text-deep font-medium leading-relaxed">
              {post.content}
            </p>

            <h2 className="text-2xl font-semibold text-deep pt-4">
              1. Les spots incontournables recommandés par les habitants
            </h2>
            <p>
              La commune des Anses-d&apos;Arlet abrite sans conteste les plus beaux herbiers côtiers de l&apos;île. En longeant la côte caraïbe vers le sud, vous découvrirez des eaux abritées des alizés et de la houle atlantique, créant des conditions de visibilité aquatique remarquables pouvant dépasser 20 mètres certains matins.
            </p>
            <p>
              À <strong>Anse Dufour</strong>, le contraste avec sa voisine Anse Noire (séparées par une simple falaise rocheuse) est frappant : le sable y est blond et doré, tandis qu&apos;Anse Noire arbore un sable noir d&apos;origine volcanique pure. Les tortues fréquentent régulièrement les deux anses pour se nourrir d&apos;algues et de phanérogames marines.
            </p>

            <div className="p-5 rounded-2xl bg-lagon-bg border border-lagon-border space-y-2">
              <h4 className="text-xs font-semibold text-action uppercase tracking-wide">
                💡 Conseil d&apos;initié de la communauté
              </h4>
              <p className="text-sm text-ink-muted">
                Venez tôt ! À partir de 10h00, le parking municipal est souvent complet et les bateaux d&apos;excursion commencent à arriver. Entre 7h30 et 9h00, vous partagerez la baie uniquement avec les pêcheurs locaux remontant leurs nasses traditionnelles.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-deep pt-4">
              2. Charte de respect marin & écologie
            </h2>
            <p>
              La Martinique est un sanctuaire de biodiversité reconnu mondialement par l&apos;UNESCO. Les tortues marines (tortues vertes et tortues imbriquées) sont des espèces protégées. Lors de vos immersions :
            </p>
            <ul className="space-y-2 text-sm text-ink-muted pl-4 list-disc">
              <li>Gardez une distance minimale de 3 à 5 mètres à tout moment.</li>
              <li>Ne poursuivez jamais un animal qui s&apos;éloigne vers le large.</li>
              <li>Laissez toujours libre l&apos;accès vertical à la surface lorsqu&apos;une tortue doit remonter respirer.</li>
              <li>Utilisez des t-shirts anti-UV plutôt que de la crème solaire pour préserver les coraux et les herbiers.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-deep pt-4">
              3. Que faire après votre baignade ?
            </h2>
            <p>
              Après votre session matinale, profitez de la douceur du bourg des Anses-d&apos;Arlet pour admirer son église classée alignée sur le ponton en bois, savourer un jus de canne frais pressé au marché local ou déguster des accras de morue croustillants les pieds dans le sable.
            </p>
          </div>

          {/* Social Reactions & Comment form */}
          <div className="pt-8 border-t border-lagon-border space-y-6">
            <h3 className="text-xl font-semibold text-deep flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-action" />
              Retours & échanges des voyageurs ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-3">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Vous avez testé ce spot récemment ? Partagez vos conseils, visibilité de l'eau et observations..."
                rows={3}
                className="w-full p-4 rounded-2xl bg-white border border-lagon-border focus:border-action focus:outline-none text-sm text-ink placeholder:text-ink-muted shadow-xs"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-6 py-2.5 rounded-xl bg-action hover:bg-action-hover disabled:opacity-50 text-white text-xs font-semibold shadow-soft cursor-pointer transition-colors"
                >
                  Publier mon avis
                </button>
              </div>
            </form>

            {/* Comment list */}
            <div className="space-y-4 pt-2">
              {comments.map(c => (
                <div key={c.id} className="p-4 rounded-2xl bg-white border border-lagon-border space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-deep">{c.author}</span>
                    <span className="text-ink-muted">{c.date}</span>
                  </div>
                  <p className="text-sm text-ink-muted leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Column (Places mentionnés + Actions) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Places mentionnés */}
          <div className="p-6 rounded-3xl bg-white border border-lagon-border shadow-soft space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-action">
                Spots clés du récit
              </span>
              <h4 className="font-semibold text-deep text-base">
                Lieux mentionnés dans le guide
              </h4>
            </div>

            <div className="space-y-3">
              {relatedPlaces.map(place => (
                <div
                  key={place.id}
                  onClick={() => onOpenPlace(place)}
                  className="group p-3 rounded-2xl border border-lagon-border hover:border-action bg-lagon-bg/40 hover:bg-white transition-all flex items-center gap-3 cursor-pointer shadow-xs"
                >
                  <img
                    src={place.photos[0]}
                    alt={place.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <h5 className="text-xs font-semibold text-deep group-hover:text-action truncate transition-colors">
                      {place.name}
                    </h5>
                    <p className="text-[11px] text-ink-muted truncate">
                      {place.commune}
                    </p>
                    <span className="inline-block text-[10px] text-action font-medium">
                      Voir la fiche complète →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Trip Planner Call to Action */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-deep via-[#0a4e63] to-action text-white space-y-4 shadow-card">
            <Compass className="w-8 h-8 text-lagon-light" />
            <div className="space-y-1">
              <h4 className="font-semibold text-lg">Carte interactive de Madinina</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Retrouvez les anses et trésors de cet article sur notre carte interactive et tracez votre itinéraire.
              </p>
            </div>
            <a
              href="/carte"
              className="w-full py-2.5 rounded-xl bg-white text-deep hover:bg-sand-light font-semibold text-xs transition-colors shadow-soft flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-action" />
              <span>Ouvrir la carte interactive</span>
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}
