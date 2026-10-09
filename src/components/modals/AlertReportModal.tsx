'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Check } from 'lucide-react';

export default function AlertReportModal() {
  const { closeModal, addAlert } = useApp();
  const [type, setType] = useState<'sargasses' | 'meduses' | 'houle' | 'plage_fermee' | 'embouteillage' | 'info'>('sargasses');
  const [location, setLocation] = useState('');
  const [commune, setCommune] = useState('Le François');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    addAlert({
      type,
      location,
      commune,
      title,
      description,
      reportedBy: 'Membre résident',
      severity: 'warning',
    });

    setSuccess(true);
    setTimeout(() => {
      closeModal();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-deep/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-4xl border border-lagon-border shadow-modal overflow-hidden p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold tracking-wider uppercase text-coral">
              Signalement communautaire
            </span>
            <h3 className="text-xl font-semibold text-deep">
              Partager une observation en direct
            </h3>
            <p className="text-xs text-ink-muted">
              Aidez les autres voyageurs et habitants à adapter leurs sorties en mer.
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

        {success ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-lagon-bg text-action flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-deep text-base">Signalement enregistré</h4>
            <p className="text-xs text-ink-muted">Merci pour votre contribution à la communauté.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-deep mb-1.5">Nature de l&apos;observation</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full text-sm p-3 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:outline-none"
              >
                <option value="sargasses">Arrivage de sargasses</option>
                <option value="meduses">Présence de méduses</option>
                <option value="houle">Forte houle ou rouleaux</option>
                <option value="embouteillage">Ralentissement routier</option>
                <option value="info">Conditions calmes & observation de tortues</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-deep mb-1.5">Commune</label>
                <input
                  type="text"
                  value={commune}
                  onChange={e => setCommune(e.target.value)}
                  placeholder="Ex : Le Diamant"
                  className="w-full text-sm p-3 rounded-2xl border border-lagon-border text-ink focus:border-action focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-deep mb-1.5">Plage / Secteur</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Ex : Anse Cafard"
                  className="w-full text-sm p-3 rounded-2xl border border-lagon-border text-ink focus:border-action focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep mb-1.5">Titre de votre remarque</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex : Nappe d'algues sur le côté droit de l'anse"
                className="w-full text-sm p-3 rounded-2xl border border-lagon-border text-ink focus:border-action focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep mb-1.5">Détails complémentaires</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Précisez la zone praticable ou les conseils pour la baignade..."
                className="w-full text-sm p-3 rounded-2xl border border-lagon-border text-ink focus:border-action focus:outline-none resize-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-lagon-border">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2.5 rounded-xl text-xs text-ink-muted hover:text-ink transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-action hover:bg-action-hover text-white text-xs sm:text-sm font-medium transition-colors shadow-soft"
              >
                Transmettre l&apos;observation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
