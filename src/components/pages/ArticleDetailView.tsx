'use client';

import React, { useState } from 'react';
import { BlogPost, PlaceItem } from '@/types';
import { INITIAL_BLOG_POSTS } from '@/data/mockData';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  Compass,
  MessageSquare,
  ThumbsUp,
  ChevronRight,
  MapPin,
  Sun,
  Camera,
  ArrowRight
} from 'lucide-react';

interface ArticleDetailViewProps {
  post: BlogPost;
  places: PlaceItem[];
  onBack: () => void;
  onOpenPlace: (place: PlaceItem) => void;
  onOpenArticle?: (post: BlogPost) => void;
  onNavigateHome: () => void;
}

interface ArticleSection {
  heading: string;
  paragraphs: string[];
  photo?: {
    url: string;
    caption: string;
    placeLabel?: string;
  };
}

interface ArticleExtraContent {
  heroCaption: string;
  quickFacts: {
    sector: string;
    bestPeriod: string;
    idealMoment: string;
  };
  takeaways: string[];
  sections: ArticleSection[];
  gallery: Array<{
    url: string;
    caption: string;
  }>;
  localTip: string;
  relatedPlaceIds: string[];
}

const ARTICLE_DETAILS_MAP: Record<string, ArticleExtraContent> = {
  'blog-1': {
    heroCaption: 'Grande Anse des Salines à Sainte-Anne : plus d’un kilomètre de sable blond bordé de cocotiers inclinés sur la mer des Caraïbes.',
    quickFacts: {
      sector: 'Sud Caraïbe, Nord Volcanique & Côte Atlantique',
      bestPeriod: 'Toute l’année (mer très calme de déc. à mai)',
      idealMoment: 'Avant 9h30 ou en fin d’après-midi (16h–18h)'
    },
    takeaways: [
      'Sud Caraïbe (Les Salines, Anses-d’Arlet, Sainte-Luce) : eaux calmes, sable blanc corallien et fonds clairs.',
      'Nord Caraïbe (Le Carbet, Le Prêcheur, Anse Céron, Anse Couleuvre) : sable noir volcanique et panorama sur la Montagne Pelée.',
      'Côte Atlantique (Presqu’île de la Caravelle, Pointe Faula) : lagons protégés par la barrière de corail et fonds blancs peu profonds.'
    ],
    sections: [
      {
        heading: '1. Les grandes anses de sable blond du Sud (Sainte-Anne, Anses-d’Arlet, Sainte-Luce)',
        paragraphs: [
          'La Grande Anse des Salines à Sainte-Anne reste l’archétype de la plage caribéenne : un arc de sable clair bordé de cocotiers penchés et de raisiniers bord-de-mer qui offrent une ombre naturelle précieuse aux heures chaudes. Juste avant d’arriver à la pointe sud, la plage de Pointe Marin séduit les familles par son lagon sans vagues.',
          'En remontant vers l’ouest, Rivière-Pilote (Anse Figuier) et les Anses-d’Arlet (Grande Anse, Bourg des Anses-d’Arlet) combinent eaux limpides, petits restaurants créoles les pieds dans le sable et observation facile des poissons tropicaux à quelques mètres du bord.'
        ],
        photo: {
          url: '/images/spots/grande-anse.jpg',
          caption: 'La baie abritée de Grande Anse d’Arlet et ses eaux calmes idéales pour la baignade et le snorkeling.',
          placeLabel: 'Les Anses-d’Arlet'
        }
      },
      {
        heading: '2. Le charme sauvage des plages volcaniques du Nord (Anse Couleuvre & Anse Céron)',
        paragraphs: [
          'Après avoir dépassé Saint-Pierre et Le Prêcheur, la route côtière serpente entre falaises et forêt tropicale avant de s’arrêter à l’Anse Céron et à l’Anse Couleuvre. Ici, le sable gris-noir issu des anciennes éruptions de la Montagne Pelée contraste avec le vert intense de la végétation et le bleu profond de la mer.',
          'Moins fréquentées que les plages du Sud, ces criques offrent une atmosphère de bout du monde face à l’îlet la Perle, avec une eau très pure et des fonds rocheux riches en éponges et gorgones.'
        ],
        photo: {
          url: '/images/spots/anse-couleuvre.jpg',
          caption: 'Anse Couleuvre au Prêcheur : une crique sauvage de sable volcanique nichée au pied de la forêt tropicale.',
          placeLabel: 'Le Prêcheur'
        }
      },
      {
        heading: '3. Les lagons et fonds blancs de la façade Atlantique',
        paragraphs: [
          'Sur la côte Est, la houle de l’Atlantique se brise au large sur une barrière de corail continue, créant de vastes lagons calmes. Au Vauclin, la Pointe Faula permet de marcher sur plusieurs centaines de mètres avec de l’eau tiède à hauteur de taille, tandis que la presqu’île de la Caravelle à Tartane alterne criques familiales abritées (plage de la Brèche) et plages de surf (Anse Bonneville).'
        ],
        photo: {
          url: '/images/spots/pointe-faula.jpg',
          caption: 'Les bancs de sable clair de la Pointe Faula au Vauclin, protégés par la barrière récifale.',
          placeLabel: 'Le Vauclin'
        }
      }
    ],
    gallery: [
      { url: '/images/spots/salines-sunset.jpg', caption: 'Coucher de soleil doré sur la Grande Anse des Salines' },
      { url: '/images/spots/anse-trabaud.jpg', caption: 'Anse Trabaud, la grande plage sauvage accessible par la Trace des Caps' }
    ],
    localTip: 'En fin de semaine, privilégiez une arrivée avant 9h30 aux Salines ou à Grande Anse d’Arlet pour vous garer facilement à l’ombre sous les arbres.',
    relatedPlaceIds: ['salines', 'grande-anse-arlet', 'anse-couleuvre']
  },
  'blog-2': {
    heroCaption: 'Tortue verte (Chelonia mydas) en train de brouter paisiblement sur les herbiers peu profonds des Anses-d’Arlet.',
    quickFacts: {
      sector: 'Les Anses-d’Arlet (Anse Dufour, Anse Noire, Grande Anse)',
      bestPeriod: 'Toute l’année sur la côte Sud-Caraïbe',
      idealMoment: 'Entre 7h30 et 9h00 (eau lisse, faible affluence)'
    },
    takeaways: [
      'Meilleur créneau : entre 7h30 et 9h00 pour profiter d’une mer calme et d’une excellente visibilité sous-marine.',
      'Distance respectueuse : rester à 3 mètres minimum, sans jamais toucher ni suivre une tortue qui remonte respirer.',
      'Protection du récif : privilégier un t-shirt anti-UV à manches longues plutôt que de la crème solaire avant la mise à l’eau.'
    ],
    sections: [
      {
        heading: '1. Anse Dufour et Grande Anse : le domaine des tortues vertes',
        paragraphs: [
          'Les tortues vertes fréquentent quotidiennement les fonds sableux d’Anse Dufour et de Grande Anse d’Arlet pour brouter les herbiers de phanérogames marines situés entre 2 et 5 mètres de profondeur. Il n’est pas nécessaire de plonger en apnée : en flottant calmement à la surface avec un masque et un tuba, on les observe se nourrir sans les déranger.',
          'À Anse Dufour, les barques colorées des marins-pêcheurs bordent la plage de sable blond. Le parking étant restreint en haut de la côte, une arrivée matinale permet de profiter du site dans le calme.'
        ],
        photo: {
          url: '/images/spots/anse-dufour.jpg',
          caption: 'La crique d’Anse Dufour aux Anses-d’Arlet : sable blond, barques traditionnelles et herbiers marins dès les premiers mètres.',
          placeLabel: 'Anse Dufour'
        }
      },
      {
        heading: '2. Anse Noire : tombants volcaniques et tortues imbriquées',
        paragraphs: [
          'Séparée d’Anse Dufour par une simple pointe rocheuse (à 200 mètres à pied), l’Anse Noire offre un décor radicalement différent avec son sable noir volcanique et son long ponton en bois. En palmant le long de la falaise gauche, on observe des gorgones, des éponges tubulaires et régulièrement des tortues imbriquées (Eretmochelys imbricata) reconnaissables à leur bec crochu et leur carapace dentelée.'
        ],
        photo: {
          url: '/images/spots/anse-noire-ponton.jpg',
          caption: 'Le ponton d’Anse Noire et ses falaises rocheuses abritant gorgones, bancs de pisquettes et tortues imbriquées.',
          placeLabel: 'Anse Noire'
        }
      },
      {
        heading: '3. Les règles d’or pour ne pas stresser les tortues',
        paragraphs: [
          'Une tortue marine a besoin de remonter régulièrement en surface pour respirer. Il est essentiel de ne jamais se placer juste au-dessus d’elle ni de former un cercle autour de l’animal. Restez toujours en observation latérale, palmes immobiles, pour lui laisser un couloir libre vers la surface.'
        ]
      }
    ],
    gallery: [
      { url: '/images/spots/anse-dufour-barques.jpg', caption: 'Les yoles de pêcheurs sur le sable d’Anse Dufour' },
      { url: '/images/spots/anse-figuier-snorkeling.jpg', caption: 'Fonds rocheux et poissons de récif à l’Anse Figuier' }
    ],
    localTip: 'Si le petit parking d’Anse Dufour est complet après 9h30, rejoignez Grande Anse d’Arlet à 5 minutes de route : la baie est dix fois plus vaste et ses herbiers abritent tout autant de tortues.',
    relatedPlaceIds: ['anse-dufour', 'anse-noire', 'grande-anse-arlet']
  },
  'blog-3': {
    heroCaption: 'Le bourg des Anses-d’Arlet, son ponton en bois et l’église Saint-Henri face à la mer des Caraïbes.',
    quickFacts: {
      sector: 'Sainte-Luce, Le Diamant, Les Trois-Îlets & Le Marin',
      bestPeriod: 'Séjours longs d’octobre à mai ou installation à l’année',
      idealMoment: 'Repérage conseillé hors vacances scolaires'
    },
    takeaways: [
      'Secteurs les plus recherchés : Sainte-Luce, Le Diamant, Les Trois-Îlets et Le Marin pour les services et la douceur de vivre.',
      'Santé et infrastructures : réseau médical complet autour de Fort-de-France / Le Lamentin et cliniques de proximité dans le Sud.',
      'Conseil avant de s’engager : louer d’abord pendant 3 à 6 mois pour tester les temps de trajet quotidiens.'
    ],
    sections: [
      {
        heading: '1. Choisir sa commune entre Sud Caraïbe et bassin du Marin',
        paragraphs: [
          'Le Sud Caraïbe (Sainte-Luce, Le Diamant, Les Anses-d’Arlet) séduit par son ensoleillement régulier, ses marchés matinaux en bord de mer et ses sentiers côtiers accessibles à pied dès le lever du jour. Les Trois-Îlets offrent en plus la liaison directe par navette maritime vers le centre de Fort-de-France en 20 minutes, évitant ainsi les embouteillages routiers.',
          'Plus au sud-est, le bassin du Marin et de Sainte-Anne constitue le cœur nautique des Petites Antilles avec son grand port de plaisance, ses commerces complets et sa proximité immédiate avec les plages des Salines et de Pointe Marin.'
        ],
        photo: {
          url: '/images/spots/morne-gommier.jpg',
          caption: 'Vue panoramique depuis le Morne Gommier sur la baie du Marin et le littoral sud de la Martinique.',
          placeLabel: 'Le Marin / Sainte-Anne'
        }
      },
      {
        heading: '2. Vie quotidienne, marchés locaux et budget sur place',
        paragraphs: [
          'Pour maîtriser son budget au quotidien tout en profitant de produits frais, l’idéal est d’adopter les habitudes locales : marchés de producteurs pour les fruits, légumes pays et épices, retour de pêche matinal sur les quais de Sainte-Luce ou du Vauclin, et vie associative très active (clubs de marche, voile traditionnelle, plongée).'
        ],
        photo: {
          url: '/images/spots/pointe-marin.jpg',
          caption: 'Douceur de vivre sur le littoral ombragé de Sainte-Anne et de la Pointe Marin.',
          placeLabel: 'Sainte-Anne'
        }
      }
    ],
    gallery: [
      { url: '/images/spots/ponton-anses-arlet.jpg', caption: 'Le village côtier des Anses-d’Arlet au matin' },
      { url: '/images/spots/hotel-bakoua.jpg', caption: 'La baie de Fort-de-France vue depuis la pointe du Bout aux Trois-Îlets' }
    ],
    localTip: 'Testez toujours un quartier aux heures de pointe du matin (7h00–8h30) avant de signer un bail longue durée, surtout si vous devez vous rendre régulièrement à Fort-de-France ou au Lamentin.',
    relatedPlaceIds: ['spot-ponton-anses-arlet', 'belvedere-morne-gommier', 'pointe-marin']
  },
  'blog-4': {
    heroCaption: 'Embarcations traditionnelles colorées sur le littoral martiniquais, héritières directes des gommiers et yoles de pêche.',
    quickFacts: {
      sector: 'Tour complet du littoral (Caraïbe & Atlantique)',
      bestPeriod: 'Chaque été, fin juillet – début août',
      idealMoment: 'Départs vers 10h00 sur les plages, arrivées vers 15h00'
    },
    takeaways: [
      'Patrimoine culturel : la yole ronde de Martinique est inscrite au patrimoine culturel immatériel de l’UNESCO depuis 2020.',
      'Particularité nautique : embarcation en bois sans quille, sans gouvernail ni lest, équilibrée par les coursiers sur les « bois dressés ».',
      'Ambiance à terre : arrivée d’étape festive et gratuite chaque après-midi dans les communes côtières.'
    ],
    sections: [
      {
        heading: '1. Un équilibre unique au monde sur les « bois dressés »',
        paragraphs: [
          'Née du savoir-faire des charpentiers de marine et des marins-pêcheurs martiniquais, la yole ronde navigue sans quille ni gouvernail fixe. Pour compenser la poussée du vent dans son immense voile colorée (jusqu’à 80 m²), les équipiers — appelés coursiers — se suspendent au-dessus des flots sur de longues perches en bois (« les bois dressés ») placées côté vent.',
          'Sur la côte Atlantique (Le Vauclin, Le François, Le Robert, Tartane), la navigation entre les cayes et les passes de la barrière de corail exige une lecture millimétrée des courants et des risées.'
        ],
        photo: {
          url: '/images/spots/pointe-faula-panorama.jpg',
          caption: 'Le plan d’eau du Vauclin et de la côte Est, berceau historique de grandes familles de yoleurs.',
          placeLabel: 'Le Vauclin'
        }
      },
      {
        heading: '2. Les meilleurs points de vue depuis les falaises et les plages',
        paragraphs: [
          'Sur la côte Caraïbe, la descente entre Saint-Pierre, Le Carbet et Fort-de-France ou l’étape du Sud passant devant le Rocher du Diamant et Sainte-Anne permettent de suivre la flotte à quelques centaines de mètres du rivage.',
          'Les belvédères naturels comme le Morne Gommier au Marin ou la falaise du Cap 110 au Diamant offrent des loges panoramiques exceptionnelles pour photographier les voiles multicolores.'
        ],
        photo: {
          url: '/images/spots/diamant.jpg',
          caption: 'La grande baie du Diamant et son rocher volcanique, décor emblématique du passage des yoles dans le Sud.',
          placeLabel: 'Le Diamant'
        }
      }
    ],
    gallery: [
      { url: '/images/spots/tartane-barques.jpg', caption: 'Coques en bois aux couleurs vives sur la plage de Tartane' },
      { url: '/images/spots/pointe-faula.jpg', caption: 'Les eaux peu profondes de la Pointe Faula lors des régates' }
    ],
    localTip: 'Les jours d’étape, les bourgs d’arrivée ferment leur front de mer aux voitures dès la fin de matinée : privilégiez les navettes mises en place par les communes ou installez-vous sur une pointe panoramique en amont.',
    relatedPlaceIds: ['tartane-plage', 'pointe-faula', 'diamant']
  },
  'blog-5': {
    heroCaption: 'Grande plage volcanique de l’Anse Céron au Prêcheur : un haut de plage sauvage et sombre propice à la ponte nocturne des tortues.',
    quickFacts: {
      sector: 'Plages volcaniques du Nord & anses sauvages du Sud',
      bestPeriod: 'Pontes de mars à juillet · Émergences jusqu’en septembre',
      idealMoment: 'Observation encadrée uniquement avec le Réseau Tortues'
    },
    takeaways: [
      'Période de ponte : de mars à juillet pour la tortue luth, suivie des émergences de nouveau-nés jusqu’en septembre.',
      'Plages concernées : les plages sauvages du Nord (Le Prêcheur, Le Carbet) ainsi que les grandes anses non éclairées du Sud (Salines, Trabaud).',
      'Règle vitale : aucune lumière blanche, lampe torche ni flash photo la nuit sur les plages de ponte.'
    ],
    sections: [
      {
        heading: '1. Le retour nocturne des tortues luths sur le sable volcanique',
        paragraphs: [
          'La tortue luth (Dermochelys coriacea), la plus grande des tortues marines (jusqu’à 1,80 mètre et 450 kg), parcourt des milliers de kilomètres à travers l’océan Atlantique pour revenir pondre sur les plages de Martinique. Contrairement aux autres espèces, sa carapace n’est pas couverte d’écailles dures mais d’une peau épaisse parcourue de sept carènes longitudinales.',
          'À la nuit tombée, la femelle se hisse hors de l’eau sur le haut de plage (notamment sur les anses sombres du Nord ou les secteurs préservés des Salines), creuse un puits profond dans le sable pour y déposer ses œufs, puis rebouche soigneusement son nid avant de regagner le large.'
        ],
        photo: {
          url: '/images/spots/anse-couleuvre.jpg',
          caption: 'Les anses isolées du Prêcheur (Anse Céron, Anse Couleuvre), préservées de toute pollution lumineuse.',
          placeLabel: 'Le Prêcheur'
        }
      },
      {
        heading: '2. Pourquoi l’obscurité totale et le calme des plages sont indispensables',
        paragraphs: [
          'Lorsqu’elles sortent du nid après environ deux mois d’incubation, les petites tortues s’orientent grâce à la réverbération naturelle des étoiles et de la lune sur l’horizon marin. Le moindre lampadaire, phare de voiture ou écran de smartphone les attire dans la mauvaise direction vers la route ou la végétation, réduisant drastiquement leurs chances de survie.'
        ],
        photo: {
          url: '/images/spots/salines-sunset.jpg',
          caption: 'Le cordon forestier de la Grande Anse des Salines au crépuscule, autre site majeur de ponte protégé par l’ONF.',
          placeLabel: 'Sainte-Anne'
        }
      }
    ],
    gallery: [
      { url: '/images/spots/anse-ceron.jpg', caption: 'Le sable noir volcanique de l’Anse Céron bordé de cocotiers' },
      { url: '/images/spots/anse-trabaud.jpg', caption: 'L’Anse Trabaud sur la côte Atlantique sud, vierge de toute construction' }
    ],
    localTip: 'En journée sur la plage, ne plantez jamais de piquets de parasol profondément dans le haut de plage sec et évitez de tasser le sable sous les raisiniers où peuvent se trouver des nids en incubation.',
    relatedPlaceIds: ['anse-couleuvre', 'secret-anse-trabaud', 'salines']
  },
  'blog-6': {
    heroCaption: 'L’eau calme et cristalline de l’Anse Figuier à Rivière-Pilote, protégée des vents d’est par le relief de l’île.',
    quickFacts: {
      sector: 'Toute la façade Ouest (du Prêcheur à Sainte-Anne)',
      bestPeriod: 'Toute l’année (régime d’alizés d’est dominant)',
      idealMoment: 'Matinée et après-midi sur toute la côte Caraïbe'
    },
    takeaways: [
      'Géographie protectrice : les courants et les alizés poussent les bancs d’algues d’est en ouest vers la façade Atlantique.',
      'Côte Caraïbe préservée : de Saint-Pierre aux Anses-d’Arlet et Sainte-Luce, la mer reste claire la quasi-totalité de l’année.',
      'Alternative côté Est : les plages abritées par la presqu’île de la Caravelle (Tartane) restent le plus souvent épargnées.'
    ],
    sections: [
      {
        heading: '1. L’effet bouclier du relief martiniquais pour la côte Caraïbe',
        paragraphs: [
          'En Martinique, les vents dominants — les alizés — soufflent d’est en ouest depuis l’océan Atlantique. Lorsqu’une dérive de sargasses circule au large dans l’Atlantique, elle ne peut concerner que certaines baies orientées plein est (Le Vauclin, Le François, Le Robert).',
          'À l’inverse, toute la façade ouest (la côte Caraïbe : Le Prêcheur, Le Carbet, Les Trois-Îlets, Les Anses-d’Arlet, Le Diamant, Sainte-Luce, Rivière-Pilote et Sainte-Anne) se trouve « sous le vent » de l’île. Les courants côtiers y maintiennent une eau limpide et turquoise.'
        ],
        photo: {
          url: '/images/spots/pointe-marin-lagon.jpg',
          caption: 'Le lagon translucide de la Pointe Marin à Sainte-Anne sur la façade Sud-Caraïbe.',
          placeLabel: 'Sainte-Anne'
        }
      },
      {
        heading: '2. Comment lire la météo côtière entre Atlantique et Caraïbe',
        paragraphs: [
          'L’étroitesse de la Martinique (moins de 30 kilomètres d’est en ouest) est un atout précieux : s’il y a du vent soutenu ou des averses passagères sur la côte Atlantique, il suffit généralement de 25 à 30 minutes de route pour retrouver un grand soleil et une mer d’huile sur les anses du Sud-Caraïbe.'
        ],
        photo: {
          url: '/images/spots/sentier-caravelle-falaises.jpg',
          caption: 'La pointe de la Caravelle sur la côte Atlantique, exposée à la brise marine rafraîchissante des alizés.',
          placeLabel: 'Presqu’île de la Caravelle'
        }
      }
    ],
    gallery: [
      { url: '/images/spots/anse-figuier.jpg', caption: 'Transparence de l’eau à l’Anse Figuier' },
      { url: '/images/spots/anse-dufour.jpg', caption: 'Mer calme dans la crique abritée d’Anse Dufour' }
    ],
    localTip: 'Consultez la météo des 4 secteurs côtiers et les photos du matin dans l’onglet Communauté avant de choisir votre plage du jour.',
    relatedPlaceIds: ['anse-figuier', 'pointe-marin', 'randonnee-caravelle']
  },
  'blog-7': {
    heroCaption: 'Défilé et costumes colorés dans les rues de Fort-de-France lors du Carnaval de Martinique.',
    quickFacts: {
      sector: 'Fort-de-France & communes du Sud (Anses-d’Arlet, Diamant)',
      bestPeriod: 'Février ou début mars (du Dimanche Gras au Mercredi des Cendres)',
      idealMoment: 'Grandes parades à partir de 14h30 dans le centre-ville'
    },
    takeaways: [
      'Quatre jours uniques : du Dimanche Gras au Mercredi des Cendres, chaque journée possède son code vestimentaire.',
      'Participation ouverte : il n’y a pas de barrière, tout le monde s’habille selon le thème du jour pour suivre les groupes à pied (« vidés »).',
      'Respect des traditions : le Mercredi des Cendres clôt la fête en noir et blanc avec l’incinération de Sa Majesté Vaval.'
    ],
    sections: [
      {
        heading: '1. Le calendrier des couleurs jour par jour',
        paragraphs: [
          'Le Dimanche Gras ouvre les festivités en tenue multicolore avec la sortie des Reines et la présentation de Vaval, le géant éphémère qui symbolise l’actualité de l’année. Le Lundi Gras débute dès l’aube avec les « vidés pyjama » suivis l’après-midi des célèbres mariages burlesques où les rôles s’inversent.',
          'Le Mardi Gras est sans doute la journée la plus spectaculaire : toute la Martinique se pare de rouge et de noir pour accompagner la sortie des Diables Rouges aux masques ornés de miroirs et de cornes. Enfin, le Mercredi des Cendres impose le noir et blanc strict des « diablesses » pour pleurer la disparition de Vaval sur le front de mer au crépuscule.'
        ],
        photo: {
          url: '/images/spots/ponton-anses-arlet.jpg',
          caption: 'Les communes du Sud comme Les Anses-d’Arlet et Le Diamant accueillent également des parades très conviviales en bord de mer.',
          placeLabel: 'Les Anses-d’Arlet'
        }
      },
      {
        heading: '2. Conseils pratiques pour vivre les défilés à Fort-de-France',
        paragraphs: [
          'Le centre-ville de Fort-de-France étant entièrement piétonnisé pendant les quatre après-midis gras, le moyen le plus simple et le plus agréable d’y accéder depuis le Sud est d’emprunter les navettes maritimes au départ de l’Anse Mitan ou de la Pointe du Bout aux Trois-Îlets : elles vous déposent directement au pied de la Savane.'
        ],
        photo: {
          url: '/images/spots/sunset-diamant.jpg',
          caption: 'Fin d’après-midi sur la côte Caraïbe après l’effervescence des défilés.',
          placeLabel: 'Le Diamant'
        }
      }
    ],
    gallery: [
      { url: '/images/spots/carnaval.jpg', caption: 'Liesse populaire et groupes à pied à Fort-de-France' },
      { url: '/images/spots/hotel-bakoua.jpg', caption: 'Traversée de la baie de Fort-de-France depuis les Trois-Îlets' }
    ],
    localTip: 'Prévoyez une bouteille d’eau, des chaussures fermées confortables pour marcher dans les vidés et préparez vos trois tenues (multicolore, rouge & noir, noir & blanc) avant le week-end gras !',
    relatedPlaceIds: ['carnaval-martinique-2026', 'spot-ponton-anses-arlet', 'hotel-bakoua']
  },
  'blog-8': {
    heroCaption: 'Jardin tropical et terrasse créole autour de la dégustation des grands rhums agricoles AOC de Martinique.',
    quickFacts: {
      sector: 'Saint-Pierre, Le Carbet, Sainte-Marie, Le François & Rivière-Pilote',
      bestPeriod: 'Visites toute l’année · Récolte et broyage de février à juin',
      idealMoment: 'Le matin entre 9h30 et 11h30 pour voir tourner les moulins'
    },
    takeaways: [
      'Seule AOC au monde : le Rhum Agricole de la Martinique est élaboré exclusivement à partir de pur jus de canne à sucre frais (le vesou).',
      'Saison de récolte : la coupe de la canne et les colonnes de distillation fument de février à juin.',
      'Patrimoine et jardins : les grandes habitations se visitent autant pour leurs parcs botaniques et maisons créoles que pour leurs chais.'
    ],
    sections: [
      {
        heading: '1. Le terroir volcanique du Nord : Saint-Pierre et Le Carbet',
        paragraphs: [
          'Au pied de la Montagne Pelée à Saint-Pierre, la distillerie Depaz bénéficie de sols volcaniques filtrants riches en minéraux et d’une eau de source pure captée en montagne. Sa roue à aubes historique, son château reconstruit après l’éruption de 1902 et sa vue plongeante sur la baie de Saint-Pierre en font une étape incontournable.',
          'Quelques kilomètres plus au sud, à l’entrée du Carbet, la distillerie familiale Neisson cultive ses propres parcelles de canne en bord de mer, produisant des rhums blancs et vieux réputés pour leurs notes florales et citronnées.'
        ],
        photo: {
          url: '/images/spots/montagne-pelee-vue.jpg',
          caption: 'Les pentes volcaniques fertiles de la Montagne Pelée qui donnent leur caractère minéral aux cannes du Nord.',
          placeLabel: 'Saint-Pierre / Montagne Pelée'
        }
      },
      {
        heading: '2. Habitations historiques et art de vivre créole',
        paragraphs: [
          'Sur la côte Atlantique, l’Habitation Clément au François réunit d’immenses chais de vieillissement, une maison créole du XVIIIe siècle classée monument historique, un jardin de sculptures et une fondation d’art contemporain. Plus au nord à Sainte-Marie, la distillerie Saint-James permet de parcourir les champs de canne à bord d’un petit train d’époque.'
        ],
        photo: {
          url: '/images/spots/petibonum.jpg',
          caption: 'Table créole au bord de l’eau au Carbet, étape idéale après la visite des distilleries du Nord-Caraïbe.',
          placeLabel: 'Le Carbet'
        }
      }
    ],
    gallery: [
      { url: '/images/spots/babaorum.jpg', caption: 'Cadre tropical intimiste pour découvrir les rhums vieux AOC' },
      { url: '/images/spots/zandoli.jpg', caption: 'Accords gastronomie créole et grands millésimes martiniquais' }
    ],
    localTip: 'Privilégiez les visites de distilleries en matinée du lundi au vendredi entre février et mai : c’est le moment où la canne fraîchement coupée arrive aux moulins de broyage.',
    relatedPlaceIds: ['bar-babaorum', 'petibonum', 'zandoli-restaurant']
  },
  'blog-9': {
    heroCaption: 'La Baignoire de Joséphine dans la baie du François : un haut-fond de sable corallien entouré d’îlets et protégé par la barrière de corail.',
    quickFacts: {
      sector: 'Côte Atlantique (Baie du François & Baie du Robert)',
      bestPeriod: 'Toute l’année (mer protégée par la barrière récifale)',
      idealMoment: 'Départ du port vers 8h30 pour arriver avant les grands bateaux'
    },
    takeaways: [
      'Baignade au large : les « fonds blancs » sont des bancs de sable clair immergés à 1 mètre de profondeur derrière la barrière de corail.',
      'Îlet Chancel (Le Robert) : abrite l’une des dernières colonies d’iguanes délicatissimes (Iguana delicatissima) des Petites Antilles.',
      'Accès : en kayak des mers depuis le Robert, en yole de pêcheur ou en catamaran à la journée.'
    ],
    sections: [
      {
        heading: '1. La Baignoire de Joséphine et les îlets du François',
        paragraphs: [
          'Située à environ deux kilomètres du rivage entre l’Îlet Thierry et l’Îlet Oscar, la célèbre Baignoire de Joséphine est une piscine naturelle de sable blanc en pleine mer où l’on a pied jusqu’à la taille. Protégée des rouleaux de l’océan Atlantique par une double barrière de corail, l’eau y affiche un dégradé turquoise saisissant à 28°C.',
          'Les marins-pêcheurs du François proposent des sorties authentiques en petits groupes permettant de découvrir également l’Îlet Pelé, l’Îlet Métrente et les herbiers voisins.'
        ],
        photo: {
          url: '/images/spots/baignoire-josephine-baignade.jpg',
          caption: 'Baignade dans les eaux limpides et peu profondes des Fonds Blancs du François.',
          placeLabel: 'Baie du François'
        }
      },
      {
        heading: '2. L’Îlet Chancel et l’Îlet Madame dans la baie du Robert',
        paragraphs: [
          'Juste au nord du François, la baie du Robert compte dix îlets classés. L’Îlet Chancel, le plus grand de Martinique, se visite à pied pour observer les vestiges d’un ancien four à chaux et d’une sucrerie du XVIIIe siècle, mais surtout pour apercevoir dans les arbres l’iguane des Petites Antilles, espèce endémique strictement protégée.',
          'À quelques coups de pagaie en kayak, l’Îlet Madame offre une anse de sable blanc bordée d’une eau translucide et de carbets en bois ombragés.'
        ],
        photo: {
          url: '/images/spots/tartane.jpg',
          caption: 'Le littoral découpé de la côte Est entre la baie du Robert et la presqu’île de la Caravelle.',
          placeLabel: 'Le Robert / La Trinité'
        }
      }
    ],
    gallery: [
      { url: '/images/spots/baignoire-josephine.jpg', caption: 'Les hauts-fonds turquoise de la Baignoire de Joséphine' },
      { url: '/images/spots/pointe-faula.jpg', caption: 'Les fonds blancs accessibles à pied depuis la Pointe Faula au Vauclin' }
    ],
    localTip: 'Prévoyez impérativement un t-shirt anti-UV à manches longues, des lunettes polarisantes et un chapeau : la réverbération du soleil sur l’eau claire des fonds blancs est particulièrement forte entre 11h et 14h.',
    relatedPlaceIds: ['baignoire-josephine', 'excursion-ilet-chancel', 'pointe-faula']
  },
  'blog-10': {
    heroCaption: 'Sentier d’ascension de la Montagne Pelée (1 397 m), volcan actif classé au patrimoine mondial de l’UNESCO.',
    quickFacts: {
      sector: 'Nord de la Martinique (Le Morne-Rouge, Ajoupa-Bouillon, Fonds-Saint-Denis)',
      bestPeriod: 'Décembre à juin (sentiers plus secs, sommets plus dégagés)',
      idealMoment: 'Départ impératif entre 6h30 et 7h15 au parking de l’Aileron'
    },
    takeaways: [
      'Départ matinal : commencez l’ascension de la Montagne Pelée par l’Aileron dès 6h45 pour devancer les nuages au sommet.',
      'Gorges de la Falaise (Ajoupa-Bouillon) : remontée aquatique rafraîchissante entre deux hautes parois volcaniques.',
      'Canal de Beauregard (Canal des Esclaves) : marche plate et panoramique sur le muret historique au cœur de la forêt tropicale.'
    ],
    sections: [
      {
        heading: '1. L’ascension de la Montagne Pelée par l’Aileron',
        paragraphs: [
          'Inscrite au patrimoine mondial de l’UNESCO pour ses volcans et ses forêts humides, la Montagne Pelée domine tout le Nord de l’île à 1 397 mètres d’altitude. Depuis le parking de l’Aileron au Morne-Rouge (820 m), le sentier balisé grimpe à travers une végétation d’altitude unique (ananas montagne, fougères naines, broméliacées) jusqu’au bord de la caldeira.',
          'En partant dès le lever du jour, on maximise ses chances de contempler un panorama à 360° sur la mer des Caraïbes, l’océan Atlantique et l’île voisine de la Dominique avant que la couronne de nuages ne se forme vers 10h00.'
        ],
        photo: {
          url: '/images/spots/montagne-pelee-vue.jpg',
          caption: 'Vue dégagée sur les crêtes verdoyantes de la Montagne Pelée lors d’une ascension matinale.',
          placeLabel: 'Le Morne-Rouge'
        }
      },
      {
        heading: '2. Rivières, cascades et canyoning dans la forêt pluviale',
        paragraphs: [
          'Sur les flancs du volcan, l’eau sculpte des canyons verdoyants bordés de fougères arborescentes géantes et de bambous. Aux Gorges de la Falaise à l’Ajoupa-Bouillon ou sur les parcours de canyoning autour de Saint-Pierre et Fonds-Saint-Denis, on progresse directement dans l’eau fraîche des rivières jusqu’au pied de cascades spectaculaires.'
        ],
        photo: {
          url: '/images/spots/canyoning.jpg',
          caption: 'Descente de cascades et vasques d’eau vive au cœur de la forêt tropicale du Nord.',
          placeLabel: 'Massif de la Pelée / Saint-Pierre'
        }
      }
    ],
    gallery: [
      { url: '/images/spots/montagne-pelee.jpg', caption: 'Le sentier aménagé sur les pentes de la Montagne Pelée' },
      { url: '/images/spots/anse-couleuvre.jpg', caption: 'Baignade sur le sable noir d’Anse Couleuvre après la randonnée' }
    ],
    localTip: 'Même s’il fait 30°C sur la plage, la température au sommet de la Pelée peut descendre à 15°C avec des rafales humides : emportez toujours un coupe-vent imperméable et un vêtement sec dans votre sac.',
    relatedPlaceIds: ['montagne-pelee', 'canyoning-pitons', 'rando-gorges-falaise']
  }
};

export default function ArticleDetailView({
  post,
  places,
  onBack,
  onOpenPlace,
  onOpenArticle,
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
      text: 'Merci pour ces précisions très concrètes et les repères de lieux, cela nous a beaucoup aidés à organiser nos journées sur place.'
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

  // Sélection précise des lieux liés à l'article
  const matchedPlaces = extra.relatedPlaceIds
    .map(id => places.find(p => p.id === id))
    .filter((p): p is PlaceItem => Boolean(p));

  const relatedPlaces =
    matchedPlaces.length > 0
      ? matchedPlaces
      : places.filter(p => p.featured).slice(0, 3);

  const otherArticles = INITIAL_BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 3);

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

      {/* 3. Photo principale + légende du lieu en Martinique */}
      <figure className="space-y-2.5">
        <div className="rounded-2xl overflow-hidden border border-slate-200/80 aspect-[16/9] max-h-[480px] bg-slate-100">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
        <figcaption className="flex items-center gap-2 text-xs text-slate-500 px-1">
          <Camera className="w-3.5 h-3.5 text-teal-700 shrink-0" />
          <span>{extra.heroCaption}</span>
        </figcaption>
      </figure>

      {/* 4. Corps de l'article + Colonne latérale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-8 text-slate-800 text-base leading-relaxed">
          {/* Fiche repère rapide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200/90 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 space-y-1">
              <span className="inline-flex items-center gap-1.5 font-semibold text-teal-800 uppercase tracking-wider text-[10px]">
                <MapPin className="w-3 h-3" />
                Secteur concerné
              </span>
              <p className="font-semibold text-slate-900 leading-snug">
                {extra.quickFacts.sector}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 space-y-1">
              <span className="inline-flex items-center gap-1.5 font-semibold text-teal-800 uppercase tracking-wider text-[10px]">
                <Sun className="w-3 h-3" />
                Période conseillée
              </span>
              <p className="font-semibold text-slate-900 leading-snug">
                {extra.quickFacts.bestPeriod}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 space-y-1">
              <span className="inline-flex items-center gap-1.5 font-semibold text-teal-800 uppercase tracking-wider text-[10px]">
                <Clock className="w-3 h-3" />
                Meilleur horaire
              </span>
              <p className="font-semibold text-slate-900 leading-snug">
                {extra.quickFacts.idealMoment}
              </p>
            </div>
          </div>

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

          {/* Contenu éditorial illustré */}
          <div className="space-y-8">
            <p className="text-lg text-slate-900 font-medium leading-relaxed">
              {post.content}
            </p>

            {extra.sections.map((sec, idx) => (
              <div key={idx} className="space-y-4 pt-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {sec.heading}
                </h2>
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-slate-700 leading-relaxed">
                    {p}
                  </p>
                ))}

                {sec.photo && (
                  <figure className="pt-2 space-y-2">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 aspect-[16/9] bg-slate-100">
                      <img
                        src={sec.photo.url}
                        alt={sec.photo.caption}
                        className="w-full h-full object-cover"
                      />
                      {sec.photo.placeLabel && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[11px] font-medium backdrop-blur-xs">
                          <MapPin className="w-3 h-3 text-teal-300" />
                          {sec.photo.placeLabel}
                        </span>
                      )}
                    </div>
                    <figcaption className="text-xs text-slate-500 px-1">
                      {sec.photo.caption}
                    </figcaption>
                  </figure>
                )}
              </div>
            ))}

            {/* Mini-galerie photo complémentaire du sujet */}
            {extra.gallery && extra.gallery.length > 0 && (
              <div className="pt-2 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  En images sur le terrain
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {extra.gallery.map((img, idx) => (
                    <figure
                      key={idx}
                      className="rounded-xl overflow-hidden border border-slate-200/80 bg-white flex flex-col"
                    >
                      <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                        <img
                          src={img.url}
                          alt={img.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <figcaption className="p-3 text-xs text-slate-600 leading-snug">
                        {img.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}

            <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200/70 space-y-1.5">
              <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                Le conseil pratique sur place
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
                Lieux cités dans ce dossier
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

      {/* 5. Autres dossiers à lire */}
      {onOpenArticle && otherArticles.length > 0 && (
        <section className="pt-10 border-t border-slate-200/80 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                Continuer la lecture
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Autres dossiers du journal
              </h3>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Voir les 10 dossiers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherArticles.map(item => (
              <div
                key={item.id}
                onClick={() => onOpenArticle(item)}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden cursor-pointer flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/95 text-slate-800 text-[11px] font-semibold">
                    {item.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-400">{item.readTime}</span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-teal-700 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700">
                    Lire le dossier
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
