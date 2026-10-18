'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Heart,
  Settings,
  MapPin,
  Star,
  ExternalLink,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Shield,
  LogOut,
  Compass,
  Mail,
  Lock
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import LogoIcon from '@/components/ui/LogoIcon';
import { MARTINIQUE_COMMUNES } from '@/data/communes';

type AccountTab = 'favorites' | 'settings';

interface UserPreferences {
  travelerType: 'Voyageur en séjour' | 'Habitant de Martinique' | 'Futur résident';
  baseCommune: string;
}

const DEFAULT_PREFS: UserPreferences = {
  travelerType: 'Voyageur en séjour',
  baseCommune: 'Sainte-Luce'
};

const CATEGORY_NAMES: Record<string, string> = {
  beach: 'Plage',
  snorkeling: 'Snorkeling',
  activity: 'Activité',
  hiking: 'Randonnée',
  excursion: 'Sortie en mer',
  restaurant: 'Restaurant',
  accommodation: 'Hébergement',
  bar: 'Bar',
  hidden_gem: 'Crique secrète'
};

export default function UserAccountPage() {
  const router = useRouter();
  const {
    currentUser,
    userRole,
    login,
    signup,
    updateUserProfile,
    logout,
    favorites,
    toggleFavorite,
    places,
    language,
    setLanguage
  } = useApp();

  const [activeTab, setActiveTab] = useState<AccountTab>('favorites');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Auth form states (when visitor is not logged in)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Profile preferences
  const [nameInput, setNameInput] = useState('');
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (currentUser) {
      setNameInput(currentUser.name || '');
    }
    try {
      const savedPrefs = localStorage.getItem('mq_account_prefs');
      if (savedPrefs) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(savedPrefs) });
    } catch {
      // Ignore in SSR
    }
  }, [currentUser]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const res = await login(authEmail, authPassword || undefined);
        if (res.success) {
          showToast('Connexion réussie.');
        } else {
          showToast(res.error || 'Identifiants incorrects.', 'error');
        }
      } else {
        const res = await signup(authName || 'Voyageur', authEmail, authPassword || undefined);
        if (res.success) {
          showToast('Compte créé avec succès.');
        } else {
          showToast(res.error || 'Erreur lors de la création.', 'error');
        }
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setIsSaving(true);
    try {
      const res = await updateUserProfile(nameInput.trim());
      try {
        localStorage.setItem('mq_account_prefs', JSON.stringify(prefs));
      } catch {
        // ignore
      }
      if (res.success) {
        showToast('Profil mis à jour.');
      } else {
        showToast(res.error || 'Erreur lors de la sauvegarde.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Lieux favoris filtrés
  const favoritePlaces = places.filter(p => favorites.includes(p.id));
  const filteredFavorites = favoritePlaces.filter(p => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'beach') return p.category === 'beach' || p.category === 'hidden_gem';
    if (categoryFilter === 'snorkeling') return p.category === 'snorkeling';
    if (categoryFilter === 'nature') return p.category === 'hiking' || p.category === 'activity' || p.category === 'excursion';
    if (categoryFilter === 'food') return p.category === 'restaurant' || p.category === 'bar' || p.category === 'accommodation';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      {/* Toast de notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-xs sm:text-sm font-medium flex items-center gap-2.5 transition-all ${
            toastMessage.type === 'error' ? 'bg-rose-700' : 'bg-teal-800'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-200" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-200" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Barre supérieure épurée */}
      <header className="bg-white border-b border-stone-200/90 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <LogoIcon className="w-7 h-7 rounded-lg" />
              <span className="font-bold text-slate-900 text-sm hidden sm:inline">
                Martinique <span className="font-normal text-teal-700">Explorer</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            {userRole === 'admin' && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Administration</span>
              </Link>
            )}
            {currentUser && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6 text-left">
        {/* NON CONNECTÉ : Formulaire direct et simple */}
        {!currentUser ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-xs my-8">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mx-auto border border-teal-200/60">
                <User className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                Mon Espace Membre
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connectez-vous pour retrouver vos plages et adresses favorites en Martinique.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`py-2 rounded-lg transition-colors cursor-pointer ${
                  authMode === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`py-2 rounded-lg transition-colors cursor-pointer ${
                  authMode === 'signup' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Nouveau compte
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Prénom & Nom</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    placeholder="Ex: Sophie Martin"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-700"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Adresse email
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-700"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {authLoading ? 'Chargement...' : authMode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => login('voyageur@martinique-explorer.com')}
                className="text-xs text-teal-800 hover:text-teal-900 font-semibold underline cursor-pointer"
              >
                Continuer sans mot de passe (mode visiteur)
              </button>
            </div>
          </div>
        ) : (
          /* CONNECTÉ : Interface soignée, claire et simple */
          <>
            {/* 1. Carte de profil principale */}
            <section className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-800 text-white flex items-center justify-center text-xl sm:text-2xl font-bold shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {currentUser.name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/70">
                      {userRole === 'admin' ? 'Administrateur' : prefs.travelerType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {currentUser.email} · Secteur d’attache :{' '}
                    <span className="font-semibold text-slate-700">{prefs.baseCommune}</span>
                  </p>
                </div>
              </div>

              {/* Compteur Favoris */}
              <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-stone-100 pt-3 sm:pt-0 sm:pl-6 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('favorites')}
                  className="text-left cursor-pointer group"
                >
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                    Lieux favoris
                  </span>
                  <span className="text-xl font-bold text-slate-900 group-hover:text-teal-700">
                    {favoritePlaces.length}
                  </span>
                </button>
              </div>
            </section>

            {/* 2. Navigation par onglets (2 onglets clairs : Favoris & Profil) */}
            <div className="flex items-center gap-2 border-b border-stone-200/90 overflow-x-auto no-scrollbar">
              {[
                { id: 'favorites', label: `Mes Favoris (${favoritePlaces.length})`, icon: Heart },
                { id: 'settings', label: 'Profil & Préférences', icon: Settings }
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as AccountTab)}
                    className={`inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer -mb-px ${
                      active
                        ? 'border-teal-700 text-teal-800'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* =======================================================
                ONGLET 1 : MES FAVORIS
                ======================================================= */}
            {activeTab === 'favorites' && (
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Mes lieux favoris
                    </h2>
                    <p className="text-xs text-slate-500">
                      Vos plages, spots de snorkeling et adresses enregistrées en Martinique.
                    </p>
                  </div>

                  {/* Filtres par type */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: 'Tous' },
                      { id: 'beach', label: 'Plages' },
                      { id: 'snorkeling', label: 'Snorkeling' },
                      { id: 'nature', label: 'Randos & Mer' },
                      { id: 'food', label: 'Tables & Hôtels' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryFilter(cat.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          categoryFilter === cat.id
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-stone-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredFavorites.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-stone-200/90 p-8 text-center max-w-md mx-auto space-y-3">
                    <Heart className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-900">
                      Aucun lieu dans cette catégorie
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Cliquez sur le petit cœur d’une plage ou d’une expérience pour la retrouver ici.
                    </p>
                    <Link
                      href="/?page=beaches"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-800 text-white text-xs font-semibold rounded-xl hover:bg-teal-900 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Découvrir les plages</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredFavorites.map(place => (
                      <div
                        key={place.id}
                        className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col justify-between hover:shadow-xs transition-shadow"
                      >
                        <div>
                          <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                            <img
                              src={place.photos[0] || '/images/spots/salines.jpg'}
                              alt={place.name}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/95 text-slate-800 text-[10px] font-bold">
                              {CATEGORY_NAMES[place.category] || place.category}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleFavorite(place.id)}
                              title="Retirer des favoris"
                              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-rose-500 flex items-center justify-center cursor-pointer shadow-2xs"
                            >
                              <Heart className="w-3.5 h-3.5 fill-rose-500" />
                            </button>
                          </div>

                          <div className="p-4 space-y-1.5">
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span className="inline-flex items-center gap-1 text-teal-700 font-medium">
                                <MapPin className="w-3 h-3" />
                                {place.commune}
                              </span>
                              {place.rating && (
                                <span className="inline-flex items-center gap-0.5 font-bold text-slate-900">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {place.rating}
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                              {place.name}
                            </h3>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {place.description}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 pt-2 border-t border-stone-100 grid grid-cols-2 gap-2">
                          <Link
                            href={`/?page=lieu&id=${place.id}`}
                            className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center inline-flex items-center justify-center gap-1 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Voir la fiche</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleFavorite(place.id)}
                            className="py-1.5 px-3 rounded-lg border border-stone-200 text-slate-600 hover:text-rose-700 hover:border-rose-200 text-xs font-medium inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Retirer</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* =======================================================
                ONGLET 2 : PROFIL & PRÉFÉRENCES
                ======================================================= */}
            {activeTab === 'settings' && (
              <section className="bg-white rounded-2xl border border-stone-200/90 p-6 space-y-6 max-w-2xl">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Mes informations & préférences
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ces repères personnalisent votre expérience sur Martinique Explorer.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Prénom & Nom</label>
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Adresse email</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Votre profil</label>
                      <select
                        value={prefs.travelerType}
                        onChange={e =>
                          setPrefs(prev => ({
                            ...prev,
                            travelerType: e.target.value as UserPreferences['travelerType']
                          }))
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                      >
                        <option value="Voyageur en séjour">Voyageur en séjour</option>
                        <option value="Habitant de Martinique">Habitant de Martinique</option>
                        <option value="Futur résident">Futur résident</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Commune d’attache
                      </label>
                      <select
                        value={prefs.baseCommune}
                        onChange={e =>
                          setPrefs(prev => ({ ...prev, baseCommune: e.target.value }))
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                      >
                        {MARTINIQUE_COMMUNES.map(c => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700">Langue :</span>
                      <button
                        type="button"
                        onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                        className="px-2.5 py-1 rounded-md border border-stone-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        {language === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Session active sur cet appareil</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer inline-flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
