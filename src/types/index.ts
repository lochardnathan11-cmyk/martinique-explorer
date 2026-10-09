export type PlaceCategory = 
  | 'beach' 
  | 'snorkeling' 
  | 'activity' 
  | 'restaurant' 
  | 'accommodation' 
  | 'hiking' 
  | 'bar' 
  | 'excursion' 
  | 'photo' 
  | 'viewpoint' 
  | 'hidden_gem' 
  | 'event';

export type SargassumLevel = 'none' | 'low' | 'moderate' | 'high';

export interface RealTimeConditions {
  weather: string;
  tempAir: number;
  tempWater: number;
  windSpeed: number; // km/h
  uvIndex: number;
  seaState: 'Calme' | 'Peu agitée' | 'Agitée' | 'Forte houle';
  sargassum: SargassumLevel;
  lastUpdate: string;
}

export interface PlaceReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  userBadge?: string;
}

export interface PlaceItem {
  id: string;
  slug?: string;
  name: string;
  category: PlaceCategory;
  subCategory?: string;
  commune: string;
  description: string;
  coords: [number, number]; // [lat, lng]
  photos: string[];
  rating: number;
  reviewsCount: number;
  reviews?: PlaceReview[];
  isVerifiedPro?: boolean;
  featured?: boolean;
  isHiddenGem?: boolean; // Spot caché oui/non
  badges?: string[]; // ⭐ Coup de cœur, 🔥 Populaire, 💎 Spot Secret, etc.

  // Plage & Snorkeling specifics
  crowdLevel?: 'Faible' | 'Modérée' | 'Forte';
  parking?: 'Facile et gratuit' | 'Payant' | 'Limité' | 'Difficile';
  toilets?: boolean;
  restaurantsNearby?: boolean;
  accessibilityPMR?: boolean;
  tags?: string[];
  isDangerous?: boolean;
  isLifeguarded?: boolean;
  realTime?: RealTimeConditions;

  // Snorkeling specifics
  spotDifficulty?: 'Débutant' | 'Intermédiaire' | 'Confirmé';
  depth?: string;
  observableFauna?: string[];
  idealConditions?: string;
  safetyTips?: string;

  // Activités & Restaurants specifics
  priceRange?: string; // €, €€, €€€
  phone?: string;
  website?: string;
  schedules?: string;
  bookingUrl?: string;
  specialty?: string;
  address?: string;

  // Hébergements specifics
  accomType?: 'Hôtel' | 'Villa' | 'Airbnb' | 'Chambre d\'hôtes';
  averagePrice?: number;
  services?: string[];
  seaside?: boolean;
  pool?: boolean;
  affiliateBookingUrl?: string;

  // Événements specifics
  eventDate?: string;
  eventTime?: string;
  eventType?: string;
}

export interface CommunityAlert {
  id: string;
  type: 'sargasses' | 'meduses' | 'houle' | 'plage_fermee' | 'embouteillage' | 'info';
  title: string;
  location: string;
  commune: string;
  description: string;
  timestamp: string;
  reportedBy: string;
  severity: 'info' | 'warning' | 'danger';
  verified: boolean;
  coords?: [number, number];
  photo?: string;
}

export interface SocialPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    badge: string;
    isLocal: boolean;
  };
  timestamp: string;
  content: string;
  location?: string;
  photos?: string[];
  likes: number;
  commentsCount: number;
  tags: string[];
  category: 'restaurant' | 'plage' | 'sargasses' | 'conseil' | 'photo' | 'sorties';
}

export interface ForumTopic {
  id: string;
  title: string;
  category: 'Tourisme' | 'Restaurants' | 'Activités' | 'Immobilier' | 'Vie locale' | 'Retraite' | 'Conseils';
  author: {
    name: string;
    avatar: string;
    badge: string;
  };
  createdAt: string;
  repliesCount: number;
  views: number;
  solved: boolean;
  lastReplyAuthor?: string;
  excerpt: string;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requiredPoints: number;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  places: PlaceItem[];
  notes?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  image: string;
  summary: string;
  content: string;
}

export type UserRole = 'visitor' | 'member' | 'moderator' | 'admin';
export type AppLanguage = 'fr' | 'en' | 'de' | 'es';
