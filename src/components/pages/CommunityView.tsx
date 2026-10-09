'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Image as ImageIcon, 
  MapPin, 
  Sparkles, 
  Send, 
  Check, 
  Waves, 
  Compass, 
  AlertTriangle,
  Smile,
  Flame,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export default function CommunityView() {
  const { posts, addPost, likePost, currentUser, openModal } = useApp();
  const [newContent, setNewContent] = useState('');
  const [newLocation, setNewLocation] = useState('Les Anses-d\'Arlet');
  const [newPhoto, setNewPhoto] = useState('');
  const [newTag, setNewTag] = useState('#Tortues');
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});
  const [localComments, setLocalComments] = useState<{ [postId: string]: { id: string; author: string; text: string; date: string }[] }>({
    'p1': [
      { id: 'lc1', author: 'Cédric P.', text: 'Superbe ! À quelle heure y étiez-vous ?', date: 'Il y a 1h' },
      { id: 'lc2', author: 'Nathalie L.', text: 'Vers 7h45, le calme plat complet !', date: 'Il y a 30 min' }
    ]
  });

  const communesList = [
    'Les Anses-d\'Arlet',
    'Sainte-Anne',
    'Le Diamant',
    'Sainte-Luce',
    'Trois-Îlets',
    'Le François',
    'Tartane (Trinité)',
    'Saint-Pierre',
    'Le Robert',
    'Grand\'Rivière'
  ];

  const filterTabs = [
    { id: 'all', label: '🌟 Tout le flux', tag: 'all' },
    { id: 'tortues', label: '🐢 Faune & Tortues', tag: '#Tortues' },
    { id: 'plages', label: '🏖️ Plages & Baignade', tag: '#Plage' },
    { id: 'sargasses', label: '🌿 Météo & Sargasses', tag: '#Sargasses' },
    { id: 'restos', label: '🍽️ Restos & Bonnes tables', tag: '#Resto' },
    { id: 'bonplan', label: '💡 Bons plans', tag: '#BonPlan' },
  ];

  const samplePhotos = [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=1000&q=80'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openModal('auth');
      return;
    }
    if (!newContent.trim()) return;

    addPost(newContent.trim(), newLocation, newPhoto.trim() || undefined, newTag);
    setNewContent('');
    setNewPhoto('');
    setShowPhotoInput(false);
  };

  const handleAddComment = (postId: string) => {
    if (!currentUser) {
      openModal('auth');
      return;
    }
    const text = commentInput[postId];
    if (!text || !text.trim()) return;

    setLocalComments(prev => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || []),
        {
          id: 'cm-' + Date.now(),
          author: currentUser.name || 'Membre vérifié',
          text: text.trim(),
          date: 'À l\'instant'
        }
      ]
    }));

    setCommentInput(prev => ({ ...prev, [postId]: '' }));
  };

  const handleShare = (postId: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedId(postId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredPosts = posts.filter(p => {
    if (activeFilter === 'all') return true;
    return p.tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase()) || activeFilter.toLowerCase().includes(t.toLowerCase().replace('#', '')));
  });

  return (
    <div className="space-y-10 animate-fadeIn text-left">
      {/* 1. Community Hero Header */}
      <section className="relative rounded-4xl bg-gradient-to-br from-deep via-[#0a4e63] to-action text-white p-8 sm:p-12 overflow-hidden shadow-card">
        {/* Subtle decorative circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-coral/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-lagon-light text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>L&apos;Espace d&apos;échange & d&apos;entraide Madinina</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
            Le Mur de la Communauté
          </h1>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
            Retrouvez en temps réel les observations marines, l&apos;état des plages sans sargasses, les rencontres avec les tortues et les pépites partagées par les habitants et voyageurs.
          </p>

          {/* Quick Stats Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/15 text-xs">
            <div>
              <strong className="block text-xl font-bold text-white">1 420+</strong>
              <span className="text-white/70">Membres locaux</span>
            </div>
            <div>
              <strong className="block text-xl font-bold text-white">100%</strong>
              <span className="text-white/70">Conseils bénévoles</span>
            </div>
            <div>
              <strong className="block text-xl font-bold text-coral">Direct</strong>
              <span className="text-white/70">Alertes sargasses</span>
            </div>
            <div>
              <strong className="block text-xl font-bold text-lagon-light">0 pub</strong>
              <span className="text-white/70">Partage authentique</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Layout: Feed + Side widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Post Creator + Feed */}
        <div className="lg:col-span-8 space-y-8">
          {/* A. Create Post Card */}
          <div className="bg-white rounded-3xl border border-lagon-border p-6 sm:p-7 shadow-soft space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  currentUser ? 'bg-gradient-to-tr from-[#087E8B] to-[#BFEFF2] text-white shadow-xs' : 'bg-slate-100 text-[#6E858A]'
                }`}>
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : '👤'}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-deep block">
                    {currentUser?.name || 'Visiteur non connecté'}
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    {currentUser ? 'Votre publication sera associée à votre profil vérifié' : 'Connectez-vous pour échanger avec la communauté'}
                  </span>
                </div>
              </div>

              {!currentUser && (
                <button
                  type="button"
                  onClick={() => openModal('auth')}
                  className="px-3.5 py-1.5 rounded-xl bg-action/10 hover:bg-action hover:text-white text-action text-xs font-bold transition-all cursor-pointer border border-action/20 shrink-0"
                >
                  Se connecter
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="Que souhaitez-vous partager ? (ex: 'Ce matin à Anse Dufour : eau transparente et 2 tortues à 10m de la plage ! Aucune sargasse.')"
                rows={3}
                className="w-full text-sm text-ink placeholder:text-ink-muted bg-lagon-bg/50 rounded-2xl p-4 border border-lagon-border focus:border-action focus:bg-white focus:outline-none transition-colors resize-none"
              />

              {showPhotoInput && (
                <div className="p-4 rounded-2xl bg-lagon-bg/60 border border-lagon-border space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-ink-muted">
                    <span className="font-semibold text-deep">Lien de votre photo (URL) :</span>
                    <button
                      type="button"
                      onClick={() => setShowPhotoInput(false)}
                      className="text-ink-muted hover:text-deep"
                    >
                      Masquer
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newPhoto}
                    onChange={e => setNewPhoto(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full text-xs p-3 rounded-xl bg-white border border-lagon-border text-ink focus:border-action focus:outline-none"
                  />
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-ink-muted">
                    <span>Photos rapides suggérées :</span>
                    {samplePhotos.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewPhoto(p)}
                        className="px-2 py-0.5 rounded-lg bg-white border border-lagon-border hover:border-action text-[10px] text-action font-medium"
                      >
                        Photo {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-lagon-border/70 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Location Selector */}
                  <div className="flex items-center gap-1.5 bg-lagon-bg/60 px-3 py-1.5 rounded-xl border border-lagon-border text-xs">
                    <MapPin className="w-3.5 h-3.5 text-action" />
                    <select
                      value={newLocation}
                      onChange={e => setNewLocation(e.target.value)}
                      className="bg-transparent text-deep font-medium focus:outline-none cursor-pointer"
                    >
                      {communesList.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tag Selector */}
                  <div className="flex items-center gap-1.5 bg-lagon-bg/60 px-3 py-1.5 rounded-xl border border-lagon-border text-xs">
                    <span className="text-action font-bold">#</span>
                    <select
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      className="bg-transparent text-deep font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="#Tortues">Tortues</option>
                      <option value="#Plage">Plage</option>
                      <option value="#Sargasses">Sargasses</option>
                      <option value="#Resto">Resto</option>
                      <option value="#Snorkeling">Snorkeling</option>
                      <option value="#BonPlan">Bon Plan</option>
                    </select>
                  </div>

                  {/* Photo Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPhotoInput(!showPhotoInput)}
                    className="flex items-center gap-1.5 text-action hover:text-action-hover font-semibold px-2.5 py-1.5 rounded-xl hover:bg-lagon-bg transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Photo</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!newContent.trim()}
                  className="px-6 py-2.5 rounded-xl bg-action hover:bg-action-hover disabled:opacity-50 text-white font-semibold transition-colors shadow-soft cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publier</span>
                </button>
              </div>
            </form>
          </div>

          {/* B. Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filterTabs.map(tab => {
              const isSelected = activeFilter === tab.tag;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.tag)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-deep text-white border-deep shadow-sm scale-102'
                      : 'bg-white text-ink border-lagon-border hover:border-action hover:text-action'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* C. Social Feed Stream */}
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-lagon-border text-ink-muted space-y-2">
                <p className="font-semibold text-deep text-base">Aucune publication dans cette catégorie pour le moment.</p>
                <p className="text-xs">Soyez le premier à partager votre expérience !</p>
              </div>
            ) : (
              filteredPosts.map(post => {
                const postComments = localComments[post.id] || [];
                const isCommentOpen = activeCommentPostId === post.id;

                return (
                  <article
                    key={post.id}
                    className="bg-white rounded-3xl border border-lagon-border overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 space-y-4"
                  >
                    {/* Post Author Bar */}
                    <div className="p-6 pb-0 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-lagon-border shadow-xs"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-deep text-sm">
                              {post.author.name}
                            </h3>
                            {post.author.badge && (
                              <span className="px-2 py-0.5 rounded-full bg-sand-light text-deep border border-sand-border text-[10px] font-semibold">
                                {post.author.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-ink-muted pt-0.5">
                            <span className="flex items-center gap-1 font-medium text-action">
                              <MapPin className="w-3 h-3" />
                              {post.location}
                            </span>
                            <span>•</span>
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {post.tags.map(t => (
                          <span
                            key={t}
                            className="px-2.5 py-1 rounded-xl bg-lagon-bg text-action text-[11px] font-semibold border border-lagon-border"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Post Text */}
                    <div className="px-6 text-sm text-ink leading-relaxed">
                      <p>{post.content}</p>
                    </div>

                    {/* Post Photo if available */}
                    {post.photos && post.photos.length > 0 && (
                      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-lagon-bg">
                        <img
                          src={post.photos[0]}
                          alt="Partage communautaire"
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                        />
                      </div>
                    )}

                    {/* Interaction Buttons Bar */}
                    <div className="px-6 py-4 border-t border-lagon-border/70 flex items-center justify-between text-xs text-ink-muted">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => likePost(post.id)}
                          className="flex items-center gap-1.5 hover:text-coral transition-colors font-medium cursor-pointer group"
                        >
                          <Heart className="w-4 h-4 group-hover:scale-110 text-coral fill-coral/20 group-hover:fill-coral transition-all" />
                          <span>{post.likes} mentions j&apos;aime</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveCommentPostId(isCommentOpen ? null : post.id)}
                          className="flex items-center gap-1.5 hover:text-action transition-colors font-medium cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 text-action" />
                          <span>{post.commentsCount + postComments.length} commentaires</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleShare(post.id)}
                        className="flex items-center gap-1 hover:text-action transition-colors font-medium cursor-pointer"
                      >
                        {copiedId === post.id ? (
                          <>
                            <Check className="w-4 h-4 text-action" />
                            <span className="text-action">Lien copié !</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4" />
                            <span>Partager</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Expandable Comments Drawer */}
                    {isCommentOpen && (
                      <div className="px-6 pb-6 pt-2 bg-lagon-bg/30 border-t border-lagon-border/60 space-y-4 animate-fadeIn">
                        {/* Comments List */}
                        <div className="space-y-2.5">
                          {postComments.map(c => (
                            <div key={c.id} className="p-3.5 rounded-2xl bg-white border border-lagon-border space-y-1 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-deep">{c.author}</span>
                                <span className="text-[10px] text-ink-muted">{c.date}</span>
                              </div>
                              <p className="text-ink-muted leading-relaxed">{c.text}</p>
                            </div>
                          ))}
                        </div>

                        {/* Reply Input Bar */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={commentInput[post.id] || ''}
                            onChange={e => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                            onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                            placeholder="Écrire une réponse bienveillante..."
                            className="flex-1 px-4 py-2 text-xs bg-white border border-lagon-border rounded-xl focus:border-action focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddComment(post.id)}
                            className="px-4 py-2 rounded-xl bg-action hover:bg-action-hover text-white text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Répondre
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side Column: Live Community Widgets */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Widget 1: Direct Sargasses & Live Beach Status */}
          <div className="p-6 rounded-3xl bg-white border border-lagon-border shadow-soft space-y-4">
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-action" />
              <h3 className="font-semibold text-deep text-sm">
                État des plages par la communauté
              </h3>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Derniers signalements d&apos;arrivages ou d&apos;eau cristalline vérifiés aujourd&apos;hui :
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between font-semibold text-emerald-800">
                  <span>Anse Dufour & Noire</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Cristalline</span>
                </div>
                <p className="text-emerald-700 text-[11px]">Zéro sargasse, excellente visibilité tortues.</p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between font-semibold text-emerald-800">
                  <span>Plage des Salines (Sainte-Anne)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Parfaite</span>
                </div>
                <p className="text-emerald-700 text-[11px]">Baignade idyllique, plage entièrement propre.</p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="flex items-center justify-between font-semibold text-amber-900">
                  <span>Pointe Faula (Le Vauclin)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">Modéré</span>
                </div>
                <p className="text-amber-800 text-[11px]">Léger cordon sur le bord nord, lagon dégagé.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openModal('alert_report')}
              className="w-full py-2.5 rounded-xl border border-action text-action hover:bg-lagon-bg font-semibold text-xs transition-colors cursor-pointer"
            >
              + Signaler l&apos;état d&apos;une plage
            </button>
          </div>

          {/* Widget 2: Top Contributors of the Month */}
          <div className="p-6 rounded-3xl bg-white border border-lagon-border shadow-soft space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-coral" />
              <h3 className="font-semibold text-deep text-sm">
                Habitants & Guides actifs
              </h3>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Nathalie L.', role: 'Résidente Anses d\'Arlet', xp: '1 480 XP', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80' },
                { name: 'Yannick B.', role: 'Guide Éco-Snorkeling', xp: '1 250 XP', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
                { name: 'Jérôme M.', role: 'Passionné Randonnées', xp: '980 XP', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={member.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="font-semibold text-deep block">{member.name}</span>
                      <span className="text-[10px] text-ink-muted">{member.role}</span>
                    </div>
                  </div>
                  <span className="font-bold text-coral text-[11px]">{member.xp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 3: Eco & Kindness Charter */}
          <div className="p-6 rounded-3xl bg-sand-light border border-sand-border space-y-3 text-xs text-ink-muted">
            <div className="flex items-center gap-2 text-deep font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Charte de bienveillance</span>
            </div>
            <p className="leading-relaxed">
              Sur Martinique Explorer, nous partageons nos découvertes dans le respect de la nature antillaise : zéro déchet sur les anses, distance avec les tortues et courtoisie caribéenne.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
