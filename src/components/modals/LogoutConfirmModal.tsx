'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { LogOut, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutConfirmModal() {
  const { closeModal, logout, currentUser } = useApp();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  if (!currentUser) return null;

  const handleConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      closeModal();
      router.push('/');
    } catch {
      setIsLoggingOut(false);
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-[2500] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xl max-w-sm w-full overflow-hidden text-left animate-slideUp">
        {/* En-tête */}
        <div className="px-6 py-5 bg-[#FAF8F5] border-b border-stone-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Se déconnecter ?
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[180px]">
                {currentUser.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeModal}
            disabled={isLoggingOut}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corps */}
        <div className="p-6 space-y-5">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Êtes-vous sûr de vouloir vous déconnecter ? Vos lieux favoris, vos points d’exploration et votre carnet de voyage restent sauvegardés pour votre prochaine visite.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={closeModal}
              disabled={isLoggingOut}
              className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoggingOut}
              className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Déconnexion...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Me déconnecter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
