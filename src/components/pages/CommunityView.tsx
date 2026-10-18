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
  Image as ImageIcon,
  Sun,
  Wind,
  Thermometer
} from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

interface CommunityViewProps {
  onNavigate?: (tab: string) => void;
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
    url: '/images/spots/anse-dufour.jpg'
  },
  {
    label: 'Les Salines',
    url: '/images/spots/salines.jpg'
  },
  {
    label: 'Le Diamant',
    url: '/images/spots/diamant.jpg'
  },
  {
    label: 'Fonds Blancs',
    url: '/images/spots/baignoire-josephine.jpg'
  }
];

const MORNING_PHOTO_STORIES = [
  {
    id: 'st-1',
    spot: 'Anse Dufour',
    commune: 'Anses-d’Arlet',
    time: '07h45',
    condition: 'Eau miroir · 2 tortues',
    image: '/images/spots/anse-dufour.jpg'
  },
  {
    id: 'st-2',
    spot: 'Les Salines',
    commune: 'Sainte-Anne',
    time: '08h30',
    condition: 'Sable propre · Mer calme',
    image: '/images/spots/salines.jpg'
  },
  {
    id: 'st-3',
    spot: 'Plage de Dizac',
    commune: 'Le Diamant',
    time: '09h15',
    condition: 'Houle modérée · Ciel clair',
    image: '/images/spots/diamant.jpg'
  },
  {
    id: 'st-4',
    spot: 'Fonds Blancs',
    commune: 'Le François',
    time: '10h00',
    condition: 'Eau turquoise · Alizés 15 nds',
    image: '/images/spots/baignoire-josephine.jpg'
  }
];

const COASTAL_SECTORS_SUMMARY = [
  {
    sector: 'Côte Sud-Caraïbe',
    communes: 'Anses-d’Arlet, Trois-Îlets, Sainte-Luce',
    sea: 'Mer calme à ridée',
    sargassum: 'Aucune sargasse',
    statusColor: 'bg-emerald-500'
  },
  {
    sector: 'Extrême Sud',
    communes: 'Sainte-Anne, Les Salines, Anse Michel',
    sea: 'Clapot léger sous l’alizé',
    sargassum: 'Plages propres',
    statusColor: 'bg-emerald-500'
  },
  {
    sector: 'Nord Caraïbe & Pelée',
    communes: 'Le Carbet, Saint-Pierre, Le Prêcheur',
    sea: 'Eau très claire',
    sargassum: 'Aucune sargasse',
    statusColor: 'bg-emerald-500'
  },
  {
    sector: 'Façade Atlantique',
    communes: 'Tartane, Le Robert, Le François',
    sea: 'Lagon abrité · Houle au large',
    sargassum: 'Arrivage ponctuel (Cap Est)',
    statusColor: 'bg-amber-500'
  }
];

export const CommunityView: React.FC<CommunityViewProps> = ({ onNavigate = () => {} }) => {
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

  const [activeSection, setActiveSection] = useState<'direct' | 'entraide'>('direct');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Composer state (observations & photos)
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [postText, setPostText] = useState('');
  const [postLocation, setPostLocation] = useState('Les Anses-d\'Arlet');
  const [postCategory, setPostCategory] = useState<'plage' | 'snorkeling' | 'adresse'>('plage');
  const [postPhoto, setPostPhoto] = useState('');
  const [showPresetPhotos, setShowPresetPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Composer state (questions)
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionCategory, setQuestionCategory] = useState<'Tourisme' | 'Plages' | 'Restaurants' | 'Retraite'>('Tourisme');
  const [questionBody, setQuestionBody] = useState('');

  // Comments state on feed posts
  const [expandedCommentsId, setExpandedCommentsId] = useState<string | null>('post-2');
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [localComments, setLocalComments] = useState<
    Record<string, Array<{ author: string; text: string; time: string }>>
  >({
    'post-1': [
      {
        author: 'Marc L.',
        text: 'Merci pour l’info ! On hésitait à descendre au Diamant cet après-midi, on va se poser vers Dizac.',
        time: 'Il y a 40 min'
      },
      {
        author: 'Sophie T.',
        text: 'Le marché couvert du Diamant juste en face de la plage est ouvert jusqu’à 13h si vous cherchez des fruits frais.',
        time: 'Il y a 25 min'
      }
    ],
    'post-2': [
      {
        author: 'Yannick B.',
        text: 'Superbe photo ! En longeant la pointe rocheuse de droite à Anse Dufour, on croise aussi souvent des poissons-coffres et des seiches.',
        time: 'Il y a 2h'
      },
      {
        author: 'Nadia K.',
        text: 'Merci pour l’heure du parking, nous y allons demain matin à 7h30 !',
        time: 'Il y a 1h'
      }
    ],
    'post-3': [
      {
        author: 'Laurent & Éva',
        text: 'Testé mardi dernier au coucher du soleil, la dorade grillée sauce chien était excellente.',
        time: 'Il y a 3h'
      }
    ],
    'post-4': [
      {
        author: 'Olivier D.',
        text: 'Au retour de la randonnée, la plage de la Brèche à Tartane est parfaite pour se rafraîchir sans vagues.',
        time: 'Il y a 5h'
      }
    ]
  });

  // Replies for Q&A topics
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>('f-1');
  const [topicReplyDrafts, setTopicReplyDrafts] = useState<Record<string, string>>({});
  const [localTopicReplies, setLocalTopicReplies] = useState<
    Record<string, Array<{ author: string; role: string; text: string; time: string }>>
  >({
    'f-1': [
      {
        author: 'Yannick B.',
        role: 'Habitant',
        text: 'Avec deux enfants, Sainte-Luce est idéale : le sentier côtier relie toutes les anses à pied (Gros Raisins, Pont Café, Corps de Garde) et la mer y est très calme.',
        time: 'Aujourd\'hui'
      },
      {
        author: 'Claire M.',
        role: 'Voyageuse',
        text: 'Nous avions logé aux Trois-Îlets (Anse à l’Âne) : très pratique pour prendre la navette maritime vers Fort-de-France sans voiture et descendre en 15 min à Anse Dufour.',
        time: 'Aujourd\'hui'
      }
    ],
    'f-2': [
      {
        author: 'Mélissa G.',
        role: 'Habitante aux Anses-d’Arlet',
        text: 'À Anse Dufour, le parking est tout petit : visez entre 7h30 et 8h15 maximum. En revanche, à Grande Anse ou au bourg des Anses-d’Arlet, il y a de grands parkings en retrait où l’on trouve de la place toute la matinée.',
        time: 'Aujourd\'hui'
      }
    ],
    'f-3': [
      {
        author: 'Fabrice K.',
        role: 'Habitant',
        text: 'Sur la route des Anses-d’Arlet ou à l’entrée de Sainte-Anne dès 11h30, repérez les fumoirs en bord de route. Accompagné de bananes plantains pesées et d’un jus de prune de cythère, c’est imbattable.',
        time: 'Hier'
      }
    ],
    'f-4': [
      {
        author: 'Olivier D.',
        role: 'Habitant',
        text: 'Évitez les petits moteurs de 60/70 ch si vous êtes 4 avec des bagages : les côtes des Anses-d’Arlet, du Morne Larcher ou du Prêcheur sont vraiment raides. Une citadine turbo (90 ch+) ou une boîte automatique passe partout sans forcer.',
        time: 'Hier'
      }
    ],
    'f-5': [
      {
        author: 'Marie-Paule',
        role: 'Résidente à Sainte-Luce',
        text: 'Le bourg de Sainte-Luce est très agréable à vivre sur la durée : marché tous les matins, médecins et pharmacies sur place, marche aquatique (longe-côte) plusieurs fois par semaine et port du Marin à 15 minutes.',
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

  const cleanBadgeText = (badge?: string, isLocal?: boolean) => {
    if (isLocal) return 'Habitant';
    if (!badge) return 'Voyageur';
    const stripped = badge.replace(/[^\p{L}\p{N}\s-]/gu, '').trim();
    return stripped || 'Voyageur';
  };

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
    <div className="space-y-8 text-left">
      {/* 1. BANDEAU ÉDITORIAL CHALEUREUX AVEC MÉTÉO DU JOUR */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white border border-slate-200/80 shadow-xs">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80"
            alt="Rivage de Martinique au matin"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-slate-900/40" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
                Carnet de route collaboratif · Martinique
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                En direct des anses & entraide locale
              </h1>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Les observations partagées ce matin par les nageurs et les habitants : clarté de l&apos;eau, présence des tortues, places de parking et conseils pour organiser votre séjour.
              </p>
            </div>

            {/* Sélecteur d'espace principal */}
            <div className="inline-flex p-1 bg-white/15 backdrop-blur-md rounded-xl border border-white/20 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setActiveSection('direct')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeSection === 'direct'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                En direct des plages ({posts.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('entraide')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeSection === 'entraide'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                Questions & Conseils ({forumTopics.length})
              </button>
            </div>
          </div>

          {/* Barre de synthèse météo côtière du jour */}
          <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-200">
            <div className="flex flex-wrap items-center gap-5">
              <span className="inline-flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-teal-300" />
                <span>Eau : <strong className="text-white">28°C</strong></span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-300" />
                <span>Air : <strong className="text-white">30°C (Belles éclaircies)</strong></span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-sky-300" />
                <span>Alizés d&apos;Est : <strong className="text-white">15 nœuds</strong></span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Côte Caraïbe : <strong className="text-white">Mer calme, 0 sargasse</strong></span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveSection('direct');
                setIsComposerOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 hover:text-teal-200 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Partager une photo du jour →</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. GALERIE RAPIDE : "LES ANSES EN IMAGES CE MATIN" */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Aperçu des plages ce matin
            </h2>
            <p className="text-xs text-slate-500">
              Derniers retours photographiques envoyés depuis le bord de mer
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('map')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Voir sur la carte</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {MORNING_PHOTO_STORIES.map(story => (
            <div
              key={story.id}
              onClick={() => onNavigate('map')}
              className="group relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-200/80 cursor-pointer"
            >
              <img
                src={story.image}
                alt={story.spot}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/55 backdrop-blur-xs text-[10px] font-medium text-white">
                {story.time}
              </span>
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <div className="text-xs font-bold leading-tight">{story.spot}</div>
                <div className="text-[11px] text-emerald-300 font-medium mt-0.5 truncate">
                  {story.condition}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CONTENU PRINCIPAL EN 2 COLONNES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLONNE GAUCHE (7 colonnes) : Fil en direct OU Questions d'entraide */}
        <div className="lg:col-span-7 space-y-6">
          {activeSection === 'direct' ? (
            <>
              {/* Boîte de publication épurée */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                {!isComposerOpen ? (
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setIsComposerOpen(true)}
                      className="flex-1 flex items-center gap-3.5 text-left group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 font-bold text-sm shrink-0">
                        {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'M'}
                      </div>
                      <div className="flex-1 py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-500 text-xs sm:text-sm group-hover:bg-slate-100/80 group-hover:border-slate-300 transition-colors">
                        Vous êtes sur une plage ? Partagez une photo, l&apos;état de l&apos;eau ou une bonne adresse...
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsComposerOpen(true);
                        setTimeout(() => fileInputRef.current?.click(), 100);
                      }}
                      className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors shrink-0 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-teal-700" />
                      Photo
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePublishPost} className="p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-semibold text-slate-900">
                        Partager une observation aujourd&apos;hui
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsComposerOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={postText}
                      onChange={e => setPostText(e.target.value)}
                      placeholder="Précisez la plage, l'heure, la visibilité sous l'eau ou l'affluence sur le parking..."
                      className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-teal-600 transition-colors resize-none"
                      required
                      autoFocus
                    />

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
                          className="absolute top-2.5 right-2.5 bg-slate-900/75 hover:bg-slate-900 text-white p-1.5 rounded-full transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {showPresetPhotos && !postPhoto && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-600">
                            Ou sélectionner une photo d&apos;illustration :
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowPresetPhotos(false)}
                            className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
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
                              className="group relative rounded-lg overflow-hidden h-16 border border-slate-200 hover:border-teal-600 transition-all cursor-pointer"
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
                        <CustomSelect
                          value={postLocation}
                          onChange={val => setPostLocation(val)}
                          options={COMMUNES_LIST.map(c => ({ value: c, label: c }))}
                          buttonClassName="py-2 bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Sujet
                        </label>
                        <CustomSelect
                          value={postCategory}
                          onChange={val => setPostCategory(val as any)}
                          options={[
                            { value: 'plage', label: 'État de la plage & météo' },
                            { value: 'snorkeling', label: 'Tortues & fonds marins' },
                            { value: 'adresse', label: 'Bonne table / Conseil' }
                          ]}
                          buttonClassName="py-2 bg-slate-50"
                        />
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-teal-700" />
                          Importer une photo
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPresetPhotos(!showPresetPhotos)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                          Photos de l&apos;île
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsComposerOpen(false)}
                          className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Publier
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Filtres de publications */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {[
                    { id: 'all', label: `Toutes les observations (${posts.length})` },
                    { id: 'plage', label: 'État des plages & Rando' },
                    { id: 'snorkeling', label: 'Tortues & Snorkeling' },
                    { id: 'adresse', label: 'Tables & Pêche du jour' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedFilter(tab.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
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
                                    type="button"
                                    onClick={() => onNavigate('map')}
                                    className="inline-flex items-center gap-1 text-slate-700 font-medium hover:text-teal-700 transition-colors cursor-pointer"
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
                          <span className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-full">
                            {categoryLabel}
                          </span>
                          {userRole === 'admin' && (
                            <button
                              type="button"
                              onClick={() => deletePost(post.id)}
                              className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer la publication"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="px-5 pb-4">
                        <p className="text-slate-800 text-[15px] leading-relaxed">
                          {post.content}
                        </p>
                      </div>

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

                      <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center gap-5">
                          <button
                            type="button"
                            onClick={() => likePost(post.id)}
                            className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-rose-600 transition-colors group cursor-pointer"
                          >
                            <Heart className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                            <span>Utile ({post.likes})</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedCommentsId(isCommentsOpen ? null : post.id)
                            }
                            className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
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
                            type="button"
                            onClick={() => onNavigate('map')}
                            className="text-xs font-medium text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 cursor-pointer"
                          >
                            Localiser sur la carte
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

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
                              placeholder="Ajouter un commentaire ou poser une question..."
                              className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddComment(post.id)}
                              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer"
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
                    Questions pratiques & entraide entre voyageurs et résidents
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Itinéraire, commune où loger, plages avec enfants, voiture de location ou bonnes tables : posez votre question.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuestionOpen(!isQuestionOpen)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
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
                      Poser une question à la communauté
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsQuestionOpen(false)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
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
                        placeholder="Ex : Quelle plage privilégier avec de jeunes enfants côté Sud ?"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Thème
                      </label>
                      <CustomSelect
                        value={questionCategory}
                        onChange={val => setQuestionCategory(val as any)}
                        options={[
                          { value: 'Tourisme', label: 'Séjour & Logement' },
                          { value: 'Plages', label: 'Plages & Snorkeling' },
                          { value: 'Restaurants', label: 'Tables & Spécialités' },
                          { value: 'Retraite', label: 'Vivre sur place' }
                        ]}
                        buttonClassName="py-2 bg-slate-50"
                      />
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
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
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
                                Réponse d&apos;habitant
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
                            type="button"
                            onClick={() =>
                              setExpandedTopicId(isExpanded ? null : topic.id)
                            }
                            className="inline-flex items-center gap-1.5 font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            {isExpanded
                              ? 'Masquer les réponses'
                              : `Lire les réponses (${replies.length || topic.repliesCount})`}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200/70 space-y-3">
                          <p className="text-xs font-semibold text-slate-700">
                            Conseils partagés par la communauté :
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
                              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer"
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

        {/* COLONNE DROITE (5 colonnes) : Bulletin des côtes, Signalements plages & Repères */}
        <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Carte 1 : Synthèse par façade côtière */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Bilan côtier par secteur
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Conditions générales observées aujourd&apos;hui sur les 4 façades de l&apos;île
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {COASTAL_SECTORS_SUMMARY.map(item => (
                <div
                  key={item.sector}
                  className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      {item.sector}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${item.statusColor} shrink-0`} />
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{item.communes}</p>
                  <div className="pt-1 text-[11px] font-medium text-slate-700">
                    {item.sea} · <span className="text-teal-800">{item.sargassum}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carte 2 : Signalements précis par plage */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Waves className="w-4 h-4 text-teal-700" />
                  Signalements en direct ({alerts.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Derniers relevés envoyés par les baigneurs
                </p>
              </div>
              <button
                type="button"
                onClick={() => openModal('add_alert')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shrink-0 cursor-pointer"
              >
                + Signaler
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-[440px] overflow-y-auto">
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
                            <span className="text-xs font-bold text-slate-900">
                              {alert.location}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              · {alert.commune}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800 mt-0.5">
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
                          type="button"
                          onClick={() => verifyAlert(alert.id)}
                          className="text-slate-600 hover:text-teal-700 font-medium underline cursor-pointer"
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
                type="button"
                onClick={() => onNavigate('map')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                Ouvrir la carte interactive des plages
              </button>
            </div>
          </div>

          {/* Carte 3 : Questions récentes des voyageurs */}
          {activeSection === 'direct' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-teal-700" />
                  Entraide & questions récentes
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveSection('entraide')}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
                >
                  Voir les {forumTopics.length} sujets
                </button>
              </div>

              <div className="space-y-2.5">
                {forumTopics.slice(0, 4).map(topic => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => {
                      setActiveSection('entraide');
                      setExpandedTopicId(topic.id);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/60 transition-colors block cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold text-teal-800">{topic.category}</span>
                      <span>{topic.repliesCount} réponses</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">
                      {topic.title}
                    </p>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveSection('entraide');
                  setIsQuestionOpen(true);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Poser une question aux habitants
              </button>
            </div>
          )}

          {/* Carte 4 : Les 3 repères pratiques des habitués */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-stone-200/90 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Bonnes habitudes sur l&apos;île
            </h3>
            <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
              <li>
                <strong className="text-stone-800">Parkings des petites anses :</strong> à Anse Dufour et Anse Noire, arrivez avant 8h15 ou après 15h30 pour vous garer sans gêner les riverains.
              </li>
              <li>
                <strong className="text-stone-800">Poisson frais des pêcheurs :</strong> retour des yoles de pêche entre 10h30 et 12h00 au bourg des Anses-d&apos;Arlet, à Sainte-Luce et à Tartane.
              </li>
              <li>
                <strong className="text-stone-800">Navette maritime :</strong> pour visiter Fort-de-France sans embouteillage, prenez la vedette depuis la Pointe du Bout ou l&apos;Anse Mitan (20 min de traversée).
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CommunityView;
