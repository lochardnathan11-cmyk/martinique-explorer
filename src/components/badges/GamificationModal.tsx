'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { X, Award, Check } from 'lucide-react';

export default function GamificationModal() {
  const { closeModal, userPoints, badges } = useApp();

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-deep/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-4xl border border-lagon-border shadow-modal overflow-hidden p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold tracking-wider uppercase text-coral">
              Reconnaissance locale
            </span>
            <h3 className="text-xl font-semibold text-deep">
              Badges & Contributions
            </h3>
            <p className="text-xs text-ink-muted">
              Valorisation des partages d&apos;observations et conseils d&apos;habitants.
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="w-9 h-9 rounded-full bg-lagon-bg text-ink-muted hover:text-deep flex items-center justify-center transition-colors"
            aria-label="Fermer le modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User XP Score */}
        <div className="p-5 rounded-2xl bg-lagon-bg border border-lagon-border flex items-center justify-between">
          <div>
            <span className="text-xs text-ink-muted">Points d&apos;expérience accumulés</span>
            <div className="text-2xl font-semibold text-deep mt-0.5">{userPoints} pts</div>
          </div>
          <span className="px-3 py-1 rounded-full bg-white text-xs font-medium text-action border border-lagon-border">
            Guide Actif
          </span>
        </div>

        {/* Badges Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Badges de la communauté
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map(b => (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border transition-colors flex items-start gap-3 ${
                  b.unlocked
                    ? 'bg-white border-lagon-border shadow-soft'
                    : 'bg-lagon-bg/40 border-lagon-border/60 opacity-60'
                }`}
              >
                <div className="text-2xl shrink-0">{b.icon}</div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-deep text-xs">{b.name}</h5>
                    {b.unlocked && <Check className="w-3.5 h-3.5 text-action" />}
                  </div>
                  <p className="text-[11px] text-ink-muted leading-tight">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
