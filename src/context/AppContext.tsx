'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  PlaceItem,
  CommunityAlert,
  SocialPost,
  ForumTopic,
  UserRole,
  AppLanguage,
  ItineraryDay,
  UserBadge,
  ExplorerLevel
} from '@/types';
import {
  INITIAL_PLACES,
  INITIAL_ALERTS,
  INITIAL_POSTS,
  INITIAL_FORUM_TOPICS,
  BADGES_LIST,
  EXPLORER_LEVELS
} from '@/data/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AppContextType {
  // Supabase state
  isSupabaseReady: boolean;
  // Places & Directory
  places: PlaceItem[];
  addPlace: (place: Omit<PlaceItem, 'id'>) => void;
  updatePlace: (id: string, place: Partial<PlaceItem>) => void;
  deletePlace: (id: string) => void;

  // Alerts in real time
  alerts: CommunityAlert[];
  addAlert: (alert: Omit<CommunityAlert, 'id' | 'timestamp' | 'verified'>) => void;
  deleteAlert: (id: string) => void;
  verifyAlert: (id: string) => void;

  // Community Social Feed
  posts: SocialPost[];
  addPost: (content: string, location?: string, photo?: string, tag?: string) => void;
  likePost: (id: string) => void;
  deletePost: (id: string) => void;

  // Forum Q&A
  forumTopics: ForumTopic[];
  addForumTopic: (title: string, category: any, excerpt: string) => void;

  // Favorites & Itinerary
  favorites: string[];
  toggleFavorite: (placeId: string) => void;
  itinerary: ItineraryDay[];
  addToItinerary: (dayNumber: number, place: PlaceItem) => void;
  removeFromItinerary: (dayNumber: number, placeId: string) => void;

  // User & Auth & Roles
  currentUser: AuthUser | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; isAdmin: boolean; error?: string }>;
  signup: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (name: string) => Promise<{ success: boolean; error?: string }>;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  userPoints: number;
  addPoints: (pts: number) => void;
  badges: UserBadge[];
  currentLevel: ExplorerLevel;
  nextLevel: ExplorerLevel | null;
  levelProgress: number;
  xpBreakdown: {
    favoritesXP: number;
    itineraryXP: number;
    profileXP: number;
    communityXP: number;
    badgesBonusXP: number;
    extraXP: number;
    totalXP: number;
  };

  // Global search & filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;

  // Modals management
  activeModal: { type: string | null; data?: any };
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_ITINERARY: ItineraryDay[] = [
  {
    dayNumber: 1,
    title: 'Jour 1 : Sud Sauvage & Plages Mythiques',
    places: [INITIAL_PLACES[0]], // Les Salines
    notes: 'Déjeuner langoustes sur la plage + coucher de soleil'
  },
  {
    dayNumber: 2,
    title: 'Jour 2 : Rencontre avec les tortues & Anses d\'Arlet',
    places: [INITIAL_PLACES[1], INITIAL_PLACES[9]], // Anse Dufour & Ti Sable
    notes: 'Arriver tôt le matin à 8h pour nager avec les tortues'
  },
  {
    dayNumber: 3,
    title: 'Jour 3 : Fonds Blancs & Baignoire de Joséphine',
    places: [INITIAL_PLACES[5]], // Baignoire de Joséphine
    notes: 'Journée catamaran et baptême du rhum créole'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [places, setPlaces] = useState<PlaceItem[]>(INITIAL_PLACES);
  const [alerts, setAlerts] = useState<CommunityAlert[]>(INITIAL_ALERTS);
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>(INITIAL_FORUM_TOPICS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(INITIAL_ITINERARY);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('visitor');
  const [language, setLanguage] = useState<AppLanguage>('fr');
  const [extraXP, setExtraXP] = useState<number>(0);
  const [hasSavedProfile, setHasSavedProfile] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<{ type: string | null; data?: any }>({ type: null });

  const [isSupabaseReady] = useState<boolean>(isSupabaseConfigured);

  // Persistence in localStorage on browser side & Supabase session listener
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('mq_current_user');
      if (savedUser) {
        const u = JSON.parse(savedUser) as AuthUser;
        setCurrentUser(u);
        setUserRole(u.role);
        // Charger les favoris uniquement pour l'utilisateur connecté
        const userFavKey = `mq_favorites_${u.email.toLowerCase()}`;
        const savedFavs = localStorage.getItem(userFavKey) || localStorage.getItem('mq_favorites');
        if (savedFavs) {
          const parsedFavs = JSON.parse(savedFavs);
          if (Array.isArray(parsedFavs)) {
            setFavorites(parsedFavs);
          }
        }
      } else {
        // Visiteur non connecté : aucun favori par défaut
        setFavorites([]);
      }
      const savedExtra = Number(localStorage.getItem('mq_extra_xp') || '0');
      if (Number.isFinite(savedExtra)) {
        setExtraXP(savedExtra);
      }
      setHasSavedProfile(Boolean(localStorage.getItem('mq_account_prefs_v2')));
    } catch (e) {
      // Ignore in SSR
    }

    // Charger les lieux en direct depuis Supabase
    fetch('/api/spots')
      .then(res => res.json())
      .then(data => {
        if (data && data.spots && data.spots.length > 0) {
          setPlaces(data.spots);
        }
      })
      .catch(err => console.log('Could not load live spots:', err));

    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const email = session.user.email || '';
          const name = (session.user.user_metadata?.name as string) || email.split('@')[0];
          const isAdmin = email.includes('admin') || email.includes('papa') || session.user.user_metadata?.role === 'admin' || email.toLowerCase() === 'nathan.test@gmail.com';
          const role: UserRole = isAdmin ? 'admin' : 'member';
          const user: AuthUser = {
            id: session.user.id,
            name,
            email,
            role
          };
          setCurrentUser(user);
          setUserRole(role);
          try {
            localStorage.setItem('mq_current_user', JSON.stringify(user));
            const userFavKey = `mq_favorites_${email.toLowerCase()}`;
            const savedFavs = localStorage.getItem(userFavKey) || localStorage.getItem('mq_favorites');
            if (savedFavs) {
              const parsedFavs = JSON.parse(savedFavs);
              if (Array.isArray(parsedFavs)) {
                setFavorites(parsedFavs);
              }
            }
          } catch (e) {}
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const email = session.user.email || '';
          const name = (session.user.user_metadata?.name as string) || email.split('@')[0];
          const isAdmin = email.includes('admin') || email.includes('papa') || session.user.user_metadata?.role === 'admin' || email.toLowerCase() === 'nathan.test@gmail.com';
          const role: UserRole = isAdmin ? 'admin' : 'member';
          const user: AuthUser = {
            id: session.user.id,
            name,
            email,
            role
          };
          setCurrentUser(user);
          setUserRole(role);
          try {
            localStorage.setItem('mq_current_user', JSON.stringify(user));
            const userFavKey = `mq_favorites_${email.toLowerCase()}`;
            const savedFavs = localStorage.getItem(userFavKey) || localStorage.getItem('mq_favorites');
            if (savedFavs) {
              const parsedFavs = JSON.parse(savedFavs);
              if (Array.isArray(parsedFavs)) {
                setFavorites(parsedFavs);
              }
            }
          } catch (e) {}
        } else if (_event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setUserRole('visitor');
          setFavorites([]);
          try {
            localStorage.removeItem('mq_current_user');
          } catch (e) {}
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Verrouiller le défilement de la page arrière-plan quand une modale est ouverte
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (activeModal.type) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [activeModal.type]);

  const login = async (email: string, password?: string): Promise<{ success: boolean; isAdmin: boolean; error?: string }> => {
    const clean = email.trim().toLowerCase();
    const isAdmin = clean.includes('papa') || clean.includes('admin') || clean === 'papa@martinique-explorer.com' || clean === 'nathan.test@gmail.com';

    if (isSupabaseConfigured && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: clean,
          password
        });

        if (error) {
          const raw = error.message || '';
          let friendlyError = 'Adresse e-mail ou mot de passe incorrect. Vérifiez vos informations ou créez un compte.';
          if (/email not confirmed/i.test(raw)) {
            friendlyError = 'Veuillez valider le lien de confirmation reçu par e-mail pour activer votre compte.';
          } else if (/too many requests|rate limit/i.test(raw)) {
            friendlyError = 'Trop de tentatives consécutives. Par sécurité, veuillez patienter quelques instants avant de réessayer.';
          } else if (/invalid email/i.test(raw)) {
            friendlyError = 'Le format de l’adresse e-mail est invalide.';
          }
          return { success: false, isAdmin: false, error: friendlyError };
        }

        if (data.user) {
          const name = (data.user.user_metadata?.name as string) || clean.split('@')[0];
          const isUserAdmin = isAdmin || data.user.user_metadata?.role === 'admin';
          const role: UserRole = isUserAdmin ? 'admin' : 'member';
          const user: AuthUser = {
            id: data.user.id,
            name,
            email: clean,
            role
          };

          setCurrentUser(user);
          setUserRole(role);
          try {
            localStorage.setItem('mq_current_user', JSON.stringify(user));
            const userFavKey = `mq_favorites_${clean}`;
            const savedFavs = localStorage.getItem(userFavKey) || localStorage.getItem('mq_favorites');
            if (savedFavs) {
              const parsed = JSON.parse(savedFavs);
              if (Array.isArray(parsed)) setFavorites(parsed);
            } else {
              setFavorites([]);
            }
          } catch (e) {}

          return { success: true, isAdmin: isUserAdmin };
        }
      } catch (err: any) {
        return { success: false, isAdmin: false, error: err.message };
      }
    }

    const role: UserRole = isAdmin ? 'admin' : 'member';
    const name = isAdmin ? 'Papa (Administrateur)' : clean.split('@')[0];
    const user: AuthUser = {
      name,
      email: clean,
      role
    };

    setCurrentUser(user);
    setUserRole(role);
    try {
      localStorage.setItem('mq_current_user', JSON.stringify(user));
      const userFavKey = `mq_favorites_${clean}`;
      const savedFavs = localStorage.getItem(userFavKey) || localStorage.getItem('mq_favorites');
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) setFavorites(parsed);
      } else {
        setFavorites([]);
      }
    } catch (e) {}

    return { success: true, isAdmin };
  };

  const signup = async (name: string, email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const clean = email.trim().toLowerCase();
    const isAdmin = clean.includes('papa') || clean.includes('admin');

    if (isSupabaseConfigured && password) {
      try {
        // Appeler notre route serveur pour créer l'utilisateur avec email_confirm: true (évite email rate limit)
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email: clean, password })
        });
        const data = await res.json();

        if (!res.ok) {
          return { success: false, error: data.error || 'Erreur lors de la création du compte' };
        }

        addPoints(50);
        // Connexion automatique immédiate après création
        const loginRes = await login(clean, password);
        return { success: loginRes.success, error: loginRes.error };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    const user: AuthUser = {
      name: name.trim() || 'Nouveau Membre',
      email: clean,
      role: isAdmin ? 'admin' : 'member'
    };

    setCurrentUser(user);
    setUserRole(user.role);
    setFavorites([]);
    try {
      localStorage.setItem('mq_current_user', JSON.stringify(user));
    } catch (e) {}

    addPoints(50);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    setCurrentUser(null);
    setUserRole('visitor');
    setFavorites([]);
    try {
      localStorage.removeItem('mq_current_user');
    } catch (e) {}
  };

  const updateUserProfile = async (name: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Utilisateur non connecté' };
    const updatedUser: AuthUser = {
      ...currentUser,
      name: name.trim() || currentUser.name
    };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('mq_current_user', JSON.stringify(updatedUser));
    } catch (e) {}

    if (isSupabaseConfigured) {
      try {
        await supabase.auth.updateUser({
          data: { name: name.trim() }
        });
      } catch (err: any) {
        console.warn('Could not sync name to Supabase:', err);
      }
    }
    return { success: true };
  };

  // 1. Décompte concret par catégorie de lieux et actions réelles
  const favoritePlaces = useMemo(() => {
    return places.filter(p => favorites.includes(p.id));
  }, [places, favorites]);

  const beachCount = useMemo(() => {
    return favoritePlaces.filter(p => p.category === 'beach' || p.category === 'hidden_gem').length;
  }, [favoritePlaces]);

  const snorkelingCount = useMemo(() => {
    return favoritePlaces.filter(
      p =>
        p.category === 'snorkeling' ||
        (p.subCategory && /snorkeling|tortue|plongée/i.test(p.subCategory)) ||
        (p.tags && p.tags.some(t => /snorkeling|tortue|plongée|aquarium/i.test(t)))
    ).length;
  }, [favoritePlaces]);

  const hikingCount = useMemo(() => {
    return favoritePlaces.filter(
      p =>
        p.category === 'hiking' ||
        p.category === 'activity' ||
        p.category === 'excursion' ||
        p.category === 'viewpoint'
    ).length;
  }, [favoritePlaces]);

  const userCreatedAlerts = useMemo(() => {
    return alerts.filter(a => a.id.startsWith('alt-')).length;
  }, [alerts]);

  const userCreatedPosts = useMemo(() => {
    return posts.filter(p => p.id.startsWith('post-')).length;
  }, [posts]);

  const userCreatedTopics = useMemo(() => {
    return forumTopics.filter(t => t.id.startsWith('f-')).length;
  }, [forumTopics]);

  const communityActionsCount = useMemo(() => {
    return userCreatedAlerts + userCreatedPosts + userCreatedTopics + (hasSavedProfile ? 1 : 0);
  }, [userCreatedAlerts, userCreatedPosts, userCreatedTopics, hasSavedProfile]);

  // 2. Évaluation stricte et unifiée des 6 Sceaux de l'île
  const badges: UserBadge[] = useMemo(() => {
    const firstFive = BADGES_LIST.filter(b => b.id !== 'b-ambassador').map(badge => {
      const targetCount = badge.targetCount || 1;
      let currentCount = 0;

      if (badge.id === 'b-anchor') {
        currentCount = Math.min(targetCount, favoritePlaces.length);
      } else if (badge.id === 'b-beach') {
        currentCount = Math.min(targetCount, beachCount);
      } else if (badge.id === 'b-reef') {
        currentCount = Math.min(targetCount, snorkelingCount);
      } else if (badge.id === 'b-hiking') {
        currentCount = Math.min(targetCount, hikingCount);
      } else if (badge.id === 'b-vigie') {
        currentCount = Math.min(targetCount, communityActionsCount);
      }

      return {
        ...badge,
        unlocked: currentCount >= targetCount,
        currentCount,
        targetCount
      };
    });

    const unlockedFirstFiveCount = firstFive.filter(b => b.unlocked).length;
    const ambassadorTemplate = BADGES_LIST.find(b => b.id === 'b-ambassador');
    if (!ambassadorTemplate) return firstFive;

    const ambassadorTarget = ambassadorTemplate.targetCount || 5;
    const ambassadorBadge: UserBadge = {
      ...ambassadorTemplate,
      currentCount: Math.min(ambassadorTarget, unlockedFirstFiveCount),
      targetCount: ambassadorTarget,
      unlocked: unlockedFirstFiveCount >= ambassadorTarget
    };

    return [...firstFive, ambassadorBadge];
  }, [favoritePlaces.length, beachCount, snorkelingCount, hikingCount, communityActionsCount]);

  // 3. Calcul transparent et équitable du Barème de Points (XP)
  const xpBreakdown = useMemo(() => {
    const favoritesXP = favoritePlaces.length * 15;
    const itineraryPlacesCount = itinerary.reduce((sum, d) => sum + (d.places ? d.places.length : 0), 0);
    const itineraryXP = itineraryPlacesCount * 10;
    const profileXP = (currentUser ? 30 : 0) + (hasSavedProfile ? 30 : 0);
    const communityXP = userCreatedAlerts * 25 + userCreatedPosts * 20 + userCreatedTopics * 15;
    const badgesBonusXP = badges.filter(b => b.unlocked).reduce((sum, b) => sum + b.requiredPoints, 0);
    const totalXP = favoritesXP + itineraryXP + profileXP + communityXP + badgesBonusXP + extraXP;

    return {
      favoritesXP,
      itineraryXP,
      profileXP,
      communityXP,
      badgesBonusXP,
      extraXP,
      totalXP
    };
  }, [
    favoritePlaces.length,
    itinerary,
    currentUser,
    hasSavedProfile,
    userCreatedAlerts,
    userCreatedPosts,
    userCreatedTopics,
    badges,
    extraXP
  ]);

  const userPoints = xpBreakdown.totalXP;

  const currentLevel = useMemo(() => {
    return EXPLORER_LEVELS.slice().reverse().find(l => userPoints >= l.minXP) || EXPLORER_LEVELS[0];
  }, [userPoints]);

  const nextLevel = useMemo(() => {
    return EXPLORER_LEVELS.find(l => l.level === currentLevel.level + 1) || null;
  }, [currentLevel]);

  const levelProgress = useMemo(() => {
    if (!nextLevel) return 100;
    const range = nextLevel.minXP - currentLevel.minXP;
    if (range <= 0) return 100;
    return Math.min(100, Math.max(6, Math.round(((userPoints - currentLevel.minXP) / range) * 100)));
  }, [userPoints, currentLevel, nextLevel]);

  const addPoints = (pts: number) => {
    setExtraXP(prev => {
      const next = prev + pts;
      try {
        localStorage.setItem('mq_extra_xp', String(next));
      } catch (e) {}
      return next;
    });
  };

  const toggleFavorite = (placeId: string) => {
    if (!currentUser) {
      openModal('auth_required_favorite', { placeId });
      return;
    }

    setFavorites(prev => {
      const exists = prev.includes(placeId);
      const next = exists ? prev.filter(id => id !== placeId) : [...prev, placeId];
      try {
        const userFavKey = `mq_favorites_${currentUser.email.toLowerCase()}`;
        localStorage.setItem(userFavKey, JSON.stringify(next));
        localStorage.setItem('mq_favorites', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const addPlace = (newPlace: Omit<PlaceItem, 'id'>) => {
    const created: PlaceItem = {
      ...newPlace,
      id: 'place-' + Date.now(),
      rating: newPlace.rating || 5.0,
      reviewsCount: newPlace.reviewsCount || 1
    };
    setPlaces(prev => [created, ...prev]);
    addPoints(30);
  };

  const updatePlace = (id: string, updated: Partial<PlaceItem>) => {
    setPlaces(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deletePlace = (id: string) => {
    setPlaces(prev => prev.filter(p => p.id !== id));
  };

  const addAlert = (alert: Omit<CommunityAlert, 'id' | 'timestamp' | 'verified'>) => {
    const newAlert: CommunityAlert = {
      ...alert,
      id: 'alt-' + Date.now(),
      timestamp: 'À l\'instant',
      verified: userRole === 'admin' || userRole === 'moderator'
    };
    setAlerts(prev => [newAlert, ...prev]);
    addPoints(25);
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const verifyAlert = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, verified: true } : a)));
  };

  const addPost = (content: string, location?: string, photo?: string, tag?: string) => {
    const authorName = currentUser?.name || (userRole === 'admin' ? 'Papa Administrateur' : 'Membre Martinique');
    const newPost: SocialPost = {
      id: 'post-' + Date.now(),
      author: {
        name: authorName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        badge: userRole === 'admin' ? 'Admin Officiel 👑' : 'Explorateur 🧭',
        isLocal: true
      },
      timestamp: 'À l\'instant',
      content,
      location: location || 'Martinique',
      photos: photo ? [photo] : undefined,
      likes: 1,
      commentsCount: 0,
      tags: tag ? [tag] : ['#MartiniqueExplorer', '#Madinina'],
      category: 'plage'
    };
    setPosts(prev => [newPost, ...prev]);
    addPoints(20);
  };

  const likePost = (id: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
    addPoints(5);
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const addForumTopic = (title: string, category: any, excerpt: string) => {
    const topic: ForumTopic = {
      id: 'f-' + Date.now(),
      title,
      category,
      excerpt,
      author: {
        name: currentUser?.name || 'Membre Connecté',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        badge: 'Explorateur 🧭'
      },
      createdAt: 'À l\'instant',
      repliesCount: 0,
      views: 1,
      solved: false
    };
    setForumTopics(prev => [topic, ...prev]);
    addPoints(15);
  };

  const addToItinerary = (dayNumber: number, place: PlaceItem) => {
    setItinerary(prev => {
      const exists = prev.find(d => d.dayNumber === dayNumber);
      if (exists) {
        if (exists.places.some(p => p.id === place.id)) return prev;
        return prev.map(d =>
          d.dayNumber === dayNumber ? { ...d, places: [...d.places, place] } : d
        );
      } else {
        return [
          ...prev,
          {
            dayNumber,
            title: `Jour ${dayNumber} : Découverte`,
            places: [place]
          }
        ];
      }
    });
    addPoints(10);
  };

  const removeFromItinerary = (dayNumber: number, placeId: string) => {
    setItinerary(prev =>
      prev.map(d =>
        d.dayNumber === dayNumber
          ? { ...d, places: d.places.filter(p => p.id !== placeId) }
          : d
      )
    );
  };

  const openModal = (type: string, data?: any) => {
    setActiveModal({ type, data });
  };

  const closeModal = () => {
    setActiveModal({ type: null });
  };

  return (
    <AppContext.Provider
      value={{
        places,
        addPlace,
        updatePlace,
        deletePlace,
        alerts,
        addAlert,
        deleteAlert,
        verifyAlert,
        posts,
        addPost,
        likePost,
        deletePost,
        forumTopics,
        addForumTopic,
        favorites,
        toggleFavorite,
        itinerary,
        addToItinerary,
        removeFromItinerary,
        isSupabaseReady,
        currentUser,
        login,
        signup,
        logout,
        updateUserProfile,
        userRole,
        setUserRole,
        language,
        setLanguage,
        userPoints,
        addPoints,
        badges,
        currentLevel,
        nextLevel,
        levelProgress,
        xpBreakdown,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activeModal,
        openModal,
        closeModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
