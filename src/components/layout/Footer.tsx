'use client';

import React from 'react';

export default function Footer({ onNavigate }: { onNavigate: (section: string) => void }) {
  return (
    <footer className="bg-deep text-white border-t border-deep/60 mt-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Presentation */}
          <div className="space-y-3 md:col-span-1">
            <span className="text-xl font-semibold tracking-tight text-white block">
              Martinique <span className="text-lagon-light font-light">Explorer</span>
            </span>
            <p className="text-xs text-white/70 leading-relaxed">
              Plateforme communautaire et guide touristique indépendant pour apprécier l&apos;île aux fleurs avec respect, calme et authenticité.
            </p>
            <div className="text-[11px] text-lagon-light font-mono pt-1">
              martinique-explorer.com
            </div>
          </div>

          {/* Column: Découverte */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-lagon-light">
              Découverte
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button onClick={() => onNavigate('beaches')} className="hover:text-white transition-colors">
                  Plages & Anses du Sud
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('snorkeling')} className="hover:text-white transition-colors">
                  Spots de tortues & coraux
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('activities')} className="hover:text-white transition-colors">
                  Randonnées & Baignoires blanches
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('restaurants')} className="hover:text-white transition-colors">
                  Gastronomie créole
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Communauté */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-lagon-light">
              Communauté
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button onClick={() => onNavigate('community')} className="hover:text-white transition-colors">
                  Partages & publications
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('forum')} className="hover:text-white transition-colors">
                  Questions & retours d&apos;expérience
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-white transition-colors">
                  Carte interactive de l&apos;île
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Espace Échange */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-lagon-light">
              Espace dédié
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Professionnels du tourisme, restaurateurs et guides locaux : bénéficiez d&apos;une visibilité directe auprès des voyageurs.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('admin')}
                className="text-xs px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-colors"
              >
                Accès espace gestion
              </button>
            </div>
          </div>
        </div>

        {/* Legal Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© 2026 Martinique Explorer — Pensé pour la Martinique</p>
          <div className="flex items-center gap-6">
            <span>Données en temps réel</span>
            <span>Éco-responsabilité</span>
            <span>RGPD & Confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
