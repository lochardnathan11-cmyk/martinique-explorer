'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function AdBanner() {
  return (
    <section className="bg-sand-light rounded-3xl border border-sand-border p-8 sm:p-12 shadow-soft">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-semibold tracking-wider uppercase text-coral">
            Services partenaires
          </span>
          <h3 className="text-2xl font-semibold text-deep tracking-tight">
            Séjours & mobilités en Martinique
          </h3>
          <p className="text-sm text-ink-muted leading-relaxed">
            Hébergements sélectionnés en bord de mer, location de voiture à l&apos;arrivée à l&apos;aéroport Aimé Césaire et sorties en mer avec réservation sereine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <a
            href="https://booking.com"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-2xl bg-action hover:bg-action-hover text-white text-xs sm:text-sm font-medium transition-colors shadow-soft inline-flex items-center gap-1.5"
          >
            <span>Hébergements partenaires</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <a
            href="https://rentalcars.com"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-2xl bg-white hover:bg-lagon-bg text-deep text-xs sm:text-sm font-medium border border-lagon-border transition-colors inline-flex items-center gap-1.5"
          >
            <span>Location de véhicule</span>
          </a>
        </div>
      </div>
    </section>
  );
}
