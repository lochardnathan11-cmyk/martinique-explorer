'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MapPin,
  Heart,
  MessageCircle,
  Camera,
  Send,
  Trash2,
  CheckCircle2,
  Compass,
  Clock,
  Plus,
  X,
  ChevronRight,
  Waves,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';

interface CommunityViewProps {
  onNavigate: (tab: string) => void;
}

const COMMUNES_LIST = [
  'Les Anses-d\'Arlet',
  'Anse Dufour / Anse Noire',
  'Sainte-Anne (Les Salines)',
  'Le Diamant',
  'Sainte-Luce',
  'Les Trois-Îlets',
  'Le Carbet / Saint-Pierre',
  'Presqu\'île de la Caravelle',
  'Le François / Le Robert',
  'Grand\'Rivière / Le Prêcheur'
];

const QUICK_PHOTOS = [
  {
    label: 'Anse Dufour',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80'
  },
  {
    label: 'Les Salines',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80'
  },
  {
    label: 'Le Diamant',
    url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=900&q=80'
  },
  {
    label: 'Fonds Blancs',
    url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80'
  }
];

export const CommunityView: React.FC<CommunityViewProps> = ({ onNavigate }) => {
  const {
    posts,
    addPost,
    likePost,
    deletePost,
    alerts,
    verifyAlert,
    forumTopics,
    addForumTopic,
    userRole,
    currentUser,
    openModal
  } = useApp();

  // Main navigation tab: 'direct' (live feed) or 'entraide' (questions)
  const [activeSection, setActiveSection] = useState<'direct' | 'entraide'>('direct');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Composer state (for observations / photos)
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [postText, setPostText] = useState('');
  const [postLocation, setPostLocation] = useState('Les Anses-d\'Arlet');
  const [postCategory, setPostCategory] = useState<'plage' | 'snorkeling' | 'adresse'>('plage');
  const [postPhoto, setPostPhoto] = useState('');
  const [showPresetPhotos, setShowPresetPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Composer state (for Q&A)
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionCategory, setQuestionCategory] = useState<'Tourisme' | 'Plages' | 'Restaurants' | 'Retraite'>('Tourisme');
  const [questionBody, setQuestionBody] = useState('');

  // Local comments state so users can reply directly on cards
  const [expandedCommentsId, setExpandedCommentsId] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [localComments, setLocalComments] = useState<
    Record<string, Array<{ author: string; text: string; time: string }>>
  >({
    'post-1': [
      {
        author: 'Marc L.',
        text: 'Merci pour l’info ! On hésitait à descendre au Diamant demain matin.',
        time: 'Il y a 1h'
      }
    ],
    'post-2': [
      {
        author: 'Yannick B.',
        text: 'Superbe photo ! Vers la pointe rocheuse à droite on voit aussi souvent des poissons-coffres.',
        time: 'Il y a 2h'
      }
    ]
  });

  // Local replies for forum questions
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [topicReplyDrafts, setTopicReplyDrafts] = useState<Record<string, string>>({});
  const [localTopicReplies, setLocalTopicReplies] = useState<
    Record<string, Array<{ author: string; role: string; text: string; time: string }>>
  >({
    'f-1': [
      {
        author: 'Yannick B.',
        role: 'Résident',
        text: 'Avec deux enfants, Sainte-Luce est top : vous avez le sentier littoral qui relie toutes les anses à pied (Gros Raisins, Pont Café, Corps de Garde) et la mer y est très calme.',
        time: 'Aujourd\'hui'
      },
      {
        author: 'Claire M.',
        role: 'Voyageuse',
        text: 'Nous avions logé aux Trois-Îlets (Anse à l\'Âne) : très pratique pour prendre la navette maritime vers Fort-de-France et descendre en 15 min à Anse Dufour.',
        time: 'Aujourd\'hui'
      }
    ],
    'f-2': [
      {
        author: 'Marie-Paule',
        role: 'Résidente à Sainte-Luce',
        text: 'Le bourg de Sainte-Luce est très agréable à vivre toute l\'année, marché le matin, médecins sur place et le port du Marin est à 15 minutes.',
        time: 'Hier'
      }
    ],
    'f-3': [
      {
        author: 'Fabrice K.',
        role: 'Habitant',
        text: 'Sur la route des Anses-d\'Arlet ou à l\'entrée de Sainte-Anne le midi, cherchez les fumoirs en bord de route dès 11h30, c\'est là qu\'il est le meilleur.',
        time: 'Il y a 2 jours'
      }
    ]
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPostPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;
    const tagMap: Record<string, string> = {
      plage: '#Plage',
      snorkeling: '#Tortues',
      adresse: '#BonPlan'
    };
    addPost(postText.trim(), postLocation, postPhoto || undefined, tagMap[postCategory]);
    setPostText('');
    setPostPhoto('');
    setShowPresetPhotos(false);
    setIsComposerOpen(false);
  };

  const handlePublishQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTitle.trim() || !questionBody.trim()) return;
    addForumTopic(questionTitle.trim(), questionCategory, questionBody.trim());
    setQuestionTitle('');
    setQuestionBody('');
    setIsQuestionOpen(false);
  };

  const handleAddComment = (postId: string) => {
    const text = commentDrafts[postId]?.trim();
    if (!text) return;
    const authorName = currentUser?.name || 'Voyageur';
    setLocalComments(prev => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || []),
        { author: authorName, text, time: 'À l\'instant' }
      ]
    }));
    setCommentDrafts(prev => ({ ...prev, [postId]: '' }));
  };

  const handleAddTopicReply = (topicId: string) => {
    const text = topicReplyDrafts[topicId]?.trim();
    if (!text) return;
    const authorName = currentUser?.name || 'Membre';
    setLocalTopicReplies(prev => ({
      ...prev,
      [topicId]: [
        ...(prev[topicId] || []),
        { author: authorName, role: currentUser ? 'Membre' : 'Visiteur', text, time: 'À l\'instant' }
      ]
    }));
    setTopicReplyDrafts(prev => ({ ...prev, [topicId]: '' }));
  };

  // Clean up emojis from mock badges for a more authentic look
  const cleanBadgeText = (badge?: string, isLocal?: boolean) => {
    if (isLocal) return 'Habitant';
    if (!badge) return 'Voyageur';
    const stripped = badge.replace(/[^\p{L}\p{N}\s-]/gu, '').trim();
    return stripped || 'Voyageur';
  };

  // Strip trailing emoji spam or hashtags if needed
  const getCategoryLabel = (post: (typeof posts)[0]) => {
    const joined = (post.tags || []).join(' ').toLowerCase();
    if (joined.includes('tortue') || joined.includes('snorkeling')) return 'Fonds marins & Tortues';
    if (joined.includes('gastronomie') || post.category === 'restaurant') return 'Bonne adresse';
    return 'État de la plage';
  };

  const filteredPosts = posts.filter(p => {
    if (selectedFilter === 'all') return true;
    const label = getCategoryLabel(p);
    if (selectedFilter === 'plage') return label === 'État de la plage';
    if (selectedFilter === 'snorkeling') return label === 'Fonds marins & Tortues';
    if (selectedFilter === 'adresse') return label === 'Bonne adresse';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* En-tête éditorial sobre et chaleureux */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 mb-2">
                Carnet de route collaboratif
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                La vie sur l&apos;île, en direct
              </h1>
              <p className="text-slate-600 text-base mt-2 leading-relaxed">
                Retrouvez les conditions de baignade du matin, les photos partagées aujourd&apos;hui sur les anses et les conseils des résidents pour organiser vos journées.
              </p>
            </div>

            {/* Navigation simple entre les 2 usages clés */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start md:self-auto border border-slate-200/60">
              <button
                onClick={() => setActiveSection('direct')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeSection === 'direct'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                En direct des plages ({posts.length})
              </button>
              <button
                onClick={() => setActiveSection('entraide')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeSection === 'entraide'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Questions & Conseils ({forumTopics.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal en 2 colonnes équilibrées */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLONNE GAUCHE (7 cols) : Fil en direct OU Questions d'entraide */}
          <div className="lg:col-span-7 space-y-6">
            {activeSection === 'direct' ? (
              <>
                {/* Boîte de partage épurée (fermée par défaut pour rester lisible) */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                  {!isComposerOpen ? (
                    <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                      <button
                        onClick={() => setIsComposerOpen(true)}
                        className="flex-1 flex items-center gap-3.5 text-left group"
                      >
                        <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm shrink-0">
                          {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'M'}
                        </div>
                        <div className="flex-1 py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-500 text-sm group-hover:bg-slate-100/80 group-hover:border-slate-300 transition-colors">
                          Vous êtes sur une plage ? Partagez une photo ou l&apos;état de la mer...
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setIsComposerOpen(true);
                          setTimeout(() => fileInputRef.current?.click(), 100);
                        }}
                        className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors shrink-0"
                      >
                        <Camera className="w-4 h-4 text-teal-700" />
                        Photo
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePublishPost} className="p-5 sm:p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-semibold text-slate-900">
                          Partager une observation du jour
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsComposerOpen(false)}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={postText}
                        onChange={e => setPostText(e.target.value)}
                        placeholder="Comment est la mer aujourd'hui ? Avez-vous croisé des tortues ou découvert une bonne adresse ?"
                        className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-teal-600 transition-colors resize-none"
                        required
                        autoFocus
                      />

                      {/* Aperçu de la photo si sélectionnée */}
                      {postPhoto && (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-56">
                          <img
                            src={postPhoto}
                            alt="Aperçu"
                            className="w-full h-48 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setPostPhoto('')}
                            className="absolute top-2.5 right-2.5 bg-slate-900/75 hover:bg-slate-900 text-white p-1.5 rounded-full transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Choix de photos d'illustration si l'utilisateur n'en a pas sur son appareil */}
                      {showPresetPhotos && !postPhoto && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-600">
                              Ou choisir une photo de l&apos;anse :
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowPresetPhotos(false)}
                              className="text-xs text-slate-400 hover:text-slate-600"
                            >
                              Fermer
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {QUICK_PHOTOS.map(item => (
                              <button
                                key={item.label}
                                type="button"
                                onClick={() => {
                                  setPostPhoto(item.url);
                                  setShowPresetPhotos(false);
                                }}
                                className="group relative rounded-lg overflow-hidden h-16 border border-slate-200 hover:border-teal-600 transition-all"
                              >
                                <img
                                  src={item.url}
                                  alt={item.label}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[10px] text-white font-medium py-0.5 truncate px-1">
                                  {item.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Secteur ou plage
                          </label>
                          <select
                            value={postLocation}
                            onChange={e => setPostLocation(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-600"
                          >
                            {COMMUNES_LIST.map(c => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Sujet
                          </label>
                          <select
                            value={postCategory}
                            onChange={e => setPostCategory(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-600"
                          >
                            <option value="plage">État de la plage & météo</option>
                            <option value="snorkeling">Tortues & fonds marins</option>
                            <option value="adresse">Bonne table / Conseil</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors"
                          >
                            <Camera className="w-3.5 h-3.5 text-teal-700" />
                            Importer une photo
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowPresetPhotos(!showPresetPhotos)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                            Photos de l&apos;île
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsComposerOpen(false)}
                            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            Annuler
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors shadow-2xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Publier
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>

                {/* Filtres sobres sans emojis */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {[
                      { id: 'all', label: 'Toutes les publications' },
                      { id: 'plage', label: 'État des plages' },
                      { id: 'snorkeling', label: 'Fonds marins & Tortues' },
                      { id: 'adresse', label: 'Bonnes adresses' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedFilter(tab.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                          selectedFilter === tab.id
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 border border-slate-200/90 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Liste des publications */}
                <div className="space-y-5">
                  {filteredPosts.map(post => {
                    const extraComments = localComments[post.id] || [];
                    const totalComments = post.commentsCount + extraComments.length;
                    const isCommentsOpen = expandedCommentsId === post.id;
                    const categoryLabel = getCategoryLabel(post);

                    return (
                      <article
                        key={post.id}
                        className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden transition-shadow hover:shadow-xs"
                      >
                        {/* En-tête auteur */}
                        <div className="p-5 pb-3.5 flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-slate-900 text-sm">
                                  {post.author.name}
                                </span>
                                <span
                                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                                    post.author.isLocal
                                      ? 'bg-teal-50 text-teal-800 border border-teal-200/60'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {cleanBadgeText(post.author.badge, post.author.isLocal)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                <span>{post.timestamp}</span>
                                {post.location && (
                                  <>
                                    <span>·</span>
                                    <button
                                      onClick={() => onNavigate('map')}
                                      className="inline-flex items-center gap-1 text-slate-700 font-medium hover:text-teal-700 transition-colors"
                                    >
                                      <MapPin className="w-3 h-3 text-teal-700" />
                                      {post.location}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-full">
                              {categoryLabel}
                            </span>
                            {userRole === 'admin' && (
                              <button
                                onClick={() => deletePost(post.id)}
                                className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg transition-colors"
                                title="Supprimer la publication"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Texte du post */}
                        <div className="px-5 pb-4">
                          <p className="text-slate-800 text-[15px] leading-relaxed">
                            {post.content}
                          </p>
                        </div>

                        {/* Photo éventuelle */}
                        {post.photos && post.photos.length > 0 && (
                          <div className="px-5 pb-4">
                            <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-100 max-h-[380px]">
                              <img
                                src={post.photos[0]}
                                alt={post.location || 'Martinique'}
                                className="w-full h-full max-h-[380px] object-cover"
                              />
                            </div>
                          </div>
                        )}

                        {/* Barre d'actions sobre */}
                        <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                          <div className="flex items-center gap-5">
                            <button
                              onClick={() => likePost(post.id)}
                              className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-rose-600 transition-colors group"
                            >
                              <Heart className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                              <span>Utile ({post.likes})</span>
                            </button>

                            <button
                              onClick={() =>
                                setExpandedCommentsId(isCommentsOpen ? null : post.id)
                              }
                              className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-slate-900 transition-colors"
                            >
                              <MessageCircle className="w-4 h-4 text-slate-400" />
                              <span>
                                {totalComments}{' '}
                                {totalComments > 1 ? 'commentaires' : 'commentaire'}
                              </span>
                            </button>
                          </div>

                          {post.location && (
                            <button
                              onClick={() => onNavigate('map')}
                              className="text-xs font-medium text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
                            >
                              Voir sur la carte
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Section commentaires dépliable */}
                        {isCommentsOpen && (
                          <div className="px-5 py-4 bg-slate-50 border-t border-slate-200/70 space-y-3">
                            {extraComments.length > 0 ? (
                              <div className="space-y-2.5">
                                {extraComments.map((c, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-white p-3 rounded-xl border border-slate-200/70 text-xs"
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-semibold text-slate-900">
                                        {c.author}
                                      </span>
                                      <span className="text-slate-400 text-[11px]">
                                        {c.time}
                                      </span>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed">{c.text}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500">
                                Posez une question à {post.author.name} ou ajoutez une précision.
                              </p>
                            )}

                            <div className="flex items-center gap-2 pt-1">
                              <input
                                type="text"
                                value={commentDrafts[post.id] || ''}
                                onChange={e =>
                                  setCommentDrafts(prev => ({
                                    ...prev,
                                    [post.id]: e.target.value
                                  }))
                                }
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddComment(post.id);
                                  }
                                }}
                                placeholder="Écrire un commentaire..."
                                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddComment(post.id)}
                                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
                              >
                                Envoyer
                              </button>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </>
            ) : (
              /* SECTION 2 : QUESTIONS & CONSEILS ENTRE VOYAGEURS ET RÉSIDENTS */
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Une question pour préparer votre séjour ?
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Itinéraire, choix de commune où loger, plages avec enfants ou bonnes tables : les habitués vous répondent.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsQuestionOpen(!isQuestionOpen)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors shrink-0 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Poser une question
                  </button>
                </div>

                {isQuestionOpen && (
                  <form
                    onSubmit={handlePublishQuestion}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-semibold text-slate-900">
                        Nouvelle question à la communauté
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsQuestionOpen(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Votre question en une phrase
                        </label>
                        <input
                          type="text"
                          required
                          value={questionTitle}
                          onChange={e => setQuestionTitle(e.target.value)}
                          placeholder="Ex : Quelle plage privilégier avec un bébé côté Sud ?"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Thème
                        </label>
                        <select
                          value={questionCategory}
                          onChange={e => setQuestionCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-600"
                        >
                          <option value="Tourisme">Séjour & Logement</option>
                          <option value="Plages">Plages & Snorkeling</option>
                          <option value="Restaurants">Tables & Spécialités</option>
                          <option value="Retraite">Vivre sur place</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Détails (dates, secteur, envies...)
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={questionBody}
                        onChange={e => setQuestionBody(e.target.value)}
                        placeholder="Précisez votre question pour recevoir des conseils adaptés..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-600 resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsQuestionOpen(false)}
                        className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                      >
                        Publier la question
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {forumTopics.map(topic => {
                    const replies = localTopicReplies[topic.id] || [];
                    const isExpanded = expandedTopicId === topic.id;

                    return (
                      <div
                        key={topic.id}
                        className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden transition-shadow hover:shadow-xs"
                      >
                        <div className="p-5">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                {topic.category}
                              </span>
                              {topic.solved && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Réponse utile
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400">{topic.createdAt}</span>
                          </div>

                          <h3
                            onClick={() =>
                              setExpandedTopicId(isExpanded ? null : topic.id)
                            }
                            className="text-base font-semibold text-slate-900 hover:text-teal-700 cursor-pointer transition-colors"
                          >
                            {topic.title}
                          </h3>

                          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                            {topic.excerpt}
                          </p>

                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                              <img
                                src={topic.author.avatar}
                                alt={topic.author.name}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span>
                                Par <strong className="font-medium text-slate-700">{topic.author.name}</strong>
                              </span>
                            </div>

                            <button
                              onClick={() =>
                                setExpandedTopicId(isExpanded ? null : topic.id)
                              }
                              className="inline-flex items-center gap-1.5 font-semibold text-teal-700 hover:text-teal-800"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              { isExpanded
                                ? 'Masquer les réponses'
                                : `Lire les conseils (${replies.length || topic.repliesCount})` }
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="px-5 py-4 bg-slate-50 border-t border-slate-200/70 space-y-3">
                            <p className="text-xs font-semibold text-slate-700">
                              Réponses de la communauté :
                            </p>
                            <div className="space-y-2.5">
                              {replies.map((r, i) => (
                                <div
                                  key={i}
                                  className="bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs space-y-1"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-slate-900">
                                        {r.author}
                                      </span>
                                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-teal-50 text-teal-800">
                                        {r.role}
                                      </span>
                                    </div>
                                    <span className="text-slate-400">{r.time}</span>
                                  </div>
                                  <p className="text-slate-700 leading-relaxed">{r.text}</p>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <input
                                type="text"
                                value={topicReplyDrafts[topic.id] || ''}
                                onChange={e =>
                                  setTopicReplyDrafts(prev => ({
                                    ...prev,
                                    [topic.id]: e.target.value
                                  }))
                                }
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTopicReply(topic.id);
                                  }
                                }}
                                placeholder="Apporter votre conseil ou retour d'expérience..."
                                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddTopicReply(topic.id)}
                                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
                              >
                                Répondre
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* COLONNE DROITE (5 cols) : État de la mer du jour & Dernières questions */}
          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Carte 1 : Conditions signalées aujourd'hui sur les plages */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Waves className="w-4 h-4 text-teal-700" />
                    État des plages aujourd&apos;hui
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Signalements vérifiés par les nageurs ce matin
                  </p>
                </div>
                <button
                  onClick={() => openModal('add_alert')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold transition-colors shrink-0"
                >
                  + Signaler
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {alerts.map(alert => {
                  const isGood = alert.severity === 'info';
                  const isDanger = alert.severity === 'danger';

                  return (
                    <div key={alert.id} className="p-4 sm:px-5 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              isGood
                                ? 'bg-emerald-500'
                                : isDanger
                                ? 'bg-rose-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-semibold text-slate-900">
                                {alert.location}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                · {alert.commune}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-slate-800 mt-0.5">
                              {alert.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              {alert.description}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp}
                        </span>
                      </div>

                      <div className="mt-2.5 pl-4.5 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Par {alert.reportedBy}</span>
                        {alert.verified ? (
                          <span className="inline-flex items-center gap-1 text-teal-700 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Confirmé sur place
                          </span>
                        ) : (
                          <button
                            onClick={() => verifyAlert(alert.id)}
                            className="text-slate-600 hover:text-teal-700 font-medium underline"
                          >
                            Je confirme aussi
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 text-center">
                <button
                  onClick={() => onNavigate('map')}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
                >
                  <Compass className="w-3.5 h-3.5" />
                  Ouvrir la carte météo des plages
                </button>
              </div>
            </div>

            {/* Carte 2 : Aperçu des questions d'entraide (si on est sur l'onglet En Direct) */}
            {activeSection === 'direct' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-teal-700" />
                    Questions récentes des voyageurs
                  </h3>
                  <button
                    onClick={() => setActiveSection('entraide')}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                  >
                    Tout voir
                  </button>
                </div>

                <div className="space-y-3">
                  {forumTopics.slice(0, 3).map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setActiveSection('entraide');
                        setExpandedTopicId(topic.id);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/60 transition-colors block"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span className="font-medium text-teal-800">{topic.category}</span>
                        <span>{topic.repliesCount} réponses</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">
                        {topic.title}
                      </p>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setActiveSection('entraide');
                    setIsQuestionOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Poser une question aux habitants
                </button>
              </div>
            )}

            {/* Rappel simple et humain sur l'esprit du lieu */}
            <div className="bg-[#F3EFEA] rounded-2xl p-5 border border-stone-200/80">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                L&apos;esprit Martinique Explorer
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Cet espace est tenu par des passionnés de l&apos;île. Merci d&apos;indiquer l&apos;heure approximative lorsque vous signalez la présence de tortues ou l&apos;état d&apos;une anse, et de toujours garder 3 mètres de distance avec la faune marine.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
