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
  Star
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

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
    await logout();
    router.push('/');
  };

  // Récupérer les objets complets des lieux favoris
  const favoritePlaces = places.filter(place => favorites.includes(place.id));

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F2FCFC] flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-4xl shadow-xl text-center max-w-md w-full border border-[#DCECEF] space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#BFEFF2]/50 text-[#087E8B] mx-auto flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#073B4C]">Espace Membre</h1>
          <p className="text-sm text-[#6E858A]">
            Connectez-vous pour retrouver vos coups de cœur, gérer vos favoris et accéder à votre profil.
          </p>
          <div className="pt-2">
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-[#087E8B] text-white rounded-2xl font-bold hover:bg-[#087E8B]/90 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil pour se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2FCFC] text-[#17343D] pb-24">
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
      <header className="bg-white border-b border-[#DCECEF] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-2xl bg-[#F2FCFC] hover:bg-[#DCECEF] flex items-center justify-center text-[#073B4C] transition-colors border border-[#DCECEF]"
              title="Retour au site"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold text-[#073B4C] leading-none">Mon Espace Voyageur</h1>
              <span className="text-xs text-[#6E858A] font-medium">Martinique Explorer</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {userRole === 'admin' && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-xl font-bold text-xs sm:text-sm transition-colors border border-amber-200"
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Administration (Admin)</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F2FCFC] text-[#6E858A] hover:bg-rose-50 hover:text-rose-600 rounded-xl font-bold text-xs sm:text-sm transition-colors border border-[#DCECEF]"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Profile Card Banner */}
        <div className="bg-white rounded-4xl border border-[#DCECEF] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#087E8B] to-[#29C5D4] text-white flex items-center justify-center text-3xl font-black shadow-md shadow-[#087E8B]/20 shrink-0">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-extrabold text-[#073B4C]">{currentUser.name}</h2>
                {userRole === 'admin' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <Shield className="w-3.5 h-3.5 text-amber-600" /> Administrateur
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Membre Résident
                  </span>
                )}
              </div>
              <p className="text-sm text-[#6E858A]">{currentUser.email}</p>
            </div>
          </div>

          {/* Quick Score */}
          <div className="flex items-center gap-4 bg-[#F2FCFC] p-4 rounded-3xl border border-[#DCECEF] self-stretch md:self-auto justify-around">
            <div className="text-center px-4">
              <div className="text-xs font-bold text-[#6E858A] mb-0.5">Points XP</div>
              <div className="text-2xl font-black text-[#087E8B] flex items-center justify-center gap-1">
                <Sparkles className="w-5 h-5 text-amber-400" /> {userPoints}
              </div>
            </div>
            <div className="w-px h-10 bg-[#DCECEF]"></div>
            <div className="text-center px-4">
              <div className="text-xs font-bold text-[#6E858A] mb-0.5">Favoris</div>
              <div className="text-2xl font-black text-[#073B4C] flex items-center justify-center gap-1">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> {favoritePlaces.length}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#DCECEF] pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-[#087E8B] text-white shadow-sm'
                : 'bg-white text-[#6E858A] hover:text-[#073B4C] border border-[#DCECEF]'
            }`}
          >
            <Heart className={`w-4 h-4 ${activeTab === 'favorites' ? 'fill-white' : 'text-rose-500'}`} />
            <span>Mes Lieux Favoris ({favoritePlaces.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#087E8B] text-white shadow-sm'
                : 'bg-white text-[#6E858A] hover:text-[#073B4C] border border-[#DCECEF]'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Modifier mes infos</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-[#087E8B] text-white shadow-sm'
                : 'bg-white text-[#6E858A] hover:text-[#073B4C] border border-[#DCECEF]'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Mes Badges & Progression</span>
          </button>
        </div>

        {/* TAB 1: FAVORITES */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            {favoritePlaces.length === 0 ? (
              <div className="bg-white rounded-4xl border border-[#DCECEF] p-12 text-center max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#073B4C]">Aucun lieu favori pour l'instant</h3>
                <p className="text-sm text-[#6E858A]">
                  Explorez la carte et cliquez sur le petit cœur des plages et activités pour les retrouver ici en un clin d'œil.
                </p>
                <div className="pt-2">
                  <Link
                    href="/carte"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#087E8B] text-white font-bold rounded-2xl hover:bg-[#087E8B]/90 transition-colors text-sm shadow-sm"
                  >
                    <Compass className="w-4 h-4" /> Explorer la Martinique
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritePlaces.map(place => (
                  <div key={place.id} className="bg-white rounded-3xl border border-[#DCECEF] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
                    <div className="h-44 relative overflow-hidden bg-slate-100">
                      <img 
                        src={place.photos[0] || '/images/spots/salines.jpg'} 
                        alt={place.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <button
                        onClick={() => toggleFavorite(place.id)}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-rose-500 hover:scale-110 transition-transform cursor-pointer"
                        title="Retirer des favoris"
                      >
                        <Heart className="w-5 h-5 fill-rose-500" />
                      </button>
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-sm text-[#073B4C] text-[10px] font-bold px-2 py-1 rounded-lg">
                          {place.category}
                        </span>
                        {place.rating && (
                          <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                            <Star className="w-3 h-3 fill-amber-900" /> {place.rating}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-extrabold text-[#073B4C] text-lg leading-tight mb-1">{place.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-[#6E858A]">
                          <MapPin className="w-3.5 h-3.5 text-[#087E8B]" />
                          {place.commune}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#DCECEF]/60">
                        <Link
                          href={`/lieux/${place.slug || place.id}`}
                          className="py-2.5 px-3 rounded-xl bg-[#F2FCFC] hover:bg-[#087E8B] text-[#087E8B] hover:text-white text-xs font-bold transition-colors text-center border border-[#DCECEF] hover:border-[#087E8B] flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Voir la fiche
                        </Link>
                        <button
                          onClick={() => toggleFavorite(place.id)}
                          className="py-2.5 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors text-center border border-rose-200 flex items-center justify-center gap-1.5 cursor-pointer"
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
          <div className="bg-white rounded-4xl border border-[#DCECEF] p-6 sm:p-8 shadow-sm max-w-2xl">
            <div className="space-y-1 mb-6 border-b border-[#DCECEF] pb-4">
              <h3 className="text-xl font-extrabold text-[#073B4C]">Modifier mes informations</h3>
              <p className="text-xs text-[#6E858A]">Gérez votre identité publique et vos préférences de compte.</p>
            </div>

            <form onSubmit={handleUpdateName} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#073B4C]">Prénom & Nom</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#DCECEF] bg-[#F2FCFC]/50 text-sm font-semibold text-[#073B4C] focus:outline-none focus:border-[#087E8B] focus:ring-2 focus:ring-[#087E8B]/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#073B4C]">Adresse email</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-4 py-3 rounded-2xl border border-[#DCECEF] bg-slate-100 text-sm font-medium text-[#6E858A] cursor-not-allowed"
                />
                <span className="text-[11px] text-[#6E858A]">
                  L'adresse email est liée à votre compte Supabase sécurisé.
                </span>
              </div>

              <div className="pt-4 border-t border-[#DCECEF] flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 bg-[#087E8B] hover:bg-[#087E8B]/90 text-white font-bold rounded-2xl text-sm transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: BADGES & GAMIFICATION */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            <div className="bg-white rounded-4xl border border-[#DCECEF] p-6 sm:p-8 shadow-sm">
              <div className="space-y-1 mb-6">
                <h3 className="text-xl font-extrabold text-[#073B4C]">Vos Badges Débloqués</h3>
                <p className="text-xs text-[#6E858A]">
                  Gagnez de l'expérience en partageant des alertes, en participant au forum et en enregistrant vos lieux favoris.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                      badge.unlocked
                        ? 'bg-gradient-to-br from-white to-[#F2FCFC] border-[#087E8B]/30 shadow-xs'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="text-3xl shrink-0 p-2 rounded-2xl bg-white shadow-xs border border-[#DCECEF]">
                      {badge.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#073B4C] text-sm">{badge.name}</h4>
                        {badge.unlocked && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            Acquis
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6E858A] leading-relaxed">{badge.description}</p>
                      <div className="text-[11px] font-bold text-[#087E8B] pt-1">
                        Palier : {badge.requiredPoints} XP
                      </div>
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
