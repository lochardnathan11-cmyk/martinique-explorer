import { PlaceItem, CommunityAlert, SocialPost, ForumTopic, UserBadge, BlogPost } from '@/types';

export const INITIAL_PLACES: PlaceItem[] = [
  {
    id: 'salines',
    slug: 'salines',
    name: "Plage des Salines",
    category: 'beach',
    subCategory: "",
    commune: "Sainte-Anne",
    description: "La plus c�l�bre plage de sable blanc de Martinique avec ses cocotiers inclin�s face � la mer.",
    coords: [14.4035, -60.8753],
    photos: [
      '/images/spots/salines.jpg'
    ],
    rating: 4.8,
    reviewsCount: 100,
    featured: false,
    isHiddenGem: false,
    crowdLevel: 'Modérée',
    parking: 'Facile et gratuit',
    toilets: false,
    restaurantsNearby: false,
    website: 'https://martinique-explorer.fr',
    phone: '+596 596 00 00 00',
    address: '',
    schedules: 'Tous les jours',
    priceRange: '€€',
    tags: [],
    badges: []
  },
  {
    id: 'anse-dufour',
    name: 'Anse Dufour (Le paradis des tortues)',
    category: 'snorkeling',
    subCategory: 'Snorkeling d\'exception',
    commune: 'Les Anses-d\'Arlet',
    description: 'Petite anse authentique de pêcheurs au sable blond. C\'est LE spot mythique en Martinique pour nager à quelques mètres des tortues vertes qui broutent les herbiers marins.',
    coords: [14.5264, -61.0858],
    photos: [
      '/images/spots/anse-dufour.jpg',
      '/images/spots/anse-dufour-barques.jpg'
    ],
    rating: 4.9,
    reviewsCount: 489,
    featured: true,
    crowdLevel: 'Forte',
    parking: 'Limité',
    toilets: true,
    restaurantsNearby: true,
    accessibilityPMR: false,
    tags: ['Tortues marines', 'Snorkeling', 'Pêcheurs', 'Sable doré'],
    spotDifficulty: 'Débutant',
    depth: '1 à 5 mètres',
    observableFauna: ['Tortues vertes', 'Raies pastenagues', 'Poissons perroquets', 'Chirurgiens bleus'],
    idealConditions: 'Matinée calme (8h - 10h) avant la foule',
    safetyTips: 'Ne jamais toucher ni bloquer la remontée d\'une tortue à la surface.',
    realTime: {
      weather: 'Ensoleillé',
      tempAir: 29,
      tempWater: 28,
      windSpeed: 10,
      uvIndex: 8,
      seaState: 'Calme',
      sargassum: 'none',
      lastUpdate: 'Il y a 30 min'
    }
  },
  {
    id: 'anse-noire',
    name: 'Anse Noire',
    category: 'beach',
    subCategory: 'Sable volcanique & Snorkeling',
    commune: 'Les Anses-d\'Arlet',
    description: 'Voisine directe d\'Anse Dufour par un petit escalier, mais entièrement vêtue de sable noir volcanique entouré de falaises luxuriantes. Un ponton iconique et des tombants coralliens spectaculaires.',
    coords: [14.5280, -61.0872],
    photos: [
      '/images/spots/anse-noire.jpg',
      '/images/spots/anse-noire-ponton.jpg'
    ],
    rating: 4.7,
    reviewsCount: 278,
    crowdLevel: 'Modérée',
    parking: 'Limité',
    toilets: false,
    restaurantsNearby: true,
    tags: ['Sable noir', 'Snorkeling', 'Ponton', 'Nature sauvage'],
    spotDifficulty: 'Intermédiaire',
    depth: '2 à 10 mètres',
    observableFauna: ['Coraux cerveau', 'Gorgones', 'Barracudas', 'Murènes'],
    realTime: {
      weather: 'Ensoleillé',
      tempAir: 29,
      tempWater: 27,
      windSpeed: 11,
      uvIndex: 8,
      seaState: 'Calme',
      sargassum: 'none',
      lastUpdate: 'Il y a 45 min'
    }
  },
  {
    id: 'diamant',
    name: 'Plage du Diamant',
    category: 'beach',
    subCategory: 'Vue panoramique & Surf',
    commune: 'Le Diamant',
    description: 'Une baie majestueuse de 4 km face au légendaire Rocher du Diamant. Frangée d\'arbres et de sous-bois ombragés. Baignade tonique en raison des rouleaux et courants.',
    coords: [14.4789, -61.0261],
    photos: [
      '/images/spots/diamant.jpg',
      '/images/candidates/diamant-b.jpg'
    ],
    rating: 4.6,
    reviewsCount: 310,
    crowdLevel: 'Modérée',
    parking: 'Facile et gratuit',
    toilets: true,
    restaurantsNearby: true,
    tags: ['Rocher du Diamant', 'Vagues', 'Balade matinale', 'Coucher de soleil'],
    isDangerous: true,
    isLifeguarded: false,
    realTime: {
      weather: 'Éclaircies',
      tempAir: 29,
      tempWater: 27,
      windSpeed: 22,
      uvIndex: 7,
      seaState: 'Agitée',
      sargassum: 'low',
      lastUpdate: 'Il y a 1h'
    }
  },
  {
    id: 'anse-couleuvre',
    name: 'Anse Couleuvre (Bout du Monde)',
    category: 'beach',
    subCategory: 'Sauvage & Forêt tropicale',
    commune: 'Le Prêcheur',
    description: 'Au terminus de la route du Nord caraïbe. On y accède après 10 minutes de marche au cœur d\'une jungle tropicale spectaculaire aux pieds de la Montagne Pelée.',
    coords: [14.8398, -61.2185],
    photos: [
      '/images/spots/anse-couleuvre.jpg',
      '/images/candidates/couleuvre-b.jpg'
    ],
    rating: 4.9,
    reviewsCount: 195,
    crowdLevel: 'Faible',
    parking: 'Difficile',
    toilets: false,
    restaurantsNearby: false,
    tags: ['Sauvage', 'Jungle', 'Sable volcanique', 'Aventure'],
    realTime: {
      weather: 'Nuageux sur les pitons',
      tempAir: 28,
      tempWater: 27,
      windSpeed: 15,
      uvIndex: 6,
      seaState: 'Peu agitée',
      sargassum: 'none',
      lastUpdate: 'Il y a 2h'
    }
  },
  {
    id: 'baignoire-josephine',
    name: 'Excursion Baignoire de Joséphine & Îlets',
    category: 'activity',
    subCategory: 'Excursions bateau',
    commune: 'Le François',
    description: 'Journée inoubliable en catamaran ou yole traditionnelle vers les fonds blancs du François. Baignade dans une eau translucide à hauteur de taille au milieu de l\'océan, baptême du rhum et déjeuner créole.',
    coords: [14.6158, -60.8553],
    photos: [
      '/images/spots/baignoire-josephine.jpg',
      '/images/spots/baignoire-josephine-baignade.jpg'
    ],
    rating: 4.9,
    reviewsCount: 520,
    featured: true,
    isVerifiedPro: true,
    priceRange: '65€ - 95€ / pers',
    phone: '+596 596 54 88 12',
    website: 'https://catamaran-martinique.example.com',
    schedules: 'Départs quotidiens 9h00 - Retour 16h30',
    bookingUrl: '#',
    tags: ['Bateau', 'Fonds Blancs', 'Catamaran', 'Repas créole', 'Tout compris']
  },
  {
    id: 'montagne-pelee',
    name: 'Ascension de la Montagne Pelée',
    category: 'activity',
    subCategory: 'Randonnée',
    commune: 'Le Morne-Rouge',
    description: 'Le sommet de la Martinique (1397m). Randonnée mythique à travers la flore d\'altitude jusqu\'au dôme du volcan avec une vue imprenable sur tout l\'arc antillais par temps clair.',
    coords: [14.8122, -61.1689],
    photos: [
      '/images/spots/montagne-pelee.jpg',
      '/images/spots/montagne-pelee-vue.jpg'
    ],
    rating: 4.8,
    reviewsCount: 388,
    priceRange: 'Accès libre / Guide optionnel',
    schedules: 'Départ recommandé entre 6h00 et 7h30',
    tags: ['Volcan', 'Panorama', 'Sportif', 'UNESCO']
  },
  {
    id: 'canyoning-pitons',
    name: 'Canyoning dans la Forêt Tropicale',
    category: 'activity',
    subCategory: 'Canyoning & Aventure',
    commune: 'Saint-Pierre',
    description: 'Descente de cascades en rappel, sauts dans des vasques d\'eau claire et toboggans naturels au cœur de la forêt pluviale luxuriante.',
    coords: [14.7431, -61.1762],
    photos: [
      '/images/spots/canyoning.jpg'
    ],
    rating: 4.9,
    reviewsCount: 142,
    isVerifiedPro: true,
    priceRange: '60€ - 85€',
    phone: '+596 696 33 22 11',
    tags: ['Sensations', 'Cascades', 'Forêt tropicale', 'Rappel']
  },
  {
    id: 'zandoli-restaurant',
    name: 'Restaurant Le Zandoli',
    category: 'restaurant',
    subCategory: 'Gastronomique créole réinventé',
    commune: 'Les Trois-Îlets',
    description: 'Surplombant la baie de Fort-de-France à l\'hôtel La Suite Villa. Une cuisine raffinée mêlant saveurs des Caraïbes et haute gastronomie française par un chef renommé.',
    coords: [14.5385, -61.0543],
    photos: [
      '/images/spots/zandoli.jpg'
    ],
    rating: 4.8,
    reviewsCount: 215,
    isVerifiedPro: true,
    featured: true,
    specialty: 'Gastronomique',
    priceRange: '€€€',
    address: 'Route du Fort d\'Alet, Les Trois-Îlets',
    phone: '+596 596 59 88 00',
    schedules: 'Mardi - Dimanche : 19h00 - 22h30',
    tags: ['Vue mer', 'Romantique', 'Langouste', 'Cocktails signature']
  },
  {
    id: 'ti-sable',
    name: 'Ti Sable',
    category: 'restaurant',
    subCategory: 'Poissons frais & Pieds dans le sable',
    commune: 'Les Anses-d\'Arlet',
    description: 'Restaurant de plage réputé sur la grande plage de Grande Anse. Poissons du jour grillés, langoustes fraîches du vivier et concerts live acoustiques les dimanches soirs au coucher du soleil.',
    coords: [14.5024, -61.0851],
    photos: [
      '/images/spots/ti-sable.jpg',
      '/images/candidates/grande-anse-b.jpg'
    ],
    rating: 4.7,
    reviewsCount: 640,
    isVerifiedPro: true,
    specialty: 'Fruits de mer',
    priceRange: '€€',
    address: 'Grande Anse, Les Anses-d\'Arlet',
    phone: '+596 596 68 62 44',
    tags: ['Pieds dans le sable', 'Concert live', 'Langouste', 'Rhum arrangé']
  },
  {
    id: 'hotel-bakoua',
    name: 'Hôtel Bakoua 4*',
    category: 'accommodation',
    subCategory: 'Hôtel de luxe bord de mer',
    commune: 'Les Trois-Îlets',
    description: 'Ancienne maison coloniale avec vue panoramique sur la baie des Flamands et Fort-de-France. Ponton privé avec bar circulaire sur pilotis et accès direct à la plage.',
    coords: [14.5542, -61.0506],
    photos: [
      '/images/spots/hotel-bakoua.jpg',
      '/images/candidates/bakoua-b.jpg'
    ],
    rating: 4.7,
    reviewsCount: 410,
    isVerifiedPro: true,
    accomType: 'Hôtel',
    averagePrice: 220,
    services: ['Piscine à débordement', 'Plage privée', 'Spa', 'Restaurant', 'Navette maritime'],
    seaside: true,
    pool: true,
    affiliateBookingUrl: 'https://booking.com/example-bakoua',
    tags: ['Bar sur pilotis', 'Luxe', 'Navette FdF', 'Pieds dans l\'eau']
  },
  {
    id: 'carnaval-martinique-2026',
    name: 'Le Grand Carnaval de Martinique',
    category: 'event',
    subCategory: 'Culture & Fête populaire',
    commune: 'Fort-de-France',
    description: 'L\'un des plus spectaculaires carnavals du monde ! 5 jours de liesse populaire rythmés par les groupes à pied (Vaval, Bradjak, Diables rouges, Reines et Roi). Ambiance chaleureuse et unique.',
    coords: [14.6037, -61.0677],
    photos: [
      '/images/spots/carnaval.jpg'
    ],
    rating: 5.0,
    reviewsCount: 1200,
    featured: true,
    eventType: 'Carnaval',
    eventDate: 'Février - Mars',
    eventTime: 'Toute la journée & soirées',
    tags: ['Musique live', 'Costumes', 'Vaval', 'Tradition']
  },
  {
    id: 'petibonum',
    slug: 'petibonum-carbet',
    name: 'Le Petibonum (Chef Guy Ferdinand)',
    category: 'restaurant',
    subCategory: 'Cuisine créole les pieds dans le sable',
    commune: 'Le Carbet',
    description: 'Institution incontournable de la côte Caraïbe. Dégustez les fameuses écrevisses et langoustes au feu de bois les pieds dans le sable gris avec une vue imprenable sur le coucher de soleil.',
    coords: [14.7118, -61.1824],
    photos: [
      '/images/spots/petibonum.jpg'
    ],
    rating: 4.8,
    reviewsCount: 520,
    isVerifiedPro: true,
    featured: true,
    priceRange: '€€€',
    address: 'Plage du Coin, Le Carbet',
    phone: '+596 596 78 04 34',
    website: 'https://lepetibonum.com',
    schedules: 'Mardi au Dimanche : 12h00 - 22h00',
    tags: ['Pieds dans le sable', 'Langouste', 'Coucher de soleil', 'Chef renommé'],
    badges: ['⭐ Coup de cœur', '🔥 Très populaire']
  },
  {
    id: 'randonnee-caravelle',
    slug: 'sentier-reserve-naturelle-caravelle',
    name: 'Sentier du Grand Sentier de la Caravelle',
    category: 'hiking',
    subCategory: 'Randonnée côtière & Mangrove',
    commune: 'La Trinité (Tartane)',
    description: 'Une des plus belles randonnées de Martinique au cœur de la réserve naturelle. Falaises ocres déchiquetées par l\'Atlantique, forêt sèche, mangroves et ruines du Château Dubuc.',
    coords: [14.7667, -60.8833],
    photos: [
      '/images/spots/sentier-caravelle.jpg',
      '/images/spots/sentier-caravelle-falaises.jpg'
    ],
    rating: 4.8,
    reviewsCount: 390,
    featured: true,
    schedules: 'Départ recommandé le matin à la fraîche',
    tags: ['Atlantique', 'Ruines historiques', 'Panorama océan', 'Réserve naturelle'],
    badges: ['⭐ Coup de cœur', '👨‍👩‍👧‍👦 Adapté aux familles']
  },
  {
    id: 'bar-babaorum',
    slug: 'babaorum-fort-de-france',
    name: 'Le Babaorum Lounge',
    category: 'bar',
    subCategory: 'Bar à cocktails & Rhums arrangés',
    commune: 'Fort-de-France',
    description: 'Bar d\'ambiance et terrasse verdoyante niché dans une cour tropicale intime. Cocktails créatifs à base de rhums agricoles d\'exception et planches de tapas antillais.',
    coords: [14.6125, -61.0589],
    photos: [
      '/images/spots/babaorum.jpg'
    ],
    rating: 4.7,
    reviewsCount: 230,
    isVerifiedPro: true,
    address: 'Route de Châteauboeuf, Fort-de-France',
    phone: '+596 596 75 03 36',
    website: 'https://babaorum.mq',
    schedules: 'Mercredi au Samedi : 18h30 - 01h00',
    tags: ['Cocktails', 'Ambiance lounge', 'Jardin tropical', 'Rhum AOC'],
    badges: ['❤️ Romantique']
  },
  {
    id: 'sunset-bar-diamant',
    slug: 'sunset-bar-diamant',
    name: 'Sunset Bar & Tapas Le Diamant',
    category: 'bar',
    subCategory: 'Bar vue coucher de soleil',
    commune: 'Le Diamant',
    description: 'Le spot idéal pour siroter un Ti-Punch ou un planteur glacé en contemplant le soleil disparaître derrière le Rocher du Diamant.',
    coords: [14.4812, -61.0315],
    photos: [
      '/images/spots/sunset-diamant.jpg'
    ],
    rating: 4.9,
    reviewsCount: 310,
    schedules: 'Tous les jours dès 17h00',
    tags: ['Coucher de soleil', 'Vue rocher', 'Planteur', 'Musique douce'],
    badges: ['🌅 Plus beau coucher de soleil']
  },
  {
    id: 'excursion-dauphins',
    slug: 'rencontre-dauphins-cote-caraibe',
    name: 'Excursion Dauphins & Cétacés en Mer',
    category: 'excursion',
    subCategory: 'Observation marine respectueuse',
    commune: 'Le Carbet / Bellefontaine',
    description: 'Partez à la rencontre des bancs de dauphins tachetés et dauphins de Fraser qui vivent à l\'année dans les eaux calmes du sanctuaire AGOA au large de la côte caraïbe.',
    coords: [14.6756, -61.1642],
    photos: [
      '/images/spots/excursion-dauphins.jpg',
      '/images/spots/excursion-dauphins-nage.jpg'
    ],
    rating: 4.9,
    reviewsCount: 460,
    isVerifiedPro: true,
    featured: true,
    priceRange: '55€ - 75€ / pers',
    phone: '+596 696 45 88 90',
    website: 'https://dauphins-martinique.example.com',
    schedules: 'Départs matinaux à 8h00',
    tags: ['Dauphins', 'Sanctuaire AGOA', 'Bateau', 'Famille', 'Éco-guide'],
    badges: ['⭐ Coup de cœur', '👨‍👩‍👧‍👦 Adapté aux familles']
  },
  {
    id: 'spot-ponton-anses-arlet',
    slug: 'ponton-eglise-anses-arlet',
    name: 'Le Célèbre Ponton des Anses-d\'Arlet',
    category: 'photo',
    subCategory: 'Spot photo iconique',
    commune: 'Les Anses-d\'Arlet',
    description: 'Le cliché de carte postale le plus célèbre de Martinique : la perspective parfaite depuis le ponton en bois aligné au millimètre sur le clocher de l\'église Saint-Henri face à la mer turquoise.',
    coords: [14.4917, -61.0822],
    photos: [
      '/images/spots/ponton-anses-arlet.jpg',
      '/images/candidates/ponton-arlet-b.jpg'
    ],
    rating: 4.9,
    reviewsCount: 780,
    featured: true,
    tags: ['Carte postale', 'Ponton', 'Instagram', 'Village typique'],
    badges: ['⭐ Coup de cœur', '🔥 Très populaire']
  },
  {
    id: 'spot-memorial-cap110',
    slug: 'memorial-cap-110-diamant',
    name: 'Mémorial Cap 110 Mémoire et Fraternité',
    category: 'photo',
    subCategory: 'Monument historique face à l\'océan',
    commune: 'Le Diamant',
    description: 'Ensemble de 15 imposantes statues de béton blanc tournées vers le grand large et le golfe de Guinée, érigées face au Rocher du Diamant sur la falaise de l\'Anse Caffard.',
    coords: [14.4714, -61.0489],
    photos: [
      '/images/spots/cap110.jpg',
      '/images/candidates/cap110-b.jpg'
    ],
    rating: 4.8,
    reviewsCount: 540,
    tags: ['Histoire', 'Sculptures', 'Vue océan', 'Émotion'],
    badges: ['⭐ Coup de cœur']
  },
  {
    id: 'belvedere-morne-gommier',
    slug: 'belvedere-morne-gommier',
    name: 'Belvédère du Morne Gommier (Panorama 360°)',
    category: 'viewpoint',
    subCategory: 'Table d\'orientation & Vue panoramique',
    commune: 'Le Marin',
    description: 'À près de 300 mètres d\'altitude, ce point de vue aménagé offre le panorama le plus spectaculaire sur tout le Sud martiniquais : la baie du Marin, Sainte-Anne, le Diamant et l\'île de Sainte-Lucie.',
    coords: [14.4828, -60.8872],
    photos: [
      '/images/spots/morne-gommier.jpg',
      '/images/candidates/gommier-b.jpg'
    ],
    rating: 4.9,
    reviewsCount: 320,
    tags: ['Panorama 360°', 'Table orientation', 'Sainte-Lucie', 'Jardin tropical'],
    badges: ['⭐ Coup de cœur']
  },
  {
    id: 'secret-anse-trabaud',
    slug: 'anse-trabaud-sauvage',
    name: '💎 Anse Trabaud (Plage Sauvage Secrète)',
    category: 'hidden_gem',
    subCategory: 'Crique sauvage isolée',
    commune: 'Sainte-Anne',
    description: 'Accessible par une piste caillouteuse ou par la Trace des Caps, cette immense anse déserte de sable blond est l\'un des secrets les mieux gardés de l\'île. Zéro commerce, nature brute et paix totale.',
    coords: [14.4325, -60.8492],
    photos: [
      '/images/spots/anse-trabaud.jpg',
      '/images/candidates/trabaud-b.jpg'
    ],
    rating: 4.9,
    reviewsCount: 165,
    featured: true,
    isHiddenGem: true,
    parking: 'Difficile',
    toilets: false,
    restaurantsNearby: false,
    tags: ['Spot Secret', 'Sauvage', 'Sans foule', 'Sable doré', 'Baignade nature'],
    badges: ['💎 Spot Secret', '⭐ Coup de cœur']
  },
  {
    id: 'secret-crique-noire',
    slug: 'crique-secrete-anse-noire',
    name: '💎 Crique Cachée des Pêcheurs',
    category: 'hidden_gem',
    subCategory: 'Coin snorkeling secret',
    commune: 'Les Anses-d\'Arlet',
    description: 'Petite calanque dissimulée derrière les rochers d\'Anse Noire, accessible uniquement à la nage ou en kayak. Les fonds marins y sont intacts avec d\'impressionnants bancs de carangues.',
    coords: [14.5312, -61.0895],
    photos: [
      '/images/spots/anse-noire.jpg',
      '/images/spots/anse-noire-ponton.jpg'
    ],
    rating: 4.9,
    reviewsCount: 95,
    isHiddenGem: true,
    tags: ['Spot Secret', 'Snorkeling vierge', 'Kayak', 'Grotte marine'],
    badges: ['💎 Spot Secret']
  },
  {
    id: 'grande-anse-arlet',
    slug: 'grande-anse-arlet',
    name: 'Plage de Grande Anse d\'Arlet',
    category: 'beach',
    subCategory: 'Baignade, Pontons & Tortues',
    commune: 'Les Anses-d\'Arlet',
    description: 'Une baie abritée de sable doré d\'un kilomètre de long. Eau calme et limpide, idéale pour la baignade et le coucher de soleil. Bordée de pontons en bois et de terrasses créoles les pieds dans l\'eau.',
    coords: [14.5020, -61.0880],
    photos: [
      '/images/spots/grande-anse.jpg',
      '/images/spots/grande-anse-sunset.jpg'
    ],
    rating: 4.8,
    reviewsCount: 420,
    featured: true,
    crowdLevel: 'Modérée',
    parking: 'Limité',
    toilets: true,
    restaurantsNearby: true,
    tags: ['Sable doré', 'Pontons', 'Coucher de soleil', 'Terrasses créoles', 'Tortues'],
    badges: ['⭐ Coup de cœur', '🔥 Très populaire'],
    realTime: {
      weather: 'Ensoleillé',
      tempAir: 30,
      tempWater: 28,
      windSpeed: 10,
      uvIndex: 9,
      seaState: 'Calme',
      sargassum: 'none',
      lastUpdate: 'Il y a 10 min'
    }
  },
  {
    id: 'pointe-marin',
    slug: 'plage-pointe-marin-sainte-anne',
    name: 'Plage de Pointe Marin',
    category: 'beach',
    subCategory: 'Lagon calme & Cocotiers',
    commune: 'Sainte-Anne',
    description: 'Un magnifique lagon turquoise aux eaux translucides et sans vagues. Ombragée de cocotiers géants, elle est parfaite pour les familles avec jeunes enfants et offre une vue dégagée sur le Rocher du Diamant.',
    coords: [14.4447, -60.8808],
    photos: [
      '/images/spots/pointe-marin.jpg',
      '/images/spots/pointe-marin-lagon.jpg'
    ],
    rating: 4.7,
    reviewsCount: 380,
    crowdLevel: 'Modérée',
    parking: 'Payant',
    toilets: true,
    restaurantsNearby: true,
    tags: ['Lagon calme', 'Famille', 'Cocotiers', 'Bars de plage', 'Coucher de soleil'],
    badges: ['👨‍👩‍👧‍👦 Adapté aux familles'],
    realTime: {
      weather: 'Ensoleillé',
      tempAir: 30,
      tempWater: 28,
      windSpeed: 12,
      uvIndex: 9,
      seaState: 'Calme',
      sargassum: 'none',
      lastUpdate: 'Il y a 20 min'
    }
  },
  {
    id: 'anse-figuier',
    slug: 'plage-anse-figuier-riviere-pilote',
    name: 'Plage de l\'Anse Figuier',
    category: 'beach',
    subCategory: 'Aquarium naturel & Eaux limpides',
    commune: 'Rivière-Pilote',
    description: 'Superbe plage de sable doré aux eaux calmes et transparentes. Les rochers situés aux extrémités abritent un véritable aquarium naturel où observer une multitude de poissons tropicaux colorés à quelques mètres du rivage.',
    coords: [14.4715, -60.9405],
    photos: [
      '/images/spots/anse-figuier.jpg',
      '/images/spots/anse-figuier-snorkeling.jpg'
    ],
    rating: 4.8,
    reviewsCount: 350,
    featured: true,
    crowdLevel: 'Modérée',
    parking: 'Facile et gratuit',
    toilets: true,
    restaurantsNearby: true,
    tags: ['Snorkeling facile', 'Aquarium naturel', 'Sable doré', 'Écomusée', 'Pique-nique'],
    badges: ['⭐ Coup de cœur', '👨‍👩‍👧‍👦 Adapté aux familles'],
    realTime: {
      weather: 'Ensoleillé',
      tempAir: 29,
      tempWater: 28,
      windSpeed: 11,
      uvIndex: 8,
      seaState: 'Calme',
      sargassum: 'none',
      lastUpdate: 'Il y a 30 min'
    }
  },
  {
    id: 'pointe-faula',
    slug: 'plage-pointe-faula-vauclin',
    name: 'Plage de la Pointe Faula',
    category: 'beach',
    subCategory: 'Fonds blancs & Kitesurf',
    commune: 'Le Vauclin',
    description: 'Une plage unique où un banc de sable immergé (fonds blancs) permet d\'avancer sur des centaines de mètres au large avec de l\'eau tiède à mi-mollet. C\'est également le spot de kitesurf et de planche à voile numéro 1 de l\'île.',
    coords: [14.5458, -60.8385],
    photos: [
      '/images/spots/pointe-faula.jpg',
      '/images/spots/pointe-faula-panorama.jpg'
    ],
    rating: 4.6,
    reviewsCount: 290,
    crowdLevel: 'Modérée',
    parking: 'Facile et gratuit',
    toilets: true,
    restaurantsNearby: true,
    tags: ['Fonds blancs', 'Marche dans l\'eau', 'Kitesurf', 'Eau chaude', 'Alizés'],
    realTime: {
      weather: 'Venté et ensoleillé',
      tempAir: 29,
      tempWater: 29,
      windSpeed: 24,
      uvIndex: 8,
      seaState: 'Calme',
      sargassum: 'low',
      lastUpdate: 'Il y a 15 min'
    }
  },
  {
    id: 'tartane-plage',
    slug: 'plage-tartane-caravelle',
    name: 'Plage de Tartane (Presqu\'île de la Caravelle)',
    category: 'beach',
    subCategory: 'Ambiance côte atlantique & Pêcheurs',
    commune: 'La Trinité',
    description: 'Charmante plage protégée par une barrière de corail au cœur du village de pêcheurs de Tartane. Cocotiers, barques colorées, petits restaurants créoles et accès immédiat aux spots de surf de la Caravelle.',
    coords: [14.7710, -60.9100],
    photos: [
      '/images/spots/tartane.jpg',
      '/images/spots/tartane-barques.jpg'
    ],
    rating: 4.7,
    reviewsCount: 215,
    crowdLevel: 'Faible',
    parking: 'Facile et gratuit',
    toilets: true,
    restaurantsNearby: true,
    tags: ['Presqu\'île de la Caravelle', 'Pêcheurs', 'Surf à proximité', 'Ambiance créole'],
    realTime: {
      weather: 'Belles éclaircies',
      tempAir: 28,
      tempWater: 27,
      windSpeed: 18,
      uvIndex: 7,
      seaState: 'Calme',
      sargassum: 'none',
      lastUpdate: 'Il y a 40 min'
    }
  }
];

export const INITIAL_ALERTS: CommunityAlert[] = [
  {
    id: 'alt-1',
    type: 'sargasses',
    title: 'Arrivage modéré de sargasses',
    location: 'Plage de Cap Est',
    commune: 'Le François',
    description: 'Présence d\'un banc d\'algues sargasses sur la partie est de la baie. Nettoyage communal prévu demain matin.',
    timestamp: 'Il y a 35 min',
    reportedBy: 'Kévin R. (Habitant François)',
    severity: 'warning',
    verified: true,
    coords: [14.602, -60.865]
  },
  {
    id: 'alt-2',
    type: 'info',
    title: 'Excellentes conditions de baignade & tortues actives',
    location: 'Anse Dufour',
    commune: 'Les Anses-d\'Arlet',
    description: 'Eau à 28°C parfaitement limpide, visibilité exceptionnelle sous l\'eau (plus de 15m), 3 tortues observées à 20m de la rive.',
    timestamp: 'Il y a 1h',
    reportedBy: 'Mélissa G.',
    severity: 'info',
    verified: true,
    coords: [14.5264, -61.0858]
  },
  {
    id: 'alt-3',
    type: 'houle',
    title: 'Forte houle australe',
    location: 'Plage du Diamant',
    commune: 'Le Diamant',
    description: 'Rouleaux puissants et courant de fond important. Baignade déconseillée aux enfants ce jour.',
    timestamp: 'Il y a 2h',
    reportedBy: 'Poste SNSM / Observateur local',
    severity: 'danger',
    verified: true,
    coords: [14.4789, -61.0261]
  }
];

export const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    author: {
      name: 'Yannick B.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      badge: 'Guide Local 🌟',
      isLocal: true
    },
    timestamp: 'Il y a 2h',
    content: 'Coucher de soleil grandiose ce soir au Diamant après une session baignade magique. Pas un gramme de sargasses côté sud caraïbe cette semaine, profitez-en les amis ! 🌅🌊',
    location: 'Le Diamant',
    photos: [
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80'
    ],
    likes: 42,
    commentsCount: 6,
    tags: ['#Martinique', '#LeDiamant', '#Sunset', '#BonPlan'],
    category: 'plage'
  },
  {
    id: 'post-2',
    author: {
      name: 'Chloé & Thomas',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      badge: 'Explorateur 🧭',
      isLocal: false
    },
    timestamp: 'Il y a 4h',
    content: 'On a suivi la recommandation de l\'application pour Anse Dufour à 8h du matin : incroyable ! Nous avons nagé avec deux tortues vertes pendant 45 minutes dans un silence complet. Merci à la communauté pour le conseil de venir tôt !',
    location: 'Anse Dufour',
    photos: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    likes: 67,
    commentsCount: 11,
    tags: ['#Tortues', '#Snorkeling', '#MadininaMagic'],
    category: 'conseil'
  },
  {
    id: 'post-3',
    author: {
      name: 'Restaurant Ti Sable',
      avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80',
      badge: 'Pro Vérifié ✅',
      isLocal: true
    },
    timestamp: 'Il y a 6h',
    content: 'Ce soir c\'est soirée jazz acoustique pieds dans le sable à Grande Anse ! Arrivage direct de thon rouge et langoustes des pêcheurs locaux. Réservez votre table face au couchant ! 🎷🦞',
    location: 'Les Anses d\'Arlet',
    likes: 89,
    commentsCount: 14,
    tags: ['#Gastronomie', '#Soiree', '#LiveMusic'],
    category: 'restaurant'
  }
];

export const INITIAL_FORUM_TOPICS: ForumTopic[] = [
  {
    id: 'f-1',
    title: 'Voyage en famille 10 jours en avril : quelle côte choisir pour loger ?',
    category: 'Tourisme',
    author: {
      name: 'Famille Dupont',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      badge: 'Nouveau Membre'
    },
    createdAt: 'Aujourd\'hui à 11h',
    repliesCount: 18,
    views: 340,
    solved: true,
    lastReplyAuthor: 'Yannick B. (Guide Local)',
    excerpt: 'Bonjour à tous ! Nous venons avec 2 enfants (6 et 9 ans). On hésite entre loger aux Trois-Îlets ou vers Sainte-Luce pour rayonner facilement sur les plages sans trop d\'embouteillages...'
  },
  {
    id: 'f-2',
    title: 'Installation retraite en Martinique : conseils pour le secteur Sainte-Luce / Marin ?',
    category: 'Retraite',
    author: {
      name: 'Gérard & Sylvie',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      badge: 'Membre Passionné'
    },
    createdAt: 'Hier',
    repliesCount: 24,
    views: 620,
    solved: false,
    lastReplyAuthor: 'Marie-Paule (Résidente Sainte-Luce)',
    excerpt: 'Nous envisageons de passer 6 mois par an en Martinique. Quels sont vos retours sur la vie quotidienne, la proximité des centres médicaux, et les activités pour seniors ?'
  },
  {
    id: 'f-3',
    title: 'Où manger le meilleur poulet boucané authentique sur la route des plages ?',
    category: 'Restaurants',
    author: {
      name: 'Loïc V.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      badge: 'Explorateur 🧭'
    },
    createdAt: 'Il y a 3 jours',
    repliesCount: 31,
    views: 890,
    solved: true,
    lastReplyAuthor: 'Fabrice K.',
    excerpt: 'Amis gourmands, quel est votre spot secret préféré pour le poulet boucané au feu de canne à sucre avec la vraie sauce chien ?'
  }
];

export const BADGES_LIST: UserBadge[] = [
  {
    id: 'b-explorer',
    name: 'Explorateur Madinina',
    description: 'A visité et commenté plus de 5 plages et spots différents',
    icon: '🧭',
    unlocked: true,
    requiredPoints: 50
  },
  {
    id: 'b-beach-master',
    name: 'Expert Plages',
    description: 'A partagé plus de 3 états de plage ou conditions en direct',
    icon: '🏖️',
    unlocked: true,
    requiredPoints: 100
  },
  {
    id: 'b-local-guide',
    name: 'Guide Local Certifié',
    description: 'A aidé plus de 20 voyageurs sur le forum d\'entraide',
    icon: '⭐',
    unlocked: false,
    requiredPoints: 250
  },
  {
    id: 'b-turtle-friend',
    name: 'Ami des Tortues',
    description: 'A rédigé un guide respectueux du snorkeling responsable',
    icon: '🐢',
    unlocked: true,
    requiredPoints: 150
  },
  {
    id: 'b-ambassador',
    name: 'Ambassadeur de la Martinique',
    description: 'Pilier de la communauté Martinique Explorer (1000+ XP)',
    icon: '👑',
    unlocked: false,
    requiredPoints: 1000
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'top-10-plages-martinique',
    title: 'Top 10 des plus belles plages de Martinique en 2026',
    category: 'Guide Plages',
    readTime: '6 min de lecture',
    author: 'Équipe Martinique Explorer',
    date: '15 Janvier 2026',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    summary: 'Du sable blanc bordé de cocotiers des Salines aux criques sauvages de sable noir du Prêcheur, découvrez notre classement exclusif testé par la communauté.',
    content: 'La Martinique offre une diversité côtière unique dans toutes les Petites Antilles. Au sud, les anses dorées et les eaux tièdes caribéennes invitent à la baignade sereine en famille. Au nord, sous le regard de la Montagne Pelée, le sable noir confère un caractère sauvage inoubliable...'
  },
  {
    id: 'blog-2',
    slug: 'ou-observer-tortues-martinique',
    title: 'Où et quand observer les tortues marines en Martinique ? Le guide complet',
    category: 'Snorkeling & Faune',
    readTime: '5 min de lecture',
    author: 'Yannick B. (Biologiste marin amateur)',
    date: '28 Janvier 2026',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    summary: 'Anse Dufour, Grande Anse d\'Arlet, Anse Noire... Nos conseils d\'experts locaux pour observer les tortues vertes sans les déranger et à quelle heure venir pour éviter la foule.',
    content: 'Les herbiers de phanérogames des Anses d\'Arlet sont le garde-manger favori des tortues vertes (Chelonia mydas). En arrivant dès 7h30 du matin, avant l\'arrivée des premiers groupes de visiteurs, la surface est comme un miroir...'
  },
  {
    id: 'blog-3',
    slug: 'retraite-et-installation-martinique',
    title: 'S\'installer ou passer sa retraite en Martinique : Tout ce qu\'il faut savoir',
    category: 'Vivre en Martinique',
    readTime: '8 min de lecture',
    author: 'Cécile Fontaine',
    date: '02 Février 2026',
    image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80',
    summary: 'Coût de la vie, système de santé, sélection des communes les plus paisibles (Sainte-Luce, Diamant, Marin), vie associative : le guide concret pour une installation réussie.',
    content: 'De plus en plus de retraités font le choix de vivre l\'hiver ou toute l\'année sous la douceur du climat tropical. Avec un décalage horaire modéré et les infrastructures sanitaires européennes (CHU de Fort-de-France), l\'île présente des atouts majeurs...'
  },
  {
    id: 'blog-4',
    slug: 'tour-des-yoles-rondes-2026',
    title: 'Tour des Yoles Rondes 2026 : Parcours officiel et meilleurs points de vue côtiers',
    category: 'Actualités & Événements',
    readTime: '7 min de lecture',
    author: 'Mathieu D. (Chroniqueur Nautique)',
    date: '10 Février 2026',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1000&q=80',
    summary: 'L\'événement sportif et populaire le plus vibrant de l\'année arrive ! Découvrez les étapes clés entre Le François, Saint-Pierre et Sainte-Anne, et où vous placer pour vivre l\'effervescence.',
    content: 'Emblème absolu du patrimoine martiniquais inscrit à l\'UNESCO, le Tour des Yoles Rondes mobilise chaque été des dizaines de milliers de passionnés. Naviguer sans quille ni gouvernail avec pour seul contrepoids les équipiers juchés sur les bois dressés est un spectacle grandiose...'
  },
  {
    id: 'blog-5',
    slug: 'saison-ponte-tortues-luths',
    title: 'Saison de ponte des tortues luths : Les plages du Nord sous haute surveillance écologique',
    category: 'Faune & Écologie',
    readTime: '4 min de lecture',
    author: 'Réseau Tortues Marines Martinique',
    date: '18 Février 2026',
    image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=1000&q=80',
    summary: 'Les plus grandes tortues marines du monde reviennent nicher sur les plages de sable volcanique. Comment observer ce phénomène nocturne dans le strict respect de l\'espèce.',
    content: 'Chaque année entre mars et juillet, les géantes des mers (jusqu\'à 500 kg pour près de 2 mètres) gravissent les pentes de sable noir d\'Anse Couleuvre, de Saint-Pierre et du Carbet pour enfouir leurs œufs. Les bénévoles patrouillent chaque nuit pour sécuriser les nids...'
  },
  {
    id: 'blog-6',
    slug: 'bilan-sargasses-météo-cote-caraibe',
    title: 'Sargasses en Martinique : Pourquoi la côte Caraïbe reste protégée et limpide',
    category: 'Météo & Littoral',
    readTime: '5 min de lecture',
    author: 'Observatoire Littoral Madinina',
    date: '24 Février 2026',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
    summary: 'Comprendre les courants marins et les alizés pour choisir ses plages en toute sérénité. Toutes les explications sur la barrière naturelle de la côte Ouest.',
    content: 'Grâce à la géographie de l\'île et à la dorsale montagneuse qui bloque les vents d\'Est, les plages de la côte Sud-Caraïbe (Anses d\'Arlet, Anse Dufour, Grande Anse, Saint-Pierre) demeurent naturellement préservées de la quasi-totalité des bancs d\'algues sargasses...'
  },
  {
    id: 'blog-7',
    slug: 'carnaval-martinique-programme-conseils',
    title: 'Carnaval de Martinique : Guide pratique des jours gras et des traditions du Vaval',
    category: 'Actualités & Événements',
    readTime: '6 min de lecture',
    author: 'Marie-Paule K.',
    date: '01 Mars 2026',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    summary: 'Dimanche gras, Lundi des mariages burlesques, Mardi rouge des diables rouges et Mercredi des cendres : codes vestimentaires, horaires et ambiance unique au monde.',
    content: 'Le carnaval en Martinique ne ressemble à aucun autre dans les Caraïbes. Spontané, populaire et satirique, il invite chaque visiteur à se vêtir selon les couleurs rituelles de chaque journée pour défiler au rythme envoûtant des groupes à pied et des tambours chouval bwa...'
  },
  {
    id: 'blog-8',
    slug: 'route-des-rhums-aoc-visites',
    title: 'Route des Rhums AOC : Les 5 distilleries historiques incontournables à visiter',
    category: 'Gastronomie & Patrimoine',
    readTime: '8 min de lecture',
    author: 'Équipe Martinique Explorer',
    date: '04 Mars 2026',
    image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1000&q=80',
    summary: 'Habitation Clément, Distillerie Depaz au pied de la Pelée, Neisson au Carbet... Parcourez le seul rhum agricole au monde bénéficiant d\'une Appellation d\'Origine Contrôlée.',
    content: 'Nectar né du pur jus de canne fraîchement pressé et distillé en colonnes traditionnelles, le rhum agricole martiniquais est un trésor national. Visiter les domaines, c\'est plonger au cœur des parcs botaniques centenaires et comprendre le vieillissement en fûts de chêne...'
  }
];
