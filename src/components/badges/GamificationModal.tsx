'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { X, Award, Check, Compass, ArrowRight } from 'lucide-react';

export default function GamificationModal() {
  const { closeModal, userPoints, badges, currentLevel, nextLevel, levelProgress } = useApp();

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-stone-200/90 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-teal-900">
              Niveaux & Badges d&apos;Exploration
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Votre progression d&apos;Explorateur
            </h3>
            <p className="text-xs text-slate-500">
              Vos découvertes, vos signalements météo et vos favoris font grandir votre profil et vos récompenses.
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="w-9 h-9 rounded-full bg-stone-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fermer le modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User XP Score & Level Card */}
        <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentLevel.icon}</span>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Niveau {currentLevel.level}
                </span>
                <span className="text-sm font-bold text-slate-900">{currentLevel.name}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-teal-900 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/70">
                {userPoints} XP
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="h-1.5 w-full rounded-full bg-stone-200/90 overflow-hidden">
              <div
                className="h-full rounded-full bg-teal-700 transition-all duration-500"
                style={{ width: `${Math.max(6, levelProgress)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{levelProgress}% vers le niveau supérieur</span>
              <span>{nextLevel ? `${userPoints} / ${nextLevel.minXP} XP` : 'Rang Max'}</span>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Les Badges d&apos;Exploration
            </h4>
            <span className="text-xs font-semibold text-teal-900">
              {badges.filter(b => b.unlocked).length} / {badges.length} débloqués
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
            {badges.map(b => (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border transition-colors flex items-start gap-3 ${
                  b.unlocked
                    ? 'bg-white border-teal-200 shadow-2xs'
                    : 'bg-[#FAF8F5] border-stone-200/70 opacity-80'
                }`}
              >
                <div className="text-2xl shrink-0">{b.icon}</div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className="font-bold text-slate-900 text-xs truncate">{b.name}</h5>
                    {b.unlocked ? (
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">
                        ✓ Débloqué
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-medium">
                        {b.currentCount}/{b.targetCount}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight">
                    {b.howToEarn || b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Link to full Account Badges page */}
        <div className="pt-2 border-t border-stone-200/80 flex items-center justify-end">
          <Link
            href="/compte"
            onClick={closeModal}
            className="text-xs font-semibold text-teal-800 hover:text-teal-900 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Accéder à mon compte</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
