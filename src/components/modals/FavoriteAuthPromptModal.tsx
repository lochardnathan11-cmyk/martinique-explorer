'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Heart, X, Sparkles, ArrowRight, User } from 'lucide-react';

export default function FavoriteAuthPromptModal() {
  const { closeModal, openModal } = useApp();
  const router = useRouter();

  const handleOpenLogin = () => {
    closeModal();
    openModal('auth');
  };

  const handleOpenSignup = () => {
    closeModal();
    router.push('/inscription');
  };

  return (
    <div className="fixed inset-0 z-[2500] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative bg-white w-full max-w-[410px] rounded-3xl border border-stone-200/90 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 animate-slideUp text-left">
        {/* Liseré supérieur décoratif */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-400 to-teal-700" />

        {/* Bouton fermer */}
        <button
          type="button"
          onClick={closeModal}
          className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer absolute top-4 right-4"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* En-tête avec Cœur */}
        <div className="flex items-start gap-3.5 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/70 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Heart className="w-6 h-6 fill-rose-500 text-rose-500 animate-pulse" />
          </div>
          <div className="space-y-1 min-w-0 pr-6">
            <span className="text-[10px] font-bold tracking-wider uppercase text-rose-700 block">
              Enregistrer vos favoris
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Connectez-vous pour sauvegarder ce lieu
            </h3>
          </div>
        </div>

        {/* Explication */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Pour enregistrer vos plages et spots coup de cœur, retrouver votre sélection sur tous vos appareils et gagner vos premiers points d&apos;exploration, connectez-vous ou créez votre compte gratuit.
        </p>

        {/* Avantages immédiats */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-teal-700 font-bold">✓</span>
            <span>Retrouvez votre sélection sur mobile et ordinateur</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-teal-700 font-bold">✓</span>
            <span>Gagnez <strong>+15 XP</strong> par lieu favori enregistré</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-teal-700 font-bold">✓</span>
            <span>Débloquez les 6 Sceaux d&apos;exploration de l&apos;île</span>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleOpenSignup}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Créer un compte gratuit (+30 XP)</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>

          <button
            type="button"
            onClick={handleOpenLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4 text-slate-500" />
            <span>J&apos;ai déjà un compte · Se connecter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
