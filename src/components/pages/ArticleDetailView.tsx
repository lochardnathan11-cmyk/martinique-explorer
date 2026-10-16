'use client';

import React, { useState } from 'react';
import { BlogPost, PlaceItem } from '@/types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  Compass,
  MessageSquare,
  ThumbsUp,
  ChevronRight
} from 'lucide-react';

interface ArticleDetailViewProps {
  post: BlogPost;
  places: PlaceItem[];
  onBack: () => void;
  onOpenPlace: (place: PlaceItem) => void;
  onNavigateHome: () => void;
}

interface ArticleExtraContent {
  takeaways: string[];
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  localTip: string;
}

const ARTICLE_DETAILS_MAP: Record<string, ArticleExtraContent> = {
  'blog-1': {
    takeaways: [
      'Sud Caraïbe (Salines, Anses-d’Arlet, Sainte-Luce) : eaux calmes, sable blanc et fonds clairs.',
      'Nord Caraïbe (Carbet, Prêcheur, Anse Céron) : sable noir volcanique et panorama sur la Montagne Pelée.',
      'Côte Atlantique (Caravelle, Pointe Faula) : lagons protégés par la barrière de corail et fonds blancs.'
    ],
    sections: [
      {
        heading: '1. Les grandes plages de sable blanc du Sud',
        paragraphs: [
          'La Grande Anse des Salines à Sainte-Anne reste l’archétype de la plage caribéenne : plus d’un kilomètre de sable blond bordé de cocotiers penchés et de raisiniers bord-de-mer qui offrent une ombre naturelle précieuse à midi.',
          'Plus à l’ouest, le secteur de Sainte-Luce propose un chapelet d’anses reliées par un sentier littoral très agréable à parcourir à pied tôt le matin, de l’Anse Gros Raisins jusqu’à l’Anse Mabouya.'
        ]
      },
      {
        heading: '2. Le charme sauvage des anses volcaniques du Nord',
        paragraphs: [
          'Après Saint-Pierre et Le Prêcheur, la route s’arrête à l’Anse Céron et à l’Anse Couleuvre. Ici, le sable gris-noir issu de la Montagne Pelée contraste avec le vert dense de la forêt tropicale et l’îlet la Perle au large.'
        ]
      }
    ],
    localTip: 'En fin de semaine, privilégiez une arrivée avant 9h30 aux Salines ou à l’Anse Michel pour vous garer à l’ombre sous les arbres.'
  },
  'blog-2': {
    takeaways: [
      'Meilleur créneau : entre 7h30 et 9h00 pour profiter d’une mer lisse et d’une bonne luminosité sous-marine.',
      'Distance respectueuse : rester à 3 mètres minimum, sans jamais toucher ni suivre une tortue qui remonte respirer.',
      'Protection du récif : privilégier un t-shirt anti-UV plutôt que de la crème solaire avant la mise à l’eau.'
    ],
    sections: [
      {
        heading: '1. Comprendre les herbiers des Anses-d’Arlet',
        paragraphs: [
          'Les tortues vertes (Chelonia mydas) fréquentent les fonds sableux d’Anse Dufour, d’Anse Noire et de Grande Anse d’Arlet pour brouter les herbiers marins situés entre 2 et 5 mètres de profondeur.',
          'Tandis que les tortues vertes restent au centre de la baie sur l’herbier, les tortues imbriquées s’observent plutôt le long des parois rocheuses où elles cherchent des éponges.'
        ]
      },
      {
        heading: '2. Observer sans perturber l’animal',
        paragraphs: [
          'Une tortue marine remonte régulièrement en surface pour reprendre son souffle. Il est essentiel de toujours rester sur le côté, en flottant calmement en surface, sans jamais se placer au-dessus d’elle.'
        ]
      }
    ],
    localTip: 'Si le petit parking d’Anse Dufour est complet après 9h30, Grande Anse d’Arlet offre beaucoup plus d’espace et ses herbiers abritent tout autant de tortues.'
  },
  'blog-3': {
    takeaways: [
      'Secteurs les plus recherchés : Sainte-Luce, Le Diamant, Les Trois-Îlets et Le Marin pour les services et la douceur de vivre.',
      'Santé et infrastructures : réseau médical complet autour de Fort-de-France / Le Lamentin et cliniques de proximité.',
      'Conseil avant d’acheter : louer d’abord pendant 3 à 6 mois pour tester les temps de trajet quotidiens.'
    ],
    sections: [
      {
        heading: '1. Choisir sa commune selon son rythme de vie',
        paragraphs: [
          'Le Sud Caraïbe (Sainte-Luce, Le Diamant) séduit par son ensoleillement, ses marchés matinaux et ses sentiers côtiers accessibles à pied. Les Trois-Îlets offrent en plus la liaison directe par navette maritime vers le centre de Fort-de-France en 20 minutes.',
          'Pour les amateurs de voile et de plaisance, le bassin du Marin et de Sainte-Anne constitue le point d’ancrage principal dans les Petites Antilles.'
        ]
      },
      {
        heading: '2. Vie pratique et budget sur place',
        paragraphs: [
          'Privilégier les marchés locaux, les producteurs de fruits et légumes du pays et la pêche côtière permet à la fois de mieux manger et de maîtriser son budget au quotidien.'
        ]
      }
    ],
    localTip: 'Testez toujours un quartier aux heures de pointe du matin (7h–8h30) avant de vous engager sur une location longue durée.'
  },
  'blog-4': {
    takeaways: [
      'Patrimoine culturel : la yole ronde de Martinique est inscrite au patrimoine culturel immatériel de l’UNESCO.',
      'Particularité nautique : embarcation en bois sans quille, sans gouvernail ni lest, équilibrée par les coursiers sur les « bois dressés ».',
      'Ambiance à terre : arrivée d’étape festive chaque après-midi dans les communes côtières.'
    ],
    sections: [
      {
        heading: '1. Un équilibre unique au monde sur les bois dressés',
        paragraphs: [
          'Inspirée des anciens gommiers de pêche, la yole ronde navigue grâce à l’agilité de son équipage. Pour compenser la poussée du vent dans la grande voile, les yoleurs se suspendent au-dessus de l’eau sur de longues perches en bois (« les bois dressés ») côté vent.',
          'Chaque étape relie deux communes du littoral, offrant un spectacle coloré aussi bien depuis les falaises et les plages que sur les embarcations suiveuses.'
        ]
      },
      {
        heading: '2. Les meilleurs points de vue depuis la côte',
        paragraphs: [
          'Sur la côte Caraïbe, la descente entre Saint-Pierre, Le Carbet et Fort-de-France ou le passage devant le Rocher du Diamant permettent de suivre les régates à quelques centaines de mètres du rivage.'
        ]
      }
    ],
    localTip: 'Les jours d’étape, les bourgs d’arrivée ferment souvent leur front de mer aux voitures dès la fin de matinée : prévoyez du covoiturage ou arrivez tôt.'
  },
  'blog-5': {
    takeaways: [
      'Période de ponte : de mars à juillet pour la tortue luth, suivie des émergences de nouveau-nés jusqu’en septembre.',
      'Plages concernées : principalement les grandes plages de sable volcanique du Nord et les anses sauvages.',
      'Précaution essentielle : aucune lumière blanche ni flash photo la nuit sur les plages de ponte.'
    ],
    sections: [
      {
        heading: '1. Le retour nocturne des géantes des mers',
        paragraphs: [
          'La tortue luth (Dermochelys coriacea), qui peut dépasser 1,70 mètre et 400 kg, parcourt des milliers de kilomètres à travers l’Atlantique pour venir pondre sur les plages martiniquaises.',
          'La femelle monte sur le haut de plage à la nuit tombée, creuse son nid dans le sable profond, puis regagne le large après environ deux heures.'
        ]
      },
      {
        heading: '2. Pourquoi la lumière artificielle est un danger',
        paragraphs: [
          'Les tortues adultes comme les nouveau-nés s’orientent grâce à la clarté naturelle de l’horizon marin. Une lampe torche ou un écran de téléphone suffit à les désorienter vers l’intérieur des terres.'
        ]
      }
    ],
    localTip: 'Rapprochez-vous des associations locales du Réseau Tortues Marines Martinique pour participer à des suivis encadrés.'
  },
  'blog-6': {
    takeaways: [
      'Géographie protectrice : les courants et les alizés poussent les bancs d’algues d’est en ouest vers la côte Atlantique.',
      'Côte Caraïbe préservée : de Saint-Pierre aux Anses-d’Arlet, la mer reste claire la quasi-totalité de l’année.',
      'Alternative côté Est : les plages protégées par la presqu’île de la Caravelle (Tartane) restent souvent épargnées.'
    ],
    sections: [
      {
        heading: '1. L’effet bouclier du relief martiniquais',
        paragraphs: [
          'Les radeaux de sargasses dérivent depuis l’Atlantique équatorial poussés par les vents d’est (les alizés). Lorsqu’ils approchent de l’île, seules certaines baies orientées plein est sur la façade Atlantique (Le Robert, Le François, Le Vauclin) peuvent être touchées ponctuellement.',
          'Toute la façade ouest (côte Caraïbe) ainsi que l’extrême sud se trouvent sous le vent de l’île et conservent une eau limpide.'
        ]
      },
      {
        heading: '2. Adapter son programme de baignade',
        paragraphs: [
          'En cas d’arrivage signalé sur un secteur de la côte Atlantique, il suffit généralement de basculer à 25 minutes de route vers la côte Caraïbe (Sainte-Luce, Le Diamant, Anses-d’Arlet) pour retrouver une mer parfaitement propre.'
        ]
      }
    ],
    localTip: 'Consultez les signalements du matin dans l’onglet Communauté avant de choisir votre plage du jour.'
  },
  'blog-7': {
    takeaways: [
      'Quatre jours uniques : du Dimanche Gras au Mercredi des Cendres, chaque journée possède son code couleur.',
      'Participation ouverte : tout le monde est invité à s’habiller selon le thème du jour pour suivre les groupes à pied.',
      'Respect des traditions : le Mercredi des Cendres clôt la fête en noir et blanc avec l’incinération de Vaval.'
    ],
    sections: [
      {
        heading: '1. Le calendrier des couleurs jour par jour',
        paragraphs: [
          'Le Dimanche Gras ouvre les festivités en couleurs vives avec la présentation de Sa Majesté Vaval. Le Lundi Gras est célèbre pour ses mariages burlesques dès l’aube et ses parades satiriques.',
          'Le Mardi Gras voit toute l’île se vêtir de rouge et de noir pour le défilé des Diables Rouges, avant le grand final en noir et blanc du Mercredi des Cendres.'
        ]
      }
    ],
    localTip: 'Pour profiter des vidés à Fort-de-France sans souci de stationnement, prenez la navette maritime depuis les Trois-Îlets.'
  },
  'blog-8': {
    takeaways: [
      'Seule AOC au monde : le Rhum Agricole de la Martinique est élaboré exclusivement à partir de pur jus de canne frais.',
      'Saison de récolte : la coupe de la canne et la distillation fument généralement de février à juin.',
      'Patrimoine et jardins : la plupart des habitations se visitent aussi pour leurs parcs botaniques et leur architecture.'
    ],
    sections: [
      {
        heading: '1. Du Nord volcanique aux terres du Sud',
        paragraphs: [
          'Au pied de la Montagne Pelée à Saint-Pierre, la distillerie Depaz bénéficie d’un terroir volcanique filtrant et d’une eau de source pure. Un peu plus au sud, au Carbet, la distillerie Neisson perpétue un savoir-faire familial reconnu.',
          'Côté Atlantique, l’Habitation Clément au François allie chais de vieillissement, maison créole classée du XVIIIe siècle et fondation d’art contemporain au cœur d’un grand parc arboré.'
        ]
      }
    ],
    localTip: 'Les visites de distilleries sont particulièrement vivantes le matin en semaine pendant la période de récolte (février à mai) lorsque les moulins tournent.'
  },
  'blog-9': {
    takeaways: [
      'Baignade au large : les « fonds blancs » sont des bancs de sable clair immergés à 1 mètre de profondeur derrière la barrière de corail.',
      'Îlet Chancel (Le Robert) : abrite l’une des dernières colonies d’iguanes délicatissimes des Petites Antilles.',
      'Accès : en kayak des mers depuis la Pointe Savane, en yole traditionnelle ou avec un marin-pêcheur local.'
    ],
    sections: [
      {
        heading: '1. La Baignoire de Joséphine et les îlets du François',
        paragraphs: [
          'Située entre l’Îlet Thierry et l’Îlet Oscar dans la baie du François, la célèbre Baignoire de Joséphine est un haut-fond de sable corallien entouré d’eaux plus profondes. Protégée de la houle de l’Atlantique par la barrière récifale, l’eau y reste chaude et transparente.',
          'Pour éviter l’affluence de la mi-journée, privilégiez les départs matinaux vers 8h30 ou les sorties en petit comité vers les fonds blancs du Robert et de l’Îlet Madame.'
        ]
      },
      {
        heading: '2. Explorer la baie du Robert en kayak',
        paragraphs: [
          'Au départ du Robert, la traversée en kayak permet de rejoindre à son rythme l’Îlet Chancel pour observer les iguanes endémiques et les vestiges de l’ancienne poterie du XVIIIe siècle, avant de faire halte sur la petite plage de sable clair de l’Îlet Madame.'
        ]
      }
    ],
    localTip: 'Prévoyez impérativement un t-shirt anti-UV à manches longues et un chapeau : la réverbération du soleil sur l’eau claire des fonds blancs est très intense.'
  },
  'blog-10': {
    takeaways: [
      'Départ matinal : commencez l’ascension de la Montagne Pelée par l’Aileron dès 6h45 – 7h00 pour devancer les nuages au sommet.',
      'Gorges de la Falaise (Ajoupa-Bouillon) : remontée aquatique rafraîchissante entre deux hautes parois volcaniques.',
      'Canal de Beauregard (Canal des Esclaves) : marche plate et panoramique au cœur de la forêt tropicale.'
    ],
    sections: [
      {
        heading: '1. L’ascension de la Montagne Pelée (1 397 m)',
        paragraphs: [
          'Point culminant de l’île inscrit au patrimoine mondial de l’UNESCO, le volcan se gravit principalement depuis le parking de l’Aileron au Morne-Rouge. Le sentier grimpe de façon soutenue jusqu’au rebord de la caldeira, offrant par temps clair une vue saisissante sur la mer des Caraïbes, l’océan Atlantique et la Dominique.',
          'Même lorsqu’il fait 30°C sur la plage, la température au sommet peut descendre à 16°C avec du vent et de l’humidité : emportez toujours un coupe-vent imperméable et des chaussures crantées.'
        ]
      },
      {
        heading: '2. Après la randonnée : les plages volcaniques du Prêcheur',
        paragraphs: [
          'En redescendant vers Saint-Pierre et Le Prêcheur, les plages d’Anse Turin, d’Anse Céron et d’Anse Couleuvre sont idéales pour se détendre à l’ombre des cocotiers face à l’îlet la Perle.'
        ]
      }
    ],
    localTip: 'Consultez la webcam ou la météo du Morne-Rouge tôt le matin : si le dôme de la Pelée est dégagé à 6h30, c’est la journée idéale pour monter.'
  }
};

export default function ArticleDetailView({
  post,
  places,
  onBack,
  onOpenPlace,
  onNavigateHome
}: ArticleDetailViewProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(34);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<
    { id: string; author: string; date: string; text: string }[]
  >([
    {
      id: 'c1',
      author: 'Stéphane B.',
      date: 'Il y a 2 jours',
      text: 'Merci pour ces précisions très concrètes, cela nous a beaucoup aidés à organiser nos déplacements sur place.'
    }
  ]);

  const extra = ARTICLE_DETAILS_MAP[post.id] || ARTICLE_DETAILS_MAP['blog-1'];

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
        author: 'Voyageur',
        date: 'À l\'instant',
        text: newComment.trim()
      },
      ...prev
    ]);
    setNewComment('');
  };

  const relatedPlaces = places
    .filter(p => {
      if (post.id === 'blog-2') {
        return p.id === 'anse-dufour' || p.id === 'anse-noire' || p.category === 'snorkeling';
      }
      if (post.id === 'blog-1' || post.id === 'blog-6') {
        return p.category === 'beach';
      }
      return p.featured;
    })
    .slice(0, 3);

  return (
    <article className="space-y-10 pb-16 text-left">
      {/* 1. Fil d'Ariane et bouton retour */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4 text-xs">
        <nav className="flex items-center gap-2 text-slate-500 flex-wrap">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-teal-700 transition-colors cursor-pointer"
          >
            Accueil
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <button
            type="button"
            onClick={onBack}
            className="hover:text-teal-700 transition-colors cursor-pointer"
          >
            Actualités & Carnets
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-medium truncate max-w-[220px] sm:max-w-md">
            {post.title}
          </span>
        </nav>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors cursor-pointer font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tous les articles</span>
        </button>
      </div>

      {/* 2. En-tête de l'article */}
      <header className="space-y-5 max-w-4xl">
        <div className="space-y-3">
          <span className="inline-block px-3 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60 text-xs font-semibold">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {post.summary}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-slate-200/80 text-xs text-slate-500">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-slate-900">Par {post.author}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {post.date}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLike}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                liked
                  ? 'bg-teal-50 border-teal-300 text-teal-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Utile ({likeCount})</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-xs font-medium cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-teal-700" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              <span>{copied ? 'Lien copié' : 'Partager'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Photo principale */}
      <div className="rounded-2xl overflow-hidden border border-slate-200/80 aspect-[16/9] max-h-[460px] bg-slate-100">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 4. Corps de l'article + Colonne latérale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-8 text-slate-800 text-base leading-relaxed">
          {/* Encadré Points clés adapté au sujet */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Points clés à retenir
            </h2>
            <ul className="space-y-2 text-sm text-stone-700 list-disc pl-4">
              {extra.takeaways.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contenu éditorial */}
          <div className="space-y-6">
            <p className="text-lg text-slate-900 font-medium leading-relaxed">
              {post.content}
            </p>

            {extra.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3 pt-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {sec.heading}
                </h2>
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-slate-700 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ))}

            <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200/70 space-y-1.5">
              <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                Le conseil sur place
              </h3>
              <p className="text-sm text-teal-950/85 leading-relaxed">
                {extra.localTip}
              </p>
            </div>
          </div>

          {/* Commentaires de l'article */}
          <div className="pt-8 border-t border-slate-200/80 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-700" />
              Commentaires & retours ({comments.length})
            </h3>

            <form onSubmit={handleAddComment} className="space-y-3">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Une question ou un retour d'expérience sur ce sujet ?"
                rows={3}
                className="w-full p-3.5 rounded-xl bg-white border border-slate-200 focus:border-teal-700 focus:outline-none text-sm text-slate-800 placeholder:text-slate-400"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Publier
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {comments.map(c => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">{c.author}</span>
                    <span className="text-slate-400">{c.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne de droite */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700">
                À découvrir sur place
              </span>
              <h4 className="font-bold text-slate-900 text-base mt-0.5">
                Lieux liés à cet article
              </h4>
            </div>

            <div className="space-y-2.5">
              {relatedPlaces.map(place => (
                <div
                  key={place.id}
                  onClick={() => onOpenPlace(place)}
                  className="group p-2.5 rounded-xl border border-slate-200/80 hover:border-teal-700/50 bg-slate-50/50 hover:bg-white transition-all flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={place.photos[0]}
                    alt={place.name}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-semibold text-slate-900 group-hover:text-teal-700 truncate">
                      {place.name}
                    </h5>
                    <p className="text-[11px] text-slate-500 truncate">
                      {place.commune}
                    </p>
                    <span className="inline-block text-[11px] text-teal-700 font-medium mt-0.5">
                      Voir la fiche →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F3EFEA] border border-stone-200/90 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">
              Repérer ces lieux sur la carte
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Visualisez les plages, les accès routiers et la météo côtière en temps réel sur la carte de l&apos;île.
            </p>
            <a
              href="/carte"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Ouvrir la carte</span>
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}
