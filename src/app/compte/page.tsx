'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Heart, 
  Award, 
  MapPin, 
  Shield, 
  LogOut, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  ExternalLink,
  Edit3,
  Sparkles,
  Compass,
  Star,
  Loader2
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import LogoIcon from '@/components/ui/LogoIcon';

export default function UserAccountPage() {
  const router = useRouter();
  const { 
    currentUser, 
    userRole, 
    updateUserProfile, 
    logout, 
    favorites, 
    toggleFavorite, 
    places, 
    userPoints, 
    badges 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'badges'>('favorites');
  const [nameInput, setNameInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Synchroniser le formulaire avec currentUser
  useEffect(() => {
    if (currentUser) {
      setNameInput(currentUser.name || '');
    }
  }, [currentUser]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 4000);
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    setIsSaving(true);
    try {
      const res = await updateUserProfile(nameInput.trim());
      if (res.success) {
        showSuccess('Vos informations ont été mises à jour avec succès !');
      } else {
        showError(res.error || 'Erreur lors de la mise à jour.');
      }
    } catch (err: any) {
      showError(err.message || 'Une erreur est survenue.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Petit délai visuel pour voir le bouton charger
    await new Promise(r => setTimeout(r, 600));
    await logout();
    router.push('/');
  };

  // Récupérer les objets complets des lieux favoris
  const favoritePlaces = places.filter(place => favorites.includes(place.id));

  // Redirection automatique si déconnecté (par ex via la navbar)
  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-lagon-soft flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-[32px] shadow-card text-center max-w-md w-full border border-slate-100 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-action mx-auto" />
          <h1 className="text-xl font-bold text-deep">Redirection en cours...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lagon-soft text-ink pb-24">
      {/* Toast Notifications */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl bg-emerald-600 text-white border border-emerald-500 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl bg-rose-600 text-white border border-rose-500 flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{errorMsg}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-lagon-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer" title="Retour à l'accueil">
              <div className="transition-transform duration-300 group-hover:scale-105 shrink-0 shadow-sm rounded-[14px]">
                <LogoIcon className="w-10 h-10" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg sm:text-xl font-semibold tracking-tight text-deep">
                  Martinique <span className="font-light text-action">Explorer</span>
                </span>
              </div>
            </Link>

            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            {/* Back Button */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-ink-muted hover:text-deep transition-all border border-slate-200 shadow-sm text-sm font-semibold"
              title="Retour au site"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au site
            </Link>
            {/* Mobile Back Button (Icon only) */}
            <Link
              href="/"
              className="sm:hidden w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-ink-muted hover:text-deep transition-all border border-slate-200 shadow-sm"
              title="Retour au site"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {userRole === 'admin' && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-xl font-bold text-xs sm:text-sm transition-all border border-amber-200 shadow-sm"
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Administration</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-ink-muted hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-xl font-bold text-xs sm:text-sm transition-all border border-slate-200 shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                  <span className="hidden sm:inline text-rose-500">Déconnexion...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
        
        {/* Premium Profile Card Banner */}
        <div className="relative bg-white rounded-[32px] border border-slate-100 shadow-card overflow-hidden">
          {/* Decorative background gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-action/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-coral/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          
          <div className="relative p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            
            {/* User Info */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-action to-lagon text-white flex items-center justify-center text-4xl font-black shadow-lg shadow-action/20 shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                {userPoints >= 50 && (
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-white border border-slate-100 shadow-md flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-500" />
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <h2 className="text-3xl font-bold text-deep tracking-tight">{currentUser.name}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-ink-muted">{currentUser.email}</p>
                  <span className="text-slate-300">•</span>
                  {userRole === 'admin' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      <Shield className="w-3.5 h-3.5 text-amber-600" /> Administrateur
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Membre
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center bg-slate-50/80 backdrop-blur-sm p-2 rounded-3xl border border-slate-200 self-stretch md:self-auto min-w-[280px]">
              <div className="flex-1 flex flex-col items-center justify-center py-3 px-2 relative group cursor-pointer" onClick={() => setActiveTab('badges')}>
                <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1 group-hover:text-action transition-colors">Points XP</div>
                <div className="text-3xl font-black text-action flex items-center justify-center gap-1.5">
                  {userPoints}
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div className="flex-1 flex flex-col items-center justify-center py-3 px-2 relative group cursor-pointer" onClick={() => setActiveTab('favorites')}>
                <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1 group-hover:text-rose-500 transition-colors">Favoris</div>
                <div className="text-3xl font-black text-deep flex items-center justify-center gap-1.5">
                  {favoritePlaces.length}
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Segmented Tab Navigation */}
        <div className="flex p-1.5 bg-slate-100/80 border border-slate-200/50 rounded-2xl max-w-fit overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-white text-action shadow-sm border border-slate-200/50'
                : 'text-ink-muted hover:text-deep hover:bg-white/50'
            }`}
          >
            <Heart className={`w-4 h-4 ${activeTab === 'favorites' ? 'fill-action text-action' : ''}`} />
            <span>Mes Favoris ({favoritePlaces.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-action shadow-sm border border-slate-200/50'
                : 'text-ink-muted hover:text-deep hover:bg-white/50'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Mon Profil</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-white text-action shadow-sm border border-slate-200/50'
                : 'text-ink-muted hover:text-deep hover:bg-white/50'
            }`}
          >
            <Award className={`w-4 h-4 ${activeTab === 'badges' ? 'text-amber-500' : ''}`} />
            <span>Progression & Badges</span>
          </button>
        </div>

        {/* TAB 1: FAVORITES */}
        {activeTab === 'favorites' && (
          <div className="space-y-6 animate-fadeIn">
            {favoritePlaces.length === 0 ? (
              <div className="bg-white rounded-[32px] border border-slate-100 p-12 text-center max-w-lg mx-auto space-y-5 shadow-sm">
                <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
                  <Heart className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-deep">Aucun lieu favori pour l'instant</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    Explorez la carte et cliquez sur le petit cœur des plages et activités pour les retrouver ici en un clin d'œil.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/carte"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-action text-white font-bold rounded-2xl hover:bg-action-hover transition-all text-sm shadow-lg shadow-action/30 hover:shadow-xl hover:shadow-action/40"
                  >
                    <Compass className="w-5 h-5" /> Explorer la Martinique
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritePlaces.map(place => (
                  <div key={place.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-card hover:shadow-lg transition-all flex flex-col group">
                    <div className="h-48 relative overflow-hidden bg-slate-100">
                      <img 
                        src={place.photos[0] || '/images/spots/salines.jpg'} 
                        alt={place.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <button
                        onClick={() => toggleFavorite(place.id)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center text-rose-500 hover:scale-110 hover:bg-white transition-all cursor-pointer"
                        title="Retirer des favoris"
                      >
                        <Heart className="w-5 h-5 fill-rose-500" />
                      </button>
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        <span className="bg-white/95 backdrop-blur-md text-deep text-[10px] uppercase tracking-wider font-bold px-2.5 py-1.5 rounded-xl shadow-sm">
                          {place.category}
                        </span>
                        {place.rating && (
                          <span className="bg-amber-400 text-amber-950 text-[10px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
                            <Star className="w-3 h-3 fill-amber-950" /> {place.rating}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                      <div>
                        <h4 className="font-bold text-deep text-lg leading-tight mb-1.5">{place.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                          <MapPin className="w-3.5 h-3.5 text-action" />
                          {place.commune}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                        <Link
                          href={`/lieux/${place.slug || place.id}`}
                          className="py-2.5 px-3 rounded-xl bg-lagon-border hover:bg-action text-action hover:text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Voir la fiche
                        </Link>
                        <button
                          onClick={() => toggleFavorite(place.id)}
                          className="py-2.5 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all text-center border border-slate-200 hover:border-rose-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Retirer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE EDIT */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 sm:p-10 shadow-card max-w-2xl animate-fadeIn">
            <div className="space-y-2 mb-8 pb-6 border-b border-slate-100">
              <h3 className="text-2xl font-bold text-deep tracking-tight">Modifier mes informations</h3>
              <p className="text-sm text-ink-muted">Gérez votre identité publique et vos préférences de compte.</p>
            </div>

            <form onSubmit={handleUpdateName} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-deep uppercase tracking-wider pl-1">Prénom & Nom</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-deep focus:bg-white focus:outline-none focus:border-action focus:ring-4 focus:ring-action/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-deep uppercase tracking-wider pl-1">Adresse email</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-100 text-sm font-medium text-ink-muted cursor-not-allowed opacity-80"
                />
                <p className="text-[11px] text-ink-muted pl-1">
                  L'adresse email est liée à votre compte sécurisé et ne peut être modifiée ici.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3.5 bg-action hover:bg-action-hover text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-action/30 hover:shadow-xl flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: BADGES & GAMIFICATION */}
        {activeTab === 'badges' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-[32px] border border-slate-100 p-6 sm:p-10 shadow-card">
              <div className="space-y-2 mb-8">
                <h3 className="text-2xl font-bold text-deep tracking-tight">Vos Badges & Progression</h3>
                <p className="text-sm text-ink-muted">
                  Gagnez de l'expérience (XP) en partageant des alertes, en participant à la communauté et en enregistrant vos lieux favoris.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    className={`p-6 rounded-3xl border transition-all flex items-start gap-4 ${
                      badge.unlocked
                        ? 'bg-gradient-to-br from-white to-action/5 border-action/20 shadow-md shadow-action/5'
                        : 'bg-slate-50/50 border-slate-200 opacity-70 grayscale-[30%]'
                    }`}
                  >
                    <div className={`text-4xl shrink-0 p-3 rounded-2xl shadow-sm border ${badge.unlocked ? 'bg-white border-action/20' : 'bg-slate-100 border-slate-200'}`}>
                      {badge.icon}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-deep text-sm leading-tight">{badge.name}</h4>
                        {badge.unlocked && (
                          <span className="text-[9px] uppercase tracking-wider bg-action/10 text-action font-bold px-2 py-0.5 rounded-full shrink-0">
                            Acquis
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-ink-muted leading-relaxed line-clamp-2">{badge.description}</p>
                      
                      {/* Progress bar visual for locked badges */}
                      {!badge.unlocked && (
                        <div className="pt-2">
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span className="text-ink-muted">Progression</span>
                            <span className="text-action">{Math.min(userPoints, badge.requiredPoints)} / {badge.requiredPoints} XP</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-action rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(100, (userPoints / badge.requiredPoints) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {badge.unlocked && (
                        <div className="text-[10px] uppercase tracking-wider font-bold text-action pt-1">
                          Palier : {badge.requiredPoints} XP
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
